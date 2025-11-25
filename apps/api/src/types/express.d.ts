import type { AuthenticatedUser } from './authenticateUser';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
