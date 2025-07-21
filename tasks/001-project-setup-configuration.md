# Task 001: Project Setup and Configuration

## Overview
Initialize a Next.js 14 project with App Router, TypeScript, Tailwind CSS, and all required dependencies for the e-commerce frontend application.

## Priority: High
**Estimated Time**: 4 hours  
**Dependencies**: None  
**Completion Criteria**: Working Next.js application with all dependencies installed and configured

## Implementation Details

### 1. Project Initialization
- Create Next.js 14 project with TypeScript using `npx create-next-app@latest`
- Project name: `ecommerce-app`
- Enable TypeScript, ESLint, Tailwind CSS, App Router
- Use `src/` directory structure
- Disable experimental features for stability

### 2. Dependencies Installation

#### Core Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0", 
  "react-dom": "^18.0.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hot-toast": "^2.0.0"
}
```

#### Development Dependencies
```json
{
  "typescript": "^5.0.0",
  "@types/react": "^18.0.0",
  "@types/node": "^20.0.0",
  "tailwindcss": "^3.0.0",
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jest-environment-jsdom": "^29.0.0"
}
```

### 3. Folder Structure Setup
Create the following directory structure under `/src`:

```
/src
  /app                    # Next.js App Router
    layout.tsx
    page.tsx
    /products
      /[id]
        page.tsx
    /cart
      page.tsx
    /profile  
      page.tsx
    /checkout
      page.tsx
  /components
    /ui                   # Reusable UI components
    /layout              # Layout components  
    /features            # Feature-specific components
  /hooks                 # Custom React hooks
  /context              # React Context providers
  /types                # TypeScript type definitions
  /utils                # Utility functions
  /lib                  # Configuration files
```

### 4. TypeScript Configuration
- Configure `tsconfig.json` with lenient settings (not strict mode)
- Enable absolute imports with `@/` path mapping
- Set target to ES2017 for broad browser compatibility
- Enable incremental compilation for faster builds

### 5. Tailwind CSS Configuration
- Configure `tailwind.config.js` to scan all source files
- Enable default responsive breakpoints
- No custom colors or components (use default Tailwind)
- Ensure compatibility with Next.js App Router

### 6. ESLint Configuration
- Use default Next.js ESLint configuration
- No additional custom rules
- Ensure compatibility with TypeScript

### 7. Jest Configuration
- Set up Jest with React Testing Library
- Configure `jest.config.js` for Next.js compatibility
- Set up `jsdom` environment for component testing
- Configure module path mapping to match TypeScript paths

### 8. Environment Variables Setup
- Create `.env.local` for development environment
- Add FakeStore API base URL: `NEXT_PUBLIC_API_BASE_URL=https://fakestoreapi.com`
- Ensure environment variables are properly typed

### 9. Package Scripts Configuration
Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### 10. Git Configuration
- Initialize git repository
- Create `.gitignore` with Next.js defaults
- Add initial commit with project setup

## Acceptance Criteria
- [ ] Next.js 14 application runs successfully with `npm run dev`
- [ ] TypeScript compilation works without errors
- [ ] Tailwind CSS classes are applied correctly
- [ ] All dependencies are installed and compatible
- [ ] Folder structure matches specification
- [ ] Jest test runner is functional
- [ ] ESLint passes without errors
- [ ] Environment variables are accessible in components

## Code Quality Checklist
- [ ] TypeScript configuration follows lenient settings
- [ ] Tailwind config allows inline classes only
- [ ] No deprecated packages in dependencies
- [ ] All import statements will be at file tops
- [ ] Project structure supports max 300 lines per file rule

## Testing Requirements
- Verify Next.js development server starts successfully
- Test that TypeScript compilation works
- Confirm Tailwind classes render properly
- Validate environment variables are accessible

## Next Steps
After completion, this task enables:
- Task 002: TypeScript Interfaces and API Configuration
- Task 005: Core UI Components Development

## Troubleshooting Notes
- If TypeScript errors occur, ensure all type definitions are installed
- For Tailwind CSS issues, verify config file paths are correct
- Jest configuration may need adjustment for Next.js App Router compatibility
- Ensure Node.js version is compatible with Next.js 14 requirements 