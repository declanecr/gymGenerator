import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../hooks/useAuth';

test('shows login form when unauthenticated', () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
});

test('redirects when authenticated', () => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );
  expect(screen.queryByText(/login to your account/i)).not.toBeInTheDocument();
});