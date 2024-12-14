import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { RewritesPage } from '@/pages/dashboard/RewritesPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { Toaster } from '@/components/ui/toaster';
import { useSession } from '@/lib/auth/useSession';
import { useRouting } from '@/lib/routing/useRouting';

function App() {
  const { session } = useSession();
  const { currentPath } = useRouting();

  const renderContent = () => {
    // If not logged in, show auth pages
    if (!session) {
      switch (currentPath) {
        case '/login':
          return (
            <AuthLayout 
              title="Welcome back"
              description="Enter your credentials to access your account"
              showSignUpLink
            >
              <LoginForm />
            </AuthLayout>
          );
        case '/forgot-password':
          return (
            <AuthLayout 
              title="Reset your password"
              description="Enter your email and we'll send you reset instructions"
              showSignInLink
            >
              <ForgotPasswordForm />
            </AuthLayout>
          );
        default:
          return (
            <AuthLayout 
              title="Create your account"
              description="Start your journey with us today"
              showSignInLink
            >
              <SignupForm />
            </AuthLayout>
          );
      }
    }

    // If logged in, show dashboard pages
    switch (currentPath) {
      case '/dashboard/rewrites':
        return <RewritesPage />;
      case '/dashboard/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      {renderContent()}
      <Toaster />
    </>
  );
}

export default App;