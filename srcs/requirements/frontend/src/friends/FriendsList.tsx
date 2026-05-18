<<<<<<< HEAD
import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, List, Text } from "@/components";
import type { Friend } from "./types";

interface FriendsProps {
  friends?: Friend[];
  limit?: number;
  className?: string;
}

const fakeFriends: Friend[] = [
  { id: 1, username: "alice" },
  { id: 2, username: "mario" },
  { id: 3, username: "zoe" },
  { id: 4, username: "nicolas" },
  { id: 5, username: "lea" },
];

export default function FriendsList({
  friends = fakeFriends,
  limit,
  className = "",
}: FriendsProps) {
=======
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, List, Text } from "@/components";
import { useIsOwnProfile } from "@/auth";
import { getFriends } from "@/api/friends";
import type { Friend } from "./types";

interface FriendsListProps {
  username: string;
  limit?: number;
  className?: string;
  refreshKey?: number;
}

export default function FriendsList({
  username,
  limit,
  className = "",
  refreshKey,
}: FriendsListProps) {
  const isOwnProfile = useIsOwnProfile(username);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getFriends(username)
      .then((data) => {
        if (cancelled) return;
        setFriends(
          data.map((item) => ({
            id: item.id,
            username: item.username,
            avatarSrc: item.avatarUrl,
          })),
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Unable to load friends.";
        setError(message);
        setFriends([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, refreshKey, username]);

>>>>>>> origin/main
  const displayedFriends = typeof limit === "number" ? friends.slice(0, limit) : friends;

  return (
    <section className={className}>
<<<<<<< HEAD
      <div className="flex items-center justify-between mt-10 sm:mt-0">
        <Heading level={3} className="sm:text-2xl">Friends [26]</Heading>
        <Btn as={Link} to="/friends/requests" variant="ghost" size="sm">
          Requests
        </Btn>
      </div>
      <List
        className="mt-6"
        items={displayedFriends}
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
=======
      <div className="flex items-center justify-between">
        <Heading level={3}>Friends [{friends.length}]</Heading>
        {isOwnProfile && (
          <Btn as={Link} to="/friends/requests" variant="ghost" size="sm">
            Requests
          </Btn>
        )}
      </div>
      {loading ? (
        <Text className="mt-6" variant="muted">
          Loading...
        </Text>
      ) : error ? (
        <Text className="mt-6" variant="error">
          {error}
        </Text>
      ) : displayedFriends.length === 0 ? (
        <Text className="mt-6" variant="muted">
          No friends yet.
        </Text>
      ) : (
        <List
          className="mt-6"
          items={displayedFriends}
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
>>>>>>> origin/main
    </section>
  );
}
