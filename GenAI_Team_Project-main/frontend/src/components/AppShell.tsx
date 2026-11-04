'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import EvidenceDrawer from '@/components/EvidenceDrawer';
import { Loader2 } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth, currentRole } = useApp();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isAuthenticated && !isLoginPage) {
        router.replace('/login');
      } else if (isAuthenticated && isLoginPage) {
        router.replace(currentRole === 'admin' ? '/admin' : '/');
      } else if (isAuthenticated && currentRole === 'student' && pathname.startsWith('/admin')) {
        // Enforce role guard: student cannot view admin console
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoadingAuth, isLoginPage, currentRole, pathname, router]);

  // If on login page, render standalone page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If loading auth state, show clean institutional loading screen
  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs font-medium text-charcoal-muted">
            Verifying University Session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, keep waiting for redirect
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated application layout
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <EvidenceDrawer />
    </div>
  );
}
