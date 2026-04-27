import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }
}
