import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateTemplateExercise } from './useCreateTemplateExercise';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateTemplateExercise', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises';
  it('creates exercise', async () => {
    const created = { templateExerciseId: '1', exerciseId: 2, position: 1, sets: [] };
    server.use(http.post(url, () => HttpResponse.json(created)));
    const { result } = renderHook(() => useCreateTemplateExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ workoutId: 'abc', dto: { exerciseId: 2, position: 1 } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(created);
  });
});
