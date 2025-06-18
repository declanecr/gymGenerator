export interface SetFormValues {
  reps: number;
  weight: number;
  position: number;          // order within the exercise
  //completed?: boolean;       // whether the user checked it off
}

export interface ExerciseFormValues {
  exerciseId: string;                // catalog ID
  position: number;                  // ordering under the workout
  // if you want to nest sets here:
  sets?: SetFormValues[];
}

export interface WorkoutFormValues {
  name: string
  notes?: string
  exercises: ExerciseFormValues[]
}
