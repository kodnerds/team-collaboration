import { UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import { comparePassword } from '../utils/hashPassword';
import { genToken } from '../utils/tokenJWT';

import type { AuthenticatedUser } from '../types/authenticateUser';
import type { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRepository = new UserRepository();
    const user = await userRepository.findOneByEmail(email);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not found' });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const payload: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    const token = genToken(payload);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Login successful',
      data: {
        id: '123456789',
        name: 'John Doe'
      },
      accessToken: token
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
