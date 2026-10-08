import { useLayoutEffect, useRef, type ComponentProps } from 'react';
import { Link, useViewTransitionState } from 'react-router';
import { preloadRoute } from '../case-routes';

/* ------------------------------------------------------------------ */
/*  "The card opens into the page"                                     */
/*  The clicked case card and a full-viewport target on the case page  */
/*  share a view-transition-name, so the browser morphs one into the   */
/*  other: the card grows to fill the screen and dissolves into the    */
/*  page, and on the way back the page collapses into the same card.   */
/*  Names are per case (case-aurum, ...), so a snapshot never holds    */
/*  two elements with the same name. Browsers without view transitions */
/*  simply navigate. Animations live in styles/view-transitions.css.   */
/* ------------------------------------------------------------------ */

export const caseTransitionName = (to: string) =>
  `case-${to.split('/').filter(Boolean).pop() ?? 'page'}`;

// The card instance that opened the current case. Only it morphs, both
// directions, even when the same case appears twice on a page.
let sourceCard: string | null = null;

type CaseLinkProps = Omit<ComponentProps<typeof Link>, 'to' | 'viewTransition'> & {
  to: string;
  /** Unique per card instance, e.g. "bento-aurum" or "ux-aurum" */
  cardId: string;
};

export function CaseLink({
  to,
  cardId,
  className = '',
  style,
  onClick,
  onPointerEnter,
  onFocus,
  onTouchStart,
  children,
  ...rest
}: CaseLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const transitioning = useViewTransitionState(to);
  const named = transitioning && sourceCard === cardId;

  // Coming back, the home page starts at the top. Morph into the card only
  // if it will be on screen; otherwise the page just crossfades.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !named) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top > window.innerHeight * 0.9) el.style.viewTransitionName = 'none';
  });

  const warm = () => preloadRoute(to);

  return (
    <Link
      ref={ref}
      to={to}
      viewTransition
      className={`block ${className}`}
      style={{ ...style, viewTransitionName: named ? caseTransitionName(to) : undefined }}
      onClick={(e) => {
        sourceCard = cardId;
        warm();
        onClick?.(e);
      }}
      onPointerEnter={(e) => {
        warm();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

/**
 * Render once on each case-study page. While a card transition into or out
 * of this page runs, it provides the full-screen box the card morphs to.
 * It is transparent, so it never shows outside the transition.
 */
export function CaseHeroTarget({ path }: { path: string }) {
  const transitioning = useViewTransitionState(path);
  if (!transitioning || !sourceCard) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ viewTransitionName: caseTransitionName(path) }}
    />
  );
}
