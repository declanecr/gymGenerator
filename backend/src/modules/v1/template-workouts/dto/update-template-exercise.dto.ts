import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateExerciseDto } from './create-template-exercise.dto';

export class UpdateTemplateExerciseDto extends PartialType(
  CreateTemplateExerciseDto,
) {}
