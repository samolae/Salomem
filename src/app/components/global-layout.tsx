import { Outlet, useLocation, useNavigate } from 'react-router';
import { useTheme } from './theme-provider';
import { useActiveSection } from './active-section-context';
import { Home, Briefcase, Mail, Layers, Image, Video } from 'lucide-react';
import {
  ScrollProgress,
  LiquidMeshBackground,
  CursorGlow,
  FloatingParticles,
  MorphingBlob,
  LiquidCursor,
} from './animated-helpers';

const F = {
  body: '"Manrope", "Inter", sans-serif',
};

const bottomNavItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'ux-ui', label: 'UX/UI', icon: Layers, path: '/work/ux-ui' },
  { id: 'ads', label: 'Ads', icon: Image, path: '/work/social-media-ads' },
  { id: 'motion', label: 'Motion', icon: Video, path: '/work/social-media-motion' },
  { id: 'contact', label: 'Contact', icon: Mail, path: '/contact' },
];

function MobileBottomBar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const { activeSection } = useActiveSection();

  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/work/') || location.pathname === '/contact';

  const getActive = (item: typeof bottomNavItems[0]) => {
    if (item.id === 'contact' && location.pathname === '/contact') return true;
    if (isHomePage) {
      // On home page, use context-based activeSection
      if (item.id === 'home') return activeSection === 'home' || activeSection === 'services';
      if (item.id === 'contact') return activeSection === 'contact';
      if (item.id === 'ux-ui') return activeSection === 'ux-ui';
      if (item.id === 'ads') return activeSection === 'social-media-ads';
      if (item.id === 'motion') return activeSection === 'social-media-motion';
      return false;
    }
    // On other pages (case studies etc), nothing is active except home loosely
    return false;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[999] lg:hidden"
      style={{ fontFamily: F.body }}
    >
      {/* Blur backdrop */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#0b0b0e]/90' : 'bg-white/90'} backdrop-blur-xl`} />
      {/* Top border */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`} />

      <div className="relative flex items-stretch justify-around px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 10px)' }}>
        {bottomNavItems.map((item) => {
          const active = getActive(item);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 px-3 min-w-[60px] transition-colors duration-200 ${
                active
                  ? 'text-[#ed592b]'
                  : isDark ? 'text-[#5a5d6a] active:text-white/60' : 'text-zinc-400 active:text-zinc-600'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-b-full bg-[#ed592b]" />
              )}
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
              <span className={`text-[10px] tracking-[0.02em] ${active ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * GlobalLayout — wraps ALL routes with shared ambient assets:
 * scroll progress, mesh background, cursor glow, particles,
 * morphing blobs, film grain, and liquid cursor.
 */
export function GlobalLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const isContactPage = location.pathname === '/contact' || location.search.includes('section=contact');

  return (
    <div className={`${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#f5f5f5] text-zinc-900'} min-h-screen transition-colors duration-500 relative ${isContactPage ? '' : 'select-none'}`}>
      {/* Scroll progress */}
      <ScrollProgress color="#ed592b" />

      {/* Liquid Design System — Reactive mesh background */}
      <LiquidMeshBackground />

      {/* Cursor reactive ambient glow */}
      <CursorGlow color="rgba(237,89,43,0.04)" size={700} />

      {/* Floating particles */}
      <FloatingParticles count={15} color="rgba(237,89,43,0.06)" />

      {/* Morphing background blobs */}
      <MorphingBlob color="rgba(237,89,43,0.02)" className="-top-40 -right-40 z-[0]" />
      <MorphingBlob color="rgba(99,102,241,0.015)" className="top-[60%] -left-60 z-[0]" />

      {/* Film grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[55] opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Liquid Design System — Organic Cursor with velocity squash/stretch */}
      <LiquidCursor color="#ed592b" size={28} dotSize={4} />

      {/* Page content — add bottom padding for mobile nav */}
      <div className="pb-16 lg:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomBar />
    </div>
  );
}