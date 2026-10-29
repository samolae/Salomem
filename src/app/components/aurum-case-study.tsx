import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValueEvent,
} from 'motion/react';
import { useNavigate } from 'react-router';
import { CaseHeroTarget } from './case-transition';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { DashboardPreview, ExchangeWidget } from './dashboard-preview';
import { DesignSystemFull } from './color-palette';
import { UXStories } from './ux-stories';
import { CaseStudySectionNav } from './case-study-nav';
import { AurumSEO } from './seo';
import { RevealLines, Rise, TiltIn, ClipReveal, CountUp, DrawRule, Marquee, ReadProgress } from './case-motion';
import aurumSvgPaths from '../../imports/svg-wj69ey5ojj';
import { IMG } from '../lib/cld';

/* ─── Screens (Cloudinary) ───────────────────────────────────────── */
const screenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041357/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro.webp';
const designSystemSheet = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773321666/aurumn_design_iap0vm.png';
const cloudScreenHomeDark = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016538/homedark_zieimk.webp';
const cloudScreenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016554/exchange_ggykpz.webp';
const cloudScreenLogin = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016548/login-_au5gne.webp';
const cloudScreenAuth = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016553/authentication_r7las2.webp';
const cloudScreenQR = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016553/qr_vsfslb.webp';

/* ─── Brand tokens ───────────────────────────────────────────────── */
const BRAND = {
  gold: '#D59A04',
  headingFont: '"Syne", "Space Grotesk", sans-serif',
  bodyFont: '"Manrope", "Inter", sans-serif',
};

/* Focus ring shared by every interactive element on the page */
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#D59A04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B0F]';

/* Long English copy: narrow justified columns, hyphenated, last line ragged */
/* (phones keep left alignment: at ~40 characters a justified line opens rivers) */
const JUSTIFY = 'hyphens-auto [text-align-last:left] md:text-justify';

/* Type scale
 *   display  hero title only           72 / 112 / 148px
 *   h2       chapter headings          28 → 36px (clamp)
 *   h3       sub-headings              18 / 20px
 *   lead     intro paragraphs          17px / 1.65
 *   body     copy                      15px / 1.7, muted
 *   caption  labels, tags, meta        12-13px
 */
const T = {
  h2: 'text-[clamp(1.75rem,1.3rem+1.25vw,2.25rem)] leading-[1.12] tracking-[-0.02em] text-white',
  h3: 'text-[18px] leading-[1.3] tracking-[-0.01em] text-white md:text-[20px]',
  lead: 'text-[17px] leading-[1.65] text-[#C9CBD4]',
  body: 'text-[15px] leading-[1.7] text-[#A3A6B4]',
  caption: 'text-[13px] leading-[1.55] text-[#9295A6]',
  label: 'text-[12px] leading-none text-[#9295A6]',
};
const HEAD: CSSProperties = { fontFamily: BRAND.headingFont, fontWeight: 600 };

/* ─── Layout primitives ──────────────────────────────────────────── */
/* Same container as the other case studies: one left edge everywhere */
const CONTAINER = 'mx-auto w-full max-w-[1232px] px-6 sm:px-8 md:px-20 xl:px-10';
const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`${CONTAINER} ${className}`}>{children}</div>
);

/* One vertical rhythm; each chapter opens with a hairline that draws itself */
const Section = ({ id, children, label }: { id: string; children: ReactNode; label?: string }) => (
  <section id={id} aria-label={label} className="scroll-mt-20 py-20 md:py-28 lg:py-32">
    <Container>
      <DrawRule className="-mt-20 mb-20 md:-mt-28 md:mb-28 lg:-mt-32 lg:mb-32" color="rgba(255,255,255,0.08)" />
      {children}
    </Container>
  </section>
);

const Chapter = ({ number, label }: { number: string; label: string }) => (
  <p className={`mb-5 flex items-baseline gap-3 md:mb-6 ${T.label}`}>
    <span className="font-mono text-[#D59A04]">{number}</span>
    <span aria-hidden className="h-px w-6 translate-y-[-3px] bg-white/20" />
    <span>{label}</span>
  </p>
);

/* Chapter heading: lines slide up out of a mask */
const H2 = ({ lines, className = '' }: { lines: string[]; className?: string }) => (
  <RevealLines as="h2" className={`${T.h2} ${className}`} style={HEAD}>
    {lines.map((l) => <span key={l}>{l}</span>)}
  </RevealLines>
);

const H3 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h3 className={`${T.h3} ${className}`} style={HEAD}>{children}</h3>
);

/* Two narrow justified columns (one paragraph each); stacks on phones */
const TextColumns = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <Rise className={`grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 ${className}`}>{children}</Rise>
);
const Col = ({ children, lead = false }: { children: ReactNode; lead?: boolean }) => (
  <p lang="en" className={`max-w-[46ch] ${lead ? T.lead : T.body} ${JUSTIFY}`}>{children}</p>
);

/* Chapter header: heading on the left (4/12), copy in columns on the right (8/12) */
const ChapterHead = ({ lines, children, className = '' }: { lines: string[]; children?: ReactNode; className?: string }) => (
  <div className={`grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10 ${className}`}>
    <H2 lines={lines} className="lg:col-span-4" />
    {children && <div className="lg:col-span-8 lg:pt-1.5">{children}</div>}
  </div>
);

/* ─── Browser frame for product screens ──────────────────────────── */
const FRAME_SHADOW = 'shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75),0_12px_24px_-12px_rgba(0,0,0,0.5)]';

const BrowserFrame = ({ children, url = 'aurum.exchange', shadow = true }: { children: ReactNode; url?: string; shadow?: boolean }) => (
  <div className={`overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0B0D12] md:rounded-[20px] ${shadow ? FRAME_SHADOW : ''}`}>
    <div className="flex h-8 items-center gap-3 border-b border-white/[0.06] bg-[#111319] px-3 md:h-10 md:px-4">
      <div className="flex gap-1.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-white/[0.14] md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-white/[0.14] md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-white/[0.14] md:h-2.5 md:w-2.5" />
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <span className="truncate rounded-md bg-white/[0.04] px-3 py-0.5 font-mono text-[10px] text-[#9295A6] md:text-[11px]">{url}</span>
      </div>
      <span className="w-[42px] md:w-[52px]" aria-hidden />
    </div>
    <div className="relative [&_img]:block">{children}</div>
  </div>
);

/*
 * ClipReveal clips to its own box (round 20px), which would also cut the
 * frame's drop shadow. The shadow therefore sits on a wrapper outside the
 * clip, and the frame inside goes without its own.
 */
const ClipScreen = ({ children, url }: { children: ReactNode; url?: string }) => (
  <div className={`rounded-[14px] md:rounded-[20px] ${FRAME_SHADOW}`}>
    <ClipReveal>
      <BrowserFrame url={url} shadow={false}>{children}</BrowserFrame>
    </ClipReveal>
  </div>
);

const TiltScreen = ({ children, url }: { children: ReactNode; url?: string }) => (
  <TiltIn>
    <BrowserFrame url={url}>{children}</BrowserFrame>
  </TiltIn>
);

/* ─── Local motion helpers ───────────────────────────────────────── */

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

/*
 * Hero entrance. RevealLines arms after mount and reveals on intersection,
 * so on a direct first load (hero already on screen) it would only blip.
 * The hero uses the same mask-slide look as a CSS animation instead: it is
 * part of the prerendered HTML, so it plays on first paint and again on
 * in-site navigation, always ends visible (finite, fill backwards), and is
 * switched off for reduced motion.
 */
const HERO_CSS = `
@keyframes au-line { from { transform: translateY(108%) rotate(2deg); } to { transform: none; } }
@keyframes au-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.au-line { display: block; animation: au-line 1.05s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) backwards; }
.au-rise { animation: au-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) backwards; }
@media (prefers-reduced-motion: reduce) { .au-line, .au-rise { animation: none; } }
`;
const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

/* ─── Scroll to top ──────────────────────────────────────────────── */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          aria-label="Back to top"
          className={`fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#15171D] text-white ring-1 ring-white/10 transition-colors hover:bg-[#1C1F26] md:bottom-8 md:right-8 ${FOCUS}`}
        >
          <ChevronUp size={18} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─── AURUM wordmark ─────────────────────────────────────────────── */
const AurumLogo = () => (
  <svg className="h-[24px] w-auto md:h-[26px]" fill="none" viewBox="0 0 172.683 42" role="img" aria-label="AURUM">
    <g clipPath="url(#aurumNavClip)">
      <g>
        <path d={aurumSvgPaths.p6257700} fill="white" />
        <path d={aurumSvgPaths.p3d43c00} fill="white" />
        <path d={aurumSvgPaths.p31dbf400} fill="white" />
        <path d={aurumSvgPaths.p2e633f80} fill="white" />
        <path d={aurumSvgPaths.p1daaf900} fill="white" />
      </g>
      <path d={aurumSvgPaths.p1ca9d680} fill="white" />
      <g>
        <path d={aurumSvgPaths.p3949f800} fill="white" />
        <path d={aurumSvgPaths.p26292900} fill="white" />
        <path d={aurumSvgPaths.pe6c6980} fill="white" />
        <path d={aurumSvgPaths.p195dbbf0} fill="white" />
        <path d={aurumSvgPaths.p1255fc00} fill="white" />
        <path d={aurumSvgPaths.p1ca57680} fill="white" />
        <path d={aurumSvgPaths.p1858a700} fill="white" />
        <path d={aurumSvgPaths.p370a4300} fill="white" />
        <path d={aurumSvgPaths.p221cfb80} fill="white" />
        <path d={aurumSvgPaths.p2ce20f00} fill="white" />
        <path d={aurumSvgPaths.p8c7a300} fill="white" />
        <path d={aurumSvgPaths.p186acb00} fill="white" />
        <path d={aurumSvgPaths.p10ae5200} fill="white" />
        <path d={aurumSvgPaths.p165ebf60} fill="white" />
      </g>
      <g>
        <path d={aurumSvgPaths.p3b4fec80} fill="#D59A04" />
        <path d={aurumSvgPaths.p3c3e7800} fill="#D59A04" />
      </g>
    </g>
    <defs>
      <clipPath id="aurumNavClip">
        <rect fill="white" height="42" width="172.683" />
      </clipPath>
    </defs>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── HERO ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
const META = [
  { label: 'Client', value: 'AURUM' },
  { label: 'Role', value: 'Lead UX/UI Designer' },
  { label: 'Platform', value: 'Web & Mobile' },
  { label: 'Industry', value: 'FinTech / Crypto, regulated' },
  { label: 'Tools', value: 'Figma, Protopie' },
  { label: 'Timeline', value: '12 weeks, 2024' },
];

function AurumHero() {
  return (
    <header className="pb-20 pt-28 md:pb-28 md:pt-36 lg:pb-32 lg:pt-40">
      <style>{HERO_CSS}</style>
      <Container>
        <p className={`au-rise mb-6 flex items-center gap-3 md:mb-8 ${T.label}`} style={d(0)}>
          <span>Case study</span>
          <span aria-hidden className="h-px w-6 bg-white/20" />
          <span>2024</span>
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1>
              <span className="block overflow-hidden pb-[0.06em]">
                <span
                  className="au-line text-[72px] leading-[0.92] tracking-[-0.045em] text-white sm:text-[112px] lg:text-[148px]"
                  style={{ ...d(0.1), fontFamily: BRAND.headingFont, fontWeight: 700 }}
                >
                  AURUM
                </span>
              </span>
              <span className="sr-only">, crypto exchange platform</span>
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p aria-hidden className="mb-3 overflow-hidden text-[20px] leading-[1.25] tracking-[-0.01em] text-white md:text-[24px]" style={HEAD}>
              <span className="au-line" style={d(0.22)}>Crypto Exchange Platform</span>
            </p>
            <p className={`au-rise max-w-[44ch] ${T.lead}`} style={d(0.38)}>
              A regulated crypto exchange designed for complex onboarding, verification logic, and online/offline transaction flows.
            </p>
          </div>
        </div>

        <div className="au-rise mt-12 md:mt-16" style={d(0.5)}>
          <DrawRule color="rgba(255,255,255,0.1)" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 pt-6 md:grid-cols-3 lg:grid-cols-6">
            {META.map((m) => (
              <div key={m.label}>
                <dt className={`mb-2 ${T.label}`}>{m.label}</dt>
                <dd className="text-[14px] leading-[1.45] text-white">{m.value}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-6 ${T.caption}`}>
            Scope: UX research, UI design, design system, prototyping. 196 screens, 2 platforms, 3 UX stories.
          </p>
        </div>

        <div className="au-rise mt-12 md:mt-16" style={d(0.62)}>
          <TiltScreen>
            <img
              {...IMG.wide(screenExchange)}
              alt="AURUM Exchange Dashboard"
              width="1440"
              height="900"
              className="h-auto w-full"
              loading="eager"
              {...{ fetchpriority: 'high' }}
            />
          </TiltScreen>
        </div>
      </Container>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── STORY (scrubbed sequence) ───────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
const STORY = [
  { step: 'Hook', number: '00.1', text: 'What if crypto trading could feel as simple as sending a message, secure, fast, and beautiful?' },
  { step: 'Friction', number: '00.2', text: 'Existing crypto platforms overwhelm users with cluttered dashboards, confusing charts, and intimidating verification flows. New users abandon. Experienced traders settle for poor UX.' },
  { step: 'Pivot', number: '00.3', text: 'We designed AURUM around progressive disclosure, showing only what matters at each step, with guided onboarding, contextual education, and confidence-building visual feedback.' },
  { step: 'Proof', number: '00.4', text: '196 screens. 64+ components. Mobile-first responsive design. End-to-end crypto exchange platform covering trading, transfers, verification, and portfolio management.' },
];

function StoryBeat({ item, index, scrub }: { item: (typeof STORY)[number]; index: number; scrub: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.38, 0.62, 1], [0.25, 1, 1, 0.25]);
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [40, 0, -24]);
  return (
    <div ref={ref} className="py-7 first:pt-0 last:pb-0 lg:flex lg:min-h-[44vh] lg:items-center lg:py-0">
      <motion.div style={scrub ? { opacity, y } : undefined}>
        <p className={`mb-4 flex items-baseline gap-3 ${T.label}`}>
          <span className="font-mono text-[#D59A04]">{item.number}</span>
          <span>{item.step}</span>
        </p>
        {index === 0 ? (
          <p className="max-w-[30ch] text-balance text-[22px] leading-[1.3] tracking-[-0.015em] text-white md:text-[26px]" style={HEAD}>
            {item.text}
          </p>
        ) : (
          <p lang="en" className={`max-w-[46ch] ${T.lead} ${JUSTIFY}`}>{item.text}</p>
        )}
      </motion.div>
    </div>
  );
}

function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const scrub = desktop && !reduce;
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(STORY.length - 1, Math.max(0, Math.floor(v * STORY.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    <Section id="story" label="Story">
      <div ref={ref} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="sr-only">Story</h2>
            <Chapter number="00" label="Story" />
            <ol className="hidden space-y-3 lg:block" aria-hidden>
              {STORY.map((s, i) => (
                <li key={s.step} className="flex items-center gap-3 text-[14px]">
                  <span className={`h-px transition-all duration-500 motion-reduce:transition-none ${i === active ? 'w-10 bg-[#D59A04]' : 'w-5 bg-white/20'}`} />
                  <span className={`transition-colors duration-500 motion-reduce:transition-none ${i === active ? 'text-white' : 'text-[#9295A6]'}`}>{s.step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="divide-y divide-white/[0.07] lg:col-span-8 lg:divide-y-0">
          {STORY.map((item, i) => (
            <StoryBeat key={item.step} item={item} index={i} scrub={scrub} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── KEY SCREENS ─────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
type Screen = { num: string; title: string; desc: string; tags: string[]; src: string };

const FEATURED_SCREENS: Screen[] = [
  {
    num: '01', title: 'Home Dark',
    desc: 'The landing experience in dark mode, showcasing the platform\'s premium aesthetic with gold accents, clean typography, and inviting entry points.',
    tags: ['Dark mode', 'Landing', 'Brand identity'], src: cloudScreenHomeDark,
  },
  {
    num: '02', title: 'Exchange Dashboard',
    desc: 'The heart of the platform, real-time market data, trading pairs, order book, and price charts unified in a clean, scannable layout.',
    tags: ['Real-time data', 'Order book', 'Price charts'], src: cloudScreenExchange,
  },
];

const FLOW_SCREENS: Screen[] = [
  {
    num: '03', title: 'Login',
    desc: 'Secure entry point with clean form design, trust-building visual indicators, and a clear path to account creation.',
    tags: ['Secure login', 'Form design', 'Trust signals'], src: cloudScreenLogin,
  },
  {
    num: '04', title: 'Authentication',
    desc: '2FA verification flow with biometric options and step-by-step guidance that makes security feel effortless and trustworthy.',
    tags: ['2FA', 'Biometrics', 'Verification'], src: cloudScreenAuth,
  },
  {
    num: '05', title: 'QR Transfer',
    desc: 'Instant peer-to-peer transfers via QR code scanning, making crypto transfers as simple as sharing a photo.',
    tags: ['P2P transfer', 'QR scanner', 'Instant send'], src: cloudScreenQR,
  },
];

const ScreenImg = ({ s, className = 'h-auto w-full' }: { s: Screen; className?: string }) => (
  <img {...IMG.wide(s.src)} alt={s.title} width="1440" height="900" loading="lazy" decoding="async" className={className} />
);

/*
 * Sign-in → 2FA → QR transfer is a sequence, so on desktop it is told as
 * one: the copy scrolls while a single pinned frame swaps to the matching
 * screen. Below 1024px each step simply carries its own screen.
 */
function FlowSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(FLOW_SCREENS.length - 1, Math.max(0, Math.floor(v * FLOW_SCREENS.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-20 lg:col-span-5 lg:space-y-0">
        {FLOW_SCREENS.map((s, i) => (
          <div key={s.num} className="lg:flex lg:min-h-[78vh] lg:items-center">
            <div className="w-full">
              <div className={`transition-opacity duration-500 motion-reduce:transition-none ${i === active ? 'lg:opacity-100' : 'lg:opacity-35'}`}>
                <p className="mb-3 font-mono text-[12px] text-[#D59A04]">{s.num}</p>
                <H3 className="mb-3">{s.title}</H3>
                <p className={`mb-3 max-w-[42ch] ${T.body}`}>{s.desc}</p>
                <p className={T.caption}>{s.tags.join(' · ')}</p>
              </div>
              <div className="mt-8 lg:hidden">
                <ClipScreen><ScreenImg s={s} /></ClipScreen>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[max(7rem,calc(50vh-15rem))]">
          <BrowserFrame>
            <div className="relative aspect-[16/10] bg-[#0B0D12]">
              {FLOW_SCREENS.map((s, i) => (
                <ScreenImg
                  key={s.num}
                  s={s}
                  className={`absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
                />
              ))}
            </div>
          </BrowserFrame>
          <div className="mt-5 flex items-center gap-2" aria-hidden>
            {FLOW_SCREENS.map((s, i) => (
              <span key={s.num} className={`h-[3px] rounded-full transition-all duration-500 motion-reduce:transition-none ${i === active ? 'w-8 bg-[#D59A04]' : 'w-4 bg-white/15'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── PAGE ────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
export function AurumCaseStudy() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#080B0F] text-white antialiased"
      style={{ fontFamily: BRAND.bodyFont }}
    >
      <AurumSEO />
      <CaseHeroTarget path="/projects/aurum" />
      <ReadProgress color={BRAND.gold} />
      <CaseStudySectionNav
        accentColor="#D59A04"
        sections={[
          { id: 'story', label: 'Story' },
          { id: 'overview', label: 'Overview' },
          { id: 'challenge', label: 'Challenge' },
          { id: 'screens', label: 'Screens' },
          { id: 'ux-stories', label: 'UX Stories' },
          { id: 'previews', label: 'Previews' },
          { id: 'design', label: 'Design System' },
          { id: 'approach', label: 'Approach' },
          { id: 'outcome', label: 'Outcome' },
        ]}
      />

      {/* ─── NAV ──────────────────────────────────────────────────── */}
      <nav aria-label="Case study" className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#080B0F]/80 backdrop-blur-xl">
        <div className={`${CONTAINER} flex h-16 items-center justify-between`}>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => navigate('/', { viewTransition: true })}
              className={`-ml-2 flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-[13px] text-[#9295A6] transition-colors hover:text-white ${FOCUS}`}
            >
              <ArrowLeft size={15} aria-hidden />
              <span className="hidden sm:inline">Back to Portfolio</span>
              <span className="sm:hidden">Back</span>
            </button>
            <span aria-hidden className="h-5 w-px bg-white/10" />
            <AurumLogo />
          </div>
          <div className="hidden gap-6 md:flex">
            {['Overview', 'Screens', 'Design'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`rounded text-[13px] text-[#9295A6] transition-colors hover:text-white ${FOCUS}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <ScrollToTopButton />

        <AurumHero />

        <StorySection />

        {/* ─── 01 OVERVIEW ─────────────────────────────────────────── */}
        <Section id="overview">
          <Chapter number="01" label="Project overview" />
          <ChapterHead lines={['Redefining crypto', 'trading experience']}>
            <TextColumns>
              <Col lead>
                AURUM is a full-featured cryptocurrency exchange platform designed to make digital asset trading accessible, secure, and visually refined. The platform encompasses everything from onboarding and KYC verification to real-time trading, portfolio management, and peer-to-peer transfers.
              </Col>
              <Col>
                Every interaction was carefully crafted to reduce friction and build trust, transforming complex financial operations into intuitive, confidence-inspiring experiences.
              </Col>
            </TextColumns>
          </ChapterHead>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24 md:grid-cols-4">
            {[
              { value: '196', label: 'Screens', sub: 'Full product' },
              { value: '64', label: 'Components', sub: 'Design system' },
              { value: '8', label: 'Color tokens', sub: 'Brand palette' },
              { value: '2', label: 'Platforms', sub: 'Mobile & desktop' },
            ].map((m) => (
              <div key={m.label} className="flex flex-col">
                <DrawRule color="rgba(255,255,255,0.12)" />
                <dt className={`order-2 mt-3 ${T.caption}`}>
                  <span className="text-[#C9CBD4]">{m.label}</span>
                  <span className="block">{m.sub}</span>
                </dt>
                <dd
                  className="order-1 mt-5 text-[40px] leading-none tracking-[-0.03em] text-white md:text-[48px]"
                  style={HEAD}
                >
                  <CountUp value={m.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* ─── Marquee: disciplines and tags from this case ─────────── */}
        <div className="py-10 md:py-14">
          <Marquee
            speed={45}
            className="text-[26px] tracking-[-0.01em] text-white/25 md:text-[34px]"
            items={['UX research', 'UI design', 'Design system', 'Prototyping', 'FinTech', 'Crypto exchange', 'Web & Mobile', 'Figma', 'Protopie', '196 screens', 'Trust-first UX']}
          />
        </div>


        {/* ─── 02 CHALLENGE & SOLUTION ─────────────────────────────── */}
        <Section id="challenge">
          <Chapter number="02" label="Challenge & solution" />
          <H2 lines={['Complexity was the barrier, for new users', 'and experienced traders alike']} className="mb-14 md:mb-20" />

          <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
            {[
              {
                title: 'The challenge',
                intro: 'Crypto platforms struggle with overwhelming complexity, creating barriers for new users while frustrating experienced traders.',
                items: [
                  'Cluttered, intimidating trading interfaces',
                  'Complex multi-step KYC verification',
                  'Poor mobile trading experience',
                  'Lack of trust-building visual cues',
                  'Confusing navigation between features',
                ],
                muted: true,
              },
              {
                title: 'The solution',
                intro: 'A clean, confidence-inspiring interface built around progressive disclosure and trust-first design principles.',
                items: [
                  'Simplified trading with contextual data',
                  'Guided step-by-step verification flow',
                  'Mobile-first responsive architecture',
                  'Security indicators at every touchpoint',
                  'Intuitive portfolio & transfer management',
                ],
                muted: false,
              },
            ].map((col, ci) => (
              <Rise key={col.title} delay={ci * 0.12}>
                <H3 className="mb-4">{col.title}</H3>
                <p lang="en" className={`mb-8 max-w-[46ch] md:min-h-[5.1em] ${T.body} ${JUSTIFY}`}>{col.intro}</p>
                <ul className="border-b border-white/[0.07]">
                  {col.items.map((item) => (
                    <li key={item} className={`flex gap-4 border-t border-white/[0.07] py-3.5 text-[15px] leading-[1.5] ${col.muted ? 'text-[#9295A6]' : 'text-[#E4E5EA]'}`}>
                      <span aria-hidden className={`mt-[0.7em] h-px w-3 flex-shrink-0 ${col.muted ? 'bg-white/25' : 'bg-[#D59A04]'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Rise>
            ))}
          </div>

          {/* Trust architecture */}
          <div className="mt-24 md:mt-32">
            <p className={`mb-3 ${T.label}`}>Trust architecture</p>
            <RevealLines as="h3" className={`${T.h3} mb-10 md:mb-12`} style={HEAD}>
              <span>Four pillars, engineered</span>
              <span>into every touchpoint</span>
            </RevealLines>
            <Rise className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Security', practice: 'Multi-layer auth, KYC, 2FA, biometric', metric: 'Every transaction · Every login' },
                { name: 'Clarity', practice: 'Progressive disclosure, no clutter', metric: 'One primary action per screen' },
                { name: 'Speed', practice: 'Single-click trade execution', metric: 'Sub-100ms response targets' },
                { name: 'Confidence', practice: 'Verified status at every step', metric: 'Visible audit trail' },
              ].map((p, i) => (
                <div key={p.name} className="border-t border-white/[0.1] py-6 lg:py-7">
                  <p className="mb-4 font-mono text-[12px] text-[#D59A04]">{String(i + 1).padStart(2, '0')}</p>
                  <h4 className="mb-2 text-[17px] text-white" style={HEAD}>{p.name}</h4>
                  <p className={`mb-2 ${T.body}`}>{p.practice}</p>
                  <p className={T.caption}>{p.metric}</p>
                </div>
              ))}
            </Rise>
            <p className={`mt-6 border-t border-white/[0.07] pt-6 ${T.caption}`}>
              How trust is engineered into <span className="text-white">196</span> screens, <span className="text-white">64+</span> components and <span className="text-white">3</span> surfaces.
            </p>
          </div>
        </Section>

        {/* ─── 03 KEY SCREENS ──────────────────────────────────────── */}
        <Section id="screens">
          <Chapter number="03" label="Key screens" />
          <ChapterHead lines={['Core experiences']} className="mb-16 md:mb-24">
            <Rise>
              <p className={`max-w-[46ch] ${T.lead}`}>
                From onboarding to portfolio management, each screen was designed to feel intuitive while handling complex financial data with care and clarity.
              </p>
            </Rise>
          </ChapterHead>

          <div className="space-y-24 md:space-y-32">
            {FEATURED_SCREENS.map((s, i) => {
              const Frame = i % 2 === 0 ? ClipScreen : TiltScreen;
              return (
                <figure key={s.num}>
                  <Frame><ScreenImg s={s} /></Frame>
                  <figcaption className="mt-8 md:mt-10">
                    <Rise className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-10">
                      <div className="lg:col-span-4">
                        <p className="mb-3 font-mono text-[12px] text-[#D59A04]">{s.num}</p>
                        <H3>{s.title}</H3>
                      </div>
                      <div className="lg:col-span-8 lg:pt-[calc(12px*1.5+0.75rem)]">
                        <p className={`mb-3 max-w-[46ch] ${T.body}`}>{s.desc}</p>
                        <p className={T.caption}>{s.tags.join(' · ')}</p>
                      </div>
                    </Rise>
                  </figcaption>
                </figure>
              );
            })}

            <FlowSequence />
          </div>
        </Section>

        {/* ─── 04 UX STORIES ───────────────────────────────────────── */}
        <Section id="ux-stories">
          <Chapter number="04" label="UX stories" />
          <H2 lines={['Onboarding, KYC gates', 'and the exchange flow']} className="mb-12 md:mb-16" />
          <UXStories />
        </Section>

        {/* ─── 05 INTERACTIVE PREVIEWS ─────────────────────────────── */}
        <Section id="previews">
          <Chapter number="05" label="Interactive preview" />
          <ChapterHead lines={['Live components']} className="mb-12 md:mb-16">
            <Rise>
              <p className={`max-w-[46ch] ${T.lead}`}>
                Interactive previews of key dashboard components, demonstrating real-time data visualization and trading widget design.
              </p>
            </Rise>
          </ChapterHead>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Rise><DashboardPreview /></Rise>
            <Rise delay={0.12}><ExchangeWidget /></Rise>
          </div>
        </Section>

        {/* ─── 06 DESIGN SYSTEM ────────────────────────────────────── */}
        <Section id="design">
          <Chapter number="06" label="Design system" />
          <ChapterHead lines={['AURUM design system']} className="mb-16 md:mb-24">
            <Rise>
              <p lang="en" className={`max-w-[46ch] ${T.lead} ${JUSTIFY}`}>
                A comprehensive design system built for scale, 8 semantic color tokens, 2 typeface families, a spatial rhythm, and 64+ reusable components powering all 196 screens.
              </p>
            </Rise>
          </ChapterHead>

          {/* Shared component: its sub-headings are kept in one colour here */}
          <div className="[&_h3]:text-[18px] md:[&_h3]:text-[20px] [&_h3_span]:text-inherit">
            <DesignSystemFull />
          </div>

          {/* Figma component sheet */}
          <figure className="mt-24 md:mt-32">
            <div className="mb-8 flex flex-col gap-2 md:mb-10">
              <H3>Component sheet</H3>
              <p className={T.caption}>The complete Figma design components document · 64+ components</p>
            </div>
            <ClipScreen url="figma.com · AURUM, Design Components">
              <div
                className={`max-h-[80vh] overflow-y-auto overscroll-contain bg-[#0A0C10] scrollbar-thin ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                tabIndex={0}
                role="region"
                aria-label="AURUM design system sheet, scrollable"
              >
                <img {...IMG.wide(designSystemSheet)} alt="AURUM Design System" width="1440" height="1200" loading="lazy" decoding="async" className="h-auto w-full" />
              </div>
            </ClipScreen>
            <figcaption className="mt-6">
              <p className={`max-w-[80ch] ${T.caption}`}>
                Includes navbar, buttons, tabs & toggles, input fields, icons, use case styles, card styles, footers, chart data, QR codes and modals. Scroll inside the frame to see the full sheet.
              </p>
            </figcaption>
          </figure>
        </Section>

        {/* ─── 07 DESIGN APPROACH ──────────────────────────────────── */}
        <Section id="approach">
          <Chapter number="07" label="Design approach" />
          <ChapterHead lines={['Trust through craft']} className="mb-16 md:mb-20">
            <Rise>
              <p className={`max-w-[46ch] ${T.lead}`}>
                In crypto, trust is earned pixel by pixel. Every design decision reinforces security, clarity, and user confidence.
              </p>
            </Rise>
          </ChapterHead>

          <Rise className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Security First', desc: 'Trust indicators everywhere' },
              { title: 'Progressive Disclosure', desc: 'Show only what matters' },
              { title: 'Mobile Native', desc: 'Touch-optimized interactions' },
              { title: 'Speed', desc: 'Instant visual feedback' },
            ].map((item, i) => (
              <div key={item.title} className="border-t border-white/[0.1] py-6 lg:py-7">
                <p className="mb-4 font-mono text-[12px] text-[#D59A04]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mb-2 text-[17px] text-white" style={HEAD}>{item.title}</h3>
                <p className={T.body}>{item.desc}</p>
              </div>
            ))}
          </Rise>

          <div className="mt-20 grid grid-cols-1 gap-8 md:mt-28 lg:grid-cols-12 lg:gap-10">
            <H3 className="lg:col-span-4">What makes this work stand out</H3>
            <Rise className="lg:col-span-8">
              <ul className="grid grid-cols-1 gap-x-8 border-b border-white/[0.07] sm:grid-cols-2">
                {[
                  'End-to-end product thinking',
                  'Mobile-first responsive design',
                  'Comprehensive design system',
                  'Trust-building micro-interactions',
                  'Guided verification flows',
                  'Real-time data visualization',
                ].map((point) => (
                  <li key={point} className="flex gap-4 border-t border-white/[0.07] py-3.5 text-[15px] leading-[1.5] text-[#C9CBD4]">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 flex-shrink-0 bg-[#D59A04]" />
                    {point}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </Section>

        {/* ─── 08 OUTCOME ──────────────────────────────────────────── */}
        <Section id="outcome">
          <Chapter number="08" label="Outcome" />
          <ChapterHead lines={['A premium', 'crypto experience']}>
            <Rise>
              <p lang="en" className={`gap-10 md:columns-2 ${T.lead} ${JUSTIFY}`}>
                AURUM proves that financial products don't have to sacrifice beauty for functionality. By combining thoughtful UX research, a comprehensive design system, and pixel-perfect execution, we created a platform that makes crypto trading feel premium, secure, and accessible.
              </p>
              <p className={`mt-8 ${T.caption}`}>Crypto exchange · Mobile-first · Design system · 196 screens · Trust-first UX</p>
            </Rise>
          </ChapterHead>
        </Section>

        
      </main>
    </div>
  );
}
