import { useEffect, useState } from "react";
import { Alert, Avatar, Heading, List, Text } from "@/components";
import { chatApi, type ChatConversation } from "@/api/chat.api";
import { NewChat } from ".";

interface ChatsListProps {
  onSelectChat: (username: string) => void;
  refreshKey?: number;
}

export function ChatsList({ onSelectChat, refreshKey }: ChatsListProps) {
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
          err instanceof Error ? err.message : "Unable to load chats";
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
        <Heading level={3}>Chats</Heading>
        <NewChat onSelectChat={onSelectChat} />
      </div>
      {loading ? (
        <Alert variant="info">Loading...</Alert>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : chats.length === 0 ? (
        <Alert variant="info">No chats yet</Alert>
      ) : (
        <List
          className="mt-4"
          items={chats.map((c) => ({ ...c, id: c.user.id }))}
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
