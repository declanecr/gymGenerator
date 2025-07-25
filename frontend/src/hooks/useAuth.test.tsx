import { renderHook } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('throws if no provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();

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
