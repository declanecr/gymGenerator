import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useUpdateSet } from './useUpdateSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useUpdateSet', () => {
  const url = 'http://localhost:3000/api/v1/workouts/w/exercises/e/sets/1';
  it('updates set', async () => {
    const updated = { id: '1', createdAt: '', updatedAt: '', position: 1, reps: 2, weight: 2, completed: false };
    server.use(http.patch(url, () => HttpResponse.json(updated)));
    const { result } = renderHook(() => useUpdateSet(), { wrapper });
    await act(() => result.current.mutateAsync({ setId: '1', workoutId: 'w', exerciseId: 'e', dto: { reps: 2 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });
});
