import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class PlayerProgressDto {
  @IsInt()
  @Min(0)
  chars: number;

  // Milliseconds since the client saw the green light, by the client's own
  // clock. Used (clamped) to time the finish without network latency.
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationMs?: number;
}
