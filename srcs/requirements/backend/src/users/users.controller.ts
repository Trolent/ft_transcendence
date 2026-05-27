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

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateProfileDto, UpdateSettingsDto } from './dto'

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import {
    THROTTLE_LIMIT_API,
    THROTTLE_LIMIT_UP_AVATAR,
    THROTTLE_LIMIT_SETTINGS
} from '../common/throttle.constants';

//AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

//AVATAR
import { CloudinaryService } from '../cloudinary/cloudinary.service';

//SWAGGER
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { UserProfileDto, AvatarResponseDto, UserStatsDto } from '../common/dto/users-response.dto';

const MAX_PROFILES_REQUEST = 70;

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private UsersService: UsersService,
        private CloudinaryService: CloudinaryService,
    ) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my profile' })
    @ApiResponse({ status: 200, type: UserProfileDto })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@CurrentUser() user: SafeUser) {
        return this.UsersService.getProfile(user.username, true);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update my bio' })
    @ApiResponse({ status: 200, schema: { example: { bio: 'Hello world' } } })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateProfile(@Body() dto:UpdateProfileDto, @CurrentUser() user: SafeUser){
        return this.UsersService.updateProfile(user.username, dto)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update settings (email, password, language)' })
    @ApiResponse({ status: 200, schema: { example: { email: 'new@example.com', language: 'EN' } } })
    @ApiResponse({ status: 409, description: 'EMAIL_ALREADY_TAKEN' })
    @Throttle({ auth: THROTTLE_LIMIT_SETTINGS })
    @UseGuards(JwtAuthGuard)
    @Patch('me/settings')
    updateSettings(@Body() dto:UpdateSettingsDto, @CurrentUser() user: SafeUser){
        return this.UsersService.updateSettings(user.username, dto)
    }

    @ApiOperation({ summary: 'Get user profile by username' })
    @ApiResponse({ status: 200, type: UserProfileDto })
    @ApiResponse({ status: 404, description: 'USER_NOT_FOUND' })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username')
    getProfile(@Param('username') username: string) {
        return this.UsersService.getProfile(username, false);
    }

    @ApiOperation({ summary: 'Get user stats' })
    @ApiResponse({ status: 200, type: UserStatsDto })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username/stats')
    getStats(@Param('username') username: string) {
        return this.UsersService.calculateStats(username);
    }

    @ApiOperation({ summary: 'Get multiple profiles by usernames' })
    @ApiQuery({ name: 'users', example: 'john,jane,bob' })
    @ApiResponse({ status: 200, type: [UserProfileDto] })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get()
    getProfiles(@Query('users') users: string) {
        if (!users) throw new BadRequestException('MISSING_USERS_PARAM');
        const usernameList = users.split(',').map(s => s.trim()).filter(Boolean).slice(0, MAX_PROFILES_REQUEST);
        return this.UsersService.getProfiles(usernameList);
    }

    @ApiOperation({ summary: 'Get match history' })
    @ApiResponse({ status: 200, schema: { example: [{ wpm: 85, position: 1, finishedAt: '2026-01-01T00:00:00.000Z', match: { id: 1, startedAt: '2026-01-01T00:00:00.000Z', textSnippet: 'The quick brown fox' } }] } })
    @Throttle({ auth: THROTTLE_LIMIT_API })
    @Get(':username/history')
    getHistory(@Param('username') username: string) {
        return this.UsersService.getHistory(username);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Upload avatar' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, type: AvatarResponseDto })
    @Throttle({ auth: THROTTLE_LIMIT_UP_AVATAR })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
    @Post('me/avatar')
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: SafeUser) {
        const url = await this.CloudinaryService.uploadAvatar(file, user.avatarUrl ?? undefined);
        await this.UsersService.updateAvatar(user.username, url);
        return { avatarUrl: url };
    }
}