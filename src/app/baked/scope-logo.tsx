import { LOGO_VB, LETTERS, LENS } from './scope-vectors';

export const INK = '#1e1e1e';
export const LIME = '#9aff01';

/** the logo; the lens can be nudged (in drawing units) */
export function ScopeLogo({ ink = '#fff', lens = LIME, dx = 0, dy = 0, className = '', title }: { ink?: string; lens?: string; dx?: number; dy?: number; className?: string; title?: string }) {
  return (
    <svg viewBox={`0 0 ${LOGO_VB.w} ${LOGO_VB.h}`} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill={ink}>{LETTERS.map((d, i) => <path key={i} d={d} />)}</g>
      <path d={LENS} fill={lens} style={{ transform: `translate(${dx}px, ${dy}px)`, transition: 'transform .5s cubic-bezier(.2,.7,.2,1)' }} />
    </svg>
  );
}

/** the cover for the case grid */
export function ScopeCover() {
  return (
    <div className="flex h-full items-center justify-center" style={{ background: INK }}>
      <ScopeLogo className="w-[58%] h-auto transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
    </div>
  );
}

