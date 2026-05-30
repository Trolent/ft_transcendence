import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

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

  // Current accuracy as a whole-number percentage (0..100), reported by the
  // client; the last value seen at finish is persisted on the match result.
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  accuracy?: number;
}
