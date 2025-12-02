import { Router } from 'express';

import { createProject, getAllProjects, createTask } from '../controller';
import { validate, projectValidator, authenticate, taskValidator } from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);

router.post('/:projectId/tasks', authenticate, taskValidator, validate, createTask);

export default router;
