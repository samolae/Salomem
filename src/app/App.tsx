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
          <RouterProvider router={router} />
        </ActiveSectionProvider>
      </ThemeProvider>
      <SpeedInsights />
    </HelmetProvider>
  );
}

export default App;