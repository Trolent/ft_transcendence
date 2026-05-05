import { Controller, Get, UseGuards, Param, ParseIntPipe, Query } from '@nestjs/common';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';

//AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) {}

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: SafeUser) {
        return this.UsersService.getProfile(user.id, true);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':id')
    getProfile(@Param('id', ParseIntPipe) id: number) {
        return this.UsersService.getProfile(id, false);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':id/stats')
    getStats(@Param('id', ParseIntPipe) id: number) {
        return this.UsersService.calculateStats(id);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
    getProfiles(@Query('ids') ids: string) {
    const idList = ids.split(',').map(Number).filter(Boolean);
    return this.UsersService.getProfiles(idList);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':id/history')
    getHistory(@Param('id', ParseIntPipe) id: number) {
        return this.UsersService.getHistory(id);
  }
}