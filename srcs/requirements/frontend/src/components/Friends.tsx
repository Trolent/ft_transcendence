import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
import { Heading } from "./Heading";
import { List } from "./List";
import { Text } from "./Text";

type Friend = {
  id: number;
  username: string;
  avatarSrc?: string | null;
};

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

export default function Friends({
  friends = fakeFriends,
  limit,
  className = "",
}: FriendsProps) {
  const displayedFriends = typeof limit === "number" ? friends.slice(0, limit) : friends;

  return (
    <section className={className}>
      <Heading level={3}>Friends</Heading>
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
    </section>
  );
}
