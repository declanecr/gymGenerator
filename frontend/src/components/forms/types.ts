// frontend\src\components\forms\types.ts

export interface SetFormValues {
  id?: string;     // for tracking existing records. optional: present if editing, absent if newly created
  reps: number;
  weight: number;
  position: number;          // order within the exercise
  //completed?: boolean;       // whether the user checked it off
}

export interface ExerciseFormValues {
  id?: string;                       // for tracking existing records
  exerciseId: string;                // exercise-catalog ID
  position: number;                  // ordering under the workout
  // if you want to nest sets here:
  sets?: SetFormValues[];
}

export interface WorkoutFormValues {
  id?: string                      // for tracking existing records
  name: string
  notes?: string | null
  exercises: ExerciseFormValues[]
}
