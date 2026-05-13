import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Btn,
  Container,
  Heading,
  Text,
  Avatar,
  StatCard,
  StatItem,
  StatDivider
} from "../components";
import { PageLayout } from "../layout";
import { useAuth } from "../auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "../api/users";

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUsername = username ?? me?.username;

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
  }, [targetUsername]);

  if (!targetUsername) return null;

  if (loading) {
    return (
      <PageLayout maxWidth="max-w-lg">
        <Text variant="muted">Loading...</Text>
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout maxWidth="max-w-lg">
        <Text variant="muted">{error ?? "User not found."}</Text>
      </PageLayout>
    );
  }

  const isOwnProfile = me?.username === profile.username;

  const createdAt = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-CA")
    : null;

  return (
    <PageLayout maxWidth="max-w-lg">
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
            {!isOwnProfile && (
              <div className="flex flex-wrap gap-2">
                <Btn size="sm" variant="primary">+ Add friend</Btn>
                <Btn size="sm" variant="secondary">Message</Btn>
              </div>
            )}
          </div>
        </div>

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
              {history.map((entry, i) => (
                <div key={i} className="flex justify-between text-sm">
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

      </div>
    </PageLayout>
  );
}
