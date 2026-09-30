export type MessageRole = 'USER' | 'ASSISTANT';
export type AIProviderName = 'gemini' | 'groq';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatUser {
  id?: string;
  name?: string;
  email?: string;
}
