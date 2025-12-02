import { connect } from '../database';
import { FindOneOptions, Repository } from 'typeorm';
import { TaskEntity } from '../entities/TaskEntity';

export class TaskRepository {
  private repository: Repository<TaskEntity>;

  constructor() {
      this.repository = connect(TaskEntity);
    }

  async create(task: Partial<TaskEntity>) : Promise<TaskEntity> {
    const newTask = this.repository.create(task);
    return await this.repository.save(newTask);
  };

    async findOne(options: FindOneOptions<TaskEntity>): Promise<TaskEntity | null> {
    return await this.repository.findOne(options);
  }
}
