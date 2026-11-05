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
            {/* brand orange, lit from above so the folder has body */}
            <linearGradient id="cs-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e2470f" />
              <stop offset="1" stopColor="#a92b02" />
            </linearGradient>
            <linearGradient id="cs-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff8a52" />
              <stop offset=".45" stopColor="#ff5a1a" />
              <stop offset="1" stopColor="#e03a03" />
            </linearGradient>
            <linearGradient id="cs-paper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#e9e6e1" />
            </linearGradient>
            <radialGradient id="cs-shine" cx=".3" cy="0" r=".9">
              <stop offset="0" stopColor="#fff" stopOpacity=".45" />
              <stop offset=".6" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <filter id="cs-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          {/* sticker: white die-cut edge, black face */}
          <circle cx="100" cy="100" r="99" fill="#fff" />
          <circle cx="100" cy="100" r="93" fill="#111" />
          <g ref={ring} style={{ transformOrigin: '100px 100px', transition: 'transform .8s ease-out' }}>
            <text fill="#fff" fontSize="17.5" letterSpacing="1.4" style={{ fontFamily: MONO, fontWeight: 600 }}>
              <textPath href="#cs-circle" textLength="458" lengthAdjust="spacing">{label}</textPath>
            </text>
          </g>
          {/* the desktop folder, as on @areuli.design, in brand orange */}
          <g className="cs-folder" transform="translate(55 60) scale(1.25)">
            <ellipse cx="36" cy="63" rx="31" ry="4.5" fill="#000" opacity=".55" filter="url(#cs-soft)" />
            <path d="M6 3h19.5c2.2 0 3.4.7 4.7 2L34 9h32c3.3 0 6 2.7 6 6v40c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6V9c0-3.3 2.7-6 6-6z" fill="url(#cs-back)" />
            <path d="M6 3.6h19.5c2 0 3 .6 4.3 1.8L33.6 9.6" fill="none" stroke="#ff9a6b" strokeOpacity=".55" strokeWidth=".9" />
            <g className="cs-paper">
              <rect x="13" y="11" width="46" height="34" rx="2.5" fill="#d9d4cc" transform="rotate(-4 36 28)" />
              <rect x="11" y="8.5" width="50" height="35" rx="2.5" fill="url(#cs-paper)" />
              <path d="M17 16h28M17 21h22" stroke="#cfc8be" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <path d="M6 18h60c3.3 0 6 2.7 6 6v31c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6V24c0-3.3 2.7-6 6-6z" fill="#7a1f00" opacity=".35" transform="translate(0 -1.4)" />
            <g className="cs-front">
              <path d="M6 18h60c3.3 0 6 2.7 6 6v31c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6V24c0-3.3 2.7-6 6-6z" fill="url(#cs-front)" />
              <path d="M6 18h60c3.3 0 6 2.7 6 6v31c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6V24c0-3.3 2.7-6 6-6z" fill="url(#cs-shine)" />
              <path d="M6.5 19h59" stroke="#ffd2bd" strokeWidth="1.3" strokeLinecap="round" strokeOpacity=".9" />
              <path d="M2 56.5c1 2.2 2.4 3.3 4.6 3.3h58.8c2.2 0 3.6-1.1 4.6-3.3" fill="none" stroke="#b02f00" strokeOpacity=".55" strokeWidth="1.2" />
            </g>
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
        .cs:hover .cs-paper { transform: translateY(-8px); }
        .cs:hover .cs-front { transform: skewX(-8deg) scaleY(.94); }
        @media (prefers-reduced-motion: reduce) { .cs, .cs-paper, .cs-front { transition: none; } }
      `}</style>
    </div>
  );
}
