import {
    Controller,
    Get,
    UseGuards,
    Param,
    Post,
    Patch,
    Body,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { FriendsService } from './friends.service';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API } from '../common/throttle.constants';

//AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

//DTO
import { CreateFriendRequestDto } from './dto'

import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types'

@Controller('friends')
export class FriendsController {
    constructor(
        private FriendsService: FriendsService,
    ) {}

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('/')
    getMyFriends(@CurrentUser() user:SafeUser) {
        return this.FriendsService.getMyFriends(user);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get(':username/relationship')
    getFriendRelationship(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.getFriendRelationship(user, username);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('/requests')
    getFriendRequests(@CurrentUser() user:SafeUser) {
        return this.FriendsService.getFriendRequests(user);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('/requests/sent')
    getFriendRequestsSent(@CurrentUser() user:SafeUser) {
        return this.FriendsService.getFriendRequestsSent(user);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('/blocked')
    getBlocked(@CurrentUser() user:SafeUser) {
        return this.FriendsService.getBlocked(user);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Post('request')
    @HttpCode(200)
    friendRequest(@Body() dto: CreateFriendRequestDto, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendRequest(user, dto);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Patch('request/:username/accept')
    friendAccept(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendAccept(user, username);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Patch('request/:username/decline')
    friendDecline(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendDecline(user, username);
    }
    
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Delete(':username')
    deleteFriend(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.deleteFriend(user, username);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post(':username/block')
    friendBlock(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendBlock(user, username);
    }

    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Delete(':username/unblock')
    friendUnblock(@Param('username') username: string, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendUnblock(user, username);
    }
}
