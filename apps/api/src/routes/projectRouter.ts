import { Router } from 'express';

import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
  createTask,
  updateTask
} from '../controller';
import {
  validate,
  projectValidator,
  authenticate,
  projectUpdateValidator,
  taskValidator,
  taskUpdateValidator
} from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);
router.put('/:id', authenticate, projectUpdateValidator, validate, updateProject);
router.delete('/:id', authenticate, deleteProject);

router.post('/:projectId/tasks', authenticate, taskValidator, validate, createTask);
router.patch('/:projectId/tasks/:taskId', authenticate, taskUpdateValidator, validate, updateTask);

export default router;
