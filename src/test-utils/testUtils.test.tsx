import React from 'react';
import { render } from '@testing-library/react';
import { renderWithProviders, createMockSearchParams } from './testUtils';

describe('Test Utils', () => {
  describe('renderWithProviders', () => {
    it('should render component with providers', () => {
      const TestComponent = () => <div>Test</div>;
      
      expect(() => {
        renderWithProviders(<TestComponent />);
      }).not.toThrow();
    });

    it('should render component without providers when specified', () => {
      const TestComponent = () => <div>Test</div>;
      
      expect(() => {
        renderWithProviders(<TestComponent />, { withProviders: false });
      }).not.toThrow();
    });
  });

  describe('createMockSearchParams', () => {
    it('should create URLSearchParams from object', () => {
      const params = createMockSearchParams({ key: 'value', test: 'data' });
      
      expect(params.get('key')).toBe('value');
      expect(params.get('test')).toBe('data');
    });

    it('should create empty URLSearchParams when no params provided', () => {
      const params = createMockSearchParams();
      
      expect(params.toString()).toBe('');
    });
  });
}); 