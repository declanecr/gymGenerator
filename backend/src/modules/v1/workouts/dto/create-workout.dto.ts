import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  workoutTemplateId?: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
