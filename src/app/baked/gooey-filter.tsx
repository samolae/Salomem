import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

/*
 * The case filter as ink: a black pill holds the number of cases. Choosing a
 * tag sends its chip into the pill, where it melts in like a drop of ink and
 * the number rolls to the new total. Choosing it again pulls it free, with a
 * short stretch before it lets go, and it flies back to its place in the row.
 *
 * The melt is an SVG "goo" filter on the pill's group only: blur, then a hard
 * alpha threshold, so shapes that come close grow a neck and join. The sharp
 * chips are composited back on top ("atop"), so the words never blur. Chips
 * in the row sit outside the filter and keep the site's outlined style.
 */
const GOO = 'samole-goo';

export function GooeyFilter({ tags, value, onChange, label, count, unit, allLabel }: {
  tags: string[];
  value: string | null;
  onChange: (t: string | null) => void;
  label: (t: string) => string;
  count: number;
  unit: (n: number) => string;
  allLabel: string;
}) {
  const reduce = useReducedMotion();
  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.8 };
  // the chip being pulled out: it stretches away from the pill before the filter clears
  const [leaving, setLeaving] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const release = () => {
    if (!value) return;
    if (reduce) { onChange(null); return; }
    setLeaving(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setLeaving(null); onChange(null); }, 170);
  };
  const choose = (t: string) => { window.clearTimeout(timer.current); setLeaving(null); onChange(t); };

  return (
    <LayoutGroup id="case-filter">
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          {/* wide region: a chip flying in from the far end of the row must not be clipped */}
          <filter id={GOO} x="-1000%" y="-60%" width="2100%" height="220%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="px-1.5 pb-8 -mt-2 pt-2 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label={allLabel}>
        {/* the pill and whatever has melted into it: the only part under the goo filter */}
        <motion.div layout="position" transition={spring} className="flex shrink-0 items-center gap-[3px] py-2 pr-2" style={{ filter: `url(#${GOO})` }}>
          <button type="button" onClick={release} aria-label={value ? allLabel : undefined}
            className="relative inline-flex items-center gap-1.5 h-9 pl-4 pr-4 rounded-full bg-[#111] text-white text-[13px] leading-none whitespace-nowrap outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111]">
            <Roll n={count} spring={spring} />
            <span>{unit(count)}</span>
          </button>
          <AnimatePresence mode="popLayout" initial={false}>
            {value && (
              <motion.button key={value} type="button" layoutId={`chip-${value}`} layout="position"
                onClick={release} aria-pressed="true"
                animate={{ x: leaving === value ? 14 : 0 }}
                transition={spring}
                className="inline-flex items-center gap-1.5 h-9 pl-3.5 pr-3 rounded-full bg-[#111] text-white text-[13px] leading-none whitespace-nowrap outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111]">
                {label(value)}
                <X size={13} strokeWidth={2.2} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {tags.filter((t) => t !== value).map((t) => (
          <motion.button key={t} type="button" layoutId={`chip-${t}`} layout="position" transition={spring}
            onClick={() => choose(t)} aria-pressed="false"
            className="shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-[13px] leading-none whitespace-nowrap border border-[#111]/80 text-[#111] transition-colors hover:bg-[#111] hover:text-white outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111]">
            {label(t)}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}

/** the count, rolling up or down to its new value */
function Roll({ n, spring }: { n: number; spring: object }) {
  const prev = useRef(n);
  const dir = n >= prev.current ? 1 : -1;
  useEffect(() => { prev.current = n; }, [n]);
  return (
    <span className="relative inline-flex h-[1.15em] overflow-hidden tabular-nums" style={{ fontWeight: 600 }}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span key={n} custom={dir}
          variants={{ enter: (d: number) => ({ y: `${d * 100}%` }), center: { y: '0%' }, exit: (d: number) => ({ y: `${-d * 100}%` }) }}
          initial="enter" animate="center" exit="exit" transition={spring} className="block leading-[1.15em]">
          {n}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
