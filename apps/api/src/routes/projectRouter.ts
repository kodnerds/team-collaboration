import { Router } from 'express';

import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
  createTask
} from '../controller';
import {
  validate,
  projectValidator,
  authenticate,
  projectUpdateValidator,
  taskValidator
} from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);
router.put('/:id', authenticate, projectUpdateValidator, validate, updateProject);
router.delete('/:id', authenticate, deleteProject);

router.post('/:projectId/tasks', authenticate, taskValidator, validate, createTask);

export default router;
