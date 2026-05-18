import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';
import { LeaderBoardService, LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT } from './leaderboard.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeaderboardEntryDto } from '../common/dto/leaderboard-response.dto';
<<<<<<< HEAD
=======
import { PaginatedResponse } from '../common/dto/paginated-response.dto';
>>>>>>> origin/main

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderBoardController {
    constructor(private leaderBoardService: LeaderBoardService) {}

<<<<<<< HEAD
    @ApiOperation({ summary: 'Get leaderboard' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({ status: 200, type: [LeaderboardEntryDto] })
=======
    @ApiOperation({ summary: 'Get leaderboard (with pagination)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiResponse({ status: 200, type: PaginatedResponse })
>>>>>>> origin/main
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
    getLeaderboard(
        @Query('page')  page:  string,
        @Query('limit') limit: string,
<<<<<<< HEAD
    ) {
=======
    ): Promise<PaginatedResponse<LeaderboardEntryDto>> {
>>>>>>> origin/main
        const parsedPage  = Math.max(1, parseInt(page)  || 1);
        const parsedLimit = Math.min(parseInt(limit) || LEADERBOARD_DEFAULT_LIMIT, LEADERBOARD_MAX_LIMIT);
        return this.leaderBoardService.getLeaderboard(parsedPage, parsedLimit);
    }
}
<<<<<<< HEAD
=======

>>>>>>> origin/main
