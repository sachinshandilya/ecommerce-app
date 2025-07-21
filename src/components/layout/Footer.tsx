import React from 'react';
import Link from 'next/link';

/**
 * Application footer with navigation and company information
 * Responsive design that stacks on mobile and spreads on desktop
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { href: '/', label: 'All Products' },
        { href: '/cart', label: 'Shopping Cart' },
        { href: '/?category=electronics', label: 'Electronics' },
        { href: '/?category=clothing', label: 'Clothing' },
      ],
    },
    {
      title: 'Account',
      links: [
        { href: '/profile', label: 'My Profile' },
        { href: '/profile?userId=1', label: 'User Profiles' },
        { href: '/cart', label: 'Order History' },
        { href: '/cart', label: 'Wishlist' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '/help', label: 'Help Center' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/shipping', label: 'Shipping Info' },
        { href: '/returns', label: 'Returns & Exchanges' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold">ShopHub</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted online marketplace for quality products at competitive prices. 
              Discover thousands of items with fast shipping and excellent customer service.
            </p>
            <p className="text-gray-400 text-xs">
              Quality products, delivered worldwide
            </p>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} ShopHub. All rights reserved.
            </p>
            
            {/* Legal Links */}
            <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-gray-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Minimal footer for simpler layouts
 */
export function MinimalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} ShopHub</p>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Products
            </Link>
            <Link href="/cart" className="hover:text-gray-700 transition-colors">
              Cart
            </Link>
            <Link href="/profile" className="hover:text-gray-700 transition-colors">
              Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 