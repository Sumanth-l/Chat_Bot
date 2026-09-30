const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');
let refreshInFlight: Promise<boolean> | null = null;

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Please sign in again.');
    this.name = 'SessionExpiredError';
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    }).then(async (response) => {
      if (!response.ok) return false;
      const payload = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
      return payload?.success === true;
    }).catch(() => false).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function apiRequest<T>(path: string, init?: RequestInit, retryAfterRefresh = true): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || payload?.success === false) {
    if (response.status === 401) {
      const isCredentialRequest = path === '/api/auth/login' || path === '/api/auth/register' || path === '/api/auth/refresh';
      if (retryAfterRefresh && !isCredentialRequest && await refreshAccessToken()) {
        return apiRequest<T>(path, init, false);
      }
      throw new SessionExpiredError();
    }
    throw new Error(payload?.message || `The request failed (${response.status}). Please try again.`);
  }

  if (payload && 'data' in payload) return payload.data as T;
  return payload as T;
}

export const getApiBaseUrl = () => API_BASE_URL;
