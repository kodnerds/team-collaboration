import { Router } from 'express';

import projectRoutes from './projectRouter';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', usersRoutes);
router.use('/projects', projectRoutes);

export default router as Router;
