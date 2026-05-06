import { Controller, Get, UseGuards, Param, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';

//AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

const MAX_PROFILES_REQUEST = 70;

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) {}

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: SafeUser) {
        return this.UsersService.getProfile(user.username, true);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username')
    getProfile(@Param('username') username: string) {
        return this.UsersService.getProfile(username, false);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username/stats')
    getStats(@Param('username') username: string) {
        return this.UsersService.calculateStats(username);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
        getProfiles(@Query('users') users: string) {
        if (!users) throw new BadRequestException('MISSING_USERS_PARAM');
        const usernameList = users.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_PROFILES_REQUEST);
        return this.UsersService.getProfiles(usernameList);
    }


    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username/history')
    getHistory(@Param('username') username: string) {
        return this.UsersService.getHistory(username);
  }
}