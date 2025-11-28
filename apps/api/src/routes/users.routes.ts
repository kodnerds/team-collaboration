import { Router } from 'express';

import { forgotPassword, login, signup } from '../controller';
import { forgotPasswordValidator, loginValidator, signupValidator, validate } from '../middleware';

const router = Router();

router.post('/login', loginValidator, validate, login);
router.post('/signup', signupValidator, validate, signup);
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  forgotPassword
);

export default router;
