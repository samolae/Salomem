import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './components/theme-provider';
import { ActiveSectionProvider } from './components/active-section-context';
import { router } from './routes';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ActiveSectionProvider>
          {/* reducedMotion="user": motion skips transform and layout animations
              for visitors who ask their system for less motion */}
          <MotionConfig reducedMotion="user">
            <Suspense fallback={null}>
              <RouterProvider router={router} />
            </Suspense>
          </MotionConfig>
        </ActiveSectionProvider>
      </ThemeProvider>
      <SpeedInsights />
    </HelmetProvider>
  );
}

export default App;
