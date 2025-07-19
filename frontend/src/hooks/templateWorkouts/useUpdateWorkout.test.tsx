import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useUpdateTemplateWorkout } from './useUpdateWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useUpdateTemplateWorkout', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/1';
  it('updates workout', async () => {
    const updated = { id: '1', name: 'new', createdAt: '', updatedAt: '' };
    server.use(http.patch(url, () => HttpResponse.json(updated)));
    const { result } = renderHook(() => useUpdateTemplateWorkout(), { wrapper });
    await act(() => result.current.mutateAsync({ id: '1', dto: { name: 'new' } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(updated);
  });
});
