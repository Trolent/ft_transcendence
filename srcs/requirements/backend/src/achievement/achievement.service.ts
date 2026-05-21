import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MatchResult } from '@prisma/client';
import { ACHIEVEMENTS } from '../common/achievements.constants';

@Injectable()
export class AchievementService implements OnModuleInit {

    constructor(
        private prisma: PrismaService,
        private users: UsersService) {}

    async onModuleInit() {
        for (const a of ACHIEVEMENTS) {
            await this.prisma.achievement.upsert({
                where:  { key: a.key },
                update: {},
                create: { ...a, iconUrl: null },
            });
        }
    }

    async checkAndUnlockAchievements(userId: number, matchResult: MatchResult) {
        
        const allResults = await this.prisma.matchResult.findMany({ where: { userId } });
        const wins = allResults.filter(r => r.position === 1);
        const toUnlock: string[] = [];

        if (allResults.length === 1) {
            toUnlock.push('first_race');
        }
        if (allResults.length >= 10) {
            toUnlock.push('veteran_10');
        }
        if (allResults.length >= 50) {
            toUnlock.push('veteran_50');
        }

        if (wins.length === 1) {
            toUnlock.push('first_win');
        }
        if (wins.length >= 3) {
            toUnlock.push('podium_3');
        }

        const wpm = matchResult.wpm ?? 0;

        if (wpm >= 50) {
            toUnlock.push('speed_50');
        }
        if (wpm >= 80) {
            toUnlock.push('speed_80');
        }
        if (wpm >= 100) {
            toUnlock.push('speed_100');
        }
        if (wpm >= 150) {
            toUnlock.push('speed_150');
        }

        const friendCount = await this.prisma.friendship.count({
            where: { OR: [{ initiatorId: userId }, { receiverId: userId }], status: 'ACCEPTED' }
        });

        if (friendCount >= 1) {
            toUnlock.push('social_1');
        }

        await this.unlockAchievements(userId, toUnlock);
    }


    private async unlockAchievements(userId: number, keys: string[]) {
        const achievements = await this.prisma.achievement.findMany({
            where: { key: { in: keys } }
        });
        for (const achievement of achievements) {
            await this.prisma.userAchievement.upsert({
                where: { userId_achievementId: { userId, achievementId: achievement.id } },
                update: {},
                create: { userId, achievementId: achievement.id },
            });
        }
    }

    async getUserAchievements(username: string) {
        const user = await this.users.findByUsername(username);
        if (!user) return [];

        return this.prisma.userAchievement.findMany({
            where: { userId: user.id },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });
    }

}
