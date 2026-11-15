import { lazy, Suspense } from 'react';
import { HeroCanvas, heroStarted } from './hero-canvas';
import { isHydrating } from '../hydration';

/*
 * The home page: the drum, then everything below it (home-rest.tsx). On a
 * first visit the page arrives prerendered, and the part below the drum
 * hydrates from its own chunk once the drum has asked for its first pictures,
 * so the code for the cases, logos and spotlights never delays the first
 * screen. Until then its HTML is already there, readable and unchanged.
 * Arriving from another page (no hydration), it loads at once.
 */
const HomeRest = lazy(() =>
  (typeof window === 'undefined' || !isHydrating() ? Promise.resolve() : heroStarted())
    .then(() => import('./home-rest'))
    .then((m) => ({ default: m.HomeRest }))
);

export function HomeContent() {
  return (
    <>
      <HeroCanvas />
      <Suspense fallback={null}>
        <HomeRest />
      </Suspense>
    </>
  );
}
