import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useWorkoutSets } from './useSets';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useWorkoutSets', () => {
  const url = 'http://localhost:3000/api/v1/workouts/w/exercises/e/sets';
  it('returns sets', async () => {
    const data = [{ id: 's1', createdAt: '', updatedAt: '', position: 1, reps: 1, weight: 1, completed: false }];
    server.use(http.get(url, () => HttpResponse.json(data)));
    const { result } = renderHook(() => useWorkoutSets('w', 'e'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
