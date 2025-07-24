import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../hooks/useAuth';
jest.mock('../api/auth', () => ({
  registerUser: jest.fn(),
}));
import { registerUser } from '../api/auth';

test('shows register form when unauthenticated', () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  expect(screen.getByText(/create an account/i)).toBeInTheDocument();
});

test('redirects when authenticated', () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Register />
    </MemoryRouter>
  );
  expect(screen.queryByText(/create an account/i)).not.toBeInTheDocument();
});

test('shows error message when register fails', async () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, login: jest.fn() });
  (registerUser as jest.Mock).mockRejectedValue(new Error('bad'));
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const user = userEvent.setup();
  await act(async()=>{
    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/^email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
  });
  expect(await screen.findByText(/register failed/i)).toBeInTheDocument();
});

test('shows loading indicator during registration', async () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, login: jest.fn() });
  let resolve: (v: any) => void;
  (registerUser as jest.Mock).mockImplementation(() => new Promise(r => { resolve = r; }));
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
  const user = userEvent.setup();
  await act(async()=>{
    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/^email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
  })
  expect(screen.getByTestId('loading')).toBeInTheDocument();
  resolve!({ accessToken: 'tok' });
  await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
});