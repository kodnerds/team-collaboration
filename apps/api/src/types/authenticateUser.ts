export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}
