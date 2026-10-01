import type { Feedback, FeedbackType } from '../types/chat';
import { apiRequest } from './apiClient';

export interface SubmitFeedbackInput {
  conversationId: string;
  messageId: string;
  type: FeedbackType;
  rating?: number;
  comment?: string;
}

export const feedbackApi = {
  getConversationFeedback: (conversationId: string) => apiRequest<Feedback[]>(`/api/feedback/conversation/${encodeURIComponent(conversationId)}`),
  submit: (input: SubmitFeedbackInput) => apiRequest<Feedback>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(input),
  }),
};
