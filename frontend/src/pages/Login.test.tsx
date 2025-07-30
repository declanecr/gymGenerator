import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../hooks/useAuth';
jest.mock('../api/auth', () => ({
  loginUser: jest.fn(),
}));
import { loginUser } from '../api/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function renderPage(children: React.ReactElement, initialEntries: string[] = ['/']) {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}
describe('Login tests', () => {
  

  test('shows login form when unauthenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    renderPage(<Login />);
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });

  test('redirects when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    renderPage(<Login />, ['/login']);
    expect(screen.queryByText(/login to your account/i)).not.toBeInTheDocument();
  });

  test('shows error message when login fails', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, login: jest.fn() });
    (loginUser as jest.Mock).mockRejectedValue(new Error('bad'));
    renderPage(<Login />);
    const user = userEvent.setup();
    await act(async ()=>{
      await user.type(screen.getByLabelText(/email/i), 'a@b.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));
    })
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });

  test('shows loading indicator during login', async () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, login: jest.fn() });
    let resolve: (v: unknown) => void;
    (loginUser as jest.Mock).mockImplementation(() => new Promise(r => { resolve = r; }));
    renderPage(<Login />);
    const user = userEvent.setup();
    await act(async ()=>{
      await user.type(screen.getByLabelText(/email/i), 'a@b.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));
    });
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    resolve!({ accessToken: 'x' });
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
  });
});