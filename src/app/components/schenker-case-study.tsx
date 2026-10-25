import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronUp } from 'lucide-react';

import { CaseHeroTarget } from './case-transition';
import { NextProjectRecommendation } from './next-project';
import { CaseStudySectionNav } from './case-study-nav';
import { SchenkerSEO } from './seo';
import schenkerSvgPaths from '../../imports/svg-0abw9z02wj';
import { IMG, responsive } from '../lib/cld';

// ─── Schenker Screen Imports ───────────────────────────────────
const screenSettings = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041604/d4d1e42280872aa3079a1b940b29790994d2b241_jcnrf6.webp';
const screenFrachtbrief = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenLabels = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041563/78c6f45f9246b9cea5c0520f003d32cb8fb21ff1_kmea60.webp';
const screenLadeliste = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungEmpfanger = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041645/1afd387db904f4cec4c15bfa6b7966e601ef294b_towksm.webp';
const screenSendungInfo = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungPakete = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';

/* ─── Cloudinary Key Screens ─────────────────────────────────────── */
const cloudSendungEmpfanger = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017032/Sendung-Empfa%CC%88nger_fuype4.webp';
const cloudSendungInfo = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017032/Sendung-Informationen_zumtpf.webp';
const cloudSendungPakete = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017030/Sendung-Pakete_qo2biq.webp';
const cloudLabelsTracking = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018698/Labels_und_Tracking_qetlrm.png';
const cloudEinstellungen = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018694/Einstellungen_huzhr5.png';
const cloudEntwickler = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018734/Entwickler_vekdwm.png';

/* ─── Brand Tokens ─────────────────────────────────────────────── */
const BRAND = {
  olive: '#6B8E23',
  oliveLight: '#8FBC3B',
  darkBg: '#080B0F',
  headingFont: '"Syne", "Space Grotesk", sans-serif',
  bodyFont: '"Manrope", "Inter", sans-serif',
};

/* ─── Layout & type tokens ─────────────────────────────────────── */
// One container and one left edge for every section (and the top bar).
// md–xl get wider gutters so the fixed section rail never sits on content.
const WRAP = 'mx-auto w-full max-w-[1232px] px-6 sm:px-8 md:px-20 xl:px-10';
// One vertical rhythm between chapters
const SECTION = 'scroll-mt-16 py-20 sm:py-24 lg:py-32';
const HEAD = { fontFamily: BRAND.headingFont } as const;
const H2 = 'text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] leading-[1.06] tracking-[-0.025em] font-semibold text-[#F2F3F5] text-balance';
const H3 = 'text-[22px] lg:text-[26px] leading-[1.2] tracking-[-0.015em] font-semibold text-[#F2F3F5]';
const BODY = 'text-[17px] lg:text-[18px] leading-[1.65] text-[#BCBFCA] max-w-[64ch]';
const CAPTION = 'text-[14px] leading-[1.55] text-[#9295A6]';
const RULE = 'border-white/[0.08]';
const FOCUS = 'focus-visible:!shadow-[0_0_0_2px_#8FBC3B]';

/* ─── Hero load sequence (pure CSS) ────────────────────────────────
   Runs from the prerendered HTML without waiting for JavaScript and
   is skipped entirely when the visitor prefers reduced motion, so the
   hero is always complete. Fill mode is "backwards": once played,
   nothing lingers on the elements.                                  */
const HERO_CSS = `
.sk-line{display:block;overflow:hidden;padding-bottom:.16em;margin-bottom:-.16em}
.sk-line>span{display:inline-block}
@media (prefers-reduced-motion:no-preference){
  .sk-rise{animation:sk-rise .8s cubic-bezier(.22,1,.36,1) backwards}
  .sk-line>span{animation:sk-line 1s cubic-bezier(.22,1,.36,1) backwards}
  .sk-screen{animation:sk-screen 1.2s cubic-bezier(.22,1,.36,1) backwards}
  .sk-d0{animation-delay:.05s}.sk-d1{animation-delay:.12s}.sk-d2{animation-delay:.2s}
  .sk-d3{animation-delay:.38s}.sk-d4{animation-delay:.5s}
}
@keyframes sk-rise{from{opacity:0;transform:translateY(16px)}}
@keyframes sk-line{from{transform:translateY(108%)}}
@keyframes sk-screen{from{opacity:0;transform:translateY(56px) scale(.965)}}
`;

/* ─── Motion gate ──────────────────────────────────────────────────
   Scroll-linked styles are only attached after mount and only when
   motion is allowed. Server HTML and the first client render are the
   finished, static layout, so nothing can be left half-revealed.   */
function useScrollMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}

/* ─── Browser frame ─────────────────────────────────────────────── */
const BrowserFrame = ({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) => (
  <div
    className={`overflow-hidden rounded-xl lg:rounded-2xl bg-[#0E1116] ring-1 ring-white/[0.08] shadow-[0_48px_96px_-40px_rgba(0,0,0,0.85),0_16px_32px_-16px_rgba(0,0,0,0.6)] ${className}`}
  >
    <div className="flex h-8 lg:h-10 items-center gap-3 border-b border-white/[0.06] bg-[#14171D] px-3 lg:px-4">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-white/15" />
        <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-white/15" />
        <span className="h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <span className="max-w-[min(100%,22rem)] truncate rounded-md bg-white/[0.05] px-3 py-0.5 text-[10px] lg:text-[11px] text-[#9295A6]">
          {url}
        </span>
      </div>
      <div className="w-8 lg:w-10" aria-hidden="true" />
    </div>
    <div className="bg-white">{children}</div>
  </div>
);

/* ─── Scroll-linked reveal for big screens ─────────────────────────
   The frame settles from a slightly smaller, lower position into
   place as it travels up the viewport. Scale and translate only:
   no opacity, so the screen is always visible.                     */
const ScreenReveal = ({ children, className = '', from = 0.92 }: { children: ReactNode; className?: string; from?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useScrollMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [64, 0]);
  return (
    <motion.div ref={ref} className={className} style={enabled ? { scale, y, transformOrigin: '50% 0%' } : undefined}>
      {children}
    </motion.div>
  );
};

const Shot = ({ src, alt, sizes = 'wide', eager = false }: { src: string; alt: string; sizes?: 'wide' | 'half' | 'sticky'; eager?: boolean }) => {
  const props =
    sizes === 'half'
      ? responsive(src, [480, 720, 960, 1280], '(min-width: 1280px) 560px, (min-width: 768px) 46vw, 92vw')
      : sizes === 'sticky'
        ? responsive(src, [640, 960, 1280, 1600], '(min-width: 1280px) 760px, 62vw')
        : IMG.wide(src);
  return (
    <img
      {...props}
      alt={alt}
      width="1440"
      height="900"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
      className="block h-auto w-full"
    />
  );
};

/* ─── Chapter label ────────────────────────────────────────────── */
const Chapter = ({ number, label, asHeading = false }: { number: string; label: string; asHeading?: boolean }) => {
  const Tag = asHeading ? 'h2' : 'p';
  return (
    <div className={`mb-10 lg:mb-14 border-t ${RULE} pt-5`}>
      <Tag className="flex items-baseline gap-3 text-[14px] font-normal">
        <span className="font-mono text-[#8FBC3B]">{number}</span>
        <span className="text-[#9295A6]">{label}</span>
      </Tag>
    </div>
  );
};

/* ─── Story line: colour brightens as it reaches reading height ─── */
const StoryLine = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const enabled = useScrollMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.5'] });
  const color = useTransform(scrollYProgress, [0, 1], ['#8A8D9B', '#F2F3F5']);
  return (
    <motion.p ref={ref} className={`text-[#F2F3F5] ${className}`} style={enabled ? { ...style, color } : style}>
      {children}
    </motion.p>
  );
};

/* ─── Shipment flow: sticky, scroll-scrubbed screen ────────────────
   Desktop with motion: the step copy scrolls past a pinned browser
   frame whose screen follows the step in view. Phones, tablets and
   reduced motion get the plain stacked version (pure CSS switch),
   with each screen under its step.                                 */
type FlowStep = { num: string; title: string; desc: string; tags: string[]; src: string; url: string };

const ShipmentFlow = ({ steps }: { steps: FlowStep[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <div ref={ref} className="mt-14 lg:mt-20 motion-safe:lg:grid motion-safe:lg:grid-cols-12 motion-safe:lg:gap-12">
      <ol className="space-y-20 motion-safe:lg:col-span-4 motion-safe:lg:space-y-0">
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <li key={step.num} className="motion-safe:lg:flex motion-safe:lg:min-h-[78vh] motion-safe:lg:items-center">
              <div className="w-full">
                <div className="mb-5 flex items-center gap-4" aria-hidden="true">
                  <span className={`font-mono text-[14px] transition-colors duration-500 text-[#8FBC3B] ${isActive ? '' : 'motion-safe:lg:text-[#6E7180]'}`}>
                    {step.num}
                  </span>
                  <span className={`h-px w-12 transition-colors duration-500 bg-[#8FBC3B]/60 ${isActive ? '' : 'motion-safe:lg:bg-white/10'}`} />
                </div>
                <h3
                  className={`${H3} transition-colors duration-500 ${isActive ? '' : 'motion-safe:lg:!text-[#7C7F8E]'}`}
                  style={HEAD}
                >
                  <span className="sr-only">Step {step.num}: </span>
                  {step.title}
                </h3>
                <p className={`mt-4 ${BODY}`}>{step.desc}</p>
                <p className={`mt-5 ${CAPTION}`}>{step.tags.join('  ·  ')}</p>
                {/* Stacked layout: the screen sits under its step */}
                <div className="mt-10 motion-safe:lg:hidden">
                  <ScreenReveal>
                    <BrowserFrame url={step.url}>
                      <Shot src={step.src} alt={step.title} />
                    </BrowserFrame>
                  </ScreenReveal>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Pinned screen (desktop, motion allowed) */}
      <div className="hidden motion-safe:lg:col-span-8 motion-safe:lg:block">
        <div className="sticky top-[max(96px,calc(50vh-260px))]">
          <BrowserFrame url={steps[active].url}>
            <div className="relative aspect-[16/10]">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  aria-hidden={i !== active}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ opacity: i === active ? 1 : 0, transform: i === active ? 'none' : `translateY(${i < active ? -16 : 16}px)` }}
                >
                  <img
                    {...responsive(step.src, [640, 960, 1280, 1600], '(min-width: 1280px) 760px, 62vw')}
                    alt={step.title}
                    width="1440"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </BrowserFrame>
          <div className="mt-5 flex items-center gap-4 text-[13px] text-[#9295A6]" aria-hidden="true">
            <span className="font-mono tabular-nums text-[#F2F3F5]">{steps[active].num}</span>
            <span className="font-mono">/ {String(steps.length).padStart(2, '0')}</span>
            <div className="flex flex-1 gap-1.5">
              {steps.map((s, i) => (
                <span key={s.num} className={`h-[2px] flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-[#8FBC3B]' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Scroll To Top Button ──────────────────────────────────────── */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
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
          className={`fixed bottom-24 md:bottom-8 right-5 md:right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#6B8E23] text-white shadow-lg shadow-black/40 hover:bg-[#7A9F2A] ${FOCUS}`}
        >
          <ChevronUp size={20} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ═════════════════════════════════════════════════════════════════ */
/* ─── SCHENKER CASE STUDY PAGE ────────────────────────────────── */
/* ═════════════════════════════════════════════════════════════════ */
export function SchenkerCaseStudy() {
  const navigate = useNavigate();

  const screenTabs = [
    { label: 'Sendung, Empfänger', desc: 'Receiver data entry with structured form fields for address, contact info, and shipment details' },
    { label: 'Sendung, Informationen', desc: 'Shipment settings with delivery options, notification toggles, and transport notes' },
    { label: 'Sendung, Versender', desc: 'Sender information form with company details, address, and contact fields' },
    { label: 'Sendung, Pakete', desc: 'Package management with dimensions, weight, volume, and pallet configuration' },
    { label: 'Labels & Tracking', desc: 'Label generation and tracking URL management with tabular shipment list view' },
    { label: 'Ladeliste', desc: 'Packing list management with document viewing, editing, and download controls' },
    { label: 'Frachtbrief', desc: 'Waybill management interface with structured document actions and filtering' },
    { label: 'Einstellungen', desc: 'Workstation settings with printer configuration, API setup, and license management' },
    { label: 'Help', desc: 'Help center with documentation access and support contact options' },
    { label: 'Entwickler, API-Schlüssel', desc: 'API key management with webhook configuration for developer integration' },
  ];

  const flowSteps: FlowStep[] = [
    {
      num: '01',
      title: 'Sendungsdaten & Informationen',
      desc: 'The starting point: delivery options, notification toggles (SMS, email, driver notifications), and transport remarks.',
      tags: ['Fix Day Zustellung', 'Zustell-Avis', 'Fahreravis'],
      src: screenSendungInfo, url: 'schenkerclient/sendung/informationen',
    },
    {
      num: '02',
      title: 'Versender & Empfanger',
      desc: 'Sender and receiver each have their own focused step, company, address, email, and phone fields separated for clarity and fewer mistakes.',
      tags: ['Firma', 'Address fields', 'Contact info'],
      src: screenSendungEmpfanger, url: 'schenkerclient/sendung/empfanger',
    },
    {
      num: '03',
      title: 'Pakete & Paletten',
      desc: 'Package details as a separate operational layer, dimensions, quantity, weight, volume, and packaging type without mixing with contact data.',
      tags: ['Dimensions', 'Gewicht/Volumen', 'Palette hinzufugen'],
      src: screenSendungPakete, url: 'schenkerclient/sendung/pakete',
    },
  ];

  const keyScreens = [
    { num: '01', title: 'Sendung, Empfänger', desc: screenTabs[0].desc, src: cloudSendungEmpfanger, tags: ['Form Design', 'Data Entry', 'Address Fields'] },
    { num: '02', title: 'Sendung, Informationen', desc: screenTabs[1].desc, src: cloudSendungInfo, tags: ['Delivery Options', 'Notifications', 'Transport'] },
    { num: '03', title: 'Sendung, Pakete', desc: screenTabs[3].desc, src: cloudSendungPakete, tags: ['Dimensions', 'Weight', 'Pallet Config'] },
    { num: '04', title: 'Labels & Tracking', desc: screenTabs[4].desc, src: cloudLabelsTracking, tags: ['Label Generation', 'Tracking URLs', 'Shipment List'] },
    { num: '05', title: 'Einstellungen', desc: screenTabs[7].desc, src: cloudEinstellungen, tags: ['Printer Config', 'API Setup', 'License'] },
    { num: '06', title: 'API-Schlüssel', desc: screenTabs[9].desc, src: cloudEntwickler, tags: ['API Keys', 'Webhooks', 'Integration'] },
  ];

  const documents = [
    { src: screenLabels, label: 'Labels und Tracking', url: 'schenkerclient/labels', description: 'Shipment list with checkboxes, tracking URLs, label generation, and bulk export functionality.' },
    { src: screenLadeliste, label: 'Ladeliste (Packing List)', url: 'schenkerclient/ladeliste', description: 'Document management table with name, sender, date, download status, edit and delete controls.' },
    { src: screenFrachtbrief, label: 'Frachtbrief (Waybill)', url: 'schenkerclient/frachtbrief', description: 'Waybill management with the same consistent table structure, quick review, download, and edit.' },
    { src: screenSettings, label: 'Einstellungen (Settings)', url: 'schenkerclient/einstellungen', description: 'Workstation and printer configuration, API key management, and license status display.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#080B0F] text-white antialiased" style={{ fontFamily: BRAND.bodyFont }}>
      <style>{HERO_CSS}</style>
      <SchenkerSEO />
      <CaseHeroTarget path="/projects/schenker" />
      {/* Section navigator */}
      <CaseStudySectionNav
        accentColor="#6B8E23"
        sections={[
          { id: 'hero', label: 'Hero' },
          { id: 'story', label: 'Story' },
          { id: 'overview', label: 'Overview' },
          { id: 'challenge', label: 'Challenge' },
          { id: 'structure', label: 'Structure' },
          { id: 'flow', label: 'Shipment Flow' },
          { id: 'screens', label: 'Screens' },
          { id: 'documents', label: 'Documents' },
          { id: 'approach', label: 'Approach' },
          { id: 'outcome', label: 'Outcome' },
        ]}
      />

      {/* ─── NAV ──────────────────────────────────────────────────────── */}
      <nav aria-label="Case study" className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.05] bg-[#080B0F]/80 backdrop-blur-xl">
        <div className={`${WRAP} flex h-16 items-center justify-between`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/', { viewTransition: true })}
              className={`-ml-2 flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-[13px] text-[#9295A6] hover:text-white ${FOCUS}`}
            >
              <ArrowLeft size={15} aria-hidden />
              <span>Back to Portfolio</span>
            </button>
            <div className="h-5 w-px bg-white/10" aria-hidden="true" />
            <svg className="h-[20px] lg:h-[22px] w-auto" fill="none" viewBox="0 0 227.898 36.56" role="img" aria-label="SCHENKER">
              <g clipPath="url(#schenkerNavClip)">
                <path d={schenkerSvgPaths.p21938980} fill="white" />
                <path d={schenkerSvgPaths.p1fc21500} fill="#FF0000" />
              </g>
              <defs>
                <clipPath id="schenkerNavClip">
                  <rect fill="white" height="36.56" width="227.898" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {['Overview', 'Screens', 'Flow'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`rounded-md px-3 py-2 text-[13px] text-[#9295A6] hover:text-white ${FOCUS}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <ScrollToTopButton />

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section id="hero" className="pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28">
          <div className={WRAP}>
            <p className={`sk-rise sk-d0 ${CAPTION}`}>
              Case study <span aria-hidden="true" className="mx-1.5 text-white/20">/</span> Enterprise UX{' '}
              <span aria-hidden="true" className="mx-1.5 text-white/20">/</span> Desktop
            </p>

            <h1
              className="mt-6 lg:mt-8 text-[clamp(2.75rem,1.4rem+5.2vw,5.75rem)] leading-[0.98] tracking-[-0.035em] font-semibold text-[#F2F3F5]"
              style={HEAD}
            >
              <span className="sk-line"><span className="sk-d1">SCHENKER</span></span>
              <span className="sk-line"><span className="sk-d2">Logistics Platform</span></span>
            </h1>

            <div className="sk-rise sk-d3 mt-10 lg:mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <p className="lg:col-span-7 text-[19px] sm:text-[21px] lg:text-[23px] leading-[1.5] text-[#C9CBD3] max-w-[36em]">
                Simplifying a complex shipping workflow, designing a structured logistics interface for shipment creation, document handling, and operational efficiency.
              </p>
              <dl className="lg:col-span-4 lg:col-start-9 grid grid-cols-2 gap-x-6 gap-y-6 self-end text-[15px]">
                {[
                  ['Discipline', 'UI/UX Design'],
                  ['Domain', 'Enterprise logistics'],
                  ['Platform', 'Desktop app'],
                  ['Focus', 'Form systems'],
                ].map(([k, v]) => (
                  <div key={k} className={`border-t ${RULE} pt-3`}>
                    <dt className="text-[13px] text-[#9295A6]">{k}</dt>
                    <dd className="mt-1 text-[#E6E7EB]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sk-screen sk-d4 mt-14 lg:mt-20">
              <BrowserFrame url="schenkerclient.cubsten.com">
                <Shot src={screenSendungEmpfanger} alt="Schenker, Sendung" eager />
              </BrowserFrame>
            </div>
          </div>
        </section>

        {/* ─── STORYTELLING: Hook → Friction → Pivot → Proof ──────────── */}
        <section id="story" className={SECTION}>
          <div className={WRAP}>
            <h2 className="sr-only">The story in four steps</h2>
            <ol className={`border-t ${RULE}`}>
              {[
                { step: 'Hook', number: '00.1', text: 'What if enterprise logistics software could feel intuitive, not like a spreadsheet with buttons?' },
                { step: 'Friction', number: '00.2', text: 'Schenker\'s internal tools drowned operators in form complexity, scattered workflows, and inconsistent UI patterns. Training costs soared. Error rates climbed.' },
                { step: 'Pivot', number: '00.3', text: 'We unified shipment creation, label management, and settings into one coherent design language, progressive disclosure over cognitive overload.' },
                { step: 'Proof', number: '00.4', text: 'Desktop-first enterprise platform. Streamlined multi-step forms. Contextual help system. One design system for the entire logistics workflow.' },
              ].map((item, i) => (
                <li key={item.step} className={`grid gap-4 border-b ${RULE} py-10 lg:grid-cols-12 lg:gap-12 lg:py-14`}>
                  <div className="flex items-baseline gap-3 text-[14px] lg:col-span-3 lg:pt-2">
                    <span className="font-mono text-[#8FBC3B]">{item.number}</span>
                    <span className="text-[#9295A6]">{item.step}</span>
                  </div>
                  <StoryLine
                    className={`lg:col-span-9 max-w-[30em] text-[22px] sm:text-[26px] lg:text-[32px] leading-[1.32] tracking-[-0.015em] ${i === 0 ? 'font-semibold' : 'font-medium'}`}
                    style={i === 0 ? HEAD : undefined}
                  >
                    {item.text}
                  </StoryLine>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── OVERVIEW ─────────────────────────────────────────────────── */}
        <section id="overview" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="01" label="Project overview" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>
                Designing clarity for enterprise logistics
              </h2>
              <div className="lg:col-span-7">
                <p className={BODY}>
                  SCHENKER is a desktop shipping management platform built for operational logistics tasks. The system brings together shipment creation, sender and receiver data, package setup, labels and tracking, packing lists, waybills, settings, and technical tools inside one workflow.
                </p>
                <p className={`mt-5 ${BODY} !text-[#9DA0AE]`}>
                  The goal was to make this complexity feel clear, structured, and manageable in daily use, a product built for real operations, not just presentation.
                </p>
              </div>
            </div>

            <dl className="mt-16 lg:mt-24 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
              {[
                { value: '9', label: 'Modules', sub: 'Product Areas' },
                { value: '5', label: 'Shipment Steps', sub: 'Multi-step flow' },
                { value: '3', label: 'Document Types', sub: 'Labels · Lists · Waybills' },
                { value: '1', label: 'Platform', sub: 'Desktop App' },
              ].map((m) => (
                <div key={m.label} className={`flex flex-col border-t ${RULE} pt-6`}>
                  <dt className="order-2 mt-4 text-[16px] text-[#E6E7EB]">{m.label}</dt>
                  <dd className="order-1 text-[clamp(3rem,2.2rem+3vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-[#F2F3F5]" style={HEAD}>
                    {m.value}
                  </dd>
                  <dd className={`order-3 mt-1 ${CAPTION}`}>{m.sub}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ─── CHALLENGE & SOLUTION ─────────────────────────────────────── */}
        <section id="challenge" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="02" label="Challenge & solution" asHeading />
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-0">
              {[
                {
                  title: 'The Challenge',
                  intro: 'Enterprise logistics systems become difficult to use because they combine many repetitive, detail-heavy tasks in one place.',
                  items: ['Multi-step shipment setup complexity', 'Large amounts of form input', 'Document-heavy workflows', 'Need for operational speed', 'Technical setup & configuration'],
                  mark: '✕', markClass: 'text-[#9295A6]', col: 'lg:pr-12',
                },
                {
                  title: 'The Solution',
                  intro: 'A clear, modular interface with strong workflow thinking, structured form design, and consistency across complex modules.',
                  items: ['Step-based shipment creation flow', 'Grouped & scannable form fields', 'Consistent table-based document views', 'Strong side navigation structure', 'Separated operational & technical areas'],
                  mark: '✓', markClass: 'text-[#8FBC3B]', col: `lg:pl-12 lg:border-l ${RULE}`,
                },
              ].map((block) => (
                <div key={block.title} className={block.col}>
                  <h3 className={H3} style={HEAD}>{block.title}</h3>
                  <p className={`mt-4 ${BODY}`}>{block.intro}</p>
                  <ul className={`mt-8 border-t ${RULE}`}>
                    {block.items.map((item) => (
                      <li key={item} className={`flex items-baseline gap-3 border-b ${RULE} py-3.5 text-[16px] text-[#D3D5DC]`}>
                        <span aria-hidden="true" className={`w-4 shrink-0 text-[12px] ${block.markClass}`}>{block.mark}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Friction → Flow */}
            <div className="mt-20 lg:mt-28 overflow-hidden rounded-2xl bg-[#0E1116] ring-1 ring-white/[0.06]">
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-[14px] text-[#8FBC3B]">Friction → Flow</p>
                <h3 className={`mt-3 ${H3}`} style={HEAD}>Four principles, applied to enterprise complexity</h3>
              </div>
              <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: 'Step', practice: 'Break long flows into stages', outcome: 'Cognitive load down ~60%' },
                  { name: 'Group', practice: 'Cluster fields by semantic intent', outcome: 'Scannable forms · fewer errors' },
                  { name: 'Table', practice: 'Document workflows in dense tables', outcome: 'Bulk operations enabled' },
                  { name: 'Separate', practice: 'Operational vs technical zones', outcome: 'Right user · right tools' },
                ].map((p, i) => (
                  <div key={p.name} className="flex flex-col bg-[#0E1116] p-6 sm:p-8 lg:p-10">
                    <span className="font-mono text-[13px] text-[#9295A6]">0{i + 1}</span>
                    <h4 className="mt-6 lg:mt-10 text-[20px] font-semibold text-[#F2F3F5]" style={HEAD}>{p.name}</h4>
                    <p className="mt-2 text-[15px] leading-[1.55] text-[#BCBFCA]">{p.practice}</p>
                    <p className="mt-auto pt-6 text-[14px] text-[#8FBC3B]">{p.outcome}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-white/[0.06] px-6 py-5 sm:px-8 lg:px-10">
                <span className={CAPTION}>Complexity controlled across</span>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[14px] text-[#9295A6]">
                  {[['9+', 'screens'], ['47', 'fields'], ['7', 'modules']].map(([n, l]) => (
                    <span key={l}>
                      <span className="mr-1.5 text-[18px] font-semibold text-[#F2F3F5]" style={HEAD}>{n}</span>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRODUCT STRUCTURE ─────────────────────────────────────────── */}
        <section id="structure" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="03" label="Product structure" />
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>Modular architecture</h2>
              <ol className={`border-t ${RULE} lg:col-span-7`}>
                {[
                  { num: '01', title: 'Sendung', desc: 'Shipment creation' },
                  { num: '02', title: 'Labels', desc: 'Labels & Tracking' },
                  { num: '03', title: 'Ladeliste', desc: 'Packing lists' },
                  { num: '04', title: 'Frachtbrief', desc: 'Waybills' },
                  { num: '05', title: 'Einstellungen', desc: 'Settings' },
                  { num: '06', title: 'Help', desc: 'Documentation' },
                  { num: '07', title: 'Entwickler', desc: 'Developer tools' },
                ].map((m) => (
                  <li key={m.num} className={`grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 border-b ${RULE} py-5 sm:grid-cols-[3rem_1fr_auto]`}>
                    <span className="font-mono text-[13px] text-[#8FBC3B]">{m.num}</span>
                    <span lang="de" className="text-[20px] lg:text-[24px] font-semibold tracking-[-0.01em] text-[#F2F3F5]" style={HEAD}>{m.title}</span>
                    <span className={`col-start-2 mt-1 sm:col-start-3 sm:mt-0 sm:text-right ${CAPTION} !text-[15px]`}>{m.desc}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─── SHIPMENT FLOW ───────────────────────────────────────────── */}
        <section id="flow" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="04" label="Shipment flow" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>Step-based shipment creation</h2>
              <p className={`${BODY} lg:col-span-7 lg:pt-2`}>
                Instead of placing everything on one screen, the flow is divided into clear steps that reduce cognitive load and make complex data entry easier to complete.
              </p>
            </div>
            <ShipmentFlow steps={flowSteps} />
          </div>
        </section>

        {/* ─── KEY SCREENS ──────────────────────────────────────────────── */}
        <section id="screens" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="05" label="Key screens" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>Every module, designed</h2>
              <p className={`${BODY} lg:col-span-7 lg:pt-2`}>
                From shipment data to technical settings, each screen follows the same design language with consistent spacing, layout, and interaction patterns.
              </p>
            </div>

            <div className="mt-16 lg:mt-24 space-y-24 lg:space-y-36">
              {keyScreens.map((s) => (
                <article key={s.num}>
                  <ScreenReveal>
                    <BrowserFrame url={`schenkerclient/${s.title.toLowerCase().replace(/ä/g, 'ae').replace(/ü/g, 'ue').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                      <Shot src={s.src} alt={s.title} />
                    </BrowserFrame>
                  </ScreenReveal>
                  <div className="mt-8 lg:mt-10 grid gap-3 lg:grid-cols-12 lg:gap-12">
                    <div className="flex items-baseline gap-4 lg:col-span-5">
                      <span className="font-mono text-[14px] text-[#8FBC3B]">{s.num}</span>
                      <h3 className={H3} style={HEAD}>{s.title}</h3>
                    </div>
                    <div className="lg:col-span-7">
                      <p className={`${BODY} !max-w-[52ch]`}>{s.desc}</p>
                      <p className={`mt-3 ${CAPTION}`}>{s.tags.join('  ·  ')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DOCUMENT WORKFLOWS ───────────────────────────────────────── */}
        <section id="documents" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="06" label="Document workflows" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>Structured table views</h2>
              <p className={`${BODY} lg:col-span-7 lg:pt-2`}>
                Labels, packing lists, and waybills rely on structured table views that support quick review, editing, downloading, and deletion. Consistency across these modules helps the system feel more stable.
              </p>
            </div>
            <div className="mt-16 lg:mt-24 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
              {documents.map((d) => (
                <article key={d.label}>
                  <ScreenReveal from={0.95}>
                    <BrowserFrame url={d.url}>
                      <Shot src={d.src} alt={d.label} sizes="half" />
                    </BrowserFrame>
                  </ScreenReveal>
                  <h3 className="mt-6 text-[19px] lg:text-[20px] font-semibold text-[#F2F3F5]" style={HEAD}>{d.label}</h3>
                  <p className="mt-2 max-w-[48ch] text-[16px] leading-[1.6] text-[#A9ACB9]">{d.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── DESIGN APPROACH ──────────────────────────────────────────── */}
        <section id="approach" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="07" label="Design approach" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>Clarity over decoration</h2>
              <p className={`${BODY} lg:col-span-7 lg:pt-2`}>
                The interface is built around clarity and operational speed. Its strength comes from structure, not excess.
              </p>
            </div>

            <dl className="mt-16 lg:mt-20 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
              {[
                { title: 'Navigation', desc: 'Strong side navigation' },
                { title: 'Surfaces', desc: 'Large structured areas' },
                { title: 'Progression', desc: 'Tab-based flow steps' },
                { title: 'Actions', desc: 'Clear primary & destructive' },
              ].map((item) => (
                <div key={item.title} className={`border-t ${RULE} pt-5`}>
                  <dt className="text-[18px] font-semibold text-[#F2F3F5]" style={HEAD}>{item.title}</dt>
                  <dd className="mt-1.5 text-[15px] leading-[1.5] text-[#A9ACB9]">{item.desc}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-20 lg:mt-28 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h3 className={`${H3} lg:col-span-5`} style={HEAD}>What makes this work stand out</h3>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-7">
                {[
                  'Strong workflow thinking',
                  'Clear information architecture',
                  'Structured form design',
                  'Consistency across complex modules',
                  'Usability for repeated daily tasks',
                  'Operational & technical support in one product',
                ].map((point) => (
                  <li key={point} className={`flex items-baseline gap-3 border-t ${RULE} py-4 text-[16px] text-[#D3D5DC]`}>
                    <span aria-hidden="true" className="w-4 shrink-0 text-[12px] text-[#8FBC3B]">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── OUTCOME ─────────────────────────────────────────────────── */}
        <section id="outcome" className={`${SECTION} !pb-28 lg:!pb-40`}>
          <div className={WRAP}>
            <Chapter number="08" label="Outcome" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <h2 className={`${H2} lg:col-span-5`} style={HEAD}>A clearer enterprise interface</h2>
              <div className="lg:col-span-7 lg:pt-2">
                <p className={BODY}>
                  By breaking complex workflows into focused modules and step-based screens, the platform becomes easier to navigate, easier to complete, and more useful in real working conditions.
                </p>
                <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
                  {['Enterprise workflows', 'Complex form systems', 'Document-heavy interfaces', 'Clarity under operational complexity'].map((tag) => (
                    <li key={tag} className={`flex items-baseline gap-3 border-t ${RULE} py-4 text-[16px] text-[#D3D5DC]`}>
                      <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-4px] bg-[#8FBC3B]" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <NextProjectRecommendation currentProject="schenker" />
      </main>
    </div>
  );
}
