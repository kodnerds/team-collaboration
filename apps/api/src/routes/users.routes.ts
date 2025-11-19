import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_: Request, res: Response) =>
  res.send({
    message: 'Users route is working!'
  })
);

export default router;
