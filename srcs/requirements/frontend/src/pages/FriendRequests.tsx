import { Heading } from "@/components";
import { IncomingRequests, PendingRequests } from "@/friends";
<<<<<<< HEAD
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

=======
import { PageLayout } from "@/layout";

>>>>>>> origin/main
export default function FriendRequests() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>Friend Requests</Heading>
<<<<<<< HEAD
        <IncomingRequests className="mt-8" requests={incomingRequests} />
        <PendingRequests className="mt-6" pending={pendingRequests} />
=======
        <IncomingRequests className="mt-8" />
        <PendingRequests className="mt-6" />
>>>>>>> origin/main
      </section>
    </PageLayout>
  );
}
