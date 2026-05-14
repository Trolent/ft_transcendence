import { IsOptional, MinLength, IsString, IsEmail } from 'class-validator';
import { Language } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateSettingsDto {

    @IsOptional() @IsEmail()
    email?: string;

    @IsOptional() @IsString() @MinLength(8)
    password?: string;

    @IsOptional() @IsEnum(Language)
    language?: Language;
}