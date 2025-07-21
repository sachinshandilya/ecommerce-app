import { Layout, PageLayout } from '@/components/layout';
import { SkeletonCard, LoadingText } from '@/components/ui';

export default function HomePage() {
  return (
    <Layout>
      <PageLayout
        title="Welcome to E-Commerce"
        description="Discover amazing products at great prices"
      >
        {/* Temporary content - will be replaced with actual product listing in Task 007 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={index} showDescription />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <LoadingText 
            text="Products will be loaded here..." 
            showSpinner={false}
            size="lg"
          />
          <p className="text-gray-500 mt-4">
            This page will show the product listing once Task 007 is implemented.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
}
