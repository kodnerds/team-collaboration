import { Router } from 'express';

import { validate, projectValidator, authenticate } from '../middleware';
import { createTask } from '../controller/task.controller';

const router = Router();

router.post('/projects/:projectId/tasks', authenticate, projectValidator, validate, createTask);

export default router;
