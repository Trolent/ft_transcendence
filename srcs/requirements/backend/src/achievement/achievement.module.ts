import { Module } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
