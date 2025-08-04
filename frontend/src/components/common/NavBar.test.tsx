import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavBar from './NavBar';

jest.mock('../../hooks/catalog/useFilteredExercise', () => ({
  useFilteredExercises: () => ({
    filtered: [{ id: 1, name: 'Bench', primaryMuscle: 'Chest' }],
    isLoading: false,
    error: null
  })
}));

jest.mock('../../hooks/users/useGetMe', () => ({
  useGetMe: () => ({ data: { id: 1, email: 'test@example.com' } })
}));

jest.mock('../workouts/StartWorkoutModal', () => ({
  __esModule: true,
  default: (props: { open: boolean }) => props.open ? <div data-testid="workout-modal" /> : null
}));

jest.mock('../template-workouts/StartTemplateModal', () => ({
  __esModule: true,
  default: (props: { open: boolean }) => props.open ? <div data-testid="template-modal" /> : null
}));

jest.mock('../exercises/ExerciseInfoModal', () => ({
  __esModule: true,
  ExerciseInfoModal: (props: { open: boolean }) => props.open ? <div data-testid="info-modal" /> : null
}));

function renderNavBar() {
  const client = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <NavBar />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

test('opens menu and shows template modal', () => {
  renderNavBar();
  fireEvent.click(screen.getByLabelText(/add/i));
  fireEvent.click(screen.getByText(/template/i));
  expect(screen.getByTestId('template-modal')).toBeInTheDocument();
});

test('opens menu and shows workout modal', () => {
  renderNavBar();
  fireEvent.click(screen.getByLabelText(/add/i));
  fireEvent.click(screen.getByText(/workout/i));
  expect(screen.getByTestId('workout-modal')).toBeInTheDocument();
});

test('search select shows exercise info modal', () => {
  renderNavBar();
  const input = screen.getByPlaceholderText('Search exercises...');
  fireEvent.change(input, { target: { value: 'Bench' } });
  fireEvent.click(screen.getByText('Bench'));
  expect(screen.getByTestId('info-modal')).toBeInTheDocument();
});