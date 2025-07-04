import { workoutSchema } from '../workout';

describe('workoutSchema', () => {
  it('allows valid workout data', () => {
    const data = {
      name: 'My Workout',
      notes: '',
      exercises: [
        {
          exerciseId: 1,
          position: 1,
          sets: [{ reps: 5, weight: 50, position: 1 }],
        },
      ],
    };
    expect(() => workoutSchema.parse(data)).not.toThrow();
  });

  it('rejects workout with no exercises', () => {
    const data = { name: 'Empty', notes: '', exercises: [] };
    const result = workoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});