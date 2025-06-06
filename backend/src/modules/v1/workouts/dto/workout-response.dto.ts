import { Workout } from '@prisma/client';

export class WorkoutResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  workoutTemplateId?: string | null;

  constructor(workout: Workout) {
    this.id = workout.id;
    this.createdAt = workout.createdAt;
    this.updatedAt = workout.updatedAt;
    this.workoutTemplateId = workout.workoutTemplateId;
  }
}
