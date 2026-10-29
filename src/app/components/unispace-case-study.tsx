import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform, useReducedMotion,
  useSpring, type Variants,
} from 'motion/react';
import { useNavigate } from 'react-router';
import { CaseHeroTarget } from './case-transition';
import {
  ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Eye, Check,
  LayoutGrid, PenTool, BookOpen, Component,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { CaseStudySectionNav } from './case-study-nav';
import { UnispaceSEO } from './seo';
import { IMG, responsive } from '../lib/cld';
import {
  RevealLines, Rise, TiltIn, ClipReveal, CountUp, DrawRule, Marquee, ReadProgress,
} from './case-motion';

/* ─── Real Unispace product screenshots (Cloudinary) ──────────── */
const imgLogin        = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875718/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98_%E1%83%92%E1%83%95%E1%83%94%E1%83%A0%E1%83%93%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A8%E1%83%94%E1%83%A1%E1%83%95%E1%83%9A%E1%83%98%E1%83%A1%E1%83%90%E1%83%A1_uaosn1.png';
const imgFormsTable   = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875712/%E1%83%A8%E1%83%94%E1%83%95%E1%83%A1%E1%83%94%E1%83%91%E1%83%A3%E1%83%9A%E1%83%98_%E1%83%A4%E1%83%9D%E1%83%A0%E1%83%9B%E1%83%94%E1%83%91%E1%83%98%E1%83%A1_%E1%83%AA%E1%83%AE%E1%83%A0%E1%83%98%E1%83%9A%E1%83%98_jtudqc.png';
const imgRegister     = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875712/%E1%83%90%E1%83%AE%E1%83%90%E1%83%9A%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A0%E1%83%94%E1%83%92%E1%83%98%E1%83%A1%E1%83%A2%E1%83%A0%E1%83%90%E1%83%AA%E1%83%98%E1%83%90-%E1%83%A1%E1%83%A2%E1%83%A3%E1%83%93%E1%83%94%E1%83%9C%E1%83%A2%E1%83%98_error_vhhyi0.png';
const imgUploadFlow   = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875711/%E1%83%9E%E1%83%A0%E1%83%9D%E1%83%94%E1%83%A5%E1%83%A2%E1%83%98%E1%83%A1_%E1%83%90%E1%83%A2%E1%83%95%E1%83%98%E1%83%A0%E1%83%97%E1%83%95%E1%83%90_3_ewqkdw.png';
const imgUnilabLogo   = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779887428/241852566_416907023197215_4126473183608966576_n_ecyuw4.png';

/* ─── Project typography, single typeface ──────────────────────
 * Unispace's actual product typography is Noto Sans Georgian
 * (covers Georgian + Latin glyphs). Syne / Manrope are the
 * portfolio's typefaces, not the product's. Noto Sans Georgian is
 * loaded on this page only (see <link> below) so the type
 * specimen shows the real face, not a system fallback.
 * ────────────────────────────────────────────────────────────── */
const F_GE = '"Noto Sans Georgian", "Inter", sans-serif';

/* ─── Brand tokens ─────────────────────────────────────────────── */
const BRAND = {
  blue: '#3D82F6',
  blueLight: '#6BA4FF',
  headingFont: '"Syne", "Space Grotesk", sans-serif',
  bodyFont: '"Manrope", "Inter", sans-serif',
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Layout + type system ─────────────────────────────────────
 * Container: same as Aurum / Schenker (1232px incl. padding).
 * Section rhythm: 80 / 112 / 128px, a self-drawing hairline on top.
 * Type: only the hero title is display-sized (48-88).
 *   h2 28-36 · h3 18-20 · lead 17 / 1.65 · body 15 / 1.7 (muted)
 *   captions + labels 12-13. Long copy sits in 38-46ch justified
 *   columns; short lines stay left-aligned.
 * ────────────────────────────────────────────────────────────── */
const CONTAINER = 'mx-auto w-full max-w-[1232px] px-6 sm:px-8 md:px-20 xl:px-10';
const SECTION_Y = 'pt-16 md:pt-24 lg:pt-28 pb-20 md:pb-28 lg:pb-32';
const H2 = 'text-[clamp(1.75rem,1.4rem+1.1vw,2.25rem)] leading-[1.1] tracking-[-0.03em]';
const H3 = 'text-[clamp(1.125rem,1.05rem+0.3vw,1.25rem)] leading-[1.3] tracking-[-0.01em]';
const LEAD = 'text-[17px] leading-[1.65]';
const BODY = 'text-[15px] leading-[1.7]';
const JUSTIFY = 'md:text-justify hyphens-auto [text-align-last:left]'; // phones stay ragged-right: columns are too narrow to justify cleanly
const COL = 'max-w-[46ch]';
const FOCUS = 'focus-visible:!shadow-[0_0_0_2px_#6BA4FF] rounded-md';
const HEADING_STYLE = { fontFamily: BRAND.headingFont, fontWeight: 700 } as const;

/** Theme tokens. The product specimens stay dark in both themes. */
function useTokens() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return {
    isDark,
    page: isDark ? 'bg-[#090707] text-white' : 'bg-[#F3F3F3] text-zinc-900',
    heading: isDark ? 'text-white' : 'text-zinc-900',
    strong: isDark ? 'text-zinc-200' : 'text-zinc-800',
    body: isDark ? 'text-zinc-400' : 'text-zinc-600',
    muted: isDark ? 'text-[#9295A6]' : 'text-zinc-500',
    line: isDark ? 'border-white/[0.08]' : 'border-zinc-300/70',
    rule: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
    surface: isDark ? 'bg-[#121010] border-white/[0.07]' : 'bg-white border-zinc-200',
  };
}

/* ─── Building blocks ──────────────────────────────────────────── */

const Section = ({ id, children }: { id?: string; children: ReactNode }) => {
  const t = useTokens();
  return (
    <section id={id} className="scroll-mt-20">
      <div className={CONTAINER}>
        <DrawRule color={t.rule} />
        <div className={SECTION_Y}>{children}</div>
      </div>
    </section>
  );
};

/** English prose set in justified columns. `cols` splits one long text into two. */
const Prose = ({ children, cols = 1, lead = false, className = '' }: { children: ReactNode; cols?: 1 | 2; lead?: boolean; className?: string }) => {
  const t = useTokens();
  return (
    <div
      lang="en"
      className={`${lead ? LEAD : BODY} ${t.body} ${JUSTIFY} ${cols === 2 ? 'md:columns-2 md:gap-10 max-w-[46ch] md:max-w-[calc(92ch+2.5rem)]' : COL} [&>p+p]:mt-4 ${className}`}
    >
      {children}
    </div>
  );
};

/** Chapter opener: label + heading on the left, intro column on the right. */
const ChapterHeader = ({ number, label, lines, intro }: { number: string; label: string; lines: string[]; intro?: string }) => {
  const t = useTokens();
  return (
    <header className="mb-14 lg:mb-20 grid gap-8 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <Rise y={12}>
          <p className="flex items-baseline gap-3 mb-5 text-[12px]">
            <span className="font-mono text-[#6BA4FF]">{number}</span>
            <span className={`${t.muted} uppercase tracking-[0.14em]`}>{label}</span>
          </p>
        </Rise>
        <RevealLines as="h2" className={`${H2} ${t.heading}`} style={HEADING_STYLE}>
          {lines}
        </RevealLines>
      </div>
      {intro && (
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-9">
          <Rise delay={0.15}>
            <Prose lead><p>{intro}</p></Prose>
          </Rise>
        </div>
      )}
    </header>
  );
};

/** Design-system sub-section heading (6.1 - 6.6). */
const SpecHeader = ({ n, title, note }: { n: string; title: string; note?: string }) => {
  const t = useTokens();
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
      <h3 className={`flex items-baseline gap-3 ${H3} ${t.heading}`} style={HEADING_STYLE}>
        <span className="font-mono text-[12px] tracking-normal text-[#6BA4FF]">{n}</span>
        {title}
      </h3>
      {note && <p className={`text-[13px] ${t.muted}`}>{note}</p>}
    </div>
  );
};

/** Dark specimen card: the product is dark-first, so specimens stay dark. */
const Specimen = ({ children, className = '', ...rest }: { children: ReactNode; className?: string } & Record<string, unknown>) => (
  <div className={`rounded-2xl border border-white/[0.07] bg-[#0d0b0b] text-white overflow-hidden ${className}`} {...rest}>
    {children}
  </div>
);

/** Small mono annotation used inside specimens. */
const Annot = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`font-mono text-[11px] text-white/55 ${className}`}>{children}</div>
);

/** Product screenshot in a quiet browser frame, shown at its natural height. Motion comes from the wrapper. */
const ScreenFrame = ({
  src, alt, priority = false, sizes = '(min-width: 1232px) 800px, 92vw',
}: { src: string; alt: string; priority?: boolean; sizes?: string }) => (
  <div className="rounded-xl md:rounded-2xl overflow-hidden bg-[#141212] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_80px_-24px_rgba(0,0,0,0.65)]">
    <div className="h-7 md:h-9 flex items-center gap-1.5 px-3 md:px-4 border-b border-white/[0.06]" aria-hidden>
      <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/[0.14]" />
      <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/[0.14]" />
      <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white/[0.14]" />
    </div>
    <div className="bg-[#0f0d0d]">
      <img
        {...responsive(src, [640, 960, 1280, 1920], sizes)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        decoding="async"
        className="w-full h-auto block"
      />
    </div>
  </div>
);

/**
 * Screenshot + caption on the 12-column grid. The screen takes 8 columns,
 * the caption 4 (sticky on desktop); `flip` swaps sides so consecutive
 * screens alternate. `motion` picks the entrance: tilt or clip.
 */
const ScreenFigure = ({ src, alt, title, description, flip = false, effect }: {
  src: string; alt: string; title: string; description: string; flip?: boolean; effect: 'tilt' | 'clip';
}) => {
  const t = useTokens();
  const Wrap = effect === 'tilt' ? TiltIn : ClipReveal;
  return (
    <figure className="m-0 grid gap-6 lg:grid-cols-12 lg:gap-8 items-start">
      <div className={`lg:col-span-8 ${flip ? 'lg:col-start-5 lg:row-start-1' : ''}`}>
        <Wrap><ScreenFrame src={src} alt={alt} /></Wrap>
      </div>
      <figcaption className={`lg:col-span-4 lg:sticky lg:top-28 ${flip ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        <Rise>
          <h4 className={`${H3} mb-3 ${t.heading}`} style={HEADING_STYLE}>{title}</h4>
          <p lang="en" className={`${BODY} ${t.body} ${JUSTIFY} ${COL}`}>{description}</p>
        </Rise>
      </figcaption>
    </figure>
  );
};

const Stat = ({ n, label, size = 'md' }: { n: string; label: string; size?: 'md' | 'lg' }) => {
  const t = useTokens();
  return (
    <div>
      <div
        className={`${size === 'lg' ? 'text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)]' : 'text-[clamp(1.5rem,1.3rem+0.7vw,2rem)]'} leading-none tracking-[-0.04em] mb-2 ${t.heading}`}
        style={HEADING_STYLE}
      >
        <CountUp value={n} />
      </div>
      <div className={`text-[12px] leading-snug ${t.muted}`}>{label}</div>
    </div>
  );
};

/** Story statement that brightens as it reaches the reading line (scroll-linked, never below 0.32). */
const StoryStep = ({ number, step, text }: { number: string; step: string; text: string }) => {
  const t = useTokens();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.55'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.32, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { opacity }} className="grid gap-3 lg:grid-cols-12 lg:gap-8 py-7 lg:py-10">
      <p className="lg:col-span-3 flex items-baseline gap-3 text-[12px] lg:pt-1.5">
        <span className="font-mono text-[#6BA4FF]">{number}</span>
        <span className={`${t.muted} uppercase tracking-[0.14em]`}>{step}</span>
      </p>
      <p
        className={`lg:col-span-8 text-[clamp(1.25rem,1.05rem+0.75vw,1.75rem)] leading-[1.38] tracking-[-0.015em] max-w-[40ch] ${t.heading}`}
        style={{ fontFamily: BRAND.headingFont, fontWeight: 500 }}
      >
        {text}
      </p>
    </motion.div>
  );
};

/** Thin progress rail filled by scroll through its parent block. */
const ScrollRail = ({ target, axis = 'y' }: { target: React.RefObject<HTMLElement | null>; axis?: 'x' | 'y' }) => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: target as React.RefObject<HTMLElement>, offset: ['start 0.75', 'end 0.6'] });
  const s = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const style = reduce ? undefined : axis === 'y' ? { scaleY: s } : { scaleX: s };
  return (
    <div aria-hidden className={`absolute ${axis === 'y' ? 'left-0 top-0 bottom-0 w-px' : 'left-0 right-0 top-0 h-px'} bg-white/[0.08]`}>
      <motion.div style={style} className={`absolute inset-0 bg-[#3D82F6] ${axis === 'y' ? 'origin-top' : 'origin-left'}`} />
    </div>
  );
};

/* ─── Page chrome ──────────────────────────────────────────────── */

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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-24 md:bottom-8 right-5 md:right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-[#3D82F6] hover:bg-[#2f73e6] text-white shadow-lg shadow-black/40 transition-colors focus-visible:!shadow-[0_0_0_3px_#090707,0_0_0_5px_#6BA4FF]"
        >
          <ChevronUp size={20} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
/* ─── UNISPACE CASE STUDY PAGE ─────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'story',      label: 'Story' },
  { id: 'overview',   label: 'Overview' },
  { id: 'challenge',  label: 'Challenge' },
  { id: 'process',    label: 'Process' },
  { id: 'screens',    label: 'Screens' },
  { id: 'decisions',  label: 'Decisions' },
  { id: 'design',     label: 'Design System' },
  { id: 'outcome',    label: 'Outcome' },
  { id: 'reflection', label: 'Reflection' },
];

const STORY = [
  { step: 'Hook',     number: '00.1', text: 'What if a single platform could serve three completely different users, student, lecturer, admin, without ever making any of them feel like a secondary thought?' },
  { step: 'Friction', number: '00.2', text: 'Managing a university lab meant juggling spreadsheets, email chains, and disconnected tools. Students had no visibility, lecturers had no control, and admins had no oversight, all at once.' },
  { step: 'Pivot',    number: '00.3', text: "We designed Unispace around role-based clarity, one login, one design language, three distinct realities. No compromises, no role confusion, no 'which account is mine?'" },
  { step: 'Proof',    number: '00.4', text: '42+ screens, 38+ components, and a conditional form system that guided 17 edge cases without a single multi-step wizard, all delivered in 12 weeks.' },
];

const CHALLENGES = [
  {
    cTitle: 'Conditional form complexity',
    cBody: '12 base fields expanding into 4 distinct paths with 0-5 additional fields each. Designing one pattern to cover all cases without cognitive overload.',
    sTitle: 'Same-page progressive disclosure',
    sBody: 'Status fields expand inline below the dropdown, labeled as a distinct section. Users always see their position in the form with no multi-step wizard.',
  },
  {
    cTitle: 'Role asymmetry',
    cBody: 'Students self-register; lecturers are added by admin. A student who later becomes a lecturer has two separate accounts. The system had to communicate this clearly.',
    sTitle: 'Single login endpoint, role-based redirect',
    sBody: 'One login screen routes to the correct dashboard based on backend role. Role switching is documented as a tooltip, not a UI element.',
  },
  {
    cTitle: 'Certificate gating',
    cBody: "The certificate button is always visible but only activates when an admin uploads the certificate. Communicating a 'feature exists but isn't ready yet' state without frustrating users.",
    sTitle: 'Visible-disabled with tooltip',
    sBody: "Certificate button always rendered, opacity 40%, cursor: not-allowed, with tooltip: 'Available once your administrator uploads your certificate.'",
  },
  {
    cTitle: 'Public vs. private boundary',
    cBody: 'The portfolio page is a public shareable URL; the cabinet is fully private. One system, two access contexts, one coherent visual language.',
    sTitle: 'Dedicated public portfolio route',
    sBody: '/portfolio/[username] is a clean, minimal public page optimized for first impressions, no nav clutter, no login prompts. One-click copy button in the private cabinet.',
  },
  {
    cTitle: 'Verification flow edge cases',
    cBody: '5 distinct states: initial, auto-redirect (countdown), manual redirect, resend link, password recovery. Every state needed a clear action and fallback.',
    sTitle: 'Countdown + parallel CTA',
    sBody: 'Visual countdown timer (5 seconds) for auto-redirect, plus a manual "Go to Login" button. User stays in control regardless of their speed.',
  },
];

const PHASES = [
  { phase: 'Phase 01', weeks: 'Weeks 1-2',   title: 'Discover', items: ['Stakeholder interviews (Unilab team, 4 sessions)', 'Competitive audit of EdTech learning platforms, student portals, and online portfolio tools', 'Technical spec analysis', 'User role mapping (student, lecturer, admin)', '17 edge cases identified and documented'] },
  { phase: 'Phase 02', weeks: 'Weeks 3-4',   title: 'Define',   items: ['Information architecture (3 role-specific IA maps)', 'User flow mapping per role (9 flows total)', 'Conditional form logic matrix', 'State inventory: 12 states per key screen', 'Design principles established'] },
  { phase: 'Phase 03', weeks: 'Weeks 5-10',  title: 'Design',   items: ['Lo-fi wireframes (42 screens)', 'Dark design system, 38+ components built', 'High-fidelity screens (42 total, 3 roles)', 'Micro-interactions prototyped for key flows', 'Responsive adaptation (1440 / 768 / 375px)'] },
  { phase: 'Phase 04', weeks: 'Weeks 11-12', title: 'Deliver',  items: ['Usability testing: 8 participants, 2 rounds', '14 issues identified, 11 resolved pre-handoff', 'Dev handoff with Figma annotations', 'Component spec documentation', 'Design QA with engineering team'] },
];

const PRACTICES = [
  { title: '1:1 Component Mapping',   body: 'Every Figma component had a planned React equivalent, no design that couldn’t be built efficiently.' },
  { title: 'Tailwind-aligned tokens', body: 'Spacing, color, and radius tokens mirrored Tailwind defaults so engineers translated zero values by hand.' },
  { title: 'HTML/CSS in handoff',     body: 'Specs included real CSS snippets for non-trivial states, focus rings, transitions, hover micro-interactions.' },
  { title: 'Daily 15-min syncs',      body: 'Async questions resolved same day during weeks 5-10, no waiting cycles, no email threads.' },
  { title: 'Browser DevTools QA',     body: 'Paired live in DevTools to inspect builds, spacing, hierarchy, accessibility verified together in real time.' },
  { title: 'Shared component vocab',  body: 'Same terminology in Figma, code, and docs, variants, props, states all named identically across surfaces.' },
];

const REG_ROWS = [
  { status: 'Pupil',    fields: 'School, Grade, Parent name, surname, phone',             count: '+5', special: 'Grade dropdown',                          complexity: 'Medium' },
  { status: 'Student',  fields: 'University, Faculty, Program, Degree, Semester',        count: '+5', special: 'Dropdown + free input, Degree checkbox',  complexity: 'High' },
  { status: 'Graduate', fields: 'University, Faculty, Program, Degree, Graduation date', count: '+5', special: 'Dropdown + free input, Calendar picker',  complexity: 'High' },
  { status: 'Other',    fields: 'None',                                                   count: '+0', special: 'None',                                    complexity: 'Low' },
];

const REG_FLOW = [
  { label: 'Start',       sublabel: 'Begin Registration' },
  { label: 'Base',        sublabel: '12 Mandatory Fields' },
  { label: 'Branch',      sublabel: 'Status Dropdown' },
  { label: 'Conditional', sublabel: 'Role-specific 0-5 fields' },
  { label: 'Confirm',     sublabel: 'Terms & Checkbox' },
  { label: 'Success',     sublabel: 'Verification Page' },
];

const DECISIONS = [
  { n: '01', title: 'Conditional Fields, Same Page, Not Wizard',  principle: 'Cognitive load reduction', body: "Splitting status-specific fields into a separate step would create unnecessary friction at a critical dropoff point. Same-page expansion keeps the user grounded, always aware of total form length, and avoids 'where am I?' confusion across 4 possible paths." },
  { n: '02', title: 'Dark Mode as Default for Internal Tools',    principle: 'Accessibility and brand',  body: "Unispace is an internal platform used for hours at a time. Dark mode reduces eye fatigue during extended sessions, creates a professional environment that aligns with Unilab's engineering brand, and makes the blue accent significantly more impactful." },
  { n: '03', title: 'Countdown Timer with Parallel Manual CTA',   principle: 'User control and clarity', body: "After verification, users lose orientation instantly. A visible countdown (5s) provides clear feedback that something is happening; the manual button preserves user agency for those who don't want to wait. Both user types served simultaneously." },
  { n: '04', title: 'Certificate, Visible, Disabled, Explained',  principle: 'Feature discovery',        body: 'Hiding the certificate button entirely would make users unaware the feature exists. Showing it as disabled with a clear tooltip sets correct expectations and keeps users engaged rather than confused.' },
  { n: '05', title: 'Portfolio as a Dedicated Public Route',      principle: 'Audience-specific design', body: 'The portfolio page serves a completely different audience, potential employers and clients, not platform users. It was designed from scratch for first-impression clarity: no nav, no login prompts, clean project banners.' },
  { n: '06', title: 'Region → City Cascade Dropdown',             principle: 'Form usability',           body: 'Showing all Georgian cities at once creates a 70+ item dropdown that is nearly unusable. Filtering cities by selected region reduces the list to 3-12 items, eliminates impossible combinations, and cuts selection time by an estimated 60%.' },
];

const COLOR_GROUPS = [
  { group: 'Surface',  tokens: [{ label: 'Canvas', hex: '#090707' }, { label: 'Surface', hex: '#141212' }, { label: 'Elevated', hex: '#1B1A1F' }, { label: 'Field', hex: '#FFFFFF' }] },
  { group: 'Brand',    tokens: [{ label: 'Primary', hex: '#3D82F6' }, { label: 'Hover', hex: '#6BA4FF' }, { label: 'Pressed', hex: '#1A5FCC' }, { label: 'Accent Glow', hex: 'rgba(61,130,246,0.18)' }] },
  { group: 'Semantic', tokens: [{ label: 'Success', hex: '#22C55E' }, { label: 'Warning', hex: '#F59E0B' }, { label: 'Error', hex: '#F87171' }, { label: 'Info', hex: '#3D82F6' }] },
  { group: 'Neutral',  tokens: [{ label: 'Text Primary', hex: '#FFFFFF' }, { label: 'Text Secondary', hex: '#9295A6' }, { label: 'Border', hex: 'rgba(255,255,255,0.06)' }, { label: 'Divider', hex: 'rgba(255,255,255,0.04)' }] },
];

const OUTCOMES = [
  { title: '3 Roles Live',             body: 'Student, Lecturer, and Admin dashboards fully designed, documented, and handed off to development.' },
  { title: '11 of 14 Issues Resolved', body: 'Two rounds of usability testing with 8 participants. 14 friction points identified; 11 resolved before final handoff.' },
  { title: '38+ Component Library',    body: 'Reusable, documented component library with full state coverage. Reduced dev estimation time by ~30%.' },
  { title: '42 Screens Delivered',     body: 'From registration to portfolio, every screen for every role across three breakpoints (1440 / 768 / 375px).' },
  { title: 'Clean Figma Handoff',      body: 'Full Figma annotations, component specs, spacing tokens, and interaction notes. Engineers had everything they needed on day one.' },
  { title: '17 Edge Cases Covered',    body: 'Every form state, empty state, loading state, error state, and conditional path documented and designed before handoff.' },
];

const REFLECTION = [
  {
    label: 'What worked',
    items: [
      'Same-page conditional disclosure was the right call, users never felt lost between form states',
      'Dark-first design aligned perfectly with Unilab\'s brand and reduced eye fatigue for heavy users',
      'Building the component library in parallel with screens saved significant rework time late in the project',
      'Early edge-case documentation prevented last-minute surprises during handoff',
    ],
  },
  {
    label: "What I'd do differently",
    items: [
      'Run usability testing earlier, Week 5 instead of Week 11, to catch friction before high-fidelity production',
      'Design mobile-first instead of adapting from desktop; the 375px breakpoint required more rework than expected',
      'Involve an admin user earlier in the research phase, most insights came from students and lecturers',
      'Create a more detailed motion spec alongside the component library for better dev alignment',
    ],
  },
  {
    label: 'Key learnings',
    items: [
      'Role-based design requires a strict separation of context, the same component can mean different things to different roles',
      'Internal tools demand higher information density than consumer apps, hierarchy becomes critical at every level',
      'Edge cases are first-class citizens, not afterthoughts, 17 cases documented before design phase saved 40+ hours',
      'A visible-disabled state with tooltip is almost always better than hiding a feature entirely',
    ],
  },
];

/** Real words from the page: roles, modules, disciplines. */
const MARQUEE_WORDS = [
  'Student', 'Lecturer', 'Admin', 'Registration', 'Verification', 'Cabinet', 'Portfolio',
  'Project Tracking', 'Course Management', 'UX Research', 'Information Architecture', 'Design System', 'Developer Handoff',
];

const complexityColor = (c: string) => (c === 'High' ? '#F87171' : c === 'Medium' ? '#F59E0B' : '#34D399');

export function UnispaceCaseStudy() {
  const t = useTokens();
  const { isDark } = t;
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  /* One orchestrated hero load sequence. With reduced motion the same
   * sequence runs with zero duration, so it always ends fully visible. */
  const heroParent: Variants = {
    hidden: {},
    show: { transition: reduce ? { duration: 0 } : { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const heroItem: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.85, ease: EASE } },
  };
  const heroScreen: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 64 },
    show: { opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: 0.25 } },
  };

  const navLink = `text-[13px] transition-colors ${FOCUS} px-1 py-1 ${isDark ? 'text-[#9295A6] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`;

  return (
    <div className={`${t.page} min-h-screen transition-colors duration-500 relative overflow-x-clip`} style={{ fontFamily: BRAND.bodyFont }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap" />
      <UnispaceSEO />
      <CaseHeroTarget path="/projects/unispace" />
      <ReadProgress color={BRAND.blue} />
      <CaseStudySectionNav accentColor="#3D82F6" sections={SECTIONS} />

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav
        aria-label="Case study"
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b ${isDark ? 'bg-[#090707]/80 border-white/[0.05]' : 'bg-[#F3F3F3]/85 border-zinc-200/70'}`}
      >
        <div className={`${CONTAINER} h-16 flex justify-between items-center`}>
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => navigate('/', { viewTransition: true })}
              className={`flex items-center gap-2 px-2 -ml-2 min-h-[44px] transition-colors ${FOCUS} ${isDark ? 'text-[#9295A6] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <ArrowLeft size={15} aria-hidden />
              <span className="text-[13px]">Back<span className="hidden sm:inline"> to Portfolio</span></span>
            </button>
            <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-zinc-300'}`} aria-hidden />
            {/* Unilab brand mark + Unispace project tag */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                {...IMG.logo(imgUnilabLogo)}
                alt=""
                width={28}
                height={28}
                className={`w-7 h-7 object-contain rounded-md ${isDark ? '' : 'invert'}`}
                loading="lazy"
              />
              <span className={`text-[13px] font-semibold truncate ${t.heading}`} style={{ fontFamily: BRAND.headingFont }}>
                Unilab <span className={`font-normal ${t.muted}`} style={{ fontFamily: BRAND.bodyFont }}>/ Unispace</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Overview',      id: 'overview' },
              { label: 'Screens',       id: 'screens' },
              { label: 'Design System', id: 'design' },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className={navLink}>{item.label}</a>
            ))}
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <ScrollToTopButton />

        <motion.div variants={heroParent} initial="hidden" animate="show">
          {/* ─── META BAR ──────────────────────────────────────────── */}
          <div className="pt-16">
            <div className={CONTAINER}>
              <motion.dl variants={heroItem} className={`grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-5 py-6 border-b ${t.line}`}>
                {[
                  { label: 'Client',   value: 'Unilab / Ilia State Uni.' },
                  { label: 'Role',     value: 'Lead UX/UI Designer' },
                  { label: 'Platform', value: 'Web (Responsive)' },
                  { label: 'Industry', value: 'EdTech / Internal SaaS' },
                  { label: 'Tools',    value: 'Figma · Prototyping' },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className={`text-[12px] mb-1 ${t.muted}`}>{item.label}</dt>
                    <dd className={`text-[13px] ${t.strong}`}>{item.value}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>
          </div>

          {/* ─── HERO ──────────────────────────────────────────────── */}
          <section aria-labelledby="unispace-title">
            <div className={CONTAINER}>
              <div className="pt-14 md:pt-20 lg:pt-24">
                <motion.p variants={heroItem} className={`text-[12px] uppercase tracking-[0.14em] mb-6 lg:mb-8 ${t.muted}`}>
                  EdTech · Internal SaaS · 2024
                </motion.p>
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 lg:items-end">
                  <div className="lg:col-span-7">
                    <motion.h1
                      id="unispace-title"
                      variants={heroItem}
                      className={`text-[clamp(3rem,1.2rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.045em] ${t.heading}`}
                      style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}
                    >
                      Unispace
                    </motion.h1>
                    <motion.p
                      variants={heroItem}
                      className={`mt-5 text-[clamp(1.125rem,1.05rem+0.3vw,1.25rem)] leading-snug ${t.strong}`}
                      style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}
                    >
                      Student Management Platform
                    </motion.p>
                  </div>
                  <div className="lg:col-span-5">
                    <motion.p variants={heroItem} className={`${LEAD} ${t.body} ${COL}`}>
                      A closed internal platform for Unilab, Ilia State University's Innovative Technologies Cyber Laboratory. One system, three distinct roles: student, lecturer, admin.
                    </motion.p>
                    <motion.div variants={heroItem} className={`mt-8 pt-6 border-t ${t.line} grid grid-cols-3 gap-6`}>
                      <Stat n="3+" label="User roles" />
                      <Stat n="42+" label="Screens" />
                      <Stat n="38+" label="Components" />
                    </motion.div>
                  </div>
                </div>

                <motion.figure variants={heroScreen} className="m-0 mt-14 md:mt-16 lg:mt-20 grid lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-10 lg:col-start-2">
                    <TiltIn>
                      <ScreenFrame src={imgLogin} alt="Unispace platform screenshot, the sign-in screen" priority sizes="(min-width: 1232px) 960px, 92vw" />
                    </TiltIn>
                    <figcaption className={`mt-5 text-[13px] leading-relaxed ${t.muted}`}>
                      Sign-in, the single entry point for all 3 user roles (student, lecturer, admin) and the start of 4 core flows: registration, cabinet, portfolio.
                    </figcaption>
                  </div>
                </motion.figure>
              </div>
            </div>
          </section>
        </motion.div>

        {/* ─── TLDR · 30-SECOND SNAPSHOT ─────────────────────────── */}
        <section aria-label="Quick read" className="pt-16 md:pt-20 lg:pt-24 pb-20 md:pb-28 lg:pb-32">
          <div className={CONTAINER}>
            <Rise>
              <div className={`rounded-2xl border ${t.surface}`}>
                <div className={`flex items-center justify-between gap-4 px-6 lg:px-8 py-4 border-b ${t.line}`}>
                  <h2 className={`text-[13px] font-semibold ${t.heading}`}>Quick read · 30s</h2>
                  <span className={`text-[12px] ${t.muted}`}>~9 min full read</span>
                </div>
                <dl className={`divide-y ${isDark ? 'divide-white/[0.06]' : 'divide-zinc-200'}`}>
                  {[
                    { label: 'Challenge', value: 'Three roles, one system, zero compromises' },
                    { label: 'Role',      value: 'Lead UX/UI · 12 weeks · 42+ screens · 38+ components' },
                    { label: 'Impact',    value: '~60% fewer handoff tickets · 0 design-QA issues on form components post-launch' },
                  ].map((row) => (
                    <div key={row.label} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-6 px-6 lg:px-8 py-5">
                      <dt className={`text-[12px] uppercase tracking-[0.14em] sm:pt-1 ${t.muted}`}>{row.label}</dt>
                      <dd className={`text-[16px] leading-snug ${t.heading}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 500 }}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="#story"
                  className={`group flex items-center justify-between px-6 lg:px-8 py-4 border-t rounded-b-2xl transition-colors focus-visible:!shadow-[inset_0_0_0_2px_#6BA4FF] ${t.line} ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-zinc-50'}`}
                >
                  <span className={`text-[14px] ${t.strong}`}>Read full case study</span>
                  <span className="flex items-center gap-2 text-[#6BA4FF] text-[13px]">
                    9 sections
                    <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ─── STORY ──────────────────────────────────────────────── */}
        <Section id="story">
          <h2 className="sr-only">Story</h2>
          <div ref={storyRef} className="relative pl-6 lg:pl-0">
            <div className="lg:hidden"><ScrollRail target={storyRef} /></div>
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[calc(25%-0.5rem)]">
              <div className="absolute right-0 top-0 bottom-0 w-px"><ScrollRail target={storyRef} /></div>
            </div>
            {STORY.map((item) => (
              <StoryStep key={item.step} number={item.number} step={item.step} text={item.text} />
            ))}
          </div>
        </Section>

        {/* ─── 01 OVERVIEW ────────────────────────────────────────── */}
        <Section id="overview">
          <ChapterHeader number="01" label="Project overview" lines={['One ecosystem,', 'three user realities']} />
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 lg:pr-6">
              <Rise>
                <Prose cols={2}>
                  <p>
                    Unispace is a closed internal work system for Unilab, the Innovative Technologies Cyber Laboratory of Ilia State University. The platform allows students to register, track projects, build a public portfolio, and apply for competitions. Lecturers manage courses; admins control the entire ecosystem.
                  </p>
                </Prose>
                <p className={`mt-6 text-[12px] leading-relaxed ${t.muted}`}>
                  Multi-role Platform · Student Portal · Project Tracking · Portfolio Builder · Course Management
                </p>
              </Rise>

              <Rise className="mt-14">
                <h3 className={`mb-4 ${H3} ${t.heading}`} style={HEADING_STYLE}>My contribution</h3>
                <ul className={`border-t ${t.line}`}>
                  {[
                    'UX Research and Information Architecture (3 roles)',
                    'Conditional Form Logic Design (4 status paths)',
                    'Multi-role Dashboard and Cabinet Design',
                    'Email Verification and Auth Flow Design',
                    'Public Portfolio Template and Sharing System',
                    'Component Library and Developer Handoff',
                  ].map((item, i) => (
                    <li key={item} className={`flex gap-4 py-3 border-b ${t.line} ${BODY} ${t.strong}`}>
                      <span className="font-mono text-[12px] text-[#6BA4FF] pt-[3px] w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Rise>
            </div>

            <Rise delay={0.1} className="lg:col-span-4 lg:col-start-9 self-start">
              <aside className={`rounded-2xl border p-6 lg:p-7 ${t.surface}`} aria-label="Project facts">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: 'Client',       value: 'Unilab / Ilia State Uni.' },
                    { label: 'My Role',      value: 'Lead UX/UI Designer' },
                    { label: 'Platform',     value: 'Web (Responsive)' },
                    { label: 'Tools',        value: 'Figma · Prototyping' },
                    { label: 'Target Users', value: 'Students, Lecturers, Admins' },
                    { label: 'Duration',     value: '12 Weeks' },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className={`text-[12px] mb-1 ${t.muted}`}>{item.label}</dt>
                      <dd className={`text-[14px] leading-snug ${t.strong}`}>{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className={`mt-7 pt-7 border-t ${t.line} grid grid-cols-2 gap-x-6 gap-y-7`}>
                  <Stat n="42+" label="Screens Designed" />
                  <Stat n="38+" label="Components Built" />
                  <Stat n="4" label="Core UX Flows" />
                  <Stat n="12 wks" label="Research to Handoff" />
                </div>
              </aside>
            </Rise>
          </div>
        </Section>

        {/* ─── 02 CHALLENGE & SOLUTION ───────────────────────────── */}
        <Section id="challenge">
          <ChapterHeader
            number="02"
            label="Challenge & solution"
            lines={['Three users, one system,', 'zero compromises']}
            intro="The core complexity of Unispace: three completely different user journeys, student, lecturer, admin, sharing a single design language. Every screen had to serve its user without bleeding into another role's context."
          />

          {/* Three roles → one system */}
          <Rise>
            <figure className={`m-0 rounded-2xl border p-6 md:p-8 lg:p-10 ${t.surface}`}>
              <figcaption className="sr-only">Diagram: student, lecturer and admin roles converge into one Unispace platform.</figcaption>
              <div className="grid gap-6 lg:grid-cols-[1fr_160px_auto] lg:gap-8 items-center">
                <ul className="space-y-2">
                  {[
                    { label: 'Student',  sub: 'Self-registers · tracks projects',      color: '#22C55E' },
                    { label: 'Lecturer', sub: 'Manages courses · reviews submissions', color: '#F59E0B' },
                    { label: 'Admin',    sub: 'Oversees roles · uploads certificates', color: '#F87171' },
                  ].map((u) => (
                    <li key={u.label} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50'}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: u.color }} aria-hidden />
                      <span className={`text-[14px] font-semibold w-20 flex-shrink-0 ${t.heading}`} style={{ fontFamily: BRAND.headingFont }}>{u.label}</span>
                      <span className={`text-[13px] ${t.muted}`}>{u.sub}</span>
                    </li>
                  ))}
                </ul>

                <div className="hidden lg:block h-40" aria-hidden>
                  <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" preserveAspectRatio="none">
                    {['M0 26 C 80 26, 90 80, 160 80', 'M0 80 L 160 80', 'M0 134 C 80 134, 90 80, 160 80'].map((d, i) => (
                      <path
                        key={d} d={d} stroke="#3D82F6" strokeOpacity="0.6" strokeWidth="1" vectorEffect="non-scaling-stroke"
                        strokeDasharray="4 6"
                        style={reduce ? undefined : { animation: `uni-flow 1.6s linear ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </svg>
                  <style>{'@keyframes uni-flow{to{stroke-dashoffset:-20}}'}</style>
                </div>
                <div className="lg:hidden flex justify-center" aria-hidden>
                  <ChevronDown size={18} className="text-[#6BA4FF]" />
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-[#3D82F6]/40 px-5 py-4 lg:max-w-[280px]">
                  <span className="w-10 h-10 rounded-lg bg-[#3D82F6] flex items-center justify-center flex-shrink-0" aria-hidden>
                    <LayoutGrid size={18} className="text-white" />
                  </span>
                  <span>
                    <span className={`block text-[15px] ${t.heading}`} style={HEADING_STYLE}>Unispace</span>
                    <span className={`block text-[12px] leading-snug ${t.muted}`}>One login · One design language · Three realities</span>
                  </span>
                </div>
              </div>

              <div className={`mt-8 pt-6 border-t ${t.line} grid grid-cols-3 gap-6`}>
                <Stat n="3" label="User Roles" />
                <Stat n="9" label="UX Flows" />
                <Stat n="17" label="Edge Cases" />
              </div>
            </figure>
          </Rise>

          {/* Challenge → solution pairs */}
          <ol className="mt-16 lg:mt-20">
            {CHALLENGES.map((row, i) => (
              <li key={row.cTitle}>
                <DrawRule color={t.rule} />
                <Rise y={20} className="grid gap-5 md:grid-cols-12 md:gap-8 py-8 lg:py-10">
                  <span aria-hidden className="hidden md:block md:col-span-1 font-mono text-[12px] text-[#6BA4FF] md:pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div className="md:col-span-5">
                    <p className={`text-[12px] uppercase tracking-[0.14em] mb-2 ${t.muted}`}><span className="md:hidden font-mono text-[#6BA4FF] mr-3">{String(i + 1).padStart(2, '0')}</span>Challenge</p>
                    <h3 className={`${H3} mb-2 ${t.heading}`} style={HEADING_STYLE}>{row.cTitle}</h3>
                    <p lang="en" className={`${BODY} ${t.body} ${JUSTIFY} ${COL}`}>{row.cBody}</p>
                  </div>
                  <div className="md:col-span-6 md:pl-8">
                    <p className="text-[12px] uppercase tracking-[0.14em] mb-2 text-[#6BA4FF]">Solution</p>
                    <h4 className={`${H3} mb-2 ${t.heading}`} style={HEADING_STYLE}>{row.sTitle}</h4>
                    <p lang="en" className={`${BODY} ${t.body} ${JUSTIFY} ${COL}`}>{row.sBody}</p>
                  </div>
                </Rise>
              </li>
            ))}
            <li aria-hidden><DrawRule color={t.rule} /></li>
          </ol>
        </Section>

        {/* ─── 03 DESIGN PROCESS ──────────────────────────────────── */}
        <Section id="process">
          <ChapterHeader number="03" label="Design process" lines={['12 weeks from research', 'to handoff']} />

          <div ref={processRef} className="relative lg:pt-10">
            <div className="hidden lg:block"><ScrollRail target={processRef} axis="x" /></div>
            <ol className="grid gap-y-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
              {PHASES.map((phase, i) => (
                <li key={phase.phase} className={`relative border-l pl-6 lg:border-l-0 lg:pl-0 ${t.line}`}>
                  <span aria-hidden className={`hidden lg:block absolute -top-[45px] left-0 w-2.5 h-2.5 rounded-full bg-[#3D82F6] ring-4 ${isDark ? 'ring-[#090707]' : 'ring-[#F3F3F3]'}`} />
                  <Rise delay={i * 0.08}>
                    <p className={`text-[12px] ${t.muted}`}><span className="font-mono text-[#6BA4FF]">{phase.phase}</span> · {phase.weeks}</p>
                    <h3 className={`mt-3 mb-4 ${H3} ${t.heading}`} style={HEADING_STYLE}>{phase.title}</h3>
                    <ul className="space-y-2.5">
                      {phase.items.map((item) => (
                        <li key={item} className={`flex gap-3 text-[14px] leading-[1.6] ${t.body}`}>
                          <span aria-hidden className="mt-[0.7em] w-1 h-1 rounded-full bg-[#6BA4FF] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Rise>
                </li>
              ))}
            </ol>
          </div>

          {/* Delivery edge: code literacy + collaboration */}
          <Rise className="mt-20 lg:mt-28">
            <div className={`rounded-2xl border ${t.surface}`}>
              <div className={`p-6 md:p-8 lg:p-10 border-b ${t.line}`}>
                <p className="text-[12px] uppercase tracking-[0.14em] mb-4 text-[#6BA4FF]">Delivery edge</p>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                  <h3 className={`lg:col-span-4 ${H2} ${t.heading}`} style={HEADING_STYLE}>
                    Code-literate design,<br />built for handoff
                  </h3>
                  <div lang="en" className={`lg:col-span-8 grid gap-4 md:grid-cols-2 md:gap-10 ${BODY} ${t.body} ${JUSTIFY}`}>
                    <p className={COL}>
                      Hands-on knowledge of HTML, CSS, JavaScript, and React shaped every design decision. Components were drawn knowing they'd map 1:1 to React components, no abstract patterns, no wasted iterations, no ambiguity at handoff.
                    </p>
                    <p className={COL}>
                      Daily collaboration with engineering during the high-fidelity phase turned design QA into a continuous, paired activity, issues were caught and resolved in the same conversation, not in async ticket cycles.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 lg:p-10">
                <h4 className={`text-[12px] uppercase tracking-[0.14em] mb-6 ${t.muted}`}>Practices that accelerated delivery</h4>
                <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                  {PRACTICES.map((p) => (
                    <div key={p.title}>
                      <dt className={`text-[14px] font-semibold mb-1.5 ${t.heading}`} style={{ fontFamily: BRAND.headingFont }}>{p.title}</dt>
                      <dd className={`text-[14px] leading-[1.65] ${t.body}`}>{p.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className={`border-t ${t.line} p-6 md:p-8 lg:px-10 grid gap-8 sm:grid-cols-3`}>
                <Stat n="~60%" label="Fewer handoff clarification tickets" />
                <Stat n="12 wks" label="Total timeline · vs. 16-18 typical for scope" />
                <Stat n="0" label="Design QA issues on form components post-launch" />
              </div>
            </div>
          </Rise>
        </Section>

        {/* ─── Breathing pause between chapters ───────────────────── */}
        <Marquee
          items={MARQUEE_WORDS}
          speed={55}
          className={`py-8 md:py-12 text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] tracking-[-0.02em] ${isDark ? 'text-white/25' : 'text-zinc-900/25'}`}
        />


        {/* ─── 04 KEY SCREENS ─────────────────────────────────────── */}
        <Section id="screens">
          <ChapterHeader
            number="04"
            label="Key screens"
            lines={['Core screens', 'in detail']}
            intro="Registration, verification, cabinet, and portfolio, each screen designed for a specific user in a specific moment."
          />

          {/* Registration conditional logic */}
          <Rise className="mb-6">
            <h3 className={`${H3} ${t.heading}`} style={HEADING_STYLE}>Registration, conditional logic system</h3>
            <p className={`mt-2 text-[13px] ${t.muted}`}>12 base fields → 4 status paths → 0-5 conditional fields · One unified form pattern</p>
          </Rise>

          <Rise>
            <div className={`rounded-2xl border overflow-hidden ${t.surface}`}>
              {/* Desktop / tablet: real table */}
              <div className="hidden md:block">
                <table className="w-full text-[14px]">
                  <caption className="sr-only">Additional registration fields for each status</caption>
                  <thead>
                    <tr className={`border-b ${t.line}`}>
                      {['Status', 'Additional Fields', 'Count', 'Special Inputs', 'Complexity'].map((h) => (
                        <th key={h} scope="col" className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-[0.12em] ${t.muted}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REG_ROWS.map((row, i) => (
                      <tr key={row.status} className={i < REG_ROWS.length - 1 ? `border-b ${t.line}` : ''}>
                        <th scope="row" className={`px-6 py-5 font-semibold text-left align-top ${t.heading}`}>{row.status}</th>
                        <td className={`px-6 py-5 align-top leading-snug ${t.body}`}>{row.fields}</td>
                        <td className="px-6 py-5 align-top font-mono text-[#6BA4FF]">{row.count}</td>
                        <td className={`px-6 py-5 align-top leading-snug ${t.body}`}>{row.special}</td>
                        <td className={`px-6 py-5 align-top whitespace-nowrap ${t.body}`}>
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: complexityColor(row.complexity) }} />
                            {row.complexity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Phone: stacked rows, no sideways scrolling */}
              <ul className={`md:hidden divide-y ${isDark ? 'divide-white/[0.07]' : 'divide-zinc-200'}`}>
                {REG_ROWS.map((row) => (
                  <li key={row.status} className="p-5">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <span className={`text-[15px] font-semibold ${t.heading}`}>{row.status}</span>
                      <span className={`text-[12px] inline-flex items-center gap-2 ${t.muted}`}>
                        <span className="font-mono text-[#6BA4FF]">{row.count}</span>
                        <span aria-hidden className="w-1.5 h-1.5 rounded-full" style={{ background: complexityColor(row.complexity) }} />
                        {row.complexity}
                      </span>
                    </div>
                    <p className={`text-[14px] leading-snug ${t.body}`}>{row.fields}</p>
                    <p className={`text-[12px] mt-1 ${t.muted}`}>Special inputs: {row.special}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Rise>

          {/* Registration flow steps */}
          <Rise className="mt-16 lg:mt-20">
            <h3 className={`mb-6 ${H3} ${t.heading}`} style={HEADING_STYLE}>Registration flow, step by step</h3>
            <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgb(228,228,231)' }}>
              {REG_FLOW.map((step, i) => (
                <li key={step.label} className={`p-5 ${isDark ? 'bg-[#121010]' : 'bg-white'}`}>
                  <span className="font-mono text-[12px] text-[#6BA4FF]">{String(i + 1).padStart(2, '0')}</span>
                  <div className={`mt-3 text-[14px] font-semibold ${t.heading}`} style={{ fontFamily: BRAND.headingFont }}>{step.label}</div>
                  <div className={`mt-1 text-[13px] leading-snug ${t.muted}`}>{step.sublabel}</div>
                </li>
              ))}
            </ol>
          </Rise>

          {/* Screens: 8-col screen + 4-col caption, alternating sides and entrances */}
          <div className="mt-20 lg:mt-28 space-y-20 lg:space-y-28">
            <ScreenFigure
              effect="clip"
              src={imgFormsTable}
              alt="Unispace submitted-forms table screen"
              title="Layout & Grid System"
              description="Consistent 12-column grid applied across all 42 screens. Auto-layout components ensure pixel-perfect alignment without manual spacing adjustments."
            />
            <ScreenFigure
              effect="tilt"
              flip
              src={imgUploadFlow}
              alt="Unispace project upload flow screen"
              title="Project Upload Flow"
              description="Students upload projects with rich metadata, title, tags, status, media. Progressive disclosure shows relevant fields based on project type."
            />
            <figure className="m-0 grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-8 lg:col-start-3">
                <ClipReveal>
                  <ScreenFrame src={imgRegister} alt="Unispace UI components overview, student registration form with validation errors" />
                </ClipReveal>
              </div>
            </figure>
          </div>
        </Section>

        {/* ─── 05 KEY DESIGN DECISIONS ────────────────────────────── */}
        <Section id="decisions">
          <ChapterHeader number="05" label="Key design decisions" lines={['Why we made', 'the choices we made']} />
          <ol className="grid gap-x-8 lg:gap-x-16 md:grid-cols-2">
            {DECISIONS.map((d, i) => (
              <li key={d.n}>
                <DrawRule color={t.rule} />
                <Rise delay={(i % 2) * 0.08} className="py-8 lg:py-10">
                  <p className={`text-[12px] mb-4 flex items-baseline gap-3 uppercase tracking-[0.14em] ${t.muted}`}>
                    <span className="font-mono text-[#6BA4FF] normal-case tracking-normal">{d.n}</span>
                    {d.principle}
                  </p>
                  <h3 className={`${H3} mb-3 ${t.heading}`} style={HEADING_STYLE}>{d.title}</h3>
                  <p lang="en" className={`${BODY} ${t.body} ${JUSTIFY} ${COL}`}>{d.body}</p>
                </Rise>
              </li>
            ))}
          </ol>
        </Section>

        {/* ─── 06 DESIGN SYSTEM ───────────────────────────────────── */}
        <Section id="design">
          <ChapterHeader
            number="06"
            label="Design system"
            lines={['A system built', 'to scale']}
            intro="38+ components, full Georgian script support, four semantic color groups, and a decorative motif that signs every screen. Built dark-first with auto-layout and variants for every state."
          />

          <div className="space-y-20 lg:space-y-24">
            {/* 6.1 Color palette */}
            <Rise>
              <SpecHeader n="6.1" title="Color palette" note="Four token groups, defined for the dark canvas." />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {COLOR_GROUPS.map((col) => (
                  <Specimen key={col.group} className="p-5 lg:p-6">
                    <h4 className="text-[13px] font-semibold mb-5 text-white">{col.group}</h4>
                    <ul className="space-y-3">
                      {col.tokens.map((tok) => (
                        <li key={tok.label} className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="w-10 h-10 rounded-lg flex-shrink-0"
                            style={{ background: tok.hex, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)' }}
                          />
                          <span className="min-w-0">
                            <span className="block text-[13px] leading-tight text-white">{tok.label}</span>
                            <span className="block font-mono text-[11px] leading-tight mt-1 text-[#9295A6] break-all">{tok.hex}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Specimen>
                ))}
              </div>
            </Rise>

            {/* 6.2 Typography */}
            <Rise>
              <SpecHeader n="6.2" title="Typography, Noto Sans Georgian" note="Single typeface · Georgian + Latin coverage" />
              <Specimen>
                <div className="p-6 md:p-8 lg:p-10">
                  <p lang="en" className={`text-[14px] text-white/70 leading-[1.7] max-w-[46ch] mb-10 ${JUSTIFY}`} style={{ fontFamily: F_GE }}>
                    Unispace uses Noto Sans Georgian across the entire product. One typeface, one metric set, both Georgian and Latin scripts render with matching baselines, weights, and rhythm.
                  </p>

                  <Annot className="mb-2">Display · 72px · 700</Annot>
                  <div lang="ka" className="text-[clamp(2.75rem,1.5rem+5vw,4.5rem)] leading-[1.1] text-white mb-12 tracking-[-0.02em] break-words" style={{ fontFamily: F_GE, fontWeight: 700 }}>
                    გამარჯობა
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                    {[
                      { weight: 700, label: 'Bold · 700',     sample: 'უნივერსიტეტი' },
                      { weight: 600, label: 'SemiBold · 600', sample: 'რეგისტრაცია' },
                      { weight: 500, label: 'Medium · 500',   sample: 'პროექტის ატვირთვა' },
                      { weight: 400, label: 'Regular · 400',  sample: 'უნილაბის სამართავ პანელი' },
                    ].map((w) => (
                      <div key={w.label}>
                        <Annot className="mb-2">{w.label}</Annot>
                        <div lang="ka" className="text-[22px] md:text-[24px] text-white" style={{ fontFamily: F_GE, fontWeight: w.weight }}>{w.sample}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.07] pt-8 grid md:grid-cols-2 gap-8">
                    <div>
                      <Annot className="mb-2">Georgian body · 14px · 400</Annot>
                      <p lang="ka" className="text-[14px] text-white/75 leading-relaxed max-w-[46ch]" style={{ fontFamily: F_GE, fontWeight: 400 }}>
                        ერთიანი ტიპოგრაფიული სისტემა, სათაურები, ფორმის ლეიბლები, სტატუსები და მთავარი ტექსტი. ერთი შრიფტი ანბანის ყველა ფორმისთვის.
                      </p>
                    </div>
                    <div>
                      <Annot className="mb-2">Latin body · 14px · 400</Annot>
                      <p lang="en" className="text-[14px] text-white/75 leading-relaxed max-w-[46ch]" style={{ fontFamily: F_GE, fontWeight: 400 }}>
                        A single typographic system, headings, form labels, statuses, and body text. One typeface for every shape of the alphabet, both scripts.
                      </p>
                    </div>
                  </div>
                </div>

                <dl className="border-t border-white/[0.07] px-6 md:px-8 lg:px-10 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">
                  {[
                    { l: 'Display', r: '48-72px · 700' },
                    { l: 'Heading', r: '20-32px · 600-700' },
                    { l: 'Body',    r: '14-16px · 400' },
                    { l: 'Caption', r: '10-11px · 500 · +0.15em' },
                  ].map((s) => (
                    <div key={s.l}>
                      <dt className="text-[12px] text-[#9295A6] mb-1">{s.l}</dt>
                      <dd className="font-mono text-[12px] text-white/85">{s.r}</dd>
                    </div>
                  ))}
                </dl>
              </Specimen>
            </Rise>

            {/* 6.3 Form system */}
            <Rise>
              <SpecHeader n="6.3" title="Form system, inputs, selectors & actions" note="Input states · checkbox states · button variants" />
              <p className="sr-only">
                Specimen of the Unispace form system: text inputs in default, focused, error and dropdown states,
                checkboxes in four states, and primary, secondary and text buttons.
              </p>
              <Specimen className="p-6 md:p-8 lg:p-10" {...({ inert: '' } as object)}>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-6">Input states · 4 variants</h4>
                    <div className="space-y-6">
                      <div>
                        <Annot className="mb-2">Default</Annot>
                        <div className="text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>ელ-ფოსტა</div>
                        <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center text-[13px] text-zinc-400">@unilab.ge</div>
                      </div>
                      <div>
                        <Annot className="mb-2">Focused · with icon</Annot>
                        <div className="text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>პაროლი</div>
                        <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900 ring-2 ring-[#3D82F6] ring-offset-2 ring-offset-[#0d0b0b]">
                          <span>••••••••••</span>
                          <Eye size={14} className="text-zinc-400" aria-hidden />
                        </div>
                      </div>
                      <div>
                        <Annot className="mb-2">Error</Annot>
                        <div className="text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>სახელი</div>
                        <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900 ring-2 ring-[#F87171]">
                          <span className="text-zinc-300">........</span>
                          <span className="w-4 h-4 rounded-full border-2 border-[#F87171] text-[#F87171] text-[10px] flex items-center justify-center font-bold">!</span>
                        </div>
                        <p className="text-[12px] mt-2 text-[#F87171]" style={{ fontFamily: F_GE }}>სახელის მითითება აუცილებელია</p>
                      </div>
                      <div>
                        <Annot className="mb-2">Dropdown · closed</Annot>
                        <div className="text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>სტატუსი</div>
                        <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900">
                          <span style={{ fontFamily: F_GE }}>სტუდენტი</span>
                          <ChevronDown size={15} className="text-zinc-400" aria-hidden />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[13px] font-semibold text-white mb-6">Checkbox · 4 states</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { state: 'Unchecked', checked: false, disabled: false },
                          { state: 'Checked',   checked: true,  disabled: false },
                          { state: 'Disabled',  checked: false, disabled: true },
                          { state: 'Done',      checked: true,  disabled: true },
                        ].map((c) => (
                          <div key={c.state} className="flex items-center gap-3">
                            <span
                              className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0"
                              style={{
                                background: c.checked ? '#3D82F6' : 'transparent',
                                border: `1.5px solid ${c.checked ? '#3D82F6' : c.disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)'}`,
                                opacity: c.disabled ? 0.5 : 1,
                              }}
                            >
                              {c.checked && <Check size={12} className="text-white" strokeWidth={3} aria-hidden />}
                            </span>
                            <span className="text-[13px] text-white/75">{c.state}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-semibold text-white mb-6">Buttons · 3 variants</h4>
                      <div className="space-y-6">
                        <div>
                          <Annot className="mb-2">Primary · filled</Annot>
                          <div className="flex flex-wrap gap-3">
                            <span className="h-11 px-6 rounded-[10px] bg-[#3D82F6] text-white text-[13px] font-medium inline-flex items-center" style={{ fontFamily: F_GE }}>ავტორიზაცია</span>
                            <span className="h-11 px-6 rounded-[10px] bg-[#3D82F6]/40 text-white/50 text-[13px] inline-flex items-center" style={{ fontFamily: F_GE }}>Disabled</span>
                          </div>
                        </div>
                        <div>
                          <Annot className="mb-2">Secondary · outlined</Annot>
                          <div className="flex flex-wrap gap-3">
                            <span className="h-11 px-6 rounded-[10px] border border-white/30 text-white text-[13px] inline-flex items-center" style={{ fontFamily: F_GE }}>გაუქმება</span>
                            <span className="h-11 px-6 rounded-[10px] border border-[#3D82F6] text-[#6BA4FF] text-[13px] inline-flex items-center" style={{ fontFamily: F_GE }}>დამატება</span>
                          </div>
                        </div>
                        <div>
                          <Annot className="mb-2">Text · link</Annot>
                          <div className="flex flex-wrap items-center gap-5">
                            <span className="text-[13px] text-white font-semibold underline underline-offset-4" style={{ fontFamily: F_GE }}>დარეგისტრირდი</span>
                            <span className="text-[13px] text-[#9295A6]" style={{ fontFamily: F_GE }}>დაგავიწყდა პაროლი?</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Specimen>
            </Rise>

            {/* 6.4 Status system */}
            <Rise>
              <SpecHeader n="6.4" title="Status system, pills & row indicators" note="Status pills · 5 types · table row left-edge indicator" />
              <Specimen className="p-6 md:p-8 lg:p-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-6">Status pills · 5 types</h4>
                    <ul className="space-y-3.5">
                      {[
                        { label: 'დასრულებული',   en: 'Completed',   bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   text: '#22C55E' },
                        { label: 'გამოცხადებული', en: 'Announced',   bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)',  text: '#F59E0B' },
                        { label: 'მიმდინარე',      en: 'In Progress', bg: 'rgba(61,130,246,0.12)',  border: 'rgba(61,130,246,0.35)',  text: '#6BA4FF' },
                        { label: 'უარყოფილი',     en: 'Rejected',    bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.35)', text: '#F87171' },
                        { label: 'მონახაზი',       en: 'Draft',       bg: 'rgba(146,149,166,0.12)', border: 'rgba(146,149,166,0.35)', text: '#9295A6' },
                      ].map((s) => (
                        <li key={s.label} className="grid grid-cols-[minmax(0,160px)_1fr] items-center gap-4">
                          <span lang="ka" className="justify-self-start px-3 py-1 rounded-full text-[12px] border" style={{ background: s.bg, borderColor: s.border, color: s.text, fontFamily: F_GE, fontWeight: 500 }}>
                            {s.label}
                          </span>
                          <span className="font-mono text-[12px] text-white/60">{s.en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-6">Table row · left-edge indicator</h4>
                    <ul className="space-y-2">
                      {[
                        { state: 'Completed', color: '#22C55E' },
                        { state: 'Announced', color: '#F59E0B' },
                        { state: 'In Review', color: '#3D82F6' },
                        { state: 'Rejected',  color: '#F87171' },
                      ].map((r) => (
                        <li key={r.state} className="relative flex items-center h-12 rounded-r-[10px] bg-white/[0.03] border border-white/[0.07] overflow-hidden">
                          <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: r.color }} />
                          <span className="pl-5 pr-4 flex items-center justify-between gap-4 w-full">
                            <span lang="ka" className="text-[13px] text-white/85 truncate" style={{ fontFamily: F_GE }}>პითონის სტაჟირება 2024</span>
                            <span className="font-mono text-[12px] flex-shrink-0" style={{ color: r.color === '#3D82F6' ? '#6BA4FF' : r.color }}>{r.state}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Specimen>
            </Rise>

            {/* 6.5 Decorative motif */}
            <Rise>
              <SpecHeader n="6.5" title="Decorative system, brand motif" note="Concentric rings · spark mark" />
              <div className="grid gap-4 md:grid-cols-2">
                <Specimen className="relative min-h-[320px] p-6 md:p-8 flex flex-col justify-end">
                  <svg
                    className="absolute -top-16 -right-16 opacity-60" width="380" height="380" viewBox="0 0 380 380" fill="none" aria-hidden
                    style={reduce ? undefined : { animation: 'uni-spin 60s linear infinite' }}
                  >
                    <defs>
                      <linearGradient id="unispaceRingGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6BA4FF" />
                        <stop offset="50%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                    </defs>
                    {[...Array(22)].map((_, i) => (
                      <circle key={i} cx="190" cy="190" r={20 + i * 8} fill="none" stroke="url(#unispaceRingGrad)" strokeWidth="0.7" strokeDasharray="2 5" opacity={1 - i * 0.035} />
                    ))}
                  </svg>
                  <style>{'@keyframes uni-spin{to{transform:rotate(360deg)}}'}</style>
                  <div className="relative">
                    <h4 className="text-[14px] font-semibold text-white mb-2">Concentric Rings</h4>
                    <p lang="en" className={`text-[14px] text-white/70 leading-[1.7] max-w-[40ch] ${JUSTIFY}`}>Dashed concentric rings on a blue → purple → pink gradient. Signs every auth, onboarding, and verification screen, a calm, technical signature that frames otherwise utilitarian forms.</p>
                  </div>
                </Specimen>
                <Specimen className="relative min-h-[320px] p-6 md:p-8 flex flex-col justify-end">
                  <svg className="absolute top-8 right-8 w-[150px] h-[150px] md:w-[180px] md:h-[180px]" viewBox="0 0 200 200" fill="none" aria-hidden>
                    <defs>
                      <linearGradient id="unispaceSparkGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6BA4FF" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                    <path d="M100 12 L 110 85 L 188 100 L 110 115 L 100 188 L 90 115 L 12 100 L 90 85 Z" fill="none" stroke="url(#unispaceSparkGrad)" strokeWidth="0.9" strokeDasharray="3 3" />
                    <path d="M100 34 L 106 89 L 165 100 L 106 111 L 100 166 L 94 111 L 35 100 L 94 89 Z" fill="none" stroke="url(#unispaceSparkGrad)" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />
                  </svg>
                  <div className="relative">
                    <h4 className="text-[14px] font-semibold text-white mb-2">Spark Mark</h4>
                    <p className="text-[14px] text-white/70 leading-[1.7] max-w-[40ch]">Corner ornament, used for empty states, success moments, and as a transitional accent between sections.</p>
                  </div>
                </Specimen>
              </div>
            </Rise>

            {/* 6.6 Layout & navigation */}
            <Rise>
              <SpecHeader n="6.6" title="Layout & navigation" note="12-column grid · collapsible icon rail" />
              <div className="grid gap-4 md:grid-cols-2">
                <Specimen className="p-6 md:p-8">
                  <h4 className="text-[13px] font-semibold text-white mb-5">12-Column Grid · Desktop 1440px</h4>
                  <div className="relative h-40 rounded-lg bg-white/[0.02] border border-white/[0.05] p-3" aria-hidden>
                    <div className="grid grid-cols-12 gap-1.5 md:gap-2 h-full">
                      {[...Array(12)].map((_, i) => (
                        <Rise key={i} delay={i * 0.04} y={40} className="h-full">
                          <div className="h-full bg-[#3D82F6]/[0.12] border border-[#3D82F6]/25 rounded-sm" />
                        </Rise>
                      ))}
                    </div>
                  </div>
                  <dl className="mt-6 grid grid-cols-3 gap-4">
                    {[{ l: 'Columns', v: '12' }, { l: 'Gutter', v: '24px' }, { l: 'Margin', v: '48px' }].map((s) => (
                      <div key={s.l}>
                        <dt className="text-[12px] text-[#9295A6] mb-1">{s.l}</dt>
                        <dd className="font-mono text-[13px] text-white/85">{s.v}</dd>
                      </div>
                    ))}
                  </dl>
                </Specimen>
                <Specimen className="p-6 md:p-8">
                  <h4 className="text-[13px] font-semibold text-white mb-5">Sidebar · Collapsible Icon Rail</h4>
                  <div className="flex gap-6 items-start">
                    <div className="w-14 rounded-lg bg-white/[0.03] border border-white/[0.07] p-2 flex flex-col gap-1.5 flex-shrink-0" aria-hidden>
                      <div className="w-10 h-10 rounded-md bg-[#3D82F6] flex items-center justify-center text-white"><LayoutGrid size={15} /></div>
                      <div className="w-10 h-10 rounded-md flex items-center justify-center text-white/40"><PenTool size={14} /></div>
                      <div className="w-10 h-10 rounded-md flex items-center justify-center text-white/40"><BookOpen size={14} /></div>
                      <div className="w-10 h-10 rounded-md flex items-center justify-center text-white/40"><Component size={14} /></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-white/75 leading-[1.7] mb-6">
                        Persistent icon rail at 56px wide. Active route filled with the primary blue. Expands to 240px on chevron click to reveal full Georgian labels.
                      </p>
                      <dl className="grid grid-cols-2 gap-4">
                        {[{ l: 'Collapsed', v: '56px' }, { l: 'Expanded', v: '240px' }].map((s) => (
                          <div key={s.l}>
                            <dt className="text-[12px] text-[#9295A6] mb-1">{s.l}</dt>
                            <dd className="font-mono text-[13px] text-white/85">{s.v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </Specimen>
              </div>
            </Rise>

            {/* By the numbers */}
            <div>
              <DrawRule color={t.rule} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
                <Stat n="38+" label="Total Components" />
                <Stat n="100%" label="Auto-layout Coverage" />
                <Stat n="4+" label="States per Component" />
                <Stat n="3" label="Responsive Breakpoints" />
              </div>
            </div>
          </div>
        </Section>

        {/* ─── 07 OUTCOME ─────────────────────────────────────────── */}
        <Section id="outcome">
          <ChapterHeader
            number="07"
            label="Outcome"
            lines={['Delivered, tested,', 'and handed off']}
            intro="Unispace launched as an active internal platform for Unilab students and staff. All three user roles went live with complete flows, tested with real users before handoff."
          />

          <Rise>
            <div className={`rounded-2xl border p-6 md:p-8 lg:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 ${t.surface}`}>
              <Stat size="lg" n="8" label="Test Participants" />
              <Stat size="lg" n="2" label="Testing Rounds" />
              <Stat size="lg" n="14" label="Issues Found" />
              <Stat size="lg" n="11" label="Resolved Pre-Handoff" />
            </div>
          </Rise>

          <ul className="mt-12 lg:mt-16 grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((item, i) => (
              <li key={item.title}>
                <DrawRule color={t.rule} />
                <Rise delay={(i % 3) * 0.07} className="py-7 lg:py-8">
                  <h3 className={`${H3} mb-2 ${t.heading}`} style={HEADING_STYLE}>{item.title}</h3>
                  <p className={`${BODY} ${t.body}`}>{item.body}</p>
                </Rise>
              </li>
            ))}
          </ul>
        </Section>

        {/* ─── 08 REFLECTION ──────────────────────────────────────── */}
        <Section id="reflection">
          <ChapterHeader number="08" label="Reflection" lines={['What I learned', 'building Unispace']} />
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
            {REFLECTION.map((col, i) => (
              <div key={col.label}>
                <DrawRule color={t.rule} />
                <Rise delay={i * 0.08} className="pt-6">
                  <h3 className={`${H3} mb-5 ${t.heading}`} style={HEADING_STYLE}>{col.label}</h3>
                  <ul className="space-y-3.5">
                    {col.items.map((item) => (
                      <li key={item} className={`flex gap-3 text-[14px] leading-[1.65] ${t.body}`}>
                        <span aria-hidden className="mt-[0.72em] w-1 h-1 rounded-full bg-[#6BA4FF] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Rise>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── NEXT PROJECT ───────────────────────────────────────── */}
        
      </main>
    </div>
  );
}
