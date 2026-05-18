import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule],
  providers: [GameService, GameGateway, WsJwtGuard],
})
export class GameModule {}
