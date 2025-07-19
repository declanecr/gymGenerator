import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateSet } from './useCreateSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateSet', () => {
  const url = 'http://localhost:3000/api/v1/workouts/w/exercises/e/sets';
  it('creates set', async () => {
    const created = { id: 's1', createdAt: '', updatedAt: '', position: 1, reps: 1, weight: 1, completed: false };
    server.use(http.post(url, () => HttpResponse.json(created)));
    const { result } = renderHook(() => useCreateSet(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'w', exerciseId: 'e', dto: { reps: 1, weight: 1, position: 1 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(created);
  });
});
