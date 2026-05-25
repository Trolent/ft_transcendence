import { useCallback } from "react";
import { useAuth } from "@/auth";
import type { UserStatus } from "@backend/common/types";

export function useStatus() {
  const { user, liveStatuses } = useAuth();

  return useCallback(
    (
      persistedStatus: string | null | undefined,
      userId?: number,
      username?: string,
    ): UserStatus => {
      if (userId != null && liveStatuses[userId]) {
        return liveStatuses[userId];
      }

      // fix: keep local user ONLINE (bug: user appears OFFLINE after refresh)
      if (userId != null && userId === user?.id) return "ONLINE";
      if (username != null && username === user?.username) return "ONLINE";

      if (persistedStatus === "ONLINE") return "ONLINE";
      if (persistedStatus === "IN_GAME") return "IN_GAME";
      return "OFFLINE";
    },
    [liveStatuses, user],
  );
}