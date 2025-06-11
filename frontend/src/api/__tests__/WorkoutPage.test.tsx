// src/components/__tests__/WorkoutPage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WorkoutPage from '../../pages/Workout';

describe('WorkoutPage (integration)', () => {
  it('shows a loading state then renders fetched workout data', async () => {
    // 1. Create a fresh React Query client for isolation
    const queryClient = new QueryClient();

    // 2. Render <WorkoutPage> at the route /workouts/XYZ
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/workouts/XYZ']}>
          <Routes>
            <Route path="/workouts/:id" element={<WorkoutPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // 3. Assert the loading indicator appears first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // 4. Wait for MSW to respond and the UI to update
    //    We're expecting to see the workout ID or any field your component displays
    const workoutIdHeading = await screen.findByText(/xyz/i);
    expect(workoutIdHeading).toBeInTheDocument();

    // 5. (Optional) Assert on other fields, e.g. createdAt, exercises list, etc.
    //    expect(screen.getByText(/workoutExercises/i)).toBeInTheDocument();
  });
});
