import api from '../axios';
import {
  fetchExerciseCatalog,
  createCustomExercise,
  updateCustomExercise,
  deleteCustomExercise,
  createDefaultExercise,
} from '../exerciseCatalog';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('exerciseCatalog API', () => {
  it('fetchExerciseCatalog calls GET /exercises-catalog with showCustom', async () => {
    const data = [
      { exerciseId: 1, name: 'Bench', primaryMuscle: 'Chest', default: true, templateExercises: [], workoutExercises: [] },
    ];
    mockedApi.get.mockResolvedValueOnce({ data });

    const result = await fetchExerciseCatalog(false);

    expect(mockedApi.get).toHaveBeenCalledWith('/exercises-catalog?custom=false');
    expect(result).toEqual(data);
  });

  it('createCustomExercise calls POST /exercises-catalog/custom with dto', async () => {
    const dto = {
      name: 'Pull Up',
      primaryMuscle: 'Back',
      description: 'Bodyweight pull exercise',
      equipment: 'Bar',
    };
    const response = {
      exerciseId: 2,
      name: 'Pull Up',
      primaryMuscle: 'Back',
      description: 'Bodyweight pull exercise',
      equipment: 'Bar',
      default: false,
      templateExercises: [],
      workoutExercises: [],
    };
    // Add mock for post
    mockedApi.post = jest.fn().mockResolvedValueOnce({ data: response });

    const { createCustomExercise } = await import('../exerciseCatalog');
    const result = await createCustomExercise(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/exercises-catalog/custom', dto);
    expect(result).toEqual(response);
  });

  it('createCustomExercise posts to /exercises-catalog/custom and returns data', async () => {
    const dto = { name: 'Curl', primaryMuscle: 'Biceps' };
    const created = { exerciseId: 2, name: 'Curl', primaryMuscle: 'Biceps', default: false, templateExercises: [], workoutExercises: [] };
    mockedApi.post.mockResolvedValueOnce({ data: created });

    const result = await createCustomExercise(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/exercises-catalog/custom', dto);
    expect(result).toEqual(created);
  });

  it('createDefaultExercise posts to /exercises-catalog/default and returns data', async () => {
    const dto = { name: 'Press', primaryMuscle: 'Chest' };
    const created = {
      exerciseId: 3,
      name: 'Press',
      primaryMuscle: 'Chest',
      default: true,
      templateExercises: [],
      workoutExercises: [],
    };
    mockedApi.post.mockResolvedValueOnce({ data: created });

    const result = await createDefaultExercise(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/exercises-catalog/default', dto);
    expect(result).toEqual(created);
  });

  it('updateCustomExercise patches /exercises-catalog/custom/:id and returns data', async () => {
    const dto = { name: 'Curl Alt' };
    const id = 2;
    const updated = { exerciseId: 2, name: 'Curl Alt', primaryMuscle: 'Biceps', default: false, templateExercises: [], workoutExercises: [] };
    mockedApi.patch.mockResolvedValueOnce({ data: updated });

    const result = await updateCustomExercise(id, dto);

    expect(mockedApi.patch).toHaveBeenCalledWith(`/exercises-catalog/custom/${id}`, dto);
    expect(result).toEqual(updated);
  });

  it('deleteCustomExercise calls DELETE /exercises-catalog/custom/:id', async () => {
    mockedApi.delete.mockResolvedValueOnce({});
    const id = 2;

    await deleteCustomExercise(id);

    expect(mockedApi.delete).toHaveBeenCalledWith(`/exercises-catalog/custom/${id}`);
  });
});