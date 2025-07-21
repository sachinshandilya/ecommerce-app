# Task 009: Shopping Cart Functionality

## Overview
Implement comprehensive shopping cart functionality including cart page, cart items management, total calculations, and checkout summary page.

## Priority: High
**Estimated Time**: 6 hours  
**Dependencies**: Task 004 (Context Providers), Task 008 (Product Details Page)  
**Completion Criteria**: Fully functional cart system with item management and checkout summary

## Implementation Details

### 1. Cart Page (`/src/app/cart/page.tsx`)

#### Cart Page Features
- **Cart Items Display**: List all items in cart with product details
- **Empty Cart State**: Message and navigation when cart is empty
- **Cart Summary**: Total calculation and item count
- **Responsive Layout**: Mobile and desktop optimized layout

#### Implementation Requirements
```typescript
export default function CartPage() {
  // CartContext integration
  // Loading state handling
  // Empty cart state handling
  // Component rendering with proper layout
}
```

#### Page Structure
- Cart items list section
- Cart summary sidebar (desktop) or bottom section (mobile)
- Empty cart state with call-to-action
- Navigation back to products

### 2. Cart Item Component (`/src/components/features/CartItem.tsx`)

#### Cart Item Features
- **Product Information**: Image, title, price display
- **Quantity Display**: Show current quantity (read-only)
- **Remove Button**: Remove item from cart with confirmation
- **Loading States**: Show loading during remove operations
- **Product Navigation**: Link to product details page

#### Implementation Requirements
```typescript
interface CartItemProps {
  cartItem: CartItem;
  onRemove: (productId: number) => void;
  isRemoving?: boolean;
}
```

#### Item Layout
- Product thumbnail image (Next.js Image optimization)
- Product title with link to details page
- Price and quantity information
- Remove button with loading state
- Responsive design for mobile and desktop

### 3. Cart Summary Component (`/src/components/features/CartSummary.tsx`)

#### Summary Features
- **Item Count**: Total number of items in cart
- **Subtotal Calculation**: Sum of all item prices
- **Total Display**: Final cart total
- **Checkout Button**: Navigate to checkout summary
- **Empty State**: Hide when cart is empty

#### Implementation Requirements
```typescript
interface CartSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  onCheckout: () => void;
}
```

#### Summary Layout
- Clear total calculation display
- Item count and subtotal breakdown
- Prominent checkout button
- Responsive design considerations

### 4. Empty Cart Component (`/src/components/features/EmptyCart.tsx`)

#### Empty State Features
- **Illustration/Icon**: Visual indicator for empty cart
- **Message Text**: Friendly message about empty cart
- **Call-to-Action**: Button to browse products
- **Navigation**: Link back to main products page

#### Implementation Requirements
```typescript
interface EmptyCartProps {
  onBrowseProducts: () => void;
}
```

#### Empty State Design
- Centered layout with clear messaging
- Prominent call-to-action button
- Simple and clean visual design
- Encouraging tone for user engagement

### 5. Checkout Summary Page (`/src/app/checkout/page.tsx`)

#### Checkout Features
- **Order Summary**: Display cart items and totals
- **No Payment Processing**: Summary only, no actual checkout
- **Order Review**: Final review before hypothetical order
- **Navigation**: Back to cart for modifications

#### Implementation Requirements
```typescript
export default function CheckoutPage() {
  // CartContext integration
  // Order summary display
  // No payment processing
  // Navigation handling
}
```

#### Checkout Layout
- Order summary section
- Item details with quantities and prices
- Total calculation display
- Back to cart navigation
- Future payment section placeholder

## Implementation Guidelines

### Cart State Management
- **Hybrid State**: Store product IDs with quantities, fetch product data when needed
- **Real-time Updates**: Immediate UI updates after cart operations
- **Error Handling**: Handle API failures with user feedback
- **Loading States**: Show loading during add/remove operations

### Cart Operations Flow
```typescript
// Remove from cart example
const handleRemoveItem = async (productId: number) => {
  try {
    setIsRemoving(true);
    await removeFromCart(productId);
    toast.success('Item removed from cart');
  } catch (error) {
    toast.error('Failed to remove item');
  } finally {
    setIsRemoving(false);
  }
};
```

### Total Calculations
- **Subtotal**: Sum of (price × quantity) for all items
- **Item Count**: Total number of individual items
- **Currency Formatting**: Consistent price display throughout
- **Real-time Updates**: Recalculate when items change

### Responsive Design Strategy
- **Mobile Layout**: Stacked cart items, bottom summary
- **Desktop Layout**: Side-by-side cart items and summary
- **Touch Interactions**: Large touch targets for mobile
- **Scrolling**: Proper scroll behavior for long cart lists

## Page Layout Structures

### Desktop Cart Layout
```
┌─────────────────────────────────────┐
│ Header with Navigation              │
├─────────────────────────────────────┤
│ Cart Page Title                     │
├─────────────────┬───────────────────┤
│                 │                   │
│ Cart Items      │ Cart Summary      │
│ - Item 1        │ - Subtotal        │
│ - Item 2        │ - Total Items     │
│ - Item 3        │ - Total Price     │
│                 │ - Checkout Button │
└─────────────────┴───────────────────┘
```

### Mobile Cart Layout
```
┌─────────────────────────────────────┐
│ Header with Navigation              │
├─────────────────────────────────────┤
│ Cart Page Title                     │
├─────────────────────────────────────┤
│ Cart Items (Stacked)                │
│ - Item 1                            │
│ - Item 2                            │
│ - Item 3                            │
├─────────────────────────────────────┤
│ Cart Summary                        │
│ - Subtotal, Total, Checkout         │
└─────────────────────────────────────┘
```

## Acceptance Criteria
- [ ] Cart page displays all cart items correctly
- [ ] Remove item functionality works with proper loading states
- [ ] Cart summary calculates totals accurately
- [ ] Empty cart state displays with navigation to products
- [ ] Checkout summary page shows order review
- [ ] Page is responsive across all screen sizes
- [ ] Cart count updates in header after changes
- [ ] Loading states show during cart operations
- [ ] Error handling works with toast notifications
- [ ] Navigation between cart and other pages works

## Code Quality Checklist
- [ ] Each component file under 300 lines
- [ ] All imports at top of files
- [ ] Proper TypeScript interfaces for all props
- [ ] Descriptive component and variable names
- [ ] No unused imports or variables
- [ ] Consistent naming conventions
- [ ] Error handling follows established patterns

## File Structure After Completion
```
/src
  /app
    /cart
      page.tsx            # Main cart page
    /checkout
      page.tsx            # Checkout summary page
  /components
    /features
      CartItem.tsx        # Individual cart item component
      CartSummary.tsx     # Cart totals and summary
      EmptyCart.tsx       # Empty cart state component
```

## Integration Points
This functionality will integrate with:
- CartContext for cart state management
- Product details for item information
- Layout components for page structure
- UI components for buttons and loading states
- Navigation for page transitions

### Cart Context Integration
```typescript
const {
  cartItems,
  cartTotal,
  cartCount,
  removeFromCart,
  isLoading
} = useCartContext();
```

## Testing Strategy
- Test cart item display with different product types
- Verify remove functionality with success and error scenarios
- Test cart total calculations with various item combinations
- Validate empty cart state display and navigation
- Test responsive behavior across screen sizes
- Verify loading states during cart operations

## Performance Considerations
- **Image Optimization**: Optimized thumbnails for cart items
- **State Updates**: Efficient re-rendering on cart changes
- **Memory Management**: Proper cleanup of component state
- **API Calls**: Minimize unnecessary data fetching

## Next Steps
After completion, this task enables:
- Task 010: User Profile Implementation
- Complete e-commerce shopping flow
- Enhanced user experience

## Accessibility Requirements
- Keyboard navigation for cart operations
- Screen reader support for cart totals
- Accessible remove buttons with proper labels
- Focus management during cart updates
- Clear announcements for cart changes

## Error Scenarios
- **API Failures**: Toast notifications for remove failures
- **Network Issues**: Graceful handling of connectivity problems
- **Invalid Data**: Handle missing product information
- **State Corruption**: Recovery mechanisms for cart state issues 