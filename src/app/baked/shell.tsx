import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Pause, Play } from 'lucide-react';
import { T, pillCls, darkPillCls } from './ui';
import { EMAIL } from './content';
import { useI18n } from './i18n';

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
  { label: 'ux/ui', ka: 'ux/ui', to: '/work/ux-ui' },
  { label: 'ads', ka: 'რეკლამა', to: '/work/social-media-ads' },
  { label: 'motion', ka: 'მოუშენი', to: '/work/social-media-motion' },
  { label: 'services', ka: 'სერვისები', to: '/services' },
];

const ACTIVE = { background: '#ffe7de', color: '#b52f03' };

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
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav aria-label={tx('Primary', 'მთავარი ნავიგაცია')} className="fixed inset-x-0 top-0 z-[70] pointer-events-none">
      <div className="flex items-start justify-between p-1.5 sm:p-2">
        <Link to={to('/')} className={`${pillCls(false)} pointer-events-auto`} style={{ fontWeight: 500 }}>
          samole.ge
        </Link>

        {/* Desktop pills */}
        <div className="hidden sm:flex items-center gap-1 pointer-events-auto">
          {NAV.map((n) => (
            <Link key={n.to} to={to(n.to)} aria-current={bare === n.to ? 'page' : undefined} className={pillCls(false)}
              style={bare === n.to ? ACTIVE : undefined}>
              {tx(n.label, n.ka)}
            </Link>
          ))}
          <LangSwitch />
          <Link to={to('/contact')} className={pillCls(true)}>{tx('contact me', 'კონტაქტი')}</Link>
        </div>

        {/* Mobile */}
        <div className="sm:hidden pointer-events-auto flex flex-col items-end gap-1">
          <div className="flex gap-1">
            <LangSwitch />
            <Link to={to('/contact')} className={pillCls(true)}>{tx('contact', 'კონტაქტი')}</Link>
            <button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)} className={pillCls(false)}>
              {open ? tx('close', 'დახურვა') : tx('menu', 'მენიუ')}
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-end gap-1"
              >
                {[{ label: 'home', ka: 'მთავარი', to: '/' }, ...NAV].map((n) => (
                  <Link key={n.to} to={to(n.to)} className={pillCls(false)} style={bare === n.to ? ACTIVE : undefined}>{tx(n.label, n.ka)}</Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[65]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <Link to={to('/contact')} className={darkPillCls}>
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
            {tx('Contact me', 'დამიკავშირდი')}
          </Link>
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
          className="fixed bottom-4 right-4 z-[65] h-11 w-11 rounded-full bg-white text-[#111] border border-[#ececec] shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-[#ffe7de] hover:text-[#b52f03] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]"
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
      { l: tx('UX/UI Design', 'UX/UI დიზაინი'), to: '/work/ux-ui' },
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
          <div className="text-[#6f6f6f] mt-1.5">{tx('Tbilisi, Georgia', 'თბილისი, საქართველო')}</div>
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
      <div lang={lang} className="baked min-h-screen bg-white text-[#111] antialiased" style={{ fontFamily: T.font, colorScheme: 'light' }}>
        <TopNav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingCta />
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
    </PauseCtx.Provider>
  );
}
