/*
 * Draws the drum's tiles off the main thread, where the drum is drawn
 * without a graphics card (hero-canvas.tsx: each tile has its own canvas).
 * Painting pictures into ~40 visible canvases, and a reel's frame every
 * frame, would otherwise hold up the page; here it costs the page nothing.
 *
 * Each tile's canvas is handed over once. The page then says what a tile
 * shows: a picture (by address: this worker fetches it, from the browser's
 * cache, and decodes it once), or a reel's current frame. A picture is drawn
 * at the tile's size on screen with the best smoothing and cropped like
 * object-cover; a frame is drawn as it is. A tile only ever moves up from
 * its soft preview to its picture, never back.
 */

type Msg =
  | { t: 'add'; list: { i: number; canvas: OffscreenCanvas }[] }
  | { t: 'show'; i: number; url: string; level: number; tw: number; th: number; dpr: number }
  | { t: 'frame'; i: number; frame: VideoFrame }
  | { t: 'clear'; i: number };

const tiles = new Map<number, OffscreenCanvasRenderingContext2D>();
/** what each tile shows now: 1 the soft preview, 2 the picture, 3 a reel's frame */
const level = new Map<number, number>();
const pictures = new Map<string, Promise<ImageBitmap | null>>();

const picture = (url: string) => {
  let p = pictures.get(url);
  if (!p) {
    p = fetch(url, { mode: 'cors', credentials: 'omit' })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => (b ? createImageBitmap(b) : null))
      .catch(() => null);
    pictures.set(url, p);
  }
  return p;
};

function draw(x: OffscreenCanvasRenderingContext2D, src: ImageBitmap | VideoFrame, film: boolean, tw: number, th: number, dpr: number) {
  const sw = film ? (src as VideoFrame).displayWidth : (src as ImageBitmap).width;
  const sh = film ? (src as VideoFrame).displayHeight : (src as ImageBitmap).height;
  if (!sw || !sh) return false;
  let w = sw, h = sh, sx = 0, sy = 0, cw = sw, ch = sh;
  if (!film) {
    w = Math.max(1, Math.round(tw * dpr)); h = Math.max(1, Math.round(th * dpr));
    if (sw / sh > w / h) { cw = sh * (w / h); sx = (sw - cw) / 2; } else { ch = sw / (w / h); sy = (sh - ch) / 2; }
  }
  if (x.canvas.width !== w || x.canvas.height !== h) { x.canvas.width = w; x.canvas.height = h; } else x.clearRect(0, 0, w, h);
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = film ? 'low' : 'high';
  x.drawImage(src, sx, sy, cw, ch, 0, 0, w, h);
  return true;
}

self.onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.t === 'add') {
    for (const { i, canvas } of m.list) { const x = canvas.getContext('2d'); if (x) tiles.set(i, x); }
    return;
  }
  if (m.t === 'clear') {
    const x = tiles.get(m.i);
    if (x) { x.canvas.width = 0; x.canvas.height = 0; }
    level.delete(m.i);
    return;
  }
  if (m.t === 'frame') {
    const x = tiles.get(m.i);
    try { if (x && draw(x, m.frame, true, 0, 0, 1)) level.set(m.i, 3); } finally { m.frame.close(); }
    return;
  }
  // show a picture: once it is decoded, unless the tile already shows something better
  const { i, url, tw, th, dpr } = m, want = m.level;
  picture(url).then((bm) => {
    const x = tiles.get(i);
    if (!bm || !x || (level.get(i) ?? 0) > want) return;
    if (draw(x, bm, false, tw, th, dpr)) level.set(i, want);
  });
};
