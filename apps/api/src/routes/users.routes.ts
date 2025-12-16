import { Router } from 'express';

import { login, signup, listUsers } from '../controller';
import { authenticate, loginValidator, signupValidator, validate } from '../middleware';

const router = Router();

router.post('/login', loginValidator, validate, login);
router.post('/signup', signupValidator, validate, signup);
router.get('/', authenticate, listUsers);

export default router;
