import { ApiProperty } from '@nestjs/swagger';

class AchievementDto {
    @ApiProperty({ example: 1 }) id: number;
    @ApiProperty({ example: 'first_race' }) key: string;
    @ApiProperty({ example: 'First Race' }) label: string;
    @ApiProperty({ example: 'Complete your first race' }) description: string;
    @ApiProperty({ example: null, nullable: true }) iconUrl: string | null;
}

export class UserAchievementDto {
    @ApiProperty({ example: 1 }) id: number;
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' }) unlockedAt: string;
    @ApiProperty({ type: AchievementDto }) achievement: AchievementDto;
}
