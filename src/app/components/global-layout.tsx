import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './theme-provider';
import { useActiveSection } from './active-section-context';
import { Home, Mail, Layers, Image, Video } from 'lucide-react';
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
  const { activeSection, mobileDrawerOpen } = useActiveSection();

  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/work/') || location.pathname === '/contact';

  const getActive = (item: typeof bottomNavItems[0]) => {
    if (item.id === 'contact' && location.pathname === '/contact') return true;
    if (isHomePage) {
      if (item.id === 'home') return activeSection === 'home' || activeSection === 'services';
      if (item.id === 'contact') return activeSection === 'contact';
      if (item.id === 'ux-ui') return activeSection === 'ux-ui';
      if (item.id === 'ads') return activeSection === 'social-media-ads';
      if (item.id === 'motion') return activeSection === 'social-media-motion';
      return false;
    }
    return false;
  };

  return (
    <AnimatePresence>
      {!mobileDrawerOpen && (
        <motion.nav
          key="bottom-bar"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.6 }}
          className="fixed bottom-0 left-0 right-0 z-[60] md:hidden"
          style={{ fontFamily: F.body }}
        >
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{ backgroundColor: isDark ? 'rgba(11,11,14,0.9)' : 'rgba(255,255,255,0.9)' }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#e4e4e7' }}
          />
          <div className="relative flex items-stretch justify-around px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 10px)' }}>
            {bottomNavItems.map((item) => {
              const active = getActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center gap-1 py-2.5 px-3 min-w-[60px] transition-colors duration-200"
                  style={{ color: active ? '#ed592b' : isDark ? '#5a5d6a' : '#a1a1aa' }}
                >
                  {active && (
                    <motion.span
                      layoutId="bottomBarActive"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-b-full bg-[#ed592b]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
                  <span className="text-[10px] tracking-[0.02em]" style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/**
 * GlobalLayout — wraps ALL routes with shared ambient assets.
 * Heavy desktop-only effects (cursor, particles, mesh) are skipped on mobile
 * to improve INP and LCP on small devices.
 */
export function GlobalLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const isContactPage = location.pathname === '/contact' || location.search.includes('section=contact');

  // Detect mobile at render time to skip expensive animations on phones
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;

  return (
    <div
      className="min-h-screen transition-colors duration-500 relative"
      style={{ backgroundColor: isDark ? '#0a0a0c' : '#f5f5f5', color: isDark ? '#ffffff' : '#18181b' }}
    >
      {/* Scroll progress */}
      <ScrollProgress color="#ed592b" />

      {/* Desktop-only heavy effects — skipped on mobile to protect INP and LCP */}
      {!isMobile && (
        <>
          <LiquidMeshBackground />
          <CursorGlow color="rgba(237,89,43,0.04)" size={700} />
          <FloatingParticles count={15} color="rgba(237,89,43,0.06)" />
          <MorphingBlob color="rgba(237,89,43,0.02)" className="-top-40 -right-40 z-[0]" />
          <MorphingBlob color="rgba(99,102,241,0.015)" className="top-[60%] -left-60 z-[0]" />
          <LiquidCursor color="#ed592b" size={28} dotSize={4} />
        </>
      )}

      {/* Page content */}
      <div className="pb-16 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomBar />
    </div>
  );
}
