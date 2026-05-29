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
      <span className="relative">
        ✉️
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500" />
        )}
      </span>
    </Link>
  );
}