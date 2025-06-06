import { Exercise } from '@prisma/client';
export class ExerciseResponseDto {
  id: number;
  name: string;
  primaryMuscle: string;
  equipment?: string | null;
  isDefault: boolean;

  constructor(exercise: Exercise) {
    this.id = exercise.id;
    this.name = exercise.name;
    this.primaryMuscle = exercise.primaryMuscle;
    this.equipment = exercise.equipment;
    this.isDefault = exercise.default;
  }
}
