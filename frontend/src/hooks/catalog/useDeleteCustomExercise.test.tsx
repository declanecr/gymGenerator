import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useDeleteCustomExercise } from './useDeleteCustomExercise';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useDeleteCustomExercise', () => {
  const url = 'http://localhost:3000/api/v1/exercises-catalog/custom/1';
  it('deletes exercise', async () => {
    server.use(http.delete(url, () => HttpResponse.json({})));
    const { result } = renderHook(() => useDeleteCustomExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ id: 1 }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});