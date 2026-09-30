import { Request, Response, NextFunction } from "express";
import { messageService } from "./message.service";

export class MessageController {
  async createMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { conversationId, content, role } = req.body;
      if (typeof conversationId !== "string" || !conversationId.trim()) {
        return res.status(400).json({ success: false, message: "conversationId is required." });
      }
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ success: false, message: "content is required." });
      }
      if (role !== "USER" && role !== "ASSISTANT") {
        return res.status(400).json({ success: false, message: "role must be USER or ASSISTANT." });
      }

      const message = await messageService.createMessage(
        String(res.locals.userId),
        conversationId.trim(),
        content.trim(),
        role
      );
      if (!message) return res.status(404).json({ success: false, message: "Conversation not found." });

      return res.status(201).json({
        success: true,
        message: "Message created successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { conversationId } = req.params;

      const messages = await messageService.getMessages(
        conversationId,
        String(res.locals.userId)
      );
      if (!messages) return res.status(404).json({ success: false, message: "Conversation not found." });

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessageById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const message = await messageService.getMessageById(id, String(res.locals.userId));
      if (!message) return res.status(404).json({ success: false, message: "Message not found." });

      return res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result = await messageService.deleteMessage(id, String(res.locals.userId));
      if (!result) return res.status(404).json({ success: false, message: "Message not found." });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
