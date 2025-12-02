import { Router } from 'express';

import { createProject, getAllProjects, updateProject } from '../controller';
import { validate, projectValidator, authenticate, projectUpdateValidator } from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);
router.put('/:id', authenticate, projectUpdateValidator, validate, updateProject);

export default router;
