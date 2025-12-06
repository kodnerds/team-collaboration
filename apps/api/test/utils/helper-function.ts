import {
  type UserEntity,
  type ProjectEntity,
  type TaskEntity,
  TaskStatus
} from '../../src/entities';
import { hashPassword } from '../../src/utils/hashPassword';

import type { TestFactory } from '../factory';

type User = { name: string; email: string };

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const defaultTestPassword = 'Test123';

export const createTestUser = async (factory: TestFactory, user: User): Promise<UserEntity> => {
  const hashedPassword = await hashPassword(defaultTestPassword);
  const userRepository = factory._connection.getRepository('UserEntity');
  return await userRepository.save({
    name: user.name,
    email: user.email,
    password: hashedPassword
  } as UserEntity);
};

type ProjectData = {
  name?: string;
  description?: string;
};

export const createTestProject = async (
  factory: TestFactory,
  user: UserEntity,
  data: ProjectData = {}
): Promise<ProjectEntity> => {
  const projectRepository = factory._connection.getRepository('ProjectEntity');
  return await projectRepository.save({
    name: data.name || 'Default Project Name',
    description: data.description || 'Default Project Description',
    createdBy: user
  } as ProjectEntity);
};

type TaskData = {
  title?: string;
  description?: string;
  status?: string;
};

type CreateTaskOptions = {
  user: UserEntity;
  project: ProjectEntity;
} & TaskData;

export const createTestTask = async (
  factory: TestFactory,
  options: CreateTaskOptions
): Promise<TaskEntity> => {
  const { user, project, ...data } = options;
  const taskRepository = factory._connection.getRepository('TaskEntity');
  return await taskRepository.save({
    title: data.title || 'Default Task Title',
    description: data.description || 'Default Task Description',
    status: data.status || TaskStatus.TODO,
    project: project,
    createdBy: user
  } as TaskEntity);
};
