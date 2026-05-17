import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Heading, List, Text } from "@/components";
import { getSentRequests } from "@/api/friends";
import type { Friend } from "./types";

interface PendingRequestsProps {
  className?: string;
}

export default function PendingRequests({ className = "" }: PendingRequestsProps) {
  const [pending, setPending] = useState<Friend[]>([]);;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSentRequests()
      .then((data) =>
        setPending(data.map((item) => ({ id: item.id, username: item.username, avatarSrc: item.avatarUrl })))
      )
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load requests."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={className}>
      <Heading level={4}>Pending [{pending.length}]</Heading>
      {loading ? (
        <Text className="mt-4" variant="muted">Loading...</Text>
      ) : error ? (
        <Text className="mt-4" variant="error">{error}</Text>
      ) : pending.length === 0 ? (
        <Text className="mt-4" variant="muted">No pending requests.</Text>
      ) : (
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
      )}
    </section>
  );
}