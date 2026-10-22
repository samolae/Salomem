import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

/*
 * Heart wall — frames pulled from the motion reels rise out of the dark and
 * gather into a pixel heart, hold for a beat, then burst outward into a wall.
 * Every frame on the wall opens the reel it came from.
 *
 * Frames come straight from Cloudinary: a video URL with a start offset
 * (so_NNp) and a .jpg extension returns a still from that point in the clip.
 */

export type HeartReel = { src: string; brand: string };

type Props = {
  reels: HeartReel[];
  isDark: boolean;
  replayLabel?: string;
  onOpen: (reelIndex: number) => void;
};

// Hand-drawn 11×9 heart, every row a palindrome so the lobes match
const HEART = [
  '..XXX.XXX..',
  '.XXXXXXXXX.',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  '.XXXXXXXXX.',
  '..XXXXXXX..',
  '...XXXXX...',
  '....XXX....',
  '.....X.....',
];
const HEART_CELLS: { c: number; r: number }[] = [];
HEART.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'X') HEART_CELLS.push({ c, r }); }));
const HC = HEART[0].length;
const HR = HEART.length;

const OFFSETS = ['12p', '32p', '52p', '72p', '90p'];

/** A still from a Cloudinary video at a percentage offset */
const frameUrl = (src: string, offset: string, width = 360) => {
  const mark = '/video/upload/';
  const at = src.indexOf(mark);
  if (at < 0) return src;
  let rest = src.slice(at + mark.length);
  const first = rest.split('/')[0];
  if (!first.startsWith('v1') && /^[a-z]{1,3}_/.test(first)) rest = rest.slice(first.length + 1);
  return `${src.slice(0, at + mark.length)}so_${offset},w_${width},c_limit,q_auto,f_auto/${rest.replace(/\.(mp4|mov|webm)$/i, '.jpg')}`;
};

// Small seeded random so the wall is the same on every visit and SSR
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Phase = 'dark' | 'heart' | 'wall';

export const HeartWall = ({ reels, isDark, onOpen, replayLabel = 'Replay' }: Props) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [phase, setPhase] = useState<Phase>('dark');
  const [run, setRun] = useState(0);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // One tile per heart cell, frames dealt round-robin across the reels
  const tiles = useMemo(() => HEART_CELLS.map((cell, i) => {
    const reelIndex = i % reels.length;
    const offset = OFFSETS[Math.floor(i / reels.length) % OFFSETS.length];
    return { ...cell, i, reelIndex, img: frameUrl(reels[reelIndex].src, offset) };
  }), [reels]);

  // Sequence: dark → heart → wall
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) { setPhase('wall'); return; }
    setPhase('dark');
    const t1 = setTimeout(() => setPhase('heart'), 120);
    const t2 = setTimeout(() => setPhase('wall'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, reduceMotion, run]);

  // ── Layouts ────────────────────────────────────────────────────────
  const W = width || 720;
  const wallCols = W >= 640 ? 9 : 6;
  const gap = W >= 640 ? 6 : 4;
  const wallW = (W - gap * (wallCols - 1)) / wallCols;
  const wallH = wallW * 1.25;
  const wallRows = Math.ceil(tiles.length / wallCols);
  const stageH = Math.max(wallRows * (wallH + gap) - gap, 360);

  const heartCell = Math.min((stageH * 0.82) / HR, (W * 0.82) / HC);
  const heartGap = Math.max(2, heartCell * 0.06);
  const heartLeft = (W - HC * heartCell) / 2;
  const heartTop = (stageH - HR * heartCell) / 2;

  // Wall slots ordered from the centre outward, so the burst reads as one
  const slots = useMemo(() => {
    const s: { x: number; y: number; d: number }[] = [];
    for (let r = 0; r < wallRows; r++) for (let c = 0; c < wallCols; c++) {
      const x = c * (wallW + gap);
      const y = r * (wallH + gap);
      s.push({ x, y, d: Math.hypot(x + wallW / 2 - W / 2, y + wallH / 2 - stageH / 2) });
    }
    return s.sort((a, b) => a.d - b.d);
  }, [wallRows, wallCols, wallW, wallH, gap, W, stageH]);

  // Tiles nearest the heart's centre take the slots nearest the stage centre
  const order = useMemo(() => {
    const cx = (HC - 1) / 2, cy = (HR - 1) / 2.6;
    return [...tiles].sort((a, b) => Math.hypot(a.c - cx, a.r - cy) - Math.hypot(b.c - cx, b.r - cy)).map((t) => t.i);
  }, [tiles]);
  const slotOf = useMemo(() => {
    const m = new Map<number, number>();
    order.forEach((tileIdx, k) => m.set(tileIdx, k));
    return m;
  }, [order]);

  const bg = isDark ? '#060608' : '#f2f2f2';

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-md"
        style={{ height: stageH, background: bg }}
      >
        {tiles.map((t) => {
          const k = slotOf.get(t.i) ?? t.i;
          const slot = slots[k] ?? slots[0];
          const depth = 0.88 + rand(t.i) * 0.12;
          const heart = {
            x: heartLeft + t.c * heartCell + heartGap / 2,
            y: heartTop + t.r * heartCell + heartGap / 2,
            width: heartCell - heartGap,
            height: heartCell - heartGap,
          };
          const wall = {
            x: slot.x + (wallW * (1 - depth)) / 2,
            y: slot.y + (wallH * (1 - depth)) / 2,
            width: wallW * depth,
            height: wallH * depth,
          };
          const target =
            phase === 'dark' ? { ...heart, y: heart.y + stageH * 0.6, opacity: 0 }
            : phase === 'heart' ? { ...heart, opacity: 1 }
            : { ...wall, opacity: 1 };
          const delay =
            phase === 'heart' ? t.r * 0.11 + rand(t.i + 7) * 0.12
            : phase === 'wall' ? (k / tiles.length) * 0.5
            : 0;
          return (
            <motion.button
              key={t.i}
              type="button"
              disabled={phase !== 'wall'}
              onClick={() => onOpen(t.reelIndex)}
              data-cursor="play"
              data-cursor-label="Play with sound"
              aria-label={`Watch ${reels[t.reelIndex].brand.split(' · ')[0]} reel`}
              tabIndex={phase === 'wall' ? 0 : -1}
              className="group absolute left-0 top-0 overflow-hidden rounded-[3px] outline-none focus-visible:shadow-[0_0_0_2px_rgba(255,67,6,0.9)] disabled:cursor-default"
              initial={false}
              animate={target}
              whileHover={phase === 'wall' ? { scale: 1.08, zIndex: 5 } : undefined}
              transition={{
                type: 'spring',
                stiffness: phase === 'wall' ? 70 : 90,
                damping: phase === 'wall' ? 16 : 18,
                mass: 1,
                delay,
                opacity: { duration: 0.5, delay },
              }}
              style={{ background: isDark ? '#15161b' : '#e6e6e6', willChange: 'transform, width, height' }}
            >
              <img
                src={t.img}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Further frames sit a little deeper in the dark */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 group-hover:opacity-0"
                style={{ opacity: isDark && phase === 'wall' ? (1 - depth) * 3 : 0 }}
              />
            </motion.button>
          );
        })}

        {phase === 'wall' && !reduceMotion && (
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-white/90 text-[14px] text-[#111] backdrop-blur-md transition-colors hover:bg-[#ffe7de] hover:text-[#b52f03] focus-visible:shadow-[0_0_0_2px_#ff4306] outline-none"
          >
            <RotateCcw size={13} /> {replayLabel}
          </button>
        )}
      </div>
    </div>
  );
};
