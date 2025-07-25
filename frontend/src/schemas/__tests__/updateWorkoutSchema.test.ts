import { updateWorkoutSchema } from '../updateWorkoutSchema';

describe('updateWorkoutSchema', () => {
  it('allows empty object', () => {
    expect(() => updateWorkoutSchema.parse({})).not.toThrow();
  });

  it('fails when provided name is empty', () => {
    const data = { name: '' };
    const result = updateWorkoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});