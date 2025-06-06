import { IsInt } from 'class-validator';

export class CreateWorkoutSetDto {
  @IsInt()
  reps: number;

  @IsInt()
  weight: number;

  @IsInt()
  position: number;
}
