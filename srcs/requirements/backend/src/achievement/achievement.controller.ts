import { Controller, Get, Param } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserAchievementDto } from '../common/dto/achievement-response.dto';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementController {

    constructor(private achievementService: AchievementService) {}

    @ApiOperation({ summary: 'Get achievements for a user' })
    @ApiResponse({ status: 200, type: [UserAchievementDto] })
    @Throttle({ api: THROTTLE_LIMIT_API })
    @Get(':username')
    getUserAchievements(@Param('username') username: string) {
        return this.achievementService.getUserAchievements(username);
    }
}
