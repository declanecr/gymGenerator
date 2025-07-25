import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { LoginForm } from '../LoginForm';
import { loginUser } from '../../../api/auth';
import { AuthContext } from '../../../context/AuthContext';

jest.mock('../../../api/auth', () => ({
  __esModule: true,
  loginUser: jest.fn().mockResolvedValue({ accessToken: 'abc' }),
}));

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({ login: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});


describe('LoginForm', () => {
  const user = userEvent.setup();
  test('shows validation error on invalid input then submits successfully', async () => {
    render(<LoginForm />);
    //const user = userEvent.setup();
    await act(async()=>{
      await user.type(screen.getByLabelText(/email/i), 'bad');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
    
    await act(async()=>{
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.clear(screen.getByLabelText(/password/i));
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });
    await waitFor(() =>
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });

  test('shows password length error', async () => {
    render(<LoginForm />);
    //const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test('calls onError and skips auth when loginUser rejects', async () => {
    const errorSpy = jest.fn();
    const loginSpy = jest.fn();               // context login shouldn’t run

    jest.mocked(loginUser).mockRejectedValue(new Error('invalid'));
    jest.spyOn(console, 'error').mockImplementation(() => {});   // silence noise

    render(<LoginForm onError={errorSpy} />, {
      wrapper: ({ children }) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <AuthContext.Provider value={{ login: loginSpy } as any}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(errorSpy).toHaveBeenCalledWith('Login failed');
    expect(loginSpy).not.toHaveBeenCalled();
  });
});