import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useTemplateExercises } from './useTemplateExercises';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useTemplateExercises', () => {
  const url = 'http://localhost:3000/api/v1/template-workouts/abc/exercises';
  it('returns exercises', async () => {
    const data = [{ templateExerciseId: '1', exerciseId: 2, position: 1, sets: [] }];
    server.use(http.get(url, () => HttpResponse.json(data)));
    const { result } = renderHook(() => useTemplateExercises('abc'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });
});
