import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

jest.mock('../hooks/workouts/useAllWorkouts', () => ({
  useAllWorkouts: () => ({
    data: [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ],
    isLoading: false,
    error: null,
  }),
}));

function renderPage() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('lists workouts returned from hook', () => {
  renderPage();
  expect(screen.getByText('One')).toBeInTheDocument();
  expect(screen.getByText('Two')).toBeInTheDocument();
});