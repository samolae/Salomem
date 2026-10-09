/*
 * Responsive Cloudinary images.
 * Every image on the site is a Cloudinary URL. The originals are 1000-2000px
 * wide, but most are shown at 200-700px, so phones were downloading 3-7x the
 * pixels they display. These helpers ask Cloudinary for the right size
 * (c_limit never upscales) and let the browser pick from a srcset.
 * Non-Cloudinary URLs pass through untouched.
 */

const MARK = '/image/upload/';
const isCloudinary = (src: string) => src.includes('res.cloudinary.com') && src.includes(MARK);

/** The same image, at most `width` px wide, in an automatic modern format. */
export function cld(src: string, width: number): string {
  if (!isCloudinary(src)) return src;
  const at = src.indexOf(MARK) + MARK.length;
  const head = src.slice(0, at);
  const rest = src.slice(at);
  const size = `w_${width},c_limit`;
  // An existing transformation segment ("f_auto,q_auto/...") gets the size
  // appended; otherwise a full one is added in front of the version segment
  const first = rest.split('/')[0];
  if (/^[a-z]{1,3}_[^/]+$/.test(first) && !first.startsWith('v1')) {
    const parts = first.split(',').filter((p) => !/^(w|c)_/.test(p));
    for (const p of ['f_auto', 'q_auto']) if (!parts.includes(p)) parts.push(p);
    return `${head}${[...parts, size].join(',')}${rest.slice(first.length)}`;
  }
  return `${head}f_auto,q_auto,${size}/${rest}`;
}

/**
 * Spread onto an <img>: src at the largest width plus a srcset and sizes,
 * so the browser downloads only what the layout needs.
 */
export function responsive(src: string, widths: number[], sizes: string) {
  if (!isCloudinary(src)) return { src };
  return {
    src: cld(src, widths[widths.length - 1]),
    srcSet: widths.map((w) => `${cld(src, w)} ${w}w`).join(', '),
    sizes,
  };
}

/* Presets by role, sized from the layouts (CSS px, 1x and 2x screens) */
export const IMG = {
  /** Logos and avatars up to ~40px */
  logo: (src: string) => ({ src: cld(src, 120) }),
  /** Main screen inside a case card (about 65-70% of the card) */
  caseMain: (src: string) => responsive(src, [400, 640, 960, 1280], '(min-width: 1024px) 480px, 70vw'),
  /** Faded side screens inside a case card (about 40-50% of the card) */
  caseSide: (src: string) => responsive(src, [240, 360, 480, 720], '(min-width: 1024px) 260px, 45vw'),
  /** Gallery tiles: 2 columns on phones, 3 on tablet and up */
  tile: (src: string) => responsive(src, [240, 360, 480, 720], '(min-width: 768px) 240px, 48vw'),
  /** Larger gallery tiles (brand grids, bento cells) */
  tileLarge: (src: string) => responsive(src, [360, 540, 720, 1080], '(min-width: 768px) 360px, 48vw'),
  /** Lightbox: up to 82% of the screen */
  full: (src: string) => responsive(src, [960, 1440, 2000], '82vw'),
  /** Full-width screenshots in case-study pages */
  wide: (src: string) => responsive(src, [640, 960, 1280, 1920], '(min-width: 1280px) 1100px, 92vw'),
};
