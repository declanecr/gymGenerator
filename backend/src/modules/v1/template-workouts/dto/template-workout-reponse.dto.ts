import { TemplateWorkout, TemplateExercise, TemplateSet } from '@prisma/client';

export interface TemplateExerciseWithSets extends TemplateExercise {
  sets: TemplateSet[];
}

export interface TemplateWorkoutWithExtras extends TemplateWorkout {
  notes: string | null;
  templateExercises?: TemplateExerciseWithSets[];
}

export class TemplateWorkoutResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
  exercises?: TemplateExerciseWithSets[];

  constructor(workout: TemplateWorkoutWithExtras) {
    this.id = workout.id;
    this.name = workout.name;
    this.createdAt = workout.createdAt;
    this.updatedAt = workout.updatedAt;
    this.notes = workout.notes;
    if (workout.templateExercises) {
      this.exercises = workout.templateExercises.map((e) => ({
        ...e,
        sets: e.sets,
      }));
    }
  }
}
