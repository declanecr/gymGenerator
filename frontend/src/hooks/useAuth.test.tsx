import { renderHook } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('throws if no provider', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.error).toEqual(Error('useAuth must be used within an AuthProvider'));
  });

  it('returns context value', () => {
    const value = { token: 't', login: jest.fn(), logout: jest.fn(), isAuthenticated: true };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toBe(value);
  });
});
