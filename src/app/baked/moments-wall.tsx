import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Play } from 'lucide-react';
import { IMG } from '../lib/cld';

/*
 * Moments wall — a wall of visuals that parts under the cursor.
 *
 * A soft "void" sits under the pointer and pushes nearby tiles outward,
 * shrinking them a little. The void holds still while the cursor moves
 * inside it (so the parted tiles at its edge can be reached and clicked)
 * and is dragged along once the cursor tries to leave it. Leaving the wall
 * closes the void. Touch devices and reduced motion get the plain wall.
 *
 * One requestAnimationFrame loop writes transforms directly to the tiles;
 * it only runs while the void is open or closing.
 */

export type WallItem = {
  src: string;
  type: 'image' | 'video';
  brandName: string;
  logoImg?: string;
  whiteBg?: boolean;
};

type Props = {
  items: WallItem[];
  isDark: boolean;
  onOpen: (index: number) => void;
};

const GAP = 6;

export const MomentsWall = ({ items, isDark, onOpen }: Props) => {
  const wallRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [cols, setCols] = useState(4);
  const reduceMotion = useReducedMotion();

  // Physics state lives in a ref: nothing here should re-render React
  const sim = useRef({
    centers: [] as { x: number; y: number }[],
    cell: 160,
    pointer: { x: 0, y: 0, inside: false }, // client coords
    void: { x: 0, y: 0 },                    // wall coords
    strength: 0,
    last: [] as { dx: number; dy: number; s: number }[],
    raf: 0 as number,
  });

  // The wall fits one screen: start from a width-based column count and add
  // columns until the masonry is no taller than the viewport (less the nav)
  const baseCols = useRef(4);
  useLayoutEffect(() => {
    const el = wallRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      baseCols.current = Math.max(3, Math.min(9, Math.round(w / 112)));
      setCols(baseCols.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // A new set of visuals (another brand) starts the fit again
  const itemsKey = `${items.length}:${items[0]?.src ?? ''}`;
  useEffect(() => { setCols(baseCols.current); }, [itemsKey]);
  useEffect(() => {
    const el = wallRef.current;
    if (!el) return;
    const fit = () => {
      const target = window.innerHeight - 72;
      const maxCols = Math.max(3, Math.floor(el.clientWidth / 56));
      if (el.offsetHeight > target) setCols((c) => (c < maxCols ? c + 1 : c));
    };
    fit();
    // Images landing change the height; re-check whenever it does
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, [cols, itemsKey]);

  // Tile centres, measured from layout (offsets ignore our transforms)
  const measure = () => {
    const s = sim.current;
    s.centers = tileRefs.current.map((t) =>
      t ? { x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2 } : { x: -1e6, y: -1e6 }
    );
    const first = tileRefs.current[0];
    if (first) s.cell = first.offsetWidth;
  };

  useLayoutEffect(() => {
    tileRefs.current.length = items.length;
    sim.current.last = items.map(() => ({ dx: 0, dy: 0, s: 1 }));
    measure();
    const el = wallRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onLoad = () => measure();
    el.addEventListener('load', onLoad, true);
    return () => { ro.disconnect(); el.removeEventListener('load', onLoad, true); };
  }, [items, cols]);

  const step = () => {
    const s = sim.current;
    const wall = wallRef.current;
    if (!wall) return;
    const rect = wall.getBoundingClientRect();
    const px = s.pointer.x - rect.left;
    const py = s.pointer.y - rect.top;

    const R = s.cell * 1.5;          // reach of the void
    const hold = R * 0.55;            // cursor can roam this far without dragging it

    // Void follows only when the cursor pushes past its hold radius
    if (s.pointer.inside) {
      const dx = px - s.void.x;
      const dy = py - s.void.y;
      const d = Math.hypot(dx, dy);
      if (d > hold) {
        const k = (d - hold) / d;
        s.void.x += dx * k * 0.18;
        s.void.y += dy * k * 0.18;
      }
    }
    const target = s.pointer.inside ? 1 : 0;
    s.strength += (target - s.strength) * (target ? 0.12 : 0.08);
    if (Math.abs(target - s.strength) < 0.002) s.strength = target;

    const push = R * 0.5;
    let moving = s.strength > 0 && s.strength < 1;
    for (let i = 0; i < s.centers.length; i++) {
      const c = s.centers[i];
      const t = tileRefs.current[i];
      if (!t) continue;
      const vx = c.x - s.void.x;
      const vy = c.y - s.void.y;
      const d = Math.hypot(vx, vy);
      let f = s.strength * Math.exp(-((d / R) ** 2));
      if (f < 0.003) f = 0;
      const nx = d > 0.001 ? vx / d : 0;
      const ny = d > 0.001 ? vy / d : -1;
      const dx = nx * f * push;
      const dy = ny * f * push;
      const sc = 1 - f * 0.3;
      const prev = s.last[i];
      if (!prev) continue;
      if (Math.abs(prev.dx - dx) > 0.05 || Math.abs(prev.dy - dy) > 0.05 || Math.abs(prev.s - sc) > 0.001) {
        prev.dx = dx; prev.dy = dy; prev.s = sc;
        t.style.transform = f === 0 ? '' : `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${sc.toFixed(4)})`;
        moving = true;
      }
    }

    const glow = glowRef.current;
    if (glow) {
      glow.style.opacity = String(s.strength);
      glow.style.transform = `translate3d(${s.void.x - R}px, ${s.void.y - R}px, 0)`;
      glow.style.width = glow.style.height = `${R * 2}px`;
    }

    if (moving || s.pointer.inside) {
      s.raf = requestAnimationFrame(step);
    } else {
      s.raf = 0;
    }
  };

  const kick = () => {
    if (!sim.current.raf) sim.current.raf = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(sim.current.raf), []);

  // Keep the void glued to the wall while the page scrolls under a still cursor
  useEffect(() => {
    const onScroll = () => { if (sim.current.pointer.inside) kick(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType === 'touch') return;
    const s = sim.current;
    if (!s.pointer.inside) {
      // Open the void where the cursor came in, not where it last closed
      const rect = wallRef.current!.getBoundingClientRect();
      if (s.strength < 0.05) {
        s.void.x = e.clientX - rect.left;
        s.void.y = e.clientY - rect.top;
      }
      s.pointer.inside = true;
    }
    s.pointer.x = e.clientX;
    s.pointer.y = e.clientY;
    kick();
  };

  const onPointerLeave = () => {
    sim.current.pointer.inside = false;
    kick();
  };

  const tileBg = isDark ? 'bg-[#121318]' : 'bg-[#f2f2f2]';

  return (
    <div
      ref={wallRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative"
      style={{ columnCount: cols, columnGap: GAP }}
    >
      {/* Soft light inside the void */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 rounded-full"
        style={{
          opacity: 0,
          background: isDark
            ? 'radial-gradient(circle, rgba(255,67,6,0.16) 0%, rgba(255,67,6,0.05) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,67,6,0.12) 0%, rgba(255,67,6,0.04) 40%, transparent 70%)',
          willChange: 'transform, opacity',
        }}
      />
      {items.map((v, i) => (
        <button
          key={`${v.brandName}-${v.src}`}
          ref={(el) => { tileRefs.current[i] = el; }}
          onClick={() => onOpen(i)}
          data-cursor={v.type === 'video' ? 'play' : 'expand'}
          aria-label={`${v.brandName.split(' · ')[0]} — ${v.type === 'video' ? 'play reel' : `open visual ${i + 1}`}`}
          className={`group relative block w-full mb-[6px] break-inside-avoid overflow-hidden rounded-md ${v.whiteBg ? 'bg-white border border-[#eee]' : tileBg} focus-visible:shadow-[0_0_0_2px_rgba(255,67,6,0.9)] outline-none`}
          style={{ willChange: 'transform', transformOrigin: 'center' }}
        >
          {v.type === 'video' ? (
            <video src={v.src} autoPlay loop muted playsInline className="block w-full h-auto" />
          ) : (
            <img
              {...IMG.tile(v.src)}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
              className={`block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.04]`}
            />
          )}
          {/* Brand label on hover */}
          <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex items-center gap-1 truncate text-[10px] text-white/90">
              {v.logoImg && <img {...IMG.logo(v.logoImg)} alt="" width="14" height="14" className="h-3.5 w-3.5 flex-shrink-0 rounded object-cover" />}
              {v.brandName.split(' · ')[0]}
            </span>
          </span>
          {v.type === 'video' && (
            <span className="pointer-events-none absolute right-1.5 top-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 backdrop-blur-md">
              <Play size={7} className="fill-white/70 text-white/70" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/80">Reel</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
