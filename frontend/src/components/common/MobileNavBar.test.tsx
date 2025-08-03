import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MobileNavBar from './MobileNavBar';

jest.mock('../../hooks/catalog/useFilteredExercise', () => ({
  useFilteredExercises: () => ({
    filtered: [],
    isLoading: false,
    error: null
  })
}));

jest.mock('../workouts/StartWorkoutModal', () => ({
  __esModule: true,
  default: (props: { open: boolean }) => props.open ? <div data-testid="workout-modal" /> : null
}));

jest.mock('../template-workouts/StartTemplateModal', () => ({
  __esModule: true,
  default: (props: { open: boolean }) => props.open ? <div data-testid="template-modal" /> : null
}));

function renderBar() {
  const client = new QueryClient();
  render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <MobileNavBar />
      </QueryClientProvider>
    </MemoryRouter>
  );
}

test('opens menu and shows template modal', () => {
  renderBar();
  fireEvent.click(screen.getByLabelText(/add/i));
  fireEvent.click(screen.getByText(/template/i));
  expect(screen.getByTestId('template-modal')).toBeInTheDocument();
});

test('opens menu and shows workout modal', () => {
  renderBar();
  fireEvent.click(screen.getByLabelText(/add/i));
  fireEvent.click(screen.getByText(/workout/i));
  expect(screen.getByTestId('workout-modal')).toBeInTheDocument();
});