import { Layout, PageLayout } from '@/components/layout';
import { SkeletonCartItem, LoadingText } from '@/components/ui';

export default function CartPage() {
  return (
    <Layout>
      <PageLayout
        title="Shopping Cart"
        description="Review your selected items"
      >
        {/* Temporary content - will be replaced with actual cart functionality in Task 009 */}
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCartItem key={index} />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <LoadingText 
            text="Cart functionality will be implemented here..." 
            showSpinner={false}
            size="lg"
          />
          <p className="text-gray-500 mt-4">
            This page will show cart items and checkout once Task 009 is implemented.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
} 