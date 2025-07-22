import { AuthContext } from './AuthContext';

// Basic test to ensure context is exported with Provider

describe('AuthContext', () => {
  it('is defined with Provider', () => {
    expect(AuthContext).toBeDefined();
    expect(AuthContext.Provider).toBeDefined();
  });
});