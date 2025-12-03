import { hashPassword } from '../../src/utils/hashPassword';

import type { UserEntity, ProjectEntity } from '../../src/entities';
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
