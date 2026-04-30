const API_BASE = '/api/auth'

export type SafeUser = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  language: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<{ access_token: string }> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<SafeUser> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function getMeApi(token: string): Promise<SafeUser> {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}
