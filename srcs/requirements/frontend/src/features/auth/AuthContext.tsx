import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SafeUser } from "@backend/common/types";
import { getMeApi, loginApi, registerApi } from '@/api/auth.api';
// @ts-ignore
import { io, type Socket } from 'socket.io-client';
import i18n, { DB_LANG_MAP } from '@/features/i18n';

const TOKEN_KEY = 'transcendence';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export type LiveUserStatus = 'ONLINE' | 'IN_GAME' | 'OFFLINE';
export type LiveStatusMap = Record<number, LiveUserStatus>;

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  liveStatuses: LiveStatusMap;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithToken: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveStatuses, setLiveStatuses] = useState<LiveStatusMap>({});

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

  // === status ===
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!user || !token)
      return;
    const socket: Socket = io('/status', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('status:update', (payload: { userId: number; status: LiveUserStatus }) => {
      setLiveStatuses((prev) => ({ ...prev, [payload.userId]: payload.status }));
    });

    return () => {
      socket.off('status:update');
      socket.disconnect();
    };
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setLiveStatuses({});
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      const me = await getMeApi(token);
      setUser(me);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const me = await getMeApi(token);
    applyUser(me);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, liveStatuses, login, register, logout, loginWithToken, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
