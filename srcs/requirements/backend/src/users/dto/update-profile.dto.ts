import { IsOptional, MaxLength, IsString } from 'class-validator';


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    bio?: string;
}