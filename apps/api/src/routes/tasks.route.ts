import { Router } from 'express';

import {
  createTask,
  updateTask,
  getTask,
  getAllTasks,
  assignUserToTask,
  deleteTask,
  unassignUserFromTask
} from '../controller';
import {
  validate,
  authenticate,
  taskValidator,
  taskUpdateValidator,
  assignUserToTaskValidator
} from '../middleware';

const router = Router();

router.post('/:projectId/tasks', authenticate, taskValidator, validate, createTask);
router.get('/:projectId/tasks', authenticate, getAllTasks);
router.get('/:projectId/tasks/:taskId', authenticate, getTask);
router.patch('/:projectId/tasks/:taskId', authenticate, taskUpdateValidator, validate, updateTask);
router.post(
  '/:projectId/tasks/:taskId/assignees',
  authenticate,
  assignUserToTaskValidator,
  validate,
  assignUserToTask
);
router.post(
  '/:projectId/tasks/:taskId/unassign',
  authenticate,
  assignUserToTaskValidator,
  validate,
  unassignUserFromTask
);
router.delete('/:projectId/tasks/:taskId', authenticate, deleteTask);

export default router;
