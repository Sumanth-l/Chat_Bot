export type MessageRole = 'USER' | 'ASSISTANT';
export type AIProviderName = 'gemini' | 'groq';
export type FeedbackType = 'LIKE' | 'DISLIKE' | 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL';
export type FeedbackFormType = Extract<FeedbackType, 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL'>;

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

export interface Feedback {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  rating: number | null;
  type: FeedbackType;
  comment: string | null;
  createdAt: string;
}

export interface ChatUser {
  id?: string;
  name?: string;
  email?: string;
}
