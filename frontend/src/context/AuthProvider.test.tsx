import { renderHook, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import api from '../api/axios';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '../hooks/useAuth';

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hydrates token from localStorage', () => {
    localStorage.setItem('accessToken', 'stored');
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.token).toBe('stored');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores token in state and localStorage', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.login('abc');
    });
    expect(result.current.token).toBe('abc');
    expect(localStorage.getItem('accessToken')).toBe('abc');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('logout clears token from state and storage', () => {
    localStorage.setItem('accessToken', 'abc');
    const { result } = renderHook(() => useAuth(), { wrapper });
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