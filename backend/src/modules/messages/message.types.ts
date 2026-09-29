export interface MessageRecord {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface CreateMessageInput {
  conversationId: string;
  userId: string;
  content: string;
}
