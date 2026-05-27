import { Injectable, ConflictException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto, UpdateSettingsDto } from './dto'

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  private async HashThePass(password? : string) {
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    return passwordHash;
  }

  async create(username: string, email: string, password?: string) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) throw new ConflictException('USER_ALREADY_EXISTS');

    const passwordHash = await this.HashThePass(password);
    return this.prisma.user.create({
      data: { username, email, passwordHash },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true,
        language: true, status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true,
        avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
        passwordHash: true,
        oauthAccounts: { select: { provider: true } },
      },
    });
    if (!user)
      return null;
    const { passwordHash, oauthAccounts, ...rest } = user;
    return {
      ...rest,
      hasPassword: passwordHash !== null,
      isOAuthOnly: oauthAccounts.length > 0 && passwordHash === null,
    };
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

  // used for login with email only
  async findByEmailForLogin(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true, username: true, email: true,
        passwordHash: true, avatarUrl: true, bio: true,
        language: true, status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  // used for login with username only
  async findByUsernameForLogin(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true, username: true, email: true,
        passwordHash: true, avatarUrl: true, bio: true, language: true,
        status: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async calculateStats(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const results = await this.prisma.matchResult.findMany({
      where: { userId: user.id, wpm: { not: null } },
      select: { wpm: true },
    });

    const gamesPlayed = results.length;
    const totalWpm    = results.reduce((sum: number, r) => sum + (r.wpm ?? 0), 0);
    const avgWpm      = gamesPlayed > 0 ? Math.round(totalWpm / gamesPlayed) : 0;
    const level       = Math.floor(gamesPlayed / 3) + 1;

    const usersWithHigherWpm = await this.prisma.matchResult.groupBy({
      by: ['userId'],
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
        bio: true, status: true, createdAt: true,
        email : isOwner, language : true
      },
    });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    const stats = await this.calculateStats(username);

    return { ...user, stats };
  }

  async getProfiles(usernames: string[]) {
    return this.prisma.user.findMany({
      where: { username: { in: usernames } },
      select: {
        id: true, username: true, avatarUrl: true,
        bio: true, status: true, language: true,
        email: false, createdAt: false,
      },
    });
  }

  async getHistory(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      throw new NotFoundException('USER_NOT_FOUND');

    return this.prisma.matchResult.findMany({
      where: { userId: user.id },
      select: {
        wpm: true, position: true, finishedAt: true,
        match: {
          select: {
            id: true, startedAt: true, textSnippet: true,
            matchResult: {
              select: {
                position: true,
                wpm: true,
                user: {
                  select: { id: true, username: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
  }

  async updateAvatar(username: string, avatarUrl: string) {
    return this.prisma.user.update({
        where: { username },
        data: { avatarUrl },
        select: { avatarUrl: true },
    });
  }

  async updateProfile(username : string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { username },
      data: { bio:dto.bio },
      select: { bio:true }
    })
  }

  async updateSettings(username : string, dto: UpdateSettingsDto) {
    if (dto.password) {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: { passwordHash: true },
      });
      if (user?.passwordHash) {
        if (!dto.currentPassword)
          throw new BadRequestException('CURRENT_PASSWORD_REQUIRED');
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid)
          throw new UnauthorizedException('INVALID_CURRENT_PASSWORD');
      }
    }

    const passHashed = await this.HashThePass(dto.password);
    try {
      return await this.prisma.user.update({
        where: { username },
        data: {
          email: dto.email,
          ...(dto.password && { passwordHash: passHashed }),
          language: dto.language,
        },
        select: { email: true, language: true },
      });
    } catch (error: any) {
      if (error.code === 'P2002')
        throw new ConflictException('EMAIL_ALREADY_TAKEN');
      throw error;
    }
  }
}
