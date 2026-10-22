import { useLocation } from 'react-router';

/*
 * Two languages. English lives at the plain paths, Georgian under /ka
 * (/ka, /ka/work/ads…, /ka/services, /ka/contact), so each language has
 * its own prerendered page and shareable link. Case studies stay English.
 */
export type Lang = 'en' | 'ka';

export const langOf = (pathname: string): Lang =>
  pathname === '/ka' || pathname.startsWith('/ka/') ? 'ka' : 'en';

/** The same page in the other language */
export const switchPath = (pathname: string): string => {
  if (langOf(pathname) === 'ka') return pathname.replace(/^\/ka/, '') || '/';
  return pathname === '/' ? '/ka' : `/ka${pathname}`;
};

export function useI18n() {
  const { pathname } = useLocation();
  const lang = langOf(pathname);
  const ka = lang === 'ka';
  return {
    lang,
    ka,
    /** Pick the string for the current language */
    tx: (en: string, kaText: string) => (ka ? kaText : en),
    /** Prefix a site path for the current language; case studies stay as they are */
    to: (path: string) => (ka && !path.startsWith('/projects/') ? (path === '/' ? '/ka' : `/ka${path}`) : path),
    /** Path without the language prefix, for active-state checks */
    bare: ka ? pathname.replace(/^\/ka/, '') || '/' : pathname,
    other: switchPath(pathname),
  };
}

/** Brand names carry "English · ქართული"; show the side that fits */
export const brandName = (name: string, ka: boolean) => {
  const [en, geo] = name.split(' · ');
  return ka && geo ? geo : en;
};
