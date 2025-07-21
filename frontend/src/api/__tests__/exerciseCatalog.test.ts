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
});