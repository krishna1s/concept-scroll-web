/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { isLoginRoute, isPublicRoute, isProfileSetupRoute } from '@/utils/routeUtils';
import { ROUTES } from '@/constants/routes';
import { logger } from '@/utils/loggingUtils';
import ConceptScrollLoader from '@/components/ConceptScrollLoader';

// Timeout in milliseconds for backend connection issues.
// Increased to 15s to survive a Django cold-start after deploy (gunicorn
// takes 5-12s to boot + first request warms up migrations/caches).
const LOADING_TIMEOUT = 15000; // 15 seconds

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isLoading: isProfileLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectingRef = useRef(false);

  // Setup timeout for loading state
  useEffect(() => {
    // Only set a timeout if we're still loading
    if ((isLoading || isProfileLoading) && !redirectingRef.current) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        if (isLoading || isProfileLoading) {
          logger.warn('ProtectedRoute', `Loading timed out after ${LOADING_TIMEOUT}ms, likely backend connection issue`);
          setHasTimedOut(true);
        }
      }, LOADING_TIMEOUT);
    }
    
    // Cleanup timeout on unmount or when loading completes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, isProfileLoading]);

  // Reset redirection status when route changes
  useEffect(() => {
    redirectingRef.current = false;
  }, [pathname]);

  // Core protection logic
  useEffect(() => {
    // Skip all checks if we've timed out
    if (hasTimedOut) return;

    // Skip if still loading or already redirecting
    if (isLoading || isProfileLoading || redirectingRef.current) return;

    // Handle based on route type and auth status
    const isPublic = isPublicRoute(pathname || '');
    
    logger.info('ProtectedRoute', `Route check: ${pathname}`, { 
      isPublic, 
      isAuthenticated 
    });

    // For public routes, no redirects needed
    if (isPublic) return;

    // For protected routes, redirect to login if not authenticated
    if (!isAuthenticated && !isLoginRoute(pathname)) {
      logger.info('ProtectedRoute', `Not authenticated, redirecting to login from ${pathname}`);
      redirectingRef.current = true;
      
      // Save the original URL so we can redirect back after login
      if (pathname && typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname + (window.location.search || ''));
      }
      
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      return;
    }

    // Redirect to profile-setup if authenticated but profile incomplete
    if (isAuthenticated && user && !user.is_profile_complete && !isProfileSetupRoute(pathname) && !isLoginRoute(pathname)) {
      logger.info('ProtectedRoute', `Profile incomplete, redirecting to profile-setup from ${pathname}`);
      redirectingRef.current = true;
      setTimeout(() => {
        router.replace(ROUTES.PROFILE_SETUP);
      }, 100);
      return;
    }

    // Show tutorial for first-time users after profile completion.
    // Primary check: backend feature flag show_welcome (per-user, survives device/cache changes).
    // Fallback: localStorage conceptScrollTutorialComplete (for offline/unauthenticated edge cases).
    if (isAuthenticated && user?.is_profile_complete && pathname === ROUTES.DASHBOARD) {
      const backendFlagSet = user?.feature_flags !== undefined;
      const showWelcomeBackend = backendFlagSet ? (user.feature_flags?.show_welcome !== false) : null;
      const localDone = !!localStorage.getItem('conceptScrollTutorialComplete');

      // If backend says show_welcome=true (or flag not yet set), and localStorage not done: show tutorial
      const shouldShow = showWelcomeBackend === true || (!backendFlagSet && !localDone);

      if (shouldShow && !localDone) {
        redirectingRef.current = true;
        setTimeout(() => {
          if (!localStorage.getItem('conceptScrollTutorialComplete')) {
            router.replace(ROUTES.TUTORIAL);
          } else {
            redirectingRef.current = false;
          }
        }, 100);
        return;
      }
    }
  }, [isAuthenticated, isLoading, isProfileLoading, pathname, router, hasTimedOut, user]);

  // For public routes, render immediately without waiting for auth
  const currentIsPublic = isPublicRoute(pathname || '');
  const currentIsLogin = isLoginRoute(pathname);

  // Show loading state while auth/profile is being determined, unless we've timed out
  // BUT skip loading for public and login routes — they don't need auth
  if ((isLoading || isProfileLoading) && !hasTimedOut && !currentIsPublic && !currentIsLogin) {
    return <ConceptScrollLoader fullScreen showLogo />;
  }
  
  // Show timeout message if we've timed out — but only for protected routes
  if (hasTimedOut && !currentIsPublic && !currentIsLogin) {
    // Only redirect to login if the user has NO tokens at all (genuinely unauthenticated).
    // If tokens exist in localStorage, the user IS logged in — the backend is just slow
    // to respond (e.g. Django cold-starting after a deploy). Redirecting in that case
    // would log them out incorrectly.
    const hasTokens = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
    if (!hasTokens && typeof window !== 'undefined') {
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <div className="text-red-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We&apos;re having trouble connecting to our servers.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {hasTokens ? 'Please wait or refresh the page.' : 'Redirecting you to login...'}
          </p>
          {hasTokens && (
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Always render children - the protection logic above handles redirects
  return <>{children}</>;
}
