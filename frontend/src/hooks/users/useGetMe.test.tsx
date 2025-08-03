import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { useGetMe } from './useGetMe';



// mock out auth hook so enabled:true by default
jest.mock('../useAuth', ()=> ({
  useAuth: () => ({isAuthenticated: true}),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}


describe('useGetMe', () => {
  const url = 'http://localhost:3000/api/v1/users/me';

  it('returns user data on success', async () => {
    const user = { id: 1, email: 'test@example.com', createdAt: '2024-01-01', role: 'user' };
    server.use(http.get(url, () => HttpResponse.json(user)));

    const { result } = renderHook(() => useGetMe(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(user);
    expect(result.current.error).toBe(null);
  });

  it('handles error response', async () => {
    server.use(
      http.get(url, () => HttpResponse.json({ message: 'fail' }, { status: 500 }))
    );

    const { result } = renderHook(() => useGetMe(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });
});