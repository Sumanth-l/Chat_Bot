import type { NextFunction, Request, Response } from 'express';
import * as userService from './user.service';

export async function getById(req: Request<{ userId: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.params.userId !== res.locals.userId) {
      res.status(403).json({ success: false, message: 'Forbidden.' });
      return;
    }
    const user = await userService.getById(req.params.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}
