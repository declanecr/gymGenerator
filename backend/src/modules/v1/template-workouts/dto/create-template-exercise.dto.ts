import { IsInt, IsOptional } from 'class-validator';

export class CreateTemplateExerciseDto {
  @IsInt()
  exerciseId: number;

  @IsOptional()
  @IsInt()
  position: number;
}
