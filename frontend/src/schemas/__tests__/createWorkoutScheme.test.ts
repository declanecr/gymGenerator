import { createWorkoutSchema } from '../createWorkoutSchema';

describe('createWorkoutSchema', () => {
  it('parses valid data', () => {
    const data = {
      workoutTemplateId: 'T1',
      name: 'My Workout',
      notes: 'notes',
    };
    expect(() => createWorkoutSchema.parse(data)).not.toThrow();
  });

  it('fails for empty name', () => {
    const data = { workoutTemplateId: 'T1', name: '', notes: 'notes' };
    const result = createWorkoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});