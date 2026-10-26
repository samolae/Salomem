import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes } from 'react-router';
import App from './app/App.tsx';
import { routes } from './app/routes';
import { startHydration } from './app/hydration';
import { homeRoute } from './app/case-routes';
import './styles/index.css';

/*
 * Pages listed in PRERENDER_PATHS arrive as finished HTML (scripts/
 * prerender.mjs), so the visitor sees content before any JavaScript runs.
 * React then hydrates that HTML instead of rendering it again. Every other
 * path (404, tools) gets an empty shell and renders on the client.
 */
/*
 * If a script file fails to download (a flaky network, or a cached old
 * page asking for files a new deploy replaced), reload once with a fresh
 * request instead of leaving a page that never comes alive. The guard stops
 * a reload loop; the page itself stays readable without JavaScript.
 */
function recover() {
  try {
    if (sessionStorage.getItem('chunk-retry')) return;
    sessionStorage.setItem('chunk-retry', '1');
  } catch { return; }
  const url = new URL(window.location.href);
  url.searchParams.set('r', Date.now().toString(36));
  window.location.replace(url.toString());
}
window.addEventListener('vite:preloadError', (e) => { e.preventDefault(); recover(); });
window.addEventListener('load', () => { setTimeout(() => { try { sessionStorage.removeItem('chunk-retry'); } catch { /* private mode */ } }, 4000); });

async function boot() {
  const container = document.getElementById('root')!;
  // A `?section=` deep link opens a home section the static page cannot
  // know about, so those visits render from scratch instead of hydrating
  const prerendered =
    container.firstElementChild !== null &&
    !new URLSearchParams(window.location.search).has('section');

  if (prerendered) {
    // A case study is a lazy route: load it first, so the first render
    // matches the prerendered page instead of an empty fallback
    const lazyMatches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy);
    if (lazyMatches?.length) {
      await Promise.all(
        lazyMatches.map(async (m) => {
          const loader = m.route.lazy as () => Promise<Record<string, unknown>>;
          Object.assign(m.route, { ...(await loader()), lazy: undefined });
        })
      );
    }
  }

  const router = createBrowserRouter(routes);

  if (prerendered) {
    startHydration();
    hydrateRoot(container, <App router={router} />, {
      onRecoverableError: (error: unknown) => console.warn('[hydration]', error),
    });
  } else {
    createRoot(container).render(<App router={router} />);
  }

  // Warm the home page chunk once the browser is idle, so "Back to
  // portfolio" from a case study opens instantly
  const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
  idle(() => { homeRoute().catch(() => { /* retried on navigation */ }); });
}

boot().catch((err) => { console.warn('[boot]', err); recover(); });
