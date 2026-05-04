import { Link } from "react-router-dom";

import { Avatar, Heading, List, Text } from "../components";
import { PageLayout } from "../layout";

const options: { id: number; name: string }[] = [
  { id: 1, name: "Edit bio" },
  { id: 2, name: "Game mode" },
  { id: 3, name: "Language" },
];

export default function Leaderboard() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
      <List
        className="mt-6"
        containerVariant="panel"
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
