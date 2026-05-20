import { useState, useEffect, useContext } from 'react';
// @ts-ignore
import { io, Socket } from 'socket.io-client';
import { AuthContext, getToken } from '../auth/AuthContext';
import { Heading, Text, Alert } from '../components';
import { Messages } from './Messages';
import { ChatForm } from './ChatForm';
import { chatApi } from '../api/chat';

interface MessageData {
  id?: number;
  from: number;
  fromUsername: string;
  content: string;
  sentAt: string;
  sender?: { id: number; username: string; avatarUrl?: string };
  receiver?: { id: number; username: string; avatarUrl?: string };
  senderId?: number;
}

interface ChatBoxProps {
  targetUsername?: string | null;
}

export function ChatBox({ targetUsername }: ChatBoxProps) {
  const auth = useContext(AuthContext);

  const [messages, setMessages] = useState<MessageData[]>([]);
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
        setMessages(history);
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

    newSocket.on('receive_message', (data: any) => {
      console.log('Message received:', data);
      setMessages((prev) => [
        ...prev,
        {
          from: data.from,
          fromUsername: data.fromUsername,
          content: data.content,
          sentAt: data.sentAt,
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
  }, [auth, targetUsername]);

  const handleSendMessage = (content: string) => {
    if (socket && targetUsername) {
      socket.emit('send_message', {
        to: targetUsername,
        content,
      });

      setMessages((prev) => [
        ...prev,
        {
          from: auth?.user?.id || 0,
          fromUsername: auth?.user?.username || '',
          content,
          sentAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {!targetUsername ? (
        <Text>Select a chat</Text>
      ) : (
        <>
          <Heading level={2}>{targetUsername}</Heading>

          {isLoading ? (
            <div><Alert variant='info'>Loading chat...</Alert></div>
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
