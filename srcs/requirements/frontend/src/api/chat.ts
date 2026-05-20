import { authHeaders, handleResponse } from './config';

interface Message {
  id?: number;
  from: number;
  fromUsername: string;
  content: string;
  sentAt: string;
  sender?: { id: number; username: string; avatarUrl?: string };
  receiver?: { id: number; username: string; avatarUrl?: string };
  senderId?: number;
}

export const chatApi = {
  getHistory: async (username: string, before?: number): Promise<Message[]> => {
    const params = new URLSearchParams();
    if (before) params.append('before', before.toString());
    const queryString = params.toString() ? '?' + params.toString() : '';
    const res = await fetch(`/api/chat/${encodeURIComponent(username)}${queryString}`, {
      headers: authHeaders(),
    });
    return handleResponse<Message[]>(res);
  },
  getConversations: async (): Promise<any[]> => {
    const res = await fetch('/api/chat', {
      headers: authHeaders(),
    });
    return handleResponse<any[]>(res);
  },
};
