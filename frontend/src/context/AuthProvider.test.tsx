import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import api from '../api/axios';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '../hooks/useAuth';

// mock out token-validation helper so tests don't depend on jwt-decode
jest.mock('../utils/auth', ()=>({
  isTokenValid: jest.fn((token: string | null)=>Boolean(token))
}))


function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates token from localStorage', async () => {
    // a fake-but-decodable JWT with exp far in the future
    const validToken = 'eyJhbGciOiJub25lIn0.eyJleHAiOjMzk5OTk5OTk5OX0.';
    localStorage.setItem('accessToken', validToken);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.token).toBe(validToken));
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token in state and localStorage', () => {
    const validToken = 'eyJhbGciOiJub25lIn0.eyJleHAiOjMzk5OTk5OTk5OX0.';
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(validToken);
    });
    expect(result.current.token).toBe(validToken);
    expect(localStorage.getItem('accessToken')).toBe(validToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears token from state and storage', () => {
    const validToken = 'eyJhbGciOiJub25lIn0.eyJleHAiOjMzk5OTk5OTk5OX0.';
    const { result } = renderHook(() => useAuth(), { wrapper });

    // first, login so there is something to clear
    act(() => result.current.login(validToken));
    expect(result.current.isAuthenticated).toBe(true);

    // then loguot
    act(() => {
      result.current.logout();
    });
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('adds Authorization header to requests', async () => {
    server.use(
      http.get('http://localhost:3000/api/v1/test', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer secret');
        return HttpResponse.json({ ok: true });
      })
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.login('secret');
    });
    await api.get('/test');
  });
});