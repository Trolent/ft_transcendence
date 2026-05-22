import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SafeUser } from "@backend/common/types";
import { getMeApi, loginApi, registerApi } from './api';
import { io } from 'socket.io-client';
import i18n, { DB_LANG_MAP } from '../i18n';

const TOKEN_KEY = 'transcendence';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithToken: (token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  function applyUser(u: SafeUser) {
    setUser(u);
    const lang = DB_LANG_MAP[u.language];
    if (lang)
      i18n.changeLanguage(lang);
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeApi(token)
      .then(applyUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const { access_token } = await loginApi(identifier, password);
    localStorage.setItem(TOKEN_KEY, access_token);
    const me = await getMeApi(access_token);
    applyUser(me);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await registerApi(username, email, password);
      await login(email, password);
    },
    [login],
  );

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!user || !token)
      return;
    const socket = io('/status', { auth: { token } });
    return () => { socket.disconnect(); };
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      const me = await getMeApi(token);
      setUser(me);
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}
