import { z } from 'zod';

export const exampleSchema = z.object({
  name: z.string(),
});

export type Example = z.infer<typeof exampleSchema>;
