import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Btn, Heading, List, Status, Text } from "@/components";
import { useTranslation } from "react-i18next";
import { tError } from "../i18n";
import { useIsOwnProfile } from "@/auth";
import { getFriends } from "@/api/friends";
import { useStatus } from "@/hooks/useStatus";
import type { Friend } from "./types";

interface FriendsListProps {
  username: string;
  limit?: number;
  className?: string;
  refreshKey?: number;
}

export default function FriendsList({
  username,
  limit,
  className = "",
  refreshKey,
}: FriendsListProps) {
  const { t } = useTranslation('pages');
  const isOwnProfile = useIsOwnProfile(username);
  const getStatus = useStatus();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getFriends(username)
      .then((data) => {
        if (cancelled) return;
        setFriends(
          data.map((item) => {
            return {
              id: item.id,
              username: item.username,
              avatarSrc: item.avatarUrl,
              status: getStatus(item.status, item.id, item.username),
            };
          }),
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? tError(err.message, t) : t('friends.error_load');
        setError(message);
        setFriends([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [getStatus, isOwnProfile, refreshKey, username]);

  const displayedFriends = typeof limit === "number" ? friends.slice(0, limit) : friends;

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <Heading level={3}>{t('friends.list_heading', { count: friends.length })}</Heading>
        {isOwnProfile && (
          <Btn as={Link} to="/friends/requests" variant="ghost" size="sm">
            {t('nav:requests')}
          </Btn>
        )}
      </div>
      {loading ? (
        <Text className="mt-6" variant="muted">
          {t('common:loading')}
        </Text>
      ) : error ? (
        <Text className="mt-6" variant="error">
          {error}
        </Text>
      ) : displayedFriends.length === 0 ? (
        <Text className="mt-6" variant="muted">
          {t('friends.no_friends')}
        </Text>
      ) : (
        <List
          className="mt-6"
          items={displayedFriends}
          renderItem={(item: Friend) => (
            <Link
              to={`/profile/${item.username}`}
              className="flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
            >
              <Avatar username={item.username} src={item.avatarSrc} size="sm" />
              <Text>
                <Status status={item.status} hoverText={item.status} /> {item.username}
              </Text>
            </Link>
          )}
        />
      )}
    </section>
  );
}
