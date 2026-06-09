import { API_QUOTES, authHeaders, handleResponse } from '@/api/config.api';
import type { Quote } from '@/types/api';

export async function getAllQuotes(): Promise<Quote[]> {
  const res = await fetch(`${API_QUOTES}`, {
    headers: authHeaders(),
  });
  return handleResponse<Quote[]>(res);
}

export async function createQuote(text: string, type?: string): Promise<Quote> {
  const res = await fetch(`${API_QUOTES}`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, type: type || null }),
  });
  return handleResponse<Quote>(res);
}

export async function deactivateQuote(id: number): Promise<Quote> {
  const res = await fetch(`${API_QUOTES}/${id}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active: false }),
  });
  return handleResponse<Quote>(res);
}

export async function editQuote(
  id: number,
  updates: { text?: string; type?: string; active?: boolean }
): Promise<Quote> {
  const res = await fetch(`${API_QUOTES}/${id}`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return handleResponse<Quote>(res);
}
