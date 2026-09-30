import type { UserSummary } from './user.types';
import prisma from '../../config/prisma';

export async function getById(userId: string): Promise<UserSummary | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}
