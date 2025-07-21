import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mockLogout = jest.fn();
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

jest.mock('../api/workouts', () => ({
  fetchWorkouts: jest.fn().mockResolvedValue([
    { id: '1', name: 'w1', createdAt: '', updatedAt: '', workoutTemplateId: null, workoutExercises: [] },
  ]),
  fetchTemplateWorkouts: jest.fn().mockResolvedValue([]),
}));

jest.mock('../api/templateWorkouts', () => ({
  fetchTemplateWorkouts: jest.fn().mockResolvedValue([
    { id: 't1', name: 'tpl', createdAt: '', updatedAt: '', userId: null },
  ]),
}));

jest.mock('../hooks/users/useGetMe', () => ({
  useGetMe: () => ({ data: { role: 'ADMIN' } }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPage() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('renders workouts and admin link', async () => {
  renderPage();
  await screen.findByText('Workout w1');
  expect(screen.getByText('tpl')).toBeInTheDocument();
  expect(screen.getByText(/go to admin page/i)).toBeInTheDocument();
});