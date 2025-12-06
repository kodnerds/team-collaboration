import { connect } from '../database';
import { TaskEntity } from '../entities';

import type { UserEntity, ProjectEntity, TaskStatus } from '../entities';
import type { Repository } from 'typeorm';

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

  async update(task: Partial<TaskEntity>): Promise<TaskEntity> {
    await this.repository.update(task.id as string, task);
    const updatedTask = await this.findOne(task.id as string);
    if (!updatedTask) {
      throw new Error('Task not found after update');
    }
    return updatedTask;
  }
}
