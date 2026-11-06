import type { Media } from './social-case';

/*
 * A case card cover in the manner of the FitMeal bento: the brand's posts,
 * stories and films packed edge to edge on its colour, in columns of
 * different widths so some pieces read large and some small. Every piece
 * keeps its own proportion; the columns start at different heights and run
 * off the card, like a feed seen up close. Films play, stills zoom softly on
 * hover, one after another.
 */
const CARD = 11 / 16; // card height / width
const GAP = 0.006;    // as a share of the card width

export function MosaicCover({ bg, items, widths = [1.35, 1, 1.15, 0.9], shift = 0 }: { bg: string; items: Media[]; widths?: number[]; shift?: number }) {
  const total = widths.reduce((a, b) => a + b, 0);
  const free = 1 - GAP * (widths.length + 1);
  const ratio = (m: Media) => (m.w ?? 4) / (m.h ?? 5);
  // fill each column past the bottom edge, walking the pool from a different place
  const cols = widths.map((wf, c) => {
    const w = (wf / total) * free;
    const lift = ((c * 37 + shift * 11) % 45) / 100; // how far the column starts above the card, in tile heights
    const out: Media[] = [];
    let h = 0, k = c * 2 + shift;
    while (h < CARD * (1 + lift) + 0.1 && out.length < 12) {
      const m = items[k++ % items.length];
      out.push(m);
      h += w / ratio(m) + GAP;
    }
    return { w, lift, out };
  });
  let n = 0;
  return (
    <div className="relative flex h-full w-full overflow-hidden" style={{ background: bg, gap: `${GAP * 100}%`, padding: `0 ${GAP * 100}%` }}>
      {cols.map(({ w, lift, out }, c) => (
        <div key={c} className="flex min-w-0 shrink-0 flex-col" style={{ width: `${(w / (1 - GAP * 2)) * 100}%`, gap: 4, transform: `translateY(-${lift * 40}%)` }}>
          {out.map((m, i) => {
            const d = (n++ % 5) * 70;
            return (
              <div key={i} className="relative shrink-0 overflow-hidden rounded-[4px] bg-black/10" style={{ aspectRatio: `${m.w ?? 4}/${m.h ?? 5}` }}>
                {m.video ? (
                  <video src={m.src.replace('/f_auto,q_auto/', '/f_auto,q_auto,w_360/')} poster={m.poster?.replace('w_720', 'w_360')}
                    muted loop playsInline autoPlay preload="metadata" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <img src={small(m.src)} alt="" loading="lazy" decoding="async" draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                    style={{ transitionDelay: `${d}ms` }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** a card-sized copy of a Cloudinary picture; local files pass through */
const small = (src: string) => (src.includes('/image/upload/') ? src.replace(/\/image\/upload\/(f_auto,q_auto\/)?/, '/image/upload/f_auto,q_auto,w_520,c_limit/') : src);
