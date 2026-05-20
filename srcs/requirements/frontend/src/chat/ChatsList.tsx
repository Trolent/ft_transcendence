import { useEffect, useState } from "react";
import { Alert, Avatar, Heading, List, Text } from "@/components";
import { chatApi } from "@/api/chat";

interface Chat {
  id: string;
  username: string;
  avatarSrc?: string;
  lastMessage: string;
  sentAt: string;
}

interface ChatsListProps {
  onSelectChat: (username: string) => void;
}

export function ChatsList({ onSelectChat }: ChatsListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
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
        setChats(
          data.map((item: any) => ({
            id: item.user.id,
            username: item.user.username,
            avatarSrc: item.user.avatarUrl,
            lastMessage: item.lastMessage,
            sentAt: item.sentAt,
          }))
        );
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
  }, []);

  return (
    <>
      <Heading level={3}>Chats</Heading>
      {loading ? (
        <Alert variant="info">Loading...</Alert>
      ) : error ? (
        <Alert variant="error">Loading...</Alert>
      ) : chats.length === 0 ? (
        <Alert variant="info">No chats yet</Alert>
      ) : (
        <List
          className="mt-4"
          items={chats}
          renderItem={(item: Chat) => {
            return (
              <button
                onClick={() => onSelectChat(item.username)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    username={item.username}
                    src={item.avatarSrc}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <Text className="truncate font-bold">{item.username}</Text>
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
