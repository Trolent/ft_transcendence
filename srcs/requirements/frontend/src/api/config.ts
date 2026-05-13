import { getToken } from '../auth';

export const API_AUTH  = '/api/auth';
export const API_AUTH_LOGIN = '/api/auth/login';
export const API_AUTH_REGISTER = '/api/auth/register';
export const API_AUTH_ME = '/api/auth/me';
export const API_USERS = '/api/users';


export function authHeaders(token : string): HeadersInit {
    let ftoken = token;
    if(!ftoken)
        ftoken = getToken();
  return ftoken ? { Authorization: `Bearer ${ftoken}` } : {};
}

export async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trimStart().startsWith('{') && !text.trimStart().startsWith('[')) {
    throw new Error(`HTTP ${res.status} — response not JSON: ${text.slice(0, 200)}`);
  }
  const data = JSON.parse(text);
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg ?? `HTTP ${res.status}`);
  }
  return data as T;
}