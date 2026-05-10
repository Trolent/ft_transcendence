import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const LEADERBOARD_DEFAULT_LIMIT = 20;
export const LEADERBOARD_MAX_LIMIT = 100;

@Injectable()
export class LeaderBoardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(page: number, limit: number) {
    const safeLimit = Math.min(limit, LEADERBOARD_MAX_LIMIT);
    const offset   = (page - 1) * safeLimit;

    const grouped = await this.prisma.matchResult.groupBy({
      by: ['userId'],
      _avg: { wpm: true },
      _count: { id: true },
      orderBy: { _avg: { wpm: 'desc' } },
      skip: offset,
      take: safeLimit,
    });

    const userIds = grouped.map((r: typeof grouped[number]) => r.userId);
    const users   = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, avatarUrl: true, language: true },
    });

    type UserRow = { id: number; username: string; avatarUrl: string | null; language: string };
    const userMap = new Map<number, UserRow>(users.map((u: UserRow) => [u.id, u]));

    return grouped.map((r: typeof grouped[number], i: number) => {
      const user       = userMap.get(r.userId);
      const gamesPlayed = r._count.id;
      const avgWpm     = r._avg.wpm ? Math.round(r._avg.wpm) : 0;
      const level      = Math.floor(gamesPlayed / 3) + 1;

      return {
        rank: offset + i + 1,
        username: user?.username ?? 'unknown',
        avatarUrl: user?.avatarUrl ?? null,
        language: user?.language ?? 'EN',
        avgWpm,
        gamesPlayed,
        level,
      };
    });
  }
}
