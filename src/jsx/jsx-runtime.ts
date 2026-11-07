// The automatic JSX runtime, with local pictures made fast first (see app/media.ts)
import * as R from 'react/jsx-runtime';
import { enhance } from '../app/media';

export const Fragment = R.Fragment;
export const jsx = (type: any, props: any, key?: any) => R.jsx(type, enhance(type, props), key);
export const jsxs = (type: any, props: any, key?: any) => R.jsxs(type, enhance(type, props), key);
