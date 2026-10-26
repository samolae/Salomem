import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { ClipReveal, RevealLines, Rise } from '../components/case-motion';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { CASES } from './cases';
import { useI18n } from './i18n';
import { MotionStyles, useSeen } from './dasturi-motion';
import { LOGO_VB, LETTERS, LENS } from './scope-vectors';
import { TAG, TAG_VB, SWOOSH } from './scope-tag';
import { INK, LIME, ScopeLogo } from './scope-logo';

/*
 * Scope: a marketing agency whose o is a lens. The page is mostly the
 * brand's own black, the lime used only where the lens is.
 */

const P = '/cases/scope';
const CLD = 'https://res.cloudinary.com/dgfn598qb';

/* Measured on the master artwork (units of the 103 x 31.75 drawing) */
const XH = 23.25;            // x-height, the baseline sits here
const U = XH / 8;            // 1u, the module
const LENS_C = { x: 49.725, y: 11.62, r: 10.29 }; // centred exactly on half the x-height
const CUT_R = 13.33;         // the c and the p are both cut by this one circle
const DESC = 31.75;          // descender of the p
const CS = 4 * U;            // clear space

/* ── Hero: the lens looks where you look, inside its own gap ───────────── */

const [LENS_BODY, LENS_GLINT] = (() => { const i = LENS.indexOf('ZM') + 1; return [LENS.slice(0, i), LENS.slice(i)]; })();

/**
 * The lens follows the pointer on a spring: it leans toward it inside its
 * own gap, always a true circle, and the glint rolls further, as if
 * the lens turned to look. With no pointer it looks around on its own.
 */
function LookingLogo() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const lens = useRef<SVGGElement>(null);
  const glint = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (reduce) return;
    const MAX = CUT_R - LENS_C.r - 0.45;    // the whole gap, less a hair
    const ROLL = 2.4;                       // the glint travels further inside the lens
    const K = 55, D = 13.5;                 // a soft, nearly critically damped spring
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0;
    let last = performance.now(), lastMove = -1e9, raf = 0;
    const aim = (cx: number, cy: number) => {
      const r = box.current?.getBoundingClientRect(); if (!r) return;
      const k = r.width / LOGO_VB.w;
      const ax = cx - (r.left + LENS_C.x * k), ay = cy - (r.top + LENS_C.y * k);
      const d = Math.hypot(ax, ay) || 1;
      const reach = 1 - Math.pow(1 - Math.min(1, d / (r.width * 0.28)), 2); // eases out, full by ~a quarter of the logo
      tx = (ax / d) * MAX * reach; ty = (ay / d) * MAX * reach;
    };
    const onMove = (e: PointerEvent) => { if (e.pointerType === 'touch') return; lastMove = performance.now(); aim(e.clientX, e.clientY); };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      if (now - lastMove > 2500) { // nobody pointing: look around slowly
        const t = now / 1000;
        tx = Math.cos(t * 0.7) * MAX * 0.75; ty = Math.sin(t * 1.1) * MAX * 0.55;
      }
      vx += ((tx - x) * K - vx * D) * dt; vy += ((ty - y) * K - vy * D) * dt;
      x += vx * dt; y += vy * dt;
      lens.current?.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)})`); // the lens stays a perfect circle
      glint.current?.setAttribute('transform', `translate(${((x / MAX) * ROLL).toFixed(3)} ${((y / MAX) * ROLL).toFixed(3)})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); };
  }, [reduce]);
  return (
    <div ref={box}>
      <svg viewBox={`0 0 ${LOGO_VB.w} ${LOGO_VB.h}`} className="block w-full h-auto overflow-visible" role="img" aria-label="Scope">
        <g fill="#fff">{LETTERS.map((d, i) => <path key={i} d={d} />)}</g>
        <g ref={lens}><path d={LENS_BODY} fill={LIME} /><path ref={glint} d={LENS_GLINT} fill={INK} /></g>
      </svg>
    </div>
  );
}

/* ── 01 Construction, told in steps as you scroll ──────────────────────── */

const LIGHT = (225 * Math.PI) / 180; // the glint sits on light from the upper left

function ConstructionStory() {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const sec = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const steps = [
    { name: tx('Module', 'მოდული'), line: tx('x-height split in eight: 1u.', 'x-სიმაღლე რვად: 1u.') },
    { name: tx('Lens', 'ლინზა'), line: tx('7u, centred on the x-height.', '7u, x-სიმაღლის ცენტრში.') },
    { name: tx('One cut', 'ერთი ჭრილი'), line: tx('One circle trims the c and the p.', 'ერთი წრე ჭრის c-საც და p-საც.') },
    { name: tx('Light', 'სინათლე'), line: tx('The glint faces light at 45°.', 'ანარეკლი 45°-ით სინათლისკენ.') },
    { name: tx('Clear space', 'თავისუფალი სივრცე'), line: tx('4u on every side.', '4u ყველა მხარეს.') },
    { name: tx('Mark', 'ნიშანი'), line: tx('Everything else steps back.', 'დანარჩენი უკან იხევს.') },
  ];
  const [step, setStep] = useState(reduce ? steps.length - 1 : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (!reduce) setStep(Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999))); });

  const m = 2.2 * U;
  const L = -CS - m, T = -CS - m, W = LOGO_VB.w + 2 * (CS + m), H = DESC + 2 * (CS + m);
  const cols: number[] = []; for (let x = -CS; x <= LOGO_VB.w + CS + 0.01; x += U) cols.push(x);
  const rows: number[] = []; for (let y = -CS; y <= DESC + CS + 0.01; y += U) rows.push(y);
  const corners = [[-CS, -CS], [LOGO_VB.w, -CS], [-CS, DESC], [LOGO_VB.w, DESC]];
  const fs = 1.3;
  const txt = { fontSize: fs, fontFamily: 'Avenir Next Georgian, sans-serif' };
  const ease = 'cubic-bezier(.65,0,.35,1)';
  const show = (on: boolean, d = 0) => ({ opacity: on ? 1 : 0, transition: `opacity .7s ease ${on ? d : 0}s` });
  const draw = (on: boolean, d = 0, dur = 1.2) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset ${dur}s ${ease} ${on ? d : 0}s, opacity .5s` });
  const at = (n: number) => step >= n;
  const only = (n: number) => step === n;
  const final = step === 5;
  const cutR = at(2) ? CUT_R : LENS_C.r;
  const lx = LENS_C.x + Math.cos(LIGHT) * 17, ly = LENS_C.y + Math.sin(LIGHT) * 17;
  const gx = LENS_C.x + Math.cos(LIGHT) * 7.4, gy = LENS_C.y + Math.sin(LIGHT) * 7.4;

  return (
    <section ref={sec} className="relative" style={{ height: reduce ? 'auto' : `${steps.length * 70 + 40}svh` }} aria-label={tx('How the logo is built', 'როგორ არის აგებული ლოგო')}>
      <div className={`${reduce ? '' : 'sticky top-[52px] h-[calc(100svh-52px)]'} px-1.5 pb-1.5`}>
        <div className="flex h-full flex-col lg:flex-row rounded-[4px] overflow-hidden text-white" style={{ background: INK }}>
          {/* the steps */}
          <ol className="flex lg:flex-col gap-x-5 gap-y-0 overflow-x-auto lg:overflow-visible px-5 pt-5 lg:p-8 lg:w-[300px] shrink-0 lg:justify-center [scrollbar-width:none]">
            {steps.map((s, i) => (
              <li key={i} className="shrink-0 lg:py-3 transition-opacity duration-500" style={{ opacity: i === step ? 1 : i < step ? 0.45 : 0.25 }}>
                <div className="flex items-baseline gap-3 text-[13px]">
                  <span className="tabular-nums" style={{ color: i === step ? LIME : undefined }}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{s.name}</span>
                </div>
                <div className={`hidden lg:block overflow-hidden pl-[30px] text-[13px] text-white/60 transition-[max-height,opacity] duration-500 ${i === step ? 'max-h-12 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>{s.line}</div>
              </li>
            ))}
          </ol>
          <p className="lg:hidden px-5 pt-2 text-[13px] text-white/60" aria-live="polite">{steps[step].line}</p>

          {/* the drawing */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center p-4 lg:p-8">
            <svg viewBox={`${L} ${T} ${W} ${H}`} className="block w-full max-h-full" role="img"
              aria-label={tx('Scope logo construction: 1u is an eighth of the x-height; the lens is 7u and centred on it; one circle 1u outside the lens trims the c and the p; the glint faces light from the upper left; clear space is 4u.', 'Scope-ის ლოგოს კონსტრუქცია: 1u x-სიმაღლის მერვედია; ლინზა 7u-ა და ცენტრშია; ლინზიდან 1u-ით დაშორებული ერთი წრე ჭრის c-სა და p-ს; ანარეკლი ზედა მარცხენა სინათლისკენაა; თავისუფალი სივრცე 4u-ა.')}>

              {/* module grid */}
              <g stroke="#fff" strokeWidth={0.05} style={{ opacity: final ? 0 : at(0) ? 0.14 : 0, transition: 'opacity .8s' }}>
                {cols.map((x) => <line key={`c${x}`} x1={x} x2={x} y1={-CS} y2={DESC + CS} />)}
                {rows.map((y) => <line key={`r${y}`} y1={y} y2={y} x1={-CS} x2={LOGO_VB.w + CS} />)}
              </g>
              {/* the eight modules counted down the x-height */}
              <g style={show(only(0), 0.3)}>
                {Array.from({ length: 8 }, (_, i) => (
                  <rect key={i} x={-3.2} y={i * U + 0.15} width={1.1} height={U - 0.3} fill={LIME} style={{ opacity: only(0) ? 1 : 0, transition: `opacity .3s ${only(0) ? 0.3 + i * 0.07 : 0}s` }} />
                ))}
                <text x={-4} y={XH / 2 + fs / 3} textAnchor="end" fill={LIME} {...txt}>8u</text>
              </g>

              {/* guides */}
              {[[0, tx('x-height', 'x-სიმაღლე'), 0], [XH, tx('baseline', 'საბაზისო'), 0], [LENS_C.y, tx('axis', 'ღერძი'), 1], [DESC, tx('descender', 'ქვედა'), 0]].map(([y, n, from], i) => {
                const on = at(from as number) && !final;
                return (
                  <g key={i}>
                    <line x1={L} x2={L + W} y1={y as number} y2={y as number} stroke={from ? LIME : '#fff'} strokeOpacity={from ? 0.8 : 0.45} strokeWidth={0.08} pathLength={1} style={draw(on, 0.1 * i, 1)} />
                    <text x={L + W - 0.6} y={(y as number) - 0.5} textAnchor="end" fill="#fff" fillOpacity={0.6} {...txt} style={show(on, 0.6)}>{n as string}</text>
                  </g>
                );
              })}

              {/* the letters: outlines while building, solid at the end */}
              <g fill="#fff" style={{ opacity: final ? 1 : 0.1, transition: 'opacity .8s' }}>{LETTERS.map((d, i) => <path key={i} d={d} />)}</g>
              <g fill="none" stroke="#fff" strokeWidth={0.12}>
                {LETTERS.map((d, i) => <path key={i} d={d} pathLength={1} style={{ ...draw(at(0) && !final, 0.15 * i, 2), opacity: final ? 0 : 1 }} />)}
              </g>

              {/* 02 the lens: drawn, measured, centred */}
              <circle cx={LENS_C.x} cy={LENS_C.y} r={LENS_C.r} fill="none" stroke={LIME} strokeWidth={0.14} pathLength={1} transform={`rotate(-90 ${LENS_C.x} ${LENS_C.y})`} style={{ ...draw(at(1) && !final, 0.2, 1.3), opacity: at(1) && !final ? 1 : 0 }} />
              <g stroke={LIME} strokeWidth={0.1} style={show(only(1), 0.9)}>
                <line x1={LENS_C.x - LENS_C.r} x2={LENS_C.x + LENS_C.r} y1={-2.4} y2={-2.4} />
                <line x1={LENS_C.x - LENS_C.r} x2={LENS_C.x - LENS_C.r} y1={-3.1} y2={-1.7} />
                <line x1={LENS_C.x + LENS_C.r} x2={LENS_C.x + LENS_C.r} y1={-3.1} y2={-1.7} />
                <line x1={LENS_C.x - LENS_C.r - 1} x2={LENS_C.x - LENS_C.r - 1} y1={0} y2={LENS_C.y} strokeDasharray="0.4 0.4" />
                <line x1={LENS_C.x - LENS_C.r - 1} x2={LENS_C.x - LENS_C.r - 1} y1={LENS_C.y} y2={XH} strokeDasharray="0.4 0.4" />
              </g>
              <g style={show(only(1), 1)} fill={LIME} {...txt}>
                <text x={LENS_C.x} y={-3.4} textAnchor="middle">7u</text>
                <text x={LENS_C.x - LENS_C.r - 1.6} y={LENS_C.y / 2 + fs / 3} textAnchor="end">4u</text>
                <text x={LENS_C.x - LENS_C.r - 1.6} y={(LENS_C.y + XH) / 2 + fs / 3} textAnchor="end">4u</text>
              </g>
              <g stroke={LIME} strokeWidth={0.12} style={show(at(1) && !final, 0.5)}>
                <line x1={LENS_C.x - 1} x2={LENS_C.x + 1} y1={LENS_C.y} y2={LENS_C.y} />
                <line x1={LENS_C.x} x2={LENS_C.x} y1={LENS_C.y - 1} y2={LENS_C.y + 1} />
              </g>

              {/* 03 one cut: the ring grows out of the lens to where c and p stop */}
              <circle cx={LENS_C.x} cy={LENS_C.y} r={cutR} fill={only(2) ? LIME : 'none'} fillOpacity={0.08} stroke="#fff" strokeWidth={0.1} strokeDasharray="0.6 0.5"
                style={{ opacity: at(2) && !final ? 1 : 0, transition: `r 1.1s ${ease}, opacity .6s, fill-opacity .6s` }} />
              <g style={show(only(2), 1)}>
                <line x1={LENS_C.x + LENS_C.r * Math.cos(-0.5)} y1={LENS_C.y + LENS_C.r * Math.sin(-0.5)} x2={LENS_C.x + CUT_R * Math.cos(-0.5)} y2={LENS_C.y + CUT_R * Math.sin(-0.5)} stroke={LIME} strokeWidth={0.14} />
                <line x1={LENS_C.x + LENS_C.r * Math.cos(Math.PI + 0.5)} y1={LENS_C.y + LENS_C.r * Math.sin(Math.PI + 0.5)} x2={LENS_C.x + CUT_R * Math.cos(Math.PI + 0.5)} y2={LENS_C.y + CUT_R * Math.sin(Math.PI + 0.5)} stroke={LIME} strokeWidth={0.14} />
                <text x={LENS_C.x + (CUT_R + 0.8) * Math.cos(-0.5)} y={LENS_C.y + (CUT_R + 0.8) * Math.sin(-0.5)} fill={LIME} {...txt}>1u</text>
                <text x={LENS_C.x + (CUT_R + 0.8) * Math.cos(Math.PI + 0.5)} y={LENS_C.y + (CUT_R + 0.8) * Math.sin(Math.PI + 0.5)} textAnchor="end" fill={LIME} {...txt}>1u</text>
              </g>

              {/* the lens fills once it is placed; 04 the glint and its light */}
              <path d={LENS} fill={LIME} style={{ opacity: at(3) ? 1 : 0, transition: 'opacity .8s' }} />
              <g style={show(only(3), 0.4)}>
                <line x1={lx} y1={ly} x2={gx} y2={gy} stroke="#fff" strokeWidth={0.1} pathLength={1} style={draw(only(3), 0.4, 0.9)} />
                <path d={`M${gx} ${gy}l1.6 -0.2l-0.6 1.5z`} fill="#fff" transform={`rotate(-45 ${gx} ${gy})`} />
                <circle cx={lx} cy={ly} r={0.9} fill="none" stroke="#fff" strokeWidth={0.1} />
                <text x={lx - 1.4} y={ly - 0.6} textAnchor="end" fill="#fff" fillOpacity={0.75} {...txt}>45°</text>
              </g>

              {/* 05 clear space */}
              <g style={show(at(4) && !final, 0.1)}>
                {corners.map(([x, y], i) => <rect key={i} x={x} y={y} width={CS} height={CS} fill={LIME} fillOpacity={only(4) ? 0.18 : 0} style={{ transition: 'fill-opacity .6s' }} />)}
                {corners.map(([x, y], i) => <text key={`t${i}`} x={x + CS / 2} y={y + CS / 2 + fs / 3} textAnchor="middle" fill="#fff" fillOpacity={0.75} {...txt} style={show(only(4), 0.5)}>4u</text>)}
                <rect x={-CS} y={-CS} width={LOGO_VB.w + 2 * CS} height={DESC + 2 * CS} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={0.08} pathLength={1} style={draw(at(4), 0.1, 1.4)} />
                <rect x={0} y={0} width={LOGO_VB.w} height={DESC} fill="none" stroke={LIME} strokeOpacity={0.6} strokeWidth={0.08} strokeDasharray="0.6 0.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tagline: the swoosh is drawn by hand, stroke by stroke ──────────── */

// the swoosh's own route, in the order the outline runs: a short stroke,
// a flick back, then the long underline
const SWOOSH_ROUTE = 'M655 197.5Q715 186 774 178.5Q650 178 526 185.5Q700 163 857 156.5';

function Tagline() {
  const [ref, on] = useSeen<HTMLDivElement>(0.5);
  const [run, setRun] = useState(0);
  const id = useId().replace(/:/g, '');
  const reduce = useReducedMotion();
  // once seen, the swoosh keeps drawing itself again every few seconds
  useEffect(() => {
    if (!on || reduce) return;
    const t = window.setInterval(() => setRun((r) => r + 1), 3800);
    return () => window.clearInterval(t);
  }, [on, reduce]);
  return (
    <div ref={ref} className={`flex aspect-[4/3] items-center justify-center rounded-[4px] bg-[#f2f2ef] ${on ? 'ds-on' : ''}`}>
      <svg viewBox={TAG_VB} className="w-[72%] h-auto overflow-visible" role="img" aria-label="Target with Scope">
        <defs>
          <mask id={`sw-${id}`} maskUnits="userSpaceOnUse" x="490" y="130" width="400" height="90">
            <path key={run} d={SWOOSH_ROUTE} fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.1s', ['--delay' as string]: run ? '0s' : '.35s' }} />
          </mask>
        </defs>
        <path d={TAG} fill={INK} />
        <path d={SWOOSH} fill="#9ecc3b" mask={`url(#sw-${id})`} />
      </svg>
    </div>
  );
}

/* ── Films: play when on screen, one with sound at a time ──────────────── */

function Reel({ src, poster, label }: { src: string; poster: string; label: string }) {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.35 });
    io.observe(v);
    const hush = (e: Event) => { if ((e as CustomEvent).detail !== v) { v.muted = true; setMuted(true); } };
    window.addEventListener('scope-sound', hush);
    return () => { io.disconnect(); window.removeEventListener('scope-sound', hush); };
  }, [reduce]);
  const toggle = () => {
    const v = ref.current; if (!v) return;
    const next = !v.muted ? true : false;
    v.muted = next; setMuted(next);
    if (!next) { window.dispatchEvent(new CustomEvent('scope-sound', { detail: v })); v.play().catch(() => {}); }
  };
  return (
    <figure className="relative overflow-hidden rounded-[4px] bg-black aspect-[9/16]">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} className="absolute inset-0 h-full w-full object-cover" />
      <button type="button" onClick={toggle} aria-pressed={!muted} aria-label={muted ? tx('Turn sound on', 'ხმის ჩართვა') : tx('Turn sound off', 'ხმის გამორთვა')}
        className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/65 outline-none focus-visible:shadow-[0_0_0_2px_#9aff01]">
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

/** full-bleed, revealed as it scrolls in */
function Bleed({ children, ratio = '16/9' }: { children: React.ReactNode; ratio?: string }) {
  return (
    <div className="px-1.5">
      <ClipReveal className="overflow-hidden rounded-[4px]"><div className="w-full" style={{ aspectRatio: ratio }}>{children}</div></ClipReveal>
    </div>
  );
}

/* ── Chapter marker ────────────────────────────────────────────────────── */

function Mark({ no, name, line, dark }: { no: string; name: string; line: string; dark?: boolean }) {
  return (
    <div className={`grid grid-cols-12 gap-x-6 items-baseline px-3 sm:px-5 lg:px-8 pt-24 sm:pt-32 pb-6 sm:pb-8 ${dark ? 'text-white' : ''}`}>
      <div className={`col-span-12 sm:col-span-3 text-[12px] uppercase tracking-[0.08em] ${dark ? 'text-white/55' : 'text-black/50'}`}>
        <span className="tabular-nums" style={{ color: dark ? LIME : INK }}>{no}</span>&nbsp;&nbsp;{name}
      </div>
      <RevealLines as="h2" className="col-span-12 sm:col-span-9 mt-2 sm:mt-0 text-[24px] sm:text-[34px] lg:text-[40px] leading-[1.08] tracking-[-0.02em]" style={{ fontWeight: 500 }}>
        <span>{line}</span>
      </RevealLines>
    </div>
  );
}

const POSTS = [
  'v1773268321/image_15_nafa1y.png',
  'v1773268322/%E1%83%A0%E1%83%90%E1%83%A2%E1%83%9D%E1%83%9B-%E1%83%95%E1%83%94%E1%83%A0-%E1%83%A7%E1%83%98%E1%83%93%E1%83%98%E1%83%A1_1_taleoy.png',
  'v1773268323/image_16_gy0yln.png',
  'v1773268322/image_13_x8vcgr.png',
  'v1773268322/image_12_mtrhqg.png',
  'v1773268323/image_14_tng1vh.png',
].map((p) => `${CLD}/image/upload/f_auto,q_auto,w_1200/${p}`);

/** Website pages from the Figma file; shown once the exports are in */
const W = `${P}/web`;

export function ScopeCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = [
    ...POSTS.map((src, i) => ({ src, alt: tx(`Scope social post ${i + 1}`, `Scope-ის პოსტი ${i + 1}`), brand: 'Scope' })),
  ];
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'Scope'],
    [tx('Year', 'წელი'), '2024'],
    [tx('Sector', 'სექტორი'), tx('Marketing agency', 'მარკეტინგული სააგენტო')],
    [tx('Work', 'სამუშაო'), tx('Logo, identity, motion, social, web', 'ლოგო, იდენტობა, მოუშენი, სოც. მედია, ვები')],
  ];
  const reels = [
    { src: `${P}/business.mp4`, poster: `${P}/business.jpg`, label: tx('Want to run a business?', 'ბიზნესის მართვა გინდა?') },
    { src: `${P}/marketers.mp4`, poster: `${P}/marketers.jpg`, label: tx("We're not marketers", 'ჩვენ არ ვართ მარკეტერები') },
    { src: `${P}/casting.mp4`, poster: `${P}/casting.jpg`, label: tx('Scope is casting', 'Scope ეძებს მსახიობებს') },
    { src: `${CLD}/video/upload/f_auto,q_auto/v1773267441/scope-partner_wggbwt.mp4`, poster: `${CLD}/video/upload/so_1,w_720/v1773267441/scope-partner_wggbwt.jpg`, label: 'Scope Partner' },
    { src: `${CLD}/video/upload/f_auto,q_auto/v1773267433/saloni_q98ayn.mp4`, poster: `${CLD}/video/upload/so_1,w_720/v1773267433/saloni_q98ayn.jpg`, label: 'Saloni Furniture' },
    { src: `${CLD}/video/upload/f_auto,q_auto/v1773267408/bog_scope_urad4o.mp4`, poster: `${CLD}/video/upload/so_1,w_720/v1773267408/bog_scope_urad4o.jpg`, label: 'BOG × Scope' },
  ];

  return (
    <BakedShell>
      <SEO
        title="Scope | Logo & Brand Identity Case Study"
        description="Scope, a Georgian marketing agency: a logo whose o is a lens, built on an 8 unit grid, carried into motion, social and the website."
        keywords="Scope, logo design, brand identity, logo grid, marketing agency, Georgia, motion, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/scope" />
      <MotionStyles />

      <article className="pt-14 sm:pt-[52px]" style={{ color: INK }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="px-1.5">
          <div className="relative flex h-[calc(100svh-64px)] min-h-[520px] flex-col overflow-hidden rounded-[4px] text-white" style={{ background: INK }}>
            <div className="flex items-start justify-between p-4 sm:p-6 text-[13px]">
              <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
              <span className="text-white/55">{tx('Logo design', 'ლოგოს დიზაინი')}</span>
            </div>
            <div className="flex flex-1 items-center justify-center px-[8%]">
              <div className="w-full max-w-[1100px]"><LookingLogo /></div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-t border-white/20 pt-4 text-[12.5px]">
                {facts.map(([k, v]) => (<div key={k}><div className="text-white/55">{k}</div><div className="mt-0.5 text-white/90">{v}</div></div>))}
              </div>
            </div>
          </div>
        </header>

        {/* ── 01 Logo ──────────────────────────────────────────────────── */}
        <Mark no="01" name={tx('Logo', 'ლოგო')} line={tx('The o is a lens.', 'o ლინზაა.')} />
        <ConstructionStory />
        <div className="px-1.5 pt-1.5 grid grid-cols-1 md:grid-cols-3 gap-1.5">
          <Rise><div className="flex aspect-[4/3] items-center justify-center rounded-[4px]" style={{ background: INK }}><ScopeLogo className="w-[62%] h-auto" title="Scope" /></div></Rise>
          <Rise delay={0.05}><div className="flex aspect-[4/3] items-center justify-center rounded-[4px] bg-[#f2f2ef]"><ScopeLogo ink={INK} className="w-[62%] h-auto" title="Scope" /></div></Rise>
          <Rise delay={0.1}><Tagline /></Rise>
        </div>

        {/* ── 02 Motion ────────────────────────────────────────────────── */}
        <Mark no="02" name={tx('Motion', 'მოუშენი')} line={tx('The lens underlines what matters.', 'ლინზა ხაზს უსვამს მთავარს.')} />
        <div className="px-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {reels.slice(0, 3).map((r, i) => <Rise key={r.src} delay={i * 0.05}><Reel {...r} /></Rise>)}
        </div>

        {/* ── 03 Social ────────────────────────────────────────────────── */}
        <Mark no="03" name={tx('Social', 'სოციალური მედია')} line={tx('One voice across the feed.', 'ერთი ხმა მთელ ფიდში.')} />
        <div className="px-1.5 columns-2 md:columns-3 gap-1.5">
          {reels.slice(3).map((r) => <div key={r.src} className="mb-1.5 break-inside-avoid"><Reel {...r} /></div>)}
          {POSTS.map((src, i) => (
            <button key={src} type="button" onClick={() => setOpen(i)} aria-label={`${gallery[i].alt}, ${tx('enlarge', 'გადიდება')}`}
              className="group mb-1.5 block w-full break-inside-avoid overflow-hidden rounded-[4px] bg-[#eee] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#1e1e1e]">
              <img src={src} alt={gallery[i].alt} loading="lazy" decoding="async" className="block w-full h-auto transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>

        {/* ── 04 Web ───────────────────────────────────────────────────── */}
        <Mark no="04" name={tx('Website', 'ვებსაიტი')} line={tx('Built to sell, not to explain.', 'გაყიდვისთვის, არა ახსნისთვის.')} />
        <Bleed>
          <img src={`${W}/fold.jpg`} width={1440} height={810} alt={tx('Scope website, the first screen', 'Scope-ის ვებსაიტი, პირველი ეკრანი')} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
        </Bleed>
        <div className="px-1.5 pt-1.5 grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <Rise className="md:col-span-8">
            <img src={`${W}/results.jpg`} width={1440} height={810} alt={tx('Scope website, the results block', 'Scope-ის ვებსაიტი, შედეგების ბლოკი')} loading="lazy" decoding="async" className="block w-full h-auto rounded-[4px]" />
          </Rise>
          <Rise delay={0.05} className="md:col-span-4">
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-[4px] py-8" style={{ background: LIME }}>
              <img src={`${W}/mobile-fold.jpg`} width={780} height={1688} alt={tx('Scope website on a phone', 'Scope-ის ვებსაიტი ტელეფონზე')} loading="lazy" decoding="async"
                className="block w-[46%] min-w-[150px] h-auto rounded-[22px] border-[5px] border-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]" />
            </div>
          </Rise>
        </div>

        {/* ── Close ────────────────────────────────────────────────────── */}
        <div className="px-3 sm:px-5 lg:px-8 py-28 sm:py-40 grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <RevealLines as="p" className="col-span-12 lg:col-span-7 text-[28px] sm:text-[44px] leading-[1.05] tracking-[-0.025em]" style={{ fontWeight: 500 }}>
            <span>{tx('A small mark that sees a lot.', 'პატარა ნიშანი, რომელიც ბევრს ხედავს.')}</span>
          </RevealLines>
          <div className="col-span-12 lg:col-span-5 lg:justify-self-end"><CtaLink /></div>
        </div>
      </article>

      <section aria-labelledby="more" className="px-1.5 pt-24">
        <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('More case studies', 'სხვა ქეისები')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5">
          {CASES.map((o) => (
            <CaseLink key={o.slug} to={o.path} cardId={`scope-${o.slug}`} className="group block">
              <div className="overflow-hidden rounded-md" style={{ background: o.stage, padding: '7%' }}>
                <img {...IMG.caseSide(o.hero)} alt={`${o.title} interface`} loading="lazy" decoding="async" className="block w-full h-auto rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-[1.015]" />
              </div>
              <Caption title={o.title} sub={o.subtitle} tag="Case study" />
            </CaseLink>
          ))}
        </div>
      </section>

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
