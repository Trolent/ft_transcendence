import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SafeUser } from "@backend/common/types";
import { getMeApi, loginApi, registerApi } from './api';

const TOKEN_KEY = 'transcendence';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMeApi(token)
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const { access_token } = await loginApi(identifier, password);
    localStorage.setItem(TOKEN_KEY, access_token);
    const me = await getMeApi(access_token);
    setUser(me);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await registerApi(username, email, password);
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
