import { IsString, IsOptional } from 'class-validator';

export class CreateCustomExerciseDto {
  @IsString()
  name: string;

  @IsString()
  primaryMuscle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  equipment?: string;
}
