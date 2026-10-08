import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { ScrollToTopLayout } from './components/scroll-to-top';
import { GlobalLayout } from './components/global-layout';
import { caseRoutes } from './case-routes';

const HomePage = lazy(() =>
  import('./components/home-page').then((m) => ({ default: m.HomePage }))
);
const PixelManager = lazy(() =>
  import('./components/pixel-manager').then((m) => ({ default: m.PixelManager }))
);
const NotFound = lazy(() =>
  import('./components/not-found').then((m) => ({ default: m.NotFound }))
);

export const router = createBrowserRouter([
  {
    Component: ScrollToTopLayout,
    // Shown only while a lazy case study loads on a direct first visit
    HydrateFallback: () => null,
    children: [
      {
        Component: GlobalLayout,
        children: [
          { path: '/',                         Component: HomePage },
          { path: '/work/:category',           Component: HomePage },
          { path: '/contact',                  Component: HomePage },
          { path: '/services',                 Component: HomePage },
          { path: '/projects/aurum',           lazy: caseRoutes['/projects/aurum'] },
          { path: '/projects/schenker',        lazy: caseRoutes['/projects/schenker'] },
          { path: '/projects/unispace',        lazy: caseRoutes['/projects/unispace'] },
          { path: '/tools/pixel',              Component: PixelManager },
          { path: '*',                         Component: NotFound },
        ],
      },
    ],
  },
]);
