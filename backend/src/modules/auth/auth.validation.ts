import type { LoginInput, RegisterInput } from './auth.types';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export function validateRegisterInput(value: unknown): ValidationResult<RegisterInput> {
  if (!value || typeof value !== 'object') {
    return { success: false, message: 'Request body must be an object.' };
  }

  const body = value as Record<string, unknown>;
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return { success: false, message: 'Name is required.' };
  }
  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    return { success: false, message: 'A valid email is required.' };
  }
  if (typeof body.password !== 'string' || body.password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters.' };
  }
  return {
    success: true,
    data: { name: body.name.trim(), email: body.email.trim().toLowerCase(), password: body.password },
  };
}

export function validateLoginInput(value: unknown): ValidationResult<LoginInput> {
  if (!value || typeof value !== 'object') {
    return { success: false, message: 'Request body must be an object.' };
  }

  const body = value as Record<string, unknown>;
  if (typeof body.email !== 'string' || !body.email.includes('@')) {
    return { success: false, message: 'A valid email is required.' };
  }
  if (typeof body.password !== 'string' || body.password.length === 0) {
    return { success: false, message: 'Password is required.' };
  }

  return { success: true, data: { email: body.email.trim().toLowerCase(), password: body.password } };
}
