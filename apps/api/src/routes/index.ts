import { Router } from 'express';

import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', usersRoutes);

export default router as Router;
