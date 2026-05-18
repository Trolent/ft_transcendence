import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';
import { LeaderBoardService, LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT } from './leaderboard.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeaderboardEntryDto } from '../common/dto/leaderboard-response.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderBoardController {
    constructor(private leaderBoardService: LeaderBoardService) {}

    @ApiOperation({ summary: 'Get leaderboard' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({ status: 200, type: [LeaderboardEntryDto] })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
    getLeaderboard(
        @Query('page')  page:  string,
        @Query('limit') limit: string,
    ) {
        const parsedPage  = Math.max(1, parseInt(page)  || 1);
        const parsedLimit = Math.min(parseInt(limit) || LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT);
        return this.leaderBoardService.getLeaderboard(parsedPage, parsedLimit);
    }
}
