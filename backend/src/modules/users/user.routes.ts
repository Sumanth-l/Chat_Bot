import { Router } from 'express';
import * as userController from './user.controller';

const router = Router();
router.get('/:userId', userController.getById);

export default router;
