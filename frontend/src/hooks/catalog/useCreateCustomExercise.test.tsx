import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useCreateCustomExercise } from './useCreateCustomExercise';

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useCreateCustomExercise', () => {
  const url = 'http://localhost:3000/api/v1/exercises-catalog/custom';
  it('creates custom exercise', async () => {
    const ex = { exerciseId: 1, name: 'Curl', primaryMuscle: 'Biceps', default: false };
    server.use(http.post(url, async ({ request }) => {
      const body = await request.json();
      if (typeof body === 'object' && body !== null && 'name' in body) {
        expect((body as { name: string }).name).toBe('Curl');
      } else {
        throw new Error('Request body is not an object with a name property');
      }
      return HttpResponse.json(ex);
    }));
    const { result } = renderHook(() => useCreateCustomExercise(), { wrapper });
    await act(() => result.current.mutateAsync({ name: 'Curl', primaryMuscle: 'Biceps' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ex);
  });
});