// frontend/src/schemas/templateWorkout.ts
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
  sets: z.array(setSchema),
})

// 3. TEMPLATE WORKOUT schema
export const templateWorkoutSchema = z.object({
  name: z.string().nonempty('Name is required'),
  notes: z.string().nullable().optional(),
  exercises: z
    .array(exerciseSchema)
    .min(1, 'Add at least one exercise'),
})

export type TemplateWorkoutFormValues = z.infer<typeof templateWorkoutSchema>