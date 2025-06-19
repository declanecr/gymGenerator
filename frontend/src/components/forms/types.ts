// frontend\src\components\forms\types.ts

export interface SetFormValues {
  setId: number;
  reps: number;
  weight: number;
  position: number;          // order within the exercise
  //completed?: boolean;       // whether the user checked it off
}

export interface ExerciseFormValues {
  exerciseId: number;                // catalog ID
  position: number;                  // ordering under the workout
  // if you want to nest sets here:
  sets?: SetFormValues[];
}

export interface WorkoutFormValues {
  name: string
  notes?: string | null
  exercises: ExerciseFormValues[]
}
