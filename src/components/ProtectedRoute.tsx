'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'chemist' | 'drugist';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Add a small delay to ensure the redirect happens properly
        const timer = setTimeout(() => {
          router.push('/');
        }, 100);
        return () => clearTimeout(timer);
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect to dashboard if user doesn't have required role
        const timer = setTimeout(() => {
          router.push('/dashboard');
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
} 