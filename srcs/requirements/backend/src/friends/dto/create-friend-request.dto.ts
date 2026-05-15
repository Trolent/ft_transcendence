import { MaxLength, IsString } from 'class-validator';


export class CreateFriendRequestDto {
    @IsString()
    @MaxLength(30)
    username: string;
}