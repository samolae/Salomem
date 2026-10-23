/*
 * Case studies are React Router lazy routes: the router waits for the
 * module before committing the navigation, so a view transition always
 * captures the finished page instead of an empty Suspense fallback.
 * The same loaders back preloadRoute(), called on hover/focus/touch of
 * a case link, which makes the page open instantly.
 */
export const caseRoutes = {
  '/projects/aurum': () =>
    import('./baked/case-page').then((m) => ({ Component: m.AurumCase })),
  '/projects/schenker': () =>
    import('./baked/case-page').then((m) => ({ Component: m.SchenkerCase })),
  '/projects/unispace': () =>
    import('./baked/case-page').then((m) => ({ Component: m.UnispaceCase })),
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
