import api from '../axios';
import { getMe } from '../users';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('users API', () => {
  it('getMe calls GET /users/me and returns user', async () => {
    const user = { id: 1, email: 'test@example.com', createdAt: '2025-01-01', role: 'user' };
    mockedApi.get.mockResolvedValueOnce({ data: user });

    const result = await getMe();

    expect(mockedApi.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(user);
  });
});