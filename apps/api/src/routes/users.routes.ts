import { Router } from 'express';

import { login } from '../controller';
import { loginValidator, validate } from '../middleware';

const router = Router();

router.post('/login', loginValidator, validate, login);

export default router;
