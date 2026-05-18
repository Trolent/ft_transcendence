import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AsyncApiController } from './asyncapi/asyncapi.controller';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { UsersModule } from './users/users.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { THROTTLE_LIMIT_AUTH, THROTTLE_LIMIT_API, THROTTLE_LIMIT_UP_AVATAR, THROTTLE_LIMIT_SETTINGS, THROTTLE_LIMIT_CHAT } from './common/throttle.constants';
import { FriendsModule } from './friends/friends.module';
import { StatusModule } from './status/status.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'auth', ...THROTTLE_LIMIT_AUTH },
      { name: 'api',  ...THROTTLE_LIMIT_API },
      { name: 'up_avatar', ...THROTTLE_LIMIT_UP_AVATAR },
      { name: 'settings', ...THROTTLE_LIMIT_SETTINGS },
      { name: 'chat', ...THROTTLE_LIMIT_CHAT },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    LeaderBoardModule,
    GameModule,
    FriendsModule,
    StatusModule,
    ChatModule
  ],
  controllers: [AsyncApiController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
