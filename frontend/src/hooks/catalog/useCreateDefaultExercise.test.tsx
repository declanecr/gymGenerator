import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateDefaultExercise } from './useCreateDefaultExercise';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateDefaultExercise', () => {
  const url = 'http://localhost:3000/api/v1/exercises-catalog/default';
  it('creates default exercise', async () => {
    const exercise = { exerciseId: 1, name: 'Press', primaryMuscle: 'Chest', default: true };
    server.use(http.post(url, () => HttpResponse.json(exercise)));
    const { result } = renderHook(() => useCreateDefaultExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ name: 'Press', primaryMuscle: 'Chest'}));
    await waitFor(()=> expect(result.current.data?.default).toBe(true))
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(exercise);
  });
});