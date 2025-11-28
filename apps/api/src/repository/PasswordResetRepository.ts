import { connect } from '../database';
import { PasswordResetEntity } from '../entities/PasswordResetEntity';

import type { UserEntity } from '../entities';
import type { Repository } from 'typeorm';

export class PasswordResetRepository {
  private repository: Repository<PasswordResetEntity>;

  constructor() {
    this.repository = connect(PasswordResetEntity);
  }

  async findOneByEmail(email: string): Promise<PasswordResetEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async create(resetToken: {
    token: string;
    email: string;
    user: UserEntity;
    expiresAt: Date;
    status: 'active' | 'used';
  }): Promise<PasswordResetEntity> {
    const token = this.repository.create(resetToken);
    return await this.repository.save(token);
  }
}
