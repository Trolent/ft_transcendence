import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Btn, FindUser, Modal } from "@/components";
import { FriendsList } from "@/features/friends";
import { useAuth } from "@/features/auth";

interface NewChatProps {
  onSelectChat?: (username: string) => void;
}

export function NewChat({ onSelectChat }: NewChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation("pages");

  const handleAction = (username: string) => {
    onSelectChat?.(username);
    navigate(`/chat/${username}`);
    setIsOpen(false);
  };

  return (
    <>
      <Btn variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        {t("chat.new_chat")}
      </Btn>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t("chat.new_chat_title")}>
        <FindUser
          actionBtnText={t("chat.open")}
          onAction={handleAction}
        />
        <FriendsList username={user.username} showMsgBtn className="mt-3"/>
      </Modal>
    </>
  );
}
