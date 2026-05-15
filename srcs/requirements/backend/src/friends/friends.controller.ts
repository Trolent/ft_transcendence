import {
    Controller,
    Get,
    UseGuards,
    Param,
    Post,
    Query,
    Patch,
    Body,
    BadRequestException,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { FriendsService } from './friends.service';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API, THROTTLE_LIMIT_UP_AVATAR } from '../common/throttle.constants';

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
    @Post('request')
    friendRequest(@Body() dto: CreateFriendRequestDto, @CurrentUser() user:SafeUser) {
        return this.FriendsService.friendRequest(user, dto);
    }
    
}
