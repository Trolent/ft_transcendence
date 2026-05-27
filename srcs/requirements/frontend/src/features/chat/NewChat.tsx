import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleAction = (username: string) => {
    onSelectChat?.(username);
    navigate(`/chat/${username}`);
    setIsOpen(false);
  };

  return (
    <>
      <Btn variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        New Chat
      </Btn>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Chat">
        <FindUser
          actionBtnText="Open"
          onAction={handleAction}
        />
        <FriendsList username={user.username} showMsgBtn className="mt-3"/>
      </Modal>
    </>
  );
}
