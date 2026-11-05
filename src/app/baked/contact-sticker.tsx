import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useI18n } from './i18n';

/*
 * A round sticker in the @areuli.design style: snake_case mono lettering
 * round the edge, a yellow desktop folder in the middle, folder blue behind.
 * It rides at the bottom right of the page and turns as you scroll; at the
 * end it settles on the page's rounded edge, just above the contact section
 * that comes up from below.
 */
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

export function ContactSticker() {
  const { tx, to } = useI18n();
  const ring = useRef<SVGGElement>(null);
  // it waits until the first section has scrolled away
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => setShown(window.scrollY > window.innerHeight * 0.85);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ring.current) ring.current.style.transform = `rotate(${(window.scrollY * 0.12) % 360}deg)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);

  const label = tx('lets_work_together ✦ contact_me ✦ ', 'ვითანამშრომლოთ ✦ მომწერე ✦ ');

  return (
    <div className="pointer-events-none sticky bottom-[84px] sm:bottom-6 z-[60] flex justify-end px-3 sm:px-6 -mt-[96px] sm:-mt-[124px] h-[96px] sm:h-[124px]">
      <Link
        to={to('/contact')}
        aria-label={tx('Contact me', 'მომწერე')}
        data-shown={shown || undefined}
        tabIndex={shown ? 0 : -1}
        className="cs pointer-events-auto block h-[84px] w-[84px] sm:h-[112px] sm:w-[112px] rounded-full outline-none focus-visible:shadow-[0_0_0_3px_#ff4306]"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <path id="cs-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
            <linearGradient id="cs-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd25e" />
              <stop offset="1" stopColor="#f6c03a" />
            </linearGradient>
          </defs>
          {/* sticker: white die-cut edge, folder-blue face */}
          <circle cx="100" cy="100" r="99" fill="#fff" />
          <circle cx="100" cy="100" r="93" fill="#111" />
          <g ref={ring} style={{ transformOrigin: '100px 100px', transition: 'transform .8s ease-out' }}>
            <text fill="#fff" fontSize="17.5" letterSpacing="1.4" style={{ fontFamily: MONO, fontWeight: 600 }}>
              <textPath href="#cs-circle" textLength="458" lengthAdjust="spacing">{label}</textPath>
            </text>
          </g>
          {/* the yellow desktop folder, as on @areuli.design */}
          <g className="cs-folder" transform="translate(64 70)">
            <path d="M5 4h20c2 0 3 .6 4.2 1.8L33 10h34c3 0 5 2 5 5v40c0 3-2 5-5 5H5c-3 0-5-2-5-5V9c0-3 2-5 5-5z" fill="#e5a91d" />
            <rect className="cs-paper" x="12" y="9" width="48" height="34" rx="2.5" fill="#fff" />
            <path className="cs-front" d="M5 17h62c3 0 5 2 5 5v33c0 3-2 5-5 5H5c-3 0-5-2-5-5V22c0-3 2-5 5-5z" fill="url(#cs-front)" />
            <path d="M5 17.8h62" stroke="rgba(255,255,255,.6)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      </Link>
      <style>{`
        .cs { opacity: 0; transform: scale(.6) rotate(-20deg); transition: transform .45s cubic-bezier(.3,1.6,.5,1), opacity .25s ease; filter: drop-shadow(0 8px 18px rgba(0,0,0,.18)); }
        .cs:not([data-shown]) { pointer-events: none; }
        .cs[data-shown] { opacity: 1; transform: none; }
        .cs[data-shown]:hover { transform: scale(1.06) rotate(-6deg); }
        .cs-paper { transition: transform .35s ease; }
        .cs-front { transition: transform .35s ease; transform-origin: 36px 60px; }
        .cs:hover .cs-paper { transform: translateY(-7px); }
        .cs:hover .cs-front { transform: skewX(-8deg) scaleY(.94); }
        @media (prefers-reduced-motion: reduce) { .cs, .cs-paper, .cs-front { transition: none; } }
      `}</style>
    </div>
  );
}
