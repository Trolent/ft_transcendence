import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';

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

  async validateWsClient(client: Socket): Promise<boolean>{
    const token = client.handshake.auth?.token;
    if (!token) {
      client.disconnect();
      return false;
    }
    try {
      const payload = this.jwtService.verify<{ sub: number}>(token);
      const user = await this.validateUser(payload.sub);
      if (!user) {
        client.disconnect();
        return false;
      }
      client.data.user = user;
      return true;
    } catch {
      client.disconnect();
      return false;
    }
  }
}
