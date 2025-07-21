import { Layout, PageLayout } from '@/components/layout';
import { SkeletonCard, LoadingText } from '@/components/ui';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Layout>
      <PageLayout
        title="Product Details"
        description={`Details for product ${params.id}`}
      >
        {/* Temporary content - will be replaced with actual product details in Task 008 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SkeletonCard showImage showTitle={false} showPrice={false} />
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <LoadingText 
            text="Product details will be implemented here..." 
            showSpinner={false}
            size="lg"
          />
          <p className="text-gray-500 mt-4">
            This page will show detailed product information once Task 008 is implemented.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
} 