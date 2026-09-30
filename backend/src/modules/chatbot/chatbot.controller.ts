import type { NextFunction, Request, Response } from 'express';
import { ChatbotError, reply as generateReply } from './chatbot.service';

export async function reply(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown> | undefined;
    const result = await generateReply({
      conversationId: typeof body?.conversationId === 'string' ? body.conversationId : '',
      userId: String(res.locals.userId),
      message: typeof body?.message === 'string' ? body.message : '',
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ChatbotError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
