import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WorkoutPage from './WorkoutPage';
import { useAuth } from '../hooks/useAuth';
import { DeviceProvider } from '../context/DeviceProvider';

jest.mock('../hooks/useAuth', ()=>({useAuth: jest.fn() }));

jest.mock('../hooks/workouts/useGetWorkout', () => ({
  useGetWorkout: () => ({
    data: { id: 'w1', name: 'W1', notes: '', createdAt: '', updatedAt: '', workoutTemplateId: null, workoutExercises: [] },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../hooks/workoutExercises/useExercises', () => ({
  useWorkoutExercises: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return { ...actual, useQueries: () => [] };
});

jest.mock('../hooks/workoutExercises/useCreateExercise', () => ({ useCreateExercise: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workoutExercises/useUpdateExercise', () => ({ useUpdateExercise: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workoutExercises/useDeleteExercise', () => ({ useDeleteExercise: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workoutSets/useCreateSet', () => ({ useCreateSet: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workoutSets/useUpdateSet', () => ({ useUpdateSet: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workoutSets/useDeleteSet', () => ({ useDeleteSet: () => ({ mutateAsync: jest.fn() }) }));
jest.mock('../hooks/workouts/useDeleteWorkout', () => ({ useDeleteWorkout: () => ({ mutateAsync: jest.fn() }) }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
});

function renderPage() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/workouts/w1']}>
        <DeviceProvider>
          <Routes>
            <Route path="/workouts/:id" element={<WorkoutPage />} />
          </Routes>
        </DeviceProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('displays workout details after load', async () => {
  renderPage();
  expect(await screen.findByText(/workout details/i)).toBeInTheDocument();
});