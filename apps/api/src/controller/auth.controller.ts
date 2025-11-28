import crypto from "node:crypto";

import { UserRepository } from '../repository';
import { PasswordResetRepository } from '../repository/PasswordResetRepository';
import { HTTP_STATUS } from '../utils/const';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { sendEmail } from "../utils/sendEmail";
import { genToken } from '../utils/tokenJWT';

import type { AuthenticatedUser } from '../types/authenticateUser';
import type { Request, Response } from 'express';
import logger from "../utils/logger";


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
  } catch(error) {
    logger.error(error);
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
  } catch(error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  console.log("hello, begginig!!1") 
try {
  const { email } = req.body;

  const userRepository = new UserRepository();
  const passwordResetRepository = new PasswordResetRepository();
  const user = await userRepository.findOneByEmail(email);

  const successMessage = {
    message:
      "If an account with this email exists, a password reset link has been sent.",
  };

  if (!user) return res.status(200).json(successMessage);

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const resetToken = await passwordResetRepository.create({
    token,
    email,
    user,
    expiresAt,
    status: "active",
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  console.log(resetUrl)
  await sendEmail(
    user.email,
    "Password Reset Request",
    `
      <h2>Password Reset</h2>
      <p>Hello ${user.name},</p>
      <p>You requested to reset your password.</p>
      <p>Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in <strong>1 hour</strong>.</p>
    `
  );
  return res.status(200).json(successMessage);
} catch (error) {
  logger.error(error);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
}   
};
