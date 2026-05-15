import { Heading } from "@/components";
import { IncomingRequests, PendingRequests } from "@/friends";
import type { Friend } from "@/friends";
import { PageLayout } from "@/layout";

const incomingRequests: Friend[] = [
  { id: 3, username: "mikael" },
  { id: 4, username: "jackson" },
  { id: 5, username: "jean" },
];

const pendingRequests: Friend[] = [
  { id: 1, username: "sarah" },
  { id: 2, username: "lea" },
];

export default function FriendRequests() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>Friend Requests</Heading>
        <IncomingRequests className="mt-8" requests={incomingRequests} />
        <PendingRequests className="mt-6" pending={pendingRequests} />
      </section>
    </PageLayout>
  );
}
