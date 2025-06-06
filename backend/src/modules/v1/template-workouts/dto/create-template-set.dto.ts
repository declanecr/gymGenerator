import { IsInt, IsOptional } from 'class-validator';

export class CreateTemplateSetDto {
  @IsInt()
  reps: number;

  @IsInt()
  weight: number;

  @IsOptional()
  @IsInt()
  position?: number;
}
