import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useAllWorkouts } from './useAllWorkouts';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useAllWorkouts', () => {
  const url = 'http://localhost:3000/api/v1/workouts/admin';

  it('returns data on success', async () => {
    const workouts = [
      { id: '1', createdAt: '2024-01-01', updatedAt: '2024-01-01', workoutTemplateId: null, workoutExercises: [] },
    ];
    server.use(http.get(url, () => HttpResponse.json(workouts)));

    const { result } = renderHook(() => useAllWorkouts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(workouts);
    expect(result.current.error).toBe(null);
  });

  it('handles error response', async () => {
    server.use(
      http.get(url, () => HttpResponse.json({ message: 'fail' }, { status: 500 }))
    );

    const { result } = renderHook(() => useAllWorkouts(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});