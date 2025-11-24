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
}
