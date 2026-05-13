const API_BASE = '/api/users';

const TOKEN_KEY = 'transcendence';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trimStart().startsWith('{') && !text.trimStart().startsWith('[')) {
    throw new Error(`HTTP ${res.status} — response not JSON: ${text.slice(0, 200)}`);
  }
  const data = JSON.parse(text);
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(msg ?? `HTTP ${res.status}`);
  }
  return data as T;
}

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
  const res = await fetch(`${API_BASE}/${encodeURIComponent(username)}`, {
    headers: authHeaders(),
  });
  return handleResponse<UserProfile>(res);
}

export async function getUserHistory(username: string): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(username)}/history`, {
    headers: authHeaders(),
  });
  return handleResponse<HistoryEntry[]>(res);
}
