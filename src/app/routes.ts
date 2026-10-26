import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import { ScrollToTopLayout } from './components/scroll-to-top';
import { GlobalLayout } from './components/global-layout';
import { caseRoutes, homeRoute } from './case-routes';

// HomePage (/, /work/*, /services, /contact) is a lazy route like the case
// studies, so a case study no longer downloads the whole home page. Static
// pages modulepreload their route chunk (scripts/prerender.mjs) and main.tsx
// loads it before hydrating, so first paint and hydration are unchanged.
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
          { path: '/',                         lazy: homeRoute },
          { path: '/work',                     lazy: homeRoute },
          { path: '/work/:category',           lazy: homeRoute },
          { path: '/contact',                  lazy: homeRoute },
          { path: '/services',                 lazy: homeRoute },
          { path: '/projects/aurum',           lazy: caseRoutes['/projects/aurum'] },
          { path: '/projects/schenker',        lazy: caseRoutes['/projects/schenker'] },
          { path: '/projects/unispace',        lazy: caseRoutes['/projects/unispace'] },
          { path: '/projects/gv-capital',      lazy: caseRoutes['/projects/gv-capital'] },
          { path: '/projects/fitmeal',         lazy: caseRoutes['/projects/fitmeal'] },
          { path: '/projects/dasturi',         lazy: caseRoutes['/projects/dasturi'] },
          { path: '/projects/scope',           lazy: caseRoutes['/projects/scope'] },
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
  '/work',
  '/work/ux-ui',
  '/work/case-studies',
  '/work/social-media-ads',
  '/work/social-media-motion',
  '/services',
  '/contact',
  '/projects/aurum',
  '/projects/schenker',
  '/projects/unispace',
  '/projects/fitmeal',
  '/projects/gv-capital',
  '/projects/dasturi',
  '/projects/scope',
];
