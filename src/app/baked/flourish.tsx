import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useI18n } from './i18n';
import { BookButton } from './booking';
import { T } from './ui';

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
  const shape = 'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-[15px] leading-none whitespace-nowrap transition-[background-color,box-shadow] duration-200 outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111]';
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
    <div className={`inline-flex items-center gap-2 ${className}`} data-cta>
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

export function SwingingBadge({ children }: { children?: ReactNode }) {
  const { tx } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const rope = useRef<SVGPathElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    const st = stage.current, cd = card.current, rp = rope.current;
    if (!st || !cd || !rp) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = 14, SEG = 16;
    let W = st.clientWidth;
    let ax = W / 2;
    const pts: P[] = Array.from({ length: N }, (_, i) => ({ x: ax, y: i * SEG, px: ax, py: i * SEG }));
    // a gentle push so it is already swinging when it comes into view
    pts[N - 1].px -= reduce ? 0 : 18;
    let raf = 0, visible = false;

    const render = () => {
      const last = pts[N - 1], prev = pts[N - 3];
      const ang = Math.atan2(last.x - prev.x, last.y - prev.y);
      cd.style.transform = `translate(${last.x - cd.offsetWidth / 2}px, ${last.y - 8}px) rotate(${-ang}rad)`;
      cd.style.transformOrigin = '50% 8px';
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < N; i++) d += ` L${pts[i].x} ${pts[i].y}`;
      rp.setAttribute('d', d);
    };

    const step = () => {
      raf = 0;
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        if (i === N - 1 && drag.current) continue;
        const vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 0.55;
      }
      for (let k = 0; k < 18; k++) {
        pts[0].x = ax; pts[0].y = 0;
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy) || 1;
          const diff = (dist - SEG) / dist;
          const fa = i === 0 ? 0 : 0.5, fb = i === 0 ? 1 : 0.5;
          if (!(i + 1 === N - 1 && drag.current)) { b.x -= dx * diff * fb; b.y -= dy * diff * fb; }
          if (i !== 0) { a.x += dx * diff * fa; a.y += dy * diff * fa; }
        }
      }
      render();
      if (visible && !reduce) raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(step); });
    io.observe(st);
    const onResize = () => { const nW = st.clientWidth; const dx = nW / 2 - ax; ax = nW / 2; W = nW; pts.forEach((p) => { p.x += dx; p.px += dx; }); if (reduce) step(); };
    window.addEventListener('resize', onResize);

    const local = (e: PointerEvent) => { const r = st.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = (e: PointerEvent) => {
      const m = local(e); const last = pts[N - 1];
      drag.current = { dx: last.x - m.x, dy: last.y - m.y };
      cd.setPointerCapture(e.pointerId);
      cd.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const m = local(e); const last = pts[N - 1];
      last.px = last.x; last.py = last.y;
      last.x = m.x + drag.current.dx; last.y = Math.max(20, m.y + drag.current.dy);
      if (!raf) raf = requestAnimationFrame(step);
    };
    const up = () => { drag.current = null; cd.style.cursor = 'grab'; if (!raf) raf = requestAnimationFrame(step); };
    cd.addEventListener('pointerdown', down);
    cd.addEventListener('pointermove', move);
    cd.addEventListener('pointerup', up);
    cd.addEventListener('pointercancel', up);
    step();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize);
      cd.removeEventListener('pointerdown', down); cd.removeEventListener('pointermove', move);
      cd.removeEventListener('pointerup', up); cd.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <section aria-label={tx('Salome Mosiava', 'სალომე მოსიავა')} className="relative overflow-hidden pt-0">
      <div ref={stage} className="relative mt-24 h-[460px] sm:h-[520px] select-none">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          <path ref={rope} fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div ref={card} className="absolute left-0 top-0 w-[200px] sm:w-[220px] touch-none" style={{ cursor: 'grab', willChange: 'transform' }}>
          {/* clip */}
          <div className="mx-auto h-5 w-9 rounded-b-md bg-[#c9c9cc] shadow-inner" />
          <div className="-mt-1 rounded-[14px] bg-white/80 backdrop-blur-sm p-2 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.4)] ring-1 ring-black/10">
            <div className="rounded-[10px] bg-white ring-1 ring-black/5 p-4 pt-5">
              <div className="mx-auto mb-4 h-2.5 w-12 rounded-full bg-[#ececec]" />
              <div className="text-[22px] leading-[1.02] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>Salome<br />Mosiava</div>
              <div className="mt-3 text-[12px] leading-[1.4] text-[#6f6f6f]">{tx('Art Director & Senior Product Designer', 'არტ დირექტორი, უფროსი პროდუქტის დიზაინერი')}</div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-[#9a9a9a]">
                <span>{tx('Tbilisi, Georgia', 'თბილისი')}</span>
                <span className="rounded-full bg-[#ff4306] px-2 py-0.5 text-white">samole.ge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="-mt-6 sm:-mt-10 px-3 text-center whitespace-nowrap leading-[0.82] text-[#111] select-none"
        style={{ fontFamily: T.display, fontWeight: 900, fontSize: 'clamp(30px, 8.4vw, 150px)', letterSpacing: '-0.02em' }}
      >
        Salome Mosiava
      </div>
      {children}
    </section>
  );
}
