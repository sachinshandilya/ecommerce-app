import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Optimized font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Application metadata
export const metadata: Metadata = {
  title: "ShopHub - Online Shopping Store",
  description: "Discover quality products at competitive prices. Shop electronics, clothing, and more with fast shipping and excellent customer service.",
  keywords: "online shopping, electronics, clothing, home goods, quality products, fast shipping",
  authors: [{ name: "ShopHub Team" }],
  
  // Open Graph metadata for social sharing
  openGraph: {
    title: "ShopHub - Online Shopping Store",
    description: "Your trusted marketplace for quality products",
    type: 'website',
    locale: 'en_US',
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: "ShopHub - Online Shopping Store",
    description: "Your trusted marketplace for quality products",
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
  },
  
  // Viewport configuration
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
