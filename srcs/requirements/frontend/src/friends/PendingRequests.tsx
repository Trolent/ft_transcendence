import { Link } from "react-router-dom";
import { Avatar, Heading, List, Text } from "@/components";
import type { Friend } from "./types";

interface PendingRequestsProps {
  pending?: Friend[];
  className?: string;
}

export default function PendingRequests({
  pending = [],
  className = "",
}: PendingRequestsProps) {
  return (
    <section className={className}>
      <Heading level={4}>Pending [2]</Heading>
      <List
        className="mt-4"
        items={pending}
        renderItem={(item: Friend) => (
          <Link
            to={`/profile/${item.username}`}
            className="flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
          >
            <Avatar username={item.username} src={item.avatarSrc} size="sm" />
            <Text>{item.username}</Text>
          </Link>
        )}
      />
    </section>
  );
}