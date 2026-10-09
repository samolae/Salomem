import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import type { HelmetServerState } from 'react-helmet-async';
import { AppTree } from './app/App';
import { routes, PRERENDER_PATHS } from './app/routes';

/*
 * Build-time render of one page to HTML (used by scripts/prerender.mjs).
 * Same routes and providers as the browser app, so React can hydrate the
 * result instead of rendering from scratch.
 */
export { PRERENDER_PATHS };

export async function render(path: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://samole.ge${path}`));
  if (context instanceof Response) {
    throw new Error(`Prerender of ${path} returned a redirect or response`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <AppTree helmetContext={helmetContext}>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </AppTree>
  );
  return { html, helmet: helmetContext.helmet };
}
