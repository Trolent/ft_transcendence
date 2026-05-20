import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Btn, Text } from "@/components";
import { deleteFriend, sendFriendRequest, getFriendRelationship } from "@/api/friends";

type FriendRelationship =
  | "NONE"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "ACCEPTED"

interface FriendActionsProps {
  username: string;
  onFriendRemoved?: () => void;
}

export default function FriendActions({
  username,
  onFriendRemoved,
}: FriendActionsProps) {
  const [relationship, setRelationship] = useState<FriendRelationship>("NONE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFriendRelationship(username)
      .then((rel) => setRelationship(rel.relationship as FriendRelationship))
      .catch(() => setRelationship("NONE"))
      .finally(() => setLoading(false));
  }, [username]);

  function handleAddFriend() {
    if (loading) return;

    setError(null);
    setLoading(true);

    sendFriendRequest(username)
      .then(() => setRelationship("PENDING_SENT"))
      .catch((err: unknown) => {
        if (err instanceof Error && err.message === "REQUEST_ALREADY_SENT") {
          setRelationship("PENDING_SENT");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to send request.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleRemoveFriend() {
    if (loading) return;

    setError(null);
    setLoading(true);

    deleteFriend(username)
      .then(() => {
        setRelationship("NONE");
        onFriendRemoved?.();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to remove friend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {relationship === "ACCEPTED" ? (
          <Btn size="sm" variant="danger" onClick={handleRemoveFriend} disabled={loading}>
            Remove friend
          </Btn>
        ) : relationship === "PENDING_SENT" || relationship === "PENDING_RECEIVED" ? (
          <Btn size="sm" variant="ghost" disabled>
            Pending
          </Btn>
        ) : (
          <Btn size="sm" variant="primary" onClick={handleAddFriend} disabled={loading}>
            + Add friend
          </Btn>
        )}
        <Link to={`/chat/${username}`}>
          <Btn size="sm" variant="secondary" disabled={loading}>
            Message
          </Btn>
        </Link>
      </div>
      {error && <Text variant="error" size="xs">{error}</Text>}
    </div>
  );
}
