import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Avatar, Btn, Heading, Text } from "@/components";
import { chatApi, type ChatConversation } from "@/api/chat.api";
import { Link } from "react-router-dom";

interface ChatsListProps {
  onSelectChat: (username: string) => void;
  refreshKey?: number;
}

export function ChatsList({ onSelectChat, refreshKey }: ChatsListProps) {
  const { t } = useTranslation('pages');
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    chatApi
      .getConversations()
      .then((data) => {
        if (cancelled) return;
        setChats(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : t('chat.error_load');
        setError(message);
        setChats([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading level={3}>{t('chat.title')}</Heading>
        <Btn as={Link} to="/chat" variant="primary" size="sm">
          {t('chat.new_chat')}
        </Btn>
      </div>
      {loading ? (
        <Alert variant="info">{t('common:loading')}</Alert>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : chats.length === 0 ? (
        <Alert variant="info">{t('chat.no_chats')}</Alert>
      ) : (
        <ul className="flex flex-col gap-3 mt-4">
          {chats.map((item) => (
            <li key={item.user.username}>
              <button
                onClick={() => onSelectChat(item.user.username)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    username={item.user.username}
                    src={item.user.avatarUrl ?? undefined}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <Text className="truncate font-bold">{item.user.username}</Text>
                    <Text className="truncate">{item.lastMessage}</Text>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
