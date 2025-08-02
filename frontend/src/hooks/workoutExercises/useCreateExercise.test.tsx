import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateExercise } from './useCreateExercise';
import { mapTemplateExercise } from '../../api/exercises';


function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateExercise', () => {
  const url = 'http://localhost:3000/api/v1/workouts/abc/exercises';
  it('creates exercise', async () => {
    const raw = { id: '1', name: 'test', exerciseId: 2, createdAt: '', updatedAt: '', workoutId: 'abc', position: 1, workoutSets: [] };
    server.use(http.post(url, () => HttpResponse.json(raw)));
    const { result } = renderHook(() => useCreateExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', dto: { exerciseId: 2, position: 1 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mapTemplateExercise(raw));

  });
});
