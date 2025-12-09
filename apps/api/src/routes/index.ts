import { Router } from 'express';

import projectRoutes from './projects.route';
import tasksRoutes from './tasks.route';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', tasksRoutes);

export default router as Router;
