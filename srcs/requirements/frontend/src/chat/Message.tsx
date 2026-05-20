import { Avatar, Text } from '@/components';

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

interface MessageProps {
  message: MessageData;
}

export function Message({ message }: MessageProps) {
  const sender = message.sender || { username: message.fromUsername };
  const avatarUrl = message.sender?.avatarUrl;

  return (
    <div className="mb-2 flex items-center gap-2">
      <Avatar username={sender.username} src={avatarUrl} size="sm" />
      <Text size="sm" className="truncate">
        <span className="font-bold">{sender.username}</span>: {message.content}
      </Text>
    </div>
  );
}