import { Heading } from "@/components";
import { IncomingRequests, PendingRequests } from "@/friends";
import { PageLayout } from "@/layout";

export default function FriendRequests() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>Friend Requests</Heading>
        <IncomingRequests className="mt-8" />
        <PendingRequests className="mt-6" />
      </section>
    </PageLayout>
  );
}
