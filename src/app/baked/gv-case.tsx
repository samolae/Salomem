import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { CaseHeroTarget } from '../components/case-transition';
import { SEO } from '../components/seo';
import { Marquee, RevealLines, Rise } from '../components/case-motion';
import { BakedShell } from './shell';
import { CtaLink, Lightbox, type LightboxItem } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';

/*
 * GV Capital: identity for an investment and development holding.
 * Laid out the way the live guidelines show it: one content width, every
 * picture and film at its own proportions (rows are justified so nothing is
 * cropped or blown up), the motion pieces from the guidelines, and the
 * paper and screen work last and small.
 */

const P = '/cases/gv';
const M = '/cases/gv/m';
const X = '/cases/gv/x';
const CARBON = '#16232A';
const EMERALD = '#0A6670';
const LIVE = 'https://gv-capital.vercel.app/';

/* The brand's own palette and type, from the live guidelines */
const B = { emerald: '#0A6670', mist: '#E4EEF0', midnight: '#16232A', orange: '#FF5804', paper: '#F4F7F6', mint: '#B4D3D5', mintOn: '#C7E0E1', muted: '#51646B' };
const TITLE = '"GV Extended", "Arial Black", sans-serif';
const TEXT = '"GV Text", Arial, sans-serif';
const FONTS = `
@font-face{font-family:"GV Extended";src:url(/cases/gv/fonts/aktiv-grotesk-extended-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"GV Extended";src:url(/cases/gv/fonts/aktiv-grotesk-extended-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:"GV Extended";src:url(/cases/gv/fonts/aktiv-grotesk-extended-700-normal.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"GV Text";src:url(/cases/gv/fonts/aktiv-grotesk-georgian-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"GV Text";src:url(/cases/gv/fonts/aktiv-grotesk-georgian-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}`;

type Tone = 'paper' | 'white' | 'mist' | 'midnight' | 'emerald';
const TONES: Record<Tone, { bg: string; ink: string; label: string; soft: string }> = {
  paper: { bg: B.paper, ink: B.midnight, label: B.emerald, soft: B.muted },
  white: { bg: '#FFFFFF', ink: B.midnight, label: B.emerald, soft: B.muted },
  mist: { bg: B.mist, ink: B.midnight, label: B.emerald, soft: B.muted },
  midnight: { bg: B.midnight, ink: '#FFFFFF', label: B.mint, soft: 'rgba(255,255,255,0.62)' },
  emerald: { bg: B.emerald, ink: '#FFFFFF', label: B.mintOn, soft: 'rgba(255,255,255,0.72)' },
};

/** a picture or a film, with its real size */
type Media = { key: string; w: number; h: number; en: string; ka: string; src: string; small?: string; video?: string };

const img = (key: string, w: number, h: number, en: string, ka: string, dir = P, small = '-1200'): Media =>
  ({ key, w, h, en, ka, src: `${dir}/${key}.jpg`, small: `${dir}/${key}${small}.jpg` });
const film = (key: string, w: number, h: number, en: string, ka: string, video: string, poster: string): Media =>
  ({ key, w, h, en, ka, src: poster, video });

const MEDIA = {
  cover: film('cover', 1920, 1080, 'Brand film', 'ბრენდის ფილმი', `${P}/cover.mp4`, `${P}/facade.jpg`),
  foundation: img('foundation', 2000, 2000, 'Perspective from above', 'პერსპექტივა ზემოდან', M, '-1100'),
  focus: img('focus', 2000, 1778, 'A focus booth in the office', 'ფოკუსის კაბინა ოფისში', M, '-1100'),
  logo: film('logo', 720, 1280, 'The logo in motion', 'ლოგო მოძრაობაში', `${M}/logo.mp4`, `${M}/logo-poster.jpg`),
  wall: img('reception-wall', 2000, 1125, 'Reception wall', 'მისაღების კედელი', M, '-1100'),
  hoodie: img('hoodie', 1536, 1024, 'Team hoodie', 'გუნდის ჰუდი'),
  zones: img('zones', 2000, 1125, 'Colour-coded zones with directional arrows', 'ფერებით გამოყოფილი ზონები მიმართულების ისრებით', M, '-1100'),
  campus: film('campus', 1920, 1080, 'Logistics campus', 'ლოჯისტიკური კომპლექსი', `${M}/campus.mp4`, `${M}/campus-poster.jpg`),
  reception: film('reception', 1248, 1664, 'Office reception', 'ოფისის მისაღები', `${P}/reception.mp4`, `${P}/reception-1200.jpg`),
  blade: img('blade', 1333, 2000, 'Layered wayfinding blade', 'შრეებიანი ნავიგაციის ნიშანი', M, '-1100'),
  wayfinding: film('wayfinding-office', 1664, 1248, 'Wayfinding in the office', 'ნავიგაცია ოფისში', `${M}/wayfinding-office.mp4`, `${M}/wayfinding-office-poster.jpg`),
  corridor: img('corridor', 1744, 2336, 'Corridor with directional blades', 'დერეფანი მიმართულების ნიშნებით'),
  facade: film('facade', 1920, 1080, 'Warehouse facade', 'საწყობის ფასადი', `${P}/facade.mp4`, `${P}/facade-1200.jpg`),
  flags: film('flags', 1248, 1664, 'Flags', 'დროშები', `${P}/flags.mp4`, `${P}/flags-1200.jpg`),
  fleet: film('fleet', 1920, 1080, 'Fleet', 'ავტოპარკი', `${M}/fleet.mp4`, `${M}/fleet-poster.jpg`),
  hardhat: img('hardhat-hq', 1086, 1448, 'Site hard hat', 'სამშენებლო ჩაფხუტი', M, '-1100'),
  packaging: img('packaging-hq', 1086, 1448, 'Packaging tape and box', 'შეფუთვის ლენტი და ყუთი', M, '-1100'),
  card: film('business-card', 1248, 1664, 'Business card', 'სავიზიტო ბარათი', `${M}/business-card.mp4`, `${M}/business-card-poster.jpg`),
  folder: film('folder', 1248, 1664, 'Folder', 'საქაღალდე', `${M}/folder.mp4`, `${M}/folder-poster.jpg`),
  uniform: film('uniform', 1248, 1664, 'Uniform', 'უნიფორმა', `${M}/uniform.mp4`, `${M}/uniform-poster.jpg`),
  material: film('material', 1248, 1664, 'Embossed mark on fabric', 'ამოტვიფრული ნიშანი ქსოვილზე', `${M}/material.mp4`, `${M}/material-poster.jpg`),
  s1: img('social-opportunities', 1080, 1350, 'Social post: space that creates opportunities', 'პოსტი: სივრცე, რომელიც ქმნის შესაძლებლობებს'),
  s2: img('social-possibility', 1080, 1350, 'Social post: built around possibility', 'პოსტი: შესაძლებლობის გარშემო'),
  s3: img('social-perspective', 1080, 1350, 'Social post: a long-term view', 'პოსტი: გრძელვადიანი ხედვა'),
  s4: img('social-focus', 1080, 1350, 'Social post: built for focus', 'პოსტი: ფოკუსისთვის'),
  cards: img('cards', 1744, 2336, 'Business cards', 'სავიზიტო ბარათები'),
  letterhead: img('letterhead', 1200, 1697, 'Letterhead', 'ბლანკი', P, ''),
  document: img('document', 1200, 1697, 'Project proposal cover', 'პროექტის შეთავაზების ყდა', P, ''),
  profile: img('profile', 1200, 1697, 'Company profile', 'კომპანიის პროფილი', P, ''),
  company: img('company', 1280, 720, 'Company presentation', 'კომპანიის პრეზენტაცია', P, ''),
  layouts: img('layouts', 1280, 720, 'Presentation template', 'პრეზენტაციის შაბლონი', P, ''),
  sc1: img('sc-01-opportunities', 1080, 1350, 'Campaign: space that creates opportunities', 'კამპანია: სივრცე, რომელიც ქმნის შესაძლებლობებს', X, '-1100'),
  sc2: img('sc-02-possibility', 1080, 1350, 'Campaign: built around possibility', 'კამპანია: შესაძლებლობის გარშემო', X, '-1100'),
  sc3: img('sc-03-perspective', 1080, 1350, 'Campaign: a long-term view', 'კამპანია: გრძელვადიანი ხედვა', X, '-1100'),
  sc4: img('sc-04-connection', 1080, 1350, 'Campaign: space to connect', 'კამპანია: სივრცე კავშირისთვის', X, '-1100'),
  sc5: img('sc-05-direction', 1080, 1350, 'Campaign: a clear direction', 'კამპანია: მკაფიო მიმართულება', X, '-1100'),
  sc6: img('sc-06-focus', 1080, 1350, 'Campaign: built for focus', 'კამპანია: ფოკუსისთვის', X, '-1100'),
  lilo: img('lilo', 1800, 1013, 'Lilo logistics park', 'ლილოს ლოჯისტიკური პარკი', X, '-1100'),
  phonichala: img('phonichala', 1800, 1013, 'Phonichala campus', 'ფონიჭალის კომპლექსი', X, '-1100'),
  teleti: img('teleti', 1800, 1013, 'Teleti', 'თელეთი', X, '-1100'),
  phHero: img('ph-hero-1', 2400, 1063, 'Phonichala at dusk', 'ფონიჭალა დაბინდებისას', X, '-1100'),
  liloPlan: img('lilo-plan', 2400, 1695, 'Lilo site masterplan', 'ლილოს გენგეგმა', X, '-1100'),
  screen: img('digital-screen', 1920, 1080, 'Digital screen', 'ციფრული ეკრანი', X, '-1100'),
  investment: img('investment', 1280, 720, 'Investment presentation', 'საინვესტიციო პრეზენტაცია', X, '-1100'),
  brochure: img('brochure', 1200, 1697, 'Information brochure', 'საინფორმაციო ბროშურა', P, ''),
  badgeE: img('badge-employee', 900, 1380, 'Employee badge', 'თანამშრომლის ბეჯი', X, '-1100'),
  badgeV: img('badge-visitor', 900, 1380, 'Visitor badge', 'სტუმრის ბეჯი', X, '-1100'),
} satisfies Record<string, Media>;

/** everything that opens large, in page order */
const STILLS = Object.values(MEDIA).filter((m) => !m.video);

function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-3 sm:px-5 lg:px-8 ${className}`}>{children}</div>;
}

/** a film that plays only while on screen */
function Film({ m }: { m: Media }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} src={m.video} poster={m.src} muted loop playsInline preload="none" aria-label={m.en} className="absolute inset-0 h-full w-full object-cover" />;
}

/**
 * A justified row: every item keeps its own proportions and all of them
 * share one height, so nothing is cropped and nothing is scaled past its size.
 */
function Row({ items, onOpen, className = '' }: { items: Media[]; onOpen: (i: number) => void; className?: string }) {
  const { tx } = useI18n();
  const total = items.reduce((a, m) => a + m.w / m.h, 0);
  return (
    <div className={`flex flex-col sm:flex-row gap-1.5 ${className}`}>
      {items.map((m, i) => {
        const r = m.w / m.h;
        const still = STILLS.indexOf(m);
        const body = m.video ? <Film m={m} /> : (
          <img src={m.small ?? m.src} srcSet={m.small && m.small !== m.src ? `${m.small} 1100w, ${m.src} ${m.w}w` : undefined}
            sizes={`(min-width: 1240px) ${Math.round((1180 * r) / total)}px, ${Math.round((100 * r) / total)}vw`}
            width={m.w} height={m.h} alt={tx(m.en, m.ka)} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.02]" />
        );
        return (
          <div key={m.key} className="min-w-0" style={{ flex: `${r} 1 0%` }}>
            <Rise delay={i * 0.05}>
              {m.video ? (
                <div className="relative w-full overflow-hidden rounded-[6px] bg-[#dcd8d0]" style={{ aspectRatio: `${m.w}/${m.h}` }}>{body}</div>
              ) : (
                <button type="button" onClick={() => onOpen(still)} aria-label={`${tx(m.en, m.ka)}, ${tx('enlarge', 'გადიდება')}`}
                  className="group relative block w-full overflow-hidden rounded-[6px] bg-[#dcd8d0] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0A6670]" style={{ aspectRatio: `${m.w}/${m.h}` }}>
                  {body}
                </button>
              )}
            </Rise>
          </div>
        );
      })}
    </div>
  );
}

/** the social campaign as the guidelines show it: a sliding row of posts, moving on its own */
function Campaign({ items, onOpen }: { items: Media[]; onOpen: (i: number) => void }) {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const step = (dir: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-card]');
    const w = card ? card.offsetWidth + 12 : el.clientWidth / 3;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };
  useEffect(() => {
    const el = track.current; if (!el || reduce) return;
    let vis = false;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    const t = window.setInterval(() => { if (vis && !hover) step(1); }, 3200);
    return () => { io.disconnect(); window.clearInterval(t); };
  }, [hover, reduce]);
  return (
    <div onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <div ref={track} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((m, i) => (
          <figure key={m.key} data-card className="shrink-0 snap-start w-[72%] sm:w-[40%] lg:w-[28%]">
            <button type="button" onClick={() => onOpen(STILLS.indexOf(m))} aria-label={`${tx(m.en, m.ka)}, ${tx('enlarge', 'გადიდება')}`}
              className="group block w-full overflow-hidden rounded-[14px] cursor-zoom-in shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)]" style={{ aspectRatio: `${m.w}/${m.h}` }}>
              <img src={m.small} srcSet={`${m.small} 1100w, ${m.src} ${m.w}w`} sizes="(min-width: 1024px) 340px, 70vw" alt={tx(m.en, m.ka)} loading="lazy" decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </button>
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.14em] opacity-70" style={{ fontFamily: TITLE, fontWeight: 500 }}>
              {String(i + 1).padStart(2, '0')} / {m.key.replace(/^sc-0\d-/, '').replace('connection', 'connect')}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
        <span className="text-[11px] uppercase tracking-[0.14em] opacity-70" style={{ fontFamily: TITLE, fontWeight: 500 }}>{tx('The campaign', 'კამპანია')}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} aria-label={tx('Previous', 'წინა')} className="grid h-11 w-11 place-items-center rounded-full border border-white/40 hover:bg-white/10">←</button>
          <button type="button" onClick={() => step(1)} aria-label={tx('Next', 'შემდეგი')} className="grid h-11 w-11 place-items-center rounded-full bg-white hover:bg-white/90" style={{ color: B.emerald }}>→</button>
        </div>
        <span className="w-[90px]" />
      </div>
    </div>
  );
}

/** a chapter in the guidelines' manner: a coloured band, "01 / NAME", a big extended title, a short lead */
function Band({ tone, no, name, title, lead, children, pills }: { tone: Tone; no: string; name: string; title: string; lead?: string; children: React.ReactNode; pills?: string[] }) {
  const t = TONES[tone];
  return (
    <section className="px-1.5 pt-1.5">
      <div className="rounded-[10px] py-20 sm:py-28" style={{ background: t.bg, color: t.ink }}>
        <Wrap>
          <div className="grid grid-cols-12 gap-x-6 gap-y-5 items-end pb-10 sm:pb-14 border-b mb-10 sm:mb-14" style={{ borderColor: tone === 'midnight' || tone === 'emerald' ? 'rgba(255,255,255,0.16)' : 'rgba(22,35,42,0.14)' }}>
            <div className="col-span-12 lg:col-span-8">
              <div className="text-[12px] uppercase tracking-[0.14em] mb-4" style={{ color: t.label, fontFamily: TITLE, fontWeight: 500 }}>{no} / {name}</div>
              <RevealLines as="h2" className="text-[38px] sm:text-[60px] lg:text-[76px] leading-[0.98] tracking-[-0.02em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>{title}</span>
              </RevealLines>
            </div>
            {(lead || pills) && (
              <div className="col-span-12 lg:col-span-4">
                {lead && <p className="text-[16px] leading-[1.55]" style={{ color: t.soft, fontFamily: TEXT }}>{lead}</p>}
                {pills && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pills.map((p) => <span key={p} className="rounded-full px-3.5 py-1.5 text-[13px]" style={{ background: tone === 'midnight' || tone === 'emerald' ? 'rgba(255,255,255,0.1)' : B.mist, color: tone === 'midnight' || tone === 'emerald' ? '#fff' : B.emerald, fontFamily: TEXT, fontWeight: 500 }}>{p}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
          {children}
        </Wrap>
      </div>
    </section>
  );
}

/** the type scale, as the guidelines set it */
function TypeScale() {
  const { tx } = useI18n();
  const meta = 'text-[10px] uppercase tracking-[0.08em]';
  const rows: [string, React.ReactNode, string, React.CSSProperties][] = [
    ['12 px', 'Eyebrow', '100%', { fontSize: 'clamp(14px,1.6vw,22px)', lineHeight: 1, fontWeight: 500 }],
    ['72 px', 'Heading &', '100%', { fontSize: 'clamp(40px,6vw,76px)', lineHeight: 1, fontWeight: 500 }],
    ['42 px', 'Subheading', '110%', { fontSize: 'clamp(28px,3.6vw,46px)', lineHeight: 1.1, fontWeight: 400, color: B.muted }],
    ['20 px', <>Space for projects,<br />partnerships and<br />long-term growth.</>, '120%', { fontSize: 'clamp(18px,2.2vw,30px)', lineHeight: 1.2, fontWeight: 500 }],
  ];
  return (
    <Rise delay={0.05}>
      <div className="mt-1.5 grid grid-cols-1 lg:grid-cols-12 gap-x-10 rounded-[12px] px-6 sm:px-9 py-8 sm:py-10" style={{ background: '#F3F3F1', color: B.midnight }}>
        <div className="lg:col-span-8">
          {rows.map(([px, txt, lead, st], i) => (
            <div key={px} className="grid grid-cols-[52px_1fr_auto] items-baseline gap-4 border-t py-4 sm:py-5" style={{ borderColor: 'rgba(22,35,42,0.14)' }}>
              <span className={meta} style={{ color: B.muted, fontFamily: TITLE }}>{px}</span>
              <RevealLines as="div" delay={i * 0.08} style={{ ...st, fontFamily: TITLE }}><span>{txt}</span></RevealLines>
              <span className={`${meta} hidden sm:block`} style={{ color: B.muted, fontFamily: TITLE }}>{lead} {tx('leading', 'ინტერლინიაჟი')}</span>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 mt-6 lg:mt-0 flex items-center">
          <div className="w-full border-t pt-4 flex items-end gap-4" style={{ borderColor: 'rgba(22,35,42,0.14)' }}>
            <span className="text-[120px] sm:text-[180px] leading-[0.8] tracking-[-0.02em]" style={{ fontFamily: TITLE, fontWeight: 400, color: '#7A8282' }}>A1</span>
            <span className="pb-2 text-[10px] uppercase leading-[1.3] tracking-[0.06em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>Display<br /><span style={{ fontWeight: 400 }}>2.5×<br />100%<br />{tx('leading', 'ინტერლ.')}</span></span>
          </div>
        </div>
      </div>
    </Rise>
  );
}

/*
 * GV Space Field: the graphic language. A progressive cut of bars around
 * one emerald interval, with the slogan panel. Rebuilt in SVG from the
 * guideline artwork so the three approved layouts move into each other.
 */
const CUT = [2.054, 4.107, 6.161, 8.214, 10.268, 12.321, 14.375, 16.429, 18.482, 20.536, 22.589, 24.643, 26.696, 32.857];
const LAYOUTS = {
  edge: { field: 'translate(-686.9px,62.01px) scale(1.26064)', op: 0.96, panelX: 608.04, panelOp: 1 },
  signature: { field: 'translate(52.64px,97.249px) scale(1.00893)', op: 0.96, panelX: 358, panelOp: 1 },
  window: { field: 'translate(-98.386px,62.01px) scale(1.26064)', op: 0.64, panelX: 358, panelOp: 0.96 },
} as const;
type Layout = keyof typeof LAYOUTS;

function SpaceField() {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Layout>('edge');
  const [playing, setPlaying] = useState(true);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.isIntersecting) setSeen(true); }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible || reduce) return;
    const order: Layout[] = ['edge', 'signature', 'window'];
    const t = window.setTimeout(() => setMode((m) => order[(order.indexOf(m) + 1) % 3]), 2600);
    return () => window.clearTimeout(t);
  }, [mode, playing, visible, reduce]);
  const L = LAYOUTS[mode];
  const ease = 'cubic-bezier(.65,0,.35,1)';
  const bars = (flip: boolean) => {
    let x = 0;
    return CUT.map((w, i) => {
      const rx = i === CUT.length - 1 ? 427.143 : i * 32.857;
      x = rx;
      return (
        <rect key={`${flip}${i}`} x={x} y={0} width={w} height={180} rx={1} fill="#111615"
          style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', transform: seen || reduce ? 'scaleY(1)' : 'scaleY(0)', transition: `transform .9s ${ease} ${0.1 + i * 0.04}s` }} />
      );
    });
  };
  return (
    <Rise>
      <div ref={box} className="overflow-hidden rounded-[18px] border" style={{ background: B.mist, borderColor: 'rgba(10,102,112,0.17)' }}>
        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-2 border-b" style={{ borderColor: 'rgba(10,102,112,0.17)' }}>
          <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.06em]" style={{ color: B.emerald, fontFamily: TITLE, fontWeight: 500 }}>GV Space Field</span>
          <div role="tablist" aria-label={tx('Layouts', 'განლაგებები')} className="ml-auto flex gap-1">
            {(Object.keys(LAYOUTS) as Layout[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setPlaying(false); }}
                className="rounded-[9px] px-3 sm:px-5 py-2.5 text-[11px] sm:text-[12px] uppercase tracking-[0.04em] transition-colors"
                style={{ fontFamily: TITLE, fontWeight: 500, background: mode === k ? B.emerald : 'transparent', color: mode === k ? '#fff' : B.midnight }}>{k}</button>
            ))}
          </div>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} aria-label={playing ? tx('Pause', 'შეჩერება') : tx('Play', 'ჩართვა')}
            className="grid h-10 w-10 place-items-center rounded-[9px] border text-[14px]" style={{ borderColor: 'rgba(10,102,112,0.17)', color: B.emerald }}>{playing ? 'Ⅱ' : '▶'}</button>
        </div>
        <svg viewBox="0 0 1316 477" className="block w-full h-auto" role="img" aria-label={`${mode.toUpperCase()} · GV Capital makes space. Space that creates opportunities.`}>
          <rect width="1316" height="477" fill={B.mist} />
          <g style={{ transform: L.field, opacity: L.op, transition: `transform 1.1s ${ease}, opacity .8s ease` }}>
            <g transform="translate(530 50) scale(-1 1)">{bars(true)}</g>
            <g transform="translate(670 50)">{bars(false)}</g>
            <rect x={596} y={54} width={8} height={172} rx={4} fill={B.emerald} />
          </g>
          <g style={{ transform: `translateX(${L.panelX}px)`, transition: `transform 1.1s ${ease}` }}>
            <rect x={0} y={149.88} width={600} height={177.24} fill={B.midnight} fillOpacity={L.panelOp} />
            <rect x={0} y={149.88} width={8} height={177.24} fill={B.emerald} />
            <text x={40} y={196} fill={B.mist} style={{ fontFamily: TITLE, fontWeight: 500, fontSize: 14.5, letterSpacing: '0.04em' }}>GV CAPITAL MAKES SPACE</text>
            <text x={40} y={252} fill="#fff" style={{ fontFamily: TITLE, fontWeight: 500, fontSize: 36 }}>SPACE THAT CREATES</text>
            <text x={40} y={292} fill="#fff" style={{ fontFamily: TITLE, fontWeight: 500, fontSize: 36 }}>OPPORTUNITIES.</text>
          </g>
        </svg>
      </div>
    </Rise>
  );
}

/** the type specimen, as the guidelines show it: one family, extended for headings */
function TypeSpecimen() {
  const { tx } = useI18n();
  const ink = '#141818';
  const lab = 'text-[11px] uppercase tracking-[0.14em] text-white/60';
  const LT = { fontFamily: TITLE };
  return (
    <>
      <Rise>
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[12px] text-white" style={{ background: ink }}>
          <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col">
            <div className={lab} style={{ ...LT, fontWeight: 500 }}>Brand type / 01</div>
            <div className="mt-10 sm:mt-14 text-[64px] sm:text-[88px] leading-[0.95] tracking-[-0.02em]" style={{ ...LT, fontWeight: 400 }}>Aktiv<br />Grotesk</div>
            <div className="mt-auto pt-12 grid grid-cols-5 gap-4 border-t border-white/20">
              <div className="col-span-2 pt-6">
                <div className={lab} style={{ ...LT, fontWeight: 500 }}>{tx('Style', 'სტილი')}</div>
                <div className="mt-4 space-y-1.5 text-[17px]" style={LT}>
                  <div style={{ fontWeight: 400 }}>Regular</div>
                  <div style={{ fontWeight: 400, fontStyle: 'oblique 10deg' }}>Italic</div>
                  <div style={{ fontWeight: 700 }}>Bold</div>
                </div>
              </div>
              <div className="col-span-3 pt-6">
                <div className={lab} style={{ ...LT, fontWeight: 500 }}>{tx('Type', 'ასოები')}</div>
                <div className="mt-4 text-[12.5px] leading-[1.45] text-white/85" style={{ ...LT, fontWeight: 400 }}>
                  Aa Bb Cc Dd Ee Ff Gg<br />Hh Ii Jj Kk Ll Mm Nn<br />Oo Pp Qq Rr Ss Tt Uu<br />Vv Ww Xx Yy Zz
                  <div className="mt-3 text-white/60">0123456789 &amp; @</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 border-t lg:border-t-0 lg:border-l border-white/20">
            {[['Regular', 400, 'normal'], ['Italic', 400, 'oblique 12deg'], ['Bold', 700, 'normal']].map(([n, w, st], i) => (
              <div key={String(n)} className={`relative flex flex-col items-center pt-7 overflow-hidden min-h-[260px] sm:min-h-[460px] ${i ? 'border-l border-white/20' : ''}`}>
                <div className={lab} style={{ ...LT, fontWeight: 500 }}>{n}</div>
                <div className="absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 text-[150px] sm:text-[300px] leading-none" style={{ ...LT, fontWeight: Number(w), fontStyle: String(st) }}>a</div>
              </div>
            ))}
          </div>
        </div>
      </Rise>
      <Rise delay={0.08}>
        <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1.5fr] overflow-hidden rounded-[12px] text-white" style={{ background: B.midnight }}>
          <div className="flex items-center px-6 py-6 text-[11px] sm:text-[12px] uppercase tracking-[0.12em]" style={{ background: B.emerald, ...LT, fontWeight: 700 }}>{tx('Approved type system / one family', 'დამტკიცებული სისტემა / ერთი ოჯახი')}</div>
          <div className="px-6 py-6 border-t sm:border-t-0 sm:border-l border-white/15">
            <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: B.mint, ...LT, fontWeight: 500 }}>{tx('Headings', 'სათაურები')}</div>
            <div className="mt-1.5 text-[18px] sm:text-[22px] uppercase" style={{ ...LT, fontWeight: 700 }}>Aktiv Grotesk Extended</div>
          </div>
          <div className="px-6 py-6 border-t sm:border-t-0 sm:border-l border-white/15">
            <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: B.mint, ...LT, fontWeight: 500 }}>{tx('Body', 'ტექსტი')}</div>
            <div className="mt-1.5 text-[18px] sm:text-[22px] uppercase" style={{ ...LT, fontWeight: 700 }}>Aktiv Grotesk</div>
          </div>
        </div>
      </Rise>
    </>
  );
}

/** the colour system, as the guidelines show it: four swatches and the balance they are used in */
function Colours() {
  const { tx } = useI18n();
  const sw = [
    { name: 'GV Emerald', role: tx('Primary', 'ძირითადი'), hex: B.emerald, ink: '#fff', spec: 'PANTONE 7715 C · RAL 5021' },
    { name: 'Cool Mist', role: tx('Light', 'ღია'), hex: B.mist, ink: B.midnight, spec: 'CMYK 5 1 0 6' },
    { name: 'Midnight', role: tx('Dark', 'მუქი'), hex: B.midnight, ink: '#fff', spec: 'CMYK 48 17 0 84' },
    { name: 'Signal Orange', role: tx('Accent, 5% at most', 'აქცენტი, მაქს. 5%'), hex: B.orange, ink: B.midnight, spec: 'CMYK 0 65 98 0' },
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
        {sw.map((c, i) => (
          <Rise key={c.name} delay={i * 0.06}>
            <div className="rounded-[10px] overflow-hidden ring-1 ring-black/[0.06] bg-white">
              <div className="h-[140px] sm:h-[200px] p-4 flex items-start" style={{ background: c.hex, color: c.ink }}>
                <span className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: TITLE, fontWeight: 500 }}>{c.role}</span>
              </div>
              <div className="p-4 sm:p-5" style={{ color: B.midnight }}>
                <div className="text-[17px] sm:text-[20px]" style={{ fontFamily: TITLE, fontWeight: 700 }}>{c.name}</div>
                <div className="mt-1 text-[13px] tabular-nums" style={{ fontFamily: TEXT, fontWeight: 500 }}>{c.hex}</div>
                <div className="mt-1 text-[12px]" style={{ color: B.muted, fontFamily: TEXT }}>{c.spec}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={0.1}>
        <div className="mt-1.5 flex h-11 overflow-hidden rounded-[10px] text-[12px]" style={{ fontFamily: TITLE, fontWeight: 500 }}>
          {[['50%', B.mist, B.midnight, 50], ['30%', B.midnight, '#fff', 30], ['15%', B.emerald, '#fff', 15], ['≤5%', B.orange, B.midnight, 5]].map(([l, bg, ink, w]) => (
            <div key={String(l)} className="flex items-center justify-center" style={{ width: `${w}%`, background: String(bg), color: String(ink) }}>{l}</div>
          ))}
        </div>
      </Rise>
    </>
  );
}

export function GvCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = STILLS.map((s) => ({ src: s.src, alt: tx(s.en, s.ka), brand: `GV Capital, ${tx(s.en, s.ka)}` }));
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'GV Capital'],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Investment & development', 'ინვესტიცია და განვითარება')],
    [tx('Scope', 'სამუშაო'), tx('Brand concept, identity, guidelines', 'კონცეფცია, იდენტობა, გაიდლაინი')],
  ];
  const m = MEDIA;

  return (
    <BakedShell>
      <SEO
        title="GV Capital | Brand Identity Case Study"
        description="GV Capital makes space: brand concept, identity and live guidelines for a Georgian investment and development holding."
        keywords="GV Capital, brand identity, brand guidelines, investment holding, logistics, Georgia, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/gv-capital" />

      <style>{FONTS}</style>
      <article className="pt-14 sm:pt-[52px]" style={{ color: CARBON, fontFamily: TEXT }}>

        {/* ── Hero: the brand's own cover, midnight and huge extended type ── */}
        <header className="px-1.5">
          <div className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden rounded-[10px] text-white" style={{ background: `linear-gradient(180deg, #1d2730 0%, ${B.midnight} 55%, #0f171c 100%)` }}>
            <Wrap className="flex items-start justify-between pt-6 sm:pt-8 text-[13px]">
              <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] uppercase tracking-[0.12em] hover:bg-white/15" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: TITLE, fontWeight: 500 }}>{tx('Live guidelines', 'ცოცხალი გაიდლაინი')} <ArrowUpRight size={12} /></a>
            </Wrap>
            <Wrap className="mt-auto pb-8 sm:pb-10">
              <RevealLines as="h1" className="text-[17vw] sm:text-[13vw] lg:text-[150px] leading-[0.9] tracking-[-0.03em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>GV Capital</span>
                <span style={{ color: B.mint }}>{tx('makes space.', 'ქმნის სივრცეს.')}</span>
              </RevealLines>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-t border-white/15 pt-5">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: B.mint, fontFamily: TITLE, fontWeight: 500 }}>{k}</div>
                    <div className="mt-1.5 text-[14px] text-white/85">{v}</div>
                  </div>
                ))}
              </div>
            </Wrap>
          </div>
        </header>

        {/* the brand's vocabulary running past, as on the guidelines */}
        <div className="px-1.5 pt-1.5">
          <div className="overflow-hidden rounded-[10px] py-4 text-[13px] sm:text-[15px] uppercase tracking-[0.14em] text-white" style={{ background: B.midnight, fontFamily: TITLE, fontWeight: 500 }}>
            <Marquee speed={42} separator="↗" items={['Investment & development', 'Industrial & logistics', 'Georgian ventures', 'Trust', 'Partnership', 'Long-term view', 'Makes space.']} />
          </div>
        </div>

        {/* the brand film at its own size */}
        <section className="px-1.5 pt-1.5"><div className="rounded-[10px] py-10 sm:py-14" style={{ background: B.paper }}><Wrap><Row items={[m.cover]} onOpen={setOpen} /></Wrap></div></section>

        <Band tone="white" no="01" name={tx('The brand', 'ბრენდი')} title={tx('Space for projects, partners and growth.', 'სივრცე პროექტებისთვის, პარტნიორებისა და ზრდისთვის.')}
          lead={tx('GV Capital is an investment and development holding. It starts with industrial and logistics space in Georgia.', 'GV Capital საინვესტიციო და განვითარების ჰოლდინგია. იწყებს ინდუსტრიული და ლოჯისტიკური სივრცით საქართველოში.')}
          pills={[tx('Trust', 'ნდობა'), tx('Partnership', 'პარტნიორობა'), tx('Long-term view', 'გრძელვადიანი ხედვა')]}>
          <Row items={[m.foundation, m.focus]} onOpen={setOpen} />
        </Band>

        <Band tone="emerald" no="02" name={tx('Logo', 'ლოგო')} title={tx('A mark that holds a room.', 'ნიშანი, რომელიც სივრცეს იჭერს.')}
          lead={tx('Italic, wide, built to move: the GV block reads at a glance on a wall, a flag or a favicon.', 'დახრილი, ფართო, მოძრაობისთვის აგებული: GV ბლოკი ერთი შეხედვით იკითხება კედელზე, დროშაზე თუ ფავიკონზე.')}>
          <Row items={[m.logo, m.hoodie]} onOpen={setOpen} />
        </Band>

        <Band tone="white" no="03" name={tx('Colour', 'ფერი')} title={tx('Colour System', 'ფერების სისტემა')}
          lead={tx('GV Emerald leads. Signal Orange is kept for small accents, never more than five percent.', 'წამყვანია GV Emerald. Signal Orange მხოლოდ პატარა აქცენტებისთვისაა, არაუმეტეს ხუთი პროცენტისა.')}>
          <Colours />
        </Band>

        <Band tone="white" no="04" name={tx('Typography', 'ტიპოგრაფია')} title={tx('One family, two voices.', 'ერთი ოჯახი, ორი ხმა.')}
          lead={tx('Aktiv Grotesk Extended for headings, Aktiv Grotesk for everything people read.', 'სათაურებზე Aktiv Grotesk Extended, ყველა ტექსტზე Aktiv Grotesk.')}>
          <TypeSpecimen />
          <TypeScale />
        </Band>

        <Band tone="paper" no="05" name={tx('Graphic language', 'გრაფიკული ენა')} title={tx('The interval makes the space.', 'ინტერვალი ქმნის სივრცეს.')}
          lead={tx('A progressive cut around one emerald interval, with the slogan always attached. Three approved layouts.', 'პროგრესული ჭრილი ერთი ზურმუხტისფერი ინტერვალის გარშემო, სლოგანით. სამი დამტკიცებული განლაგება.')}>
          <SpaceField />
        </Band>

        <Band tone="emerald" no="06" name={tx('Social media', 'სოციალური მედია')} title={tx('One brand. Clear at every scale.', 'ერთი ბრენდი. მკაფიო ყველა ზომაზე.')}
          lead={tx('Six posts, one claim each: opportunity, possibility, perspective, connection, direction, focus.', 'ექვსი პოსტი, თითოში ერთი აზრი: შესაძლებლობა, პერსპექტივა, კავშირი, მიმართულება, ფოკუსი.')}>
          <Campaign items={[m.sc1, m.sc2, m.sc3, m.sc4, m.sc5, m.sc6]} onOpen={setOpen} />
        </Band>

        <Band tone="mist" no="07" name={tx('Physical environment', 'ფიზიკური გარემო')} title={tx('The office becomes the idea.', 'ოფისი თავად იქცევა იდეად.')}
          lead={tx('Logo walls, glass partitions and a wayfinding system built on the same angle as the mark.', 'ლოგოს კედლები, მინის ტიხრები და ნავიგაციის სისტემა ნიშნის იმავე კუთხეზე.')}>
          <div className="space-y-1.5">
            <Row items={[m.campus]} onOpen={setOpen} />
            <Row items={[m.reception, m.wall]} onOpen={setOpen} />
            <Row items={[m.zones]} onOpen={setOpen} />
            <Row items={[m.blade, m.wayfinding, m.corridor]} onOpen={setOpen} />
          </div>
        </Band>

        <Band tone="midnight" no="08" name={tx('Exterior & fleet', 'ექსტერიერი და ავტოპარკი')} title={tx('A consistent identity across space and movement.', 'ერთი იდენტობა სივრცესა და მოძრაობაში.')}>
          <div className="space-y-1.5">
            <Row items={[m.facade, m.flags]} onOpen={setOpen} />
            <Row items={[m.fleet, m.screen]} onOpen={setOpen} />
          </div>
        </Band>

        <Band tone="white" no="09" name={tx('Corporate materials', 'კორპორატიული მასალები')} title={tx('Built for business.', 'საქმისთვის შექმნილი.')}>
          <Row items={[{ ...m.card, w: 3, h: 4 }, { ...m.folder, w: 711, h: 660 }]} onOpen={setOpen} />
        </Band>

        <Band tone="midnight" no="10" name={tx('Portfolio', 'პორტფოლიო')} title={tx('Space for your next move.', 'სივრცე შენი შემდეგი ნაბიჯისთვის.')}
          lead={tx('The first projects in the identity: Lilo, Phonichala and Teleti.', 'პირველი პროექტები იდენტობაში: ლილო, ფონიჭალა და თელეთი.')}>
          <div className="space-y-1.5">
            <Row items={[m.phHero]} onOpen={setOpen} />
            <Row items={[m.lilo, m.phonichala, m.teleti]} onOpen={setOpen} />
            <div className="max-w-[720px]"><Row items={[m.liloPlan]} onOpen={setOpen} /></div>
          </div>
        </Band>

        <Band tone="paper" no="11" name={tx('Everyday identity', 'ყოველდღიური იდენტობა')} title={tx('People first.', 'ადამიანები პირველ რიგში.')}
          lead={tx('Uniform, site gear, packaging and badges: the mark holds up on every material.', 'უნიფორმა, სამშენებლო აღჭურვილობა, შეფუთვა და ბეჯები: ნიშანი ყველა მასალაზე მუშაობს.')}>
          <div className="space-y-1.5">
            <Row items={[m.uniform, m.material, m.hardhat, m.packaging]} onOpen={setOpen} />
            <div className="max-w-[640px]"><Row items={[m.badgeE, m.badgeV]} onOpen={setOpen} /></div>
          </div>
        </Band>

        <Band tone="mist" no="12" name={tx('Paper and screen', 'ქაღალდი და ეკრანი')} title={tx('One grid for print and slides.', 'ერთი ბადე ბეჭდვისა და სლაიდებისთვის.')}>
          <div className="max-w-[860px] space-y-1.5">
            <Row items={[m.cards, m.letterhead, m.document, m.profile, m.brochure]} onOpen={setOpen} />
            <Row items={[m.company, m.layouts]} onOpen={setOpen} />
          </div>
        </Band>

        {/* ── Close: midnight, the line, the link ───────────────────────── */}
        <section className="px-1.5 pt-1.5">
          <div className="rounded-[10px] py-24 sm:py-32 text-white" style={{ background: B.midnight }}>
            <Wrap>
              <RevealLines as="p" className="text-[13vw] sm:text-[9vw] lg:text-[120px] leading-[0.92] tracking-[-0.03em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>{tx('Makes', 'ქმნის')}</span>
                <span style={{ color: B.mint }}>{tx('space.', 'სივრცეს.')}<span style={{ color: B.orange }}>↗</span></span>
              </RevealLines>
              <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 border-t border-white/15 pt-6">
                <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[18px] sm:text-[22px] underline decoration-1 underline-offset-[6px] hover:text-[#B4D3D5]" style={{ fontFamily: TITLE, fontWeight: 500 }}>
                  {tx('The whole system lives online', 'მთელი სისტემა ონლაინაა')} <ArrowUpRight size={20} />
                </a>
                <div className="[&_*]:!font-[inherit]"><CtaLink /></div>
              </div>
            </Wrap>
          </div>
        </section>
      </article>

      <MoreCases current="/projects/gv-capital" />

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
