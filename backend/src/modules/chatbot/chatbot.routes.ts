import { Router } from 'express';
import * as chatbotController from './chatbot.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.post('/reply', chatbotController.reply);

export default router;
