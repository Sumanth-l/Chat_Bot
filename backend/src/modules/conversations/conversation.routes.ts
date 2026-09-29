import { Router } from 'express';
import * as conversationController from './conversation.controller';

const router = Router();
router.get('/', conversationController.list);
router.post('/', conversationController.create);
router.delete('/:conversationId', conversationController.remove);

export default router;
