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

  async find({
    skip,
    take,
    relations,
    select
  }: {
    skip: number;
    take: number;
    relations?: string[];
    select?: object;
  }): Promise<ProjectEntity[]> {
    return await this.repository.find({ skip, take, relations, select });
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
