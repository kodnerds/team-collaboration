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
}
