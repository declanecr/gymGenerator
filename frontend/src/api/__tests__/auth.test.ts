import api from '../axios';
import { loginUser, registerUser } from '../auth';

jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));
const mockedApi = api as jest.Mocked<typeof api>;

describe('auth API', () => {
  it('loginUser posts credentials and returns token', async () => {
    const dto = { email: 'a@b.com', password: 'pass' };
    const token = { accessToken: 'token' };
    mockedApi.post.mockResolvedValueOnce({ data: token });

    const result = await loginUser(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', dto);
    expect(result).toEqual(token);
  });

  it('registerUser posts credentials and returns token', async () => {
    const dto = { email: 'a@b.com', password: 'pass', name: 'abc' };
    const token = { accessToken: '123' };
    mockedApi.post.mockResolvedValueOnce({ data: token });

    const result = await registerUser(dto);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', dto);
    expect(result).toEqual(token);
  });
});