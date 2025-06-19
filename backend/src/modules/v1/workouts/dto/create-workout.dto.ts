import { IsOptional, IsString, Length } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  workoutTemplateId?: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;
}
