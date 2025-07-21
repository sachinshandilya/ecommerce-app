import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should still be initial immediately after update
    expect(result.current).toBe('initial');

    // Fast forward time but not enough
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    expect(result.current).toBe('initial');

    // Fast forward time to trigger debounce
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    expect(result.current).toBe('updated');
  });

  it('should handle multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // Multiple rapid updates
    rerender({ value: 'update1', delay: 500 });
    rerender({ value: 'update2', delay: 500 });
    rerender({ value: 'final', delay: 500 });

    // Should still be initial
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have the final value
    expect(result.current).toBe('final');
  });

  it('should handle empty and null values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 }
      }
    );

    // Test empty string
    rerender({ value: '', delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe('');

    // Test null
    rerender({ value: null, delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current).toBe(null);
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 }
      }
    );

    rerender({ value: 'updated', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Should still be initial because delay is now 1000ms
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(700);
    });
    
    // Now should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    rerender({ value: 'first', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Change value again before timer expires
    rerender({ value: 'second', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Should still be initial
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Now should be 'second'
    expect(result.current).toBe('second');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    );

    rerender({ value: 'immediate', delay: 0 });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('immediate');
  });
}); 