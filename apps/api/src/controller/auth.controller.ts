import { UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { genToken } from '../utils/tokenJWT';

import type { AuthenticatedUser } from '../types';
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
        id: payload.id,
        name: payload.name
      },
      accessToken: token
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    const userRepository = new UserRepository();

    const existingUser = await userRepository.findOneByEmail(email);
    if (existingUser) {
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      avatarUrl
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name
      }
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
