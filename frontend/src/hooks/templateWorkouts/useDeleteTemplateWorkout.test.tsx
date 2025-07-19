import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'msw';
import { server } from '../../mocks/server';
import { useDeleteTemplateWorkout } from './useDeleteTemplateWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useDeleteTemplateWorkout', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/1';
  it('deletes workout', async () => {
    server.use(http.delete(url, () => HttpResponse.json({})));
    const { result } = renderHook(() => useDeleteTemplateWorkout(), { wrapper });
    await act(() => result.current.mutateAsync({ id: '1' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
