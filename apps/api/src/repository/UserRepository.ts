import { connect } from '../database';
import { UserEntity } from '../entities';

import type { Repository } from 'typeorm';

export class UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = connect(UserEntity);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(userData: {
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
  }): Promise<UserEntity> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }
}
