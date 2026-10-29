import { useEffect, useMemo, useRef, useState } from 'react';
import { IMG } from '../lib/cld';
import { adsBrands, motionReels } from './data';
import { spotlights } from './content';
import { useMotionPause, PauseButton } from './shell';
import { CtaLink, Lightbox, T, type LightboxItem } from './ui';
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
    // interleave so neighbours differ in kind
    const out: Item[] = [];
    const lists = [ads, frames, spots];
    for (let k = 0, added = true; added; k++) {
      added = false;
      for (const l of lists) {
        const take = l === ads ? [l[k * 2], l[k * 2 + 1]] : [l[k]];
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
  const L = g.mobile ? Math.max(1100, window.innerHeight * 2.4) : 2300 * Math.max(1, window.innerWidth / 1440);
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

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function HeroCanvas() {
  const { tx, ka } = useI18n();
  const pool = usePool();
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
        // reels play while they face you
        const v = vids[i];
        if (v) {
          const want = !motionOff && f > 0.4 && Math.abs(s) < 70;
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
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY, last: e.clientX, t: performance.now() }; };
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
    };
  }, [g, plan, pool]);

  // restart the loop when motion is switched back on
  useEffect(() => { window.dispatchEvent(new Event('scroll')); }, [paused]);

  return (
    <section ref={heroRef} aria-label={tx('Selected work, moving canvas', 'ნამუშევრები, მოძრავი კანვასი')} className="relative h-[100svh] min-h-[560px]">
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-white">
        <div ref={stageRef} className="absolute inset-0">
          <div ref={worldRef} className="absolute inset-0 select-none cursor-default" style={{ perspective: g ? `${g.P}px` : '1100px', touchAction: 'pan-y' }}>
            {g && plan && plan.slots.map((sl, i) => {
              const it = pool[sl.item];
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
                  className="absolute left-1/2 top-1/2 block overflow-hidden rounded-[10px] bg-[#f2f2f2] will-change-transform"
                  style={{ width: g.W, height: sl.h, visibility: 'hidden', opacity: 0 }}
                >
                  {it.video ? (
                    <video src={it.video} poster={it.src} muted loop playsInline preload="none" aria-hidden className="pointer-events-none h-full w-full object-cover" style={{ filter: 'saturate(1.22) brightness(0.95) contrast(1.03)' }} />
                  ) : (
                    <img {...IMG.tileLarge(it.src)} alt="" loading="lazy" decoding="async" draggable={false} className="pointer-events-none h-full w-full object-cover" style={{ filter: 'saturate(1.22) brightness(0.95) contrast(1.03)' }} />
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
        {/* who this is, on the very first screen */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <h1 className="rounded-[14px] bg-white/85 px-5 py-3 backdrop-blur-md">
            <span className="block text-[30px] sm:text-[44px] leading-[1] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{tx('Salome Mosiava', 'სალომე მოსიავა')}</span>
            <span className="mt-2 block text-[14px] sm:text-[16px] text-[#3f3f3f]">{tx('Senior Product Designer & Art Director', 'სენიორ პროდაქტ დიზაინერი და არტ დირექტორი')}</span>
          </h1>
          <div className="mt-4"><CtaLink /></div>
        </div>
        <PauseButton className="absolute left-2 bottom-24 sm:bottom-24 z-10" />
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-md bg-white/80 px-3 py-1.5 text-[13px] text-[#6f6f6f] backdrop-blur-md whitespace-nowrap">
          <span className="hidden sm:inline">{tx('Move to look around, click to open', 'კურსორით დაათვალიერე, დააჭირე გასახსნელად')}</span>
          <span className="sm:hidden">{tx('Swipe to spin, tap to open', 'გაასრიალე, დააჭირე გასახსნელად')}</span>
        </div>
      </div>

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
