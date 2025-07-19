import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useUpdateWorkout } from './useUpdateWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useUpdateWorkout', () => {
  const url = 'http://localhost:3000/api/v1/workouts/1';
  it('updates workout', async () => {
    const updated = { id: '1', createdAt: '', updatedAt: '', workoutTemplateId: null, workoutExercises: [] };
    server.use(http.patch(url, () => HttpResponse.json(updated)));
    const { result } = renderHook(() => useUpdateWorkout(), { wrapper });
    await act(() => result.current.mutateAsync({ id: '1', dto: { name: 'w' } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });
});
