import { useEffect, useRef, useState } from 'react';
import { IBEX, WORD_KA, WORD_LAT, VB, KA_NODES, KA_HANDLES } from './dasturi-vectors';

/*
 * Motion pieces for the Dasturi case, in the spirit of motion brand
 * guidelines: the mark drawn from its construction, the wordmark's bezier
 * anatomy, the label family rising with a foil sheen. Each plays once when
 * it scrolls into view; with reduced motion everything is shown finished.
 */

const GOLD = '#C0A16D';
const IVORY = '#F0EADF';
const BORDEAUX = '#7A1C30';
const BLACK = '#191A17';

export const SERIF = '"Noto Serif Georgian", Georgia, serif';

/** true once the element has been on screen (or at once with reduced motion) */
export function useSeen<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* Keyframes shared by the pieces; scroll-linked ones only where supported */
export function MotionStyles() {
  return (
    <style>{`
.ds-draw{stroke-dasharray:1;stroke-dashoffset:1}
.ds-on .ds-draw{animation:ds-draw var(--d,2.4s) cubic-bezier(.65,0,.35,1) var(--delay,0s) forwards}
@keyframes ds-draw{to{stroke-dashoffset:0}}
.ds-fade{opacity:0}
.ds-on .ds-fade{animation:ds-fade .9s ease var(--delay,0s) forwards}
@keyframes ds-fade{to{opacity:1}}
.ds-pop{opacity:0;transform:scale(0);transform-box:fill-box;transform-origin:center}
.ds-on .ds-pop{animation:ds-pop .45s cubic-bezier(.2,1.6,.4,1) var(--delay,0s) forwards}
@keyframes ds-pop{to{opacity:1;transform:scale(1)}}
.ds-rise{opacity:0;transform:translateY(60px) rotate(var(--tilt,0deg))}
.ds-on .ds-rise{animation:ds-rise 1.1s cubic-bezier(.16,1,.3,1) var(--delay,0s) forwards}
@keyframes ds-rise{to{opacity:1;transform:translateY(0) rotate(0deg)}}
.ds-sheen{background:linear-gradient(105deg,transparent 35%,rgba(255,244,214,.55) 48%,rgba(255,255,255,.85) 50%,rgba(255,244,214,.55) 52%,transparent 65%);background-size:300% 100%;background-position:120% 0;mix-blend-mode:soft-light}
.ds-on .ds-sheen{animation:ds-sheen 4.5s ease-in-out calc(var(--delay,0s) + 1s) infinite}
@keyframes ds-sheen{0%{background-position:120% 0}55%,100%{background-position:-20% 0}}
.ds-wipe{clip-path:inset(100% 0 0 0)}
.ds-on .ds-wipe{animation:ds-wipe 1s cubic-bezier(.77,0,.18,1) var(--delay,0s) forwards}
@keyframes ds-wipe{to{clip-path:inset(0 0 0 0)}}
@supports (animation-timeline: view()){
  .ds-parallax{animation:ds-par linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
  @keyframes ds-par{from{transform:scale(1.14) translateY(-3%)}to{transform:scale(1.02) translateY(3%)}}
}
@media (prefers-reduced-motion: reduce){
  .ds-draw{stroke-dashoffset:0}.ds-fade,.ds-pop,.ds-rise{opacity:1;transform:none}.ds-wipe{clip-path:none}
  .ds-on .ds-draw,.ds-on .ds-fade,.ds-on .ds-pop,.ds-on .ds-rise,.ds-on .ds-wipe,.ds-on .ds-sheen,.ds-parallax{animation:none}
}
`}</style>
  );
}

/* ── 1. Construction: how the ibex is built ─────────────────────────── */

// Everything here is measured on the master artwork (803 x 1058 units):
// each circle is a least-squares fit to an arc that really is on the
// contour (max deviation under 1 unit), and the bright stroke marks the
// exact stretch of outline it matches.
const CIRCLES = [
  { cx: 441.4, cy: 184.3, r: 159.9, arc: 'M362.9 45.0A159.9 159.9 0 0 1 546.3 63.6', label: 'R 160', lx: 300, ly: 40 },
  { cx: 474.9, cy: 179.8, r: 82.0, arc: 'M532.3 121.1A82.0 82.0 0 0 0 407.6 132.9', label: 'R 82', lx: 450, ly: 240 },
  { cx: 394.9, cy: 136.5, r: 64.2, arc: 'M348.0 92.6A64.2 64.2 0 0 0 376.4 198.0', label: 'R 64', lx: 300, ly: 215 },
  { cx: 497.6, cy: 365.6, r: 111.4, arc: 'M584.7 296.2A111.4 111.4 0 0 1 606.0 391.1', label: 'R 111', lx: 665, ly: 425 },
  { cx: 355.4, cy: 627.7, r: 106.6, arc: 'M302.2 535.4A106.6 106.6 0 0 0 249.6 640.5', label: 'R 107', lx: 205, ly: 560 },
  { cx: 412.1, cy: 858.4, r: 54.2, arc: 'M409.7 912.5A54.2 54.2 0 0 1 360.9 840.8', label: '', lx: 0, ly: 0 },
  { cx: 106.6, cy: 822.9, r: 43.8, arc: 'M146.4 804.6A43.8 43.8 0 1 1 68.3 801.8', label: '', lx: 0, ly: 0 },
];
// Real extremes of the drawing
const IBEX_BOX = { x0: 226, y0: 26, x1: 662, y1: 684 };
const KA_TOP = 782, KA_BASE = 909; // Georgian wordmark
const LAT_TOP = 966, LAT_BASE = 1034; // DASTURI
const X = LAT_BASE - LAT_TOP; // 1X = cap height of DASTURI (68)
const BOX = { x0: 25, y0: 26, x1: 778, y1: 1034 }; // the whole lock-up

export function Construction() {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const m = X * 1.5; // margin around the clear-space frame
  const L = BOX.x0 - X - m, T = BOX.y0 - X - m, W = BOX.x1 - BOX.x0 + 2 * (X + m), Hh = BOX.y1 - BOX.y0 + 2 * (X + m);
  const nsk = { vectorEffect: 'non-scaling-stroke' as const };
  const corners = [[BOX.x0 - X, BOX.y0 - X], [BOX.x1, BOX.y0 - X], [BOX.x0 - X, BOX.y1], [BOX.x1, BOX.y1]];
  // module grid in 1X steps, starting on the lock-up's own edge so every cell lines up with it
  const cols: number[] = []; for (let x = BOX.x0 - 2 * X; x <= BOX.x1 + 2 * X; x += X / 2) cols.push(x);
  const rows: number[] = []; for (let y = BOX.y0 - 2 * X; y <= BOX.y1 + 2 * X; y += X / 2) rows.push(y);
  const hGuides = [IBEX_BOX.y0, IBEX_BOX.y1, KA_TOP, KA_BASE, LAT_TOP, LAT_BASE];
  const vGuides = [IBEX_BOX.x0, IBEX_BOX.x1, BOX.x0, BOX.x1];
  const del = (s: number) => ({ ['--delay' as string]: `${s}s` });

  return (
    <div ref={ref} className={`relative ${on ? 'ds-on' : ''}`}>
      <svg viewBox={`${L} ${T} ${W} ${Hh}`} className="block w-full h-auto" role="img" aria-label="დასტურის ნიშნის კონსტრუქცია: რკალები, ხაზები და თავისუფალი სივრცე">
        {/* half-X module grid */}
        <g className="ds-fade" style={del(0)} stroke={IVORY} strokeOpacity={0.07}>
          {cols.map((x) => <line key={`c${x}`} x1={x} x2={x} y1={T} y2={T + Hh} style={nsk} />)}
          {rows.map((y) => <line key={`r${y}`} y1={y} y2={y} x1={L} x2={L + W} style={nsk} />)}
        </g>

        {/* clear space */}
        <g className="ds-fade" style={del(1.4)}>
          {corners.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width={X} height={X} fill={BORDEAUX} fillOpacity={0.6} />)}
          <rect x={BOX.x0 - X} y={BOX.y0 - X} width={BOX.x1 - BOX.x0 + 2 * X} height={BOX.y1 - BOX.y0 + 2 * X} fill="none" stroke={IVORY} strokeOpacity={0.3} style={nsk} />
          <rect x={BOX.x0} y={BOX.y0} width={BOX.x1 - BOX.x0} height={BOX.y1 - BOX.y0} fill="none" stroke={GOLD} strokeOpacity={0.55} strokeDasharray="5 5" style={nsk} />
          {corners.map(([x, y]) => (
            <text key={`t${x}${y}`} x={x + X / 2} y={y + X / 2 + 8} textAnchor="middle" fontSize={22} fill={IVORY} fontFamily="Avenir Next Georgian, sans-serif">1X</text>
          ))}
        </g>

        {/* guides on the drawing's real extremes */}
        {hGuides.map((y, i) => (
          <line key={`h${y}`} x1={L} x2={L + W} y1={y} y2={y} stroke="#7fb2ff" strokeOpacity={0.6} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.2s', ...del(0.4 + i * 0.1), ...nsk }} />
        ))}
        {vGuides.map((x, i) => (
          <line key={`v${x}`} y1={T} y2={T + Hh} x1={x} x2={x} stroke="#7fb2ff" strokeOpacity={0.6} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.2s', ...del(0.6 + i * 0.1), ...nsk }} />
        ))}

        {/* the mark: faint fill, then its outline drawing itself */}
        <g className="ds-fade" style={del(2)} fill={GOLD} fillOpacity={0.14} fillRule="evenodd"><path d={IBEX} /><path d={WORD_KA} /><path d={WORD_LAT} /></g>
        <g stroke={GOLD} strokeWidth={1.3} fill="none" fillRule="evenodd">
          <path d={IBEX} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '3s', ...del(0.2), ...nsk }} />
          <path d={WORD_KA} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2.4s', ...del(0.9), ...nsk }} />
          <path d={WORD_LAT} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2s', ...del(1.2), ...nsk }} />
        </g>

        {/* fitted circles, each with the stretch of outline it matches */}
        {CIRCLES.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke={IVORY} strokeOpacity={0.45} pathLength={1} className="ds-draw" transform={`rotate(-90 ${c.cx} ${c.cy})`} style={{ ['--d' as string]: '1.4s', ...del(2.2 + i * 0.18), ...nsk }} />
            <path d={c.arc} fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" className="ds-fade" style={{ ...del(3 + i * 0.18), ...nsk }} />
            <g className="ds-fade" style={del(3.1 + i * 0.18)} stroke={IVORY} strokeOpacity={0.7}>
              <line x1={c.cx - 7} x2={c.cx + 7} y1={c.cy} y2={c.cy} style={nsk} />
              <line x1={c.cx} x2={c.cx} y1={c.cy - 7} y2={c.cy + 7} style={nsk} />
            </g>
            {c.label && (
              <text x={c.lx} y={c.ly} fontSize={21} fill={IVORY} textAnchor="middle" fontFamily="Avenir Next Georgian, sans-serif" className="ds-fade" style={del(3.3 + i * 0.18)}>{c.label}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── 2. Wordmark anatomy: bezier points and handles ─────────────────── */

// Only the points that shape the letters: long handles on the main curves,
// one anchor per spot; the tiny serif corners stay out so it reads calmly.
const MIN_HANDLE = 18;
const HANDLES = KA_HANDLES.filter(([a, b, c, d]) => Math.hypot(c - a, d - b) >= MIN_HANDLE);
const NODES = (() => {
  const keep: number[][] = [];
  for (const [x, y] of HANDLES.map(([a, b]) => [a, b])) {
    if (!keep.some(([kx, ky]) => Math.hypot(kx - x, ky - y) < 14)) keep.push([x, y]);
  }
  return keep.filter(([x, y]) => KA_NODES.some(([nx, ny]) => Math.hypot(nx - x, ny - y) < 1.5));
})();

export function Anatomy() {
  const [ref, on] = useSeen<HTMLDivElement>(0.35);
  // crop to the Georgian wordmark with room for the notes
  const vb = `0 ${KA_TOP - 70} ${VB.w} ${KA_BASE - KA_TOP + 140}`;
  const minX = 20, maxX = 790;
  const delay = (x: number) => `${0.9 + ((x - minX) / (maxX - minX)) * 1.6}s`;

  return (
    <div ref={ref} className={`relative ${on ? 'ds-on' : ''}`}>
      <svg viewBox={vb} className="block w-full h-auto" role="img" aria-label="სიტყვანიშანი დასტური ბეზიეს წერტილებით">
        {[KA_TOP, KA_BASE].map((y, i) => (
          <line key={y} x1={0} x2={VB.w} y1={y} y2={y} stroke={IVORY} strokeOpacity={0.35} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.2s', ['--delay' as string]: `${i * 0.15}s`, vectorEffect: 'non-scaling-stroke' }} />
        ))}
        <path d={WORD_KA} fill={IVORY} fillOpacity={0.07} fillRule="evenodd" className="ds-fade" style={{ ['--delay' as string]: '2.6s' }} />
        <path d={WORD_KA} fill="none" stroke={IVORY} strokeWidth={1.2} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2.4s', ['--delay' as string]: '.3s', vectorEffect: 'non-scaling-stroke' }} />
        <g stroke={GOLD} strokeOpacity={0.7}>
          {HANDLES.map(([x1, y1, x2, y2], i) => (
            <g key={i} className="ds-fade" style={{ ['--delay' as string]: delay(x1) }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ vectorEffect: 'non-scaling-stroke' }} />
              <circle cx={x2} cy={y2} r={1.4} fill={GOLD} stroke="none" />
            </g>
          ))}
        </g>
        <g fill={GOLD}>
          {NODES.map(([x, y], i) => (
            <rect key={i} x={x - 2.5} y={y - 2.5} width={5} height={5} className="ds-pop" style={{ ['--delay' as string]: delay(x) }} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ── 3. The family: five labels rise, gold foil catches the light ───── */

export function LabelRow({ edition, tone = 'light' }: { edition: 'gold' | 'bordeaux'; tone?: 'light' | 'dark' }) {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const ids = ['saperavi', 'manavi', 'kisi', 'satsuri', 'tsolikouri'];
  const names = ['საფერავი', 'მანავის მწვანე', 'ქისი', 'საწური', 'ცოლიკაური'];
  return (
    <div ref={ref} className={`grid grid-cols-5 gap-[1.6%] ${on ? 'ds-on' : ''}`}>
      {ids.map((id, i) => (
        <figure key={id} className="ds-rise group" style={{ ['--delay' as string]: `${i * 0.12}s`, ['--tilt' as string]: `${(i - 2) * 2}deg` }}>
          <div className="relative overflow-hidden shadow-[0_28px_50px_-20px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:-translate-y-2">
            <img src={`/cases/dasturi/labels/${id}-${edition}.jpg`} alt={`${names[i]}, ${edition === 'gold' ? 'ოქროსფერი' : 'ბორდოსფერი'} ეტიკეტი`} width={554} height={1000} loading="lazy" className="block w-full h-auto" />
            <div className="ds-sheen absolute inset-0 pointer-events-none" style={{ ['--delay' as string]: `${i * 0.25}s` }} />
          </div>
          <figcaption className="mt-3 text-center text-[12px] sm:text-[14px]" style={{ fontFamily: SERIF, color: tone === 'dark' ? 'rgba(240,234,223,.7)' : BLACK }}>{names[i]}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ── 4. Colour wipes in, one swatch after another ───────────────────── */

export function Swatches({ items }: { items: { name: string; ka: string; role: string; hex: string; ink: string }[] }) {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`grid grid-cols-2 lg:grid-cols-4 gap-2 ${on ? 'ds-on' : ''}`}>
      {items.map((c, i) => (
        <div key={c.hex} className="ds-wipe aspect-[4/5] lg:aspect-[3/4] p-5 sm:p-6 flex flex-col justify-between rounded-[4px] ring-1 ring-inset ring-white/10" style={{ background: c.hex, color: c.ink, ['--delay' as string]: `${i * 0.14}s` }}>
          <div className="text-[14px] opacity-75">{c.ka}<br /><span className="opacity-70">{c.role}</span></div>
          <div>
            <div className="text-[24px] sm:text-[30px] leading-[1.05]" style={{ fontFamily: '"Marcellus", Georgia, serif' }}>{c.name}</div>
            <div className="mt-2 text-[13px] tabular-nums opacity-70">{c.hex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
