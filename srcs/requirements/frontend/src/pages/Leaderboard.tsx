import { Heading, List, Text } from "../components";
import { PageLayout } from "../layout";

const players: { id: number; rank: number; username: string }[] = [
  { id: 1, rank: 1, username: "Jean" },
  { id: 2, rank: 2, username: "Jacques" },
  { id: 3, rank: 3, username: "Pierre" },
];

export default function Leaderboard() {
  return (
    <PageLayout>
      <Heading level={2}>LEADERBOARD</Heading>
      <List
        items={players}
        renderItem={(item: { id: number; rank: number; username: string }) => (
          <div className="flex items-center gap-4">
            <Heading level={4}>#{item.rank}</Heading>
            <Text>{item.username}</Text>
          </div>
        )}
      />
    </PageLayout>
  );
}
