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
  url === '/projects/dasturi'
    ? 'src/app/baked/dasturi-case.tsx'
    : url === '/projects/fitmeal'
    ? 'src/app/baked/fitmeal-case.tsx'
    : ['/projects/terminal', '/projects/mardi', '/projects/carmall', '/projects/gtcc', '/projects/arena'].includes(url)
    ? 'src/app/baked/social-cases.tsx'
    : url === '/projects/gagua'
    ? 'src/app/baked/gagua-case.tsx'
    : url === '/projects/zummo'
    ? 'src/app/baked/zummo-case.tsx'
    : url === '/projects/scope'
    ? 'src/app/baked/scope-case.tsx'
    : url === '/projects/gv-capital'
    ? 'src/app/baked/gv-case.tsx'
    : url.startsWith('/projects/')
    ? `src/app/components/${url.split('/')[2]}-case-study.tsx`
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

// Client-only shell for paths without static HTML (/tools/pixel)
await fs.writeFile(path.join(dist, 'app.html'), template);

// Every other unknown path: there is no catch-all rewrite (vercel.json), so
// Vercel serves this file with a real 404 status. The browser app renders
// the Not Found page into it, as before.
await fs.writeFile(
  path.join(dist, '404.html'),
  template
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Page not found | Salome Mosiava</title>')
    .replace(/\s*<!--[^>]*canonical[^>]*-->/, '')
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n</head>')
);

// Page tags from <Helmet> that belong in static HTML. Open Graph and Twitter
// tags are handled apart (OG below), and preconnects are already in the template.
const KEEP = (tag) =>
  !/property="og:|name="twitter:|rel="preconnect"|name="color-scheme"/.test(tag);

function headFrom(helmet) {
  if (!helmet) return '';
  const parts = [helmet.title, helmet.meta, helmet.link, helmet.script].map((p) => p.toString());
  const tags =
    parts.join('').match(/<(title|script)\b[^>]*>[\s\S]*?<\/\1>|<(?:meta|link)\b[^>]*>/g) ?? [];
  return tags.filter(KEEP).join('\n  ');
}

/*
 * Link previews: each inner page shares with its own title, description and
 * address; the picture stays the template's one for every page. Only the
 * values of the template's tags change, so nothing is added or doubled.
 */
const OWN = ['og:title', 'og:description', 'og:url', 'og:type', 'twitter:title', 'twitter:description'];
function ogFrom(helmet) {
  const meta = helmet ? helmet.meta.toString() : '';
  const out = {};
  for (const key of OWN) {
    const attr = key.startsWith('og:') ? 'property' : 'name';
    const tag = meta.match(new RegExp(`<meta\\b[^>]*\\b${attr}="${key}"[^>]*>`));
    const content = tag && tag[0].match(/\bcontent="([^"]*)"/);
    if (content) out[key] = content[1];
  }
  return out;
}
function withOwnPreview(page, og, url) {
  for (const [key, value] of Object.entries(og)) {
    const attr = key.startsWith('og:') ? 'property' : 'name';
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
    if (!re.test(page)) throw new Error(`prerender: template has no ${key} tag (${url})`);
    page = page.replace(re, (_m, a, b) => `${a}${value}${b}`);
  }
  return page;
}

for (const url of PRERENDER_PATHS) {
  const { html: raw, helmet } = await render(url);
  // The soft previews behind each picture (src/app/media.ts) come inline,
  // once each, so a page shows every picture at once with no extra request
  const lq = new Map();
  const html = raw.replace(/background-image:url\((\/m\/[^)]+\.lq\.webp)\)/g, (_m, u) => {
    if (!lq.has(u)) lq.set(u, lq.size);
    return `background-image:var(--lq${lq.get(u)})`;
  });
  const lqCss = lq.size
    ? `<style>:root{${(await Promise.all([...lq].map(async ([u, i]) =>
        `--lq${i}:url(data:image/webp;base64,${(await fs.readFile(path.join(dist, u))).toString('base64')})`))).join(';')}}</style>`
    : '';
  if (!html.includes('<main')) throw new Error(`prerender: no <main> in ${url}`);
  const head = headFrom(helmet);
  let page = template
    .replace(EMPTY_ROOT, `<div id="root">${html}</div>`)
    .replace('</head>', `  ${preloadsFor(url)}\n  ${lqCss}\n</head>`);
  if (head) {
    page = page
      .replace(/\s*<title>[\s\S]*?<\/title>/, '')
      .replace(/\s*<meta name="description"[^>]*>/, '')
      .replace(/\s*<link rel="canonical"[^>]*>/, '')
      .replace('</head>', `  ${head}\n</head>`);
  }
  // the home page keeps the template's card exactly as it was
  if (url !== '/') page = withOwnPreview(page, ogFrom(helmet), url);
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

/*
 * The sitemap lists every page that has static HTML, so a new case study is
 * in it as soon as it is in PRERENDER_PATHS (src/app/routes.ts).
 */
const priority = (u) => (u === '/' ? '1.0' : u === '/services' || u === '/contact' ? '0.8' : '0.9');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PRERENDER_PATHS.map((u) => `  <url><loc>https://samole.ge${u}</loc><changefreq>monthly</changefreq><priority>${priority(u)}</priority></url>`).join('\n')}
</urlset>
`;
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);
console.log(`sitemap.xml                  ${PRERENDER_PATHS.length} pages`);
