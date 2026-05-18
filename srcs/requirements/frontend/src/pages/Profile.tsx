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
  StatDivider,
  Alert
} from "@/components";
import { PageLayout, PageWithSidebar, Sidebar } from "@/layout";
import { useAuth, useIsOwnProfile } from "@/auth";
import { getUserProfile, getUserHistory, type UserProfile, type HistoryEntry } from "../api/users";
import { deleteFriend, getFriendRelationship, sendFriendRequest } from "../api/friends";
import { FriendsList } from "@/friends";

type FriendRelationship = "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "ACCEPTED" | "BLOCKED_BY_ME" | "BLOCKED_BY_THEM";

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [relationship, setRelationship] = useState<FriendRelationship>("NONE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  function handleAddFriend() {
    if (!profile) return;
    setAddError(null);
    sendFriendRequest(profile.username)
      .then(() => setRelationship("PENDING_SENT"))
      .catch((err: unknown) => {
        if (err instanceof Error && err.message === "REQUEST_ALREADY_SENT") {
          setRelationship("PENDING_SENT");
          return;
        }
        setAddError(err instanceof Error ? err.message : "Failed to send request.");
      });
  }

  function handleRemoveFriend() {
    if (!profile) return;
    setAddError(null);
    deleteFriend(profile.username).then(() => {
      setRelationship("NONE");
    }).catch((err: unknown) => {
      setAddError(err instanceof Error ? err.message : "Failed to remove friend.");
    });
  }

  const targetUsername = username ?? me?.username;
  const isOwnProfile = useIsOwnProfile(targetUsername);

  useEffect(() => {
    if (!targetUsername) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getUserProfile(targetUsername),
      getUserHistory(targetUsername),
      me && targetUsername !== me.username ? getFriendRelationship(targetUsername) : Promise.resolve({ relationship: "NONE" as const }),
    ])
      .then(([prof, hist, rel]) => {
        setProfile(prof);
        setHistory(hist);
        setRelationship(rel.relationship as FriendRelationship);
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
          <FriendsList username={targetUsername} limit={5} className="h-full" />
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
              <div className="flex flex-wrap gap-2">
                {relationship === "ACCEPTED" ? (
                  <Btn size="sm" variant="danger" onClick={handleRemoveFriend}>Remove friend</Btn>
                ) : relationship === "PENDING_SENT" || relationship === "PENDING_RECEIVED" ? (
                  <Btn size="sm" variant="ghost" disabled>Pending</Btn>
                ) : (
                  <Btn size="sm" variant="primary" onClick={handleAddFriend}>+ Add friend</Btn>
                )}
                <Btn size="sm" variant="secondary">Message</Btn>
              </div>
            )}
            {addError && <Text variant="error" size="xs">{addError}</Text>}
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

      </div>
    </PageWithSidebar>
  );
}
