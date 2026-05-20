import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading, Text, Avatar, Alert, Status } from "@/components";
import { PageLayout, PageWithSidebar, Sidebar } from "@/layout";
import { useAuth, useIsOwnProfile } from "@/auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "../api/users";
import { FriendsList } from "@/friends";
import { FriendActions, Bio, Stats, History } from "@/profile";

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendsRefreshKey, setFriendsRefreshKey] = useState(0);

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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [targetUsername, me]);

  if (!targetUsername) return null;

  if (loading) {
    return (
      <PageLayout>
        <Alert>Loading</Alert>
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <Alert variant="error">{error ?? "User not found."}</Alert>
      </PageLayout>
    );
  }

  const createdAt = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-CA")
    : null;

  return (
    <PageWithSidebar
      sidebar={
        <Sidebar>
          <FriendsList username={targetUsername} limit={5} className="h-full" refreshKey={friendsRefreshKey} />
        </Sidebar>
      }
    >
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar username={profile.username} src={profile.avatarUrl ?? undefined} size="xl" />

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <Heading level={1}><Status status={profile.status}/> {profile.username}</Heading>
              {createdAt && (
                <Text variant="muted" size="xs">created on {createdAt}</Text>
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

        <History history={history} />

      </div>
    </PageWithSidebar>
  );
}
