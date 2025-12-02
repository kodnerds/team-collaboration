import { connect } from '../database';
import { TaskEntity } from '../entities';

import type { ProjectEntity, TaskStatus, UserEntity } from '../entities';
import type { Repository } from 'typeorm';

export class TaskRepository {
  private repository: Repository<TaskEntity>;

  constructor() {
    this.repository = connect(TaskEntity);
  }

  async create(taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    project: ProjectEntity;
    createdBy: UserEntity;
  }): Promise<TaskEntity> {
    const newTask = this.repository.create(taskData);
    return this.repository.save(newTask);
  }
}
