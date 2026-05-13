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