import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
    @ApiProperty({ example: 1 }) rank: number;
    @ApiProperty({ example: 85 }) avgWpm: number;
    @ApiProperty({ example: 3 }) level: number;
    @ApiProperty({ example: 12 }) gamesPlayed: number;
}

export class UserProfileDto {
    @ApiProperty({ example: 1 }) id: number;
    @ApiProperty({ example: 'johndoe' }) username: string;
    @ApiProperty({ example: 'https://cloudinary.com/avatar.jpg', nullable: true }) avatarUrl: string | null;
    @ApiProperty({ example: 'Hello world', nullable: true }) bio: string | null;
    @ApiProperty({ example: 'ONLINE' }) status: string;
    @ApiProperty({ example: 'EN' }) language: string;
    @ApiProperty({ type: UserStatsDto }) stats: UserStatsDto;
}

export class AvatarResponseDto {
    @ApiProperty({ example: 'https://cloudinary.com/avatar.jpg' })
    avatarUrl: string;
}