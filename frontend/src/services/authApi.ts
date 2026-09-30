import type { ChatUser } from '../types/chat';
import { apiRequest } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) => apiRequest<{ user: ChatUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (credentials: RegisterCredentials) => apiRequest<ChatUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  currentUser: () => apiRequest<{ user: ChatUser }>('/api/auth/me'),
  getUser: (userId: string) => apiRequest<ChatUser>(`/api/users/${encodeURIComponent(userId)}`),
  logout: () => apiRequest<void>('/api/auth/logout', { method: 'POST' }),
};
