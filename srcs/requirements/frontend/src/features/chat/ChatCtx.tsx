import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from '@/features/auth';
import { getToken } from '@/features/auth/AuthContext';

interface ChatCtxValue {
  chatSocket: Socket | null;
  unreadMessages: number;
  clearUnreadMessages: () => void;
}

export const ChatCtx = createContext<ChatCtxValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (!user || !token) {
      setUnreadMessages(0);
      return;
    }

    const socket: Socket = io('/chat', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('receive_message', () => {
      setUnreadMessages((prev) => prev + 1);
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !socket.connected) {
        socket.auth = { token: getToken() };
        socket.connect();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    setChatSocket(socket);

    return () => {
      socket.off('receive_message');
      document.removeEventListener('visibilitychange', handleVisibility);
      socket.disconnect();
      setChatSocket(null);
    };
  }, [user]);

  const clearUnreadMessages = useCallback(() => {
    setUnreadMessages(0);
  }, []);

  return (
    <ChatCtx.Provider value={{ chatSocket, unreadMessages, clearUnreadMessages }}>
      {children}
    </ChatCtx.Provider>
  );
}
