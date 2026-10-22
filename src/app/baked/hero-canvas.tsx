import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { IMG } from '../lib/cld';
import { adsBrands, motionReels } from './data';
import { spotlights } from './content';
import { useMotionPause, PauseButton } from './shell';
import { CtaLink, Lightbox, type LightboxItem } from './ui';
import { brandName, useI18n } from './i18n';

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

/** The same reel, scaled down for a small tile */
const smallVideo = (src: string) => src.replace('/video/upload/f_auto,q_auto/', '/video/upload/w_360,c_limit,q_auto,f_auto/');

/** full: what opens large; brand/logo: shown in the enlarged view */
type Tile = { src: string; ratio: number; frame?: boolean; video?: string; full: string; fullVideo?: boolean; brand: string; logo?: string; n: number };

function usePool(): Tile[] {
  return useMemo(() => {
    const ads: Tile[] = adsBrands.flatMap((b) =>
      b.items.filter((it) => it.type === 'image' && !it.fullWidth).map((it, i) => ({ src: it.src, ratio: i % 3 === 1 ? 1 : 1.25, full: it.src, brand: b.name, logo: b.logoImg, n: 0 }))
    );
    const spots: Tile[] = spotlights.map((s) => ({ src: s.img, ratio: 0.75, full: s.img, brand: s.title, n: 0 }));
    const frames: Tile[] = motionReels.map((r, i) => ({
      src: videoFrame(r.src, i % 2 ? '35p' : '60p'), ratio: 1.6, frame: true, video: smallVideo(r.src),
      full: r.src, fullVideo: true, brand: r.brand, logo: (r as { logoImg?: string }).logoImg, n: 0,
    }));
    // Interleave so neighbouring tiles differ in kind
    const out: Tile[] = [];
    const lists = [ads, frames, spots];
    let added = true;
    for (let k = 0; added; k++) {
      added = false;
      for (const l of lists) {
        // ads are plentiful: take two per round
        const take = l === ads ? [l[k * 2], l[k * 2 + 1]] : [l[k]];
        for (const t of take) if (t) { out.push({ ...t, n: out.length }); added = true; }
      }
    }
    return out;
  }, []);
}

export function HeroCanvas() {
  const { tx, ka } = useI18n();
  const pool = usePool();
  const [open, setOpen] = useState<number | null>(null);
  const lightbox: LightboxItem[] = useMemo(() => pool.map((t) => ({
    src: t.full, video: t.fullVideo, alt: brandName(t.brand, ka), brand: brandName(t.brand, ka), logo: t.logo,
  })), [pool, ka]);
  const { paused } = useMotionPause();
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(13);

  useEffect(() => {
    const set = () => setCols(window.innerWidth < 640 ? 7 : window.innerWidth < 1100 ? 10 : window.innerWidth < 1600 ? 13 : 15);
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
    <section ref={wrapRef} aria-label={tx('Selected work, moving canvas', 'ნამუშევრები, მოძრავი კანვასი')} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-white">
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        <div
          ref={planeRef}
          className="absolute left-1/2 top-1/2 flex gap-2 sm:gap-2.5"
          style={{
            width: cols * (cols === 7 ? 78 : 118),
            transform: 'translate(-50%, -50%) perspective(1800px) rotateX(14deg) rotateZ(-8deg) scale(1.08)',
          }}
        >
          {columns.map((col, ci) => (
            <div key={ci} className="flex-1 min-w-0 h-[150vh] overflow-hidden -my-[25vh]" style={{ marginTop: ci % 2 ? '-8vh' : undefined }}>
              <div
                className={col.up ? 'baked-col-up' : 'baked-col-down'}
                style={{ ['--dur' as string]: `${col.dur}s`, animationPlayState: stopped ? 'paused' : 'running' }}
              >
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex flex-col gap-2 sm:gap-2.5 pb-2 sm:pb-2.5" aria-hidden={dup === 1 || undefined}>
                    {col.tiles.map((t, ti) => (
                      <button
                        key={ti}
                        type="button"
                        tabIndex={dup === 1 ? -1 : 0}
                        onClick={() => setOpen(t.n)}
                        aria-label={`${tx('Open', 'გახსენი')} ${brandName(t.brand, ka)}`}
                        className="relative block w-full overflow-hidden rounded-md bg-[#f2f2f2] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:scale-[1.04] hover:z-10 outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]"
                        style={{ minHeight: 60 }}
                      >
                        {t.video ? (
                          <video
                            src={t.video}
                            poster={t.src}
                            muted loop playsInline autoPlay={!stopped}
                            preload="metadata"
                            ref={(v) => { if (v) { stopped ? v.pause() : v.play().catch(() => {}); } }}
                            className="block w-full h-auto"
                          />
                        ) : (
                          <img
                            {...IMG.tile(t.src)}
                            alt=""
                            loading={ti < 2 && dup === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            draggable={false}
                            className="block w-full h-auto"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />

      {/* Soft fade into the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

      <h1 className="sr-only">{tx('Salome Mosiava, Senior Product Designer and Art Director', 'სალომე მოსიავა, სენიორ პროდაქტ დიზაინერი და არტ დირექტორი')}</h1>
      {/* Centre call to action, sitting on the canvas */}
      <motion.div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ opacity }}>
        <CtaLink>
          <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
          {tx('Contact me', 'დამიკავშირდი')}
        </CtaLink>
      </motion.div>
      <PauseButton className="absolute left-2 bottom-24 sm:bottom-24 z-10" />
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 rounded-md bg-white/80 px-3 py-1.5 text-[13px] text-[#6f6f6f] backdrop-blur-md whitespace-nowrap">
        <span className="hidden sm:inline">{tx('Move to look around, scroll to open', 'კურსორით დაათვალიერე, სქროლით გახსენი')}</span>
        <span className="sm:hidden">{tx('Scroll to open', 'სქროლით გახსენი')}</span>
      </div>
    </section>
  );
}
