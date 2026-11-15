/*
 * The drum's pictures, drawn with WebGL into one canvas.
 *
 * The canvas paints what the tiles used to show, with the same perspective,
 * the same rounded corners, the same grade and the same fade as the pictures
 * they held. The geometry follows the CSS 3D transform exactly, including the
 * browser's habit of placing each tile on a whole CSS pixel before it is
 * turned. The pointer is matched to the tiles with the same geometry
 * (hero-canvas.tsx), so nothing on the page moves every frame but this canvas.
 *
 * With a graphics card it runs on the page itself. Without one (WebGL drawn
 * by the processor) it runs in a worker (gl-worker.ts), where the slow
 * drawing holds up nothing on the page.
 *
 * Pictures are sampled with mipmaps (and anisotropic filtering where there
 * is some), so a turned tile is as sharp as the browser drew an <img>.
 */

const VS = `#version 300 es
in vec2 a_corner;
uniform vec2 u_half;     // half the tile's size, CSS px
uniform vec4 u_tile;     // centre x, centre y, depth, turn (radians)
uniform vec4 u_view;     // half the stage's width and height, the vanishing point's y, the perspective
out vec2 v_p;
void main() {
  // the quad reaches 2 px past the tile, so the edges can be smoothed
  vec2 p = a_corner * (u_half + 2.0);
  float c = cos(u_tile.w), s = sin(u_tile.w);
  vec3 X = vec3(u_tile.x + p.x * c, u_tile.y + p.y, u_tile.z + p.x * s);
  float w = (u_view.w - X.z) / u_view.w;
  v_p = p;
  gl_Position = vec4(X.x / u_view.x, -(u_view.z * w + X.y - u_view.z) / u_view.y, 0.0, w);
}`;

const FS = `#version 300 es
precision highp float;
in vec2 v_p;
uniform vec2 u_half;
uniform vec4 u_crop;     // the part of the picture the tile shows (object-cover): offset, size
uniform float u_alpha;
uniform float u_grade;
uniform float u_bias;
uniform sampler2D u_tex;
out vec4 o;
void main() {
  // rounded corners, 10 px, smoothed over one screen pixel
  vec2 q = abs(v_p) - (u_half - 10.0);
  float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 10.0;
  float cover = clamp(0.5 - dist / max(fwidth(dist), 1e-4), 0.0, 1.0);
  if (cover <= 0.0) discard;
  vec2 uv = u_crop.xy + clamp((v_p + u_half) / (2.0 * u_half), 0.0, 1.0) * u_crop.zw;
  vec4 t = texture(u_tex, uv, u_bias);
  vec3 c = t.a > 0.0 ? t.rgb / t.a : vec3(0.0);
  if (u_grade > 0.5) {
    // saturate(1.22) brightness(0.95) contrast(1.03), in that order, as CSS applies them
    const float S = 1.22;
    c = clamp(mat3(
      0.213 + 0.787 * S, 0.213 - 0.213 * S, 0.213 - 0.213 * S,
      0.715 - 0.715 * S, 0.715 + 0.285 * S, 0.715 - 0.715 * S,
      0.072 - 0.072 * S, 0.072 - 0.072 * S, 0.072 + 0.928 * S) * c, 0.0, 1.0);
    c = clamp(c * 0.95, 0.0, 1.0);
    c = clamp(c * 1.03 - 0.015, 0.0, 1.0);
  }
  float a = t.a * cover * u_alpha;
  o = vec4(c * a, a);
}`;

export type Draw = {
  key: string;
  /** centre on the drum, CSS px from the stage's middle, depth, turn in degrees */
  u: number; l: number; d: number; s: number;
  /** the tile's size, CSS px */
  w: number; h: number;
  alpha: number;
};

/* what the page and the worker (gl-worker.ts) say to each other */
export type GlIn =
  | { t: 'init'; canvas: OffscreenCanvas; budget: number }
  | { t: 'stop' }
  | { t: 'size'; w: number; h: number; dpr: number }
  /** a picture to have ready; need: its width on screen (device px) past which it is scaled down first, 0 to keep it */
  | { t: 'pic'; id: number; url: string; need: number }
  /** a reel's current frame */
  | { t: 'film'; id: number; frame: VideoFrame }
  /** the tiles to paint, STRIDE numbers each */
  | { t: 'draw'; buf: Float32Array; n: number; oy: number; P: number };
export type GlOut = { t: 'ready' } | { t: 'fail' } | { t: 'lost' } | { t: 'have'; id: number } | { t: 'miss'; id: number };
/** per tile: film, picture, preview (ids, -1 for none), u, l, d, s, w, h, alpha, the picture's fade (0 to 1) */
export const STRIDE = 11;

type Tex = { tex: WebGLTexture; w: number; h: number; bytes: number; used: number; mips: boolean };

export type DrumGL = {
  /** the stage's size in CSS px (fractional sizes allowed) and the screen's pixel ratio */
  resize(w: number, h: number, dpr: number): void;
  has(key: string): boolean;
  /** upload a picture (or a reel's frame); mips: sampled with mipmaps (pictures), not for frames */
  upload(key: string, src: TexImageSource, w: number, h: number, mips: boolean): void;
  /** paint the visible tiles, in the order given; oy: the vanishing point's offset from the middle, P: perspective */
  frame(draws: Draw[], oy: number, P: number): void;
  lost(): boolean;
  destroy(): void;
};

/** pictures kept on the graphics card, at most (more on large screens); the least recently shown go first */
export const glBudget = (wide: boolean) => (wide ? 160 : 96) * 1024 * 1024;

/** a renderer that runs on the processor, even when the browser does not say so */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render/i;

export type DrumGLOptions = {
  onLost: () => void;
  /** graphics memory for pictures, bytes (glBudget) */
  budget: number;
  /**
   * accept WebGL drawn by the processor. Only in a worker: on the page itself
   * it would hold up everything else every frame.
   */
  software?: boolean;
};

export function createDrumGL(canvas: HTMLCanvasElement | OffscreenCanvas, opts: DrumGLOptions): DrumGL | null {
  const { onLost, budget: BUDGET } = opts;
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: !opts.software }) as WebGL2RenderingContext | null;
  } catch { gl = null; }
  if (!gl) return null;
  const g = gl;
  if (!opts.software) {
    const info = g.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(g.getParameter(info.UNMASKED_RENDERER_WEBGL) || '') : '';
    if (SOFTWARE.test(renderer)) {
      g.getExtension('WEBGL_lose_context')?.loseContext();
      return null;
    }
  }

  const shader = (type: number, src: string) => {
    const s = g.createShader(type)!;
    g.shaderSource(s, src);
    g.compileShader(s);
    if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) || 'shader');
    return s;
  };
  let prog: WebGLProgram;
  try {
    prog = g.createProgram()!;
    g.attachShader(prog, shader(g.VERTEX_SHADER, VS));
    g.attachShader(prog, shader(g.FRAGMENT_SHADER, FS));
    g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(prog) || 'link');
  } catch {
    return null;
  }
  g.useProgram(prog);
  const vao = g.createVertexArray();
  g.bindVertexArray(vao);
  const buf = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, buf);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
  const aCorner = g.getAttribLocation(prog, 'a_corner');
  g.enableVertexAttribArray(aCorner);
  g.vertexAttribPointer(aCorner, 2, g.FLOAT, false, 0, 0);
  const U = (n: string) => g.getUniformLocation(prog, n);
  const uHalf = U('u_half'), uTile = U('u_tile'), uView = U('u_view'), uCrop = U('u_crop'), uAlpha = U('u_alpha'), uGrade = U('u_grade'), uBias = U('u_bias');
  g.uniform1i(U('u_tex'), 0);
  g.uniform1f(uGrade, 1);
  const aniso = g.getExtension('EXT_texture_filter_anisotropic');
  const maxAniso = aniso ? Math.min(8, g.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number) : 0;
  g.enable(g.BLEND);
  g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
  g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  g.clearColor(0, 0, 0, 0);

  const texs = new Map<string, Tex>();
  let bytes = 0, stamp = 0, cssW = 0, cssH = 0, isLost = false;

  const onContextLost = (e: Event) => { e.preventDefault(); isLost = true; onLost(); };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const drop = (key: string) => {
    const t = texs.get(key);
    if (!t) return;
    g.deleteTexture(t.tex);
    bytes -= t.bytes;
    texs.delete(key);
  };

  return {
    resize(w, h, dpr) {
      cssW = w; cssH = h;
      const bw = Math.max(1, Math.round(w * dpr)), bh = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
      g.viewport(0, 0, bw, bh);
    },
    has: (key) => texs.has(key),
    upload(key, src, w, h, mips) {
      if (isLost) return;
      let t = texs.get(key);
      if (!t) {
        const tex = g.createTexture();
        if (!tex) return;
        t = { tex, w: 0, h: 0, bytes: 0, used: stamp, mips };
        texs.set(key, t);
      }
      g.bindTexture(g.TEXTURE_2D, t.tex);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, src);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      if (mips) {
        g.generateMipmap(g.TEXTURE_2D);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
        if (aniso && maxAniso) g.texParameterf(g.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
      } else {
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      }
      bytes -= t.bytes;
      t.w = w; t.h = h; t.mips = mips; t.used = stamp;
      t.bytes = Math.round(w * h * 4 * (mips ? 4 / 3 : 1));
      bytes += t.bytes;
    },
    frame(draws, oy, P) {
      if (isLost) return;
      stamp++;
      g.clear(g.COLOR_BUFFER_BIT);
      g.uniform4f(uView, cssW / 2, cssH / 2, oy, P);
      // each tile sits on a whole CSS pixel before it is turned, as the browser placed it
      const sx = Math.round(cssW / 2) - cssW / 2, sy = Math.round(cssH / 2) - cssH / 2;
      for (const d of draws) {
        const t = texs.get(d.key);
        if (!t || d.alpha <= 0) continue;
        t.used = stamp;
        g.bindTexture(g.TEXTURE_2D, t.tex);
        // object-cover: the middle of the picture, in the tile's shape
        const pr = t.w / t.h, tr = d.w / d.h;
        if (pr > tr) { const k = tr / pr; g.uniform4f(uCrop, (1 - k) / 2, 0, k, 1); } else { const k = pr / tr; g.uniform4f(uCrop, 0, (1 - k) / 2, 1, k); }
        g.uniform2f(uHalf, d.w / 2, d.h / 2);
        // rotateY(-s) turns a point x of the tile to (x cos s, x sin s) in (across, depth)
        g.uniform4f(uTile, d.u + sx, d.l + sy, d.d, (d.s * Math.PI) / 180);
        g.uniform1f(uAlpha, d.alpha);
        // a slight lean towards the sharper mip level, which is how the browser's own picture scaling looks
        g.uniform1f(uBias, t.mips ? -0.5 : 0);
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
      }
      // over budget: let go of the pictures shown longest ago (they are uploaded again when they come round)
      if (bytes > BUDGET) {
        const old = [...texs.entries()].filter(([, t]) => t.used < stamp).sort((a, b) => a[1].used - b[1].used);
        for (const [k] of old) { if (bytes <= BUDGET * 0.8) break; drop(k); }
      }
    },
    lost: () => isLost || g.isContextLost(),
    destroy() {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      for (const k of [...texs.keys()]) drop(k);
      g.deleteBuffer(buf);
      g.deleteVertexArray(vao);
      g.deleteProgram(prog);
    },
  };
}
