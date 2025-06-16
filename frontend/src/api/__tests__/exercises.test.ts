import api from '../axios';
import {
  createWorkoutExercise,
  updateWorkoutExercise,
  deleteWorkoutExercise,
} from '../exercises';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('exercises API', () => {
  it('createWorkoutExercise calls POST /workouts/:workoutId/exercises and returns data', async () => {
    const dto = { exerciseId: 1, templateExerciseId: 'T1', position: 2 };
    const workoutId = 'WID';
    const exercise = {
      id: 'EID',
      createdAt: '2025-06-10T00:00:00.000Z',
      updatedAt: '2025-06-10T00:00:00.000Z',
      exerciseId: '1',
      templateExerciseId: 'T1',
      workoutId,
      position: 2,
      workoutSets: [],
    };
    mockedApi.post.mockResolvedValueOnce({ data: exercise });

    const result = await createWorkoutExercise(dto, workoutId);

    expect(mockedApi.post).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises`,
      dto
    );
    expect(result).toEqual(exercise);
  });

  it('updateWorkoutExercise calls PATCH /workouts/:workoutId/exercises/:id and returns data', async () => {
    const dto = { position: 3 };
    const id = 'EID';
    const workoutId = 'WID';
    const updated = {
      id,
      createdAt: '2025-06-10T00:00:00.000Z',
      updatedAt: '2025-06-10T00:00:00.000Z',
      exerciseId: '1',
      templateExerciseId: null,
      workoutId,
      position: 3,
      workoutSets: [],
    };
    mockedApi.patch.mockResolvedValueOnce({ data: updated });

    const result = await updateWorkoutExercise(dto, id, workoutId);

    expect(mockedApi.patch).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises/${id}`,
      dto
    );
    expect(result).toEqual(updated);
  });

  it('deleteWorkoutExercise calls DELETE /workouts/:workoutId/exercises/:id', async () => {
    const id = 'EID';
    const workoutId = 'WID';
    mockedApi.delete.mockResolvedValueOnce({});

    await deleteWorkoutExercise(workoutId, id);

    expect(mockedApi.delete).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises/${id}`
    );
  });
});
