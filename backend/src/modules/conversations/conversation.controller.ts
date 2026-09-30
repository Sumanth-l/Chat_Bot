import { Request, Response, NextFunction } from "express";
import { conversationService } from "./conversation.service";

class ConversationController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title } = req.body;
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ success: false, message: "A conversation title is required." });
      }

      const conversation =
        await conversationService.createConversation(
          String(res.locals.userId),
          title.trim()
        );

      return res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversations =
        await conversationService.getUserConversations(
          String(res.locals.userId)
        );

      return res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }
   
  async remove(req: Request<{ conversationId: string }>, res: Response, next: NextFunction) {
    try {
      const removed = await conversationService.deleteConversation(
        req.params.conversationId,
        String(res.locals.userId)
      );
      if (!removed) {
        return res.status(404).json({ success: false, message: "Conversation not found." });
      }
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController =
  new ConversationController();
  