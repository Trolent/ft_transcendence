import { IsInt, Min } from 'class-validator';

export class PlayerProgressDto {
  @IsInt()
  @Min(0)
  chars: number;
}
