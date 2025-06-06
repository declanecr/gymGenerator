import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsInt()
  exerciseId: number;

  @IsOptional()
  @IsString()
  templateExerciseId?: string;

  @IsInt()
  position: number;
}
