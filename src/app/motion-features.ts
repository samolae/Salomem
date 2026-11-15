/*
 * Motion's animation, gesture, drag and layout features, loaded after the
 * page has hydrated (App.tsx LazyMotion). Components use the light `m`
 * component (imported as `motion`), so the main scripts do not carry them.
 */
import { domMax } from 'motion/react';

export default domMax;
