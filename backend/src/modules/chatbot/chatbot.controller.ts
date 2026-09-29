import type { NextFunction, Request, Response } from 'express';
import * as chatbotService from './chatbot.service';

export async function reply(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Read user ID from authenticated request context and validate request fields.
    const result = await chatbotService.reply({
      conversationId: String(req.body.conversationId ?? ''),
      userId: String(req.body.userId ?? ''),
      message: String(req.body.message ?? ''),
    });
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}
