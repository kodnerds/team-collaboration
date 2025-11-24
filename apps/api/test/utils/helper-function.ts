import { hashPassword } from '../../src/utils/hashPassword';

import type { UserEntity } from '../../src/entities';
import type { TestFactory } from '../factory';

type User = { name: string; email: string };

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const defaultTestPassword = 'Test123';

export const createTestUser = async (factory: TestFactory, user: User): Promise<UserEntity> => {
  const hashedPassword = await hashPassword(defaultTestPassword);
  const userRepository = factory._connection.getRepository('UserEntity');
  return await userRepository.save({
    name: user.name,
    email: user.email,
    password: hashedPassword
  } as UserEntity);
};
