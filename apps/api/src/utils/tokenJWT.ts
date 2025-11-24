import jwt from 'jsonwebtoken';

import envConfig from '../config/envConfig';

import type { AuthenticatedUser } from '../types/authenticateUser';

export const genToken = async (payload: AuthenticatedUser): Promise<string> =>
  jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15d'
  });
