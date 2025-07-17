import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateTemplateWorkoutDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
