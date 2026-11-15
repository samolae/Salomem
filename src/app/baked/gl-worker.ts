/*
 * The drum's WebGL, drawn in a worker: used where WebGL runs on the
 * processor (no graphics card, or one the browser blocks). Drawn there on
 * the page itself, every frame held up everything else; here it costs the
 * page nothing. The renderer is the same (drum-gl.ts), so the drum looks the
 * same.
 *
 * The page works out, every frame, where each tile is and what it may show
 * (a reel's frame, its picture, its soft preview, in that order) and sends
 * just that. This worker fetches and decodes the pictures (from the
 * browser's cache), keeps them decoded at the size the drum shows them (as
 * the page kept its pictures), uploads a few a frame, and paints.
 *
 * One worker serves the page for its whole visit: a rebuilt drum (a new
 * screen size) hands over a new canvas and finds its pictures still decoded.
 */
import { createDrumGL, STRIDE, type Draw, type DrumGL, type GlIn, type GlOut } from './drum-gl';

const post = (m: GlOut) => (self as unknown as Worker).postMessage(m);

let gl: DrumGL | null = null;
/** pictures, decoded (and scaled down where they are larger than the drum shows them) */
const bitmaps = new Map<number, ImageBitmap>();
const asked = new Set<number>();
let scratch: OffscreenCanvas | null = null;

async function load(id: number, url: string, need: number) {
  try {
    const r = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!r.ok) throw new Error(String(r.status));
    let bm = await createImageBitmap(await r.blob());
    // a copy larger than the tile ever shows is scaled down first, with the best smoothing,
    // as the page did before uploading it: the graphics memory goes further
    if (need && bm.width > need * 1.1) {
      const w = Math.round(need), h = Math.max(1, Math.round((need * bm.height) / bm.width));
      scratch ??= new OffscreenCanvas(w, h);
      scratch.width = w; scratch.height = h;
      const x = scratch.getContext('2d')!;
      x.imageSmoothingEnabled = true;
      x.imageSmoothingQuality = 'high';
      x.drawImage(bm, 0, 0, w, h);
      bm.close();
      bm = scratch.transferToImageBitmap();
    }
    bitmaps.set(id, bm);
    post({ t: 'have', id });
    paintSoon();
  } catch {
    asked.delete(id);
    post({ t: 'miss', id });
  }
}

/* ── painting: once per frame of the worker, with the latest tiles the page sent ── */
let latest: { buf: Float32Array; n: number; oy: number; P: number } | null = null;
let queued = false;
const raf: (cb: () => void) => void = typeof self.requestAnimationFrame === 'function'
  ? (cb) => { self.requestAnimationFrame(cb); }
  : (cb) => { setTimeout(cb, 16); };
const paintSoon = () => { if (!queued && gl && latest) { queued = true; raf(paint); } };
const draws: Draw[] = [];
/*
 * Reels: the latest frame of each, waiting for the next paint. A frame not
 * yet painted gives way to a newer one, so a slow paint never piles frames
 * up; and only a couple go to the card a paint (on the processor each costs
 * as much as the rest of the paint).
 */
const films = new Map<number, VideoFrame>();
const dropFilms = () => { for (const f of films.values()) f.close(); films.clear(); };

function paint() {
  queued = false;
  if (!gl || !latest || gl.lost()) return;
  const { buf, n, oy, P } = latest;
  let uploads = 0, behind = false;
  // the reel that waited longest goes first (a reel takes its place at the back once painted)
  for (const [id, f] of films) {
    if (uploads >= 2) { behind = true; break; }
    films.delete(id);
    uploads++;
    try {
      const s = String(id), fresh = !gl.has(s);
      gl.upload(s, f, f.displayWidth, f.displayHeight, false);
      if (fresh) post({ t: 'have', id });
    } catch { /* a frame the card cannot take: the tile keeps its still */ } finally { f.close(); }
  }
  uploads = 0;
  draws.length = 0;
  for (let k = 0; k < n; k++) {
    const o = k * STRIDE;
    let key: string | null = null, fade = 1;
    // the first of film, picture, preview that is on the card, or can go there this frame
    for (let c = 0; c < 3; c++) {
      const id = buf[o + c];
      if (id < 0) continue;
      const s = String(id);
      if (!gl.has(s)) {
        const bm = bitmaps.get(id);
        if (!bm) continue;
        // a few pictures a frame, so no frame waits on many
        if (uploads >= 4) { behind = true; continue; }
        uploads++;
        gl.upload(s, bm, bm.width, bm.height, c === 1);
      }
      key = s;
      if (c === 1) fade = buf[o + 10];
      break;
    }
    if (!key) continue;
    draws.push({ key, u: buf[o + 3], l: buf[o + 4], d: buf[o + 5], s: buf[o + 6], w: buf[o + 7], h: buf[o + 8], alpha: buf[o + 9] * fade });
  }
  gl.frame(draws, oy, P);
  if (behind) paintSoon();
}

self.onmessage = (e: MessageEvent<GlIn>) => {
  const m = e.data;
  switch (m.t) {
    case 'init': {
      gl?.destroy();
      dropFilms();
      gl = createDrumGL(m.canvas, { onLost: () => post({ t: 'lost' }), budget: m.budget, software: true });
      latest = null;
      post(gl ? { t: 'ready' } : { t: 'fail' });
      return;
    }
    case 'stop':
      gl?.destroy(); gl = null; latest = null;
      dropFilms();
      return;
    case 'size':
      gl?.resize(m.w, m.h, m.dpr);
      paintSoon();
      return;
    case 'pic':
      if (bitmaps.has(m.id)) { post({ t: 'have', id: m.id }); return; }
      if (asked.has(m.id)) return;
      asked.add(m.id);
      load(m.id, m.url, m.need);
      return;
    case 'film': {
      if (!gl) { m.frame.close(); return; }
      films.get(m.id)?.close();
      films.set(m.id, m.frame);
      paintSoon();
      return;
    }
    case 'draw':
      latest = m;
      paintSoon();
      return;
  }
};
