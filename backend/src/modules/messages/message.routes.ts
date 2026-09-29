import { Router } from 'express';
import * as messageController from './message.controller';

const router = Router();
router.get('/conversations/:conversationId', messageController.list);
router.post('/conversations/:conversationId', messageController.create);

export default router;
