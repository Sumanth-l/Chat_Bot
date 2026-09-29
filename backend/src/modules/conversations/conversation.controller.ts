import type { NextFunction, Request, Response } from 'express';
import * as conversationService from './conversation.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Read the authenticated user ID from the auth middleware's request type.
    const userId = String(req.query.userId ?? '');
    res.status(200).json({ data: await conversationService.listForUser(userId) });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Use the authenticated user ID from request context, not an untrusted body field.
    const userId = String(req.body.userId ?? '');
    const conversation = await conversationService.create({ userId, title: req.body.title });
    res.status(201).json({ data: conversation });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request<{ conversationId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO: Use the authenticated user ID from request context.
    const userId = String(req.query.userId ?? '');
    await conversationService.remove(req.params.conversationId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
