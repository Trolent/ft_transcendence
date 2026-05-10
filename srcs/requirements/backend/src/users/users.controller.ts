import {
    Controller,
    Get,
    UseGuards,
    Param,
    Post,
    Query,
    BadRequestException,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import { THROTTLE_LIMIT_API, THROTTLE_LIMIT_UP_AVATAR } from '../common/throttle.constants';

//AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

//AVATAR
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const MAX_PROFILES_REQUEST = 70;

@Controller('users')
export class UsersController {
    constructor(
        private UsersService: UsersService,
        private CloudinaryService: CloudinaryService,
    ) {}

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

    //AVATAR
    @Throttle({ auth: THROTTLE_LIMIT_UP_AVATAR })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
    @Post('me/avatar')
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: SafeUser) {
        const url = await this.CloudinaryService.uploadAvatar(file, user.avatarUrl);
        await this.UsersService.updateAvatar(user.username, url);
        return { avatarUrl: url };
    }
}