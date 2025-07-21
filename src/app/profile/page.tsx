import { Layout, PageLayout } from '@/components/layout';
import { SkeletonProfile, LoadingText } from '@/components/ui';

export default function ProfilePage() {
  return (
    <Layout>
      <PageLayout
        title="User Profile"
        description="Manage your account information"
      >
        {/* Temporary content - will be replaced with actual profile functionality in Task 010 */}
        <div className="max-w-2xl">
          <SkeletonProfile />
        </div>
        
        <div className="mt-8 text-center">
          <LoadingText 
            text="Profile functionality will be implemented here..." 
            showSpinner={false}
            size="lg"
          />
          <p className="text-gray-500 mt-4">
            This page will show user profile information once Task 010 is implemented.
          </p>
        </div>
      </PageLayout>
    </Layout>
  );
} 