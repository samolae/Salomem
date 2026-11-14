import { useEffect, useMemo, useRef, useState } from 'react';
import { IMG } from '../lib/cld';
import { adsBrands, motionReels } from './data';
import { spotlights } from './content';
import { useMotionPause, PauseButton } from './shell';
import { CtaLink, Lightbox, type LightboxItem } from './ui';
import { brandName, useI18n } from './i18n';

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

function usePool(): Item[] {
  return useMemo(() => {
    const ads: Item[] = adsBrands.flatMap((b) =>
      b.items.filter((it) => it.type === 'image' && !it.fullWidth).map((it) => ({ src: it.src, full: it.src, brand: b.name, logo: b.logoImg }))
    );
    const spots: Item[] = spotlights.map((s) => ({ src: s.img, full: s.img, brand: s.title }));
    const frames: Item[] = motionReels.map((r, i) => ({
      src: videoFrame(r.src, i % 2 ? '35p' : '60p', 600), full: r.src, fullVideo: true, brand: r.brand, logo: (r as { logoImg?: string }).logoImg,
      video: smallVideo(r.src), ratio: 9 / 16,
    }));
    const cases: Item[] = CASE_SHOTS.map(([d, n, r]) => ({
      src: `/hero/${d}-${n}.jpg`, full: `/cases/${d}/${n}.jpg`, brand: CASE_BRAND[d], ratio: r,
    }));
    // interleave so neighbours differ in kind, each kind in a new order every visit
    const out: Item[] = [];
    const lists = [shuffle(ads), shuffle(cases), shuffle(frames), shuffle(spots)];
    for (let k = 0, added = true; added; k++) {
      added = false;
      for (const l of lists) {
        const take = l === lists[0] || l === lists[1] ? [l[k * 2], l[k * 2 + 1]] : [l[k]];
        for (const t of take) if (t) { out.push(t); added = true; }
      }
    }
    return out;
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
    const reels = [...new Set(pool.filter((p) => p.video && p.fullVideo).map((p) => p.full))];
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

export function HeroCanvas() {
  const { tx, ka } = useI18n();
  const pool = usePool();
  const stills = useLiveStills(pool);
  const [open, setOpen] = useState<number | null>(null);
  const lightbox: LightboxItem[] = useMemo(() => pool.map((t) => ({
    src: t.full, video: t.fullVideo, alt: brandName(t.brand, ka), brand: brandName(t.brand, ka), logo: t.logo,
  })), [pool, ka]);
  const { paused } = useMotionPause();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const heroRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<Geo | null>(null);
  const [plan, setPlan] = useState<ReturnType<typeof layout> | null>(null);

  /*
   * On a phone only a handful of tiles face the screen at once, yet the
   * drum holds ~300. The tiles on screen now (or within the next few
   * seconds of spin and drift) load first; the rest follow once those
   * pictures are in (or the page has loaded, or on the first drag,
   * whichever comes first). Desktop keeps the browser's own lazy loading.
   */
  const [rest, setRest] = useState(false);
  const restRef = useRef(rest);
  restRef.current = rest;
  const firstView = useMemo(() => (g && plan && g.mobile ? onScreenAtStart(g, plan) : null), [g, plan]);
  const soonView = useMemo(() => (g && plan && g.mobile ? arrivingSoon(plan) : null), [g, plan]);
  useEffect(() => {
    const world = worldRef.current;
    if (!g?.mobile || rest || !world || !firstView) return;
    let t = 0;
    const go = () => setRest(true);
    const soon = () => { if (!t) t = window.setTimeout(go, 300); };
    // done when every first-view picture has arrived (or failed)
    const check = () => {
      const tiles = world.querySelectorAll<HTMLElement>('[data-slot]');
      for (const i of firstView) { const im = tiles[i]?.querySelector('img'); if (im && !im.complete) return; }
      soon();
    };
    world.addEventListener('load', check, true);
    world.addEventListener('error', check, true);
    const raf = requestAnimationFrame(check);
    if (document.readyState === 'complete') soon(); else window.addEventListener('load', soon, { once: true });
    const cap = window.setTimeout(go, 8000); // never longer than this
    return () => {
      world.removeEventListener('load', check, true); world.removeEventListener('error', check, true);
      window.removeEventListener('load', soon); cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(cap);
    };
  }, [g, rest, firstView]);

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

  // the frame loop
  useEffect(() => {
    const world = worldRef.current, hero = heroRef.current, stage = stageRef.current, chip = chipRef.current;
    if (!world || !hero || !stage || !g || !plan) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(world.querySelectorAll<HTMLElement>('[data-slot]'));
    const vids = els.map((e) => e.querySelector('video'));
    // pictures report their real shape as they load; re-stack once per frame at most
    let restackQueued = false;
    const onLoad = (e: Event) => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLImageElement) || !t.naturalWidth) return;
      const key = t.closest<HTMLElement>('[data-slot]')?.dataset.src;
      if (!key) return;
      const r = t.naturalWidth / t.naturalHeight;
      if (Math.abs((RATIO.get(key) ?? 0) - r) < 0.01) return;
      RATIO.set(key, r);
      if (!restackQueued) { restackQueued = true; requestAnimationFrame(() => { restackQueued = false; restack(g, plan, pool, els); kick(); }); }
    };
    world.addEventListener('load', onLoad, true);
    // anything already loaded before the listener
    els.forEach((el) => { const im = el.querySelector('img'); if (im?.complete && im.naturalWidth) onLoad({ target: im } as unknown as Event); });
    let stageW = stage.clientWidth, stageH = stage.clientHeight;
    const onStageResize = () => { stageW = stage.clientWidth; stageH = stage.clientHeight; };
    window.addEventListener('resize', onStageResize);
    const lift = new Float32Array(els.length);
    const start = performance.now();
    let prev = start, raf = 0;
    // state, named as on the reference where it helps
    let spin = 0, vel = 0, A = 1, sway = 0, drift = 0;
    let N = 0, Py = 0, F = 0, se = 0, I = 0;
    let q = 0, hovered = -1, dragging = false, inView = true;
    const off = () => reduced || pausedRef.current;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
      const motionOff = off();
      // scroll intro: 0 at the top, 1 once scrolled 90% of a screen
      const qt = clamp(-hero.getBoundingClientRect().top / (window.innerHeight * 0.9));
      q = reduced ? qt : q + (qt - q) * (1 - Math.exp(-dt / 0.1));
      A += ((dragging ? 0 : hovered >= 0 ? 0.35 : 1) - A) * (1 - 0.05 ** dt);
      vel *= 0.04 ** dt;
      const swayT = !motionOff && Math.abs(I) > 0.78 ? Math.sign(I) * 14 * Math.min(1, (Math.abs(I) - 0.78) / 0.2) : 0;
      sway += (swayT - sway) * (1 - 0.05 ** dt);
      spin += ((motionOff ? 0 : 7) * A + vel + sway) * dt;
      if (!motionOff) drift += 22 * A * dt;
      const r = 1 - 0.0004 ** dt;
      N += ((motionOff ? 0 : F) - N) * r; Py += ((motionOff ? 0 : se) - Py) * r;
      world.style.perspectiveOrigin = `50% ${(50 + Py * 9).toFixed(2)}%`;

      const o = spin - N, py = -Py * 70;
      const v = clamp((q - Math.min(1, g.R / 900) * 0.3) / 0.7), open = smooth(v);
      const n = (now - start) / 1000;
      const yGate = g.mobile ? 0 : (1000 * g.R) / 900;
      for (let i = 0; i < els.length; i++) {
        const el = els[i], sl = plan.slots[i], col = plan.cols[sl.col];
        const s = ((col.phi + o) % 360 + 540) % 360 - 180;
        let shown = Math.abs(s) <= 82 && q < 1;
        const th = (s * Math.PI) / 180;
        let u = g.R * Math.sin(th);
        const z = g.Z - g.R * Math.cos(th);
        let l = ((sl.y + col.off - drift) % col.L + col.L) % col.L - col.L / 2 + sl.h / 2 + py;
        if (Math.abs(l) > (g.mobile ? col.L / 2 + 200 : yGate)) shown = false;
        if (!shown) { if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'; const v = vids[i]; if (v && !v.paused) v.pause(); continue; }
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
        el.style.visibility = 'visible';
        el.style.transform = `translate3d(${(u - g.W / 2).toFixed(1)}px,${(l - sl.h / 2).toFixed(1)}px,${d.toFixed(1)}px) rotateY(${(-s).toFixed(2)}deg)`;
        el.style.opacity = Math.max(0, f).toFixed(3);
        // reels play while they face you and are on screen (on a phone, once the first pictures are in)
        const v = vids[i];
        if (v) {
          const k = g.P / (g.P - d);
          const onScreen = Math.abs(u * k) < stageW / 2 + g.W && Math.abs(l * k) < stageH / 2 + sl.h;
          const want = !motionOff && f > 0.4 && Math.abs(s) < 70 && onScreen && (!g.mobile || restRef.current);
          if (want && v.paused) { if (v.preload !== 'auto') v.preload = 'auto'; v.play().catch(() => {}); }
          else if (!want && !v.paused) v.pause();
        }
      }
      stage.style.opacity = (1 - smooth(clamp((q - 0.45) / 0.4))).toFixed(3);
      const settling = Math.abs(vel) > 0.01 || Math.abs(qt - q) > 0.001 || n < 2.5;
      if (inView && (!motionOff || dragging || settling || hovered >= 0)) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick); } };

    // pointer: look around
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        I = (e.clientX / window.innerWidth) * 2 - 1;
        F = I * 24;
        se = (e.clientY / window.innerHeight) * 2 - 1;
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
      if (g.mobile && !restRef.current) setRest(true); // spinning by hand brings the rest round
    };
    const onUp = (e: PointerEvent) => {
      const d = down; down = null;
      const wasDrag = dragging;
      dragging = false; world.classList.remove('cursor-grabbing');
      if (!d || wasDrag || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 700) return;
      const tile = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>('[data-slot]');
      if (tile) setOpen(Number(tile.dataset.item));
    };
    const onWheel = (e: WheelEvent) => {
      if (reduced || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      vel -= e.deltaX * 0.9; e.preventDefault(); kick();
    };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-slot]');
      const idx = t ? els.indexOf(t) : -1;
      if (idx === hovered) return;
      hovered = idx;
      if (chip) {
        if (t) { chip.textContent = t.dataset.label || ''; chip.style.opacity = '1'; chip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`; }
        else chip.style.opacity = '0';
      }
      kick();
    };
    const onLeave = () => { hovered = -1; I = 0; if (chip) chip.style.opacity = '0'; kick(); };
    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView) kick(); });
    io.observe(hero);
    window.addEventListener('pointermove', onMove);
    world.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    world.addEventListener('pointerover', onOver);
    world.addEventListener('pointerleave', onLeave);
    world.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', kick, { passive: true });
    kick();
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      world.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      world.removeEventListener('pointerover', onOver);
      world.removeEventListener('pointerleave', onLeave);
      world.removeEventListener('wheel', onWheel);
      world.removeEventListener('load', onLoad, true);
      vids.forEach((v) => v?.pause());
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onStageResize);
    };
  }, [g, plan, pool]);

  // restart the loop when motion is switched back on
  useEffect(() => { window.dispatchEvent(new Event('scroll')); }, [paused]);

  return (
    <section ref={heroRef} aria-label={tx('Selected work, moving canvas', 'ნამუშევრები, მოძრავი კანვასი')} className="relative h-[100svh] min-h-[560px]">
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-white">
        {/* on a phone the drum sits between the top pills and the bottom dock, so neither covers it */}
        <div ref={stageRef} className="absolute inset-x-0 top-[68px] bottom-[108px] overflow-hidden sm:inset-0">
          <div ref={worldRef} className="absolute inset-0 select-none cursor-default" style={{ perspective: g ? `${g.P}px` : '1100px', touchAction: 'pan-y' }}>
            {g && plan && plan.slots.map((sl, i) => {
              const it = pool[sl.item];
              // a phone loads the tiles on screen first, the rest once the page is in;
              // reel stills always come (a dozen small pictures, shared by their tiles)
              const load = !firstView || rest || firstView.has(i);
              const low = !!firstView && !firstView.has(i) && !soonView?.has(i);
              const still = stills[it.full] ?? it.src;
              return (
                <button
                  key={i}
                  type="button"
                  data-slot=""
                  data-item={sl.item}
                  data-label={brandName(it.brand, ka)}
                  data-src={it.src}
                  tabIndex={-1}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 block overflow-hidden rounded-[10px] will-change-transform"
                  style={{ width: g.W, height: sl.h, visibility: 'hidden', opacity: 0 }}
                >
                  {it.video ? (
                    <video src={it.video} poster={g.mobile ? still.replace('w_600,c_limit', 'w_360,c_limit') : still} muted loop playsInline preload="none" aria-hidden className="pointer-events-none h-full w-full object-cover" style={{ filter: 'saturate(1.22) brightness(0.95) contrast(1.03)' }} />
                  ) : (
                    <img {...(load ? IMG.tileLarge(it.src) : {})} {...(load && g.mobile ? { sizes: `${g.W}px` } : {})}
                      {...(low ? { fetchpriority: 'low' } : {})}
                      alt="" loading={g.mobile ? 'eager' : 'lazy'} decoding="async" draggable={false}
                      // no grey box while it loads: our own pictures show their soft preview
                      // (app/media.ts) at once, the rest fade in once they are there
                      onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                      ref={(el) => { if (el && el.complete && el.naturalWidth) el.style.opacity = '1'; }}
                      className="pointer-events-none h-full w-full object-cover transition-opacity duration-500" style={{ opacity: it.src.startsWith('/hero/') ? 1 : 0, filter: 'saturate(1.22) brightness(0.95) contrast(1.03)' }} />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* the brand under the pointer */}
        <div ref={chipRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-20 rounded-full bg-[#111] px-3 py-1 text-[12px] text-white opacity-0 transition-opacity duration-150 whitespace-nowrap" />


        {/* keyboard and screen readers get a plain list of the work */}
        <ul className="sr-only">
          {pool.slice(0, 24).map((it, i) => (
            <li key={i}><button type="button" onClick={() => setOpen(i)}>{tx('Open', 'გახსენი')} {brandName(it.brand, ka)}</button></li>
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
