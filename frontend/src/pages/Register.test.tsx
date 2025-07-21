import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

jest.mock('../hooks/useAuth', () => ({ useAuth: jest.fn() }));
import { useAuth } from '../hooks/useAuth';

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