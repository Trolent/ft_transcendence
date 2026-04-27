import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(username: string, email: string, password?: string) {

    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    //clef pour i18next plus tard(traduction)
    if (exists){
      throw new ConflictException('USER_ALREADY_EXISTS');
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    return this.prisma.user.create({
      data: { username, email, passwordHash },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        language: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string, incPass : boolean) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash : incPass,
        avatarUrl: true,
        language: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        language: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
