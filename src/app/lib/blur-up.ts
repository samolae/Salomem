/*
 * Blur-up loading: while a picture downloads, a tiny blurred version sits
 * behind it, so every tile shows its colours at once and the sharp picture
 * fades in over it. Works for every <img> on the site without touching the
 * components: Cloudinary pictures get a 32px blurred variant on the fly,
 * local case pictures use the "-lq.jpg" files made next to them.
 */

const UP = '/image/upload/';

function lowFor(src: string): string | null {
  if (!src) return null;
  if (src.includes('res.cloudinary.com') && src.includes(UP)) {
    const at = src.indexOf(UP) + UP.length;
    return `${src.slice(0, at)}w_64,q_40,e_blur:600,f_jpg/${src.slice(at)}`;
  }
  // PNGs have transparency and no "-lq.jpg" next to them: a preview would
  // only be a failed request (and would show through the clear parts)
  const m = src.match(/^(?:https?:\/\/[^/]+)?(\/(?:cases|logos)\/.+?)(?:-(?:1200|1100|1000|800))?\.(?:jpg|jpeg|webp)(?:\?.*)?$/i);
  if (m && !m[1].endsWith('-lq')) return `${m[1]}-lq.jpg`;
  return null;
}

function dress(img: HTMLImageElement) {
  if (img.dataset.lq) return;
  img.dataset.lq = '1';
  if (img.complete && img.naturalWidth > 0) return; // already here
  // app/media.ts already put its own soft preview behind this picture
  if (img.style.backgroundImage) return;
  const low = lowFor(img.getAttribute('src') || img.currentSrc);
  if (!low) return;
  const s = img.style;
  s.backgroundImage = `url("${low}")`;
  s.backgroundSize = 'cover';
  s.backgroundPosition = getComputedStyle(img).objectPosition || 'center';
  s.backgroundRepeat = 'no-repeat';
  const clear = () => { s.backgroundImage = ''; };
  img.addEventListener('load', () => setTimeout(clear, 400), { once: true });
  img.addEventListener('error', clear, { once: true });
}

/*
 * Videos that play on their own only play while on screen: off-screen ones
 * are paused (and do not start downloading), and resume when scrolled to.
 * A video someone paused on purpose is left alone. A video marked
 * data-autoplay (instead of autoplay) waits for the screen from the start,
 * so a film far down the page does not download during the first load.
 */
let io: IntersectionObserver | null = null;

/*
 * Ref for a data-autoplay video that follows the site's motion switch:
 * switched off, it stops and stays stopped; switched back on while it is
 * already being watched, it plays again. It never starts a download by
 * itself; the observer below starts it once it is on screen.
 */
export function motionRef(v: HTMLVideoElement | null, paused: boolean) {
  if (!v) return;
  if (paused) { v.pause(); v.dataset.autoPaused = ''; return; }
  if (v.paused && v.dataset.lazyPlay && v.dataset.autoPaused !== '1') {
    const r = v.getBoundingClientRect();
    if (r.bottom > -200 && r.top < window.innerHeight + 200) v.play().catch(() => {});
    else v.dataset.autoPaused = '1'; // the observer starts it when it comes on screen
  }
}
function watchVideo(v: HTMLVideoElement) {
  if (v.dataset.lazyPlay || v.controls || !v.muted) return;
  // data-autoplay: starts once it comes on screen, and downloads nothing before
  if (v.dataset.autoplay !== undefined && v.paused) v.dataset.autoPaused = '1';
  if (!v.autoplay && v.paused && v.dataset.autoPaused !== '1') { v.dataset.lazyPlay = '1'; io?.observe(v); return; }
  v.dataset.lazyPlay = '1';
  io?.observe(v);
}

export function startBlurUp() {
  if (typeof window === 'undefined') return;
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) {
        if (v.dataset.autoPaused === '1') { v.dataset.autoPaused = ''; v.play().catch(() => {}); }
      } else if (!v.paused || v.autoplay) {
        v.autoplay = false;
        if (v.readyState === 0) v.preload = 'none';
        v.pause();
        v.dataset.autoPaused = '1';
      }
    }
  }, { rootMargin: '200px 0px' });
  const scan = (root: ParentNode) => { root.querySelectorAll('img').forEach(dress); root.querySelectorAll('video').forEach(watchVideo); };
  scan(document);
  new MutationObserver((list) => {
    for (const r of list) {
      r.addedNodes.forEach((n) => {
        if (n instanceof HTMLImageElement) dress(n);
        else if (n instanceof HTMLVideoElement) watchVideo(n);
        else if (n instanceof Element) scan(n);
      });
      if (r.type === 'attributes' && r.target instanceof HTMLImageElement) { delete r.target.dataset.lq; dress(r.target); }
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
}
