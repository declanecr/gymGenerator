import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WorkoutList from './WorkoutList';

test('WorkoutsList fetches and displays workouts', async () => {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/workouts']}>
        <Routes>
          <Route path="/workouts" element={<WorkoutList />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  // 1) assert loading UI appears
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // 2) wait for MSW response, then assert that IDs "A" and "B" appear
  const itemA = await screen.findByText(/A/);
  const itemB = await screen.findByText(/B/);
  expect(itemA).toBeInTheDocument();
  expect(itemB).toBeInTheDocument();
});
