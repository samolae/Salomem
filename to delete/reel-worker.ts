/*
 * Draws the drum's reels off the main thread, for browsers that draw the
 * drum without a graphics card (hero-canvas.tsx, the per-tile canvases).
 * There, copying a playing film's frame into a canvas costs the page a few
 * milliseconds every frame; here it costs the page nothing. Each reel tile's
 * canvas is handed over once; the page then sends its still (an ImageBitmap)
 * or the film's current frame (a VideoFrame), and this worker draws it the
 * way the tile's own canvas would have: a still scaled to the tile's size
 * with the best smoothing and cropped like object-cover, a frame as it is.
 */

type Msg =
  | { t: 'add'; i: number; canvas: OffscreenCanvas }
  | { t: 'draw'; i: number; src: ImageBitmap | VideoFrame; film: boolean; tw: number; th: number; dpr: number }
  | { t: 'clear'; i: number };

const tiles = new Map<number, OffscreenCanvasRenderingContext2D>();

self.onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.t === 'add') {
    const x = m.canvas.getContext('2d');
    if (x) tiles.set(m.i, x);
    return;
  }
  if (m.t === 'clear') {
    const x = tiles.get(m.i);
    if (x) { x.canvas.width = 0; x.canvas.height = 0; }
    return;
  }
  const x = tiles.get(m.i);
  const src = m.src;
  try {
    if (!x) return;
    const sw = src instanceof ImageBitmap ? src.width : src.displayWidth;
    const sh = src instanceof ImageBitmap ? src.height : src.displayHeight;
    if (!sw || !sh) return;
    let w = sw, h = sh, sx = 0, sy = 0, cw = sw, ch = sh;
    if (!m.film) {
      w = Math.max(1, Math.round(m.tw * m.dpr)); h = Math.max(1, Math.round(m.th * m.dpr));
      if (sw / sh > w / h) { cw = sh * (w / h); sx = (sw - cw) / 2; } else { ch = sw / (w / h); sy = (sh - ch) / 2; }
    }
    if (x.canvas.width !== w || x.canvas.height !== h) { x.canvas.width = w; x.canvas.height = h; } else x.clearRect(0, 0, w, h);
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = m.film ? 'low' : 'high';
    x.drawImage(src, sx, sy, cw, ch, 0, 0, w, h);
  } finally {
    src.close();
  }
};
