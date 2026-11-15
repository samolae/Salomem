import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import type { HelmetServerState } from 'react-helmet-async';
import { domMax } from 'motion/react';
import { AppTree, setMotionFeatures } from './app/App';
import { routes, PRERENDER_PATHS } from './app/routes';

/*
 * Build-time render of one page to HTML (used by scripts/prerender.mjs).
 * Same routes and providers as the browser app, so React can hydrate the
 * result instead of rendering from scratch.
 */
export { PRERENDER_PATHS };

setMotionFeatures(domMax);

export async function render(path: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://samole.ge${path}`));
  if (context instanceof Response) {
    throw new Error(`Prerender of ${path} returned a redirect or response`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext: { helmet?: HelmetServerState } = {};
  // Streaming render, read only once everything is ready: unlike renderToString
  // it waits for lazy parts (the home page below the drum, the case-study grid),
  // so the HTML is complete and matches what the browser hydrates
  const html = await new Promise<string>((resolve, reject) => {
    let out = '';
    const sink = new Writable({
      write(chunk, _enc, done) { out += chunk.toString(); done(); },
      final(done) { resolve(out); done(); },
    });
    const { pipe } = renderToPipeableStream(
      <AppTree helmetContext={helmetContext}>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </AppTree>,
      { onAllReady: () => pipe(sink), onShellError: reject, onError: reject }
    );
  });
  return { html, helmet: helmetContext.helmet };
}
