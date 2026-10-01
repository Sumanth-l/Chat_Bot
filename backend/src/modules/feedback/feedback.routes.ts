import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { feedbackController } from "./feedback.controller";

const router = Router();

router.post("/", protect, feedbackController.submitFeedback.bind(feedbackController));
router.get("/conversation/:conversationId", protect, feedbackController.getConversationFeedback.bind(feedbackController));

export default router;
