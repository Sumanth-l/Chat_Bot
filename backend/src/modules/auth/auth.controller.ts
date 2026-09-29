import type { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service';
import { validateLoginInput, validateRegisterInput } from './auth.validation';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validation = validateRegisterInput(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.message });
    return;
  }
  try {
    res.status(201).json(await authService.register(validation.data));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const validation = validateLoginInput(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.message });
    return;
  }
  try {
    res.status(200).json(await authService.login(validation.data));
  } catch (error) {
    next(error);
  }
}
