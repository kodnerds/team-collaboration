import { connect } from '../database';
import { ProjectEntity } from '../entities';

import type { UserEntity } from '../entities';
import type { Repository } from 'typeorm';

export class ProjectRepository {
  private repository: Repository<ProjectEntity>;

  constructor() {
    this.repository = connect(ProjectEntity);
  }

  async create(projectData: {
    name: string;
    description: string;
    createdBy: UserEntity;
  }): Promise<ProjectEntity> {
    const project = this.repository.create(projectData);
    return await this.repository.save(project);
  }
}
