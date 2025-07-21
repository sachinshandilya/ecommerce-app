# Task 010: User Profile Implementation

## Overview
Implement user profile functionality with URL parameter handling, user data display, profile icon integration, and error handling for invalid users.

## Priority: Medium
**Estimated Time**: 4 hours  
**Dependencies**: Task 004 (Context Providers), Task 006 (Layout Components)  
**Completion Criteria**: Functional user profile system with URL parameter integration and proper error handling

## Implementation Details

### 1. User Profile Page (`/src/app/profile/page.tsx`)

#### Profile Page Features
- **URL Parameter Detection**: Check for userId query parameter
- **User Data Display**: Show comprehensive user information
- **Error Handling**: Handle missing or invalid userId
- **Navigation**: Redirect or show error for missing userId

#### Implementation Requirements
```typescript
export default function ProfilePage() {
  // URL parameter extraction
  // UserContext integration
  // Error state handling
  // Loading state management
  // Component rendering
}
```

#### Page Structure
- User information display section
- Error state for invalid/missing userId
- Loading state during user data fetch
- Navigation back to products if needed

### 2. User Profile Component (`/src/components/features/UserProfile.tsx`)

#### Profile Features
- **Personal Information**: Name, email, username display
- **Contact Information**: Phone number display
- **Address Information**: Complete address details
- **Profile Layout**: Organized information sections
- **Responsive Design**: Mobile and desktop optimized

#### Implementation Requirements
```typescript
interface UserProfileProps {
  user: User;
  isLoading?: boolean;
}
```

#### Information Sections
- **Personal Details**: First name, last name, username, email
- **Contact Information**: Phone number with proper formatting
- **Address Details**: Street, city, zipcode with map location (lat/long)
- **Account Information**: User ID and any additional details

### 3. User Profile Icon (`/src/components/features/UserProfileIcon.tsx`)

#### Icon Features
- **Conditional Display**: Show only when valid userId in URL
- **Navigation**: Click to navigate to profile page
- **Visual Indicator**: Clear profile icon in header
- **Responsive Design**: Appropriate sizing for mobile and desktop

#### Implementation Requirements
```typescript
interface UserProfileIconProps {
  userId: number | null;
  user: User | null;
  onClick: () => void;
}
```

#### Icon Integration
- Display in header component
- Integrate with UserContext for visibility
- Handle navigation to profile page
- Show loading state if user data is loading

### 4. User Not Found Component (`/src/components/features/UserNotFound.tsx`)

#### Not Found Features
- **Error Message**: Clear message for invalid userId
- **Navigation Options**: Return to products or try different user
- **User-Friendly Design**: Helpful error state design
- **Call-to-Action**: Guide user to next steps

#### Implementation Requirements
```typescript
interface UserNotFoundProps {
  userId?: number | null;
  onNavigateToProducts: () => void;
}
```

#### Error State Design
- Clear error message about invalid user
- Suggestion to check userId parameter
- Navigation button back to products
- Helpful guidance for users

### 5. URL Parameter Utilities (`/src/utils/urlParams.ts`)

#### Utility Functions
- **UserId Extraction**: Parse userId from URL query parameters
- **Validation**: Ensure userId is numeric and valid
- **URL Manipulation**: Add/remove userId from URLs
- **Navigation Helpers**: Maintain userId across page navigation

#### Implementation Requirements
```typescript
export const extractUserIdFromUrl = (): number | null => {
  // Extract and validate userId from URL
  // Return null for invalid or missing userId
};

export const validateUserId = (id: string | null): number | null => {
  // Client-side validation for userId format
  // Return valid numeric ID or null
};

export const buildUrlWithUserId = (path: string, userId: number): string => {
  // Helper to build URLs with userId parameter
};
```

## Implementation Guidelines

### URL Parameter Integration
- **Parameter Extraction**: Use Next.js router to access query parameters
- **Client-side Validation**: Validate userId is numeric
- **Error Handling**: Handle invalid or missing parameters gracefully
- **Toast Notifications**: Show error messages for invalid users

### User Data Flow
```typescript
// URL parameter integration example
const searchParams = useSearchParams();
const userId = searchParams.get('userId');

// UserContext integration
const { user, isLoading, error } = useUserContext();

// Error handling for invalid users
useEffect(() => {
  if (userId && !user && !isLoading) {
    toast.error('User not found');
    // Handle navigation or error state
  }
}, [userId, user, isLoading]);
```

### Profile Icon Integration
```typescript
// Header component integration
const { userId, user } = useUserContext();

// Show profile icon only when user exists
{userId && user && (
  <UserProfileIcon 
    userId={userId}
    user={user}
    onClick={() => router.push('/profile')}
  />
)}
```

### Responsive Design Strategy
- **Mobile Layout**: Stacked user information sections
- **Desktop Layout**: Side-by-side or card-based layout
- **Typography**: Readable text sizes across devices
- **Spacing**: Appropriate padding and margins

## Page Layout Structure

### Desktop Profile Layout
```
┌─────────────────────────────────────┐
│ Header with Navigation + Profile    │
├─────────────────────────────────────┤
│ Profile Page Title                  │
├─────────────────┬───────────────────┤
│                 │                   │
│ Personal Info   │ Contact Info      │
│ - Name          │ - Phone           │
│ - Email         │ - Address         │
│ - Username      │ - City, Zip       │
│                 │ - Coordinates     │
└─────────────────┴───────────────────┘
```

### Mobile Profile Layout
```
┌─────────────────────────────────────┐
│ Header with Navigation + Profile    │
├─────────────────────────────────────┤
│ Profile Page Title                  │
├─────────────────────────────────────┤
│ Personal Information                │
│ - Name, Email, Username             │
├─────────────────────────────────────┤
│ Contact Information                 │
│ - Phone, Address Details            │
└─────────────────────────────────────┘
```

## Acceptance Criteria
- [ ] Profile page displays user information correctly
- [ ] Profile icon appears in header only with valid userId
- [ ] URL parameter extraction and validation works
- [ ] Error handling for invalid userId shows appropriate messages
- [ ] User not found state displays with navigation options
- [ ] Page is responsive across all screen sizes
- [ ] Loading states show during user data fetching
- [ ] Toast notifications work for error scenarios
- [ ] Navigation between profile and other pages works
- [ ] Client-side validation prevents invalid API calls

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
    /profile
      page.tsx            # User profile page
  /components
    /features
      UserProfile.tsx     # User information display
      UserProfileIcon.tsx # Header profile icon
      UserNotFound.tsx    # Error state component
  /utils
    urlParams.ts          # URL parameter utilities
```

## Integration Points
This functionality will integrate with:
- UserContext for user state management
- Header component for profile icon display
- URL routing for navigation
- Toast notifications for error handling
- Layout components for page structure

### UserContext Integration
```typescript
const {
  userId,
  user,
  isLoading,
  error,
  setUserId
} = useUserContext();
```

## Testing Strategy
- Test profile page with valid and invalid userIds
- Verify profile icon visibility logic
- Test URL parameter extraction and validation
- Validate error handling with invalid users
- Test responsive behavior across screen sizes
- Verify loading states during data fetching

## Error Handling Scenarios
- **Invalid UserId**: Non-numeric or negative values
- **Missing UserId**: No userId parameter in URL
- **User Not Found**: Valid ID but user doesn't exist in API
- **API Failures**: Network issues during user data fetch
- **Malformed User Data**: Handle incomplete user information

## URL Parameter Examples
- Valid: `/?userId=1` → Show profile icon and enable profile page
- Invalid: `/?userId=abc` → Show error toast, hide profile icon
- Missing: `/` → Hide profile icon, redirect from profile page
- Not Found: `/?userId=999` → Show error toast if user doesn't exist

## Next Steps
After completion, this task enables:
- Task 011: Testing Implementation
- Complete user experience with profile functionality
- Enhanced application navigation

## Accessibility Requirements
- Proper heading hierarchy for user information
- Screen reader support for profile icon
- Keyboard accessible navigation elements
- Clear focus management for interactive elements
- Accessible error messages and notifications

## Security Considerations
- Client-side validation only (no sensitive data protection needed)
- Validate userId format to prevent malformed requests
- Handle API errors gracefully without exposing internal details
- No authentication required per project specifications 