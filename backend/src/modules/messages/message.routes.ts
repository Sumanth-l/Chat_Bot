import { Router } from "express";
import { messageController } from "./message.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  protect,
  messageController.createMessage.bind(messageController)
);

router.get(
  "/:conversationId",
  protect,
  messageController.getMessages.bind(messageController)
);

router.get(
  "/single/:id",
  protect,
  messageController.getMessageById.bind(messageController)
);

router.delete(
  "/:id",
  protect,
  messageController.deleteMessage.bind(messageController)
);

export default router;