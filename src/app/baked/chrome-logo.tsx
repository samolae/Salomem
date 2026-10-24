import { useEffect, useRef, useState } from 'react';

/*
 * The Dasturi ibex in liquid chrome. A height map of the mark (red = bevel
 * height, green = coverage) is lit in a fragment shader: the surface normal
 * reflects a studio environment (bright sky, dark horizon, warm floor) that
 * turns slowly on its own and follows the pointer. One reveal on load, then
 * only the reflections move. Falls back to the flat gold mark without WebGL
 * or with reduced motion (rendered once, still).
 */

const VERT = `
attribute vec2 p;
varying vec2 uv;
void main(){ uv = p * 0.5 + 0.5; uv.y = 1.0 - uv.y; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform vec2 texel;
uniform float time;
uniform vec2 mouse;
uniform float reveal;

float H(vec2 o){ return texture2D(tex, uv + o * texel).r; }

mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,-s, 0.,s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,s, 0.,1.,0., -s,0.,c); }

vec3 env(vec3 r){
  float e = r.y;
  // sky: steel grey low, white high
  vec3 sky = mix(vec3(0.30,0.32,0.36), vec3(1.0), smoothstep(0.0, 0.42, e));
  // floor: black at the horizon, warm stone below
  vec3 floorc = mix(vec3(0.015,0.014,0.012), vec3(0.62,0.53,0.42), smoothstep(-0.02, -0.75, e));
  vec3 c = mix(floorc, sky, smoothstep(-0.01, 0.01, e));
  // hard dark horizon and a bright window band above it
  c *= 1.0 - 0.9 * exp(-pow((e - 0.015) / 0.03, 2.0));
  c += vec3(0.9) * exp(-pow((e - 0.2) / 0.035, 2.0)) * smoothstep(-0.6, 0.2, sin(r.x * 3.0));
  // vertical soft-box streaks
  c += vec3(0.6) * pow(max(0.0, sin(r.x * 4.0 + 1.3)), 30.0) * smoothstep(-0.1, 0.3, e);
  return c;
}

void main(){
  vec4 t = texture2D(tex, uv);
  float cover = t.g;
  // the one load moment: the metal rises from the hooves to the horns
  float rise = 1.0 - smoothstep(reveal - 0.12, reveal, 1.0 - uv.y);
  if (cover * rise < 0.003) { gl_FragColor = vec4(0.0); return; }

  float k = 1.6;
  float dx = H(vec2(k,0.)) - H(vec2(-k,0.));
  float dy = H(vec2(0.,k)) - H(vec2(0.,-k));
  vec3 n = normalize(vec3(-dx * 10.0, dy * 10.0, 1.0));

  // a perspective view ray, so flat faces still sweep through the reflection
  vec3 v = normalize(vec3((uv.x - 0.5) * 0.9, -(uv.y - 0.5) * 1.1, -1.0));
  vec3 r = reflect(v, n);
  float yaw = mouse.x * 0.55 + sin(time * 0.23) * 0.35;
  float pitch = 0.05 + mouse.y * 0.30 + sin(time * 0.17 + 1.0) * 0.12;
  r = rotY(yaw) * rotX(pitch) * r;

  vec3 c = env(r);

  // a key light that sits where the pointer is
  vec3 L = normalize(vec3(mouse.x * 0.8, 0.6 - mouse.y * 0.6, 1.0));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.,0.,1.)), 0.0), 70.0);
  c += vec3(1.0, 0.98, 0.94) * spec * 0.9;

  // a whisper of champagne so it belongs to the brand
  c *= vec3(1.0, 0.975, 0.93);

  float a = cover * rise;
  gl_FragColor = vec4(c * a, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

export function ChromeLogo({ src, fallback, alt, className = '' }: { src: string; fallback: string; alt: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!gl) { setFailed(true); return; }
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let visible = true;
    let disposed = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const t0 = performance.now();

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch { setFailed(true); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uTexel = u('texel'), uTime = u('time'), uMouse = u('mouse'), uReveal = u('reveal');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      gl.viewport(0, 0, cv.width, cv.height);
    };

    const draw = () => {
      if (disposed) return;
      const t = (performance.now() - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      resize();
      gl.uniform1f(uTime, still ? 2.0 : t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uReveal, still ? 1.2 : Math.min(1.2, t / 1.6));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!still && visible) raf = requestAnimationFrame(draw);
    };

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform2f(uTexel, 1 / img.width, 1 / img.height);
      setReady(true);
      draw();
    };
    img.onerror = () => setFailed(true);
    img.src = src;

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const io = new IntersectionObserver(([en]) => {
      const was = visible;
      visible = en.isIntersecting;
      if (visible && !was && !still) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    if (!still) window.addEventListener('pointermove', onMove, { passive: true });
    const onResize = () => { if (still) draw(); };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`} role="img" aria-label={alt}>
      {failed ? (
        <img src={fallback} alt="" className="block w-full h-full object-contain" />
      ) : (
        <canvas ref={canvas} className={`block w-full h-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </div>
  );
}
