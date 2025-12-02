import { connect } from '../database';
import { ProjectEntity } from '../entities';

import type { UserEntity } from '../entities';
import type { Repository, FindOptionsSelect } from 'typeorm';

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

  async findAndCount({
    skip,
    take,
    relations,
    select
  }: {
    skip: number;
    take: number;
    relations?: string[];
    select?: FindOptionsSelect<ProjectEntity>;
  }): Promise<[ProjectEntity[], number]> {
    return await this.repository.findAndCount({ skip, take, relations, select });
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return await this.repository.findOne({ where: { id }, relations: ['createdBy'] });
  }
}
