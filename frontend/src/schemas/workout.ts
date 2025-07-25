// frontend\src\schemas\workout.ts
import { z } from 'zod'

// 1. SET schema
const setSchema = z.object({
  id: z.string().optional(),
  reps: z.number().min(1, 'Reps must be at least 1'),
  weight: z.number().min(0, 'Weight cannot be negative'),
  position: z.number(),
})

// 2. EXERCISE schema
const exerciseSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.number(),
  position: z.number(),
  sets: z.array(setSchema).min(1,'Add at least one set'),   
})

// 3. WORKOUT schema
export const workoutSchema = z.object({
  name: z.string().nonempty('Name is required'),
  notes: z.string().nullable().optional(),
  exercises: z
    .array(exerciseSchema)
    .min(1, 'Add at least one exercise'),
})

export type WorkoutFormValues = z.infer<typeof workoutSchema>