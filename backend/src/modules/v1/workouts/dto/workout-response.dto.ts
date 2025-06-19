import { Workout } from '@prisma/client';

export class WorkoutResponseDto {
  id: string;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  workoutTemplateId?: string | null;

  constructor(workout: Workout) {
    this.id = workout.id;
    this.name = workout.name;
    this.notes = workout.notes ?? undefined;
    this.createdAt = workout.createdAt;
    this.updatedAt = workout.updatedAt;
    this.workoutTemplateId = workout.workoutTemplateId;
  }
}
