import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/home-page';
import { AurumCaseStudy } from './components/aurum-case-study';
import { SchenkerCaseStudy } from './components/schenker-case-study';
import { PixelManager } from './components/pixel-manager';
import { ScrollToTopLayout } from './components/scroll-to-top';
import { GlobalLayout } from './components/global-layout';
import { NotFound } from './components/not-found';

export const router = createBrowserRouter([
  {
    Component: ScrollToTopLayout,
    children: [
      {
        /* GlobalLayout wraps ALL pages with shared ambient assets */
        Component: GlobalLayout,
        children: [
          {
            path: '/',
            Component: HomePage,
          },
          {
            path: '/work/:category',
            Component: HomePage,
          },
          {
            path: '/contact',
            Component: HomePage,
          },
          {
            path: '/services',
            Component: HomePage,
          },
          {
            path: '/projects/aurum',
            Component: AurumCaseStudy,
          },
          {
            path: '/projects/schenker',
            Component: SchenkerCaseStudy,
          },
          {
            path: '/tools/pixel',
            Component: PixelManager,
          },
          {
            path: '*',
            Component: NotFound,
          },
        ],
      },
    ],
  },
]);