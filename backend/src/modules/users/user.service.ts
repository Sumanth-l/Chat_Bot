import type { UserSummary } from './user.types';

export async function getById(userId: string): Promise<UserSummary | null> {
  // TODO: Query Prisma for the user; select only fields safe to expose.
  void userId;
  throw new Error('User lookup is not implemented yet.');
}
