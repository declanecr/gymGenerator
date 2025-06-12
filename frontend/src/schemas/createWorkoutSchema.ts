// src/schemas/createWorkoutSchema.ts
import { z } from 'zod';

/**
 * Zod schema matching the CreateWorkoutDto on the server.
 * Only the template ID is required, and it’s optional.
 */
export const createWorkoutSchema = z.object({
  workoutTemplateId: z.string().optional(),
});

/**
 * Typescript type inferred from the Zod schema.
 */
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;