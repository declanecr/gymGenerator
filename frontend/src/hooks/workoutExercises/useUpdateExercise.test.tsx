import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useUpdateExercise } from './useUpdateExercise';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useUpdateExercise', () => {
  const url = 'http://localhost:3000/api/v1/workouts/abc/exercises/1';
  it('updates exercise', async () => {
    const updated = { workoutExerciseId: '1', exerciseId: 2, createdAt: '', updatedAt: '', workoutId: 'abc', position: 2, workoutSets: [] };
    server.use(http.patch(url, () => HttpResponse.json(updated)));
    const { result } = renderHook(() => useUpdateExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', id: '1', dto: { position: 2 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });
});
