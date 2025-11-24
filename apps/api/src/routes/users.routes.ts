import { Router } from 'express';

import { login } from '../controller';
import { authValidator, validate } from '../middleware';

const router = Router();

router.post('/login', authValidator, validate, login);

export default router;
