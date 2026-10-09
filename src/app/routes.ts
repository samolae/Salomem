import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ScrollToTopLayout } from './components/scroll-to-top';
import { GlobalLayout } from './components/global-layout';
import { HomePage } from './components/home-page';
import { caseRoutes } from './case-routes';

// HomePage serves /, /work/*, /services and /contact, so it ships in the
// main bundle: no second request before the first paint, and nothing to
// suspend on while a prerendered page hydrates.
const PixelManager = lazy(() =>
  import('./components/pixel-manager').then((m) => ({ default: m.PixelManager }))
);
const NotFound = lazy(() =>
  import('./components/not-found').then((m) => ({ default: m.NotFound }))
);

/**
 * Route table shared by the browser router (main.tsx) and the build-time
 * prerender (entry-server.tsx), so both render exactly the same tree.
 */
export const routes: RouteObject[] = [
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
];

/** Every page that gets static HTML at build time (scripts/prerender.mjs) */
export const PRERENDER_PATHS = [
  '/',
  '/work/ux-ui',
  '/work/social-media-ads',
  '/work/social-media-motion',
  '/services',
  '/contact',
  '/projects/aurum',
  '/projects/schenker',
  '/projects/unispace',
];
