import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Btn } from '@/components';

interface ChatFormProps {
  onSendMessage: (content: string) => void;
}

export function ChatForm({ onSendMessage }: ChatFormProps) {
  const { t } = useTranslation('pages');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          type="text"
          placeholder={t('chat.message_placeholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="ghost"
          className="flex-1"
        />
        <Btn type="submit" variant="primary">{t('chat.send')}</Btn>
      </form>
  );
}
