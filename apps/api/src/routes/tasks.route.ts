import { Router } from 'express';

import { createTask, updateTask, getTask, getAllTasks } from '../controller';
import { validate, authenticate, taskValidator, taskUpdateValidator } from '../middleware';

const router = Router();

router.post('/:projectId/tasks', authenticate, taskValidator, validate, createTask);
router.get('/:projectId/tasks', authenticate, getAllTasks);
router.get('/:projectId/tasks/:taskId', authenticate, getTask);
router.patch('/:projectId/tasks/:taskId', authenticate, taskUpdateValidator, validate, updateTask);

export default router;
