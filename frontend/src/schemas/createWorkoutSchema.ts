// src/schemas/createWorkoutSchema.ts
import { z } from 'zod';

/**
 * Zod schema matching the CreateWorkoutDto on the server.
 */
export const createWorkoutSchema = z.object({
  workoutTemplateId: z.string().optional(),
  name: z.string().min(1, "Name required"),
  notes: z.string().optional(),
});

/**
 * Typescript type inferred from the Zod schema.
 */
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;