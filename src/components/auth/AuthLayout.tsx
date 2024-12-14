import { ReactNode } from 'react';
import { Boxes } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showSignInLink?: boolean;
  showSignUpLink?: boolean;
}

export function AuthLayout({ 
  children, 
  title, 
  description, 
  showSignInLink = false,
  showSignUpLink = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-[400px] space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-primary/5 p-4">
                <Boxes className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            {children}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {showSignInLink && (
              <>
                Already have an account?{' '}
                <a href="/login" className="font-medium hover:text-primary">
                  Sign in
                </a>
              </>
            )}
            {showSignUpLink && (
              <>
                Don't have an account?{' '}
                <a href="/signup" className="font-medium hover:text-primary">
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/0 z-10" />
        <img
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070"
          alt="Office workspace"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}