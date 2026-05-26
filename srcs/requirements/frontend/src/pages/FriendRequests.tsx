import { useTranslation } from "react-i18next";
import { Heading, PageLayout } from "@/components";
import { IncomingRequests, PendingRequests } from "@/features/friends";

export default function FriendRequests() {
  const { t } = useTranslation('pages');

  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>{t('friends.requests_title')}</Heading>
        <IncomingRequests className="mt-8" />
        <PendingRequests className="mt-6" />
      </section>
    </PageLayout>
  );
}
