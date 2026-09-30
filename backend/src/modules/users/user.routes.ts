import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.get('/:userId', userController.getById);

export default router;
