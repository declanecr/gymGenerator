import api from '../axios';
import {
  createWorkoutSet,
  updateWorkoutSet,
  deleteWorkoutSet,
} from '../sets';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('sets API', () => {
  it('createWorkoutSet calls POST /workouts/:workoutId/exercises/:exerciseId/sets and returns data', async () => {
    const dto = { reps: 10, position: 1, weight: 100 };
    const workoutId = 'WID';
    const exerciseId = 'EID';
    const set = {
      id: 'SID',
      createdAt: '2025-06-10T00:00:00.000Z',
      updatedAt: '2025-06-10T00:00:00.000Z',
      reps: 10,
      position: 1,
      weight: 100,
      completed: false,
    };
    mockedApi.post.mockResolvedValueOnce({ data: set });

    const result = await createWorkoutSet(dto, workoutId, exerciseId);

    expect(mockedApi.post).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets`,
      dto
    );
    expect(result).toEqual(set);
  });

  it('updateWorkoutSet calls PATCH /workouts/:workoutId/exercises/:exerciseId/sets/:id and returns data', async () => {
    const id = 'SID';
    const dto = { reps: 5 };
    const workoutId = 'WID';
    const exerciseId = 'EID';
    const updated = {
      id,
      createdAt: '2025-06-10T00:00:00.000Z',
      updatedAt: '2025-06-10T00:00:00.000Z',
      reps: 5,
      position: 1,
      weight: 100,
      completed: true,
    };
    mockedApi.patch.mockResolvedValueOnce({ data: updated });

    const result = await updateWorkoutSet(id, dto, workoutId, exerciseId);

    expect(mockedApi.patch).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets/${id}`,
      dto
    );
    expect(result).toEqual(updated);
  });

  it('deleteWorkoutSet calls DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:id', async () => {
    const id = 'SID';
    const workoutId = 'WID';
    const exerciseId = 'EID';
    mockedApi.delete.mockResolvedValueOnce({});

    await deleteWorkoutSet(id, workoutId, exerciseId);

    expect(mockedApi.delete).toHaveBeenCalledWith(
      `/workouts/${workoutId}/exercises/${exerciseId}/sets/${id}`
    );
  });
});
