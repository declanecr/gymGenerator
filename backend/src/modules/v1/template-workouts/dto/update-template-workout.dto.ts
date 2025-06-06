import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateWorkoutDto } from './create-template-workout.dto';

export class UpdateTemplateWorkoutDto extends PartialType(
  CreateTemplateWorkoutDto,
) {}
