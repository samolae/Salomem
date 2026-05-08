import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, ChevronDown, Monitor, Clock, Smartphone, BookOpen } from 'lucide-react';
import { useTheme } from './theme-provider';
import { ShineText } from './animated-helpers';

/* ─── AURUM Screen Imports ─────────────────────────────────────────── */
const screenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041357/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro.webp';
const screenProfile = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040904/259c40c789033b795135eecd13ffa040e408d1d8_g0b0ks.webp';
const screenLogin = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenQR = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenTransfer = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenLanding = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040819/33bde90ba43fe3b089e907b814ef1018193651cd_hptwri.webp';
const screenVerify = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';

const BRAND = {
  headingFont: '"BPG LE Studio 02 Caps", "Space Grotesk", sans-serif',
  bodyFont: '"TBC Contractica", "Inter", sans-serif',
};

/* ─── Noise Texture SVG ──────────────────────────────────────────── */
const NoiseOverlay = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-[1]" xmlns="http://www.w3.org/2000/svg">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

/* ─── Floating UI Element Snippets ─────────────────────────────────── */
const FloatingChip = ({ text, delay, x, y, isDark }: { text: string; delay: number; x: string; y: string; isDark: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="absolute hidden xl:block z-30"
    style={{ left: x, top: y }}
  >
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3 + delay, ease: 'easeInOut' }}
      className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.15em] backdrop-blur-xl shadow-lg ${
        isDark ? 'bg-white/[0.04] border border-white/[0.08] text-[#9295A6]' : 'bg-black/[0.03] border border-black/[0.06] text-zinc-400'
      }`}
    >
      {text}
    </motion.div>
  </motion.div>
);

const FloatingBadge = ({ icon, label, value, delay, x, y, isDark }: { icon: string; label: string; value: string; delay: number; x: string; y: string; isDark: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="absolute hidden xl:block z-30"
    style={{ left: x, top: y }}
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 4 + delay * 0.5, ease: 'easeInOut' }}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-2xl shadow-2xl ${
        isDark ? 'bg-[#121318]/80 border border-white/[0.06]' : 'bg-white/80 border border-zinc-200/60'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <div>
        <div className={`text-[8px] uppercase tracking-wider ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{label}</div>
        <div className={`text-[11px] ${isDark ? 'text-white' : 'text-zinc-900'}`}>{value}</div>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── 3D Perspective Card ──────────────────────────────────────────── */
const PerspectiveCard = ({
  src,
  alt,
  className = '',
  rotateX = 0,
  rotateY = 0,
  z = 0,
  delay = 0,
  mouseX,
  mouseY,
}: {
  src: string;
  alt: string;
  className?: string;
  rotateX?: number;
  rotateY?: number;
  z?: number;
  delay?: number;
  mouseX: any;
  mouseY: any;
}) => {
  const springConfig = { stiffness: 50, damping: 30 };
  const rx = useSpring(useTransform(mouseY, [-0.5, 0.5], [rotateX + 3, rotateX - 3]), springConfig);
  const ry = useSpring(useTransform(mouseX, [-0.5, 0.5], [rotateY - 3, rotateY + 3]), springConfig);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: rotateX + 10, rotateY }}
      animate={{ opacity: 1, y: 0, rotateX, rotateY }}
      transition={{ delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: rx,
        rotateY: ry,
        translateZ: z,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.08] bg-[#080B0F]">
        <img src={src} alt={alt} className="w-full block" />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── HERO COVER COMPONENT ────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
export function HeroCover() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  const { scrollYProgress } = useScroll({ layoutEffect: false });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.06], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.06], [0, 100]);
  const mockupY = useTransform(scrollYProgress, [0, 0.1], [0, -60]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.04]);

  // Mouse-driven 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.section
        className="relative flex flex-col overflow-x-hidden py-16 lg:py-24"
      >
        <NoiseOverlay />

        {/* ─── Animated Background Orbs ─────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: `radial-gradient(${isDark ? 'rgba(213,154,4,0.3)' : 'rgba(213,154,4,0.15)'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />

          {/* Main orb */}
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
            className="absolute top-[10%] left-[30%] w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(213,154,4,0.06) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -30, 40, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
            className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,199,1,0.04) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, 20, -10, 0], y: [0, -15, 25, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
            className="absolute top-[50%] left-[5%] w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(213,154,4,0.03) 0%, transparent 70%)' }}
          />

          {/* Accent lines */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[45%] left-0 w-full h-px origin-left"
            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(213,154,4,0.06)' : 'rgba(213,154,4,0.08)'}, transparent)` }}
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.8, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[65%] left-0 w-full h-px origin-right"
            style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(213,154,4,0.04)' : 'rgba(213,154,4,0.06)'}, transparent)` }}
          />
        </div>

        {/* ─── Floating UI Elements ──────────────────────────────────── */}
        <FloatingChip text="Verified" delay={1.6} x="6%" y="30%" isDark={isDark} />
        <FloatingChip text="0.1% Fee" delay={2.0} x="90%" y="34%" isDark={isDark} />
        <FloatingBadge icon="₿" label="BTC/GEL" value="$43,267" delay={1.8} x="3%" y="58%" isDark={isDark} />
        <FloatingBadge icon="Ξ" label="ETH" value="+2.34%" delay={2.2} x="87%" y="62%" isDark={isDark} />
        <FloatingChip text="KYC Complete" delay={2.4} x="10%" y="78%" isDark={isDark} />

        {/* ─── Content ──────────────────────────────────────────────── */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6 lg:px-12 w-full py-8 lg:py-12">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-zinc-200 bg-white/60'} backdrop-blur-xl`}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#D59A04] animate-pulse" />
              <span className={`text-[10px] tracking-[0.25em] uppercase ${mt}`}>Case Study</span>
              <div className={`w-px h-3 ${isDark ? 'bg-white/10' : 'bg-zinc-300'}`} />
              <span className="text-[10px] tracking-[0.15em] text-[#D59A04] uppercase">2024</span>
            </div>
          </motion.div>

          {/* Massive Title */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
          >
            <h1
              className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] xl:text-[240px] tracking-[-0.04em] leading-[0.8] select-none"
              style={{ fontFamily: BRAND.headingFont }}
            >
              <ShineText>AURUM</ShineText>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-6"
          >
            <p className="text-lg sm:text-xl lg:text-2xl tracking-wide" style={{ fontFamily: BRAND.headingFont }}>
              Crypto Exchange Platform
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className={`text-sm lg:text-base ${mt} max-w-lg mx-auto leading-relaxed mb-8`}
          >
            A regulated crypto exchange designed for complex onboarding, verification logic, and online/offline transaction flows.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 lg:gap-0 mb-8"
          >
            {[
              { n: '196', l: 'Screens', icon: <Monitor size={13} /> },
              { n: '12', l: 'Weeks', icon: <Clock size={13} /> },
              { n: '2', l: 'Platforms', icon: <Smartphone size={13} /> },
              { n: '3', l: 'UX Stories', icon: <BookOpen size={13} /> },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center">
                {i > 0 && <div className={`hidden lg:block w-px h-10 mx-8 ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`} />}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-zinc-100 border border-zinc-200/60'}`}>
                    <span className="text-[#D59A04]">{s.icon}</span>
                  </div>
                  <div>
                    <div className="text-xl lg:text-2xl text-[#D59A04] leading-none" style={{ fontFamily: BRAND.headingFont }}>{s.n}</div>
                    <div className={`text-[9px] uppercase tracking-[0.15em] ${mt} mt-0.5`}>{s.l}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center gap-5"
          >
            <motion.a
              href="#overview"
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(213,154,4,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D59A04] to-[#FFC701] text-black text-sm group overflow-hidden"
            >
              <span className="relative z-10">Explore Project</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FFC701] to-[#D59A04]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronDown size={18} className="text-[#D59A04]/40" />
            </motion.div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mt-8"
          >
            {['UX Research', 'UI Design', 'Design System', 'Prototyping', 'FinTech', 'Regulated'].map((tag) => (
              <span key={tag} className={`text-[8px] uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isDark ? 'bg-white/[0.02] text-[#9295A6]/60 border border-white/[0.04]' : 'bg-black/[0.02] text-zinc-400 border border-zinc-200/60'}`}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ─── 3D Mockup Composition ─────────────────────────────────── */}
        <motion.div
          style={{ y: mockupY, scale: mockupScale }}
          className="relative z-10 w-full max-w-[1000px] mx-auto px-4 lg:px-8 pb-0"
        >
          <div className="relative" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
            {/* Single Hero Screen — 3D perspective with glow */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 12, filter: 'blur(16px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 4, filter: 'blur(0px)' }}
              transition={{ delay: 0.6, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mx-auto"
            >
              {/* Ambient glow behind screen */}
              <div className="absolute -inset-8 rounded-3xl opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(213,154,4,0.15) 0%, transparent 70%)' }} />
              <PerspectiveCard
                src={screenExchange}
                alt="AURUM Exchange Dashboard"
                className="relative z-10"
                rotateX={4}
                rotateY={0}
                delay={0}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            </motion.div>
          </div>

          {/* Fade-out gradient at the bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 z-30 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${isDark ? '#080B0F' : '#F3F3F3'})` }}
          />
        </motion.div>
      </motion.section>
    </>
  );
}