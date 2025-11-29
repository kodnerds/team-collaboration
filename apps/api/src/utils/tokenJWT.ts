import jwt from 'jsonwebtoken';

import envConfig from '../config/envConfig';

import type { AuthenticatedUser } from '../types/AuthenticatedUser';

export const genToken = (payload: AuthenticatedUser): string =>
  jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d'
  });
