import { useEffect, useRef, useState } from 'react';
import { IBEX, WORD_KA, WORD_LAT, VB, KA_NODES, KA_HANDLES, IBEX_NODES } from './dasturi-vectors';

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

// Geometry measured on the vectorised mark (803 x 1058 units)
const HORN_OUT = { cx: 436.2, cy: 149.5, r: 129 };
const HORN_IN = { cx: 467, cy: 136.2, r: 65.5 };
const GROUND = 684; // hooves
const KA_TOP = 782, KA_BASE = 909; // Georgian wordmark
const LAT_TOP = 966, LAT_BASE = 1034; // DASTURI
const X = LAT_BASE - LAT_TOP; // 1X = cap height of DASTURI
const BOX = { x0: 25, y0: 26, x1: 778, y1: 1034 }; // the mark's bounds

export function Construction() {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const pad = X * 1.6;
  const vb = `${BOX.x0 - X - pad} ${BOX.y0 - X - pad} ${BOX.x1 - BOX.x0 + 2 * (X + pad)} ${BOX.y1 - BOX.y0 + 2 * (X + pad)}`;
  const line = { vectorEffect: 'non-scaling-stroke' as const, fill: 'none' };
  const corners = [
    [BOX.x0 - X, BOX.y0 - X], [BOX.x1, BOX.y0 - X], [BOX.x0 - X, BOX.y1], [BOX.x1, BOX.y1],
  ];
  const hLines = [
    { y: GROUND, t: 'ჩლიქები' }, { y: KA_TOP, t: '' }, { y: KA_BASE, t: 'ფუძის ხაზი' }, { y: LAT_TOP, t: '' }, { y: LAT_BASE, t: '' },
  ];

  return (
    <div ref={ref} className={`relative ${on ? 'ds-on' : ''}`}>
      <svg viewBox={vb} className="block w-full h-auto" role="img" aria-label="დასტურის ნიშნის კონსტრუქცია: რქების წრეები, ხაზები და თავისუფალი სივრცე">
        {/* fine grid */}
        <g className="ds-fade" style={{ ['--delay' as string]: '0s' }} stroke={IVORY} strokeOpacity={0.06}>
          {Array.from({ length: 40 }, (_, i) => BOX.x0 - X - pad + i * (X / 1)).map((x) => <line key={`v${x}`} x1={x} x2={x} y1={-400} y2={1500} {...line} />)}
          {Array.from({ length: 40 }, (_, i) => BOX.y0 - X - pad + i * X).map((y) => <line key={`h${y}`} y1={y} y2={y} x1={-400} x2={1300} {...line} />)}
        </g>

        {/* clear space: 1X on every side */}
        <g className="ds-fade" style={{ ['--delay' as string]: '1.6s' }}>
          {corners.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width={X} height={X} fill={BORDEAUX} fillOpacity={0.55} />)}
          <rect x={BOX.x0} y={BOX.y0} width={BOX.x1 - BOX.x0} height={BOX.y1 - BOX.y0} stroke={GOLD} strokeOpacity={0.5} strokeDasharray="6 6" {...line} />
          <rect x={BOX.x0 - X} y={BOX.y0 - X} width={BOX.x1 - BOX.x0 + 2 * X} height={BOX.y1 - BOX.y0 + 2 * X} stroke={IVORY} strokeOpacity={0.25} {...line} />
          {corners.map(([x, y]) => (
            <text key={`t${x}${y}`} x={x + X / 2} y={y + X / 2 + 9} textAnchor="middle" fontSize={26} fill={IVORY} fontFamily="Avenir Next Georgian, sans-serif">1X</text>
          ))}
        </g>

        {/* the mark, faint, so the lines read on top */}
        <g className="ds-fade" style={{ ['--delay' as string]: '2.2s' }} fill={GOLD} fillOpacity={0.16} fillRule="evenodd">
          <path d={IBEX} /><path d={WORD_KA} /><path d={WORD_LAT} />
        </g>
        {/* the outline drawing itself */}
        <g stroke={GOLD} strokeWidth={1.4} fill="none" fillRule="evenodd" style={{ vectorEffect: 'non-scaling-stroke' }}>
          <path d={IBEX} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '3.2s', ['--delay' as string]: '.2s', vectorEffect: 'non-scaling-stroke' }} />
          <path d={WORD_KA} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2.6s', ['--delay' as string]: '1s', vectorEffect: 'non-scaling-stroke' }} />
          <path d={WORD_LAT} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2s', ['--delay' as string]: '1.4s', vectorEffect: 'non-scaling-stroke' }} />
        </g>

        {/* horns: two almost concentric circles */}
        <g stroke={IVORY} strokeOpacity={0.8} fill="none">
          <circle cx={HORN_OUT.cx} cy={HORN_OUT.cy} r={HORN_OUT.r} pathLength={1} className="ds-draw" transform={`rotate(-90 ${HORN_OUT.cx} ${HORN_OUT.cy})`} style={{ ['--d' as string]: '1.6s', ['--delay' as string]: '2s', vectorEffect: 'non-scaling-stroke' }} />
          <circle cx={HORN_IN.cx} cy={HORN_IN.cy} r={HORN_IN.r} pathLength={1} className="ds-draw" transform={`rotate(-90 ${HORN_IN.cx} ${HORN_IN.cy})`} style={{ ['--d' as string]: '1.3s', ['--delay' as string]: '2.4s', vectorEffect: 'non-scaling-stroke' }} />
          <g className="ds-fade" style={{ ['--delay' as string]: '3.2s' }}>
            <line x1={HORN_OUT.cx - 10} x2={HORN_OUT.cx + 10} y1={HORN_OUT.cy} y2={HORN_OUT.cy} {...line} />
            <line y1={HORN_OUT.cy - 10} y2={HORN_OUT.cy + 10} x1={HORN_OUT.cx} x2={HORN_OUT.cx} {...line} />
            <line x1={HORN_OUT.cx} y1={HORN_OUT.cy} x2={HORN_OUT.cx - HORN_OUT.r * 0.707} y2={HORN_OUT.cy - HORN_OUT.r * 0.707} strokeDasharray="4 4" {...line} />
          </g>
        </g>

        {/* horizontal guides */}
        {hLines.map((h, i) => (
          <line key={h.y} x1={BOX.x0 - X - pad} x2={BOX.x1 + X + pad} y1={h.y} y2={h.y} stroke="#6fa9ff" strokeOpacity={0.55} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.4s', ['--delay' as string]: `${0.6 + i * 0.12}s`, vectorEffect: 'non-scaling-stroke' }} />
        ))}

        {/* nodes along the ibex */}
        <g fill={GOLD}>
          {IBEX_NODES.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
            <rect key={i} x={x - 4} y={y - 4} width={8} height={8} className="ds-pop" style={{ ['--delay' as string]: `${2.6 + (y / VB.h) * 1.2}s` }} />
          ))}
        </g>

        {/* annotations */}
        <g className="ds-fade" fontFamily="Avenir Next Georgian, sans-serif" fill={IVORY} style={{ ['--delay' as string]: '3.4s' }}>
          <text x={HORN_OUT.cx - HORN_OUT.r * 0.707 - 18} y={HORN_OUT.cy - HORN_OUT.r * 0.707 - 16} fontSize={24} textAnchor="end">R 129</text>
          <text x={HORN_IN.cx - 20} y={HORN_OUT.cy + HORN_OUT.r + 34} fontSize={24} textAnchor="middle">R 65</text>
          <text x={BOX.x0 - X - pad + 10} y={GROUND - 12} fontSize={22} fillOpacity={0.7}>ჩლიქები</text>
          <text x={BOX.x0 - X - pad + 10} y={KA_BASE - 12} fontSize={22} fillOpacity={0.7}>ფუძე</text>
        </g>
      </svg>
    </div>
  );
}

/* ── 2. Wordmark anatomy: bezier points and handles ─────────────────── */

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
          {KA_HANDLES.map(([x1, y1, x2, y2], i) => (
            <g key={i} className="ds-fade" style={{ ['--delay' as string]: delay(x1) }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ vectorEffect: 'non-scaling-stroke' }} />
              <circle cx={x2} cy={y2} r={1.4} fill={GOLD} stroke="none" />
            </g>
          ))}
        </g>
        <g fill={GOLD}>
          {KA_NODES.map(([x, y], i) => (
            <rect key={i} x={x - 2} y={y - 2} width={4} height={4} className="ds-pop" style={{ ['--delay' as string]: delay(x) }} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ── 3. The family: five labels rise, gold foil catches the light ───── */

export function LabelRow({ edition }: { edition: 'gold' | 'bordeaux' }) {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const ids = ['saperavi', 'manavi', 'kisi', 'satsuri', 'tsolikouri'];
  const names = ['საფერავი', 'მანავის მწვანე', 'ქისი', 'საწური', 'ცოლიკაური'];
  return (
    <div ref={ref} className={`grid grid-cols-5 gap-[1.6%] ${on ? 'ds-on' : ''}`}>
      {ids.map((id, i) => (
        <figure key={id} className="ds-rise group" style={{ ['--delay' as string]: `${i * 0.12}s`, ['--tilt' as string]: `${(i - 2) * 2}deg` }}>
          <div className="relative overflow-hidden shadow-[0_24px_40px_-18px_rgba(25,26,23,0.55)] transition-transform duration-500 group-hover:-translate-y-2">
            <img src={`/cases/dasturi/labels/${id}-${edition}.jpg`} alt={`${names[i]}, ${edition === 'gold' ? 'ოქროსფერი' : 'ბორდოსფერი'} ეტიკეტი`} width={554} height={1000} loading="lazy" className="block w-full h-auto" />
            <div className="ds-sheen absolute inset-0 pointer-events-none" style={{ ['--delay' as string]: `${i * 0.25}s` }} />
          </div>
          <figcaption className="mt-3 text-center text-[12px] sm:text-[14px]" style={{ fontFamily: SERIF, color: BLACK }}>{names[i]}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ── 4. Colour wipes in, one swatch after another ───────────────────── */

export function Swatches({ items }: { items: { name: string; ka: string; role: string; hex: string; ink: string }[] }) {
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`grid grid-cols-2 lg:grid-cols-4 ${on ? 'ds-on' : ''}`} style={{ background: BLACK }}>
      {items.map((c, i) => (
        <div key={c.hex} className="ds-wipe aspect-[4/5] lg:aspect-[3/4] p-5 sm:p-7 flex flex-col justify-between" style={{ background: c.hex, color: c.ink, ['--delay' as string]: `${i * 0.14}s` }}>
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
