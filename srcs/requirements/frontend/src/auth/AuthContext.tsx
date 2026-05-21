import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SafeUser } from "@backend/common/types";
import { getMeApi, loginApi, registerApi } from './api';
// @ts-ignore
import { io, type Socket } from 'socket.io-client';

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
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveStatuses, setLiveStatuses] = useState<LiveStatusMap>({});

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

  return (
    <AuthContext.Provider value={{ user, loading, liveStatuses, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
