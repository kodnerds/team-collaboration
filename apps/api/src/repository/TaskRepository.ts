import { In } from 'typeorm';

import { connect } from '../database';
import { TaskEntity , UserEntity } from '../entities';

import type { ProjectEntity, TaskStatus } from '../entities';
import type { Repository, FindOptionsSelect} from 'typeorm';


export class TaskRepository {
  private repository: Repository<TaskEntity>;

  constructor() {
    this.repository = connect(TaskEntity);
  }

  async create(taskData: {
    title: string;
    description?: string;
    status?: TaskStatus;
    project: ProjectEntity;
    createdBy: UserEntity;
  }): Promise<TaskEntity> {
    const task = this.repository.create(taskData);
    return await this.repository.save(task);
  }

  async findOne(id: string): Promise<TaskEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['project', 'createdBy', 'project.createdBy']
    });
  }

  async findAllByProject({
    projectId,
    skip,
    take,
    relations,
    select
  }: {
    projectId: string;
    skip: number;
    take: number;
    relations?: string[];
    select?: FindOptionsSelect<TaskEntity>;
  }): Promise<[TaskEntity[], number]> {
    return await this.repository.findAndCount({
      where: { project: { id: projectId } },
      skip,
      take,
      relations,
      select
    });
  }

  async update(task: Partial<TaskEntity>): Promise<TaskEntity> {
    await this.repository.update(task.id as string, task);
    const updatedTask = await this.findOne(task.id as string);
    if (!updatedTask) {
      throw new Error('Task not found after update');
    }
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async assignUserToTask(taskId: string, userIds: string[]): Promise<TaskEntity> {
    const task = await this.repository.findOne({
      where: { id: taskId },
      relations: ['assignees', 'project', 'createdBy']
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const users = await connect(UserEntity).find({ where: { id: In(userIds) } });
    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    if (!task.assignees) {
      task.assignees = [];
    }

    users.forEach((user) => {
      const isAlreadyAssigned = task.assignees.some((assignee) => assignee.id === user.id);
      if (!isAlreadyAssigned) {
        task.assignees.push(user);
      }
    });

    return await this.repository.save(task);
  }
}
