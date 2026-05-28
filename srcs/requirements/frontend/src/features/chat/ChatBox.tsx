import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { io, Socket } from 'socket.io-client';
import { getToken, useAuth } from '@/features/auth';
import { Heading, Text } from '@/components';
import { Messages, ChatForm } from '.';
import { chatApi, type ChatMessage, type IncomingChatMessageEvent } from '@/api/chat.api';

interface ChatBoxProps {
  targetUsername?: string | null;
  onMessageSent?: () => void;
}

export function ChatBox({ targetUsername, onMessageSent }: ChatBoxProps) {
  const { t } = useTranslation(['pages', 'common']);
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!targetUsername) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchHistory = async () => {
      try {
        const history = await chatApi.getHistory(targetUsername);
        setMessages([...history].reverse());
      } catch (error) {
        console.error('failed to fetch history:', error);
      }
      setIsLoading(false);
    };

    fetchHistory();

    const token = getToken();
    if (!token) {
      console.error('No token found');
      return;
    }

    const newSocket = io('/chat', {
      auth: { token },
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Chat socket connected');
      setIsConnected(true);
      setIsLoading(false);
    });

    newSocket.on('connect_error', (error: any) => {
      console.error('Chat:', error);
    });

    newSocket.on('receive_message', (data: IncomingChatMessageEvent) => {
      console.log('Message received:', data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          senderId: data.from,
          receiverId: user?.id ?? 0,
          content: data.content,
          sentAt: data.sentAt,
          sender: {
            id: data.from,
            username: data.fromUsername,
            avatarUrl: null,
          },
          receiver: {
            id: user?.id ?? 0,
            username: user?.username ?? t('chat.you'),
            avatarUrl: null,
          },
        },
      ]);
    });

    newSocket.on('disconnect', () => {
      console.log('Chat socket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, targetUsername]);

  const handleSendMessage = (content: string) => {
    if (socket && targetUsername) {
      socket.emit('send_message', {
        to: targetUsername,
        content,
      });

      onMessageSent?.();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          senderId: user?.id ?? 0,
          receiverId: 0,
          content,
          sentAt: new Date().toISOString(),
          sender: {
            id: user?.id ?? 0,
            username: user?.username ?? t('chat.you'),
            avatarUrl: null,
          },
          receiver: {
            id: 0,
            username: targetUsername,
            avatarUrl: null,
          },
        },
      ]);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {!targetUsername ? (
          <Text variant="dim">{t('chat.no_chat_selected')}</Text>
      ) : (
        <>
          <Heading level={2}>{targetUsername}</Heading>

          {isLoading ? (
            <div><Text variant="dim">{t('common:loading')}</Text></div>
          ) : (
            <>
              <Messages messages={messages}/>
              <ChatForm onSendMessage={handleSendMessage} />
            </>
          )}
        </>
      )}
    </div>
  );
}
