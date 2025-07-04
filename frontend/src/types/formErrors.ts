// src/types/formErrors.ts
import { FieldError } from 'react-hook-form'

/** Per‐set errors (primitive fields all share FieldError shape) */
export type SetErrors = {
  reps?: FieldError
  weight?: FieldError
  position?: FieldError
}

/** Per‐exercise errors */
export type ExerciseErrors = {
  exerciseId?: FieldError
  position?: FieldError

  /** 
   * When Zod’s `.min(1, ...)` fails on the sets array, 
   * RHF puts the message here in `_errors[0]`. 
   */
  sets?: {
    _errors?: string[]      // array‐level errors
    [sIdx: number]: SetErrors  // per‐index errors
  }
}

/** Root form errors */
export type WorkoutFormValuesErrors = {
  name?: FieldError
  notes?: FieldError

  /**
   * Zod’s `.min(1, ...)` on the exercises array shows up
   * here in `_errors[0]`. Each index key holds that exercise’s errors.
   */
  exercises?: {
    _errors?: string[]         // array‐level errors for exercises
    [idx: number]: ExerciseErrors
  }
}
