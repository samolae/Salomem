import { useEffect, useState } from 'react';

/*
 * Gagua's three hand-drawn names on one soft mint ground, set to the same
 * optical size. Every few seconds they trade places, gliding along a low arc.
 */
const P = '/cases/gagua';
const ITEMS = [
  { src: `${P}/lt-home.png`, alt: 'შინ ზრუნვა', w: 70 },        // tall script, so narrower
  { src: `${P}/lt-born.png`, alt: 'დავიბადე გაგუაში', w: 100 },  // wide sticker
  { src: `${P}/lt-concierge.png`, alt: 'გაგუას სამედიცინო კონსიერჟი', w: 84 },
];
const SLOTS = [17, 50, 83]; // centres, in % of the width

export function GaguaLettering({ className = '', small = false }: { className?: string; small?: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setStep((s) => s + 1), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`gl relative h-full w-full overflow-hidden ${className}`} style={{ background: '#EEF5EE' }} aria-label="შინ ზრუნვა, დავიბადე გაგუაში, გაგუას სამედიცინო კონსიერჟი">
      {ITEMS.map((it, i) => {
        const slot = (i + step) % 3;
        // the one going back to the start passes over the others, not through them
        const wrap = step > 0 && slot === 0;
        return (
          <div key={it.src} className="gl-item absolute top-1/2 flex items-center justify-center"
            style={{ left: `${SLOTS[slot]}%`, width: small ? '31%' : '30%', height: '64%', zIndex: wrap ? 3 : 1, transform: 'translate(-50%,-50%)' }}>
            <img key={step} src={it.src} alt={it.alt} draggable={false} decoding="async" loading={small ? 'lazy' : 'eager'} className="gl-img block h-auto max-h-full object-contain" style={{ width: `${it.w}%`, animation: step ? `${wrap ? 'gl-over' : 'gl-hop'} 1.1s cubic-bezier(.65,0,.25,1)` : 'none' }} />
          </div>
        );
      })}
      <style>{`
        .gl-item { transition: left 1.1s cubic-bezier(.65,0,.25,1); }
        @keyframes gl-hop { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(8%) rotate(1.5deg); } }
        @keyframes gl-over { 0%,100% { transform: translateY(0) scale(1) rotate(0); } 50% { transform: translateY(-62%) scale(.72) rotate(-6deg); } }
        @media (prefers-reduced-motion: reduce) { .gl-item { transition: none; } .gl-item .gl-img { animation: none; } }
      `}</style>
    </div>
  );
}
