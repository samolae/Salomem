// Dev twin of jsx-runtime.ts
import * as D from 'react/jsx-dev-runtime';
import { enhance } from '../app/media';

export const Fragment = D.Fragment;
export const jsxDEV = (type: any, props: any, key: any, isStatic: boolean, source: any, self: any) =>
  (D as any).jsxDEV(type, enhance(type, props), key, isStatic, source, self);
