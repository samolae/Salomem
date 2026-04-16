import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ArrowLeft, Search, Layers, Image, Video, Briefcase } from 'lucide-react';
import { useTheme } from './theme-provider';
import { FadeIn, MagneticWrap } from './animated-helpers';

const F = {
  heading: '"Syne", "Space Grotesk", sans-serif',
  body: '"Manrope", "Inter", sans-serif',
};

const quickLinks = [
  { to: '/', label: 'Home', icon: <Home size={14} />, desc: 'Back to portfolio' },
  { to: '/work/ux-ui', label: 'UX/UI Design', icon: <Layers size={14} />, desc: 'Case studies & interfaces' },
  { to: '/work/social-media-ads', label: 'Social Media Ads', icon: <Image size={14} />, desc: 'Brand campaigns' },
  { to: '/work/social-media-motion', label: 'Motion Design', icon: <Video size={14} />, desc: 'Animated reels' },
  { to: '/projects/aurum', label: 'AURUM', icon: <Briefcase size={14} />, desc: 'Crypto exchange platform' },
  { to: '/projects/schenker', label: 'SCHENKER', icon: <Briefcase size={14} />, desc: 'Logistics platform' },
];

/* Animated glitch text */
const GlitchText = ({ text }: { text: string }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <span className={glitch ? 'opacity-0' : 'opacity-100'}>{text}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-[#ed592b] translate-x-[2px] translate-y-[-2px] opacity-70">{text}</span>
          <span className="absolute inset-0 text-[#3b82f6] translate-x-[-2px] translate-y-[2px] opacity-50">{text}</span>
        </>
      )}
    </span>
  );
};

export function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const bg2 = isDark ? 'bg-white/[0.03]' : 'bg-zinc-50';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
      <div className="max-w-lg w-full">
        {/* 404 number */}
        <FadeIn>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative inline-block mb-6"
            >
              <span
                className="text-[120px] sm:text-[160px] tracking-[-0.06em] leading-none"
                style={{
                  fontFamily: F.heading,
                  fontWeight: 800,
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                4<GlitchText text="0" />4
              </span>

              {/* Accent dot */}
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#ed592b]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`text-[18px] sm:text-[22px] tracking-[-0.02em] mb-2 ${isDark ? 'text-white/90' : 'text-zinc-800'}`}
              style={{ fontFamily: F.heading, fontWeight: 600 }}
            >
              Page not found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`text-[13px] ${mt} max-w-xs mx-auto`}
              style={{ fontFamily: F.body }}
            >
              The page{' '}
              <code className={`text-[11px] px-1.5 py-0.5 rounded ${isDark ? 'bg-white/[0.06] text-white/40' : 'bg-zinc-100 text-zinc-500'}`}>
                {location.pathname}
              </code>{' '}
              doesn't exist or has been moved.
            </motion.p>
          </div>
        </FadeIn>

        {/* Quick links */}
        <FadeIn delay={0.2}>
          <div className={`rounded-xl ${bg2} border ${border} p-4 mb-4`}>
            <div className="flex items-center gap-2 mb-3">
              <Search size={11} className={mt} />
              <span className={`text-[9px] uppercase tracking-[0.15em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                Quick navigation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickLinks.map((link, i) => (
                <MagneticWrap key={link.to} strength={0.1}>
                  <Link to={link.to}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all min-h-[44px] group focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                        isDark
                          ? 'hover:bg-white/[0.04] text-[#7a7d8a] hover:text-white/80'
                          : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDark ? 'bg-white/[0.04] group-hover:bg-[#ed592b]/15 group-hover:text-[#ed592b]' : 'bg-zinc-100 group-hover:bg-[#ed592b]/10 group-hover:text-[#ed592b]'
                      }`}>
                        {link.icon}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[12px] block ${isDark ? 'text-white/70 group-hover:text-white' : 'text-zinc-600 group-hover:text-zinc-900'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                          {link.label}
                        </span>
                        <span className={`text-[10px] block truncate ${mt}`} style={{ fontFamily: F.body }}>
                          {link.desc}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </MagneticWrap>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Back button */}
        <FadeIn delay={0.4}>
          <div className="flex items-center justify-center gap-3">
            <MagneticWrap strength={0.15}>
              <motion.button
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] border transition-all min-h-[44px] focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                  isDark
                    ? 'border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.12]'
                    : 'border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50'
                }`}
                style={{ fontFamily: F.body, fontWeight: 500 }}
              >
                <ArrowLeft size={13} />
                Go back
              </motion.button>
            </MagneticWrap>

            <MagneticWrap strength={0.15}>
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(237,89,43,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ed592b] text-white text-[12px] min-h-[44px] focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.5),0_0_0_4px_rgba(237,89,43,0.2)]"
                  style={{ fontFamily: F.body, fontWeight: 500 }}
                >
                  <Home size={13} />
                  Home
                </motion.div>
              </Link>
            </MagneticWrap>
          </div>
        </FadeIn>

        {/* Status */}
        <FadeIn delay={0.5}>
          <div className="text-center mt-8">
            <span className={`text-[9px] font-mono ${mt}`}>
              HTTP 404 · {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
