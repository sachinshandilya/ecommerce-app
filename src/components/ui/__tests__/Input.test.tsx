import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Input, SearchInput, Textarea } from '../Input';

describe('Input Component', () => {
  describe('Basic Functionality', () => {
    it('renders with initial value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });

    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input value="" onChange={handleChange} />);
      
      await user.type(screen.getByRole('textbox'), 'hello');
      
      expect(handleChange).toHaveBeenCalledWith('h');
      // Should be called for each character
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('displays placeholder text', () => {
      render(<Input value="" onChange={() => {}} placeholder="Enter text here" />);
      expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
    });

    it('handles different input types', () => {
      const { rerender } = render(<Input value="" onChange={() => {}} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input value="" onChange={() => {}} type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

      rerender(<Input value="" onChange={() => {}} type="number" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });
  });

  describe('Labels and Accessibility', () => {
    it('renders label when provided', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          label="Email Address" 
          id="email-input" 
        />
      );
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          label="Required Field" 
          required 
        />
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('associates label with input correctly', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          label="Username" 
          id="username" 
        />
      );
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Username');
      
      expect(input).toHaveAttribute('id', 'username');
      expect(label).toHaveAttribute('for', 'username');
    });

    it('supports custom aria-describedby', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          aria-describedby="help-text" 
        />
      );
      
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text');
    });
  });

  describe('Error States', () => {
    it('displays error message', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          error="This field is required" 
          id="error-input"
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('sets aria-invalid when error exists', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          error="Invalid input" 
        />
      );
      
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies error styling', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          error="Error message" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300', 'text-red-900');
    });

    it('creates error message id correctly', () => {
      render(
        <Input 
          value="" 
          onChange={() => {}} 
          error="Error message" 
          id="test-input"
        />
      );
      
      expect(screen.getByText('Error message')).toHaveAttribute('id', 'test-input-error');
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input value="" onChange={() => {}} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<Input value="" onChange={() => {}} disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500');
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input value="" onChange={handleChange} disabled />);
      
      await user.type(screen.getByRole('textbox'), 'test');
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Additional Props', () => {
    it('supports autoComplete', () => {
      render(<Input value="" onChange={() => {}} autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
    });

    it('supports name attribute', () => {
      render(<Input value="" onChange={() => {}} name="username" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
    });

    it('applies custom className', () => {
      render(<Input value="" onChange={() => {}} className="custom-input" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });
});

describe('SearchInput Component', () => {
  describe('Basic Functionality', () => {
    it('renders with search icon', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      
      // Check for search icon (SVG)
      const searchIcon = document.querySelector('svg[viewBox="0 0 24 24"]');
      expect(searchIcon).toBeInTheDocument();
    });

    it('displays default placeholder', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('supports custom placeholder', () => {
      render(<SearchInput value="" onChange={() => {}} placeholder="Custom search..." />);
      expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
    });

    it('has search type attribute', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });
  });

  describe('Clear Functionality', () => {
    it('shows clear button when there is a value', () => {
      render(<SearchInput value="search term" onChange={() => {}} />);
      
      // Should show clear button (X icon)
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('clears value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<SearchInput value="search term" onChange={handleChange} />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      await user.click(clearButton);
      
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('calls onClear callback when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = jest.fn();
      
      render(<SearchInput value="search term" onChange={() => {}} onClear={handleClear} />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      await user.click(clearButton);
      
      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(<SearchInput value="search" onChange={() => {}} isLoading />);
      
      const spinner = document.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides clear button when loading', () => {
      render(<SearchInput value="search" onChange={() => {}} isLoading />);
      
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('disables clear button when disabled', () => {
      render(<SearchInput value="search" onChange={() => {}} disabled />);
      
      const clearButton = screen.getByRole('button', { name: 'Clear search' });
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search products');
    });

    it('supports custom aria-label', () => {
      render(<SearchInput value="" onChange={() => {}} aria-label="Search users" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search users');
    });

    it('has proper focus styles', () => {
      render(<SearchInput value="" onChange={() => {}} />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });
});

describe('Textarea Component', () => {
  describe('Basic Functionality', () => {
    it('renders with initial value', () => {
      render(<Textarea value="initial text" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('initial text');
    });

    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Textarea value="" onChange={handleChange} />);
      
      await user.type(screen.getByRole('textbox'), 'hello');
      
      expect(handleChange).toHaveBeenCalledWith('h');
      expect(handleChange).toHaveBeenCalledTimes(5);
    });

    it('displays placeholder text', () => {
      render(<Textarea value="" onChange={() => {}} placeholder="Enter description..." />);
      expect(screen.getByPlaceholderText('Enter description...')).toBeInTheDocument();
    });

    it('has default rows', () => {
      render(<Textarea value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
    });

    it('supports custom rows', () => {
      render(<Textarea value="" onChange={() => {}} rows={5} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    });
  });

  describe('Character Count', () => {
    it('shows character count when maxLength is provided', () => {
      render(<Textarea value="hello" onChange={() => {}} maxLength={100} />);
      expect(screen.getByText('5/100')).toBeInTheDocument();
    });

    it('updates character count as user types', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      let currentValue = '';
      
      // Mock the onChange to update the value
      handleChange.mockImplementation((newValue) => {
        currentValue = newValue;
      });
      
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return (
          <Textarea 
            value={value} 
            onChange={setValue} 
            maxLength={20} 
          />
        );
      };
      
      render(<TestComponent />);
      
      await user.type(screen.getByRole('textbox'), 'hello world');
      
      expect(screen.getByText('11/20')).toBeInTheDocument();
    });

    it('does not show character count when maxLength is not provided', () => {
      render(<Textarea value="hello" onChange={() => {}} />);
      expect(screen.queryByText(/\/\d+$/)).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('displays error message', () => {
      render(<Textarea value="" onChange={() => {}} error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies error styling', () => {
      render(<Textarea value="" onChange={() => {}} error="Error message" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-300', 'text-red-900');
    });

    it('sets aria-invalid when error exists', () => {
      render(<Textarea value="" onChange={() => {}} error="Invalid input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Labels and Accessibility', () => {
    it('renders label when provided', () => {
      render(
        <Textarea 
          value="" 
          onChange={() => {}} 
          label="Description" 
          id="description" 
        />
      );
      
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(
        <Textarea 
          value="" 
          onChange={() => {}} 
          label="Required Field" 
          required 
        />
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('Resize and Styling', () => {
    it('has resize-vertical class', () => {
      render(<Textarea value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveClass('resize-vertical');
    });

    it('applies custom className', () => {
      render(<Textarea value="" onChange={() => {}} className="custom-textarea" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
    });
  });

  describe('Disabled State', () => {
    it('disables textarea when disabled prop is true', () => {
      render(<Textarea value="" onChange={() => {}} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styling', () => {
      render(<Textarea value="" onChange={() => {}} disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500');
    });
  });
}); 