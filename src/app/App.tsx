import { Suspense, useEffect, type ReactNode } from 'react';
import { LazyMotion, MotionConfig, type FeatureBundle } from 'motion/react';
import { RouterProvider, type createBrowserRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './components/theme-provider';
import { ActiveSectionProvider } from './components/active-section-context';
import { endHydration } from './hydration';

/*
 * motion's features (animations, gestures, drag, layout) ship as their own
 * script (./motion-features.ts) and every component uses the light `m`
 * component. Both entries hand the features over before the first render
 * (main.tsx awaits them next to the page's route chunk, and every page
 * modulepreloads them), so everything animates exactly as before; only the
 * main script has less to evaluate in its first task.
 */
let motionFeatures = {} as FeatureBundle;
export function setMotionFeatures(features: FeatureBundle) {
  motionFeatures = features;
}

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
            <LazyMotion features={motionFeatures}>
              <Suspense fallback={null}>{children}</Suspense>
            </LazyMotion>
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
