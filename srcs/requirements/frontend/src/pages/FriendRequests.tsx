import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heading, PageLayout, FindUser } from "@/components";
import { IncomingRequests, PendingRequests } from "@/features/friends";
import { sendFriendRequest } from "@/api/friends.api";

export default function FriendRequests() {
  const { t } = useTranslation('pages');
  const [pendingRefreshKey, setPendingRefreshKey] = useState(0);

  const handleSendFriendRequest = async (username: string) => {
    await sendFriendRequest(username);
    setPendingRefreshKey((k) => k + 1);
  };

  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>{t('friends.requests_title')}</Heading>
        <FindUser onAction={handleSendFriendRequest} className="mt-6"/>
        <IncomingRequests className="mt-8" />
        <PendingRequests className="mt-6" refreshKey={pendingRefreshKey} />
      </section>
    </PageLayout>
  );
}
