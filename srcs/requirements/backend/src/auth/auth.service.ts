import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client'
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async register(username: string, email: string, password: string) {
    return this.usersService.create(username, email, password);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email, true);
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('INVALID_CREDENTIALS');

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch)
      throw new UnauthorizedException('INVALID_CREDENTIALS');

    const payload = { sub: user.id };

    await this.prisma.user.update({
        where: { id: user.id },
        data: { status: UserStatus.ONLINE }
    });

    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }

  async logout(userId: number) {
    await this.prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.OFFLINE }
    });
    return { message: 'LOGOUT_SUCCESS' };
  }
}
