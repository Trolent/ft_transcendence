import { useTranslation } from "react-i18next";
import { Heading, PageLayout, FindUser } from "@/components";
import { IncomingRequests, PendingRequests } from "@/features/friends";
import { sendFriendRequest } from "@/api/friends.api";

export default function FriendRequests() {
  const { t } = useTranslation('pages');

  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>{t('friends.requests_title')}</Heading>
        <FindUser
          actionBtnText={t('profile.add_friend_short')}
          onAction={sendFriendRequest}
          className="mt-6"
        />
        <IncomingRequests className="mt-8" />
        <PendingRequests className="mt-6" />
      </section>
    </PageLayout>
  );
}
