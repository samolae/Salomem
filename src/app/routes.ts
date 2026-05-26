import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { ScrollToTopLayout } from './components/scroll-to-top';
import { GlobalLayout } from './components/global-layout';

const HomePage = lazy(() =>
    import('./components/home-page').then((m) => ({ default: m.HomePage }))
                      );
const AurumCaseStudy = lazy(() =>
    import('./components/aurum-case-study').then((m) => ({ default: m.AurumCaseStudy }))
                            );
const SchenkerCaseStudy = lazy(() =>
    import('./components/schenker-case-study').then((m) => ({ default: m.SchenkerCaseStudy }))
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
