import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Btn, Modal, SearchList, Status } from "@/components";
import { FriendsList } from "@/features/friends";
import { useAuth } from "@/features/auth";
import { useStatus } from "@/hooks/useStatus";
import { searchUsers, type UserSearchResult } from "@/api/users.api";

interface NewChatProps {
  onSelectChat?: (username: string) => void;
}

export function NewChat({ onSelectChat }: NewChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation("pages");
  const getStatus = useStatus();

  const handleAction = useCallback((item: UserSearchResult) => {
    onSelectChat?.(item.username);
    navigate(`/chat/${item.username}`);
    setIsOpen(false);
  }, [onSelectChat, navigate]);

  const renderItem = useCallback((item: UserSearchResult) => (
    <div className="flex items-center gap-3 px-1 py-0.5">
      <button
        className="flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default text-left"
        onClick={() => handleAction(item)}
      >
        <Avatar username={item.username} src={item.avatarUrl} size="sm" />
        <span className="font-mono text-sm text-default truncate">{item.username}</span>
        <Status status={getStatus(item.status, item.id as number, item.username)} />
      </button>
    </div>
  ), [getStatus, handleAction]);

  return (
    <>
      <Btn variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        {t("chat.new_chat")}
      </Btn>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t("chat.new_chat_title")}>
        <SearchList
          fetchFn={searchUsers}
          renderItem={renderItem}
        />
        <FriendsList username={user?.username ?? ""} showMsgBtn className="mt-3"/>
      </Modal>
    </>
  );
}
