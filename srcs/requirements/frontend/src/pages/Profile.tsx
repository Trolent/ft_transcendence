import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heading, Text, Avatar, Alert, Status, PageLayout, PageWithSidebar, Sidebar } from "@/components";
import { tError } from "@/features/i18n";
import { useAuth, useIsOwnProfile } from "@/features/auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "@/api/users.api";
import { FriendsList } from "@/features/friends";
import { FriendActions, Bio, Stats, History, AvatarUpload, Achievements } from "@/features/profile";
import { useStatus } from "@/hooks/useStatus";

export default function Profile() {
  const { t } = useTranslation('pages');
  const { username } = useParams<{ username?: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendsRefreshKey, setFriendsRefreshKey] = useState(0);
  const getStatus = useStatus();

  const targetUsername = username ?? me?.username;
  const isOwnProfile = useIsOwnProfile(targetUsername);

  useEffect(() => {
    if (!targetUsername) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getUserProfile(targetUsername),
      getUserHistory(targetUsername),
    ])
      .then(([prof, hist]) => {
        setProfile(prof);
        setHistory(hist);
      })
      .catch((err) => setError(tError(err.message, t)))
      .finally(() => setLoading(false));
  }, [targetUsername, me]);

  if (!targetUsername) return null;

  if (loading) {
    return (
      <PageLayout>
        <Alert>{t('profile.loading')}</Alert>
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <Alert variant="error">{error ?? t('profile.not_found')}</Alert>
      </PageLayout>
    );
  }

  const createdAt = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-CA")
    : null;

  const displayedStatus = getStatus(profile.status, profile.id, profile.username);

  return (
    <PageWithSidebar
      sidebar={
        <Sidebar>
          <FriendsList username={targetUsername} limit={5} className="h-full" refreshKey={friendsRefreshKey} showRequestsBtn />
        </Sidebar>
      }
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row items-start gap-5">
          {isOwnProfile ? (
            <AvatarUpload
              username={profile.username}
              src={profile.avatarUrl}
              onAvatarChange={(url) => setProfile((prev) => prev ? { ...prev, avatarUrl: url } : prev)}
            />
          ) : (
            <Avatar username={profile.username} src={profile.avatarUrl ?? undefined} size="xl" />
          )}

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <Heading level={1}><Status status={displayedStatus} hoverText={displayedStatus}/> {profile.username}</Heading>
              {createdAt && (
                <Text variant="muted" size="xs">{t('profile.created_on', { date: createdAt })}</Text>
              )}
            </div>
            {me != null && !isOwnProfile && (
              <FriendActions
                username={profile.username}
                onFriendRemoved={() => setFriendsRefreshKey((prev) => prev + 1)}
              />
            )}
          </div>
        </div>

        <Bio
          bio={profile.bio ?? null}
          isOwnProfile={isOwnProfile}
          onBioChange={(bio) => setProfile((prev) => prev ? { ...prev, bio } : prev)}
        />

        <Stats stats={profile.stats} />

        <Achievements achievements={profile.achievements} />

        <History history={history} />

      </div>
    </PageWithSidebar>
  );
}
