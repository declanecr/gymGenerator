import { act, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { fetchWorkouts } from '../../api/workouts';
import { fetchTemplateWorkouts } from '../../api/templateWorkouts';
import { DeviceProvider } from '../../context/DeviceProvider';

const mockLogout = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

jest.mock('../../api/workouts', () => ({
  fetchWorkouts: jest.fn(),
}));

jest.mock('../../api/templateWorkouts', () => ({
  fetchTemplateWorkouts: jest.fn(),
}));

jest.mock('../../hooks/users/useGetMe', () => ({
  useGetMe: () => ({ data: { role: 'ADMIN' } }),
}));

jest.mock('../../hooks/workoutExercises/useExercises', () => ({
  useWorkoutExercises: () => ({ data: [], isLoading: false }),
}));

jest.mock('../../hooks/templateExercises/useTemplateExercises', () => ({
  useTemplateExercises: () => ({ data: [], isLoading: false }),
}));


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  jest.resetAllMocks();
  (fetchWorkouts as jest.Mock).mockResolvedValue([
    { id: '1', name: 'w1', createdAt: '', updatedAt: '', workoutTemplateId: null, workoutExercises: [] },
  ]);
  (fetchTemplateWorkouts as jest.Mock).mockResolvedValue([
    { id: 't1', name: 'tpl', createdAt: '', updatedAt: '', userId: null },
  ]);
});

function renderPage() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DeviceProvider>
          <Dashboard />
        </DeviceProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('renders workouts and admin link', async () => {
  await act(async () => { renderPage(); });
  await screen.findByText('w1');
  expect(screen.getByText('tpl')).toBeInTheDocument();
  expect(screen.getByText(/go to admin page/i)).toBeInTheDocument();
});

test('shows loading indicator while fetching', async () => {
  (fetchWorkouts as jest.Mock).mockImplementation(() => new Promise(() => {}));
  await act(async () => { renderPage(); });
  expect(screen.getByTestId('loading')).toBeInTheDocument();
});

test('shows error message if fetch fails', async () => {
  (fetchWorkouts as jest.Mock).mockRejectedValue(new Error('err'));
  (fetchTemplateWorkouts as jest.Mock).mockRejectedValue(new Error('err'));
  await act(async () => { renderPage(); });
  expect(await screen.findByText(/failed to load data/i)).toBeInTheDocument();
});