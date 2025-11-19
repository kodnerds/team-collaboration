import usersRoutes from './users.routes';
import { Router } from 'express';

const router = Router();

router.use('/users', usersRoutes);

export default router as Router;
