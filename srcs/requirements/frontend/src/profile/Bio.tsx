import { useState, useEffect } from "react";
import TextArea, { Btn, Container, Text } from "@/components";
import { updateMyBio } from "@/api/users";

interface BioProps {
  bio: string | null;
  isOwnProfile: boolean;
  onBioChange: (bio: string) => void;
}

export default function Bio({ bio, isOwnProfile, onBioChange }: BioProps) {
  const [bioDraft, setBioDraft] = useState(bio ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBioDraft(bio ?? "");
    setIsEditing(false);
    setError(null);
  }, [bio]);

  function handleSave() {
    if (saving) return;

    setError(null);
    setSaving(true);

    updateMyBio(bioDraft)
      .then((result) => {
        onBioChange(result.bio ?? "");
        setIsEditing(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to update bio.");
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <Container label="bio" variant="panel">
      {isOwnProfile ? (
        isEditing ? (
          <div className="flex flex-col gap-3">
            <TextArea
              value={bioDraft}
              onChange={(event) => setBioDraft(event.target.value)}
              placeholder="Write your bio..."
              rows={5}
              maxLength={200}
            />
            {error && <Text variant="error" size="xs">{error}</Text>}
            <div className="flex justify-end gap-2">
              <Btn
                size="sm"
                variant="ghost"
                onClick={() => {
                  setBioDraft(bio ?? "");
                  setError(null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Btn>
              <Btn size="sm" variant="primary" onClick={handleSave} disabled={saving}>
                Save bio
              </Btn>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Text>{bio ?? "No bio yet."}</Text>
            <div className="flex justify-end">
              <Btn size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                Edit bio
              </Btn>
            </div>
          </div>
        )
      ) : (
        <Text>{bio ?? "No bio yet."}</Text>
      )}
    </Container>
  );
}
