import { Router } from 'express';
import * as chatbotController from './chatbot.controller';

const router = Router();
router.post('/reply', chatbotController.reply);

export default router;
