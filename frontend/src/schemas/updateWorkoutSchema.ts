import { createWorkoutSchema } from './createWorkoutSchema';
import { z } from 'zod';

/**
 * Schema for updating a workout: all fields are optional
 */
export const updateWorkoutSchema = createWorkoutSchema.partial();

export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;