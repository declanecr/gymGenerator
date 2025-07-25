import { server } from './server';

describe('msw server', () => {
  it('exposes MSW API methods', () => {
    expect(typeof server.listen).toBe('function');
    expect(typeof server.close).toBe('function');
    expect(typeof server.resetHandlers).toBe('function');
  });
});