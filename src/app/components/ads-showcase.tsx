import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  AdsShowcase                                                        */
/*  "Featured campaigns": one cover per brand on a horizontal track.   */
/*  Desktop: the section pins and vertical scrolling slides the track  */
/*  sideways (CSS view-timeline, no scroll listeners). Touch, reduced  */
/*  motion and browsers without scroll timelines get a native swipe    */
/*  row with snap points instead. Styles: styles/scroll-motion.css.    */
/* ------------------------------------------------------------------ */

type Brand = { name: string; items: { src: string; type: 'image' | 'video' }[] };

const F = {
  heading: '"Syne", "Space Grotesk", sans-serif',
  body: '"Manrope", "Inter", sans-serif',
};
const PIN_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 768px)';

/** Cloudinary covers at slide size (2x for retina) instead of the full image */
const thumb = (src: string, width = 640) => {
  const marker = '/image/upload/';
  const at = src.indexOf(marker);
  if (!src.includes('res.cloudinary.com') || at < 0) return src;
  const head = src.slice(0, at + marker.length);
  const rest = src.slice(at + marker.length);
  const size = `w_${width},c_limit`;
  // Keep existing transformations (f_auto,q_auto/...) and add the size to them
  return /^[a-z]_[^/]+\//.test(rest)
    ? head + rest.replace(/^([^/]+)\//, `$1,${size}/`)
    : `${head}f_auto,q_auto,${size}/${rest}`;
};
const supportsViewTimeline = () => typeof CSS !== 'undefined' && CSS.supports('view-timeline: --probe');

function usePinnedMode() {
  const reduceMotion = useReducedMotion();
  const [capable, setCapable] = useState(
    () => typeof window !== 'undefined' && supportsViewTimeline() && window.matchMedia(PIN_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setCapable(supportsViewTimeline() && mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return capable && !reduceMotion;
}

export function AdsShowcase({
  brands,
  isDark,
  onSelect,
}: {
  brands: Brand[];
  isDark: boolean;
  onSelect: (brandIndex: number) => void;
}) {
  const pinned = usePinnedMode();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  const slides = brands
    .map((b, index) => ({
      index,
      name: b.name.split(' · ')[0],
      cover: b.items.find((it) => it.type === 'image')?.src,
    }))
    .filter((s): s is { index: number; name: string; cover: string } => Boolean(s.cover));

  // How far the track travels; the pinned section is that much taller than the screen
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;
    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.setProperty('--hs-distance', `${distance}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(track);
    return () => ro.disconnect();
  }, [pinned, slides.length]);

  // Keyboard focus on a slide that is still off to the side: scroll the page
  // to the point where the pinned track shows it
  const revealSlide = (li: HTMLElement) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!pinned || !section || !track) return;
    const distance = parseFloat(getComputedStyle(section).getPropertyValue('--hs-distance')) || 0;
    if (!distance) return;
    const offset = Math.min(Math.max(li.offsetLeft - track.offsetLeft - 24, 0), distance);
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (offset / distance) * travel, behavior: 'auto' });
  };

  const nudge = (dir: 1 | -1) => {
    const viewport = viewportRef.current;
    viewport?.scrollBy({ left: dir * viewport.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const muted = isDark ? 'text-[#7a7d8a]' : 'text-zinc-500';
  const arrow = `w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
    isDark ? 'border-white/[0.08] text-white/60 hover:text-white hover:border-white/20' : 'border-zinc-200 text-zinc-500 hover:text-zinc-900'
  }`;

  return (
    <section
      ref={sectionRef}
      aria-label="Featured campaigns"
      className={`ads-showcase ${pinned ? 'is-pinned' : 'is-native'} mb-8`}
    >
      <div className="ads-showcase-frame">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#ed592b]" style={{ fontFamily: F.body, fontWeight: 600 }}>
              Featured campaigns
            </p>
            <p className={`text-[12px] mt-1 ${muted}`} style={{ fontFamily: F.body }}>
              {slides.length} brands · {pinned ? 'scroll to browse, click to open' : 'swipe to browse, tap to open'}
            </p>
          </div>
          {!pinned && (
            <div className="hidden pointer-fine:flex gap-1.5">
              <button type="button" className={arrow} onClick={() => nudge(-1)} aria-label="Previous campaigns">
                <ChevronLeft size={14} />
              </button>
              <button type="button" className={arrow} onClick={() => nudge(1)} aria-label="Next campaigns">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div ref={viewportRef} className="ads-showcase-viewport">
          <ol ref={trackRef} className="ads-showcase-track">
            {slides.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  className={`ads-slide ${isDark ? 'border-white/[0.06] bg-[#121318]' : 'border-zinc-200 bg-zinc-100'}`}
                  onClick={() => onSelect(s.index)}
                  onFocus={(e) => revealSlide(e.currentTarget.parentElement as HTMLElement)}
                  data-cursor="jump"
                  data-cursor-label={`View ${s.name}`}
                >
                  {/* Small thumbnails, all requested up front (low priority after
                      the first few) so slides never arrive blank mid-scroll */}
                  <img
                    src={thumb(s.cover)}
                    alt={`${s.name} campaign visual`}
                    loading="eager"
                    // lowercase attribute: React 18 does not know fetchPriority yet
                    {...{ fetchpriority: i < 4 ? 'auto' : 'low' }}
                    decoding="async"
                    draggable={false}
                  />
                  <span className="ads-slide-meta">
                    <span className="font-mono text-[10px] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[13px] text-white" style={{ fontFamily: F.heading, fontWeight: 600 }}>
                      {s.name}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div aria-hidden className={`ads-showcase-progress ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`}>
          <span />
        </div>
      </div>
    </section>
  );
}
