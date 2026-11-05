/*
 * A small feed wall for a case card: posts and films in a few columns that
 * drift up and down on the brand colour. Films keep their own proportion.
 */
type Item = { src: string; ratio: number; video?: boolean; poster?: string };

export function FeedCover({ bg, items, cols = 4 }: { bg: string; items: Item[]; cols?: number }) {
  const col = (c: number) => Array.from({ length: Math.max(5, items.length) }, (_, i) => items[(i + c * 2) % items.length]);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 grid gap-2 px-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cols }, (_, c) => (
          <div key={c} className="overflow-hidden">
            <div className={c % 2 ? 'baked-col-down' : 'baked-col-up'} style={{ ['--dur' as string]: `${38 + c * 6}s` }}>
              {[0, 1].map((k) => (
                <div key={k} className="flex flex-col gap-2 pb-2" aria-hidden={k === 1 || undefined}>
                  {col(c).map((it, i) => (
                    <div key={i} className="overflow-hidden rounded-[5px] bg-black/20 shadow-[0_8px_18px_rgba(0,0,0,.25)]" style={{ aspectRatio: String(it.ratio) }}>
                      {it.video
                        ? <video src={it.src} poster={it.poster} muted loop playsInline autoPlay preload="none" className="h-full w-full object-cover" />
                        : <img src={it.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
