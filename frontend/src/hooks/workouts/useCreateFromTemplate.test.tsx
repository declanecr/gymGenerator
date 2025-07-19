import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateWorkoutFromTemplate } from './useCreateFromTemplate';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateWorkoutFromTemplate', () => {
  const url = 'http://localhost:3000/api/v1/workouts/from-template/1';
  it('creates workout', async () => {
    const workout = { id: 'w1', createdAt: '', updatedAt: '', workoutTemplateId: '1', workoutExercises: [] };
    server.use(http.post(url, () => HttpResponse.json(workout)));
    const { result } = renderHook(() => useCreateWorkoutFromTemplate(), { wrapper });
    await act(() => result.current.mutateAsync({ tid: '1' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(workout);
  });
});
