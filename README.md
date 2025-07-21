# ShopHub - E-commerce Frontend Application

A modern, responsive e-commerce frontend application built with Next.js, React, TypeScript, and Tailwind CSS. This application provides a complete shopping experience with product browsing, cart management, and user profiles.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse and search products with filtering and pagination
- **Product Details**: Detailed product pages with images, descriptions, and ratings
- **Shopping Cart**: Add, remove, and manage items in your cart
- **User Profiles**: View user information and profile details
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

### Technical Features
- **Server-Side Rendering**: Next.js for optimal performance and SEO
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context API with optimized providers
- **Performance**: Optimized images, code splitting, and caching
- **Testing**: Comprehensive unit and integration tests (328 tests)
- **Error Handling**: Production-ready error boundaries and recovery

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### State Management & Data
- **React Context API**: Global state management
- **React Query**: Server state management and caching
- **Fake Store API**: Mock e-commerce data source

### Testing & Quality
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking

### Development Tools
- **SWC**: Fast TypeScript/JavaScript compiler
- **PostCSS**: CSS processing and optimization
- **Git**: Version control with structured commits

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 18.18.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
ecommerce-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── cart/           # Shopping cart page
│   │   ├── checkout/       # Checkout process
│   │   ├── products/       # Product pages
│   │   └── profile/        # User profile page
│   ├── components/         # Reusable React components
│   │   ├── features/       # Feature-specific components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Base UI components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library configurations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── test-utils/         # Testing utilities
├── public/                 # Static assets
├── documents/              # Project documentation
├── tasks/                  # Development task documentation
└── coverage/               # Test coverage reports
```

## 🎯 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

## 🧪 Testing

The application includes comprehensive testing with 328 passing tests covering:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Feature integration and user flow testing
- **Accessibility Tests**: ARIA compliance and keyboard navigation
- **Performance Tests**: Loading and rendering optimization

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test ProductCard.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### Test Coverage
Current test coverage includes:
- Components: 85%+ coverage on tested components
- Utilities: 70%+ coverage
- Hooks: 60%+ coverage
- Overall: Comprehensive coverage of critical paths

## 🎨 Design System

### Components Architecture
- **Base Components** (`ui/`): Reusable, unstyled components
- **Feature Components** (`features/`): Business logic components
- **Layout Components** (`layout/`): Page structure components

### Styling Approach
- **Utility-First**: Tailwind CSS for rapid development
- **Component-Scoped**: No global CSS conflicts
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliant styling

## 🌐 API Integration

### Fake Store API
The application integrates with the Fake Store API for demonstration:
- **Products**: GET /products, GET /products/{id}
- **Categories**: GET /products/categories
- **Users**: GET /users/{id}

### API Layer
- **Centralized**: All API calls in `src/utils/api.ts`
- **Error Handling**: Comprehensive error handling and retries
- **Type Safety**: Full TypeScript interfaces for API responses
- **Caching**: React Query for intelligent caching

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Meets contrast requirements
- **Focus Management**: Visible focus indicators

### Accessibility Features
- Semantic HTML structure
- Alt text for all images
- ARIA labels for interactive elements
- Skip links for navigation
- Error announcements
- Loading state announcements

## 🚀 Performance Optimization

### Core Optimizations
- **Next.js Image**: Optimized image loading and sizing
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Optimized bundle size
- **React Optimization**: Memoization where beneficial

### Performance Features
- Lazy loading for images and components
- Efficient state management
- Minimal re-renders with React.memo
- Optimized API calls with caching

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://fakestoreapi.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=ShopHub
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Tailwind Configuration
Custom Tailwind configuration in `tailwind.config.js`:
- Custom color palette
- Extended spacing scale
- Custom font family
- Responsive breakpoints

## 📱 Browser Support

### Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Mobile Support
- **iOS Safari**: iOS 14+
- **Chrome Mobile**: Latest 2 versions
- **Samsung Internet**: Latest version

## 🐛 Error Handling

### Error Boundaries
- Global error boundary for unhandled errors
- Feature-specific error boundaries
- Recovery mechanisms and user feedback
- Error logging for production monitoring

### Error Types
- **Network Errors**: API connectivity issues
- **Validation Errors**: Form and input validation
- **Application Errors**: Component and logic errors
- **User Errors**: 404, unauthorized access

## 🔮 Future Enhancements

### Planned Features
- User authentication and accounts
- Payment processing integration
- Order history and tracking
- Advanced search and filtering
- Wishlist functionality
- Product reviews and ratings

### Technical Improvements
- PWA (Progressive Web App) capabilities
- Real-time features with WebSockets
- Advanced caching strategies
- Internationalization (i18n)
- Advanced analytics integration

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain test coverage above 80%
3. Follow accessibility guidelines
4. Use semantic commit messages
5. Update documentation for new features

### Code Standards
- **File Limits**: Maximum 300 lines per file
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Organized with absolute imports
- **Types**: Comprehensive TypeScript typing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Documentation**: Check the `/documents` folder
- **Issues**: Create GitHub issues for bugs
- **Development**: See task documentation in `/tasks`

## 🙏 Acknowledgments

- **Fake Store API**: For providing mock e-commerce data
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **React Team**: For the powerful UI library

---

**Built with ❤️ for modern e-commerce experiences**
