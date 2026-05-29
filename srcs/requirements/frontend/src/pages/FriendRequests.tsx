import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, PageLayout, SearchList, Status, Text } from "@/components";
import { IncomingRequests, PendingRequests } from "@/features/friends";
import { sendFriendRequest } from "@/api/friends.api";
import { searchUsers, type UserSearchResult } from "@/api/users.api";
import { tError } from "@/features/i18n";
import { useStatus } from "@/hooks/useStatus";
import { useAuth } from "@/features/auth";

export default function FriendRequests() {
  const { t } = useTranslation('pages');
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const getStatus = useStatus();
  const {user: currentUser } = useAuth();
  const handleAddFriend = useCallback(async (user: UserSearchResult) => {
    setActionError(null);
    try {
      await sendFriendRequest(user.username);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      const message = err instanceof Error ? tError(err.message, t) : t('profile.error_add');
      setActionError(message);
    }
  }, [t]);

  const renderItem = useCallback((item: UserSearchResult) => (
    <div className="flex items-center gap-3 px-1 py-0.5">
      <Link
        to={`/profile/${item.username}`}
        className="flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
      >
        <Avatar username={item.username} src={item.avatarUrl} size="sm" />
        <span className="font-mono text-sm text-default truncate">{item.username}</span>
        <Status status={getStatus(item.status, item.id as number, item.username)} />
      </Link>
      <Btn variant="primary" size="sm" onClick={() => handleAddFriend(item)}>
        {t('profile.add_friend_short')}
      </Btn>
    </div>
  ), [t, getStatus, handleAddFriend]);

  return (
    <PageLayout maxWidth="max-w-lg">
      <section>
        <Heading level={3}>{t('friends.requests_title')}</Heading>
        <div className="mt-6">
          <SearchList
            fetchFn={searchUsers}
            renderItem={renderItem}
            excludeUsername={currentUser?.username}
          />
          {actionError && (
            <Text variant="error" className="mt-2 text-sm">{actionError}</Text>
          )}
        </div>
        <IncomingRequests className="mt-8" refreshKey={refreshKey} />
        <PendingRequests className="mt-6" />
      </section>
    </PageLayout>
  );
}
