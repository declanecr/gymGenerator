import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useUpdateTemplateSet } from './useUpdateTemplateSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useUpdateTemplateSet', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises/def/sets/1';
  it('updates set', async () => {
    const updated = { id: '1', reps: 2, weight: 2, position: 1 };
    server.use(http.patch(url, () => HttpResponse.json(updated)));
    const { result } = renderHook(() => useUpdateTemplateSet(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', exerciseId: 'def', setId: '1', dto: { reps: 2 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });
});
