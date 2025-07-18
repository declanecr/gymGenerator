import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useGetTemplateWorkout } from './useGetTemplateWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useGetTemplateWorkout', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/:id';

  it('returns data on success', async () => {
    const workout = {
      id: 'xyz',
      name: 'tmp',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      templateExercises: [],
    };
    server.use(
      http.get(url, ({ params }) => HttpResponse.json({ ...workout, id: params.id }))
    );

    const { result } = renderHook(() => useGetTemplateWorkout('xyz'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(workout);
    expect(result.current.error).toBe(null);
  });

  it('handles error response', async () => {
    server.use(
      http.get(url, () => HttpResponse.json({ message: 'fail' }, { status: 500 }))
    );

    const { result } = renderHook(() => useGetTemplateWorkout('xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});