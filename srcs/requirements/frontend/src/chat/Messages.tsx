import { useEffect, useRef } from 'react';
import { Alert, Avatar, Text } from '../components';

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

interface MessagesProps {
  messages: MessageData[];
}

export function Messages({ messages }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <Alert variant='info'>No messages yet</Alert>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => {
            const sender = msg.sender || { username: msg.fromUsername };
            const avatarUrl = msg.sender?.avatarUrl;

            return (
              <div key={msg.id ?? idx} className="mb-2 flex items-center gap-2">
                <Avatar username={sender.username} src={avatarUrl} size="sm" />
                <Text size="sm" className="truncate">
                  <span className="font-bold">{sender.username}</span>: {msg.content}
                </Text>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
