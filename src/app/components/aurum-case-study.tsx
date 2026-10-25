import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useMotionValueEvent,
  type Variants,
} from 'motion/react';
import { useNavigate } from 'react-router';
import { CaseHeroTarget } from './case-transition';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { DashboardPreview, ExchangeWidget } from './dashboard-preview';
import { DesignSystemFull } from './color-palette';
import { UXStories } from './ux-stories';
import { NextProjectRecommendation } from './next-project';
import { CaseStudySectionNav } from './case-study-nav';
import { AurumSEO } from './seo';
import aurumSvgPaths from '../../imports/svg-wj69ey5ojj';
import { IMG } from '../lib/cld';
import { isHydrating } from '../hydration';

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
  darkBg: '#080B0F',
  surface: '#0E1015',
  headingFont: '"Syne", "Space Grotesk", sans-serif',
  bodyFont: '"Manrope", "Inter", sans-serif',
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* Focus ring shared by every interactive element on the page */
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-[#D59A04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B0F]';

/* ─── Layout primitives ──────────────────────────────────────────── */
/* One container, one left edge, for every section on the page */
const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 md:px-14 xl:px-10 ${className}`}>{children}</div>
);

/* One vertical rhythm: every chapter is separated by the same hairline and padding */
const Section = ({ id, children, label }: { id: string; children: ReactNode; label?: string }) => (
  <section id={id} aria-label={label} className="scroll-mt-20 border-t border-white/[0.07] py-20 md:py-28 lg:py-32">
    <Container>{children}</Container>
  </section>
);

const Chapter = ({ number, label }: { number: string; label: string }) => (
  <p className="mb-6 flex items-baseline gap-3 text-[13px] text-[#9295A6] md:mb-8">
    <span className="font-mono text-[#D59A04]">{number}</span>
    <span aria-hidden className="h-px w-6 translate-y-[-3px] bg-white/20" />
    <span>{label}</span>
  </p>
);

const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2
    className={`max-w-[22ch] text-balance text-[34px] leading-[1.08] tracking-[-0.025em] text-white sm:text-[42px] lg:text-[52px] ${className}`}
    style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}
  >
    {children}
  </h2>
);

const H3 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h3
    className={`text-[22px] leading-[1.2] tracking-[-0.015em] text-white md:text-[26px] ${className}`}
    style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}
  >
    {children}
  </h3>
);

const Lead = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`max-w-[62ch] text-pretty text-[17px] leading-[1.65] text-zinc-300 md:text-[18px] ${className}`}>{children}</p>
);

const Caption = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`text-[14px] leading-[1.6] text-[#9295A6] ${className}`}>{children}</p>
);

/* ─── Browser frame for product screens ──────────────────────────── */
const BrowserFrame = ({ children, url = 'aurum.exchange', className = '' }: { children: ReactNode; url?: string; className?: string }) => (
  <div
    className={`overflow-hidden rounded-[10px] bg-[#0B0D12] ring-1 ring-white/[0.08] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75),0_12px_24px_-12px_rgba(0,0,0,0.5)] md:rounded-[14px] ${className}`}
  >
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

/* ─── Motion helpers (local) ─────────────────────────────────────── */

/*
 * The hero plays its entrance only on client-side navigation. Prerendered
 * HTML (and React adopting it) stays exactly as delivered, so nothing is
 * ever hidden waiting for JavaScript, and reduced motion skips it entirely.
 */
function usePlayIntro() {
  const reduce = useReducedMotion();
  const [play] = useState(() => typeof window !== 'undefined' && !isHydrating());
  return play && !reduce;
}

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
 * Scroll-linked reveal for large screenshots: the frame settles from a
 * slightly smaller, lower position into place as it enters the viewport.
 * It is tied to scroll position (no observer, no opacity), so it can never
 * get stuck hidden; with reduced motion it renders static.
 */
function ScreenReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.35'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { scale, y, transformOrigin: '50% 0%' }}>
      {children}
    </motion.div>
  );
}

const heroParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const heroTitle: Variants = {
  hidden: { y: '102%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
};
const heroScreen: Variants = {
  hidden: { opacity: 0, y: 56, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: EASE, delay: 0.2 } },
};

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
          transition={{ duration: 0.3, ease: EASE }}
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
  const play = usePlayIntro();
  const reduce = useReducedMotion();
  const screenRef = useRef<HTMLDivElement>(null);
  // Gentle depth as the hero screen scrolls away
  const { scrollYProgress } = useScroll({ target: screenRef, offset: ['start 0.6', 'end start'] });
  const screenScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);

  return (
    <motion.header
      className="pb-20 pt-28 md:pb-28 md:pt-36 lg:pb-32 lg:pt-40"
      variants={heroParent}
      initial={play ? 'hidden' : false}
      animate="show"
    >
      <Container>
        <motion.p variants={heroItem} className="mb-6 flex items-center gap-3 text-[13px] text-[#9295A6] md:mb-8">
          <span>Case study</span>
          <span aria-hidden className="h-px w-6 bg-white/20" />
          <span>2024</span>
        </motion.p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="overflow-hidden pb-[0.04em]">
              <motion.span
                variants={heroTitle}
                className="block text-[72px] leading-[0.92] tracking-[-0.045em] text-white sm:text-[112px] lg:text-[148px]"
                style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}
              >
                AURUM
              </motion.span>
              <span className="sr-only">, crypto exchange platform</span>
            </h1>
          </div>
          <motion.div variants={heroItem} className="lg:col-span-5 lg:pb-3">
            <p aria-hidden className="mb-3 text-[22px] leading-[1.25] tracking-[-0.01em] text-white md:text-[26px]" style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}>
              Crypto Exchange Platform
            </p>
            <p className="max-w-[46ch] text-[17px] leading-[1.6] text-zinc-300">
              A regulated crypto exchange designed for complex onboarding, verification logic, and online/offline transaction flows.
            </p>
          </motion.div>
        </div>

        <motion.dl
          variants={heroItem}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/[0.08] pt-6 md:mt-16 md:grid-cols-3 lg:grid-cols-6"
        >
          {META.map((m) => (
            <div key={m.label}>
              <dt className="mb-1 text-[13px] text-[#9295A6]">{m.label}</dt>
              <dd className="text-[15px] leading-[1.45] text-white">{m.value}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={heroItem} className="mt-6">
          <Caption>Scope: UX research, UI design, design system, prototyping. 196 screens, 2 platforms, 3 UX stories.</Caption>
        </motion.div>

        <motion.div ref={screenRef} variants={heroScreen} className="mt-12 md:mt-16">
          <motion.div style={reduce ? undefined : { scale: screenScale, transformOrigin: '50% 0%' }}>
            <BrowserFrame>
              <img
                {...IMG.wide(screenExchange)}
                alt="AURUM Exchange Dashboard"
                width="1440"
                height="900"
                className="h-auto w-full"
                loading="eager"
                {...{ fetchpriority: 'high' }}
              />
            </BrowserFrame>
          </motion.div>
        </motion.div>
      </Container>
    </motion.header>
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
  const opacity = useTransform(scrollYProgress, [0, 0.38, 0.62, 1], [0.3, 1, 1, 0.3]);
  return (
    <div ref={ref} className="py-8 first:pt-0 last:pb-0 lg:flex lg:min-h-[52vh] lg:items-center lg:py-0">
      <motion.div style={scrub ? { opacity } : undefined}>
        <p className="mb-4 flex items-baseline gap-3 text-[13px] text-[#9295A6]">
          <span className="font-mono text-[#D59A04]">{item.number}</span>
          <span>{item.step}</span>
        </p>
        <p
          className={`max-w-[34ch] text-pretty text-[22px] leading-[1.4] tracking-[-0.01em] md:text-[28px] lg:text-[32px] ${index === 0 ? 'text-white' : 'text-zinc-200'}`}
          style={{ fontFamily: index === 0 ? BRAND.headingFont : BRAND.bodyFont, fontWeight: index === 0 ? 600 : 500 }}
        >
          {item.text}
        </p>
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
                <li key={s.step} className="flex items-center gap-3 text-[15px]">
                  <span
                    className={`h-px transition-all duration-500 motion-reduce:transition-none ${i === active ? 'w-10 bg-[#D59A04]' : 'w-5 bg-white/20'}`}
                  />
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

const ScreenText = ({ s, className = '' }: { s: Screen; className?: string }) => (
  <div className={className}>
    <p className="mb-3 font-mono text-[13px] text-[#D59A04]">{s.num}</p>
    <H3 className="mb-3">{s.title}</H3>
    <p className="mb-3 max-w-[52ch] text-[17px] leading-[1.6] text-zinc-300">{s.desc}</p>
    <Caption>{s.tags.join(' · ')}</Caption>
  </div>
);

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
            <div>
              <ScreenText
                s={s}
                className={`transition-opacity duration-500 motion-reduce:transition-none ${i === active ? 'lg:opacity-100' : 'lg:opacity-40'}`}
              />
              <ScreenReveal className="mt-8 lg:hidden">
                <BrowserFrame>
                  <ScreenImg s={s} />
                </BrowserFrame>
              </ScreenReveal>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[6rem]">
          <BrowserFrame>
            <div className="relative aspect-[11/10] max-h-[calc(100svh-11rem)] mx-auto bg-[#0B0D12]">
              {FLOW_SCREENS.map((s, i) => (
                <ScreenImg
                  key={s.num}
                  s={s}
                  className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 motion-reduce:transition-none ${i === active ? 'opacity-100' : 'opacity-0'}`}
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
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8 md:px-14 xl:px-10">
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">Redefining crypto trading experience</H2>
            <div className="space-y-5 lg:col-span-7 lg:pt-2">
              <Lead>
                AURUM is a full-featured cryptocurrency exchange platform designed to make digital asset trading accessible, secure, and visually refined. The platform encompasses everything from onboarding and KYC verification to real-time trading, portfolio management, and peer-to-peer transfers.
              </Lead>
              <p className="max-w-[62ch] text-[16px] leading-[1.65] text-[#9295A6]">
                Every interaction was carefully crafted to reduce friction and build trust, transforming complex financial operations into intuitive, confidence-inspiring experiences.
              </p>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4">
            {[
              { value: '196', label: 'Screens', sub: 'Full product' },
              { value: '64', label: 'Components', sub: 'Design system' },
              { value: '8', label: 'Color tokens', sub: 'Brand palette' },
              { value: '2', label: 'Platforms', sub: 'Mobile & desktop' },
            ].map((m) => (
              <div key={m.label} className="flex flex-col border-t border-white/[0.1] pt-5">
                <dt className="order-2 mt-3 text-[15px] text-zinc-200">
                  {m.label}
                  <span className="block text-[13px] text-[#9295A6]">{m.sub}</span>
                </dt>
                <dd
                  className="order-1 text-[44px] leading-none tracking-[-0.03em] text-white md:text-[56px] lg:text-[64px]"
                  style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}
                >
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* ─── 02 CHALLENGE & SOLUTION ─────────────────────────────── */}
        <Section id="challenge">
          <Chapter number="02" label="Challenge & solution" />
          <H2 className="mb-14 md:mb-20">Complexity was the barrier, for new users and experienced traders alike</H2>

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
            ].map((col) => (
              <div key={col.title}>
                <H3 className="mb-4">{col.title}</H3>
                <p className="mb-8 max-w-[48ch] text-[17px] leading-[1.6] text-zinc-300 md:min-h-[5.4em]">{col.intro}</p>
                <ul className="border-b border-white/[0.07]">
                  {col.items.map((item) => (
                    <li key={item} className={`flex gap-4 border-t border-white/[0.07] py-4 text-[16px] leading-[1.5] ${col.muted ? 'text-[#9295A6]' : 'text-white'}`}>
                      <span aria-hidden className={`mt-[0.7em] h-px w-3 flex-shrink-0 ${col.muted ? 'bg-white/25' : 'bg-[#D59A04]'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Trust architecture */}
          <div className="mt-24 md:mt-32">
            <Caption className="mb-3">Trust architecture</Caption>
            <H3 className="mb-10 max-w-[30ch] md:mb-12 md:text-[32px]">Four pillars, engineered into every touchpoint</H3>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Security', practice: 'Multi-layer auth, KYC, 2FA, biometric', metric: 'Every transaction · Every login' },
                { name: 'Clarity', practice: 'Progressive disclosure, no clutter', metric: 'One primary action per screen' },
                { name: 'Speed', practice: 'Single-click trade execution', metric: 'Sub-100ms response targets' },
                { name: 'Confidence', practice: 'Verified status at every step', metric: 'Visible audit trail' },
              ].map((p, i) => (
                <div key={p.name} className="border-t border-white/[0.1] py-6 lg:py-8">
                  <p className="mb-4 font-mono text-[13px] text-[#D59A04]">{String(i + 1).padStart(2, '0')}</p>
                  <h4 className="mb-2 text-[20px] text-white" style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}>{p.name}</h4>
                  <p className="mb-3 text-[16px] leading-[1.55] text-zinc-300">{p.practice}</p>
                  <Caption>{p.metric}</Caption>
                </div>
              ))}
            </div>
            <Caption className="mt-6 border-t border-white/[0.07] pt-6">
              How trust is engineered into <span className="text-white">196</span> screens, <span className="text-white">64+</span> components and <span className="text-white">3</span> surfaces.
            </Caption>
          </div>
        </Section>

        {/* ─── 03 KEY SCREENS ──────────────────────────────────────── */}
        <Section id="screens">
          <Chapter number="03" label="Key screens" />
          <div className="mb-16 grid grid-cols-1 gap-6 md:mb-24 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">Core experiences</H2>
            <Lead className="lg:col-span-7 lg:pt-2">
              From onboarding to portfolio management, each screen was designed to feel intuitive while handling complex financial data with care and clarity.
            </Lead>
          </div>

          <div className="space-y-24 md:space-y-32">
            {FEATURED_SCREENS.map((s) => (
              <figure key={s.num}>
                <ScreenReveal>
                  <BrowserFrame>
                    <ScreenImg s={s} />
                  </BrowserFrame>
                </ScreenReveal>
                <figcaption className="mt-8 md:mt-10">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                      <p className="mb-3 font-mono text-[13px] text-[#D59A04]">{s.num}</p>
                      <H3>{s.title}</H3>
                    </div>
                    <div className="lg:col-span-7 lg:pt-[calc(13px*1.6+0.75rem)]">
                      <p className="mb-3 max-w-[60ch] text-[17px] leading-[1.6] text-zinc-300">{s.desc}</p>
                      <Caption>{s.tags.join(' · ')}</Caption>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}

            <FlowSequence />
          </div>
        </Section>

        {/* ─── 04 UX STORIES ───────────────────────────────────────── */}
        <Section id="ux-stories">
          <Chapter number="04" label="UX stories" />
          <H2 className="mb-12 md:mb-16">Onboarding, KYC gates and the exchange flow</H2>
          <UXStories />
        </Section>

        {/* ─── 05 INTERACTIVE PREVIEWS ─────────────────────────────── */}
        <Section id="previews">
          <Chapter number="05" label="Interactive preview" />
          <div className="mb-12 grid grid-cols-1 gap-6 md:mb-16 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">Live components</H2>
            <Lead className="lg:col-span-7 lg:pt-2">
              Interactive previews of key dashboard components, demonstrating real-time data visualization and trading widget design.
            </Lead>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardPreview />
            <ExchangeWidget />
          </div>
        </Section>

        {/* ─── 06 DESIGN SYSTEM ────────────────────────────────────── */}
        <Section id="design">
          <Chapter number="06" label="Design system" />
          <div className="mb-16 grid grid-cols-1 gap-6 md:mb-24 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">AURUM design system</H2>
            <Lead className="lg:col-span-7 lg:pt-2">
              A comprehensive design system built for scale, 8 semantic color tokens, 2 typeface families, a spatial rhythm, and 64+ reusable components powering all 196 screens.
            </Lead>
          </div>

          {/* Shared component: its sub-headings are kept in one colour here */}
          <div className="[&_h3_span]:text-inherit">
            <DesignSystemFull />
          </div>

          {/* Figma component sheet */}
          <figure className="mt-24 md:mt-32">
            <div className="mb-8 flex flex-col gap-2 md:mb-10">
              <H3>Component sheet</H3>
              <Caption>The complete Figma design components document · 64+ components</Caption>
            </div>
            <ScreenReveal>
              <BrowserFrame url="figma.com · AURUM, Design Components">
                <div
                  className={`max-h-[80vh] overflow-y-auto overscroll-contain bg-[#0A0C10] scrollbar-thin ${FOCUS} focus-visible:ring-offset-0 focus-visible:ring-inset`}
                  tabIndex={0}
                  role="region"
                  aria-label="AURUM design system sheet, scrollable"
                >
                  <img {...IMG.wide(designSystemSheet)} alt="AURUM Design System" width="1440" height="1200" loading="lazy" decoding="async" className="h-auto w-full" />
                </div>
              </BrowserFrame>
            </ScreenReveal>
            <figcaption className="mt-6">
              <Caption>
                Includes navbar, buttons, tabs & toggles, input fields, icons, use case styles, card styles, footers, chart data, QR codes and modals. Scroll inside the frame to see the full sheet.
              </Caption>
            </figcaption>
          </figure>
        </Section>

        {/* ─── 07 DESIGN APPROACH ──────────────────────────────────── */}
        <Section id="approach">
          <Chapter number="07" label="Design approach" />
          <div className="mb-16 grid grid-cols-1 gap-6 md:mb-20 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">Trust through craft</H2>
            <Lead className="lg:col-span-7 lg:pt-2">
              In crypto, trust is earned pixel by pixel. Every design decision reinforces security, clarity, and user confidence.
            </Lead>
          </div>

          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Security First', desc: 'Trust indicators everywhere' },
              { title: 'Progressive Disclosure', desc: 'Show only what matters' },
              { title: 'Mobile Native', desc: 'Touch-optimized interactions' },
              { title: 'Speed', desc: 'Instant visual feedback' },
            ].map((item, i) => (
              <div key={item.title} className="border-t border-white/[0.1] py-6 lg:py-8">
                <p className="mb-4 font-mono text-[13px] text-[#D59A04]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mb-2 text-[20px] text-white" style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}>{item.title}</h3>
                <p className="text-[16px] leading-[1.55] text-zinc-300">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:mt-28 lg:grid-cols-12 lg:gap-10">
            <H3 className="lg:col-span-5">What makes this work stand out</H3>
            <ul className="grid grid-cols-1 gap-x-8 border-b border-white/[0.07] sm:grid-cols-2 lg:col-span-7">
              {[
                'End-to-end product thinking',
                'Mobile-first responsive design',
                'Comprehensive design system',
                'Trust-building micro-interactions',
                'Guided verification flows',
                'Real-time data visualization',
              ].map((point) => (
                <li key={point} className="flex gap-4 border-t border-white/[0.07] py-4 text-[16px] leading-[1.5] text-zinc-200">
                  <span aria-hidden className="mt-[0.7em] h-px w-3 flex-shrink-0 bg-[#D59A04]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ─── 08 OUTCOME ──────────────────────────────────────────── */}
        <Section id="outcome">
          <Chapter number="08" label="Outcome" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            <H2 className="lg:col-span-5">A premium crypto experience</H2>
            <div className="lg:col-span-7 lg:pt-2">
              <Lead className="mb-8">
                AURUM proves that financial products don't have to sacrifice beauty for functionality. By combining thoughtful UX research, a comprehensive design system, and pixel-perfect execution, we created a platform that makes crypto trading feel premium, secure, and accessible.
              </Lead>
              <Caption>Crypto exchange · Mobile-first · Design system · 196 screens · Trust-first UX</Caption>
            </div>
          </div>
        </Section>

        <NextProjectRecommendation currentProject="aurum" />
      </main>
    </div>
  );
}
