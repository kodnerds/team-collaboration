import { Router } from 'express';

import { login, signup } from '../controller';
import { loginValidator, signupValidator, validate } from '../middleware';

const router = Router();

router.post('/login', loginValidator, validate, login);
router.post('/signup', signupValidator, validate, signup);

export default router;
