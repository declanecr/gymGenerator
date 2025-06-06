import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutSetDto } from './create-workout-set.dto';

export class UpdateWorkoutSetDto extends PartialType(CreateWorkoutSetDto) {}
