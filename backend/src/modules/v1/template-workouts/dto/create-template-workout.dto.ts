import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTemplateWorkoutDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  notes?: string;
}
