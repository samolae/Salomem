import { useEffect, useRef, useState } from 'react';

/*
 * Gagua's three hand-drawn names on one soft mint ground, set to the same
 * optical size. Every few seconds two neighbours trade places the way you
 * rearrange things on a desktop: one is picked up (it lifts and casts a
 * shadow), carried over by a cursor and set down, while the other slides
 * across underneath. Nothing fades.
 */
const P = '/cases/gagua';
const ITEMS = [
  { src: `${P}/lt-home.png`, alt: 'შინ ზრუნვა', w: 70 },        // tall script, so narrower
  { src: `${P}/lt-born.png`, alt: 'დავიბადე გაგუაში', w: 100 },  // wide sticker
  { src: `${P}/lt-concierge.png`, alt: 'გაგუას სამედიცინო კონსიერჟი', w: 84 },
];
const SLOTS = [17, 50, 83]; // centres, in % of the width
const MOVE = 1400;          // ms for one drag and drop

export function GaguaLettering({ className = '', small = false }: { className?: string; small?: boolean }) {
  // order[slot] = item index
  const [order, setOrder] = useState([0, 1, 2]);
  const live = useRef([0, 1, 2]);
  const [held, setHeld] = useState<number | null>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let n = 0;
    const t = setInterval(() => {
      // swap the left pair, then the right pair, and so on
      const a = n % 2 === 0 ? 0 : 1;
      n += 1;
      const next = [...live.current];
      setHeld(next[a]);
      [next[a], next[a + 1]] = [next[a + 1], next[a]];
      live.current = next;
      setOrder(next);
      setBeat((b) => b + 1);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`gl relative h-full w-full overflow-hidden ${className}`} style={{ background: '#EEF5EE' }} aria-label="შინ ზრუნვა, დავიბადე გაგუაში, გაგუას სამედიცინო კონსიერჟი">
      {ITEMS.map((it, i) => {
        const slot = order.indexOf(i);
        const lifted = held === i;
        return (
          <div key={it.src} className="gl-item absolute top-1/2 flex items-center justify-center"
            style={{ left: `${SLOTS[slot]}%`, width: small ? '31%' : '30%', height: '64%', zIndex: lifted ? 3 : 1, transform: 'translate(-50%,-50%)' }}>
            <div key={lifted ? beat : 'rest'} className={`gl-card relative flex items-center justify-center ${lifted ? 'gl-lift' : ''}`} style={{ width: `${it.w}%` }}>
              <img src={it.src} alt={it.alt} draggable={false} decoding="async" loading={small ? 'lazy' : 'eager'} className="block h-auto w-full object-contain" />
              {lifted && (
                <svg className="gl-cursor absolute" viewBox="0 0 24 24" aria-hidden>
                  <path d="M5 3l14 7.5-6.2 1.6L9.6 18z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        .gl-item { transition: left ${MOVE}ms cubic-bezier(.7,0,.25,1); }
        .gl-lift { animation: gl-lift ${MOVE}ms cubic-bezier(.45,0,.25,1) both; }
        @keyframes gl-lift {
          0%   { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
          18%  { transform: scale(1.07) rotate(-1.5deg); filter: drop-shadow(0 18px 22px rgba(20,60,30,.22)); }
          82%  { transform: scale(1.07) rotate(-1.5deg); filter: drop-shadow(0 18px 22px rgba(20,60,30,.22)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
        }
        .gl-cursor { width: ${small ? 18 : 26}px; height: ${small ? 18 : 26}px; right: 22%; bottom: 18%; animation: gl-cursor ${MOVE}ms ease both; }
        @keyframes gl-cursor { 0% { transform: translate(14px, 14px); opacity: 0; } 12%, 88% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(14px, 14px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .gl-item { transition: none; } .gl-lift, .gl-cursor { animation: none; display: none; } }
      `}</style>
    </div>
  );
}
