import { API_LEADERBOARD, authHeaders, handleResponse } from '@/api/config.api';
import type { LeaderboardEntryDto } from '@backend/common/dto/leaderboard-response.dto';

export type LeaderboardEntry = LeaderboardEntryDto;

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getLeaderboard(page = 1, limit = 20): Promise<LeaderboardResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await fetch(`${API_LEADERBOARD}?${query.toString()}`, {
    headers: authHeaders(),
  });

  return handleResponse<LeaderboardResponse>(res);
}
