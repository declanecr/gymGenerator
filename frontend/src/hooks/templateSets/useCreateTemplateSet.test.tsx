import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateTemplateSet } from './useCreateTemplateSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateTemplateSet', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises/def/sets';
  it('creates set', async () => {
    const created = { id: 's1', reps: 1, weight: 1, position: 1 };
    server.use(http.post(url, () => HttpResponse.json(created)));
    const { result } = renderHook(() => useCreateTemplateSet(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', exerciseId: 'def', dto: { reps: 1, weight: 1, position: 1 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(created);
  });
});
