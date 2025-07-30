import api from '../axios';
import { fetchExerciseCatalog } from '../exerciseCatalog';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
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
});