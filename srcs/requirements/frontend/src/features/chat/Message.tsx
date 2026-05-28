import { useTranslation } from 'react-i18next';
import { Avatar, Text } from '@/components';
import type { ChatMessage } from '@/api/chat.api';

interface MessageProps {
  message: ChatMessage;
  isOwn?: boolean;
}

export function Message({ message, isOwn = false }: MessageProps) {
  const { t } = useTranslation('pages');
  const sender = message.sender;
  const avatarUrl = message.sender.avatarUrl ?? undefined;
  const displayName = isOwn ? t('chat.you') : sender.username;

  return (
    <div className="mb-2 flex items-center gap-2">
      <Avatar username={sender.username} src={avatarUrl} size="sm" />
      <Text size="sm" className="truncate">
        <span className="font-bold">{displayName}</span>: {message.content}
      </Text>
    </div>
  );
}