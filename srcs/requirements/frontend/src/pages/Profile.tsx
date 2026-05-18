import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import {
  Btn,
  Container,
  Heading,
  Text,
  Avatar,
  StatCard,
  StatItem,
  StatDivider
} from "@/components";
import { PageWithSidebar, Sidebar } from "@/layout";
import { useAuth } from "@/auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "../api/users";
import { FriendsList } from "@/friends";
=======
import { Heading, Text, Avatar, Alert } from "@/components";
import { PageLayout, PageWithSidebar, Sidebar } from "@/layout";
import { useAuth, useIsOwnProfile } from "@/auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "../api/users";
import { FriendsList } from "@/friends";
import { FriendActions, Bio, Stats, History } from "@/profile";
>>>>>>> origin/main

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD

  const targetUsername = username ?? me?.username;
=======
  const [friendsRefreshKey, setFriendsRefreshKey] = useState(0);

  const targetUsername = username ?? me?.username;
  const isOwnProfile = useIsOwnProfile(targetUsername);
>>>>>>> origin/main

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
<<<<<<< HEAD
  }, [targetUsername]);
=======
  }, [targetUsername, me]);
>>>>>>> origin/main

  if (!targetUsername) return null;

  if (loading) {
    return (
<<<<<<< HEAD
      <PageWithSidebar
        sidebar={
          <Sidebar>
            <FriendsList limit={5} className="h-full" />
          </Sidebar>
        }
      >
        <Text variant="muted">Loading...</Text>
      </PageWithSidebar>
=======
      <PageLayout>
        <Alert>Loading</Alert>
      </PageLayout>
>>>>>>> origin/main
    );
  }

  if (error || !profile) {
    return (
<<<<<<< HEAD
      <PageWithSidebar
        sidebar={
          <Sidebar>
            <FriendsList limit={5} className="h-full" />
          </Sidebar>
        }
      >
        <Text variant="muted">{error ?? "User not found."}</Text>
      </PageWithSidebar>
    );
  }

  const isOwnProfile = me?.username === profile.username;

=======
      <PageLayout>
        <Alert variant="error">{error ?? "User not found."}</Alert>
      </PageLayout>
    );
  }

>>>>>>> origin/main
  const createdAt = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-CA")
    : null;

  return (
    <PageWithSidebar
      sidebar={
        <Sidebar>
<<<<<<< HEAD
          <FriendsList limit={5} className="h-full" />
=======
          <FriendsList username={targetUsername} limit={5} className="h-full" refreshKey={friendsRefreshKey} />
>>>>>>> origin/main
        </Sidebar>
      }
    >
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar username={profile.username} src={profile.avatarUrl ?? undefined} size="xl" />

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <Heading level={1}>{profile.username}</Heading>
              {createdAt && (
                <Text variant="muted" size="xs">created on {createdAt}</Text>
              )}
            </div>
            {me != null && !isOwnProfile && (
<<<<<<< HEAD
              <div className="flex flex-wrap gap-2">
                <Btn size="sm" variant="primary">+ Add friend</Btn>
                <Btn size="sm" variant="secondary">Message</Btn>
              </div>
=======
              <FriendActions
                username={profile.username}
                onFriendRemoved={() => setFriendsRefreshKey((prev) => prev + 1)}
              />
>>>>>>> origin/main
            )}
          </div>
        </div>

<<<<<<< HEAD
        <Container label="bio" variant="panel">
          <Text>{profile.bio ?? "No bio yet."}</Text>
        </Container>

        <StatCard label="statistics">
          <StatItem label="Rank" value={`#${profile.stats.rank}`} accent />
          <StatDivider />
          <StatItem label="Avg WPM" value={String(profile.stats.avgWpm)} />
          <StatDivider />
          <StatItem label="Level" value={String(profile.stats.level)} />
          <StatDivider />
          <StatItem label="Played" value={String(profile.stats.gamesPlayed)} />
        </StatCard>

        <Container label="history">
          {history.length === 0 ? (
            <Text variant="muted">No game played.</Text>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((entry) => (
                <div key={entry.match.id} className="flex justify-between text-sm">
                  <Text size="sm" variant="muted">
                    {entry.finishedAt
                      ? new Date(entry.finishedAt).toLocaleDateString("fr-CA")
                      : "—"}
                  </Text>
                  <Text size="sm">{entry.wpm != null ? `${Math.round(entry.wpm)} WPM` : "—"}</Text>
                  <Text size="sm">{entry.accuracy != null ? `${Math.round(entry.accuracy)}%` : "—"}</Text>
                  <Text size="sm" variant="muted">#{entry.position ?? "—"}</Text>
                </div>
              ))}
            </div>
          )}
        </Container>
=======
        <Bio
          bio={profile.bio ?? null}
          isOwnProfile={isOwnProfile}
          onBioChange={(bio) => setProfile((prev) => prev ? { ...prev, bio } : prev)}
        />

        <Stats stats={profile.stats} />

        <History history={history} />
>>>>>>> origin/main

      </div>
    </PageWithSidebar>
  );
}
