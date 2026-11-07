import { MEDIA } from './media-manifest';

/*
 * Every local picture is served fast first, then sharp.
 *
 * scripts/media.py writes light WebP copies of each picture in public/cases
 * and public/hero (480, 960, 1600 px and the full width) plus a 40 px
 * preview. Here every <img> that points at one of those pictures gets:
 *  - a srcset, so the browser fetches the smallest copy that is sharp at
 *    the size it is shown, never the 2400 px original for a card;
 *  - the 40 px preview stretched behind it, so the page shows every picture
 *    at once, soft, and the real one paints over it in place when it lands;
 *  - its proportion, so nothing jumps while it loads.
 * Video posters get the light copy too. It runs inside the JSX runtime
 * (src/jsx), so no page has to remember to use it.
 */
const WIDTHS = [480, 960, 1600];

function local(src: unknown) {
  if (typeof src !== 'string' || src[0] !== '/') return null;
  const key = src.slice(1).split('?')[0];
  const m = MEDIA[key];
  if (!m) return null;
  const [w, h] = m;
  const W = Math.abs(w);
  const stem = key.replace(/\.[a-z]+$/i, '');
  const widths = WIDTHS.filter((x) => x < W * 0.9).concat(W);
  return { W, h, opaque: w > 0, stem, widths };
}

type P = Record<string, any>;

/*
 * Cloudinary pictures are already sized by the pages; they get the same soft
 * 40 px preview behind them (a Cloudinary copy), when they cover their box
 * and have no transparency, so nothing shows through or around the real one.
 */
const CLOUD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:([^/]*_[^/]*)\/)?(v\d+\/.+)$/;
function cloud(props: P): P {
  const src = props.src;
  if (typeof src !== 'string') return props;
  const u = CLOUD.exec(src);
  if (!u || /\.png$/i.test(u[3])) return props;
  const w = /(?:^|,)w_(\d+)/.exec(u[2] ?? '');
  if (w && +w[1] <= 160) return props; // logos and icons: nothing to gain
  const cls = typeof props.className === 'string' ? props.className : '';
  if (!/object-cover/.test(cls) || props.style?.backgroundImage) return props;
  return {
    ...props,
    decoding: props.decoding ?? 'async',
    style: {
      ...props.style,
      backgroundImage: `url(${u[1]}f_auto,q_auto:low,w_40/${u[3]})`,
      backgroundSize: 'cover',
      backgroundPosition: props.style?.objectPosition ?? 'center',
      backgroundRepeat: 'no-repeat',
    },
  };
}

export function enhance(type: unknown, props: P): P {
  if (type === 'img') {
    const m = local(props.src);
    if (!m) return cloud(props);
    // a page's own srcset (with its own sizes) keeps its widths, each swapped for its light copy
    const own = typeof props.srcSet === 'string'
      ? props.srcSet.split(',').map((part: string) => {
          const [u, d] = part.trim().split(/\s+/);
          const o = local(u);
          return o ? `/m/${o.stem}.${o.W}.webp ${d ?? ''}`.trim() : part.trim();
        }).join(', ')
      : null;
    const cls = typeof props.className === 'string' ? props.className : '';
    // reserve its proportion while it loads, unless the page crops it to its own
    const style: P = /aspect-/.test(cls) ? { ...props.style } : { aspectRatio: `${m.W} / ${m.h}`, ...props.style };
    if (m.opaque && !/object-(contain|scale-down)/.test(cls) && !style.backgroundImage) {
      style.backgroundImage = `url(/m/${m.stem}.lq.webp)`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = style.objectPosition ?? 'center';
      style.backgroundRepeat = 'no-repeat';
    }
    return {
      ...props,
      srcSet: own ?? m.widths.map((x) => `/m/${m.stem}.${x}.webp ${x}w`).join(', '),
      // "auto" lets the browser pick by the shown size, but it also gives the picture
      // size containment, which can squeeze a small one in a flex row to nothing:
      // only for pictures that fill a frame
      sizes: props.sizes ?? (props.loading === 'lazy' && /\b(absolute|w-full)\b/.test(cls) ? 'auto, 100vw' : '100vw'),
      decoding: props.decoding ?? 'async',
      style,
    };
  }
  if (type === 'video' && props.poster) {
    const m = local(props.poster);
    if (!m) return props;
    const x = m.widths.filter((v) => v <= 1600).pop() ?? m.W;
    return { ...props, poster: `/m/${m.stem}.${x}.webp` };
  }
  return props;
}
