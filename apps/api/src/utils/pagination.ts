import type { Request } from 'express';

export const paginationParams = (query: Request['query']) => {
  const parsedPage = Number.parseInt(query.page as string, 10);
  const parsedLimit = Number.parseInt(query.limit as string, 10);
  const page = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage);
  const limit = Math.min(100, Math.max(1, Number.isNaN(parsedLimit) ? 10 : parsedLimit));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
