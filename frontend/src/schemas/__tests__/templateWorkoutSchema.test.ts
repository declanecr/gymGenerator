import { templateWorkoutSchema } from '../templateWorkout';

describe('templateWorkoutSchema', () => {
  it('valid template passes', () => {
    const data = {
      name: 'Template',
      notes: null,
      exercises: [
        {
          exerciseId: 1,
          position: 1,
          sets: [{ reps: 5, weight: 50, position: 1 }],
        },
      ],
    };
    expect(() => templateWorkoutSchema.parse(data)).not.toThrow();
  });

  it('fails when name is empty', () => {
    const data = {
      name: '',
      notes: null,
      exercises: [
        {
          exerciseId: 1,
          position: 1,
          sets: [],
        },
      ],
    };
    const result = templateWorkoutSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});