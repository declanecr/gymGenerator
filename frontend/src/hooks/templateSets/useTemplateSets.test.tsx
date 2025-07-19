import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useTemplateSets } from './useTemplateSets';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useTemplateSets', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises/def/sets';
  it('returns sets', async () => {
    const data = [{ id: 's1', reps: 1, weight: 1, position: 1 }];
    server.use(http.get(url, () => HttpResponse.json(data)));
    const { result } = renderHook(() => useTemplateSets('abc', 'def'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
