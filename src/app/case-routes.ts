/*
 * Case studies are React Router lazy routes: the router waits for the
 * module before committing the navigation, so a view transition always
 * captures the finished page instead of an empty Suspense fallback.
 * The same loaders back preloadRoute(), called on hover/focus/touch of
 * a case link, which makes the page open instantly.
 */
export const caseRoutes = {
  // The white case layout (./baked/case-page) is kept for later; the dark
  // case pages stay live
  '/projects/aurum': () =>
    import('./components/aurum-case-study').then((m) => ({ Component: m.AurumCaseStudy })),
  '/projects/schenker': () =>
    import('./components/schenker-case-study').then((m) => ({ Component: m.SchenkerCaseStudy })),
  '/projects/unispace': () =>
    import('./components/unispace-case-study').then((m) => ({ Component: m.UnispaceCaseStudy })),
  '/projects/gv-capital': () =>
    import('./baked/gv-case').then((m) => ({ Component: m.GvCase })),
  '/projects/fitmeal': () =>
    import('./baked/fitmeal-case').then((m) => ({ Component: m.FitmealCase })),
  '/projects/dasturi': () =>
    import('./baked/dasturi-case').then((m) => ({ Component: m.DasturiCase })),
} as const;

/** Home, work galleries, services and contact all share one page module */
export const homeRoute = () =>
  import('./baked/page').then((m) => ({ Component: m.BakedPage }));

export type CasePath = keyof typeof caseRoutes;

/** Warm the case-study chunk ahead of a click. Safe to call repeatedly. */
export function preloadRoute(path: string) {
  const load = (caseRoutes as Record<string, () => Promise<unknown>>)[path];
  if (load) load().catch(() => { /* retried on navigation */ });
}
