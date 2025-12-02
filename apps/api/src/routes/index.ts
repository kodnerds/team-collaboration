import { Router } from 'express';

import projectTaskRoutes from './projectTaskRoutes';
import projectRoutes from './projectRouter';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/tasks', projectTaskRoutes);

export default router as Router;
