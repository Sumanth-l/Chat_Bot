import type { AIProviderName, Conversation, Message } from '../types/chat';
import { apiRequest } from './apiClient';

export const chatApi = {
  getConversations: () => apiRequest<Conversation[]>('/api/conversations'),
  createConversation: (title: string) => apiRequest<Conversation>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }),
  deleteConversation: (conversationId: string) => apiRequest<void>(`/api/conversations/${encodeURIComponent(conversationId)}`, { method: 'DELETE' }),
  createMessage: (conversationId: string, content: string, role: Message['role']) => apiRequest<Message>('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ conversationId, content, role }),
  }),
  getMessages: (conversationId: string) => apiRequest<Message[]>(`/api/messages/${encodeURIComponent(conversationId)}`),
  getMessage: (messageId: string) => apiRequest<Message>(`/api/messages/single/${encodeURIComponent(messageId)}`),
  deleteMessage: (messageId: string) => apiRequest<{ message: string }>(`/api/messages/${encodeURIComponent(messageId)}`, { method: 'DELETE' }),
  sendMessage: (conversationId: string, message: string) => apiRequest<{
    conversationId: string;
    userMessage: string;
    aiResponse: string;
  }>('/api/chatbot/reply', {
    method: 'POST',
    body: JSON.stringify({ conversationId, message }),
  }),
};

export const configuredProvider: AIProviderName = import.meta.env.VITE_AI_PROVIDER?.toLowerCase() === 'groq' ? 'groq' : 'gemini';
