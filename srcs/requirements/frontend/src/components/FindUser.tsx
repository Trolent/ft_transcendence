import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, Btn } from ".";
import { getUserProfile } from "@/api/users.api";

interface FindUserProps {
  actionBtnText: string;
  onAction: (username: string) => void | Promise<void>;
  className?: string;
}

export function FindUser({ actionBtnText, onAction, className = "" }: FindUserProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      await getUserProfile(trimmed);
    } catch {
      setError("User not found");
      setLoading(false);
      return;
    }

    try {
      await onAction(trimmed);
      setUsername("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
      <div className="flex gap-2 items-start">
        <Input
          placeholder={t("username")}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          disabled={loading}
          error={error ?? undefined}
        />
        <Btn type="submit" variant="primary" disabled={loading || !username.trim()}>
          {actionBtnText}
        </Btn>
      </div>
    </form>
  );
}
