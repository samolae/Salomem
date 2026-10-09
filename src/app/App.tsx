import { Suspense, useEffect, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider, type createBrowserRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './components/theme-provider';
import { ActiveSectionProvider } from './components/active-section-context';
import { endHydration } from './hydration';

/**
 * Providers shared by the browser app and the build-time prerender. The
 * prerendered HTML is hydrated, so both sides must render the same tree.
 */
export function AppTree({
  children,
  helmetContext,
}: {
  children: ReactNode;
  helmetContext?: { helmet?: HelmetServerState };
}) {
  return (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <ActiveSectionProvider>
          {/* reducedMotion="user": motion skips transform and layout animations
              for visitors who ask their system for less motion */}
          <MotionConfig reducedMotion="user">
            <Suspense fallback={null}>{children}</Suspense>
          </MotionConfig>
        </ActiveSectionProvider>
      </ThemeProvider>
      <SpeedInsights />
    </HelmetProvider>
  );
}

function HydrationDone() {
  // Runs once React has adopted the prerendered HTML (or finished the first
  // client render): from here on, mounts are ordinary client mounts.
  useEffect(() => endHydration(), []);
  return null;
}

export default function App({ router }: { router: ReturnType<typeof createBrowserRouter> }) {
  return (
    <AppTree>
      <RouterProvider router={router} />
      <HydrationDone />
    </AppTree>
  );
}
