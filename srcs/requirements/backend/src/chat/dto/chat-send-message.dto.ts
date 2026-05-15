import { MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SendMessageDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    to: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    content: string;
}