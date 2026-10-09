/*
 * True while React is adopting prerendered HTML. Components that animate on
 * mount read it to keep what the visitor already sees on screen, instead of
 * hiding it and playing the entrance again.
 */
let hydrating = false;

export const isHydrating = () => hydrating;

export function startHydration() {
  hydrating = true;
}

export function endHydration() {
  hydrating = false;
}
