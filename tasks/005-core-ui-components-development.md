# Task 005: Core UI Components Development

## Overview
Create reusable UI components using Tailwind CSS inline classes, including buttons, inputs, loading states, and modal components.

## Priority: Medium
**Estimated Time**: 5 hours  
**Dependencies**: Task 001 (Project Setup)  
**Completion Criteria**: Complete set of reusable UI components ready for feature implementation

## Implementation Details

### 1. Button Component (`/src/components/ui/Button.tsx`)

#### Button Features
- **Multiple Variants**: Primary, secondary, danger, outline styles
- **Loading States**: Built-in spinner for async operations
- **Disabled States**: Visual feedback for disabled state
- **Size Variants**: Small, medium, large sizes
- **Icon Support**: Optional icon placement

#### Implementation Requirements
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

#### Styling Requirements
- Use only Tailwind CSS inline classes
- Desktop-first responsive design
- Proper hover and focus states
- Accessibility support (ARIA labels, keyboard navigation)
- Loading spinner integration

### 2. Input Component (`/src/components/ui/Input.tsx`)

#### Input Features
- **Search Input**: Optimized for product search
- **Validation States**: Error and success visual feedback
- **Placeholder Support**: Clear placeholder text
- **Icon Integration**: Search icon, clear button
- **Debounced Input**: Integration ready for search debouncing

#### Implementation Requirements
```typescript
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search' | 'email' | 'number';
  error?: string;
  disabled?: boolean;
  className?: string;
}
```

#### Styling Requirements
- Consistent with application design
- Clear visual hierarchy
- Error state styling
- Mobile-responsive input sizing

### 3. Loading Components (`/src/components/ui/Loading.tsx`)

#### Loading State Variants
- **Skeleton Loaders**: For content areas (product cards, user profile)
- **Spinner**: For button loading states
- **Loading Text**: Simple text indicators
- **Full Page Loader**: For initial app loading

#### Implementation Requirements
```typescript
// Multiple loading components in one file
export const Spinner = ({ size?: 'sm' | 'md' | 'lg' }) => { /* ... */ };
export const SkeletonCard = () => { /* ... */ };
export const SkeletonText = ({ lines?: number }) => { /* ... */ };
export const LoadingText = ({ text?: string }) => { /* ... */ };
```

#### UX Best Practices
- Appropriate loading states for different scenarios
- Smooth animations using Tailwind CSS
- Consistent loading feedback across application
- Accessibility considerations for screen readers

### 4. Modal Component (`/src/components/ui/Modal.tsx`)

#### Modal Features
- **Overlay Background**: Semi-transparent backdrop
- **Close Functionality**: Click outside to close, ESC key support
- **Responsive Design**: Mobile-friendly modal sizing
- **Accessibility**: Focus management, ARIA attributes

#### Implementation Requirements
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

#### Accessibility Features
- Focus trap within modal
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### 5. Card Component (`/src/components/ui/Card.tsx`)

#### Card Features
- **Flexible Layout**: Support for different content types
- **Hover States**: Interactive feedback for clickable cards
- **Image Support**: Optimized for product images
- **Content Areas**: Header, body, footer sections

#### Implementation Requirements
```typescript
interface CardProps {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  hover?: boolean;
}
```

### 6. Badge Component (`/src/components/ui/Badge.tsx`)

#### Badge Features
- **Status Indicators**: Different colors for various states
- **Count Badges**: For cart item count
- **Category Tags**: For product categories
- **Size Variants**: Small and medium sizes

#### Implementation Requirements
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}
```

## Design System Guidelines

### Color Palette
- Use Tailwind's default color palette
- Consistent color usage across components
- Accessibility-compliant color contrast ratios
- Clear semantic color meanings

### Typography
- Consistent font sizing using Tailwind classes
- Proper heading hierarchy
- Readable line heights
- Responsive text sizing

### Spacing and Layout
- Consistent padding and margin using Tailwind spacing scale
- Proper visual hierarchy
- Grid and flexbox layouts
- Responsive spacing adjustments

### Interactive States
- Hover effects for interactive elements
- Focus states for keyboard navigation
- Active states for button presses
- Disabled states with appropriate styling

## Implementation Guidelines

### Component Structure
- Keep each component under 300 lines
- Use TypeScript interfaces for all props
- Include proper default props
- Implement proper error handling

### Styling Approach
- Use only Tailwind CSS inline classes
- No custom CSS classes or external stylesheets
- Mobile-first responsive breakpoints when needed
- Consistent component styling patterns

### Accessibility Requirements
- ARIA labels and roles where appropriate
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

## Acceptance Criteria
- [ ] All UI components render correctly
- [ ] Components follow Tailwind-only styling rule
- [ ] Loading states work as expected
- [ ] Button states (loading, disabled) function properly
- [ ] Modal accessibility features work
- [ ] Input components handle validation states
- [ ] Components are responsive across devices
- [ ] TypeScript interfaces are properly defined
- [ ] No styling issues across major browsers

## Code Quality Checklist
- [ ] Each component file under 300 lines
- [ ] All imports at top of files
- [ ] Descriptive prop names and interfaces
- [ ] Consistent naming conventions (PascalCase for components)
- [ ] No unused props or imports
- [ ] Proper TypeScript typing
- [ ] JSDoc comments for complex components

## File Structure After Completion
```
/src
  /components
    /ui
      Button.tsx          # Reusable button component
      Input.tsx           # Input and search components
      Loading.tsx         # Loading states and skeletons
      Modal.tsx           # Modal dialog component
      Card.tsx            # Generic card component
      Badge.tsx           # Badge and tag components
      index.ts            # Export all UI components
```

## Component Usage Examples
These components will be used by:
- Product cards (Card, Badge, Button)
- Search functionality (Input)
- Cart operations (Button with loading states)
- Data loading (Loading components)
- User notifications (Modal)

## Testing Strategy
- Test component rendering with different props
- Verify responsive behavior across screen sizes
- Test accessibility features (keyboard navigation, ARIA)
- Validate loading states and interactions
- Confirm proper TypeScript prop validation

## Next Steps
After completion, this task enables:
- Task 006: Layout Components and Error Boundaries
- Task 007: Product Listing and Search/Filter Features
- Task 008: Product Details Page Implementation
- Task 009: Shopping Cart Functionality

## Browser Compatibility
- Test components in Chrome, Firefox, Safari, Edge
- Ensure Tailwind CSS classes work consistently
- Verify responsive behavior across devices
- Validate accessibility features in different browsers 