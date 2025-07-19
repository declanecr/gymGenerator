import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useWorkoutExercises } from './useExercises';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useWorkoutExercises', () => {
  const url = 'http://localhost:3000/api/v1/workouts/abc/exercises';
  it('returns exercises', async () => {
    const data = [{ workoutExerciseId: '1', exerciseId: 2, createdAt: '', updatedAt: '', workoutId: 'abc', position: 1, workoutSets: [] }];
    server.use(http.get(url, () => HttpResponse.json(data)));
    const { result } = renderHook(() => useWorkoutExercises('abc'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
