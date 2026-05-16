import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {

    @IsString()
    @Matches(/^[^@]+$/, { message: 'USERNAME_CANNOT_CONTAIN_AT' })
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}