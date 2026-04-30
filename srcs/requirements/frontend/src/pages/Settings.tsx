import { Link } from "react-router-dom";

import { Avatar, Heading, List, Text } from "../components";
import { PageLayout } from "../layout";

const players: { id: number; rank: number; username: string }[] = [
  { id: 1, rank: 1, username: "jean" },
  { id: 2, rank: 2, username: "claire" },
  { id: 3, rank: 3, username: "pierre" },
  { id: 4, rank: 4, username: "emma" },
  { id: 6, rank: 6, username: "samuel" },
];

export default function Settings() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
      <List
       className="mt-6"
        items={players}
        renderItem={(item: { id: number; rank: number; username: string }) => (
          <Link
            to={`/profile/${item.username}`}
            className="flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
          >
            <Heading level={4}>#{item.rank}</Heading>
            <Avatar username={item.username} size="sm" />
            <Text>{item.username}</Text>
          </Link>
        )}
      />
    </PageLayout>
  );
}
