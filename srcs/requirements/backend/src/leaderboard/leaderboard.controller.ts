import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';
import { LeaderBoardService, LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT } from './leaderboard.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeaderboardEntryDto } from '../common/dto/leaderboard-response.dto';
import { PaginatedResponse } from '../common/dto/paginated-response.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderBoardController {
    constructor(private leaderBoardService: LeaderBoardService) {}

    @ApiOperation({ summary: 'Get leaderboard (with pagination)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiQuery({ name: 'q', required: false, description: 'Filter by username' })
    @ApiResponse({ status: 200, type: PaginatedResponse })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
    getLeaderboard(
        @Query('page')  page:  string,
        @Query('limit') limit: string,
        @Query('q')     q?:    string,
    ): Promise<PaginatedResponse<LeaderboardEntryDto>> {
        const parsedPage  = Math.max(1, parseInt(page)  || 1);
        const parsedLimit = Math.min(parseInt(limit) || LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT);
        return this.leaderBoardService.getLeaderboard(parsedPage, parsedLimit, q);
    }
}

