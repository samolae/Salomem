import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';

/* ------------------------------------------------------------------ */
/*  KineticText                                                        */
/*  Variable-font headline. Letters rise in with a weight wave, then   */
/*  each letter swells toward `peak` weight as the cursor comes close  */
/*  and settles back to `base` when it leaves. Needs a variable font   */
/*  (Syne 400-800 here). Touch devices get the entrance only; reduced  */
/*  motion gets static type. Styles live in styles/kinetic.css.        */
/* ------------------------------------------------------------------ */

type Line = { text: string; className?: string };

type KineticTextProps = {
  /** Read by screen readers; the animated letters are hidden from them */
  label: string;
  lines: Line[];
  base?: number;
  peak?: number;
  /** Cursor influence radius in px */
  radius?: number;
  /** Paint the final character (e.g. the full stop) in the accent */
  accentLast?: boolean;
  className?: string;
  style?: CSSProperties;
};

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const STAGGER_MS = 34;
const INTRO_MS = 900;

export function KineticText({
  label,
  lines,
  base = 450,
  peak = 800,
  radius = 170,
  accentLast = false,
  className = '',
  style,
}: KineticTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const total = lines.reduce((n, l) => n + l.text.length, 0);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion || !window.matchMedia(FINE_POINTER).matches) return;

    const chars = [...root.querySelectorAll<HTMLElement>('.kinetic-char')];
    const current = chars.map(() => base);
    let centers: { x: number; y: number }[] = [];
    let box = root.getBoundingClientRect();
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let ready = false;

    // Letter centres in page coordinates, so scrolling does not stale them
    const measure = () => {
      box = root.getBoundingClientRect();
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
      });
    };

    const tick = () => {
      raf = 0;
      if (!ready) return;
      const x = px + window.scrollX;
      const y = py + window.scrollY;
      let settling = false;
      for (let i = 0; i < chars.length; i++) {
        const c = centers[i];
        const d = c ? Math.hypot(c.x - x, (c.y - y) * 1.15) : Infinity;
        const t = Math.max(0, 1 - d / radius);
        const target = base + (peak - base) * t * t * (3 - 2 * t); // smoothstep falloff
        const next = current[i] + (target - current[i]) * 0.2;
        if (Math.abs(target - next) > 0.4) settling = true;
        current[i] = Math.abs(target - next) > 0.4 ? next : target;
        chars[i].style.setProperty('--w', current[i].toFixed(1));
      }
      if (settling) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      // Only spend frames when the cursor is near the headline
      const near =
        px > box.left - radius && px < box.right + radius && py > box.top - radius && py < box.bottom + radius;
      if (near || current.some((w) => w !== base)) schedule();
    };
    const onScroll = () => {
      box = root.getBoundingClientRect();
      schedule();
    };
    const onLeave = () => {
      px = py = -1e5;
      schedule();
    };

    // Start once the entrance wave has played; measure after fonts settle
    const startTimer = window.setTimeout(() => {
      measure();
      ready = true;
      schedule();
    }, INTRO_MS + total * STAGGER_MS);
    document.fonts?.ready.then(() => measure());
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [reduceMotion, base, peak, radius, total]);

  let index = 0;
  return (
    <p
      ref={ref}
      className={`kinetic ${className}`}
      style={{ ...style, '--k-base': base, '--k-peak': peak } as CSSProperties}
    >
      <span className="sr-only">{label}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden className={`kinetic-line ${line.className ?? ''}`}>
          {[...line.text].map((ch, ci) => {
            const i = index++;
            const isAccent = accentLast && li === lines.length - 1 && ci === line.text.length - 1;
            return (
              <span
                key={ci}
                className={`kinetic-char${isAccent ? ' kinetic-accent' : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}
