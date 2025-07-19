import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useDeleteSet } from './useDeleteSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useDeleteSet', () => {
  const url = 'http://localhost:3000/api/v1/workouts/e/exercises/w/sets/1';
  it('deletes set', async () => {
    server.use(http.delete(url, () => HttpResponse.json({})));
    const { result } = renderHook(() => useDeleteSet(), { wrapper });
    await act(() => result.current.mutateAsync({ setId: '1', workoutId: 'w', exerciseId: 'e' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
