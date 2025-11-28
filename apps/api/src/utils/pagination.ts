import type { Request } from 'express';

export const paginationParams = (query: Request['query']) => {
  const page = Math.max(1, Number.parseInt(query.page as string, 10) || 1);
  const limit = Math.max(1, Number.parseInt(query.limit as string, 10) || 10);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
