import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { IMG } from '../lib/cld';
import { adsBrands, motionReels, screenExchange, screenProfile, screenLanding, schenkerSendung, schenkerSettings } from './data';
import { spotlights } from './content';
import { useMotionPause, PauseButton } from './shell';

/*
 * The opening canvas: every kind of work laid out as tilted columns that
 * drift up and down at their own pace. Moving the pointer pans the plane
 * ("look around"); scrolling lifts it away to the intro underneath.
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

type Tile = { src: string; ratio: number; frame?: boolean };

function usePool(): Tile[] {
  return useMemo(() => {
    const ads: Tile[] = adsBrands.flatMap((b) =>
      b.items.filter((it) => it.type === 'image' && !it.fullWidth).slice(0, 3).map((it, i) => ({ src: it.src, ratio: i % 3 === 1 ? 1 : 1.25 }))
    );
    const ux: Tile[] = [screenExchange, screenProfile, screenLanding, schenkerSendung, schenkerSettings].map((s) => ({ src: s, ratio: 0.66 }));
    const spots: Tile[] = spotlights.map((s) => ({ src: s.img, ratio: 0.75 }));
    const frames: Tile[] = motionReels.slice(0, 8).map((r, i) => ({ src: videoFrame(r.src, i % 2 ? '35p' : '60p'), ratio: 1.6, frame: true }));
    // Interleave so neighbouring tiles differ in kind
    const out: Tile[] = [];
    const lists = [ads, frames, ux, spots];
    let added = true;
    for (let k = 0; added; k++) {
      added = false;
      for (const l of lists) {
        // ads are plentiful: take two per round
        const take = l === ads ? [l[k * 2], l[k * 2 + 1]] : [l[k]];
        for (const t of take) if (t) { out.push(t); added = true; }
      }
    }
    return out;
  }, []);
}

export function HeroCanvas() {
  const pool = usePool();
  const { paused } = useMotionPause();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(7);

  useEffect(() => {
    const set = () => setCols(window.innerWidth < 640 ? 5 : window.innerWidth < 1100 ? 6 : 7);
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // Columns: deal the pool round-robin, each column gets its own speed
  const columns = useMemo(() => {
    const c: Tile[][] = Array.from({ length: cols }, () => []);
    pool.forEach((t, i) => c[i % cols].push(t));
    return c.map((tiles, i) => ({ tiles, dur: 70 + ((i * 23) % 40), up: i % 2 === 0 }));
  }, [pool, cols]);

  // Pointer pans the plane with a little lag
  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current, plane = planeRef.current;
    if (!wrap || !plane) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = wrap.getBoundingClientRect();
      tx = -((e.clientX - r.left) / r.width - 0.5) * 140;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 90;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      plane.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      raf = Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    wrap.addEventListener('pointermove', onMove);
    return () => { wrap.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [reduce]);

  // Scroll lifts the canvas away
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0]);

  const stopped = paused || !!reduce;

  return (
    <section ref={wrapRef} aria-label="Selected work, moving canvas" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-white">
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        <div
          ref={planeRef}
          className="absolute left-1/2 top-1/2 flex gap-3 sm:gap-4"
          style={{
            width: cols * (cols === 5 ? 125 : 210),
            transform: 'translate(-50%, -50%) perspective(1800px) rotateX(14deg) rotateZ(-8deg) scale(1.25)',
          }}
        >
          {columns.map((col, ci) => (
            <div key={ci} className="flex-1 min-w-0 h-[150vh] overflow-hidden -my-[25vh]" style={{ marginTop: ci % 2 ? '-8vh' : undefined }}>
              <div
                className={col.up ? 'baked-col-up' : 'baked-col-down'}
                style={{ ['--dur' as string]: `${col.dur}s`, animationPlayState: stopped ? 'paused' : 'running' }}
              >
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4" aria-hidden={dup === 1 || undefined}>
                    {col.tiles.map((t, ti) => (
                      <div key={ti} className="relative w-full overflow-hidden rounded-[10px] bg-[#f2f2f2] shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ aspectRatio: `1 / ${t.ratio}` }}>
                        <img
                          {...(t.frame ? { src: t.src } : IMG.tile(t.src))}
                          alt=""
                          loading={ti < 2 && dup === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Soft fade into the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

      <h1 className="sr-only">Salome Mosiava, Senior Product Designer and Art Director</h1>
      <PauseButton className="absolute left-2 bottom-24 sm:bottom-24 z-10" />
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-md bg-white/80 px-3 py-1.5 text-[13px] text-[#6f6f6f] backdrop-blur-md whitespace-nowrap">
        <span className="hidden sm:inline">Move to look around, scroll to open</span>
        <span className="sm:hidden">Scroll to open</span>
      </div>
    </section>
  );
}
