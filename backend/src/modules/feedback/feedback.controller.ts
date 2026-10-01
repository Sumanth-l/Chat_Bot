import type { NextFunction, Request, Response } from "express";
import { feedbackService } from "./feedback.service";
import { feedbackTypes, type FeedbackType } from "./feedback.types";

const maxCommentLength = 2000;

export class FeedbackController {
  async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown> | null;
      const { conversationId, messageId, type, rating, comment } = body ?? {};

      if (typeof conversationId !== "string" || !conversationId.trim()) {
        return res.status(400).json({ success: false, message: "conversationId is required." });
      }
      if (typeof messageId !== "string" || !messageId.trim()) {
        return res.status(400).json({ success: false, message: "messageId is required." });
      }
      if (typeof type !== "string" || !feedbackTypes.includes(type as FeedbackType)) {
        return res.status(400).json({ success: false, message: "A valid feedback type is required." });
      }
      if (comment !== undefined && (typeof comment !== "string" || comment.length > maxCommentLength)) {
        return res.status(400).json({ success: false, message: `comment must be a string of at most ${maxCommentLength} characters.` });
      }
      if (type === "GENERAL" && (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 5)) {
        return res.status(400).json({ success: false, message: "A rating from 1 to 5 is required." });
      }
      if (type !== "GENERAL" && rating !== undefined && rating !== null) {
        return res.status(400).json({ success: false, message: "Ratings are only accepted for GENERAL feedback." });
      }
      const normalizedComment = typeof comment === "string" ? comment.trim() : "";
      if ((type === "BUG_REPORT" || type === "FEATURE_REQUEST") && !normalizedComment) {
        return res.status(400).json({ success: false, message: "A comment is required for this feedback type." });
      }

      const feedback = await feedbackService.submitFeedback(String(res.locals.userId), {
        conversationId: conversationId.trim(),
        messageId: messageId.trim(),
        type: type as FeedbackType,
        rating: type === "GENERAL" ? rating as number : undefined,
        comment: normalizedComment || undefined,
      });
      if (!feedback) return res.status(404).json({ success: false, message: "Assistant message not found." });

      return res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      return next(error);
    }
  }

  async getConversationFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const feedback = await feedbackService.getConversationFeedback(
        String(res.locals.userId),
        req.params.conversationId
      );
      if (!feedback) return res.status(404).json({ success: false, message: "Conversation not found." });
      return res.status(200).json({ success: true, data: feedback });
    } catch (error) {
      return next(error);
    }
  }
}

export const feedbackController = new FeedbackController();
