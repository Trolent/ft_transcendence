import { PageWithSidebar } from '@/layout';
import { ChatBox, ChatsList } from '@/chat';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatPage() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const [selectedChat, setSelectedChat] = useState<string | null>(username ?? null);

  useEffect(() => {
    setSelectedChat(username ?? null);
  }, [username]);

  const handleSelectChat = (chatUsername: string) => {
    setSelectedChat(chatUsername);
    navigate(`/chat/${chatUsername}`);
  };

  return (
    <PageWithSidebar
      sidebar={
        <ChatsList
          //selectedUsername={selectedChat}
          onSelectChat={handleSelectChat}
        />
      }
      maxWidth="max-w-xl"
    >
      <ChatBox targetUsername={selectedChat} />
    </PageWithSidebar>
  );
}
