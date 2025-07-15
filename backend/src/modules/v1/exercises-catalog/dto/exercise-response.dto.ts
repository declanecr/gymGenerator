import { Exercise } from '@prisma/client';
export class ExerciseResponseDto {
  exerciseId: number;
  name: string;
  primaryMuscle: string;
  equipment?: string | null;
  isDefault: boolean;
  description?: string | null;

  constructor(exercise: Exercise) {
    this.exerciseId = exercise.id;
    this.name = exercise.name;
    this.primaryMuscle = exercise.primaryMuscle;
    this.equipment = exercise.equipment;
    this.isDefault = exercise.default;
    this.description = exercise.description;
  }
}
