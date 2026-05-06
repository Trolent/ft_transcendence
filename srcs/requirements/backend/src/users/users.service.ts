import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(username: string, email: string, password?: string) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) throw new ConflictException('USER_ALREADY_EXISTS');

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    return this.prisma.user.create({
      data: { username, email, passwordHash },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async findByEmail(email: string, incPass: boolean) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true, username: true, email: true,
        passwordHash: incPass, avatarUrl: true, bio: true,
        language: true, status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async calculateStats(username: string) {
    const results = await this.prisma.matchResult.findMany({
      where: { username, wpm: { not: null } },
      select: { wpm: true },
    });

    const gamesPlayed = results.length;
    const totalWpm    = results.reduce((sum: number, r) => sum + (r.wpm ?? 0), 0);
    const avgWpm      = gamesPlayed > 0 ? Math.round(totalWpm / gamesPlayed) : 0;
    const level       = Math.floor(gamesPlayed / 3) + 1;

    const usersWithHigherWpm = await this.prisma.matchResult.groupBy({
      by: ['username'],
      _avg: { wpm: true },
      having: { wpm: { _avg: { gt: avgWpm } } },
    });
    const rank = usersWithHigherWpm.length + 1;

    return { rank, avgWpm, level, gamesPlayed };
  }


  async getProfile(username: string, isOwner = false) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, avatarUrl: true,
        bio: true, status: true, createdAt: isOwner,
        email : isOwner, language : true
      },
    });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const stats = await this.calculateStats(username);

    return { ...user, stats };
  }

  async getProfiles(ids : number[]){
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true, username: true, avatarUrl: true,
        bio: true, status: true, language : true,
        email : false, createdAt : false
      },
    });
  }

  async getHistory(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return this.prisma.matchResult.findMany({
      where: { username: username },
      select: {
        wpm: true, accuracy: true, position: true, finishedAt: true,
        match: { select: { id: true, startedAt: true, textSnippet: true } },
      },
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
  }
}
