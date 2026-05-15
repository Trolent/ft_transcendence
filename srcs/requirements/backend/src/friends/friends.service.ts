import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFriendRequestDto } from './dto'
import { UsersService } from '../users/users.service'
import { SafeUser } from '../common/types'


@Injectable()
export class FriendsService {

    constructor(
        private prisma: PrismaService,
        private users: UsersService) {}

    async getRelationship(userId:number, targetId:number){
        return this.prisma.friendship.findFirst({
            where: {
                OR: [
                { initiatorId: userId, receiverId: targetId },
                { initiatorId: targetId, receiverId: userId },
                    ]
                }
        });

    }

    async friendRequest(user: SafeUser, dto: CreateFriendRequestDto){
        const userExist = await this.users.findByUsername(dto.username);

        if(!userExist)
            throw new NotFoundException('USER_NOT_FOUND');
        if(user.username === dto.username)
            throw new BadRequestException('CANNOT_ADD_YOURSELF');

        const userId = user.id;
        const targetId = userExist.id

        const existing = await this.getRelationship(userId, targetId);
        if(existing){
            if (existing.status === 'PENDING')
                throw new ConflictException('REQUEST_ALREADY_SENT');
            if(existing.status === "ACCEPTED")
                throw new ConflictException('ALREADY_FRIENDS');
            if(existing.status === "BLOCKED")
                throw new ConflictException('BLOCKED');
        };

        return this.prisma.friendship.create({
            data: {
                initiatorId: userId,
                receiverId: targetId
            }
        })
    }

}
