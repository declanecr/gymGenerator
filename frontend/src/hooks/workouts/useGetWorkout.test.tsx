import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useGetWorkout } from './useGetWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useGetWorkout', () => {
  const url = 'http://localhost:3000/api/v1/workouts/:id';

  it('returns data on success', async () => {
    const workout = {
      id: '123',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      workoutTemplateId: null,
      workoutExercises: [],
    };
    server.use(
      http.get(url, ({ params }) =>
        HttpResponse.json({ ...workout, id: params.id })
      )
    );

    const { result } = renderHook(() => useGetWorkout('123'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(workout);
    expect(result.current.error).toBe(null);
  });

  it('returns error on failure', async () => {
    server.use(
      http.get(url, () =>
        HttpResponse.json({ message: 'error' }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useGetWorkout('123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});