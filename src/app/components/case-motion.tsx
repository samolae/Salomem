import { Children, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

/*
 * Shared motion for the UX/UI case studies. Every primitive is safe by
 * construction: the server HTML and the first client render show the
 * finished state, and nothing is hidden until the page has mounted and an
 * observer is ready to reveal it. Scroll-linked effects never touch
 * opacity, so they can't strand content. Reduced motion turns all of it off.
 */

/** true after mount (so prerendered HTML is always the finished page) */
function useArmed() {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!reduce) setArmed(true); }, [reduce]);
  return armed;
}

/** fires once when the element enters the viewport */
export function useInViewOnce<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, seen]);
  return [ref, seen] as const;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Text: each line slides up out of a mask ───────────────────────────── */

/**
 * Headings and short statements. Pass lines as separate children (strings
 * or nodes) to reveal them one after another; a single child is one line.
 */
export function RevealLines({ as = 'div', className = '', style, children, delay = 0, stagger = 0.09 }: {
  as?: ElementType; className?: string; style?: CSSProperties; children: ReactNode; delay?: number; stagger?: number;
}) {
  const Tag = as;
  const armed = useArmed();
  const [ref, seen] = useInViewOnce<HTMLElement>();
  const lines = Children.toArray(children);
  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={false}
            animate={armed && !seen ? { y: '108%', rotate: 2, transition: { duration: 0 } } : { y: '0%', rotate: 0, transition: armed ? { duration: 1, ease: EASE, delay: delay + i * stagger } : { duration: 0 } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Body copy / small blocks: a short rise and fade, once */
export function Rise({ children, className = '', delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const armed = useArmed();
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={armed && !seen ? { opacity: 0, y, transition: { duration: 0 } } : { opacity: 1, y: 0, transition: armed ? { duration: 0.9, ease: EASE, delay } : { duration: 0 } }}
    >
      {children}
    </motion.div>
  );
}

/* ── Screens ───────────────────────────────────────────────────────────── */

/**
 * The big product screen: tips up from a perspective tilt as it scrolls
 * into place (rotateX 16° → 0, scale .9 → 1), then follows the pointer with
 * a slight 3D tilt on hover.
 */
export function TiltIn({ children, className = '', hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const rx = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const sc = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const px = useMotionValue(0), py = useMotionValue(0);
  const hy = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 140, damping: 18 });
  const hx = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 140, damping: 18 });
  const rotateX = useTransform([rx, hx] as never, ([a, b]: number[]) => a + b);
  const armed = useArmed();
  if (reduce || !armed) return <div ref={ref} className={className}>{children}</div>;
  return (
    <div ref={ref} className={className} style={{ perspective: '1600px' }}
      onPointerMove={hover ? (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5);
      } : undefined}
      onPointerLeave={hover ? () => { px.set(0); py.set(0); } : undefined}
    >
      <motion.div style={{ rotateX, rotateY: hy, scale: sc, y: ty, transformOrigin: '50% 100%' }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * A screen that opens from a rounded window to its full frame while the
 * image inside settles from a slight zoom. Scroll-linked.
 */
export function ClipReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 30%'] });
  const inset = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const clipPath = useTransform(inset, (v) => `inset(${v}% ${v * 0.6}% ${v}% ${v * 0.6}% round 20px)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const armed = useArmed();
  if (reduce || !armed) return <div ref={ref} className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ clipPath }}>
      <motion.div style={{ scale }} className="will-change-transform">{children}</motion.div>
    </motion.div>
  );
}

/** Gentle depth: content drifts against the scroll */
export function Parallax({ children, className = '', distance = 60 }: { children: ReactNode; className?: string; distance?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  if (reduce) return <div className={className}>{children}</div>;
  return <motion.div ref={ref} className={className} style={{ y }}>{children}</motion.div>;
}

/* ── Numbers ───────────────────────────────────────────────────────────── */

/**
 * Counts up to the number inside `value` ("196", "42+", "64+", "0.1%") the
 * first time it is seen. The prerendered text is always the final value.
 */
export function CountUp({ value, className = '', duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const armed = useArmed();
  const [ref, seen] = useInViewOnce<HTMLSpanElement>('0px 0px -8% 0px');
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : NaN;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [shown, setShown] = useState<string>(value);
  const ran = useRef(false);
  useEffect(() => {
    if (!armed || !m || Number.isNaN(target)) return;
    if (!seen) {
      // below the fold: start from zero so the count is visible when it arrives
      const r = ref.current?.getBoundingClientRect();
      if (r && r.top > window.innerHeight && !ran.current) setShown(`${m[1]}${(0).toFixed(decimals)}${m[3]}`);
      return;
    }
    if (ran.current) return;
    ran.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / (duration * 1000));
      const e = 1 - Math.pow(1 - p, 4);
      setShown(`${m[1]}${(target * e).toFixed(decimals)}${m[3]}`);
      if (p < 1) raf = requestAnimationFrame(tick); else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, seen]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className={`tabular-nums ${className}`}>{shown}</span>;
}

/* ── Rules and marquees ────────────────────────────────────────────────── */

/** A hairline that draws itself from the left when it comes into view */
export function DrawRule({ className = '', color = 'rgba(255,255,255,0.1)' }: { className?: string; color?: string }) {
  const armed = useArmed();
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`h-px w-full overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="h-full w-full origin-left"
        style={{ background: color }}
        initial={false}
        animate={armed && !seen ? { scaleX: 0, transition: { duration: 0 } } : { scaleX: 1, transition: armed ? { duration: 1.2, ease: EASE } : { duration: 0 } }}
      />
    </div>
  );
}

/** An endless row of words (tags, disciplines), as a breathing pause between chapters */
export function Marquee({ items, className = '', speed = 40, separator = '·' }: { items: string[]; className?: string; speed?: number; separator?: string }) {
  const reduce = useReducedMotion();
  const row = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span>{t}</span><span aria-hidden className="opacity-40">{separator}</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`} aria-label={items.join(', ')}>
      <div className="flex w-max" style={reduce ? undefined : { animation: `case-marquee ${speed}s linear infinite` }} aria-hidden>
        {row}{row}
      </div>
      <style>{'@keyframes case-marquee{to{transform:translateX(-50%)}}'}</style>
    </div>
  );
}

/* ── Pinned horizontal gallery ─────────────────────────────────────────── */

/**
 * Desktop: the section pins and its cards travel sideways as you scroll
 * down. Phones, tablets and reduced motion: a normal swipeable row with
 * snap points. Give each card a fixed width via `cardClassName`.
 */
export function HorizontalGallery({ children, className = '', cardClassName = 'w-[78vw] md:w-[62vw] lg:w-[56vw] max-w-[920px]', header }: {
  children: ReactNode; className?: string; cardClassName?: string; header?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [dist, setDist] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setWide(mq.matches);
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 96));
    };
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(update) : null;
    if (track.current && ro) ro.observe(track.current);
    return () => { mq.removeEventListener('change', update); window.removeEventListener('resize', update); ro?.disconnect(); };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const pinned = wide && !reduce && dist > 0;

  return (
    <div ref={outer} className={className} style={pinned ? { height: `calc(100svh + ${dist}px)` } : undefined}>
      <div className={pinned ? 'sticky top-0 h-[100svh] flex flex-col justify-center overflow-hidden' : ''}>
        {header}
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={pinned
            ? 'flex gap-6 pl-[max(1.5rem,calc((100vw-1232px)/2+2.5rem))] pr-12 will-change-transform'
            : 'flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-8 md:px-8 [scrollbar-width:thin]'}
        >
          {items.map((c, i) => <div key={i} className={`shrink-0 ${pinned ? '' : 'snap-start'} ${cardClassName}`}>{c}</div>)}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Page progress ─────────────────────────────────────────────────────── */

/** A thin bar at the very top that fills as you read */
export function ReadProgress({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  if (reduce) return null;
  return <motion.div aria-hidden className="fixed left-0 right-0 top-0 z-[80] h-[2px] origin-left" style={{ scaleX, background: color }} />;
}
