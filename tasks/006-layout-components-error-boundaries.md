# Task 006: Layout Components and Error Boundaries

## Overview
Create application layout components (Header, Footer) and implement error boundaries to prevent crashes, with user profile icon integration and navigation structure.

## Priority: Medium
**Estimated Time**: 4 hours  
**Dependencies**: Task 005 (Core UI Components Development)  
**Completion Criteria**: Complete layout structure with error handling and responsive navigation

## Implementation Details

### 1. Header Component (`/src/components/layout/Header.tsx`)

#### Header Features
- **Navigation Menu**: Links to main pages (Products, Cart, Profile)
- **Search Integration**: Global product search functionality
- **Cart Icon**: Cart count badge and navigation link
- **User Profile Icon**: Conditional display based on userId parameter
- **Responsive Design**: Mobile-friendly navigation with hamburger menu

#### Implementation Requirements
```typescript
interface HeaderProps {
  // No props needed - uses context data
}
```

#### Header Elements
- **Logo/Brand**: Application name or logo
- **Search Bar**: Integration with ProductsContext search
- **Navigation Links**: Products, Cart, Profile (conditional)
- **Cart Badge**: Real-time cart item count from CartContext
- **User Icon**: Show only when valid userId in URL

#### Context Integration
- `useCartContext()` for cart count display
- `useUserContext()` for user profile icon visibility
- `useProductsContext()` for search functionality

### 2. Footer Component (`/src/components/layout/Footer.tsx`)

#### Footer Features
- **Simple Design**: Minimal footer with essential links
- **Responsive Layout**: Stacked on mobile, horizontal on desktop
- **Copyright Information**: Basic application information
- **Navigation Links**: Secondary navigation if needed

#### Implementation Requirements
```typescript
interface FooterProps {
  // Minimal or no props needed
}
```

#### Footer Content
- Application name/copyright
- Basic navigation links
- Responsive layout using Tailwind Grid/Flexbox

### 3. Error Boundary Component (`/src/components/layout/ErrorBoundary.tsx`)

#### Error Boundary Features
- **Catch JavaScript Errors**: Prevent application crashes
- **Fallback UI**: User-friendly error display
- **Error Reporting**: Log errors for debugging
- **Recovery Options**: Refresh page or return to home

#### Implementation Requirements
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

#### Error Handling Strategy
- Catch component rendering errors
- Display user-friendly error message
- Provide recovery actions (refresh, navigate home)
- Log error details for debugging
- Maintain application state when possible

### 4. Layout Wrapper Component (`/src/components/layout/Layout.tsx`)

#### Layout Features
- **Page Structure**: Header, main content, footer arrangement
- **Error Boundary Integration**: Wrap content with error handling
- **Responsive Container**: Proper content width and spacing
- **Toast Notifications**: Global toast notification container

#### Implementation Requirements
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

#### Layout Structure
```typescript
// Layout hierarchy example
<ErrorBoundary>
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container mx-auto px-4">
      {children}
    </main>
    <Footer />
  </div>
  <Toaster /> {/* react-hot-toast */}
</ErrorBoundary>
```

### 5. Navigation Utils (`/src/components/layout/Navigation.tsx`)

#### Navigation Features
- **Mobile Menu**: Collapsible navigation for small screens
- **Active States**: Highlight current page in navigation
- **Accessibility**: Keyboard navigation and ARIA labels
- **Smooth Transitions**: Animated menu open/close

#### Implementation Requirements
- Mobile hamburger menu component
- Desktop navigation bar
- Active link highlighting based on current route
- Proper accessibility attributes

## Implementation Guidelines

### Header Design Requirements
- **Search Bar**: Prominent placement for product search
- **Cart Icon**: Always visible with item count badge
- **User Profile**: Show only when `?userId=X` in URL
- **Responsive**: Stack elements appropriately on mobile
- **Brand Identity**: Consistent with application theme

### Error Boundary Strategy
- **Granular Boundaries**: Place at layout and feature levels
- **Graceful Degradation**: Maintain partial functionality when possible
- **User Communication**: Clear error messages and recovery options
- **Development Aids**: Detailed error logging in development mode

### Responsive Design
- **Mobile-First**: Start with mobile layout, enhance for desktop
- **Breakpoints**: Use Tailwind responsive prefixes appropriately
- **Touch Targets**: Ensure buttons are touch-friendly on mobile
- **Content Flow**: Maintain readability across screen sizes

### Accessibility Implementation
- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Labels**: Screen reader support for navigation
- **Keyboard Navigation**: Tab order and focus management
- **Color Contrast**: Meet WCAG 2.1 AA requirements

## Context Integration Points

### Cart Context Integration
```typescript
const { cartCount } = useCartContext();
// Display cart count badge in header
```

### User Context Integration
```typescript
const { userId, user } = useUserContext();
// Show profile icon only when userId exists
```

### Products Context Integration
```typescript
const { setFilters } = useProductsContext();
// Handle global search functionality
```

## Acceptance Criteria
- [ ] Header displays correctly with all elements
- [ ] Cart count updates in real-time
- [ ] User profile icon shows only with valid userId
- [ ] Search functionality integrates with ProductsContext
- [ ] Footer renders appropriately
- [ ] Error boundary catches and displays errors gracefully
- [ ] Layout is responsive across all screen sizes
- [ ] Navigation accessibility features work properly
- [ ] Toast notifications display correctly

## Code Quality Checklist
- [ ] Each component file under 300 lines
- [ ] All imports at top of files
- [ ] Proper TypeScript interfaces
- [ ] Descriptive component and prop names
- [ ] No unused imports or variables
- [ ] Consistent naming conventions
- [ ] Accessibility attributes included

## File Structure After Completion
```
/src
  /components
    /layout
      Header.tsx          # Main navigation header
      Footer.tsx          # Application footer  
      ErrorBoundary.tsx   # Error catching component
      Layout.tsx          # Main layout wrapper
      Navigation.tsx      # Mobile/desktop navigation
      index.ts           # Export all layout components
```

## Error Handling Strategy
- **Component Errors**: Error boundaries at layout level
- **API Errors**: Handled in contexts with toast notifications
- **Navigation Errors**: Graceful fallbacks for broken routes
- **State Errors**: Reset functionality for corrupted state

## Testing Strategy
- Test error boundary with intentionally broken components
- Verify responsive behavior across screen sizes
- Test navigation accessibility with keyboard only
- Validate cart count updates in header
- Confirm user profile icon visibility logic

## Integration Points
These layout components will be used by:
- All application pages (Layout wrapper)
- Navigation between different sections
- Global search functionality
- Cart and user state display
- Error handling across the application

## Next Steps
After completion, this task enables:
- Task 007: Product Listing and Search/Filter Features
- Task 008: Product Details Page Implementation
- Task 009: Shopping Cart Functionality
- Task 010: User Profile Implementation

## Mobile Considerations
- Touch-friendly navigation elements
- Collapsible mobile menu
- Readable text sizes on small screens
- Appropriate spacing for touch targets
- Fast tap response times 