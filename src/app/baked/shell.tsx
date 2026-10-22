import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { T, pillCls, darkPillCls } from './ui';
import { EMAIL } from './content';

/* ── Shared "pause motion" switch ─────────────────────────────────── */
const PauseCtx = createContext<{ paused: boolean; toggle: () => void }>({ paused: false, toggle: () => {} });
export const useMotionPause = () => useContext(PauseCtx);

export function PauseButton({ className = '' }: { className?: string }) {
  const { paused, toggle } = useMotionPause();
  return (
    <button type="button" onClick={toggle} aria-pressed={paused} className={`${pillCls()} ${className}`}>
      {paused ? <Play size={13} /> : <Pause size={13} />}
      {paused ? 'Play motion' : 'Pause motion'}
    </button>
  );
}

const NAV = [
  { label: 'ux/ui', to: '/work/ux-ui' },
  { label: 'ads', to: '/work/social-media-ads' },
  { label: 'motion', to: '/work/social-media-motion' },
  { label: 'services', to: '/services' },
];

function TopNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-[70] pointer-events-none">
      <div className="flex items-start justify-between p-1.5 sm:p-2">
        <Link to="/" className={`${pillCls(false)} pointer-events-auto`} style={{ fontWeight: 500 }}>
          samole.ge
        </Link>

        {/* Desktop pills */}
        <div className="hidden sm:flex items-center gap-1 pointer-events-auto">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} aria-current={pathname === n.to ? 'page' : undefined} className={pillCls(false)}
              style={pathname === n.to ? { background: '#e2e2e2' } : undefined}>
              {n.label}
            </Link>
          ))}
          <Link to="/contact" className={pillCls(true)}>contact me</Link>
        </div>

        {/* Mobile */}
        <div className="sm:hidden pointer-events-auto flex flex-col items-end gap-1">
          <div className="flex gap-1">
            <Link to="/contact" className={pillCls(true)}>contact</Link>
            <button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)} className={pillCls(false)}>
              {open ? 'close' : 'menu'}
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
                {[{ label: 'home', to: '/' }, ...NAV].map((n) => (
                  <Link key={n.to} to={n.to} className={pillCls(false)} style={pathname === n.to ? { background: '#e2e2e2' } : undefined}>{n.label}</Link>
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
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);
  if (pathname === '/contact') return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[65]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <Link to="/contact" className={darkPillCls}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" aria-hidden />
            Contact me
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  const groups = [
    { title: 'Work', links: [{ l: 'UX/UI Design', to: '/work/ux-ui' }, { l: 'Social Media Ads', to: '/work/social-media-ads' }, { l: 'Social Media Motion', to: '/work/social-media-motion' }] },
    { title: 'Studio', links: [{ l: 'Services', to: '/services' }, { l: 'Contact', to: '/contact' }, { l: 'Home', to: '/' }] },
  ];
  const ext = [
    { l: 'LinkedIn', href: 'https://www.linkedin.com/in/samole/' },
    { l: 'Behance', href: 'https://www.behance.net/samole' },
    { l: 'Instagram', href: 'https://www.instagram.com/areuli.design/' },
    { l: 'Upwork', href: 'https://www.upwork.com/freelancers/~0163986e2d8967d783' },
  ];
  return (
    <footer className="px-5 sm:px-8 pt-24 pb-28 text-[14px]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-[#9a9a9a] mb-3">{g.title}</div>
            <ul className="space-y-1.5">
              {g.links.map((x) => <li key={x.to}><Link to={x.to} className="text-[#111] hover:text-[#6f6f6f] transition-colors">{x.l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div className="text-[#9a9a9a] mb-3">Elsewhere</div>
          <ul className="space-y-1.5">
            {ext.map((x) => <li key={x.l}><a href={x.href} target="_blank" rel="noopener noreferrer" className="text-[#111] hover:text-[#6f6f6f] transition-colors">{x.l} ↗</a></li>)}
          </ul>
        </div>
        <div>
          <div className="text-[#9a9a9a] mb-3">Say hello</div>
          <a href={`mailto:${EMAIL}`} className="text-[#111] hover:text-[#6f6f6f] transition-colors break-all">{EMAIL}</a>
          <div className="text-[#6f6f6f] mt-1.5">Tbilisi, Georgia</div>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap justify-between gap-2 text-[#9a9a9a] text-[13px]">
        <span>Designed and developed by Salome Mosiava</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

/** Light shell for the redesigned pages: corner pills, floating CTA, footer */
export function BakedShell({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  // Honour the system setting as the starting point
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
  }, []);

  return (
    <PauseCtx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <div className="baked min-h-screen bg-white text-[#111] antialiased" style={{ fontFamily: T.font, colorScheme: 'light' }}>
        <TopNav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingCta />
        <style>{`
          @font-face { font-family: 'Avenir Next Georgian'; src: url('/fonts/avenir-next-georgian-regular.woff2') format('woff2'); font-weight: 100 700; font-style: normal; font-display: swap; }
          @font-face { font-family: 'Loos Wide Black'; src: url('/fonts/loos-wide-black.woff2') format('woff2'); font-weight: 800 900; font-style: normal; font-display: swap; }
          html:has(.baked), html:has(.baked) body { background: #fff; color-scheme: light; }
          .baked ::selection { background: #111; color: #fff; }
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
