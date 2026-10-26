import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from './i18n';
import { BookButton } from './booking';
import { T } from './ui';

/** The name set edge to edge in a variable font whose weight breathes from
 *  hairline to black and back (3s, ease-in-out, alternating). The size is
 *  fitted to the widest moment, the black weight, so it never overflows. */
// T comes from ui.tsx, which imports this file, so it is read at render time
const NAME_CSS = `
@keyframes name-wght { from { font-variation-settings: "wght" 200; } to { font-variation-settings: "wght" 900; } }
.name-breathe { animation: name-wght 3s ease-in-out -0.3s infinite alternate; }
@media (prefers-reduced-motion: reduce) { .name-breathe { animation: none; font-variation-settings: "wght" 900; } }
`;
function FullWidthName() {
  const box = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // the font is only needed here, so it loads with this section
    if (!document.querySelector('link[data-name-font]')) {
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.dataset.nameFont = '';
      l.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap';
      document.head.appendChild(l);
    }
    const b = box.current, t = txt.current;
    if (!b || !t) return;
    const fit = () => {
      // measure at the black weight, the widest the word ever gets
      const anim = t.style.animation;
      t.style.animation = 'none';
      t.style.fontVariationSettings = '"wght" 900';
      t.style.fontSize = '100px';
      const avail = b.clientWidth - parseFloat(getComputedStyle(b).paddingLeft) * 2;
      t.style.fontSize = `${(100 * avail) / t.scrollWidth}px`;
      t.style.fontVariationSettings = '';
      t.style.animation = anim;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    document.fonts?.load('900 100px Unbounded').then(fit).catch(() => {});
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} aria-hidden className="-mt-6 sm:-mt-10 px-3 sm:px-4 select-none overflow-hidden">
      <style>{NAME_CSS}</style>
      <span ref={txt} className="name-breathe mx-auto block whitespace-nowrap leading-[0.9] text-[#111] text-center"
        style={{ fontFamily: '"Unbounded", ' + T.display, fontSize: '8.4vw', letterSpacing: '-0.02em', width: 'max-content' }}>
        Salome Mosiava
      </span>
    </div>
  );
}

/* ── 1. Leaning pills: WhatsApp and Book a call ─────────────────────── */

const WA_URL = 'https://wa.me/995598671416';

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="#25D366">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

/** Google Meet's camera mark, in its four colours */
function MeetGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 87 72" aria-hidden>
      <path fill="#00832D" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
      <path fill="#0066DA" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
      <path fill="#E94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684FC" d="M20.5 20.5H0v31h20.5z" />
      <path fill="#00AC47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z" />
      <path fill="#FFBA00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z" />
    </svg>
  );
}

/**
 * The call to action: two straight pills with one shape. Same height,
 * radius and padding as the site's main button; white for WhatsApp,
 * black for booking a call.
 */
/* Hover motion follows the reference: the pill under the cursor rises and
   straightens, its neighbour leans in toward it on the same spring
   (about 0.4s to settle with a small overshoot). At rest both stay level. */
const PILL_SPRING = { type: 'spring', stiffness: 420, damping: 18, mass: 0.9 } as const;

export function LeaningPills({ className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const [hot, setHot] = useState<0 | 1 | null>(null);
  const shape = 'chrome inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[15px] leading-none whitespace-nowrap transition-[background-color,box-shadow] duration-200 outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111]';
  // index 0 = left pill, 1 = right pill
  const pose = (i: 0 | 1) => {
    if (reduce || hot === null) return { x: 0, y: 0, rotate: 0, scale: 1 };
    if (hot === i) return { x: 0, y: -3, rotate: 0, scale: 1.04 };
    const toward = i === 0 ? 1 : -1; // lean toward the hovered pill
    return { x: toward * 7, y: 2, rotate: toward * 7, scale: 0.98 };
  };
  const wrap = (i: 0 | 1, child: ReactNode) => (
    <motion.span
      className="inline-flex"
      style={{ transformOrigin: i === 0 ? '100% 100%' : '0% 100%', zIndex: hot === i ? 2 : 1, position: 'relative' }}
      animate={pose(i)}
      transition={PILL_SPRING}
      onHoverStart={() => setHot(i)}
      onHoverEnd={() => setHot((h) => (h === i ? null : h))}
      onFocus={() => setHot(i)}
      onBlur={() => setHot((h) => (h === i ? null : h))}
    >
      {child}
    </motion.span>
  );
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} data-cta>
      {wrap(0,
        <a href={WA_URL} target="_blank" rel="noopener noreferrer"
          className={`${shape} bg-white text-[#111] ring-1 ring-inset ring-black/10 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.3)] hover:bg-[#f6f6f6]`}>
          <WhatsAppGlyph />{tx("Let's chat", 'მომწერე')}
        </a>)}
      {wrap(1,
        <BookButton className={`${shape} bg-[#111] text-white ring-1 ring-inset ring-white/15 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)] hover:bg-[#222]`}>
          <MeetGlyph />{tx('Book a call', 'შევხვდეთ')}
        </BookButton>)}
    </div>
  );
}

/* ── 2. Folding cards: a strip that bends away at the edges ──────────── */

export function FoldingCards({ items: base, label }: { items: { img: string; title: string; desc: string; tag: string }[]; label: string }) {
  const items = [...base, ...base, ...base];
  const strip = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = strip.current;
    if (!el) return;
    // start on the middle card
    const mid = cards.current[Math.floor(items.length / 2)];
    if (mid) el.scrollLeft = mid.offsetLeft + mid.offsetWidth / 2 - el.clientWidth / 2;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      cards.current.forEach((c) => {
        if (!c) return;
        const r = c.getBoundingClientRect();
        const d = (r.left + r.width / 2 - cx) / (box.width / 2); // -1 … 1 across the strip
        const k = Math.max(-1.4, Math.min(1.4, d));
        const inner = c.firstElementChild as HTMLElement | null;
        if (!inner) return;
        inner.style.transform = `translateZ(${-Math.abs(k) * 220}px) rotateY(${-k * 52}deg) scale(${1 - Math.abs(k) * 0.08})`;
        inner.style.transformOrigin = k > 0 ? 'left center' : 'right center';
        inner.style.filter = `saturate(${1 - Math.abs(k) * 0.25}) brightness(${1 - Math.abs(k) * 0.08})`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [items.length]);

  // Desktop: point to the left or right of the centre to glide there
  const glide = useRef(0);
  useEffect(() => {
    const el = strip.current;
    if (!el || reduce) return;
    let raf = 0;
    const step = () => { if (glide.current) el.scrollLeft += glide.current; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div
      className="relative"
      style={{ perspective: '1400px' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        glide.current = Math.abs(x) > 0.22 ? x * 14 : 0;
      }}
      onPointerLeave={() => { glide.current = 0; }}
    >
      <div
        ref={strip}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-10 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:shadow-[inset_0_0_0_2px_#ff4306]"
        style={{ transformStyle: 'preserve-3d', paddingInline: 'calc(50% - min(36vw, 160px))' }}
      >
        {items.map((s, i) => (
          <div key={`${s.title}-${i}`} ref={(n) => { cards.current[i] = n; }} aria-hidden={i < base.length || i >= base.length * 2 ? true : undefined} className="snap-center shrink-0 w-[72vw] max-w-[320px]" style={{ transformStyle: 'preserve-3d' }}>
            <article className="rounded-[18px] overflow-hidden bg-[#f2f2f2] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] will-change-transform" style={{ transition: reduce ? undefined : 'filter .2s' }}>
              <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="block w-full aspect-[4/5] object-cover" draggable={false} />
              <div className="p-5 bg-white">
                <div className="text-[12px] text-[#d93905]">{s.tag}</div>
                <h3 className="mt-1 text-[17px] text-[#111]" style={{ fontWeight: 500 }}>{s.title}</h3>
                <p className="mt-1 text-[14px] leading-[1.5] text-[#6f6f6f]">{s.desc}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. The badge: an ID card swinging on its lanyard, the name below ── */

type P = { x: number; y: number; px: number; py: number };

/** Strap end, D-ring, swivel and lobster clasp in polished metal; the clasp
 *  hooks through the slot at the top of the sleeve */
function BadgeClip() {
  return (
    <svg viewBox="0 0 64 100" className="relative z-10 mx-auto block h-[100px] w-[64px] overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="bc-chrome" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5f636a" /><stop offset="0.18" stopColor="#c9ccd2" />
          <stop offset="0.32" stopColor="#ffffff" /><stop offset="0.48" stopColor="#9a9ea6" />
          <stop offset="0.66" stopColor="#e9ebef" /><stop offset="0.85" stopColor="#8b8f97" /><stop offset="1" stopColor="#4c5056" />
        </linearGradient>
        <linearGradient id="bc-chrome-d" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f7f8fa" /><stop offset="0.4" stopColor="#a7abb3" />
          <stop offset="0.6" stopColor="#d9dce1" /><stop offset="1" stopColor="#5c6067" />
        </linearGradient>
        <linearGradient id="bc-strap" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#151515" /><stop offset="0.5" stopColor="#2c2c2c" /><stop offset="1" stopColor="#141414" />
        </linearGradient>
        <filter id="bc-shadow" x="-40%" y="-20%" width="180%" height="150%">
          <feDropShadow dx="1.2" dy="1.6" stdDeviation="1.1" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#bc-shadow)">
        {/* strap folded round the D-ring, with its stitching */}
        <path d="M19 0 H45 V17 C45 20 43 22 40 22 H24 C21 22 19 20 19 17 Z" fill="url(#bc-strap)" />
        <path d="M22 3 V15 M42 3 V15" stroke="#4a4a4a" strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        <path d="M21 10 H43" stroke="#000" strokeOpacity="0.45" strokeWidth="1" />
        {/* D-ring */}
        <path d="M17 19 H47 C47 25 42 29 32 29 C22 29 17 25 17 19 Z" fill="none" stroke="url(#bc-chrome)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M19 19.5 H45" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.7" />
        {/* swivel eye and barrel */}
        <ellipse cx="32" cy="31.5" rx="3.6" ry="3" fill="none" stroke="url(#bc-chrome)" strokeWidth="2.2" />
        <rect x="28" y="34" width="8" height="9" rx="2.4" fill="url(#bc-chrome)" />
        <path d="M28.6 37 H35.4 M28.6 40 H35.4" stroke="#5c6067" strokeWidth="0.6" />
        <rect x="30.4" y="34.6" width="1.2" height="7.8" rx="0.6" fill="#fff" fillOpacity="0.85" />
        {/* lobster clasp body */}
        <path fillRule="evenodd" fill="url(#bc-chrome-d)" stroke="#5a5e65" strokeWidth="0.6"
          d="M32 42 C41 43 45 52 44.5 62 C44 72 39 79 32.5 81 C26.5 82.5 22.5 79 22 73 L21.5 62 C21.3 52 24 43.5 32 42 Z
             M32 48 C37.5 49.5 39.5 55 39 62 C38.5 69 35.5 74 32 74.6 C29 75 27 73 26.8 70 L26.6 62 C26.5 55 28 49.5 32 48 Z" />
        {/* spring gate on the left */}
        <path d="M26.6 51 C24.6 55 24.3 63 25.4 72" fill="none" stroke="url(#bc-chrome)" strokeWidth="2.4" strokeLinecap="round" />
        {/* lever */}
        <path d="M43.6 51.5 L48 53 C48.8 53.3 49 54 48.6 54.7 L46.6 58.4 C46.2 59.1 45.4 59.2 44.8 58.8 L43.9 58 Z" fill="url(#bc-chrome)" stroke="#5a5e65" strokeWidth="0.5" />
        {/* highlights */}
        <path d="M37.6 46 C41.6 49 43 55 42.8 61" fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M24 66 C24.2 71 25.6 76 29 78.6" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="32" cy="62" r="1.6" fill="#55595f" /><circle cx="31.6" cy="61.6" r="0.5" fill="#fff" />
        {/* the hook's bottom loop passing through the slot */}
        <path d="M32.5 80 C32.5 85 32.3 88 32 91" fill="none" stroke="url(#bc-chrome)" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      {/* behind the plastic: the part of the loop under the slot reads dimmer */}
      <path d="M29.5 90.5 H34.5" stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SwingingBadge({ children }: { children?: ReactNode }) {
  const { tx } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const rope = useRef<SVGPathElement>(null);
  const sheen = useRef<SVGPathElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const drag = useRef<{ t: number; s: number; gx: number; gy: number } | null>(null);

  useEffect(() => {
    const st = stage.current, cd = card.current, rp = rope.current;
    if (!st || !cd || !rp) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // rope points 0..N-1 (0 is pinned at the top), then the card as one rigid
    // segment from the clip (N-1) to its bottom edge (N)
    const N = 16, SEG = 15;
    const CLIP = 6; // the clip sits this far below the card element's top
    let cardLen = Math.max(200, cd.offsetHeight - CLIP);
    let ax = st.clientWidth / 2;
    const pts: P[] = Array.from({ length: N + 1 }, (_, i) => {
      const y = i < N ? i * SEG : (N - 1) * SEG + cardLen;
      return { x: ax, y, px: ax, py: y };
    });
    // a gentle push so it is already swinging when it comes into view
    pts[N].px -= reduce ? 0 : 26;
    let raf = 0, visible = false;

    const STRAP = 70; // half the gap between the two strands where they leave the top
    const render = () => {
      const A = pts[N - 1], B = pts[N];
      const ang = Math.atan2(B.x - A.x, B.y - A.y);
      cd.style.transform = `translate(${A.x - cd.offsetWidth / 2}px, ${A.y - CLIP}px) rotate(${-ang}rad)`;
      cd.style.transformOrigin = `50% ${CLIP}px`;
      // the light slides across the plastic as the badge turns
      cd.style.setProperty('--glare', `${50 + ang * 160}%`);
      cd.style.setProperty('--tilt', `${(ang * 14).toFixed(1)}px`);
      // one strap folded in half: two strands that meet at the clip
      const strand = (side: number) => {
        let d = '';
        for (let i = 0; i < N; i++) {
          const k = Math.pow(1 - i / (N - 1), 1.15);
          const x = pts[i].x + side * STRAP * k, y = pts[i].y - 30 * k;
          d += `${i ? ' L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return d;
      };
      const d = `${strand(-1)} ${strand(1)}`;
      rp.setAttribute('d', d);
      sheen.current?.setAttribute('d', d);
    };

    const link = (a: P, b: P, len: number, wa: number, wb: number) => {
      const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy) || 1;
      const diff = (dist - len) / dist / (wa + wb || 1);
      a.x += dx * diff * wa; a.y += dy * diff * wa;
      b.x -= dx * diff * wb; b.y -= dy * diff * wb;
    };
    // move the card segment so the grabbed spot on it sits exactly under the pointer
    const hold = () => {
      const g = drag.current; if (!g) return;
      const A = pts[N - 1], B = pts[N];
      const ux = (B.x - A.x) / cardLen, uy = (B.y - A.y) / cardLen;
      const tx = g.gx + uy * g.s, ty = g.gy - ux * g.s; // back from the grab point onto the card's axis
      const px = A.x + (B.x - A.x) * g.t, py = A.y + (B.y - A.y) * g.t;
      const dx = tx - px, dy = ty - py;
      const wa = 1 - g.t, wb = g.t, n = wa * wa + wb * wb || 1;
      A.x += dx * wa / n; A.y += dy * wa / n;
      B.x += dx * wb / n; B.y += dy * wb / n;
    };

    const step = () => {
      raf = 0;
      for (let i = 1; i <= N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.988, vy = (p.y - p.py) * 0.988;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + (i === N ? 0.7 : 0.45);
      }
      for (let k = 0; k < 24; k++) {
        pts[0].x = ax; pts[0].y = 0;
        for (let i = 0; i < N - 1; i++) link(pts[i], pts[i + 1], SEG, i === 0 ? 0 : 1, 1);
        link(pts[N - 1], pts[N], cardLen, 1, 1);
        hold();
      }
      render();
      if (visible && !reduce) raf = requestAnimationFrame(step);
      else if (drag.current) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(step); });
    io.observe(st);
    const onResize = () => {
      const dx = st.clientWidth / 2 - ax; ax = st.clientWidth / 2;
      cardLen = Math.max(200, cd.offsetHeight - CLIP);
      pts.forEach((p) => { p.x += dx; p.px += dx; });
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener('resize', onResize);

    const local = (e: PointerEvent) => { const r = st.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    // keep the pointer within reach of the strap, so the rope never stretches
    const reach = (x: number, y: number, t: number) => {
      const max = (N - 1) * SEG * 1.02 + cardLen * t;
      const dx = x - ax, dy = y, d = Math.hypot(dx, dy);
      return d > max ? { x: ax + dx * max / d, y: dy * max / d } : { x, y };
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      const m = local(e); const A = pts[N - 1], B = pts[N];
      const ux = (B.x - A.x) / cardLen, uy = (B.y - A.y) / cardLen;
      const rx = m.x - A.x, ry = m.y - A.y;
      const t = Math.min(1, Math.max(0, (rx * ux + ry * uy) / cardLen));
      const s = rx * -uy + ry * ux; // sideways offset from the card's centre line
      drag.current = { t, s, gx: m.x, gy: m.y };
      cd.setPointerCapture(e.pointerId);
      cd.style.cursor = 'grabbing';
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      const g = drag.current; if (!g) return;
      const m = local(e); const r = reach(m.x, m.y, g.t);
      g.gx = r.x; g.gy = r.y;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const up = () => { drag.current = null; cd.style.cursor = 'grab'; if (!raf) raf = requestAnimationFrame(step); };
    cd.addEventListener('pointerdown', down);
    cd.addEventListener('pointermove', move);
    cd.addEventListener('pointerup', up);
    cd.addEventListener('pointercancel', up);
    cd.addEventListener('lostpointercapture', up);
    step();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize);
      cd.removeEventListener('pointerdown', down); cd.removeEventListener('pointermove', move);
      cd.removeEventListener('pointerup', up); cd.removeEventListener('pointercancel', up);
      cd.removeEventListener('lostpointercapture', up);
    };
  }, []);

  return (
    <section aria-label={tx('Salome Mosiava', 'სალომე მოსიავა')} className="relative overflow-hidden pt-0">
      <div ref={stage} className="relative mt-16 h-[600px] sm:h-[660px] select-none">
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" aria-hidden style={{ maskImage: 'linear-gradient(to bottom, transparent 0, #000 140px)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 140px)' }}>
          <defs>
            <filter id="strap-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="10" dy="16" stdDeviation="9" floodColor="#000" floodOpacity="0.16" />
            </filter>
          </defs>
          <g filter="url(#strap-shadow)">
            <path ref={rope} fill="none" stroke="#262626" strokeWidth="13" strokeLinejoin="round" />
            <path ref={sheen} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeLinejoin="round" transform="translate(-3 0)" />
          </g>
        </svg>
        <div ref={card} className="absolute left-0 top-0 w-[228px] sm:w-[248px] touch-none" style={{ cursor: 'grab', willChange: 'transform', filter: 'drop-shadow(var(--tilt, 0px) 26px 22px rgba(0,0,0,0.18))' }}>
          <BadgeClip />
          <div className="relative -mt-[34px] aspect-[0.64] rounded-[18px] overflow-hidden"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(236,239,243,0.55))', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.13), inset 0 0 0 2px rgba(255,255,255,0.8), inset 3px 0 6px rgba(255,255,255,0.7)' }}>
            {/* top of the sleeve: two punch holes and the slot */}
            <div className="absolute inset-x-0 top-0 h-[52px]">
              <span className="absolute left-[18px] top-[17px] h-[16px] w-[16px] rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.9)' }} />
              <span className="absolute right-[18px] top-[17px] h-[16px] w-[16px] rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.9)' }} />
              <span className="absolute left-1/2 top-[20px] h-[9px] w-[64px] -translate-x-1/2 rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)' }} />
              <span className="absolute inset-x-[10px] bottom-[2px] h-px bg-black/10" />
              <span className="absolute inset-x-[10px] bottom-0 h-px bg-white/90" />
            </div>
            {/* the card inside */}
            <div className="absolute inset-x-[12px] top-[60px] bottom-[12px] rounded-[6px] bg-white px-5 pt-6 pb-5 flex flex-col"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
              <div className="text-[34px] sm:text-[37px] leading-[0.9] tracking-[-0.02em]" style={{ fontFamily: T.display, fontWeight: 900 }}>
                <span className="text-[#111]">Salome</span><br /><span className="text-[#ff4306]">Mosiava</span>
              </div>
              <div className="mt-auto">
                <div className="text-[12px] text-[#111]" style={{ fontWeight: 600 }}>{tx('Currently', 'ახლა')}</div>
                <div className="mt-0.5 text-[11.5px] leading-[1.35] text-[#555]">{tx('Freelancing between a few brave brands and one very full sketchbook ;)', 'ფრილანსში, რამდენიმე გაბედულ ბრენდსა და ერთ სავსე სკეჩბუქს შორის ;)')}</div>
                <div className="mt-3 text-[12px] text-[#111]" style={{ fontWeight: 600 }}>{tx('Previously', 'მანამდე')}</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {[['Scope', '#2a2a2a', '#000'], ['UniLab', '#e5484d', '#c22a2f'], ['Cubisten', '#4b37d9', '#2a1a9e']].map(([n, c1, c2]) => (
                    <span key={n} className="rounded-full px-2 py-[3px] text-[10.5px] leading-none text-white"
                      style={{ fontWeight: 500, background: `linear-gradient(180deg, ${c1}, ${c2})`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* plastic: a soft sheen top and bottom, and a glare band that moves with the swing */}
            <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.18))' }} />
            <div className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{ background: 'linear-gradient(112deg, rgba(255,255,255,0) calc(var(--glare, 50%) - 22%), rgba(255,255,255,0.55) calc(var(--glare, 50%) - 4%), rgba(255,255,255,0.15) var(--glare, 50%), rgba(255,255,255,0.4) calc(var(--glare, 50%) + 6%), rgba(255,255,255,0) calc(var(--glare, 50%) + 16%))' }} />
            <div className="pointer-events-none absolute inset-0 rounded-[18px]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6), inset -2px -2px 4px rgba(0,0,0,0.04)' }} />
          </div>
        </div>
      </div>
      <FullWidthName />
      {children}
    </section>
  );
}
