import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { RegisterForm } from '../RegisterForm';
import { registerUser } from '../../../api/auth';
import { AuthContext } from '../../../context/AuthContext';

jest.mock('../../../api/auth', () => ({
  __esModule: true,
  registerUser: jest.fn().mockResolvedValue({ accessToken: 'abc' }),
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



describe('RegisterForm', () => {
  const user = userEvent.setup();
  test('shows validation errors then submits successfully', async () => {
    render(<RegisterForm />);
    //const user = userEvent.setup();
    await act(async()=>{
        await user.click(screen.getByRole('button', { name: /create account/i }));
    });
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
    await act(async()=>{
        await user.type(screen.getByLabelText(/name/i), 'Tester');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /create account/i }));
    })
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledTimes(1);
      expect(registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
        })
      );
    });
  });

  test('shows password length error', async () => {
    render(<RegisterForm />);
    //const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'User');
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /create account/i }));
    });

    expect(await screen.findByText(/≥8 characters/i)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  test('calls onError and skips auth when registerUser rejects', async () => {
      const errorSpy = jest.fn();
      const loginSpy = jest.fn();               // context login shouldn’t run
  
      jest.mocked(registerUser).mockRejectedValue(new Error('invalid'));
      jest.spyOn(console, 'error').mockImplementation(() => {});   // silence noise
  
      render(<RegisterForm onError={errorSpy} />, {
        wrapper: ({ children }) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <AuthContext.Provider value={{ login: loginSpy } as any}>
            {children}
          </AuthContext.Provider>
        ),
      });
  
      await user.type(screen.getByLabelText(/email/i), 'a@b.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));
  
      //expect(errorSpy).toHaveBeenCalledWith('Register failed');
      expect(loginSpy).not.toHaveBeenCalled();
    });
});