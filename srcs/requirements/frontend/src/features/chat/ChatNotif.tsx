import { Link } from "react-router-dom";
import { useChatCtx } from "@/features/chat";

export function ChatNotif() {
  const { unreadMessages } = useChatCtx();

  //if (unreadMessages === 0) return null;

  return (
    <Link
      to="/chat"
      className="flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-dim hover:text-default hover:bg-muted transition-colors duration-100"
    >
      ✉️ [{unreadMessages}]
    </Link>
  );
}
