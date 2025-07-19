import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { server } from '../../mocks/server';
import { useDeleteTemplateSet } from './useDeleteTemplateSet';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useDeleteTemplateSet', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises/def/sets/1';
  it('deletes set', async () => {
    server.use(http.delete(url, () => HttpResponse.json({})));
    const { result } = renderHook(() => useDeleteTemplateSet(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', exerciseId: 'def', setId: '1' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
