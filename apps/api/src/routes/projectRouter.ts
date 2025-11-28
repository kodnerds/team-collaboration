import { Router } from 'express';

import { createProject, getAllProjects } from '../controller';
import { validate, projectValidator, authenticate } from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);
router.get('/', authenticate, getAllProjects);

export default router;
