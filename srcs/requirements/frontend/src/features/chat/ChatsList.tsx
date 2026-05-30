import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Avatar, List, Heading, Text } from "@/components";
import { chatApi, type ChatConversation } from "@/api/chat.api";
import { NewChat } from ".";

interface ChatsListProps {
  onSelectChat: (username: string) => void;
  selectedUsername?: string | null;
  refreshKey?: number;
}

export function ChatsList({ onSelectChat, selectedUsername, refreshKey }: ChatsListProps) {
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
        <NewChat onSelectChat={onSelectChat} />
      </div>
      {loading ? (
        <Alert variant="info">{t('common:loading')}</Alert>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : chats.length === 0 ? (
        <Alert variant="info">{t('chat.no_chats')}</Alert>
      ) : (
        <List
          className="mt-4"
          items={chats.map((c) => ({ ...c, id: c.user.id }))}
          getItemClassName={(item) =>
            item.user.username === selectedUsername ? "!border-2 !border-default" : ""
          }
          renderItem={(item) => {
            return (
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
            );
          }}
        />
      )}
    </>
  );
}
