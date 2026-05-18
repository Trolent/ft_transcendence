import { API_USERS, authHeaders, handleResponse } from './config'

export type UserStats = {
  rank: number;
  avgWpm: number;
  level: number;
  gamesPlayed: number;
};

export type UserProfile = {
  id: number;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  status: string;
  language: string;
  createdAt?: string;
  stats: UserStats;
};

export type HistoryEntry = {
  wpm: number | null;
  accuracy: number | null;
  position: number | null;
  finishedAt: string | null;
  match: {
    id: number;
    startedAt: string;
    textSnippet: string;
  };
};

export async function getUserProfile(username: string): Promise<UserProfile> {
  const res = await fetch(`${API_USERS}/${encodeURIComponent(username)}`, {
    headers: authHeaders(),
  });
  return handleResponse<UserProfile>(res);
}

export async function getUserHistory(username: string): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_USERS}/${encodeURIComponent(username)}/history`, {
    headers: authHeaders(),
  });
  return handleResponse<HistoryEntry[]>(res);
}
