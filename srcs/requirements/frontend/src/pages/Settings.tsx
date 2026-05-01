import { Link } from "react-router-dom";

import { Avatar, Heading, List, Text } from "../components";
import { PageLayout } from "../layout";

const options: { name: string }[] = [
  { name: "Edit bio" },
];

export default function Leaderboard() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
      <List
        className="mt-6"
        items={options}
        renderItem={(item) => (
        <div className="flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default">
          <Text>{item.name}</Text>
        </div>
        )}
      />
    </PageLayout>
  );
}

/*export default function Leaderboard() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
      <List
       className="mt-6"
        items={players}
        renderItem={(item: { id: number; rank: number; username: string }) => (
          <div
            className="bg-muted flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
          >
          </div>
        )}
      />
    </PageLayout>
  );
}*/