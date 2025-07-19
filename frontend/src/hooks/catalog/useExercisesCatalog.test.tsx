import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useExercisesCatalog } from './useExercisesCatalog';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useExercisesCatalog', () => {
  const url = 'http://localhost:3000/api/v1/exercises-catalog?custom=true';
  it('fetches catalog', async () => {
    const data = [{ exerciseId: 1, name: 'Bench', primaryMuscle: 'Chest', default: true, templateExercises: [], workoutExercises: [] }];
    server.use(http.get(url, () => HttpResponse.json(data)));
    const { result } = renderHook(() => useExercisesCatalog(true), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(data));
  });
});
