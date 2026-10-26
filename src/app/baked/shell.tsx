import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Pause, Play, House, FolderOpen, Sparkles, Mail } from 'lucide-react';
import { useRef } from 'react';
import { T, pillCls, darkPillCls } from './ui';
import { EMAIL } from './content';
import { useI18n } from './i18n';
import { BookingProvider } from './booking';
import { LeaningPills, SwingingBadge } from './flourish';

/* ── Shared "pause motion" switch ─────────────────────────────────── */
const PauseCtx = createContext<{ paused: boolean; toggle: () => void }>({ paused: false, toggle: () => {} });
export const useMotionPause = () => useContext(PauseCtx);

export function PauseButton({ className = '' }: { className?: string }) {
  const { paused, toggle } = useMotionPause();
  const { tx } = useI18n();
  return (
    <button type="button" onClick={toggle} aria-pressed={paused} className={`${pillCls()} ${className}`}>
      {paused ? <Play size={13} /> : <Pause size={13} />}
      {paused ? tx('Play motion', 'მოძრაობის ჩართვა') : tx('Pause motion', 'მოძრაობის შეჩერება')}
    </button>
  );
}

const NAV = [
  { label: 'work', ka: 'ნამუშევრები', to: '/work' },
  { label: 'services', ka: 'სერვისები', to: '/services' },
];

const ACTIVE = { background: '#ececec' };
/** Case studies live under UX/UI */
const isActive = (bare: string, to: string) => bare === to || (to === '/work' && (bare.startsWith('/work/') || bare.startsWith('/projects/')));

/** EN / ქა switch, to the same page in the other language */
const GEORGIAN_LIVE = false; // the /ka pages are ready but not published yet

function LangSwitch() {
  const { ka, other } = useI18n();
  if (!GEORGIAN_LIVE) return null;
  return (
    <Link to={other} hrefLang={ka ? 'en' : 'ka'} lang={ka ? 'en' : 'ka'} className={pillCls(false)} aria-label={ka ? 'English version' : 'ქართული ვერსია'}>
      {ka ? 'EN' : 'ქა'}
    </Link>
  );
}

function TopNav() {
  const { pathname } = useLocation();
  const { tx, to, bare } = useI18n();
  return (
    <nav aria-label={tx('Primary', 'მთავარი ნავიგაცია')} className="fixed inset-x-0 top-0 z-[70] pointer-events-none">
      <div className="flex items-start justify-between p-1.5 sm:p-2">
        <Link to={to('/')} className={`${pillCls(false)} pointer-events-auto`} style={{ fontWeight: 500 }}>
          samole.ge
        </Link>

        {/* Desktop pills */}
        <div className="hidden sm:flex items-center gap-1 pointer-events-auto">
          {NAV.map((n) => (
            <Link key={n.to} to={to(n.to)} aria-current={isActive(bare, n.to) ? 'page' : undefined} className={pillCls(false)}
              style={isActive(bare, n.to) ? ACTIVE : undefined}>
              {tx(n.label, n.ka)}
            </Link>
          ))}
          <LangSwitch />
          <Link to={to('/contact')} className={pillCls(true)}>{tx('contact me', 'კონტაქტი')}</Link>
        </div>

        {/* Mobile: navigation lives in the dock at the bottom */}
        <div className="sm:hidden pointer-events-auto flex gap-1"><LangSwitch /></div>
      </div>
    </nav>
  );
}

/* ── Mobile dock: icons swell toward the finger, the nearest most ──── */

const DOCK = [
  { label: 'home', ka: 'მთავარი', to: '/', Icon: House },
  { label: 'work', ka: 'ნამუშევრები', to: '/work', Icon: FolderOpen },
  { label: 'services', ka: 'სერვისები', to: '/services', Icon: Sparkles },
  { label: 'contact', ka: 'კონტაქტი', to: '/contact', Icon: Mail },
];
const MAGNIFY = 1.32, LIFT = 8, REACH = 2;

function MobileDock() {
  const { tx, to, bare } = useI18n();
  const navigate = useNavigate();
  const bar = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState<number | null>(null); // finger x inside the dock
  const moved = useRef(false);
  const ITEM = 64;

  const near = (x: number | null) => (x == null ? -1 : Math.max(0, Math.min(DOCK.length - 1, Math.floor((x - 8) / ITEM))));
  const local = (e: React.PointerEvent) => e.clientX - (bar.current?.getBoundingClientRect().left ?? 0);
  const hovered = near(px);
  const activeIdx = DOCK.findIndex((d) => (d.to === '/' ? bare === '/' : isActive(bare, d.to)));

  return (
    <nav aria-label={tx('Primary', 'მთავარი ნავიგაცია')} className="sm:hidden fixed inset-x-0 bottom-0 z-[75] flex justify-center pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
      <div
        ref={bar}
        className="pointer-events-auto relative flex items-end rounded-[26px] px-2 h-[64px] bg-[#1c1c1c] border border-white/[0.06] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => { moved.current = false; setPx(local(e)); }}
        onPointerMove={(e) => { if (e.pointerType === 'mouse' || e.buttons) { if (px != null && Math.abs(local(e) - px) > 4) moved.current = true; setPx(local(e)); } }}
        onPointerUp={(e) => {
          const i = near(local(e));
          if (moved.current && i >= 0) navigate(to(DOCK[i].to));
          setPx(null);
        }}
        onPointerLeave={() => setPx(null)}
        onPointerCancel={() => setPx(null)}
      >
        {DOCK.map((d, i) => {
          const center = 8 + i * ITEM + ITEM / 2;
          const t = px == null ? 0 : Math.max(0, 1 - Math.abs(px - center) / (ITEM * REACH));
          const k = t * t * (3 - 2 * t); // smooth falloff
          const active = i === activeIdx;
          return (
            <Link
              key={d.to}
              to={to(d.to)}
              aria-label={tx(d.label, d.ka)}
              aria-current={active ? 'page' : undefined}
              onClick={(e) => { if (moved.current) e.preventDefault(); }}
              className="relative flex flex-col items-center justify-center outline-none focus-visible:[&>svg]:text-white"
              style={{ width: ITEM, height: 64 }}
            >
              {i === hovered && px != null && (
                <span className="absolute -top-9 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] text-[#111] shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
                  {tx(d.label, d.ka)}
                </span>
              )}
              <d.Icon
                size={24}
                strokeWidth={1.75}
                className={`transition-[transform,color] duration-150 ease-out ${active || i === hovered ? 'text-white' : 'text-[#8b8b8b]'}`}
                style={{ transform: `translateY(${-LIFT * k}px) scale(${1 + (MAGNIFY - 1) * k})`, transformOrigin: 'bottom center' }}
              />
              <span className={`mt-1.5 h-1 w-1 rounded-full ${active ? 'bg-white/70' : 'bg-transparent'}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function FloatingCta() {
  const { pathname } = useLocation();
  const { tx, to, bare } = useI18n();
  const [show, setShow] = useState(false);
  // Only one "Contact me" on screen: the floating one steps aside whenever
  // a CTA in the page itself is visible
  useEffect(() => {
    let pastHero = false;
    const visible = new Set<Element>();
    const update = () => setShow(pastHero && visible.size === 0);
    const onScroll = () => { pastHero = window.scrollY > window.innerHeight * 0.6; update(); };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      update();
    });
    const watch = () => document.querySelectorAll('main [data-cta]').forEach((el) => io.observe(el));
    watch();
    const t = setTimeout(watch, 800);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [pathname]);
  if (bare === '/contact') return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="hidden sm:block fixed bottom-4 left-1/2 -translate-x-1/2 z-[65]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <LeaningPills size="sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BackToTop() {
  const { tx } = useI18n();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
          }}
          aria-label={tx('Back to top', 'ზემოთ დაბრუნება')}
          className="fixed bottom-[96px] sm:bottom-4 right-4 z-[65] h-11 w-11 rounded-full bg-white text-[#111] border border-[#ececec] shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-[#ffe7de] hover:text-[#b52f03] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  const { tx, to } = useI18n();
  const groups = [
    { title: tx('Work', 'ნამუშევრები'), links: [
      { l: tx('All work', 'ყველა ნამუშევარი'), to: '/work' },
      { l: tx('UX/UI Design', 'UX/UI დიზაინი'), to: '/work/ux-ui' },
      { l: tx('Branding', 'ბრენდინგი'), to: '/projects/dasturi' },
      { l: tx('Case Studies', 'ქეისები'), to: '/work/case-studies' },
      { l: tx('Social Media Ads', 'სოც. მედიის რეკლამა'), to: '/work/social-media-ads' },
      { l: tx('Social Media Motion', 'სოც. მედიის მოუშენი'), to: '/work/social-media-motion' },
    ] },
    { title: tx('Studio', 'სტუდია'), links: [
      { l: tx('Services', 'სერვისები'), to: '/services' },
      { l: tx('Contact', 'კონტაქტი'), to: '/contact' },
      { l: tx('Home', 'მთავარი'), to: '/' },
    ] },
  ];
  const ext = [
    { l: 'LinkedIn', href: 'https://www.linkedin.com/in/samole/' },
    { l: 'Behance', href: 'https://www.behance.net/samole' },
    { l: 'Upwork', href: 'https://www.upwork.com/freelancers/~0163986e2d8967d783' },
  ];
  return (
    <footer className="px-5 sm:px-8 pt-24 pb-28 text-[14px]">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 max-w-6xl">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-[#9a9a9a] mb-3">{g.title}</div>
            <ul className="space-y-1.5">
              {g.links.map((x) => <li key={x.to}><Link to={to(x.to)} className="text-[#111] hover:text-[#d93905] transition-colors">{x.l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div className="text-[#9a9a9a] mb-3">{tx('Elsewhere', 'სხვაგან')}</div>
          <ul className="space-y-1.5">
            {ext.map((x) => <li key={x.l}><a href={x.href} target="_blank" rel="noopener noreferrer" className="text-[#111] hover:text-[#d93905] transition-colors">{x.l} ↗</a></li>)}
          </ul>
        </div>
        <div>
          <div className="text-[#9a9a9a] mb-3">{tx('My brand', 'ჩემი ბრენდი')}</div>
          <a href="https://www.instagram.com/areuli.design/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#111] hover:text-[#d93905] transition-colors">
            <img src="/favicon-48.png" alt="" width="20" height="20" className="h-5 w-5 rounded" />
            areuli.design ↗
          </a>
        </div>
        <div>
          <div className="text-[#9a9a9a] mb-3">{tx('Say hello', 'მომწერე')}</div>
          <a href={`mailto:${EMAIL}`} className="text-[#111] hover:text-[#d93905] transition-colors break-all">{EMAIL}</a>
          <div className="text-[#6f6f6f] mt-1.5">{tx('Georgia', 'საქართველო')}</div>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap justify-between gap-2 text-[#9a9a9a] text-[13px]">
        <span>{tx('Designed and developed by Salome Mosiava', 'დიზაინი და დეველოპმენტი: სალომე მოსიავა')}</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/** Light shell for the redesigned pages: corner pills, floating CTA, footer */
export function BakedShell({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const { lang } = useI18n();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  // Text on the site is not for copying; form fields still work as usual
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && !!t.closest('input, textarea, select, [contenteditable="true"]');
    const block = (e: Event) => { if (!isField(e.target)) e.preventDefault(); };
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('dragstart', block);
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', block);
    };
  }, []);
  // Honour the system setting as the starting point
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
  }, []);

  return (
    <PauseCtx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <BookingProvider>
      <div lang={lang} className="baked min-h-screen bg-white text-[#111] antialiased" style={{ fontFamily: T.font, colorScheme: 'light' }}>
        <TopNav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SwingingBadge />
        <Footer />
        <FloatingCta />
        <MobileDock />
        <BackToTop />
        <style>{`
          @font-face { font-family: 'Avenir Next Georgian'; src: url('/fonts/avenir-next-georgian-regular-v2.woff2') format('woff2'); font-weight: 100 700; font-style: normal; font-display: swap; }
          @font-face { font-family: 'Loos Wide Black'; src: url('/fonts/loos-wide-black-v2.woff2') format('woff2'); font-weight: 800 900; font-style: normal; font-display: swap; }
          html:has(.baked), html:has(.baked) body { background: #fff; color-scheme: light; }
          .baked ::selection { background: #ff4306; color: #fff; }
          .baked { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
          .baked input, .baked textarea, .baked select { -webkit-user-select: text; user-select: text; }
          .baked img, .baked video { -webkit-user-drag: none; }
          @keyframes baked-marquee { to { transform: translateX(-50%); } }
          .baked-marquee { animation: baked-marquee 60s linear infinite; }
          @keyframes baked-up { to { transform: translateY(-50%); } }
          @keyframes baked-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
          .baked-col-up { animation: baked-up var(--dur, 60s) linear infinite; }
          .baked-col-down { animation: baked-down var(--dur, 60s) linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .baked-marquee, .baked-col-up, .baked-col-down { animation: none; }
          }
        `}</style>
      </div>
      </BookingProvider>
    </PauseCtx.Provider>
  );
}
