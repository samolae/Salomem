import { useEffect, useMemo, useRef, useState } from 'react';
import { IMG } from '../lib/cld';
import { adsBrands, motionReels } from './data';
import { spotlights } from './content';
import { useMotionPause, PauseButton } from './shell';
import { CtaLink, Lightbox, type LightboxItem } from './ui';
import { brandName, useI18n } from './i18n';
import { SHAPE, STILL, heroKey } from './hero-shapes';
import { enhance } from '../media';
import { createDrumGL, glBudget, STRIDE, type Draw, type DrumGL, type GlIn, type GlOut } from './drum-gl';

/*
 * The opening world, after baked.design: the work is pinned to the inside
 * of a tall cylinder seen from within. Columns stand round the drum, the
 * near edges swing towards you, the drum turns slowly on its own, the
 * columns drift upward, the pointer looks around, and a drag spins it with
 * inertia. Scrolling opens it: the tiles push out and fade, revealing the
 * page. Same constants and easing as the reference. The pictures carry a
 * light grade (a touch darker, more saturated) so the pills read on top.
 */

/** A still from a Cloudinary video at a percentage offset */
export const videoFrame = (src: string, offset = '40p', width = 480) => {
  const mark = '/video/upload/';
  const at = src.indexOf(mark);
  if (at < 0) return src;
  let rest = src.slice(at + mark.length);
  const first = rest.split('/')[0];
  if (!first.startsWith('v1') && /^[a-z]{1,3}_/.test(first)) rest = rest.slice(first.length + 1);
  return `${src.slice(0, at + mark.length)}so_${offset},w_${width},c_limit,q_auto,f_auto/${rest.replace(/\.(mp4|mov|webm)$/i, '.jpg')}`;
};

/** full: what opens large; brand/logo: shown in the enlarged view */
type Item = { src: string; full: string; fullVideo?: boolean; brand: string; logo?: string; video?: string; ratio?: number };

/** The same reel, scaled down for a small tile */
const smallVideo = (src: string) => src.replace('/video/upload/f_auto,q_auto/', '/video/upload/w_360,c_limit,q_auto,f_auto/');

/** case-study visuals, as small hero thumbnails (public/hero) that open the full picture */
const CASE_BRAND: Record<string, string> = {"zummo": "Zummo Georgia", "gagua": "Gagua Clinic", "fitmeal": "FitMeal", "gv": "GV Capital", "dasturi": "Dasturi", "scope": "Scope"};
const CASE_SHOTS: [string, string, number][] = [
  ['zummo', 'bar-02', 0.8],
  ['zummo', 'story-business', 0.563],
  ['zummo', 'post-hero', 0.8],
  ['zummo', 'yellow-machine', 0.563],
  ['zummo', 'ig-business', 0.8],
  ['zummo', 'bar-04', 0.8],
  ['zummo', 'ig-hotels', 0.8],
  ['zummo', 'aug-02', 0.8],
  ['zummo', 'sky-machine', 0.563],
  ['zummo', 'aug-03', 0.8],
  ['zummo', 'post-quality', 0.8],
  ['zummo', 'bar-01', 0.8],
  ['gagua', 'home-grid', 1.013],
  ['gagua', 'cc-post', 0.8],
  ['gagua', 'born-cover', 2.623],
  ['gagua', 'ad-app-story', 0.563],
  ['gagua', 'ad-birth-story', 0.563],
  ['gagua', 'vac-it', 1.0],
  ['gagua', 'li-career-cover', 2.697],
  ['gagua', 'vac-midwife', 1.0],
  ['gagua', 'ad-scan-story', 0.563],
  ['fitmeal', 'table-greek', 0.805],
  ['fitmeal', 'floor-tall', 0.558],
  ['fitmeal', 'table-shrimp', 0.805],
  ['fitmeal', 'stripe-spread', 0.805],
  ['fitmeal', 'picnic-headphones', 0.805],
  ['fitmeal', 'blanket-read', 0.805],
  ['fitmeal', 'office-desk', 0.8],
  ['fitmeal', 'park-read', 0.805],
  ['gv', 'overhead', 1.0],
  ['gv', 'lounge', 1.778],
  ['gv', 'cards', 0.747],
  ['gv', 'corridor', 0.747],
  ['gv', 'packaging', 0.75],
  ['gv', 'wayfinding', 0.667],
  ['gv', 'hardhat', 0.75],
  ['gv', 'uniform', 0.75],
  ['gv', 'social-opportunities', 0.8],
  ['gv', 'brochure', 0.707],
  ['gv', 'fleet', 1.778],
  ['dasturi', 'terrace-gold', 1.509],
  ['dasturi', 'duo-gold', 1.509],
  ['dasturi', 'lineup', 1.509],
  ['dasturi', 'saperavi-bordeaux', 1.524],
  ['dasturi', 'labels-gold', 1.611],
  ['dasturi', 'capsule', 1.348],
  ['dasturi', 'duo-satsuri', 1.524],
  ['scope', 'marketers', 0.563],
  ['scope', 'business', 0.563],
  ['scope', 'casting', 0.563],
];

/** a fresh order on every visit (client only, the layout is built after mount) */
function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  if (typeof window === 'undefined') return a;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** width / height of each picture once it has loaded, so tiles take its shape */
const RATIO = new Map<string, number>();

/** every kind taken in turn (two pictures, two case shots, a reel, a highlight), so neighbours differ */
function interleave(lists: Item[][]) {
  const out: Item[] = [];
  for (let k = 0, added = true; added; k++) {
    added = false;
    lists.forEach((l, n) => {
      const take = n < 2 ? [l[k * 2], l[k * 2 + 1]] : [l[k]];
      for (const t of take) if (t) { out.push(t); added = true; }
    });
  }
  return out;
}

/**
 * pool: the drum's order, each kind shuffled anew on every visit.
 * plain: the same items in one fixed order, for the list keyboards and screen
 * readers get. That list is part of the page's HTML, so it must read the same
 * on the server and in the browser's first render: a shuffled list there made
 * React drop the whole server-rendered page and build it again from scratch.
 */
function usePool(): { pool: Item[]; plain: Item[] } {
  return useMemo(() => {
    // shapes and stills measured in advance (hero-shapes.ts), so nothing changes once it loads
    const ads: Item[] = adsBrands.flatMap((b) =>
      b.items.filter((it) => it.type === 'image' && !it.fullWidth).map((it) => ({ src: it.src, full: it.src, brand: b.name, logo: b.logoImg, ratio: SHAPE[heroKey(it.src)] }))
    );
    const spots: Item[] = spotlights.map((s) => ({ src: s.img, full: s.img, brand: s.title, ratio: SHAPE[heroKey(s.img)] }));
    const frames: Item[] = motionReels.map((r, i) => ({
      src: videoFrame(r.src, STILL[heroKey(r.src)] ?? (i % 2 ? '35p' : '60p'), 600), full: r.src, fullVideo: true, brand: r.brand, logo: (r as { logoImg?: string }).logoImg,
      video: smallVideo(r.src), ratio: 9 / 16,
    }));
    const cases: Item[] = CASE_SHOTS.map(([d, n, r]) => ({
      src: `/hero/${d}-${n}.jpg`, full: `/cases/${d}/${n}.jpg`, brand: CASE_BRAND[d], ratio: r,
    }));
    const kinds = [ads, cases, frames, spots];
    return { pool: interleave(kinds.map(shuffle)), plain: interleave(kinds) };
  }, []);
}

/* ── geometry, as on the reference ───────────────────────────────────── */
type Geo = { W: number; R: number; Z: number; P: number; GAP: number; mobile: boolean };
const geo = (): Geo => {
  // tiles a little smaller than the reference, so more of the work fits on the drum
  if (window.innerWidth < 760) return { W: 112, R: 560, Z: 330, P: 760, GAP: 14, mobile: true };
  const s = Math.max(1, window.innerWidth / 1440);
  return { W: Math.round(180 * Math.min(s, 1.35)), R: Math.round(900 * s), Z: Math.round(540 * s), P: Math.round(1100 * s), GAP: Math.round(22 * Math.min(s, 1.35)), mobile: false };
};
const RATIOS = [1.33, 1, 0.8, 1.6, 1.25, 0.75];
type Slot = { col: number; y: number; h: number; item: number };
type Col = { phi: number; off: number; L: number };

const ratioOf = (it: Item, fallback: number) => RATIO.get(it.src) ?? it.ratio ?? fallback;

/** a fresh mix on every visit: random start and stride through the pool, fixed for the visit so a resize keeps it */
const MIX = (() => {
  if (typeof window === 'undefined') return { start: 0, step: 7 };
  const steps = [5, 7, 11, 13, 17];
  return { start: Math.floor(Math.random() * 997), step: steps[Math.floor(Math.random() * steps.length)] };
})();

function layout(g: Geo, pool: Item[]) {
  const nCols = Math.round(360 / (((g.W + g.GAP + 14) / g.R) * 180 / Math.PI));
  const L = g.mobile ? Math.max(900, window.innerHeight * 1.6) : 2300 * Math.max(1, window.innerWidth / 1440);
  const cols: Col[] = [];
  const slots: Slot[] = [];
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  let step = MIX.step; while (gcd(pool.length, step) !== 1) step++; // a stride coprime with the pool, so every item gets a turn
  let pick = MIX.start % pool.length;
  for (let c = 0; c < nCols; c++) {
    cols.push({ phi: (360 / nCols) * c, off: (c * 173) % 400, L: 0 });
    let y = 0, r = c % RATIOS.length;
    while (y < L) {
      // spread the pool: a rotating pointer, stepping past neighbours' picks
      const item = (pick = (pick + step) % pool.length);
      const h = Math.round(g.W / ratioOf(pool[item], RATIOS[r % RATIOS.length]));
      if (y + h > L && y > 0) break;
      slots.push({ col: c, y, h, item });
      y += h + g.GAP; r++;
    }
    cols[c].L = y; // the column wraps on its own length
  }
  return { cols, slots };
}

/** tiles on a phone's screen at the start, or within the first ~3 s of spin (7deg/s) and drift (22px/s) */
function onScreenAtStart(g: Geo, plan: ReturnType<typeof layout>) {
  const halfW = window.innerWidth / 2 + 40;
  const halfH = (window.innerHeight - 68 - 108) / 2 + 40; // the phone stage sits between the pills and the dock
  const seen = (sDeg: number, l: number, h: number) => {
    const s = ((sDeg % 360) + 540) % 360 - 180;
    if (Math.abs(s) > 82) return false;
    const th = (s * Math.PI) / 180;
    const a = g.P / (g.P - (g.Z - g.R * Math.cos(th)));
    const x = g.R * Math.sin(th) * a, hw = (g.W / 2) * a * Math.abs(Math.cos(th));
    return Math.abs(x) - hw < halfW && Math.abs(l * a) - (h / 2) * a < halfH;
  };
  const set = new Set<number>();
  plan.slots.forEach((sl, i) => {
    const col = plan.cols[sl.col];
    const l = ((sl.y + col.off) % col.L + col.L) % col.L - col.L / 2 + sl.h / 2;
    if (seen(col.phi, l, sl.h) || seen(col.phi + 21, l - 66, sl.h)) set.add(i);
  });
  return set;
}

/** columns that spin round to the front within ~15 s; the rest of the drum is asked for at low priority */
function arrivingSoon(plan: ReturnType<typeof layout>) {
  const set = new Set<number>();
  plan.slots.forEach((sl, i) => {
    const s0 = ((plan.cols[sl.col].phi % 360) + 540) % 360 - 180;
    if ((((-35 - s0) % 360) + 360) % 360 < 105) set.add(i); // the drum turns 7deg/s towards +s
  });
  return set;
}

/** is a tile (centre u,l at depth d, turned by s degrees) wholly outside a stage of the given half sizes? */
function offStage(u: number, l: number, d: number, s: number, W: number, h: number, P: number, halfW: number, halfH: number) {
  const th = (s * Math.PI) / 180, cx = (W / 2) * Math.cos(th), dz = (W / 2) * Math.sin(th);
  const xr = (u + cx) * (P / (P - (d + dz))), xl = (u - cx) * (P / (P - (d - dz)));
  if (Math.min(xl, xr) > halfW || Math.max(xl, xr) < -halfW) return true;
  const kFar = P / (P - (d - Math.abs(dz)));
  return (Math.abs(l) - h / 2) * kFar > halfH;
}

/** once real picture shapes are known, re-stack each column so every tile shows its whole picture */
function restack(g: Geo, plan: ReturnType<typeof layout>, pool: Item[], els: HTMLElement[]) {
  const ys = plan.cols.map(() => 0);
  plan.slots.forEach((sl, i) => {
    const r = RATIO.get(pool[sl.item].src) ?? pool[sl.item].ratio;
    if (r) sl.h = Math.round(g.W / r);
    sl.y = ys[sl.col];
    ys[sl.col] += sl.h + g.GAP;
    const el = els[i];
    if (el) el.style.height = `${sl.h}px`;
  });
  plan.cols.forEach((c, i) => { c.L = ys[i]; });
}

/*
 * A still taken at a fixed point of a reel can land on a blank transition or
 * an end slate, which reads as a tile that never loaded. Each reel's still is
 * checked once in a tiny copy; if it is one flat colour the next point is tried.
 */
const OFFSETS = ['35p', '60p', '20p', '80p', '50p', '10p'];
const flat = (img: HTMLImageElement) => {
  try {
    const c = document.createElement('canvas'); c.width = 12; c.height = 20;
    const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return false;
    x.drawImage(img, 0, 0, 12, 20);
    const d = x.getImageData(0, 0, 12, 20).data;
    let sum = 0, sq = 0; const n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) { const l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11; sum += l; sq += l * l; }
    const mean = sum / n; return Math.sqrt(sq / n - mean * mean) < 9; // almost no detail
  } catch { return false; } // cannot read it: keep it
};
function useLiveStills(pool: Item[]) {
  const [stills, setStills] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    // reels whose still was chosen in advance (hero-shapes.ts) need no check
    const reels = [...new Set(pool.filter((p) => p.video && p.fullVideo && !STILL[heroKey(p.full)]).map((p) => p.full))];
    reels.forEach((full) => {
      const tryAt = (k: number) => {
        if (k >= OFFSETS.length || !alive) return;
        const probe = new Image(); probe.crossOrigin = 'anonymous';
        probe.onload = () => {
          if (!alive) return;
          if (flat(probe)) tryAt(k + 1);
          else setStills((m) => ({ ...m, [full]: videoFrame(full, OFFSETS[k], 600) }));
        };
        probe.src = videoFrame(full, OFFSETS[k], 60);
      };
      tryAt(0);
    });
    return () => { alive = false; };
  }, [pool]);
  return stills;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

/*
 * The tiles' pictures are drawn into a canvas instead of sitting in them as
 * <img> and <video>: one WebGL canvas behind the drum (drum-gl.ts), or, where
 * WebGL 2 is missing, a small canvas in each tile. Same copies from the same
 * srcset, same object-cover, grade, corners and fade, so the drum looks as it
 * did. A canvas is not content to the browser's loading metrics, so the drum
 * no longer reports a new "largest picture" each time a tile turns into view.
 */

/** what a tile shows: its picture (a reel's still for reels) and, for our own pictures, the soft preview */
type Spec = { pic: { src: string; srcSet?: string; sizes?: string }; lq?: string; fade: boolean };
function specFor(it: Item, g: Geo, still: string): Spec {
  if (it.video) {
    // a phone shows a reel's still 112-220 px wide: 240 px is sharp below 2x screens
    const poster = g.mobile ? still.replace('w_600,c_limit', window.devicePixelRatio > 2 ? 'w_360,c_limit' : 'w_240,c_limit') : still;
    return { pic: { src: poster }, fade: false };
  }
  const own = it.src.startsWith('/');
  // the props the <img> had, through the same hook (app/media.ts), so the browser picks the same copy;
  // a picture outside the page cannot size itself ("auto"), so ours get the tile's width, as before
  const p = enhance('img', {
    ...(g.mobile ? IMG.tile(it.src) : IMG.tileLarge(it.src)),
    ...(g.mobile || own ? { sizes: `${g.W}px` } : {}),
    className: 'h-full w-full object-cover', loading: g.mobile ? 'eager' : 'lazy',
  });
  const lq = own ? /url\((.+?)\)/.exec(String(p.style?.backgroundImage ?? ''))?.[1] : undefined;
  // our own pictures show their preview at once; the rest fade in once they are there
  return { pic: { src: p.src, srcSet: p.srcSet, sizes: p.sizes }, lq, fade: !it.src.startsWith('/hero/') };
}

/*
 * One decoded copy per picture, shared by every tile that shows it. The
 * browser picks the copy from the srcset; the picture is then read back at
 * that copy's own size (a srcset picture reports its size in CSS pixels),
 * which costs nothing: it is the same file, already in memory.
 */
const PICS = new Map<string, Promise<HTMLImageElement>>();
const READY = new Set<string>();
const picKey = (p: Spec['pic'], cors: boolean) => `${cors ? 'c' : 'n'} ${p.src} ${p.srcSet ?? ''} ${p.sizes ?? ''}`;
/** already decoded: a tile showing it starts with it, as an <img> of a cached picture did */
const pictureReady = (p: Spec['pic'], cors: boolean) => READY.has(picKey(p, cors));
/*
 * WebGL may only read pictures from another site that allow it (Cloudinary
 * does, for every site), so for WebGL they are asked for in CORS mode; our
 * own pictures are same-site and need nothing.
 */
const foreign = (src: string) => /^https?:\/\//.test(src) && !src.startsWith(window.location.origin);
function picture(p: Spec['pic'], low: boolean, cors: boolean): Promise<HTMLImageElement> {
  const key = picKey(p, cors);
  let got = PICS.get(key);
  if (!got) {
    const im = new Image();
    if (cors && foreign(p.src)) im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    if (low) im.setAttribute('fetchpriority', 'low');
    if (p.sizes) im.sizes = p.sizes;
    if (p.srcSet) im.srcset = p.srcSet;
    im.src = p.src;
    got = im.decode().then(() => {
      if (!p.srcSet) return im;
      const real = new Image();
      if (im.crossOrigin) real.crossOrigin = im.crossOrigin;
      real.src = im.currentSrc || p.src;
      return real.decode().then(() => real);
    });
    got.then(() => READY.add(key), () => {});
    got.catch(() => { /* a picture that fails stays empty, as a broken <img> did */ });
    PICS.set(key, got);
  }
  return got;
}

/** the light grade on every tile (a touch darker, more saturated), so the pills read on top */
const GRADE = 'saturate(1.22) brightness(0.95) contrast(1.03)';
/*
 * A picture tile takes the grade while it is drawn, as the browser applied
 * it while drawing the <img>. As a CSS filter on the canvas it would be
 * applied to an extra copy of the turned tile, which softens fine detail.
 * Reels keep the CSS filter, as their <video> had. Browsers without canvas
 * filters (older Safari) use the CSS filter for every tile.
 */
const GRADE_ON_CANVAS = typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;

/*
 * Draw into a tile's canvas. A picture is scaled to the tile's size on
 * screen with the browser's best smoothing and cropped like object-cover,
 * as the <img> was when the browser drew it into its tile; a reel's frame is
 * copied at its own size, as a playing <video> was shown.
 */
function paint(cv: HTMLCanvasElement, src: HTMLImageElement | HTMLVideoElement, tw: number, th: number, grade: boolean) {
  const film = src instanceof HTMLVideoElement;
  const sw = film ? src.videoWidth : src.naturalWidth;
  const sh = film ? src.videoHeight : src.naturalHeight;
  if (!sw || !sh) return false;
  let w = sw, h = sh, sx = 0, sy = 0, cw = sw, ch = sh;
  if (!film) {
    const dpr = window.devicePixelRatio || 1;
    w = Math.max(1, Math.round(tw * dpr)); h = Math.max(1, Math.round(th * dpr));
    // object-cover: the middle of the picture, in the tile's shape
    if (sw / sh > w / h) { cw = sh * (w / h); sx = (sw - cw) / 2; } else { ch = sw / (w / h); sy = (sh - ch) / 2; }
  }
  const x = cv.getContext('2d');
  if (!x) return false;
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } else x.clearRect(0, 0, w, h);
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = film ? 'low' : 'high';
  if (GRADE_ON_CANVAS) x.filter = grade ? GRADE : 'none';
  try { x.drawImage(src, sx, sy, cw, ch, 0, 0, w, h); return true; } catch { return false; }
}

/** a tile hidden this long gives its canvas memory back (phones limit it); it is drawn again when it comes round */
const RELEASE_MS = 3000;

/** without WebGL, a worker (tile-worker.ts) draws the tiles' canvases, so the page's main thread does not */
const OFFSCREEN_TILES = typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof VideoFrame !== 'undefined'
  && 'transferControlToOffscreen' in HTMLCanvasElement.prototype;

/** where the worker draws: the copy the browser picked from the srcset (loaded, not decoded, here) and its shape */
const PICKED = new Map<string, Promise<{ url: string; ratio: number }>>();
function pickedCopy(p: Spec['pic'], low: boolean) {
  const key = picKey(p, false);
  let got = PICKED.get(key);
  if (!got) {
    got = new Promise((resolve, reject) => {
      const im = new Image();
      im.decoding = 'async';
      if (low) im.setAttribute('fetchpriority', 'low');
      im.onload = () => resolve({ url: im.currentSrc || p.src, ratio: im.naturalWidth / im.naturalHeight });
      im.onerror = reject;
      if (p.sizes) im.sizes = p.sizes;
      if (p.srcSet) im.srcset = p.srcSet;
      im.src = p.src;
    });
    got.catch(() => {});
    PICKED.set(key, got);
  }
  return got;
}
/** each drum build gets fresh tile canvases (a canvas handed to the worker cannot be handed over again) */
let BUILDS = 0;

/*
 * Where WebGL runs on the processor, it runs in a worker (gl-worker.ts):
 * one for the whole visit, so a rebuilt drum finds its pictures decoded.
 * Pictures and frames are known there by number.
 */
const WORKER_GL = typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
  && 'transferControlToOffscreen' in HTMLCanvasElement.prototype;
type GlWorker = {
  w: Worker;
  ids: Map<string, number>;
  /** decoded there (pictures), or on the card there (reels' frames) */
  have: Set<number>;
  asked: Set<number>;
  films: Set<number>;
  failed: boolean;
  on: ((m: GlOut) => void) | null;
  send(m: GlIn, transfer?: Transferable[]): void;
};
let GL_WORKER: GlWorker | null = null;
function glWorker(): GlWorker | null {
  if (GL_WORKER) return GL_WORKER.failed ? null : GL_WORKER;
  if (!WORKER_GL) return null;
  try {
    const w = new Worker(new URL('./gl-worker.ts', import.meta.url), { type: 'module' });
    const s: GlWorker = {
      w, ids: new Map(), have: new Set(), asked: new Set(), films: new Set(), failed: false, on: null,
      send: (m, transfer) => w.postMessage(m, transfer ?? []),
    };
    w.onmessage = (e: MessageEvent<GlOut>) => {
      const m = e.data;
      if (m.t === 'have') s.have.add(m.id);
      else if (m.t === 'fail' || m.t === 'lost') s.failed = true;
      s.on?.(m);
    };
    w.onerror = () => { s.failed = true; s.on?.({ t: 'fail' }); };
    return (GL_WORKER = s);
  } catch { return null; }
}
const glId = (s: GlWorker, key: string) => {
  let id = s.ids.get(key);
  if (id === undefined) { id = s.ids.size; s.ids.set(key, id); }
  return id;
};

/** the drum's WebGL canvas, made fresh for each build (a canvas handed to a worker cannot be used again) */
function glCanvas() {
  const c = document.createElement('canvas');
  c.setAttribute('aria-hidden', 'true');
  c.className = 'pointer-events-none absolute inset-0 block h-full w-full';
  return c;
}

/** cubic-bezier(0.4, 0, 0.2, 1): the tiles' fade-in curve (Tailwind's transition-opacity), 0 to 1 */
function ease(x: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bx = (t: number) => 3 * (1 - t) * (1 - t) * t * 0.4 + 3 * (1 - t) * t * t * 0.2 + t * t * t;
  const by = (t: number) => 3 * (1 - t) * t * t + t * t * t;
  let lo = 0, hi = 1, t = x;
  for (let k = 0; k < 24; k++) { t = (lo + hi) / 2; if (bx(t) < x) lo = t; else hi = t; }
  return by(t);
}
const FADE_MS = 500;

/*
 * The home page loads the code for everything below the drum once the drum
 * has asked for its first pictures (home.tsx), so those requests go first.
 * Four seconds at most, whatever happens.
 */
let startedNow: (() => void) | null = null;
const started = typeof window === 'undefined' ? Promise.resolve() : new Promise<void>((r) => { startedNow = r; setTimeout(r, 4000); });
export const heroStarted = () => started;

export function HeroCanvas() {
  const { tx, ka } = useI18n();
  const { pool, plain } = usePool();
  const stills = useLiveStills(pool);
  const stillsRef = useRef(stills);
  stillsRef.current = stills;
  const [open, setOpen] = useState<number | null>(null);
  const lightbox: LightboxItem[] = useMemo(() => pool.map((t) => ({
    src: t.full, video: t.fullVideo, alt: brandName(t.brand, ka), brand: brandName(t.brand, ka), logo: t.logo,
  })), [pool, ka]);
  const { paused } = useMotionPause();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const heroRef = useRef<HTMLElement>(null);
  // WebGL 2 draws the pictures; without it (or once it is lost) each tile gets its own canvas
  const [useGl, setUseGl] = useState(true);
  const kaRef = useRef(ka);
  kaRef.current = ka;
  const worldRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<Geo | null>(null);
  const [plan, setPlan] = useState<ReturnType<typeof layout> | null>(null);

  /*
   * On a phone only a handful of tiles face the screen at once, yet the
   * drum holds ~300. The tiles on screen now (or within the next few
   * seconds of spin and drift) load first; the rest follow once those
   * pictures are in (or the page has loaded) and the opening has played,
   * so until then the connection carries only what is on screen. A drag
   * brings them at once; they never wait longer than 8 s. The first new
   * column reaches the screen after ~3 s, so they are in by then. Desktop
   * asks for every picture at once, as its lazy <img> tiles did.
   */
  const restRef = useRef(false);
  // a reel whose still was checked in the browser (useLiveStills) gets the new still
  const restillRef = useRef<(() => void) | null>(null);
  useEffect(() => { restillRef.current?.(); }, [stills]);
  const firstView = useMemo(() => (g && plan && g.mobile ? onScreenAtStart(g, plan) : null), [g, plan]);
  const soonView = useMemo(() => (g && plan && g.mobile ? arrivingSoon(plan) : null), [g, plan]);

  // build the drum for this screen size
  useEffect(() => {
    let t = 0, last = '';
    const build = () => {
      const ng = geo();
      const key = `${ng.W}|${ng.R}|${ng.mobile}|${Math.round(window.innerHeight / 100)}`;
      if (key === last) return;
      last = key;
      setG(ng); setPlan(layout(ng, pool));
    };
    build();
    const onResize = () => { clearTimeout(t); t = window.setTimeout(build, 120); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [pool]);

  // the pictures and the frame loop
  useEffect(() => {
    const world = worldRef.current, hero = heroRef.current, stage = stageRef.current, chip = chipRef.current;
    if (!world || !hero || !stage || !g || !plan) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // the tiles' own elements: only without WebGL, where each tile draws itself
    const els = Array.from(world.querySelectorAll<HTMLElement>('[data-slot]'));
    const nt = plan.slots.length;
    let alive = true;

    /* ── the renderer ── */
    // WebGL on the page (with a graphics card), WebGL in a worker (on the processor), or a canvas in each tile
    let glr: DrumGL | null = null;
    let glw: GlWorker | null = null;
    let glc: HTMLCanvasElement | null = null;
    const budget = glBudget(window.innerWidth >= 760);
    if (useGl) {
      const c = glCanvas();
      glr = createDrumGL(c, { onLost: () => { if (alive) setUseGl(false); }, budget });
      if (glr) glc = c;
      else if ((glw = glWorker())) {
        try {
          const c2 = glCanvas();
          const off = c2.transferControlToOffscreen();
          glw.send({ t: 'init', canvas: off, budget }, [off]);
          glc = c2;
          // a new canvas there: reels' frames from an earlier drum are gone with the old one
          for (const id of glw.films) glw.have.delete(id);
        } catch { glw = null; }
      }
      if (!glc) { setUseGl(false); return; }
      stage.insertBefore(glc, world);
    }
    const gpu = !!(glr || glw);
    if (glw) glw.on = (m) => {
      if (!alive) return;
      if (m.t === 'fail' || m.t === 'lost') setUseGl(false);
      else if (m.t === 'have') {
        // a picture's fade starts once it is there
        const now = performance.now();
        for (let i = 0; i < nt; i++) if (pids[i] === m.id && Number.isNaN(tiles[i].fadeAt)) tiles[i].fadeAt = now;
        kick();
      }
    };

    // without WebGL, a worker draws the tiles' canvases, off the main thread
    let tileWorker: Worker | null = null;
    if (!gpu && OFFSCREEN_TILES) {
      try { tileWorker = new Worker(new URL('./tile-worker.ts', import.meta.url), { type: 'module' }); } catch { tileWorker = null; }
    }
    const handOver: { i: number; canvas: OffscreenCanvas }[] = [];

    /* ── pictures ── */
    type Tile = {
      i: number; el: HTMLElement | null; cv: HTMLCanvasElement | null; it: Item; spec?: Spec; asked: boolean;
      pic?: HTMLImageElement; lq?: HTMLImageElement; video?: HTMLVideoElement; played: boolean;
      drawn: number; on: boolean; hiddenAt: number; fadeAt: number; fresh: boolean; copiedAt: number; offscreen: boolean;
      url?: string; // the worker's copy of the picture (its still, for a reel)
    };
    const t0 = performance.now();
    const tiles: Tile[] = plan.slots.map((sl, i) => {
      const it = pool[sl.item];
      const el = els[i] ?? null;
      const cv = el?.querySelector('canvas') ?? null;
      let offscreen = false;
      if (cv) {
        try {
          // start each canvas empty, as a new <img> started
          cv.width = 0; cv.height = 0;
          cv.style.opacity = it.video || it.src.startsWith('/hero/') ? '1' : '0';
          if (tileWorker) {
            handOver.push({ i, canvas: cv.transferControlToOffscreen() });
            offscreen = true;
          }
        } catch { /* a canvas already handed over (fresh ones come with each build) */ }
      }
      return { i, el, cv, it, asked: false, played: false, drawn: 0, on: false, hiddenAt: t0, fadeAt: -Infinity, fresh: false, copiedAt: 0, offscreen };
    });
    if (tileWorker && handOver.length) tileWorker.postMessage({ t: 'add', list: handOver }, handOver.map((h) => h.canvas));
    const dprNow = () => window.devicePixelRatio || 1;
    // what a tile handed to the worker shows: the reel's current frame, its picture, or its soft preview
    // returns what was sent (a film with no frame to give falls back to its still)
    const toWorker = (t: Tile, level: number): number => {
      if (!tileWorker) return 0;
      if (level === 3) {
        try {
          const f = new VideoFrame(t.video!);
          tileWorker.postMessage({ t: 'frame', i: t.i, frame: f }, [f]);
          return 3;
        } catch { level = t.url ? 2 : 0; }
      }
      const url = level === 2 ? t.url : level === 1 ? t.spec?.lq : undefined;
      if (!url) return 0;
      tileWorker.postMessage({ t: 'show', i: t.i, url, level, tw: g.W, th: plan.slots[t.i].h, dpr: dprNow() });
      return level;
    };
    // 3: a reel's frame, 2: the picture (or a reel's still), 1: the soft preview
    const best = (t: Tile) => (t.video && t.played && t.video.readyState >= 2 ? 3
      : t.offscreen ? (t.url ? 2 : t.asked && t.spec?.lq ? 1 : 0)
      : t.pic ? 2 : t.lq ? 1 : 0);
    const draw = (t: Tile) => {
      const level = best(t);
      if (!t.cv || level <= t.drawn) return;
      if (t.offscreen) { t.drawn = toWorker(t, level); return; }
      const src = level === 3 ? t.video! : level === 2 ? t.pic! : t.lq!;
      const sl = plan.slots[t.i];
      if (paint(t.cv, src, g.W, sl.h, !t.it.video)) t.drawn = level;
    };
    // pictures report their real shape as they load; re-stack (once per frame at
    // most) only when it differs from the shape the tile was given (hero-shapes.ts)
    let restackQueued = false;
    const measured = (t: Tile, r: number) => {
      const known = RATIO.get(t.it.src) ?? t.it.ratio;
      // a copy's size is rounded, so a known shape within a pixel of the measured one is the same picture
      if (!r || (known && Math.abs(g.W / known - g.W / r) < 1.5)) return;
      RATIO.set(t.it.src, r);
      if (!restackQueued) { restackQueued = true; requestAnimationFrame(() => { restackQueued = false; if (alive) { restack(g, plan, pool, els); if (!gpu) tiles.forEach((x) => { if (x.drawn === 2) { x.drawn = 1; if (x.on) draw(x); } }); kick(); } }); }
    };
    // WebGL in a worker: a picture is asked for there once its copy is known, so it is decoded before its tile comes round
    const need = () => Math.round(g.W * dprNow() * 1.35);
    const toGl = (w: GlWorker, key: string, url: string, shrink: boolean) => {
      const id = glId(w, key);
      if (!w.asked.has(id)) { w.asked.add(id); w.send({ t: 'pic', id, url, need: shrink ? need() : 0 }); }
      return id;
    };
    const pids = new Int32Array(nt).fill(-1), qids = new Int32Array(nt).fill(-1);
    let settled: (i: number) => void = () => {};
    const ask = (i: number, low: boolean) => {
      const t = tiles[i];
      if (t.asked) return;
      t.asked = true;
      const spec = (t.spec = specFor(t.it, g, stillsRef.current[t.it.full] ?? t.it.src));
      if (glw) {
        const w = glw;
        if (spec.lq) qids[i] = toGl(w, `q:${spec.lq}`, spec.lq, false);
        pickedCopy(spec.pic, low).then(({ url, ratio }) => {
          if (!alive || t.spec !== spec) return;
          t.url = url;
          const id = (pids[i] = toGl(w, `p:${url}`, url, true));
          // the same 0.5 s fade the <img> had, from when the picture is there; one decoded already shows at once
          t.fadeAt = !spec.fade || w.have.has(id) ? -Infinity : NaN;
          if (!t.it.video && ratio) measured(t, ratio);
          kick();
          settled(i);
        }, () => { if (alive && t.spec === spec) settled(i); });
        return;
      }
      if (t.offscreen) {
        // the worker fetches and decodes; here only the copy's address and shape are needed
        pickedCopy(spec.pic, low).then(({ url, ratio }) => {
          if (!alive || t.spec !== spec) return;
          t.url = url;
          if (spec.fade && t.cv) t.cv.style.opacity = '1';
          if (!t.it.video && ratio) measured(t, ratio);
          if (t.on) { draw(t); kick(); }
          settled(i);
        }, () => { if (alive && t.spec === spec) settled(i); });
        if (spec.lq && t.on) { draw(t); kick(); }
        return;
      }
      // read in CORS mode where the picture is handed on (to WebGL)
      const cors = !!glr;
      const cached = pictureReady(spec.pic, cors);
      if (spec.lq) picture({ src: spec.lq }, low, cors).then((im) => { if (alive && t.spec === spec) { t.lq = im; if (t.on) { draw(t); kick(); } } }, () => {});
      picture(spec.pic, low, cors).then((im) => {
        if (!alive || t.spec !== spec) return;
        t.pic = im;
        // the same 0.5 s fade the <img> had; a picture already in memory shows at once, as a cached <img> did
        if (spec.fade) {
          t.fadeAt = cached ? -Infinity : performance.now();
          if (t.cv) t.cv.style.opacity = '1';
        }
        if (!t.it.video) measured(t, im.naturalWidth / im.naturalHeight);
        if (t.on) { draw(t); kick(); }
        settled(i);
      }, () => { if (alive && t.spec === spec) settled(i); });
    };
    restillRef.current = () => tiles.forEach((t, i) => {
      if (!t.it.video || !t.asked || t.played || !t.spec) return;
      const next = specFor(t.it, g, stillsRef.current[t.it.full] ?? t.it.src);
      if (next.pic.src === t.spec.pic.src) return;
      t.asked = false; t.pic = undefined; t.url = undefined; t.drawn = 0; pids[i] = -1;
      if (t.cv) { t.cv.width = 0; t.cv.height = 0; }
      ask(i, false);
    });
    const loadRest = () => {
      if (restRef.current && tiles.every((t) => t.asked)) return;
      restRef.current = true;
      tiles.forEach((_, i) => ask(i, !!firstView && !firstView.has(i) && !soonView?.has(i)));
    };
    let restTimer = 0, restCap = 0;
    const onPageLoad = () => soon();
    const soon = () => { if (!restTimer) restTimer = window.setTimeout(loadRest, Math.max(300, 2000 - (performance.now() - t0))); };
    if (!firstView || restRef.current) loadRest();
    else {
      // done when every first-view picture has arrived (or failed); the opening takes ~1.8 s
      let pending = firstView.size;
      settled = (i) => { if (firstView.has(i) && --pending === 0) soon(); };
      firstView.forEach((i) => ask(i, false));
      if (!pending) soon();
      if (document.readyState === 'complete') soon(); else window.addEventListener('load', onPageLoad, { once: true });
      restCap = window.setTimeout(loadRest, 8000); // never longer than this
    }
    // the drum has asked for its first pictures: the rest of the home page may load now
    startedNow?.();

    /* reels: a video outside the page plays into its tile's canvas */
    const hasFrameCallback = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
    // WebGL in a worker: a reel's current frame goes there as it is, with no copy made here;
    // drawn by the processor there, about 15 a second is plenty for a small tile
    const fids = new Int32Array(nt).fill(-1);
    const filmAt = new Float64Array(nt);
    const film = (t: Tile) => {
      const w = glw!, now = performance.now();
      if (now - filmAt[t.i] < 64 && fids[t.i] >= 0 && w.have.has(fids[t.i])) return;
      filmAt[t.i] = now;
      try {
        const f = new VideoFrame(t.video!);
        let id = fids[t.i];
        if (id < 0) { id = fids[t.i] = glId(w, `v:${t.i}`); w.films.add(id); }
        w.send({ t: 'film', id, frame: f }, [f]);
      } catch { /* no frame to give yet */ }
    };
    const reel = (t: Tile) => {
      if (t.video) return t.video;
      const v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'none';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      if (gpu || t.offscreen) v.crossOrigin = 'anonymous'; // WebGL (or the worker) reads its frames
      v.src = t.it.video!;
      // one frame callback at a time: "playing" also fires after every stall
      let waiting = false;
      // without a graphics card each frame is copied by the processor: about 15 a second is plenty for a small tile
      let copied = 0;
      const frame = () => {
        waiting = false;
        if (!alive || t.video !== v) return;
        t.played = true;
        if (glr) t.fresh = true;
        else if (glw) { if (t.on) film(t); }
        else if (t.offscreen) { if (t.on) t.drawn = Math.max(t.drawn, toWorker(t, 3)); else t.drawn = Math.min(t.drawn, 2); }
        else {
          const now = performance.now();
          if (t.on && t.cv && (t.drawn < 3 || now - copied >= 64)) { if (paint(t.cv, v, g.W, plan.slots[t.i].h, false)) { t.drawn = 3; copied = now; } }
          else if (!t.on) t.drawn = Math.min(t.drawn, 2);
        }
        if (hasFrameCallback && !v.paused) { waiting = true; v.requestVideoFrameCallback(frame); }
      };
      v.addEventListener('playing', () => { if (!hasFrameCallback) frame(); else if (!waiting) { waiting = true; v.requestVideoFrameCallback(frame); } });
      return (t.video = v);
    };

    /* ── frame loop ── */
    let stageW = 0, stageH = 0, heroTop = 0, stageLeft = 0, stageTop = 0;
    // scroll position and screen height, kept from their own events: reading them
    // inside the frame forced a layout whenever something else had just changed
    let scrollY = window.scrollY, viewH = window.innerHeight;
    const onStageResize = () => {
      const r = stage.getBoundingClientRect();
      stageW = r.width; stageH = r.height; viewH = window.innerHeight; scrollY = window.scrollY;
      stageLeft = r.left; stageTop = r.top + scrollY; // in the page, as the hero scrolls with it
      heroTop = hero.getBoundingClientRect().top + scrollY;
      const dpr = dprNow();
      glr?.resize(stageW, stageH, dpr);
      glw?.send({ t: 'size', w: stageW, h: stageH, dpr });
      kick();
    };
    window.addEventListener('resize', onStageResize);
    const lift = new Float32Array(nt);
    // where each tile on the stage was last drawn (across, down, depth, turn): the pointer is matched to these
    const at = new Float32Array(nt * 4);
    const start = performance.now();
    let prev = start, raf = 0;
    // state, named as on the reference where it helps
    let spin = 0, vel = 0, A = 1, sway = 0, drift = 0;
    let N = 0, Py = 0, F = 0, se = 0, I = 0;
    let q = 0, hovered = -1, dragging = false, inView = true;
    const off = () => reduced || pausedRef.current;
    const hide = (i: number, now: number) => {
      const t = tiles[i];
      if (t.on) { t.on = false; t.hiddenAt = now; if (t.el) t.el.style.visibility = 'hidden'; }
      else if (t.cv && t.drawn && now - t.hiddenAt > RELEASE_MS) {
        if (t.offscreen) tileWorker?.postMessage({ t: 'clear', i: t.i }); else { t.cv.width = 0; t.cv.height = 0; }
        t.drawn = 0;
      }
      const v = t.video; if (v && !v.paused) v.pause();
    };

    // WebGL: what each tile shows now, uploaded as needed (a few pictures a frame, so no frame stalls)
    const dpr = window.devicePixelRatio || 1;
    const scratch = document.createElement('canvas');
    let uploads = 0, behind = false;
    // a picture WebGL may not read (a site that sends no CORS header) stays empty instead of stopping the drum
    const bad = new WeakSet<HTMLImageElement>();
    const shownKey = (t: Tile): string | null => {
      try { return shownKeyOf(t); } catch { if (t.pic) bad.add(t.pic); return null; }
    };
    const shownKeyOf = (t: Tile): string | null => {
      const v = t.video;
      if (v && t.played && v.readyState >= 2 && v.videoWidth) {
        const k = `v:${t.i}`;
        if (t.fresh || !glr!.has(k)) { glr!.upload(k, v, v.videoWidth, v.videoHeight, false); t.fresh = false; }
        return k;
      }
      if (t.pic && !bad.has(t.pic)) {
        const k = `p:${t.pic.src}`;
        if (glr!.has(k)) return k;
        if (uploads < 4) {
          const im = t.pic, need = g.W * dpr * 1.35;
          // a copy larger than the tile ever shows is scaled down first (with the browser's best smoothing):
          // the drum never shows a tile much past its own size, and the graphics memory goes further
          const shrink = im.naturalWidth > need * 1.1;
          uploads += shrink ? 2 : 1;
          if (shrink) {
            scratch.width = Math.round(need); scratch.height = Math.max(1, Math.round((need * im.naturalHeight) / im.naturalWidth));
            const x = scratch.getContext('2d')!;
            x.imageSmoothingQuality = 'high';
            x.drawImage(im, 0, 0, scratch.width, scratch.height);
            glr!.upload(k, scratch, scratch.width, scratch.height, true);
          } else glr!.upload(k, im, im.naturalWidth, im.naturalHeight, true);
          return k;
        }
        behind = true;
      }
      if (t.lq) {
        const k = `q:${t.lq.src}`;
        if (!glr!.has(k)) glr!.upload(k, t.lq, t.lq.naturalWidth, t.lq.naturalHeight, false);
        return k;
      }
      return null;
    };
    const draws: Draw[] = [];
    // WebGL in a worker: per tile on the stage, what it may show (best first) and where (STRIDE numbers)
    const wbuf = new Float32Array(nt * STRIDE);
    let stageOpacity = '';

    const tick = (now: number) => {
      raf = 0;
      uploads = 0; behind = false; draws.length = 0;
      let k = 0;
      let fading = false;
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
      const motionOff = off();
      // scroll intro: 0 at the top, 1 once scrolled 90% of a screen
      const qt = clamp((scrollY - heroTop) / (viewH * 0.9));
      q = reduced ? qt : q + (qt - q) * (1 - Math.exp(-dt / 0.1));
      A += ((dragging ? 0 : hovered >= 0 ? 0.35 : 1) - A) * (1 - 0.05 ** dt);
      vel *= 0.04 ** dt;
      const swayT = !motionOff && Math.abs(I) > 0.78 ? Math.sign(I) * 14 * Math.min(1, (Math.abs(I) - 0.78) / 0.2) : 0;
      sway += (swayT - sway) * (1 - 0.05 ** dt);
      spin += ((motionOff ? 0 : 7) * A + vel + sway) * dt;
      if (!motionOff) drift += 22 * A * dt;
      const r = 1 - 0.0004 ** dt;
      N += ((motionOff ? 0 : F) - N) * r; Py += ((motionOff ? 0 : se) - Py) * r;
      // the vanishing point moves with the pointer (the tiles' own elements: the world's perspective-origin)
      const oy = (Py * 9 / 100) * stageH;
      if (!gpu) world.style.perspectiveOrigin = `50% ${(50 + Py * 9).toFixed(2)}%`;

      const o = spin - N, py = -Py * 70;
      const v = clamp((q - Math.min(1, g.R / 900) * 0.3) / 0.7), open = smooth(v);
      const n = (now - start) / 1000;
      const yGate = g.mobile ? 0 : (1000 * g.R) / 900;
      for (let i = 0; i < nt; i++) {
        const sl = plan.slots[i], col = plan.cols[sl.col], t = tiles[i];
        const s = ((col.phi + o) % 360 + 540) % 360 - 180;
        let shown = Math.abs(s) <= 82 && q < 1;
        const th = (s * Math.PI) / 180;
        let u = g.R * Math.sin(th);
        const z = g.Z - g.R * Math.cos(th);
        let l = ((sl.y + col.off - drift) % col.L + col.L) % col.L - col.L / 2 + sl.h / 2 + py;
        if (Math.abs(l) > (g.mobile ? col.L / 2 + 200 : yGate)) shown = false;
        if (!shown) { hide(i, now); continue; }
        // reveal on load, from the middle outward
        const rev = reduced ? 1 : 1 - (1 - clamp((n - 0.1 - (Math.abs(s) / 90) * 0.9) / 0.9)) ** 3;
        lift[i] += (+(i === hovered && q < 0.2) - lift[i]) * (1 - 0.001 ** dt);
        // opening: push outward from the centre on screen
        const a = g.P / (g.P - z);
        const push = ((Math.max(0, Math.hypot(u * a, l * a) / 1.7 - g.R) + 250) / a) * open;
        const len = Math.hypot(u, l) || 1;
        u += (u / len) * push; l += (l / len) * push;
        const d = z - (1 - rev) * 500 + 160 * open + lift[i] * 70;
        const f = rev * Math.min(1, (g.P * 0.7 - d) / 250) * (1 - open);
        // not revealed yet (or faded out by the opening): invisible anyway, so skip it
        if (f <= 0.001) { hide(i, now); continue; }
        // Much of the facing half is outside the stage and clipped away anyway
        // (two thirds on a phone, half on a desktop): hide those tiles instead
        // of moving them every frame. Each side edge is projected at its own
        // depth (the tile turns by s), and the vertical test uses the far edge,
        // which sits closest to the middle; the margin covers the pointer's
        // tilt of the vanishing point.
        if (offStage(u, l, d, s, g.W, sl.h, g.P, stageW / 2 + 60, stageH / 2 + 60)) { hide(i, now); continue; }
        if (!t.on) { t.on = true; if (t.el) t.el.style.visibility = 'visible'; }
        at[i * 4] = u; at[i * 4 + 1] = l; at[i * 4 + 2] = d; at[i * 4 + 3] = s;
        if (glr) {
          const key = shownKey(t);
          if (key) {
            let a = Math.max(0, f);
            if (t.spec?.fade) {
              const k = ease((now - t.fadeAt) / FADE_MS);
              if (k < 1) fading = true;
              a *= key.startsWith('p:') ? k : 1;
            }
            draws.push({ key, u, l, d, s, w: g.W, h: sl.h, alpha: a });
          }
        } else if (glw) {
          // what the worker has: the reel's frame, the picture, the soft preview
          const b = k * STRIDE, has = glw.have;
          const fid = t.played ? fids[i] : -1, pid = pids[i], qid = qids[i];
          wbuf[b] = fid >= 0 && has.has(fid) ? fid : -1;
          wbuf[b + 1] = pid >= 0 && has.has(pid) ? pid : -1;
          wbuf[b + 2] = qid >= 0 && has.has(qid) ? qid : -1;
          if (wbuf[b] >= 0 || wbuf[b + 1] >= 0 || wbuf[b + 2] >= 0) {
            let fade = 1;
            if (t.spec?.fade && wbuf[b + 1] >= 0) { fade = ease((now - t.fadeAt) / FADE_MS); if (fade < 1) fading = true; }
            wbuf[b + 3] = u; wbuf[b + 4] = l; wbuf[b + 5] = d; wbuf[b + 6] = s;
            wbuf[b + 7] = g.W; wbuf[b + 8] = sl.h; wbuf[b + 9] = Math.max(0, f); wbuf[b + 10] = fade;
            k++;
          }
        } else {
          // each tile draws itself: its own element moves
          const el = t.el!;
          el.style.transform = `translate3d(${(u - g.W / 2).toFixed(1)}px,${(l - sl.h / 2).toFixed(1)}px,${d.toFixed(1)}px) rotateY(${(-s).toFixed(2)}deg)`;
          if (t.drawn < best(t)) draw(t);
          el.style.opacity = Math.max(0, f).toFixed(3);
        }
        // reels play while they face you and are on screen (on a phone, once the first pictures are in)
        if (t.it.video) {
          const want = !motionOff && f > 0.4 && Math.abs(s) < 70 && (!g.mobile || restRef.current); // off-stage tiles never get here
          const vid = want ? reel(t) : t.video;
          if (vid) {
            if (want && vid.paused) { if (vid.preload !== 'auto') vid.preload = 'auto'; vid.play().catch(() => {}); }
            else if (!want && !vid.paused) vid.pause();
            // without frame callbacks the loop copies the frame itself
            if (!hasFrameCallback && !vid.paused && vid.readyState >= 2) {
              t.played = true;
              if (glr) t.fresh = true;
              else if (t.offscreen) t.drawn = Math.max(t.drawn, toWorker(t, 3));
              else if (t.cv && (t.drawn < 3 || now - t.copiedAt >= 64) && paint(t.cv, vid, g.W, sl.h, false)) { t.drawn = 3; t.copiedAt = now; }
            }
          }
        }
      }
      if (glr) glr.frame(draws, oy, g.P);
      else if (glw) {
        const buf = wbuf.slice(0, k * STRIDE);
        glw.send({ t: 'draw', buf, n: k, oy, P: g.P }, [buf.buffer]);
      }
      const so = (1 - smooth(clamp((q - 0.45) / 0.4))).toFixed(3);
      if (so !== stageOpacity) { stageOpacity = so; stage.style.opacity = so; }
      const settling = Math.abs(vel) > 0.01 || Math.abs(qt - q) > 0.001 || n < 2.5 || fading || behind;
      if (inView && (!motionOff || dragging || settling || hovered >= 0)) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick); } };
    const onScroll = () => { scrollY = window.scrollY; kick(); };

    /*
     * The pointer and the tiles: matched with the geometry the tiles were
     * drawn with (each tile's own element no longer moves), the way the
     * browser matched the moving elements: the tile under the pointer, on the
     * stage only, the last in page order where two meet.
     */
    const hitAt = (cx: number, cy: number) => {
      const px = cx - stageLeft - stageW / 2, py = cy - (stageTop - scrollY) - stageH / 2;
      if (Math.abs(px) > stageW / 2 || Math.abs(py) > stageH / 2) return -1;
      const P = g.P, oy = (Py * 9 / 100) * stageH;
      let found = -1;
      for (let i = 0; i < nt; i++) {
        if (!tiles[i].on) continue;
        const u = at[i * 4], l = at[i * 4 + 1], d = at[i * 4 + 2], th = (at[i * 4 + 3] * Math.PI) / 180;
        const c = Math.cos(th), sn = Math.sin(th);
        // a point x across the tile sits at (u + x cos, d + x sin) and shows at x' = (u + x cos) P / (P - depth)
        const den = P * c + px * sn;
        if (Math.abs(den) < 1e-6) continue;
        const x = (px * (P - d) - P * u) / den;
        if (Math.abs(x) > g.W / 2) continue;
        const z = d + x * sn;
        if (z >= P) continue;
        // and a point y down it at oy + (y - oy) P / (P - depth)
        const y = oy + ((py - oy) * (P - z)) / P - l;
        if (Math.abs(y) > plan.slots[i].h / 2) continue;
        found = i;
      }
      return found;
    };
    const labelOf = (i: number) => brandName(pool[plan.slots[i].item].brand, kaRef.current);
    // a mouse over the drum (touch has no hover)
    let mouseOver = false;
    // as with the tiles' own elements, what the pointer points at is worked out when it moves (or lands), not every frame
    const setHover = (i: number, cx: number, cy: number) => {
      if (i === hovered) return;
      hovered = i;
      world.classList.toggle('cursor-pointer', i >= 0);
      if (chip) {
        if (i >= 0) { chip.textContent = labelOf(i); chip.style.opacity = '1'; chip.style.transform = `translate(${cx + 14}px, ${cy + 14}px)`; }
        else chip.style.opacity = '0';
      }
      kick();
    };

    // pointer: look around
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        I = (e.clientX / window.innerWidth) * 2 - 1;
        F = I * 24;
        se = (e.clientY / window.innerHeight) * 2 - 1;
        if (mouseOver) setHover(hitAt(e.clientX, e.clientY), e.clientX, e.clientY);
        if (chip && hovered >= 0) chip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`;
      }
      if (down) {
        const dx = e.clientX - down.x;
        if (!dragging && Math.abs(dx) > 6) { dragging = true; world.classList.add('cursor-grabbing'); }
        if (dragging) {
          const step = e.clientX - down.last;
          down.last = e.clientX;
          spin += step * 0.09;
          vel += (step * 6 - vel) * (e.pointerType === 'touch' ? 0.35 : 1);
        }
      }
      kick();
    };
    // drag to spin, tap to open
    let down: { x: number; y: number; last: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, last: e.clientX, t: performance.now() };
      // a finger points at a tile while it is down, as it did at the tile's own element
      if (e.pointerType === 'touch') setHover(hitAt(e.clientX, e.clientY), e.clientX, e.clientY);
      if (g.mobile && !restRef.current) loadRest(); // spinning by hand brings the rest round
    };
    /*
     * A tap opens the picture on its click, not on the finger lifting: on a
     * touch screen the click comes a moment after, and it used to land on the
     * picture that had just opened, closing it again at once.
     */
    let tapped: number | null = null, tapTimer = 0;
    const openTapped = () => { clearTimeout(tapTimer); if (tapped !== null) { const i = tapped; tapped = null; setOpen(i); } };
    const onUp = (e: PointerEvent) => {
      const d = down; down = null;
      const wasDrag = dragging;
      dragging = false; world.classList.remove('cursor-grabbing');
      if (!d || wasDrag || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 700) return;
      // on the drum, not on something over it (the button in the middle, the pause)
      const top = document.elementFromPoint(e.clientX, e.clientY);
      if (!top || !world.contains(top)) return;
      const i = hitAt(e.clientX, e.clientY);
      if (i < 0) return;
      tapped = plan.slots[i].item;
      // no click follows (the browser judged it a scroll): open anyway
      clearTimeout(tapTimer); tapTimer = window.setTimeout(openTapped, 400);
    };
    const onClick = () => openTapped();
    const onWheel = (e: WheelEvent) => {
      if (reduced || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      vel -= e.deltaX * 0.9; e.preventDefault(); kick();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouseOver = true;
      setHover(hitAt(e.clientX, e.clientY), e.clientX, e.clientY);
    };
    const onLeave = () => { mouseOver = false; setHover(-1, 0, 0); I = 0; kick(); };
    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView) kick(); });
    io.observe(hero);
    window.addEventListener('pointermove', onMove);
    world.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    world.addEventListener('click', onClick);
    world.addEventListener('pointerenter', onEnter);
    world.addEventListener('pointerleave', onLeave);
    world.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    onStageResize();
    kick();
    return () => {
      alive = false;
      glr?.destroy();
      if (glw) { glw.on = null; glw.send({ t: 'stop' }); }
      glc?.remove();
      cancelAnimationFrame(raf); io.disconnect();
      clearTimeout(restTimer); clearTimeout(restCap);
      window.removeEventListener('load', onPageLoad);
      window.removeEventListener('pointermove', onMove);
      world.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      world.removeEventListener('click', onClick);
      clearTimeout(tapTimer);
      world.removeEventListener('pointerenter', onEnter);
      world.removeEventListener('pointerleave', onLeave);
      world.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onStageResize);
      restillRef.current = null;
      // let the reels go: no decoder or download is kept for a drum that is gone
      tiles.forEach((t) => { const v = t.video; if (v) { v.pause(); v.removeAttribute('src'); v.load(); } });
      tileWorker?.terminate();
    };
  }, [g, plan, pool, firstView, soonView, useGl]);

  // restart the loop when motion is switched back on
  useEffect(() => { window.dispatchEvent(new Event('scroll')); }, [paused]);

  /*
   * The tiles' own elements: only without WebGL, where each tile draws itself
   * into its own canvas and moves. With WebGL nothing but the drum's canvas
   * changes from frame to frame. Built once per drum (and language), so
   * nothing else re-renders ~300 of them. The pointer finds the tiles by
   * their geometry either way, so they let it through.
   */
  const build = useMemo(() => ++BUILDS, [plan]);
  const tileEls = useMemo(() => !useGl && g && plan && plan.slots.map((sl, i) => {
    const it = pool[sl.item];
    return (
      <div
        key={i}
        data-slot=""
        data-item={sl.item}
        data-label={brandName(it.brand, ka)}
        data-src={it.src}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 block overflow-hidden rounded-[10px] will-change-transform"
        style={{ width: g.W, height: sl.h, visibility: 'hidden', opacity: 0 }}
      >
        <canvas
          key={build}
          width={0} height={0} aria-hidden
          className="pointer-events-none block h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: it.video || it.src.startsWith('/hero/') ? 1 : 0, filter: it.video || !GRADE_ON_CANVAS ? GRADE : undefined }}
        />
      </div>
    );
  }), [g, plan, pool, ka, useGl, build]);

  return (
    <section ref={heroRef} aria-label={tx('Selected work, moving canvas', 'ნამუშევრები, მოძრავი კანვასი')} className="relative h-[100svh] min-h-[560px]">
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-white">
        {/* on a phone the drum sits between the top pills and the bottom dock, so neither covers it */}
        <div ref={stageRef} className="absolute inset-x-0 top-[68px] bottom-[108px] overflow-hidden sm:inset-0">
          <div ref={worldRef} className="absolute inset-0 select-none cursor-default" style={{ perspective: g ? `${g.P}px` : '1100px', touchAction: 'pan-y' }}>
            {tileEls}
          </div>

        </div>

        {/* the brand under the pointer */}
        <div ref={chipRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-20 rounded-full bg-[#111] px-3 py-1 text-[12px] text-white opacity-0 transition-opacity duration-150 whitespace-nowrap" />


        {/* keyboard and screen readers get a plain list of the work */}
        <ul className="sr-only">
          {plain.slice(0, 24).map((it, i) => (
            <li key={i}><button type="button" onClick={() => setOpen(pool.indexOf(it))}>{tx('Open', 'გახსენი')} {brandName(it.brand, ka)}</button></li>
          ))}
        </ul>
        <h1 className="sr-only">{tx('Salome Mosiava, Senior Product Designer and Art Director', 'სალომე მოსიავა, სენიორ პროდაქტ დიზაინერი და არტ დირექტორი')}</h1>
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"><CtaLink /></div>
        <PauseButton className="absolute right-3 top-3 sm:right-auto sm:top-auto sm:left-2 sm:bottom-24 z-10" />
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block rounded-md bg-white/80 px-3 py-1.5 text-[13px] text-[#6e6e6e] backdrop-blur-md whitespace-nowrap">
          <span className="hidden sm:inline">{tx('Move to look around, click to open', 'კურსორით დაათვალიერე, დააჭირე გასახსნელად')}</span>
          <span className="sm:hidden">{tx('Swipe to spin, tap to open', 'გაასრიალე, დააჭირე გასახსნელად')}</span>
        </div>
      </div>

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
