import { useEffect, useRef } from 'react';
import { Alert } from '@/components';
import { Message } from './Message';

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
            return (
              <Message key={msg.id ?? idx} message={msg} />
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
