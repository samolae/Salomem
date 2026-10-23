/*
 * Static HTML for every page in PRERENDER_PATHS.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server entry):
 * renders each page with React on the server side of the build and writes
 * it into dist/<path>/index.html, so visitors and crawlers get the content
 * before any JavaScript runs. The browser app then hydrates that HTML.
 * dist/app.html keeps the empty shell for every other path (404, tools).
 */
// Production React (no dev-only warnings or checks) for the server render
process.env.NODE_ENV = 'production';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
// The client build's index.html is the template; on a re-run (index.html
// already prerendered) the untouched copy in app.html is used instead
const EMPTY_ROOT = '<div id="root"></div>';
let template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes(EMPTY_ROOT)) {
  template = await fs.readFile(path.join(dist, 'app.html'), 'utf8').catch(() => template);
}
const { render, PRERENDER_PATHS } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

if (!template.includes(EMPTY_ROOT)) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
}

// Route chunk per page: modulepreloaded so it downloads alongside the main
// bundle instead of after it (main.tsx loads it before hydrating)
const manifest = JSON.parse(
  await fs.readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8')
);
const ROUTE_SOURCE = (url) =>
  url.startsWith('/projects/')
    ? 'src/app/baked/case-page.tsx'
    : 'src/app/baked/page.tsx';

function preloadsFor(url) {
  const files = new Set();
  const walk = (key) => {
    const chunk = manifest[key];
    if (!chunk || chunk.isEntry || files.has(chunk.file)) return;
    files.add(chunk.file);
    (chunk.imports ?? []).forEach(walk);
  };
  const source = ROUTE_SOURCE(url);
  if (!manifest[source]) throw new Error(`prerender: ${source} missing from manifest`);
  walk(source);
  return [...files].map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('\n  ');
}

// Client-only shell for paths without static HTML
await fs.writeFile(path.join(dist, 'app.html'), template);

// Page tags from <Helmet> that belong in static HTML. Open Graph and Twitter
// tags stay as the template defines them (what link previews show today),
// and preconnects are already in the template.
const KEEP = (tag) =>
  !/property="og:|name="twitter:|rel="preconnect"|name="color-scheme"/.test(tag);

function headFrom(helmet) {
  if (!helmet) return '';
  const parts = [helmet.title, helmet.meta, helmet.link, helmet.script].map((p) => p.toString());
  const tags =
    parts.join('').match(/<(title|script)\b[^>]*>[\s\S]*?<\/\1>|<(?:meta|link)\b[^>]*>/g) ?? [];
  return tags.filter(KEEP).join('\n  ');
}

for (const url of PRERENDER_PATHS) {
  const { html, helmet } = await render(url);
  if (!html.includes('<main')) throw new Error(`prerender: no <main> in ${url}`);
  const head = headFrom(helmet);
  let page = template
    .replace(EMPTY_ROOT, `<div id="root">${html}</div>`)
    .replace('</head>', `  ${preloadsFor(url)}\n</head>`);
  if (head) {
    page = page
      .replace(/\s*<title>[\s\S]*?<\/title>/, '')
      .replace(/\s*<meta name="description"[^>]*>/, '')
      .replace(/\s*<link rel="canonical"[^>]*>/, '')
      .replace('</head>', `  ${head}\n</head>`);
  }
  // Georgian pages (/ka…): Georgian lang, their own canonical, and both
  // language versions announced to search engines on every bilingual page
  const isKa = url === '/ka' || url.startsWith('/ka/');
  const enPath = isKa ? url.replace(/^\/ka/, '') || '/' : url;
  // Georgian is built but not published yet: flip to true with the /ka routes
  const bilingual = false && !enPath.startsWith('/projects/');
  if (isKa) {
    page = page
      .replace(/<html lang="[^"]*"/, '<html lang="ka"')
      .replace(/(<link rel="canonical" href="https:\/\/samole\.ge)([^"]*)"/, (_m, a, p) => `${a}${p === '/' || p === '' ? '/ka' : '/ka' + p}"`);
  }
  if (bilingual) {
    const enUrl = `https://samole.ge${enPath === '/' ? '/' : enPath}`;
    const kaUrl = `https://samole.ge${enPath === '/' ? '/ka' : '/ka' + enPath}`;
    page = page.replace('</head>', `  <link rel="alternate" hreflang="en" href="${enUrl}" />\n  <link rel="alternate" hreflang="ka" href="${kaUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${enUrl}" />\n</head>`);
  }
  const file = url === '/' ? path.join(dist, 'index.html') : path.join(dist, url, 'index.html');
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page);
  console.log(`prerendered ${url.padEnd(28)} ${(Buffer.byteLength(page) / 1024).toFixed(1)} kB`);
}
