import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, List, Text } from "@/components";
import type { Friend } from "./types";

interface IncomingRequestsProps {
  requests?: Friend[];
  className?: string;
  onAccept?: (request: Friend) => void;
}

export default function IncomingRequests({
  requests = [],
  className = "",
  onAccept,
}: IncomingRequestsProps) {
  return (
    <section className={className}>
      <Heading level={4}>Requests [3]</Heading>
      <List
        className="mt-4"
        items={requests}
        renderItem={(item: Friend) => (
          <div className="flex items-center justify-between gap-4">
            <Link
              to={`/profile/${item.username}`}
              className="flex min-w-0 items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
            >
              <Avatar username={item.username} src={item.avatarSrc} size="sm" />
              <Text>{item.username}</Text>
            </Link>
            <Btn size="sm" onClick={() => onAccept?.(item)}>
              Accept
            </Btn>
          </div>
        )}
      />
    </section>
  );
}