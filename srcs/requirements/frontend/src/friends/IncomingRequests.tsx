import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, List, Text } from "@/components";
import { getIncomingRequests, acceptFriendRequest, declineFriendRequest } from "@/api/friends";
import type { Friend } from "./types";

interface IncomingRequestsProps {
  className?: string;
}

export default function IncomingRequests({ className = "" }: IncomingRequestsProps) {
  const [requests, setRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getIncomingRequests()
      .then((data) =>
        setRequests(data.map((item) => ({ id: item.id, username: item.username, avatarSrc: item.avatarUrl })))
      )
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load requests."))
      .finally(() => setLoading(false));
  }, []);

  function handleAccept(username: string) {
    acceptFriendRequest(username)
      .then(() => setRequests((prev) => prev.filter((r) => r.username !== username)))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to accept request."));
  }

  function handleDecline(username: string) {
    declineFriendRequest(username)
      .then(() => setRequests((prev) => prev.filter((r) => r.username !== username)))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to decline request."));
  }

  return (
    <section className={className}>
      <Heading level={4}>Incoming [{requests.length}]</Heading>
      {loading ? (
        <Text className="mt-4" variant="muted">Loading...</Text>
      ) : error ? (
        <Text className="mt-4" variant="error">{error}</Text>
      ) : requests.length === 0 ? (
        <Text className="mt-4" variant="muted">No incoming requests.</Text>
      ) : (
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
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="danger" onClick={() => handleDecline(item.username)}>Decline</Btn>
                <Btn size="sm" onClick={() => handleAccept(item.username)}>Accept</Btn>
              </div>
            </div>
          )}
        />
      )}
    </section>
  );
}