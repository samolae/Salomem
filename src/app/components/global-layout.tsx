import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

const F = {
  body: '"Manrope", "Inter", sans-serif',
  // the redesigned pages' own text font (src/app/baked/ui.tsx), so they need no Google font for this link
  site: '"Avenir Next Georgian", system-ui, sans-serif',
};

const BAKED_PATHS = new Set(['/', '/work', '/services', '/contact', '/projects/dasturi', '/projects/fitmeal', '/projects/gv-capital', '/projects/scope', '/projects/zummo', '/projects/gagua', '/projects/terminal', '/projects/mardi', '/projects/carmall', '/projects/gtcc', '/projects/arena', '/projects/aurum', '/projects/schenker', '/projects/unispace']);

/*
 * The dark layout of the older pages and the desktop cursor tag both use the
 * motion library (~45 KB compressed). They load as their own chunks, so the
 * main script, which every page waits for, no longer carries it.
 */
const LegacyLayout = lazy(() => import('./legacy-layout').then((m) => ({ default: m.LegacyLayout })));
const CursorTag = lazy(() => import('./cursor-tag').then((m) => ({ default: m.CursorTag })));
// same query as cursor-tag.tsx: mouse and trackpad only, touch screens never download the tag
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

function useFinePointerSeen() {
  // false in the prerender and the first render (they must agree), then true
  // once a mouse or trackpad is there
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const sync = () => { if (mq.matches) setFine(true); };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return fine;
}

/**
 * First stop for keyboard users: jumps past the navigation to the page's
 * <main id="main-content">. Hidden until focused. Focus is moved by hand
 * so the URL hash (and the router) never changes.
 */
function SkipLink({ font = F.body }: { font?: string }) {
  return (
    <a
      href="#main-content"
      onClick={(e) => {
        const main = document.getElementById('main-content');
        if (!main) return;
        e.preventDefault();
        main.focus({ preventScroll: true });
        main.scrollIntoView({ block: 'start' });
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[10000] focus:inline-flex focus:items-center focus:rounded-full focus:bg-[#d93905] focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-medium focus:text-white focus:shadow-[0_0_0_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.4)] focus:outline-none"
      style={{ fontFamily: font }}
    >
      Skip to content
    </a>
  );
}

/**
 * GlobalLayout, wraps ALL routes. The redesigned pages bring their own light
 * shell (src/app/baked); every other path gets the dark layout.
 */
export function GlobalLayout() {
  const location = useLocation();
  const fine = useFinePointerSeen();
  const cursor = fine ? <Suspense fallback={null}><CursorTag /></Suspense> : null;

  const isBaked = BAKED_PATHS.has(location.pathname) || location.pathname.startsWith('/work/') || location.pathname === '/ka' || location.pathname.startsWith('/ka/');
  if (isBaked) {
    return (
      <>
        <SkipLink font={F.site} />
        <Outlet />
        {cursor}
      </>
    );
  }
  return (
    <Suspense fallback={null}>
      <LegacyLayout skip={<SkipLink />} cursor={cursor} />
    </Suspense>
  );
}
