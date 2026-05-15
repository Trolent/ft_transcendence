import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service'

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { SafeUser } from '../common/types';

//API LIMIT
import { Throttle } from '@nestjs/throttler';
import {
    THROTTLE_LIMIT_CHAT,
} from '../common/throttle.constants';

@Controller('chat')
export class ChatController {
    constructor(private chatservice: ChatService) {}

    @Throttle({ chat: THROTTLE_LIMIT_CHAT })
    @UseGuards(JwtAuthGuard)
    @Get('/')
    getHistoryChat(@CurrentUser() user: SafeUser) {
        return this.chatservice.getHistoryChat(user.id);
    }

    @Throttle({ chat: THROTTLE_LIMIT_CHAT })
    @UseGuards(JwtAuthGuard)
    @Get(':username')
    getUserChatHistory(
        @Param('username') username: string,
        @CurrentUser() user: SafeUser,
        @Query('before') before?: string,
    ) {
        return this.chatservice.getUserChatHistory(user.id, username, before ? parseInt(before) : undefined);
    }
}
