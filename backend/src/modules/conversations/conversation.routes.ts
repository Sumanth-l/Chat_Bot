import { Router } from "express";
import { conversationController } from "./conversation.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();
router.use(protect);

router.post("/", conversationController.create.bind(conversationController));
router.get("/", conversationController.getAll.bind(conversationController));
router.delete("/:conversationId", conversationController.remove.bind(conversationController));

export default router;
