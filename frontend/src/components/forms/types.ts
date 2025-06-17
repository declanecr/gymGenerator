export interface SetFormValues {
  id?: string;               // existing sets have it; new ones don’t
  reps: number;
  weight: number;
  position: number;          // order within the exercise
  //completed?: boolean;       // whether the user checked it off
}

export interface ExerciseFormValues {
  id?: string;                       // existing exercises will have one; new ones won’t
  exerciseId: string;                // catalog ID
  templateExerciseId?: string | null;
  position: number;                  // ordering under the workout
  // if you want to nest sets here:
  sets?: SetFormValues[];
}

export interface WorkoutFormValues {
  id?: string          
  name: string
  notes?: string
  startedAt: string    // ISO timestamp, or Date
  exercises: ExerciseFormValues[]
}
