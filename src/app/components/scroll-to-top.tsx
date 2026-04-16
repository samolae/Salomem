import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

/**
 * ScrollToTopLayout — wraps all routes via react-router.
 *
 * Guarantees every route change starts from the top:
 *   • First paint → instant (no visible flash)
 *   • Subsequent navigations → smooth, fast scroll
 *
 * Also handles deep-link `?section=` scrolling.
 */
export function ScrollToTopLayout() {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);
  const prevPathname = useRef(pathname);

  // Pre-paint scroll reset on route change
  useLayoutEffect(() => {
    // Always reset scroll position before the browser paints
    if (isFirst.current) {
      isFirst.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Also reset any scrollable containers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      prevPathname.current = pathname;
      return;
    }

    // Only trigger on actual route changes
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Instant reset first to prevent flash of old scroll position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  // Deep-link section scrolling via ?section=
  useEffect(() => {
    const params = new URLSearchParams(search);
    const section = params.get('section');
    if (section) {
      // Wait for content to render, then scroll to section
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(section);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  }, [search]);

  return <Outlet />;
}

/**
 * scrollContentToTop — utility for scrolling within the HomePage
 * when sidebar section changes. Scrolls both the window and any
 * scrollable ancestor to the top instantly (pre-animation) to
 * avoid jarring mid-scroll content swaps.
 */
export function scrollContentToTop(behavior: ScrollBehavior = 'instant') {
  window.scrollTo({ top: 0, left: 0, behavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Utility: smooth-scroll a ref into view when content expands.
 * Use inside useEffect after state change to auto-scroll expanded panels.
 */
export function scrollToRef(
  ref: React.RefObject<HTMLElement | null>,
  opts?: { offset?: number; behavior?: ScrollBehavior }
) {
  if (!ref.current) return;
  const top = ref.current.getBoundingClientRect().top + window.scrollY - (opts?.offset ?? 80);
  window.scrollTo({ top, behavior: opts?.behavior ?? 'smooth' });
}
