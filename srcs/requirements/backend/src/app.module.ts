import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { THROTTLE_LIMIT_AUTH, THROTTLE_LIMIT_API } from './common/throttle.constants';
import { FriendsModule } from './friends/friends.module';
import { StatusModule } from './status/status.module';


@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'auth', ...THROTTLE_LIMIT_AUTH },
      { name: 'api',  ...THROTTLE_LIMIT_API },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    LeaderBoardModule,
    FriendsModule,
    StatusModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
