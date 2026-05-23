import { Avatar, Text } from '@/components';
import type { ChatMessage } from '@/api/chat';

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const sender = message.sender;
  const avatarUrl = message.sender.avatarUrl ?? undefined;

  return (
    <div className="mb-2 flex items-center gap-2">
      <Avatar username={sender.username} src={avatarUrl} size="sm" />
      <Text size="sm" className="truncate">
        <span className="font-bold">{sender.username}</span>: {message.content}
      </Text>
    </div>
  );
}