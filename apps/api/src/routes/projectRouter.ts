import { Router } from 'express';

import { createProject } from '../controller';
import { validate, projectValidator, authenticate } from '../middleware';

const router = Router();

router.post('/', authenticate, projectValidator, validate, createProject);

export default router;
