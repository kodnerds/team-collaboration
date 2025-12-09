import { Router } from 'express';

import {
  createProject,
  getAllProjects,
  deleteProject,
  updateProject,
  getSingleProject
} from '../controller';
import { validate, projectValidator, authenticate, projectUpdateValidator } from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);
router.put('/:id', authenticate, projectUpdateValidator, validate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.get('/:id', authenticate, getSingleProject);

export default router;
