import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { RevealLines, Rise } from '../components/case-motion';
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

function LookingLogo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [o, setO] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const k = r.width / LOGO_VB.w;
      const cx = r.left + LENS_C.x * k, cy = r.top + LENS_C.y * k;
      const ax = e.clientX - cx, ay = e.clientY - cy, d = Math.hypot(ax, ay) || 1;
      const m = Math.min(1, d / 400) * (CUT_R - LENS_C.r - 0.6); // stays inside the cut
      setO({ x: (ax / d) * m, y: (ay / d) * m });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduce]);
  return <div ref={ref}><ScopeLogo dx={o.x} dy={o.y} className="block w-full h-auto" title="Scope" /></div>;
}

/* ── 01 Construction ───────────────────────────────────────────────────── */

function Construction() {
  const { tx } = useI18n();
  const [ref, on] = useSeen<HTMLDivElement>(0.3);
  const m = 2 * U;
  const L = -CS - m, T = -CS - m, W = LOGO_VB.w + 2 * (CS + m), H = DESC + 2 * (CS + m);
  const nsk = { vectorEffect: 'non-scaling-stroke' as const };
  const del = (s: number) => ({ ['--delay' as string]: `${s}s` });
  const cols: number[] = []; for (let x = -CS; x <= LOGO_VB.w + CS + 0.01; x += U) cols.push(x);
  const rows: number[] = []; for (let y = -CS; y <= DESC + CS + 0.01; y += U) rows.push(y);
  const guides: [number, string][] = [[0, tx('x-height', 'x-სიმაღლე')], [LENS_C.y, tx('lens axis', 'ლინზის ღერძი')], [XH, tx('baseline', 'საბაზისო ხაზი')], [DESC, tx('descender', 'ქვედა ხაზი')]];
  const corners = [[-CS, -CS], [LOGO_VB.w, -CS], [-CS, DESC], [LOGO_VB.w, DESC]];
  const a = Math.PI / 4; // where the gap is measured
  const fs = 1.25;
  const label = { fontSize: fs, fill: '#fff', fillOpacity: 0.7, fontFamily: 'Avenir Next Georgian, sans-serif' };

  return (
    <div ref={ref} className={`relative ${on ? 'ds-on' : ''}`}>
      <svg viewBox={`${L} ${T} ${W} ${H}`} className="block w-full h-auto" role="img"
        aria-label={tx('Scope logo construction: an 8 unit x-height, the lens centred on it, one circle cutting the c and the p, and clear space of 4 units', 'Scope-ის ლოგოს კონსტრუქცია: 8 მოდულის x-სიმაღლე, მასზე ცენტრირებული ლინზა, ერთი წრე, რომელიც c-სა და p-ს ჭრის, და 4 მოდულის თავისუფალი სივრცე')}>
        {/* module grid, 1u = x-height / 8 */}
        <g className="ds-fade" style={del(0)} stroke="#fff" strokeOpacity={0.07}>
          {cols.map((x) => <line key={`c${x}`} x1={x} x2={x} y1={-CS} y2={DESC + CS} style={nsk} />)}
          {rows.map((y) => <line key={`r${y}`} y1={y} y2={y} x1={-CS} x2={LOGO_VB.w + CS} style={nsk} />)}
        </g>

        {/* clear space */}
        <g className="ds-fade" style={del(2.6)}>
          {corners.map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width={CS} height={CS} fill={LIME} fillOpacity={0.14} />)}
          {corners.map(([x, y]) => <text key={`t${x}${y}`} x={x + CS / 2} y={y + CS / 2 + fs / 3} textAnchor="middle" {...label}>4u</text>)}
          <rect x={-CS} y={-CS} width={LOGO_VB.w + 2 * CS} height={DESC + 2 * CS} fill="none" stroke="#fff" strokeOpacity={0.28} style={nsk} />
        </g>

        {/* horizontal guides with their names */}
        {guides.map(([y, n], i) => (
          <g key={y}>
            <line x1={L} x2={L + W} y1={y} y2={y} stroke="#fff" strokeOpacity={0.4} strokeWidth={0.1} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '1.2s', ...del(0.3 + i * 0.12) }} />
            <text x={L + W - 0.6} y={y - 0.5} textAnchor="end" className="ds-fade" style={del(1 + i * 0.12)} {...label}>{n}</text>
          </g>
        ))}

        {/* the letters: faint fill, then the outline drawing itself */}
        <g className="ds-fade" style={del(1.6)} fill="#fff" fillOpacity={0.1}>{LETTERS.map((d, i) => <path key={i} d={d} />)}</g>
        <g fill="none" stroke="#fff" strokeWidth={0.13}>
          {LETTERS.map((d, i) => <path key={i} d={d} pathLength={1} className="ds-draw" style={{ ['--d' as string]: '2.4s', ...del(0.2 + i * 0.15) }} />)}
        </g>

        {/* the lens, and the one circle that cuts its neighbours */}
        <circle cx={LENS_C.x} cy={LENS_C.y} r={CUT_R} fill="none" stroke="#fff" strokeOpacity={0.55} strokeDasharray="4 4" className="ds-fade" style={{ ...del(2.2), ...nsk }} />
        <path d={LENS} fill={LIME} className="ds-fade" style={del(1.9)} />
        <g stroke={INK} strokeOpacity={0.8} className="ds-fade" style={del(2.2)}>
          <line x1={LENS_C.x - 1} x2={LENS_C.x + 1} y1={LENS_C.y} y2={LENS_C.y} style={nsk} />
          <line x1={LENS_C.x} x2={LENS_C.x} y1={LENS_C.y - 1} y2={LENS_C.y + 1} style={nsk} />
        </g>

        {/* measures */}
        <g className="ds-fade" style={del(2.9)} stroke={LIME} strokeWidth={1.4}>
          {/* x-height: 8u */}
          <line x1={-2} x2={-2} y1={0} y2={XH} style={nsk} />
          {/* lens: 7u */}
          <line x1={LENS_C.x - LENS_C.r} x2={LENS_C.x + LENS_C.r} y1={-2.2} y2={-2.2} style={nsk} />
          {/* gap: 1u */}
          <line x1={LENS_C.x + LENS_C.r * Math.cos(a)} y1={LENS_C.y + LENS_C.r * Math.sin(a)} x2={LENS_C.x + CUT_R * Math.cos(a)} y2={LENS_C.y + CUT_R * Math.sin(a)} style={nsk} />
          {/* descender: 3u */}
          <line x1={66} x2={66} y1={XH} y2={DESC} style={nsk} />
        </g>
        <g className="ds-fade" style={del(3)} {...label} fill={LIME} fillOpacity={1}>
          <text x={-2.6} y={XH / 2} textAnchor="end">8u</text>
          <text x={LENS_C.x} y={-3} textAnchor="middle">7u</text>
          <text x={LENS_C.x + (CUT_R + 1) * Math.cos(a)} y={LENS_C.y + (CUT_R + 1.6) * Math.sin(a)}>1u</text>
          <text x={66.8} y={(XH + DESC) / 2 + fs / 3}>3u</text>
        </g>
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
const WEB: { src: string; w: number; h: number; en: string; ka: string }[] = [];

export function ScopeCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = POSTS.map((src, i) => ({ src, alt: tx(`Scope social post ${i + 1}`, `Scope-ის პოსტი ${i + 1}`), brand: 'Scope' }));
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
        <div className="px-1.5">
          <div className="rounded-[4px] px-[4%] py-[5%]" style={{ background: INK }}><Construction /></div>
        </div>
        <div className="px-1.5 pt-1.5 grid grid-cols-1 md:grid-cols-3 gap-1.5">
          <Rise><div className="flex aspect-[4/3] items-center justify-center rounded-[4px]" style={{ background: INK }}><ScopeLogo className="w-[62%] h-auto" title="Scope" /></div></Rise>
          <Rise delay={0.05}><div className="flex aspect-[4/3] items-center justify-center rounded-[4px] bg-[#f2f2ef]"><ScopeLogo ink={INK} className="w-[62%] h-auto" title="Scope" /></div></Rise>
          <Rise delay={0.1}>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[4px] bg-[#f2f2ef]">
              <svg viewBox={TAG_VB} className="w-[72%] h-auto" role="img" aria-label="Target with Scope">
                <path d={TAG} fill={INK} />
                <path d={SWOOSH} fill="#9ecc3b" />
              </svg>
            </div>
          </Rise>
        </div>

        {/* ── 02 Motion ────────────────────────────────────────────────── */}
        <Mark no="02" name={tx('Motion', 'მოუშენი')} line={tx('The lens underlines what matters.', 'ლინზა ხაზს უსვამს მთავარს.')} />
        <div className="px-1.5 grid grid-cols-2 md:grid-cols-5 gap-1.5">
          {reels.map((r, i) => <Rise key={r.src} delay={i * 0.05} className={i === 4 ? 'hidden md:block' : ''}><Reel {...r} /></Rise>)}
        </div>

        {/* ── 03 Social ────────────────────────────────────────────────── */}
        <Mark no="03" name={tx('Social', 'სოციალური მედია')} line={tx('One voice across the feed.', 'ერთი ხმა მთელ ფიდში.')} />
        <div className="px-1.5 columns-2 md:columns-3 gap-1.5">
          {POSTS.map((src, i) => (
            <button key={src} type="button" onClick={() => setOpen(i)} aria-label={`${gallery[i].alt}, ${tx('enlarge', 'გადიდება')}`}
              className="group mb-1.5 block w-full overflow-hidden rounded-[4px] bg-[#eee] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#1e1e1e]">
              <img src={src} alt={gallery[i].alt} loading="lazy" decoding="async" className="block w-full h-auto transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>

        {/* ── 04 Web ───────────────────────────────────────────────────── */}
        {WEB.length > 0 && (
          <>
            <Mark no="04" name={tx('Website', 'ვებსაიტი')} line={tx('The agency, page by page.', 'სააგენტო, გვერდ-გვერდ.')} />
            <div className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {WEB.map((w, i) => (
                <Rise key={w.src} delay={i * 0.05}>
                  <div className="overflow-hidden rounded-[4px] bg-[#f2f2ef] p-[5%]">
                    <img src={w.src} width={w.w} height={w.h} alt={tx(w.en, w.ka)} loading="lazy" decoding="async" className="block w-full h-auto rounded-[6px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)]" />
                  </div>
                </Rise>
              ))}
            </div>
          </>
        )}

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
