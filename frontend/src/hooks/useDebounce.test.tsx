import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('debounces changing value', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
      initialProps: { val: 'a' },
    });

    expect(result.current).toBe('a');
    rerender({ val: 'b' });

    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('b');
  });
});
