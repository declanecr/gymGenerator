import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomExerciseDto } from './create-custom-exercise.dto';

export class UpdateCustomExerciseDto extends PartialType(
  CreateCustomExerciseDto,
) {}
