import type { AuthResult, LoginInput, RegisterInput } from './auth.types';

export async function register(input: RegisterInput): Promise<AuthResult> {
  // TODO: Add Prisma user lookup/create queries here; hash passwords before persistence.
  // TODO: Issue a signed JWT using the application's configured secret and expiry.
  void input;
  throw new Error('Auth registration is not implemented yet.');
}

export async function login(input: LoginInput): Promise<AuthResult> {
  // TODO: Load the user with Prisma and verify the password hash.
  // TODO: Issue a signed JWT using the application's configured secret and expiry.
  void input;
  throw new Error('Auth login is not implemented yet.');
}
