import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  ProductCard,
  UserCard,
  StatCard
} from '../Card';

describe('Card Component', () => {
  describe('Basic Functionality', () => {
    it('renders children correctly', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');
    });

    it('renders as button when clickable', () => {
      render(<Card clickable>Content</Card>);
      const card = screen.getByRole('button');
      expect(card.tagName).toBe('BUTTON');
      expect(card).toHaveAttribute('type', 'button');
    });
  });

  describe('Variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white', 'border', 'border-gray-200');
    });

    it('applies outlined variant styles', () => {
      const { container } = render(<Card variant="outlined">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white', 'border-2', 'border-gray-300');
    });

    it('applies elevated variant styles', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-white', 'shadow-lg', 'border-gray-100');
    });
  });

  describe('Padding', () => {
    it('applies medium padding by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    it('applies no padding when padding is none', () => {
      const { container } = render(<Card padding="none">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('p-4', 'p-3', 'p-6');
    });

    it('applies small padding', () => {
      const { container } = render(<Card padding="sm">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-3');
    });

    it('applies large padding', () => {
      const { container } = render(<Card padding="lg">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Interactive States', () => {
    it('applies clickable styles when clickable', () => {
      render(<Card clickable>Content</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveClass('cursor-pointer', 'focus:outline-none', 'focus:ring-2');
    });

    it('applies hover styles when clickable and hover is enabled', () => {
      render(<Card clickable hover>Content</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveClass('hover:shadow-md', 'hover:border-gray-300');
    });

    it('does not apply hover styles when hover is disabled', () => {
      render(<Card clickable hover={false}>Content</Card>);
      const card = screen.getByRole('button');
      expect(card).not.toHaveClass('hover:shadow-md');
    });

    it('calls onClick when clicked and clickable', () => {
      const handleClick = jest.fn();
      render(<Card clickable onClick={handleClick}>Content</Card>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not clickable', () => {
      const handleClick = jest.fn();
      const { container } = render(<Card onClick={handleClick}>Content</Card>);
      
      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });

    it('preserves base classes with custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class', 'block', 'w-full', 'rounded-lg');
    });
  });
});

describe('CardHeader Component', () => {
  it('renders children correctly', () => {
    render(
      <CardHeader>
        <h2>Header Title</h2>
      </CardHeader>
    );
    
    expect(screen.getByText('Header Title')).toBeInTheDocument();
  });

  it('applies default margin bottom', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('mb-4');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('custom-header', 'mb-4');
  });
});

describe('CardTitle Component', () => {
  describe('Heading Levels', () => {
    it('renders h3 by default', () => {
      render(<CardTitle>Default Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Default Title');
    });

    it('renders h1 when level is 1', () => {
      render(<CardTitle level={1}>H1 Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
    });

    it('renders h2 when level is 2', () => {
      render(<CardTitle level={2}>H2 Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
    });

    it('renders h6 when level is 6', () => {
      render(<CardTitle level={6}>H6 Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 6 });
      expect(title).toBeInTheDocument();
    });
  });

  describe('Size Styles', () => {
    it('applies correct size class for level 1', () => {
      render(<CardTitle level={1}>Title</CardTitle>);
      expect(screen.getByRole('heading')).toHaveClass('text-2xl');
    });

    it('applies correct size class for level 3 (default)', () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByRole('heading')).toHaveClass('text-lg');
    });

    it('applies correct size class for level 6', () => {
      render(<CardTitle level={6}>Title</CardTitle>);
      expect(screen.getByRole('heading')).toHaveClass('text-xs');
    });
  });

  it('applies base styling classes', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByRole('heading');
    expect(title).toHaveClass('font-semibold', 'text-gray-900');
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    expect(screen.getByRole('heading')).toHaveClass('custom-title');
  });
});

describe('CardContent Component', () => {
  it('renders children correctly', () => {
    render(
      <CardContent>
        <p>This is card content</p>
      </CardContent>
    );
    
    expect(screen.getByText('This is card content')).toBeInTheDocument();
  });

  it('applies default text color', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('text-gray-700');
  });

  it('applies custom className', () => {
    const { container } = render(<CardContent className="custom-content">Content</CardContent>);
    const content = container.firstChild as HTMLElement;
    expect(content).toHaveClass('custom-content', 'text-gray-700');
  });
});

describe('CardFooter Component', () => {
  it('renders children correctly', () => {
    render(
      <CardFooter>
        <button>Action</button>
      </CardFooter>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies default justify-between', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('justify-between');
  });

  it('applies different justify options', () => {
    const { container, rerender } = render(<CardFooter justify="start">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('justify-start');

    rerender(<CardFooter justify="center">Footer</CardFooter>);
    expect(footer).toHaveClass('justify-center');

    rerender(<CardFooter justify="end">Footer</CardFooter>);
    expect(footer).toHaveClass('justify-end');
  });

  it('applies flex layout classes', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('flex', 'items-center', 'mt-4');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('ProductCard Component', () => {
  const mockProduct = {
    title: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    imageAlt: 'Test product image',
    description: 'This is a test product description',
  };

  it('renders product information correctly', () => {
    render(<ProductCard {...mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
  });

  it('renders product image with correct attributes', () => {
    render(<ProductCard {...mockProduct} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProduct.image);
    expect(image).toHaveAttribute('alt', mockProduct.imageAlt);
  });

  it('uses title as alt text when imageAlt is not provided', () => {
    const productWithoutAlt = { ...mockProduct };
    delete productWithoutAlt.imageAlt;
    
    render(<ProductCard {...productWithoutAlt} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', mockProduct.title);
  });

  it('renders Add to Cart button when onAddToCart is provided', () => {
    const handleAddToCart = jest.fn();
    render(<ProductCard {...mockProduct} onAddToCart={handleAddToCart} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const handleAddToCart = jest.fn();
    render(<ProductCard {...mockProduct} onAddToCart={handleAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(handleAddToCart).toHaveBeenCalledTimes(1);
  });

  it('shows "In Cart" when inCart is true', () => {
    render(<ProductCard {...mockProduct} onAddToCart={() => {}} inCart />);
    
    expect(screen.getByText('In Cart')).toBeInTheDocument();
    expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
  });

  it('shows "Adding..." when isLoading is true', () => {
    render(<ProductCard {...mockProduct} onAddToCart={() => {}} isLoading />);
    
    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  it('disables Add to Cart button when isLoading', () => {
    render(<ProductCard {...mockProduct} onAddToCart={() => {}} isLoading />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<ProductCard {...mockProduct} onClick={handleClick} />);
    
    // Find the card (not the button)
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents event propagation when Add to Cart is clicked', () => {
    const handleClick = jest.fn();
    const handleAddToCart = jest.fn();
    
    render(
      <ProductCard 
        {...mockProduct} 
        onClick={handleClick} 
        onAddToCart={handleAddToCart} 
      />
    );
    
    // Click the Add to Cart button specifically
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled(); // Should not bubble up
  });
});

describe('UserCard Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    role: 'Developer',
  };

  it('renders user information correctly', () => {
    render(<UserCard {...mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('renders avatar when provided', () => {
    render(<UserCard {...mockUser} />);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', mockUser.avatar);
    expect(avatar).toHaveAttribute('alt', mockUser.name);
  });

  it('renders initials when no avatar is provided', () => {
    const userWithoutAvatar = { ...mockUser };
    delete userWithoutAvatar.avatar;
    
    render(<UserCard {...userWithoutAvatar} />);
    
    expect(screen.getByText('JD')).toBeInTheDocument(); // John Doe -> JD
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('generates correct initials for single name', () => {
    render(<UserCard name="John" email="john@example.com" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('generates correct initials for multiple names', () => {
    render(<UserCard name="John Michael Doe" email="john@example.com" />);
    expect(screen.getByText('JM')).toBeInTheDocument(); // Takes first 2 initials
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<UserCard {...mockUser} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render as button when onClick is not provided', () => {
    render(<UserCard {...mockUser} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render role when not provided', () => {
    const userWithoutRole = { ...mockUser };
    delete userWithoutRole.role;
    
    render(<UserCard {...userWithoutRole} />);
    
    expect(screen.queryByText('Developer')).not.toBeInTheDocument();
  });
});

describe('StatCard Component', () => {
  const mockStat = {
    title: 'Total Sales',
    value: '$12,345',
    change: 12.5,
    changeType: 'increase' as const,
  };

  it('renders stat information correctly', () => {
    render(<StatCard {...mockStat} />);
    
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders numeric value correctly', () => {
    render(<StatCard title="Users" value={1234} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('applies correct color for increase change', () => {
    render(<StatCard {...mockStat} changeType="increase" />);
    const changeElement = screen.getByText('+12.5%');
    expect(changeElement).toHaveClass('text-green-600');
  });

  it('applies correct color for decrease change', () => {
    render(<StatCard {...mockStat} change={-5.2} changeType="decrease" />);
    const changeElement = screen.getByText('-5.2%');
    expect(changeElement).toHaveClass('text-red-600');
  });

  it('applies correct color for neutral change', () => {
    render(<StatCard {...mockStat} change={0} changeType="neutral" />);
    const changeElement = screen.getByText('0%');
    expect(changeElement).toHaveClass('text-gray-600');
  });

  it('does not show change when not provided', () => {
    const statWithoutChange = { ...mockStat };
    delete statWithoutChange.change;
    delete statWithoutChange.changeType;
    
    render(<StatCard {...statWithoutChange} />);
    
    expect(screen.queryByText(/\+.*%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/-.*%/)).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="stat-icon">📊</span>;
    render(<StatCard {...mockStat} icon={icon} />);
    
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('uses elevated variant by default', () => {
    const { container } = render(<StatCard {...mockStat} />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies custom className', () => {
    const { container } = render(<StatCard {...mockStat} className="custom-stat" />);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-stat');
  });
}); 