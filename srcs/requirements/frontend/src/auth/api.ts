import { type SafeUser } from "@backend/common/types";
import { authHeaders, API_AUTH_ME, API_AUTH_LOGIN, API_AUTH_REGISTER } from '../api/config'

const headers = { 'Content-Type': 'application/json' };

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
  const res = await fetch(API_AUTH_LOGIN, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function registerApi(
  username: string,
  email: string,
  password: string,
): Promise<SafeUser> {
  const res = await fetch(API_AUTH_REGISTER, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function getMeApi(token: string): Promise<SafeUser> {
  const res = await fetch(API_AUTH_ME, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
