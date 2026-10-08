/*
 * Case studies are React Router lazy routes: the router waits for the
 * module before committing the navigation, so a view transition always
 * captures the finished page instead of an empty Suspense fallback.
 * The same loaders back preloadRoute(), called on hover/focus/touch of
 * a case link, which makes the page open instantly.
 */
export const caseRoutes = {
  '/projects/aurum': () =>
    import('./components/aurum-case-study').then((m) => ({ Component: m.AurumCaseStudy })),
  '/projects/schenker': () =>
    import('./components/schenker-case-study').then((m) => ({ Component: m.SchenkerCaseStudy })),
  '/projects/unispace': () =>
    import('./components/unispace-case-study').then((m) => ({ Component: m.UnispaceCaseStudy })),
} as const;

export type CasePath = keyof typeof caseRoutes;

/** Warm the case-study chunk ahead of a click. Safe to call repeatedly. */
export function preloadRoute(path: string) {
  const load = (caseRoutes as Record<string, () => Promise<unknown>>)[path];
  if (load) load().catch(() => { /* retried on navigation */ });
}
