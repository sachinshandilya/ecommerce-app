import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, IconButton, ButtonGroup } from '../Button';

// Mock icon for testing
const MockIcon = () => <span data-testid="mock-icon">⭐</span>;

describe('Button Component', () => {
  describe('Basic Functionality', () => {
    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button isLoading onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600', 'text-white');
    });

    it('renders danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'text-white');
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent', 'text-gray-700', 'border');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('States', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
      // Check for spinner (SVG element)
      expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Button Types', () => {
    it('defaults to button type', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('can be submit type', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('can be reset type', () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('has proper focus styles', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });
});

describe('IconButton Component', () => {
  describe('Basic Functionality', () => {
    it('renders icon correctly', () => {
      render(<IconButton icon={<MockIcon />} aria-label="Icon button" />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('requires aria-label for accessibility', () => {
      render(<IconButton icon={<MockIcon />} aria-label="Required label" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Required label');
    });

    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(
        <IconButton 
          icon={<MockIcon />} 
          onClick={handleClick} 
          aria-label="Clickable icon" 
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Variants', () => {
    it('renders ghost variant by default', () => {
      render(<IconButton icon={<MockIcon />} aria-label="Ghost" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-gray-500');
    });

    it('renders primary variant', () => {
      render(<IconButton variant="primary" icon={<MockIcon />} aria-label="Primary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'text-white');
    });

    it('renders danger variant', () => {
      render(<IconButton variant="danger" icon={<MockIcon />} aria-label="Danger" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'text-white');
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<IconButton isLoading icon={<MockIcon />} aria-label="Loading" />);
      expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
      expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <IconButton 
          isLoading 
          icon={<MockIcon />} 
          onClick={handleClick} 
          aria-label="Loading" 
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<IconButton icon={<MockIcon />} aria-label="Medium" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-2');
    });

    it('renders small size', () => {
      render(<IconButton size="sm" icon={<MockIcon />} aria-label="Small" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-1');
    });

    it('renders large size', () => {
      render(<IconButton size="lg" icon={<MockIcon />} aria-label="Large" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-3');
    });
  });
});

describe('ButtonGroup Component', () => {
  it('renders children correctly', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('applies group role', () => {
    render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies rounded classes to first and last buttons', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Middle</Button>
        <Button>Last</Button>
      </ButtonGroup>
    );

    const buttons = screen.getAllByRole('button');
    
    // First button should have left rounded corners
    expect(buttons[0]).toHaveClass('rounded-l-md', 'rounded-r-none');
    
    // Middle button should have no rounded corners
    expect(buttons[1]).toHaveClass('rounded-none');
    
    // Last button should have right rounded corners
    expect(buttons[2]).toHaveClass('rounded-r-md', 'rounded-l-none');
  });

  it('handles single button correctly', () => {
    render(
      <ButtonGroup>
        <Button>Only Button</Button>
      </ButtonGroup>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-md');
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup className="custom-group">
        <Button>Button</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole('group')).toHaveClass('custom-group');
  });

  it('applies margin classes correctly', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );

    const buttons = screen.getAllByRole('button');
    
    // First button should not have negative margin
    expect(buttons[0]).toHaveClass('first:ml-0');
    
    // Second button should have negative margin
    expect(buttons[1]).toHaveClass('-ml-px');
  });
}); 