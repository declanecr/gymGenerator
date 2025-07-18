import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { RegisterForm } from '../RegisterForm';
import { registerUser } from '../../../api/auth';

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
  test('shows validation errors then submits successfully', async () => {
    render(<RegisterForm />);
    const user = userEvent.setup();
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
    const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'User');
      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'short');
      await user.click(screen.getByRole('button', { name: /create account/i }));
    });

    expect(await screen.findByText(/≥8 characters/i)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });
});