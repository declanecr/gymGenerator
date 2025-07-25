import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateTemplateWorkout } from './useCreateTemplateWorkout';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateTemplateWorkout', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts';
  it('creates workout', async () => {
    const workout = { id: '1', name: 'tmp', createdAt: '', updatedAt: '' };
    server.use(http.post(url, () => HttpResponse.json(workout)));
    const { result } = renderHook(() => useCreateTemplateWorkout(), { wrapper });
    await act(() => result.current.mutateAsync({ dto: { name: 'tmp' } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(workout);
  });
});
