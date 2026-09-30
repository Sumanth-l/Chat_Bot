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

      const message = await messageService.createMessage(
        conversationId,
        content,
        role
      );

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
        conversationId
      );

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

      const message = await messageService.getMessageById(id);

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

      const result = await messageService.deleteMessage(id);

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