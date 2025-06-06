import { IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  workoutTemplateId?: string;
}
