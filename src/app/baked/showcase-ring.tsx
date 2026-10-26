import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cld } from '../lib/cld';

/*
 * Showcase ring: a product's screens stand on a slowly turning 3D ring,
 * after the "Showcase" template on animos.app. Built in CSS 3D so it stays
 * sharp at any size. It turns on its own, can be dragged, slows under the
 * pointer, and only runs while on screen. Reduced motion gets a still ring.
 */

export function ShowcaseRing({ screens, bg, label, tilt = -10 }: { screens: string[]; bg: string; label: string; tilt?: number }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  // enough cards to close the ring
  const cards = screens.length >= 8 ? screens : Array.from({ length: Math.ceil(8 / screens.length) * screens.length }, (_, i) => screens[i % screens.length]);
  const n = cards.length;
  const cardW = Math.max(150, w * (w < 640 ? 0.42 : 0.26));
  const R = (cardW / 2) / Math.tan(Math.PI / n) * 1.08;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current, r = ring.current;
    if (!el || !r) return;
    let angle = 0, vel = reduce ? 0 : 7, target = vel, raf = 0, last = performance.now(), visible = false;
    let drag: { x: number; a: number } | null = null;
    const set = () => { r.style.transform = `translateZ(${-R}px) rotateX(${tilt}deg) rotateY(${angle}deg)`; };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!drag) { vel += (target - vel) * Math.min(1, dt * 2); angle -= vel * dt; }
      set();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { threshold: 0 });
    io.observe(el);
    const enter = () => { target = reduce ? 0 : 2.5; };
    const leave = () => { target = reduce ? 0 : 7; };
    const down = (e: PointerEvent) => { drag = { x: e.clientX, a: angle }; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (drag) { angle = drag.a + (e.clientX - drag.x) * 0.25; set(); } };
    const up = () => { drag = null; };
    el.addEventListener('pointerenter', enter); el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    set();
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
    };
  }, [R, tilt, reduce]);

  return (
    <div ref={box} role="img" aria-label={label}
      className="relative w-full overflow-hidden rounded-md select-none touch-pan-y cursor-grab active:cursor-grabbing"
      style={{ background: bg, aspectRatio: w < 640 ? '4/3' : '16/8', perspective: `${Math.max(900, w * 1.4)}px` }}>
      <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
        <div ref={ring} style={{ transformStyle: 'preserve-3d' }}>
          {w > 0 && cards.map((src, i) => (
            <div key={i} className="absolute" style={{ width: cardW, left: -cardW / 2, top: -(cardW * 0.62) / 2, transform: `rotateY(${(360 / n) * i}deg) translateZ(${R}px)`, transformStyle: 'preserve-3d' }}>
              <img src={cld(src, 720)} alt="" draggable={false} loading="lazy" decoding="async"
                className="block w-full aspect-[16/10] object-cover object-top rounded-[8px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-black/10" />
            </div>
          ))}
        </div>
      </div>
      {/* soft vignette so the ring sinks into the stage at its sides */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.18), transparent 22%, transparent 78%, rgba(0,0,0,0.18))' }} />
    </div>
  );
}
