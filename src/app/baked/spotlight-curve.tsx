import { useEffect, useRef, useState } from 'react';
import { FoldingCards } from './flourish';

/*
 * Spotlights on a curve: the cards are painted into one long strip and
 * wrapped around the inside of a cylinder, so they bend as they travel and
 * the ones at the edges lean in towards you. Drag, swipe or scroll
 * sideways to move it; it drifts slowly on its own. Without WebGL it falls
 * back to the folding card row.
 */

type Item = { img: string; title: string; desc: string; tag: string };

const VERT = `
attribute vec2 a; // a.x = angle (-1..1 of the span), a.y = height (-1..1)
uniform float span, cam, yHalf, f, aspect;
varying vec2 uv;
varying float edge;
void main(){
  float th = a.x * span;
  float X = sin(th), Z = -cos(th), Y = a.y * yHalf;
  float dz = cam - Z;
  uv = vec2(a.x * 0.5 + 0.5, 0.5 - a.y * 0.5);
  edge = abs(a.x);
  gl_Position = vec4(X * f / aspect, Y * f, 0.0, dz);
}`;

const FRAG = `
precision mediump float;
varying vec2 uv;
varying float edge;
uniform sampler2D tex;
uniform float offset, visible;
void main(){
  float u = fract(offset + (uv.x - 0.5) * visible);
  vec4 c = texture2D(tex, vec2(u, uv.y));
  c.rgb *= 1.0 - 0.10 * edge * edge; // texture is premultiplied
  gl_FragColor = c;
}`;

const CARD_W = 560, CARD_H = 760, GAP = 56, PAD = 40;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(' '); const lines: string[] = []; let line = '';
  for (const w of words) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}

async function paintStrip(items: Item[]): Promise<HTMLCanvasElement> {
  const list = [...items, ...items];
  const cv = document.createElement('canvas');
  cv.width = list.length * (CARD_W + GAP); cv.height = CARD_H + PAD * 2;
  const ctx = cv.getContext('2d')!;
  try { await document.fonts.load('28px "Avenir Next Georgian"'); } catch { /* fallback font */ }
  const imgs = await Promise.all(list.map((it) => new Promise<HTMLImageElement | null>((res) => {
    const im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async';
    im.onload = () => res(im); im.onerror = () => res(null);
    setTimeout(() => res(null), 6000); // a slow image never holds up the whole strip
    im.src = it.img.includes('/image/upload/') ? it.img.replace('/image/upload/', '/image/upload/w_800,c_limit/') : it.img;
  })));
  list.forEach((it, i) => {
    const x = i * (CARD_W + GAP) + GAP / 2, y = PAD;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
    roundRect(ctx, x, y, CARD_W, CARD_H, 34); ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.restore();
    ctx.save(); roundRect(ctx, x, y, CARD_W, CARD_H, 34); ctx.clip();
    const ih = CARD_H * 0.64, im = imgs[i];
    if (im) {
      const s = Math.max(CARD_W / im.width, ih / im.height), w = im.width * s, h = im.height * s;
      ctx.drawImage(im, x + (CARD_W - w) / 2, y + (ih - h) / 2, w, h);
    } else { ctx.fillStyle = '#ececec'; ctx.fillRect(x, y, CARD_W, ih); }
    ctx.restore();
    const font = '"Avenir Next Georgian", Inter, system-ui, sans-serif';
    let ty = y + ih + 52;
    ctx.fillStyle = '#d93905'; ctx.font = `24px ${font}`; ctx.fillText(it.tag, x + 36, ty);
    ty += 50; ctx.fillStyle = '#111111'; ctx.font = `500 36px ${font}`; ctx.fillText(it.title, x + 36, ty);
    ctx.fillStyle = '#6f6f6f'; ctx.font = `25px ${font}`;
    wrap(ctx, it.desc, CARD_W - 72).slice(0, 3).forEach((l) => { ty += 38; ctx.fillText(l, x + 36, ty); });
  });
  return cv;
}

export function SpotlightCurve({ items, label }: { items: Item[]; label: string }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  // the parent rebuilds `items` on every render; only restart when the content changes
  const key = items.map((i) => `${i.img}|${i.title}|${i.desc}|${i.tag}`).join('§');
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) { setFailed(true); return; }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false, raf = 0, visibleOnScreen = true;

    const sh = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || ''); return s; };
    let prog: WebGLProgram;
    try { prog = gl.createProgram()!; gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog); } catch { setFailed(true); return; }
    gl.useProgram(prog);

    // a strip of vertical slices
    const SEG = 96, verts: number[] = [];
    for (let i = 0; i < SEG; i++) {
      const a0 = -1 + (2 * i) / SEG, a1 = -1 + (2 * (i + 1)) / SEG;
      verts.push(a0, -1, a1, -1, a0, 1, a0, 1, a1, -1, a1, 1);
    }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uSpan = U('span'), uCam = U('cam'), uY = U('yHalf'), uF = U('f'), uAsp = U('aspect'), uOff = U('offset'), uVis = U('visible');
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const SPAN = 1.15, CAM = 0.6;
    const items = itemsRef.current;
    const nCards = items.length * 2;
    let offset = 0.5 / nCards * 0 + (Math.floor(items.length / 2) + 0.5) / nCards; // middle card centred
    let vel = 0, target: number | null = null;
    let visible = 0.4;

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = w / h;
      // fit the edges to the width
      const edgeDz = CAM + Math.cos(SPAN);
      const f = 1.0 * aspect * edgeDz / Math.sin(SPAN);
      // centre card takes ~74% of the height
      const centerDz = CAM + 1;
      const yHalf = 0.74 * centerDz / f;
      // how many cards fit across: a card's angular width at the centre
      const cardH = 2 * yHalf; // world height of the strip
      const slotW = cardH * ((CARD_W + GAP) / (CARD_H + PAD * 2)); // world width of one slot at the centre
      const slots = (2 * SPAN) / slotW;
      visible = slots / nCards;
      gl.uniform1f(uSpan, SPAN); gl.uniform1f(uCam, CAM); gl.uniform1f(uY, yHalf); gl.uniform1f(uF, f); gl.uniform1f(uAsp, aspect); gl.uniform1f(uVis, visible);
    };

    const draw = () => {
      raf = 0;
      if (disposed) return;
      if (target != null) { offset += (target - offset) * 0.12; if (Math.abs(target - offset) < 0.0005) target = null; }
      else { offset += vel; vel *= 0.94; if (!reduce && !dragging && Math.abs(vel) < 0.00005) offset += 0.00012; }
      gl.uniform1f(uOff, offset);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, SEG * 6);
      if (visibleOnScreen && (!reduce || dragging || Math.abs(vel) > 0.00001 || target != null)) raf = requestAnimationFrame(draw);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

    // input: drag / swipe, horizontal wheel, arrow keys
    let dragging = false, lastX = 0;
    const perPx = () => visible / canvas.clientWidth;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; vel = 0; target = null; canvas.setPointerCapture(e.pointerId); kick(); };
    const move = (e: PointerEvent) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; offset -= dx * perPx(); vel = -dx * perPx(); kick(); };
    const up = () => { dragging = false; kick(); };
    const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; e.preventDefault(); vel = 0; offset += e.deltaX * perPx() * 0.6; kick(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); target = Math.round(offset * nCards + (e.key === 'ArrowRight' ? 1 : -1) - 0.5) / nCards + 0.5 / nCards; kick(); } };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false }); canvas.addEventListener('keydown', key);
    const io = new IntersectionObserver(([e]) => { visibleOnScreen = e.isIntersecting; if (visibleOnScreen) kick(); });
    io.observe(canvas);
    const onResize = () => { layout(); kick(); };
    window.addEventListener('resize', onResize);

    paintStrip(items).then((strip) => {
      if (disposed) return;
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strip);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      layout(); setReady(true); kick();
    }).catch(() => setFailed(true));

    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel); canvas.removeEventListener('keydown', key);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) return <FoldingCards items={items} label={label} />;
  return (
    <div className="relative rounded-md overflow-hidden" style={{ background: 'radial-gradient(120% 90% at 50% 10%, #ffffff 0%, #f1f1f3 60%, #e9e9ee 100%)' }}>
      <canvas
        ref={cv}
        tabIndex={0}
        role="img"
        aria-label={`${label}: ${items.map((i) => i.title).join(', ')}. Drag or use the arrow keys to move.`}
        className={`block w-full h-[440px] sm:h-[560px] cursor-grab active:cursor-grabbing outline-none focus-visible:shadow-[inset_0_0_0_2px_#ff4306] transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
        style={{ touchAction: 'pan-y' }}
      />
      <ul className="sr-only">
        {items.map((i) => <li key={i.title}>{i.tag}: {i.title}. {i.desc}</li>)}
      </ul>
    </div>
  );
}
