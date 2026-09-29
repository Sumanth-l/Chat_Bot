import type { CreateMessageInput, MessageRecord } from './message.types';

export async function listForConversation(conversationId: string, userId: string): Promise<MessageRecord[]> {
  // TODO: Query Prisma for messages after checking conversation ownership; paginate history.
  void conversationId;
  void userId;
  throw new Error('Message history is not implemented yet.');
}

export async function create(input: CreateMessageInput): Promise<MessageRecord> {
  // TODO: Persist the user message with Prisma after checking conversation ownership.
  void input;
  throw new Error('Message creation is not implemented yet.');
}
