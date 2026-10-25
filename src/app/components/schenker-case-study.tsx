import { Children, useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
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
import {
  RevealLines,
  Rise,
  TiltIn,
  ClipReveal,
  CountUp,
  DrawRule,
  Marquee,
  ReadProgress,
} from './case-motion';
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
/*
 * Type scale. Only the hero title is display-sized; everything else steps
 * down clearly so the hierarchy reads at a glance.
 *   Display (h1)   44 → 92px
 *   Chapter (h2)   28 → 36px
 *   Sub (h3)       18 → 20px
 *   Lead           17px / 1.65
 *   Body           15px / 1.7, muted
 *   Caption/label  12–13px
 */
const H2 = 'text-[clamp(1.75rem,1.25rem+1.35vw,2.25rem)] leading-[1.12] tracking-[-0.02em] font-semibold text-[#F2F3F5]';
const H3 = 'text-[18px] lg:text-[20px] leading-[1.3] tracking-[-0.01em] font-semibold text-[#F2F3F5]';
const LEAD = 'text-[17px] leading-[1.65] text-[#C3C6D0]';
const BODY = 'text-[15px] leading-[1.7] text-[#A9ACB9]';
const CAPTION = 'text-[13px] leading-[1.55] text-[#8C8FA0]';
const LABEL = 'text-[12px] leading-none tracking-[0.02em]';
// Justified column text (English): hyphenated, last line ragged
const JUSTIFY = 'text-justify hyphens-auto [text-align-last:left]';
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

/* ─── Motion gate for this file's own scroll effects ─────────────── */
function useScrollMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduce;
}

/* ─── Browser frame ─────────────────────────────────────────────── */
const BrowserFrame = ({ url, children, className = '', flat = false }: { url: string; children: ReactNode; className?: string; flat?: boolean }) => (
  <div
    className={`overflow-hidden rounded-xl lg:rounded-2xl bg-[#0E1116] ring-1 ring-white/[0.08] ${flat ? '' : 'shadow-[0_48px_96px_-40px_rgba(0,0,0,0.85),0_16px_32px_-16px_rgba(0,0,0,0.6)]'} ${className}`}
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

/* Big screens alternate between the two reveal styles */
const ScreenMotion = ({ kind, children }: { kind: 'tilt' | 'clip'; children: ReactNode }) =>
  kind === 'tilt' ? <TiltIn>{children}</TiltIn> : <ClipReveal>{children}</ClipReveal>;

const Shot = ({ src, alt, sizes = 'wide', eager = false }: { src: string; alt: string; sizes?: 'wide' | 'half' | 'card'; eager?: boolean }) => {
  const props =
    sizes === 'half'
      ? responsive(src, [480, 720, 960, 1280], '(min-width: 1280px) 560px, (min-width: 768px) 46vw, 92vw')
      : sizes === 'card'
        ? responsive(src, [480, 720, 960, 1440], '(min-width: 1024px) 46vw, 82vw')
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

/* ─── Chapter label: the rule draws itself, then the label ─────── */
const Chapter = ({ number, label, asHeading = false, className = 'mb-10 lg:mb-14' }: { number: string; label: string; asHeading?: boolean; className?: string }) => {
  const Tag = asHeading ? 'h2' : 'p';
  return (
    <div className={className}>
      <DrawRule />
      <Tag className={`mt-5 flex items-baseline gap-3 ${LABEL} font-normal`}>
        <span className="font-mono text-[#8FBC3B]">{number}</span>
        <span className="text-[#9295A6]">{label}</span>
      </Tag>
    </div>
  );
};

/* Chapter heading: lines slide up out of a mask */
const ChapterTitle = ({ lines, className = '' }: { lines: string[]; className?: string }) => (
  <RevealLines as="h2" className={`${H2} ${className}`} style={HEAD}>
    {lines.map((l) => <span key={l}>{l}</span>)}
  </RevealLines>
);

/* ─── Story line: colour brightens as it reaches reading height ─── */
const StoryLine = ({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const enabled = useScrollMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.55'] });
  const color = useTransform(scrollYProgress, [0, 1], ['#7E8191', '#F2F3F5']);
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
                  <span className={`font-mono ${LABEL} transition-colors duration-500 text-[#8FBC3B] ${isActive ? '' : 'motion-safe:lg:text-[#6E7180]'}`}>
                    {step.num}
                  </span>
                  <span
                    className={`h-px bg-[#8FBC3B]/70 transition-[width,background-color] duration-700 w-12 ${isActive ? 'motion-safe:lg:w-24' : 'motion-safe:lg:bg-white/10'}`}
                  />
                </div>
                <h3
                  className={`${H3} transition-colors duration-500 ${isActive ? '' : 'motion-safe:lg:!text-[#7C7F8E]'}`}
                  style={HEAD}
                >
                  <span className="sr-only">Step {step.num}: </span>
                  {step.title}
                </h3>
                <p lang="en" className={`mt-3 max-w-[42ch] ${BODY} ${JUSTIFY}`}>{step.desc}</p>
                <p className={`mt-4 ${CAPTION}`}>{step.tags.join('  ·  ')}</p>
                {/* Stacked layout: the screen sits under its step */}
                <div className="mt-10 motion-safe:lg:hidden">
                  <ScreenMotion kind={i % 2 ? 'tilt' : 'clip'}>
                    <BrowserFrame url={step.url} flat={i % 2 === 0}>
                      <Shot src={step.src} alt={step.title} />
                    </BrowserFrame>
                  </ScreenMotion>
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
            <div className="relative aspect-[16/10] overflow-hidden">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  aria-hidden={i !== active}
                  className="absolute inset-0 transition-[opacity,transform,clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? 'none' : `translateY(${i < active ? -24 : 24}px) scale(1.03)`,
                  }}
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
          <div className={`mt-5 flex items-center gap-4 ${LABEL} text-[#9295A6]`} aria-hidden="true">
            <span className="font-mono tabular-nums text-[#F2F3F5]">{steps[active].num}</span>
            <span className="font-mono">/ {String(steps.length).padStart(2, '0')}</span>
            <div className="flex flex-1 gap-1.5">
              {steps.map((s, i) => (
                <span key={s.num} className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="absolute inset-0 origin-left bg-[#8FBC3B] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Pinned sideways tour (local adaptation of HorizontalGallery) ──
   Same behaviour as the shared HorizontalGallery, adapted for this
   page: one DOM tree in both modes, so the scroll target is always
   mounted (the shared version starts useScroll before its pinned
   wrapper exists and ends up tracking whole-page progress), and the
   first card lines up with the page container's measured left edge. */
const PinnedGallery = ({ header, children, cardClassName }: { header: ReactNode; children: ReactNode; cardClassName: string }) => {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [dist, setDist] = useState(0);
  const [pad, setPad] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setWide(mq.matches);
      const e = edge.current;
      if (e) setPad(e.getBoundingClientRect().left + parseFloat(getComputedStyle(e).paddingLeft));
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - document.documentElement.clientWidth));
    };
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(update) : null;
    if (track.current && ro) ro.observe(track.current);
    return () => { mq.removeEventListener('change', update); window.removeEventListener('resize', update); ro?.disconnect(); };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const pinned = wide && !reduce && dist > 0;

  return (
    <div ref={outer} style={pinned ? { height: `calc(100svh + ${dist}px)` } : undefined}>
      <div className={pinned ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16' : ''}>
        <div ref={edge} className={WRAP} aria-hidden="true" />
        {header}
        <motion.div
          ref={track}
          style={pinned ? { x, paddingLeft: pad, paddingRight: pad } : pad ? { paddingLeft: pad, paddingRight: pad, scrollPaddingLeft: pad } : undefined}
          className={
            pinned
              ? 'flex w-max gap-8 will-change-transform'
              : 'flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:px-8 md:gap-6 md:px-20 [scrollbar-width:thin] scroll-px-6 sm:scroll-px-8 md:scroll-px-20'
          }
        >
          {items.map((c, i) => (
            <div key={i} className={`shrink-0 snap-start ${cardClassName}`}>{c}</div>
          ))}
        </motion.div>
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

  const slug = (t: string) =>
    t.toLowerCase().replace(/ä/g, 'ae').replace(/ü/g, 'ue').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="relative min-h-screen bg-[#080B0F] text-white antialiased" style={{ fontFamily: BRAND.bodyFont }}>
      <style>{HERO_CSS}</style>
      <SchenkerSEO />
      <CaseHeroTarget path="/projects/schenker" />
      <ReadProgress color={BRAND.oliveLight} />
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
              <p className={`lg:col-span-5 max-w-[44ch] ${LEAD}`}>
                Simplifying a complex shipping workflow, designing a structured logistics interface for shipment creation, document handling, and operational efficiency.
              </p>
              <dl className="lg:col-span-5 lg:col-start-8 grid grid-cols-2 gap-x-6 gap-y-5 self-end">
                {[
                  ['Discipline', 'UI/UX Design'],
                  ['Domain', 'Enterprise logistics'],
                  ['Platform', 'Desktop app'],
                  ['Focus', 'Form systems'],
                ].map(([k, v]) => (
                  <div key={k} className={`border-t ${RULE} pt-3`}>
                    <dt className={`${LABEL} text-[#8C8FA0]`}>{k}</dt>
                    <dd className="mt-1.5 text-[14px] text-[#E6E7EB]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="sk-screen sk-d4 mt-14 lg:mt-20">
              <TiltIn>
                <BrowserFrame url="schenkerclient.cubsten.com">
                  <Shot src={screenSendungEmpfanger} alt="Schenker, Sendung" eager />
                </BrowserFrame>
              </TiltIn>
            </div>
          </div>
        </section>

        {/* ─── STORYTELLING: Hook → Friction → Pivot → Proof ──────────── */}
        <section id="story" className={SECTION}>
          <div className={WRAP}>
            <h2 className="sr-only">The story in four steps</h2>
            <DrawRule />
            <ol className="grid gap-x-12 md:grid-cols-2">
              {[
                { step: 'Hook', number: '00.1', text: 'What if enterprise logistics software could feel intuitive, not like a spreadsheet with buttons?' },
                { step: 'Friction', number: '00.2', text: 'Schenker\'s internal tools drowned operators in form complexity, scattered workflows, and inconsistent UI patterns. Training costs soared. Error rates climbed.' },
                { step: 'Pivot', number: '00.3', text: 'We unified shipment creation, label management, and settings into one coherent design language, progressive disclosure over cognitive overload.' },
                { step: 'Proof', number: '00.4', text: 'Desktop-first enterprise platform. Streamlined multi-step forms. Contextual help system. One design system for the entire logistics workflow.' },
              ].map((item, i) => (
                <li key={item.step} className={`border-b ${RULE} py-10 lg:py-12`}>
                  <div className={`flex items-baseline gap-3 ${LABEL}`}>
                    <span className="font-mono text-[#8FBC3B]">{item.number}</span>
                    <span className="text-[#9295A6]">{item.step}</span>
                  </div>
                  <StoryLine
                    className={`mt-5 max-w-[34ch] text-[19px] sm:text-[21px] lg:text-[24px] leading-[1.38] tracking-[-0.01em] ${i === 0 ? 'font-semibold' : 'font-medium'}`}
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
              <ChapterTitle className="lg:col-span-4" lines={['Designing clarity', 'for enterprise logistics']} />
              <Rise className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:col-span-7 lg:col-start-6">
                <p lang="en" className={`${BODY} ${JUSTIFY}`}>
                  SCHENKER is a desktop shipping management platform built for operational logistics tasks. The system brings together shipment creation, sender and receiver data, package setup, labels and tracking, packing lists, waybills, settings, and technical tools inside one workflow.
                </p>
                <p lang="en" className={`${BODY} ${JUSTIFY}`}>
                  The goal was to make this complexity feel clear, structured, and manageable in daily use, a product built for real operations, not just presentation.
                </p>
              </Rise>
            </div>

            <dl className="mt-16 lg:mt-24 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
              {[
                { value: '9', label: 'Modules', sub: 'Product Areas' },
                { value: '5', label: 'Shipment Steps', sub: 'Multi-step flow' },
                { value: '3', label: 'Document Types', sub: 'Labels · Lists · Waybills' },
                { value: '1', label: 'Platform', sub: 'Desktop App' },
              ].map((m) => (
                <div key={m.label} className={`flex flex-col border-t ${RULE}`}>
                  <dt className="order-2 mt-4 text-[14px] text-[#E6E7EB]">{m.label}</dt>
                  <dd className="order-1 mt-6 text-[clamp(2.75rem,2rem+2.6vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-[#F2F3F5]" style={HEAD}>
                    <CountUp value={m.value} />
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
                  mark: '✕', markClass: 'text-[#8C8FA0]', col: 'lg:pr-12',
                },
                {
                  title: 'The Solution',
                  intro: 'A clear, modular interface with strong workflow thinking, structured form design, and consistency across complex modules.',
                  items: ['Step-based shipment creation flow', 'Grouped & scannable form fields', 'Consistent table-based document views', 'Strong side navigation structure', 'Separated operational & technical areas'],
                  mark: '✓', markClass: 'text-[#8FBC3B]', col: `lg:pl-12 lg:border-l ${RULE}`,
                },
              ].map((block, bi) => (
                <div key={block.title} className={block.col}>
                  <RevealLines as="h3" className={H3} style={HEAD} delay={bi * 0.08}>
                    <span>{block.title}</span>
                  </RevealLines>
                  <p lang="en" className={`mt-3 max-w-[44ch] ${BODY} ${JUSTIFY}`}>{block.intro}</p>
                  <Rise delay={0.1 + bi * 0.08}>
                    <ul className={`mt-8 border-t ${RULE}`}>
                      {block.items.map((item) => (
                        <li key={item} className={`flex items-baseline gap-3 border-b ${RULE} py-3 text-[14px] text-[#C9CBD3]`}>
                          <span aria-hidden="true" className={`w-4 shrink-0 text-[11px] ${block.markClass}`}>{block.mark}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Rise>
                </div>
              ))}
            </div>

            {/* Friction → Flow */}
            <Rise className="mt-20 lg:mt-28">
              <div className="overflow-hidden rounded-2xl bg-[#0E1116] ring-1 ring-white/[0.06]">
                <div className="p-6 sm:p-8 lg:p-10">
                  <p className={`${LABEL} text-[#8FBC3B]`}>Friction → Flow</p>
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
                      <span className={`font-mono ${LABEL} text-[#8C8FA0]`}>0{i + 1}</span>
                      <h4 className="mt-6 lg:mt-10 text-[17px] font-semibold text-[#F2F3F5]" style={HEAD}>{p.name}</h4>
                      <p className="mt-2 text-[14px] leading-[1.6] text-[#A9ACB9]">{p.practice}</p>
                      <p className="mt-auto pt-6 text-[13px] text-[#8FBC3B]">{p.outcome}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-white/[0.06] px-6 py-5 sm:px-8 lg:px-10">
                  <span className={CAPTION}>Complexity controlled across</span>
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[13px] text-[#8C8FA0]">
                    {[['9+', 'screens'], ['47', 'fields'], ['7', 'modules']].map(([n, l]) => (
                      <span key={l}>
                        <CountUp value={n} className="mr-1.5 text-[18px] font-semibold text-[#F2F3F5]" />
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Rise>
          </div>
        </section>

        {/* ─── PRODUCT STRUCTURE ─────────────────────────────────────────── */}
        <section id="structure" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="03" label="Product structure" />
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <ChapterTitle className="lg:col-span-4" lines={['Modular', 'architecture']} />
              <Rise className="lg:col-span-7 lg:col-start-6">
                <ol className={`border-t ${RULE}`}>
                  {[
                    { num: '01', title: 'Sendung', desc: 'Shipment creation' },
                    { num: '02', title: 'Labels', desc: 'Labels & Tracking' },
                    { num: '03', title: 'Ladeliste', desc: 'Packing lists' },
                    { num: '04', title: 'Frachtbrief', desc: 'Waybills' },
                    { num: '05', title: 'Einstellungen', desc: 'Settings' },
                    { num: '06', title: 'Help', desc: 'Documentation' },
                    { num: '07', title: 'Entwickler', desc: 'Developer tools' },
                  ].map((m) => (
                    <li key={m.num} className={`group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b ${RULE} py-4 sm:grid-cols-[2.75rem_1fr_auto]`}>
                      <span className={`font-mono ${LABEL} text-[#8FBC3B]`}>{m.num}</span>
                      <span lang="de" className="text-[17px] lg:text-[18px] font-semibold text-[#F2F3F5]" style={HEAD}>{m.title}</span>
                      <span className={`col-start-2 mt-1 sm:col-start-3 sm:mt-0 sm:text-right ${CAPTION}`}>{m.desc}</span>
                    </li>
                  ))}
                </ol>
              </Rise>
            </div>
          </div>
        </section>

        {/* ─── Interlude: the product's own vocabulary ────────────────── */}
        <div className={`border-y ${RULE} py-8 lg:py-10`}>
          <Marquee
            speed={48}
            className="text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] font-semibold tracking-[-0.02em] text-white/[0.22]"
            items={['Sendung', 'Labels & Tracking', 'Ladeliste', 'Frachtbrief', 'Einstellungen', 'Entwickler', 'UI/UX Design', 'Form Systems', 'Desktop App', 'Enterprise Logistics']}
          />
        </div>

        {/* ─── SHIPMENT FLOW ───────────────────────────────────────────── */}
        <section id="flow" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="04" label="Shipment flow" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <ChapterTitle className="lg:col-span-4" lines={['Step-based', 'shipment creation']} />
              <Rise className="lg:col-span-7 lg:col-start-6">
                <p lang="en" className={`max-w-[44ch] ${LEAD}`}>
                  Instead of placing everything on one screen, the flow is divided into clear steps that reduce cognitive load and make complex data entry easier to complete.
                </p>
              </Rise>
            </div>
            <ShipmentFlow steps={flowSteps} />
          </div>
        </section>

        {/* ─── KEY SCREENS: pinned sideways tour ───────────────────────── */}
        <section id="screens" className="scroll-mt-16 pt-20 sm:pt-24 lg:pt-32 pb-12 lg:pb-16">
          <PinnedGallery
            cardClassName="w-[84vw] sm:w-[68vw] lg:w-[min(44vw,700px,calc((100svh_-_440px)_*_1.6))]"
            header={
              <div className={`${WRAP} mb-8 lg:mb-10`}>
                <Chapter number="05" label="Key screens" className="mb-6 lg:mb-8" />
                <div className="grid gap-5 lg:grid-cols-12 lg:gap-12">
                  <ChapterTitle className="lg:col-span-4" lines={['Every module,', 'designed']} />
                  <p lang="en" className={`max-w-[44ch] lg:col-span-7 lg:col-start-6 ${BODY} ${JUSTIFY}`}>
                    From shipment data to technical settings, each screen follows the same design language with consistent spacing, layout, and interaction patterns.
                  </p>
                </div>
              </div>
            }
          >
            {keyScreens.map((s) => (
              <article key={s.num} className="h-full">
                <BrowserFrame url={`schenkerclient/${slug(s.title)}`} flat>
                  <Shot src={s.src} alt={s.title} sizes="card" />
                </BrowserFrame>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className={`font-mono ${LABEL} text-[#8FBC3B]`}>{s.num}</span>
                  <h3 className={H3} style={HEAD}>{s.title}</h3>
                </div>
                <p className={`mt-2 max-w-[52ch] ${BODY}`}>{s.desc}</p>
                <p className={`mt-2 ${CAPTION}`}>{s.tags.join('  ·  ')}</p>
              </article>
            ))}
          </PinnedGallery>
        </section>

        {/* ─── DOCUMENT WORKFLOWS ───────────────────────────────────────── */}
        <section id="documents" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="06" label="Document workflows" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <ChapterTitle className="lg:col-span-4" lines={['Structured', 'table views']} />
              <Rise className="lg:col-span-7 lg:col-start-6">
                <p lang="en" className={`${BODY} ${JUSTIFY} sm:columns-2 sm:gap-10`}>
                  Labels, packing lists, and waybills rely on structured table views that support quick review, editing, downloading, and deletion. Consistency across these modules helps the system feel more stable.
                </p>
              </Rise>
            </div>
            <div className="mt-16 lg:mt-24 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
              {documents.map((d, i) => {
                // Row 1 opens from a window, row 2 tips up: the rhythm varies
                const kind = i < 2 ? 'clip' : 'tilt';
                return (
                  <article key={d.label}>
                    <ScreenMotion kind={kind}>
                      <BrowserFrame url={d.url} flat={kind === 'clip'}>
                        <Shot src={d.src} alt={d.label} sizes="half" />
                      </BrowserFrame>
                    </ScreenMotion>
                    <h3 className={`mt-6 ${H3}`} style={HEAD}>{d.label}</h3>
                    <p className={`mt-2 max-w-[46ch] ${BODY}`}>{d.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── DESIGN APPROACH ──────────────────────────────────────────── */}
        <section id="approach" className={SECTION}>
          <div className={WRAP}>
            <Chapter number="07" label="Design approach" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <ChapterTitle className="lg:col-span-4" lines={['Clarity over', 'decoration']} />
              <Rise className="lg:col-span-7 lg:col-start-6">
                <p className={`max-w-[44ch] ${LEAD}`}>
                  The interface is built around clarity and operational speed. Its strength comes from structure, not excess.
                </p>
              </Rise>
            </div>

            <Rise className="mt-16 lg:mt-20">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
                {[
                  { title: 'Navigation', desc: 'Strong side navigation' },
                  { title: 'Surfaces', desc: 'Large structured areas' },
                  { title: 'Progression', desc: 'Tab-based flow steps' },
                  { title: 'Actions', desc: 'Clear primary & destructive' },
                ].map((item) => (
                  <div key={item.title} className={`border-t ${RULE} pt-5`}>
                    <dt className="text-[16px] font-semibold text-[#F2F3F5]" style={HEAD}>{item.title}</dt>
                    <dd className={`mt-1.5 ${CAPTION}`}>{item.desc}</dd>
                  </div>
                ))}
              </dl>
            </Rise>

            <div className="mt-20 lg:mt-28 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <RevealLines as="h3" className={`${H3} lg:col-span-4`} style={HEAD}>
                <span>What makes this work</span>
                <span>stand out</span>
              </RevealLines>
              <Rise className="lg:col-span-7 lg:col-start-6">
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {[
                    'Strong workflow thinking',
                    'Clear information architecture',
                    'Structured form design',
                    'Consistency across complex modules',
                    'Usability for repeated daily tasks',
                    'Operational & technical support in one product',
                  ].map((point) => (
                    <li key={point} className={`flex items-baseline gap-3 border-t ${RULE} py-3.5 text-[14px] text-[#C9CBD3]`}>
                      <span aria-hidden="true" className="w-4 shrink-0 text-[11px] text-[#8FBC3B]">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Rise>
            </div>
          </div>
        </section>

        {/* ─── OUTCOME ─────────────────────────────────────────────────── */}
        <section id="outcome" className={`${SECTION} !pb-28 lg:!pb-40`}>
          <div className={WRAP}>
            <Chapter number="08" label="Outcome" />
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <ChapterTitle className="lg:col-span-4" lines={['A clearer', 'enterprise interface']} />
              <div className="lg:col-span-7 lg:col-start-6">
                <Rise>
                  <p lang="en" className={`max-w-[44ch] ${LEAD}`}>
                    By breaking complex workflows into focused modules and step-based screens, the platform becomes easier to navigate, easier to complete, and more useful in real working conditions.
                  </p>
                </Rise>
                <Rise delay={0.1}>
                  <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
                    {['Enterprise workflows', 'Complex form systems', 'Document-heavy interfaces', 'Clarity under operational complexity'].map((tag) => (
                      <li key={tag} className={`flex items-baseline gap-3 border-t ${RULE} py-3.5 text-[14px] text-[#C9CBD3]`}>
                        <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-4px] bg-[#8FBC3B]" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Rise>
              </div>
            </div>
          </div>
        </section>

        <NextProjectRecommendation currentProject="schenker" />
      </main>
    </div>
  );
}
