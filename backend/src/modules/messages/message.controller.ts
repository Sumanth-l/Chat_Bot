import type { NextFunction, Request, Response } from 'express';
import * as messageService from './message.service';

export async function list(req: Request<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Read user ID from authenticated request context.
    const userId = String(req.query.userId ?? '');
    const messages = await messageService.listForConversation(req.params.conversationId, userId);
    res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Read user ID from authenticated request context and validate content.
    const userId = String(req.body.userId ?? '');
    const message = await messageService.create({
      conversationId: req.params.conversationId,
      userId,
      content: String(req.body.content ?? ''),
    });
    res.status(201).json({ data: message });
  } catch (error) {
    next(error);
  }
}
