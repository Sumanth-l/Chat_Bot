import type { ConversationSummary, CreateConversationInput } from './conversation.types';

export async function listForUser(userId: string): Promise<ConversationSummary[]> {
  // TODO: Query Prisma for conversations owned by this user, with pagination.
  void userId;
  throw new Error('Conversation listing is not implemented yet.');
}

export async function create(input: CreateConversationInput): Promise<ConversationSummary> {
  // TODO: Create the conversation with Prisma and enforce user ownership.
  void input;
  throw new Error('Conversation creation is not implemented yet.');
}

export async function remove(conversationId: string, userId: string): Promise<void> {
  // TODO: Delete with Prisma after verifying the conversation belongs to this user.
  void conversationId;
  void userId;
  throw new Error('Conversation deletion is not implemented yet.');
}
