import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, ArrowLeftRight, Home,
  Lock, Shield, UserCheck, QrCode, MapPin, Eye, Zap, PenTool,
  CheckCircle, Layers, ChevronDown, ChevronUp,
  Monitor, Component, Droplets, Smartphone, BookOpen, Palette, Search, Users, Figma,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { FadeIn, CountUp, GlowCard, ShineText, TextReveal, StaggerChildren, StaggerItem, ScrollProgress, MagneticWrap, AnimatedDivider, ScaleOnScroll, SmoothSection, ParallaxFloat, ScrollRevealScale } from './animated-helpers';
import { BrowserMockup, PhoneMockup } from './device-mockup';
import { DashboardPreview, ExchangeWidget } from './dashboard-preview';
import { DesignSystemFull } from './color-palette';
import { UXStories } from './ux-stories';
import { HeroCover } from './hero-cover';
import { NextProjectRecommendation } from './next-project';
import { CaseStudySectionNav } from './case-study-nav';
import { AurumSEO } from './seo';
import aurumSvgPaths from '../../imports/svg-wj69ey5ojj';

// ─── Aurum Screen Imports ───────────────────────────────────
const screenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041357/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro.webp';
const screenProfile = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040904/259c40c789033b795135eecd13ffa040e408d1d8_g0b0ks.webp';
const screenLogin = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenQR = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenTransfer = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenLanding = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040819/33bde90ba43fe3b089e907b814ef1018193651cd_hptwri.webp';
const screenVerify = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const designSystemSheet = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773321666/aurumn_design_iap0vm.png';

/* ─── Cloudinary Key Screens ─────────────────────────────────────── */
const cloudScreenHomeDark = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016538/homedark_zieimk.webp';
const cloudScreenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016554/exchange_ggykpz.webp';
const cloudScreenLogin = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016548/login-_au5gne.webp';
const cloudScreenAuth = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016553/authentication_r7las2.webp';
const cloudScreenQR = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774016553/qr_vsfslb.webp';

/* ─── Brand Tokens ─────────────────────────────────────────────────── */
const BRAND = {
  gold: '#D59A04',
  goldLight: '#F0C040',
  goldDark: '#A67B03',
  darkBg: '#080B0F',
  surface: '#121318',
  lightBg: '#F3F3F3',
  neutral: '#9295A6',
  headingFont: '"Syne", "Space Grotesk", sans-serif',
  bodyFont: '"Manrope", "Inter", sans-serif',
  portfolioAccent: '#ed592b',
};

/* ─── Shared Components ────────────────────────────────────────── */
const Divider = () => {
  const { theme } = useTheme();
  return <AnimatedDivider color={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} />;
};

const SectionTag = ({ number, label }: { number: string; label: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-[#D59A04] text-sm font-mono">{number}</span>
      <div className="w-8 h-px bg-[#D59A04]/40" />
      <span className={`text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{label}</span>
    </div>
  );
};

/* ─── Screen Gallery Item ─────────────────────────────────────── */
const ScreenCard = ({
  src, label, description, icon, delay = 0, isDark = true,
}: {
  src: string; label: string; description: string; icon: React.ReactNode; delay?: number; isDark?: boolean;
}) => (
  <FadeIn delay={delay}>
    <div className="group">
      <div className={`rounded-xl overflow-hidden mb-4 border shadow-lg ${isDark ? 'border-white/[0.06] shadow-black/30' : 'border-zinc-200 shadow-zinc-200/50'}`}>
        <img src={src} alt={label} width="1440" height="900" className="w-full block group-hover:scale-[1.02] transition-transform duration-700" />
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isDark ? 'bg-[#D59A04]/10' : 'bg-amber-50'}`}>
          <span className="text-[#D59A04]">{icon}</span>
        </div>
        <div>
          <h4 className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{label}</h4>
          <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{description}</p>
        </div>
      </div>
    </div>
  </FadeIn>
);

/* ─── Scroll To Top Button ──────────────────────────────────────── */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl transition-colors group focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.5)] ${
            isDark
              ? 'bg-[#D59A04]/90 hover:bg-[#D59A04] shadow-[#D59A04]/20 text-black'
              : 'bg-[#D59A04] hover:bg-[#D59A04]/90 shadow-[#D59A04]/30 text-white'
          }`}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/* ─── AURUM CASE STUDY PAGE ──────────────────────────────────── */
/* ═════════════════════════════════════════════════════════════════ */
export function AurumCaseStudy() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const bg = isDark ? 'bg-[#080B0F] text-white' : 'bg-[#F3F3F3] text-zinc-900';
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const bt = isDark ? 'text-zinc-300' : 'text-zinc-600';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const cardBg = isDark ? 'bg-[#121318]' : 'bg-white';

  return (
    <div className={`${bg} min-h-screen transition-colors duration-500 relative`} style={{ fontFamily: BRAND.bodyFont }}>
      <AurumSEO />
      {/* Scroll to top */}
      <ScrollToTopButton />
      {/* Section navigator */}
      <CaseStudySectionNav
        accentColor="#D59A04"
        sections={[
          { id: 'story', label: 'Story' },
          { id: 'overview', label: 'Overview' },
          { id: 'challenge', label: 'Challenge' },
          { id: 'screens', label: 'Screens' },
          { id: 'ux-stories', label: 'UX Stories' },
          { id: 'previews', label: 'Previews' },
          { id: 'design', label: 'Design System' },
          { id: 'approach', label: 'Approach' },
          { id: 'outcome', label: 'Outcome' },
        ]}
      />
      {/* Cursor */}
      <motion.div className="fixed w-8 h-8 border border-[#D59A04]/60 rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block" animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} />
      <motion.div className="fixed w-1.5 h-1.5 bg-[#D59A04] rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block" animate={{ x: mousePosition.x - 3, y: mousePosition.y - 3 }} transition={{ type: 'spring', damping: 50, stiffness: 400 }} />

      {/* ─── NAV ────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl ${isDark ? 'bg-[#080B0F]/80 border-b border-white/[0.04]' : 'bg-white/80 border-b border-zinc-200/60'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 min-h-[44px] focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isDark ? 'text-[#9295A6] hover:text-white hover:bg-white/[0.04]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'} transition-colors`}
            >
              <ArrowLeft size={15} />
              <span className="text-[12px] tracking-wide">Back to Portfolio</span>
            </motion.button>
            <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
            <div className="flex items-center gap-2.5">
              <svg className="h-[28px] w-auto" fill="none" viewBox="0 0 172.683 42">
                <g clipPath="url(#aurumNavClip)">
                  <g>
                    <path d={aurumSvgPaths.p6257700} fill="white" />
                    <path d={aurumSvgPaths.p3d43c00} fill="white" />
                    <path d={aurumSvgPaths.p31dbf400} fill="white" />
                    <path d={aurumSvgPaths.p2e633f80} fill="white" />
                    <path d={aurumSvgPaths.p1daaf900} fill="white" />
                  </g>
                  <path d={aurumSvgPaths.p1ca9d680} fill="white" />
                  <g>
                    <path d={aurumSvgPaths.p3949f800} fill="white" />
                    <path d={aurumSvgPaths.p26292900} fill="white" />
                    <path d={aurumSvgPaths.pe6c6980} fill="white" />
                    <path d={aurumSvgPaths.p195dbbf0} fill="white" />
                    <path d={aurumSvgPaths.p1255fc00} fill="white" />
                    <path d={aurumSvgPaths.p1ca57680} fill="white" />
                    <path d={aurumSvgPaths.p1858a700} fill="white" />
                    <path d={aurumSvgPaths.p370a4300} fill="white" />
                    <path d={aurumSvgPaths.p221cfb80} fill="white" />
                    <path d={aurumSvgPaths.p2ce20f00} fill="white" />
                    <path d={aurumSvgPaths.p8c7a300} fill="white" />
                    <path d={aurumSvgPaths.p186acb00} fill="white" />
                    <path d={aurumSvgPaths.p10ae5200} fill="white" />
                    <path d={aurumSvgPaths.p165ebf60} fill="white" />
                  </g>
                  <g>
                    <path d={aurumSvgPaths.p3b4fec80} fill="#D59A04" />
                    <path d={aurumSvgPaths.p3c3e7800} fill="#D59A04" />
                  </g>
                </g>
                <defs>
                  <clipPath id="aurumNavClip">
                    <rect fill="white" height="42" width="172.683" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex gap-5">
              {['Overview', 'Screens', 'Design'].map((item) => (
                <motion.a key={item} href={`#${item.toLowerCase()}`} whileHover={{ y: -1 }} className={`text-[12px] tracking-wide ${isDark ? 'text-[#9295A6] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'} transition-colors`}>{item}</motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ─── HERO ────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ─── PROJECT META BAR ─────────────────────────────────────────── */}
      <div className={`relative z-20 pt-[72px] border-b ${isDark ? 'border-white/[0.06] bg-[#121318]/30 backdrop-blur-xl' : 'border-zinc-200 bg-white/50 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: 'Client', value: 'AURUM' },
              { label: 'Role', value: 'Lead UX/UI Designer' },
              { label: 'Platform', value: 'Web & Mobile' },
              { label: 'Industry', value: 'FinTech / Crypto' },
              { label: 'Tools', value: 'Figma, Protopie' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
              >
                <span className={`text-[9px] uppercase tracking-[0.2em] block mb-1 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{item.label}</span>
                <span className={`text-[13px] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <HeroCover />

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── STORYTELLING: Hook → Friction → Pivot → Proof ──────────── */}
      <section id="story" className="relative py-20 lg:py-28 px-6 lg:px-12 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {[
            {
              step: 'Hook',
              number: '00.1',
              text: 'What if crypto trading could feel as simple as sending a message — secure, fast, and beautiful?',
              accent: BRAND.gold,
              icon: <Eye size={16} />,
            },
            {
              step: 'Friction',
              number: '00.2',
              text: 'Existing crypto platforms overwhelm users with cluttered dashboards, confusing charts, and intimidating verification flows. New users abandon. Experienced traders settle for poor UX.',
              accent: '#F87171',
              icon: <Zap size={16} />,
            },
            {
              step: 'Pivot',
              number: '00.3',
              text: 'We designed AURUM around progressive disclosure — showing only what matters at each step, with guided onboarding, contextual education, and confidence-building visual feedback.',
              accent: '#10B981',
              icon: <PenTool size={16} />,
            },
            {
              step: 'Proof',
              number: '00.4',
              text: '196 screens. 64+ components. Mobile-first responsive design. End-to-end crypto exchange platform covering trading, transfers, verification, and portfolio management.',
              accent: BRAND.goldLight,
              icon: <CheckCircle size={16} />,
            },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.1}>
              <div className={`flex items-start gap-5 mb-10 last:mb-0`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${item.accent}15`, color: item.accent }}
                  >
                    {item.icon}
                  </div>
                  {i < 3 && <div className={`w-px h-12 ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`} />}
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono" style={{ color: item.accent }}>{item.number}</span>
                    <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${isDark ? 'bg-white/[0.03] text-white/40' : 'bg-zinc-100 text-zinc-400'}`}>{item.step}</span>
                  </div>
                  <p className={`text-[15px] lg:text-[17px] leading-relaxed ${i === 0 ? (isDark ? 'text-white' : 'text-zinc-900') : bt}`} style={{ fontFamily: i === 0 ? BRAND.headingFont : BRAND.bodyFont }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── OVERVIEW ─────────────────────────────────────────────────── */}
      <section id="overview" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="01" label="Project Overview" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-5xl leading-tight mb-6" style={{ fontFamily: BRAND.headingFont }}>
              Redefining <span className="text-[#D59A04]">crypto</span> trading<br />experience
            </h2>
            <div className="max-w-3xl">
              <p className={`${bt} leading-relaxed mb-4`}>
                AURUM is a full-featured cryptocurrency exchange platform designed to make digital asset trading accessible, secure, and visually refined. The platform encompasses everything from onboarding and KYC verification to real-time trading, portfolio management, and peer-to-peer transfers.
              </p>
              <p className={`${mt} text-sm leading-relaxed`}>
                Every interaction was carefully crafted to reduce friction and build trust — transforming complex financial operations into intuitive, confidence-inspiring experiences.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
              {[
                { value: 196, suffix: '', label: 'Screens', sub: 'Full Product', icon: <Monitor size={20} />, color: '#D59A04' },
                { value: 64, suffix: '', label: 'Components', sub: 'Design System', icon: <Component size={20} />, color: '#F0C040' },
                { value: 8, suffix: '', label: 'Color Tokens', sub: 'Brand Palette', icon: <Droplets size={20} />, color: '#D59A04' },
                { value: 2, suffix: '', label: 'Platforms', sub: 'Mobile & Desktop', icon: <Smartphone size={20} />, color: '#9295A6' },
              ].map((m) => (
                <motion.div
                  key={m.label}
                  whileHover={{ y: -4 }}
                  className={`relative p-5 lg:p-6 rounded-2xl border overflow-hidden group cursor-default ${cb} ${cardBg}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50'} group-hover:scale-110 transition-transform duration-300`}>
                      <span style={{ color: m.color }}>{m.icon}</span>
                    </div>
                    <div className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${isDark ? 'bg-white/[0.03] text-[#9295A6]/60' : 'bg-zinc-100 text-zinc-400'}`}>{m.sub}</div>
                  </div>
                  <div className="text-3xl lg:text-4xl mb-1 leading-none" style={{ fontFamily: BRAND.headingFont, color: m.color }}>
                    <CountUp target={m.value} suffix={m.suffix} />
                  </div>
                  <div className={`text-[11px] tracking-wide ${isDark ? 'text-white/70' : 'text-zinc-600'}`}>{m.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── CHALLENGE & SOLUTION ─────────────────────────────────────── */}
      <section id="challenge" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="02" label="Challenge & Solution" /></FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn>
              <GlowCard isDark={isDark} className="h-full">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#CC0000]/10 flex items-center justify-center"><Zap size={16} className="text-[#CC0000]" /></div>
                    <h3 className="text-xl text-[#D59A04]" style={{ fontFamily: BRAND.headingFont }}>The Challenge</h3>
                  </div>
                  <p className={`text-[13px] ${bt} leading-relaxed mb-5`}>
                    Crypto platforms struggle with overwhelming complexity, creating barriers for new users while frustrating experienced traders.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      'Cluttered, intimidating trading interfaces',
                      'Complex multi-step KYC verification',
                      'Poor mobile trading experience',
                      'Lack of trust-building visual cues',
                      'Confusing navigation between features'
                    ].map((item, i) => (
                      <li key={i} className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                        <span className="text-[#CC0000] mt-0.5 text-[10px]">&#x2715;</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </FadeIn>
            <FadeIn delay={0.1}>
              <GlowCard isDark={isDark} className="h-full">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#D59A04]/10 flex items-center justify-center"><Shield size={16} className="text-[#D59A04]" /></div>
                    <h3 className="text-xl text-[#D59A04]" style={{ fontFamily: BRAND.headingFont }}>The Solution</h3>
                  </div>
                  <p className={`text-[13px] ${bt} leading-relaxed mb-5`}>
                    A clean, confidence-inspiring interface built around progressive disclosure and trust-first design principles.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      'Simplified trading with contextual data',
                      'Guided step-by-step verification flow',
                      'Mobile-first responsive architecture',
                      'Security indicators at every touchpoint',
                      'Intuitive portfolio & transfer management'
                    ].map((item, i) => (
                      <li key={i} className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                        <span className="text-[#D59A04] mt-0.5 text-[10px]">&#x2713;</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </FadeIn>
          </div>

          {/* ── Trust Architecture · Show-Don't-Tell visual ── */}
          <FadeIn delay={0.2}>
            <div className={`mt-14 lg:mt-16 rounded-2xl border overflow-hidden transition-all duration-500 hover:border-[#D59A04]/25 hover:shadow-2xl hover:shadow-[#D59A04]/10 ${isDark ? 'bg-[#121318]/60 border-white/[0.06]' : 'bg-white border-zinc-200'}`}>
              {/* Header */}
              <div className={`px-7 lg:px-10 pt-7 pb-5 border-b ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-md bg-[#D59A04]/15 flex items-center justify-center">
                    <Shield size={14} className="text-[#D59A04]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#D59A04] font-medium">Trust Architecture</span>
                </div>
                <h3 className={`text-2xl lg:text-3xl tracking-[-0.02em] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>
                  Four pillars · engineered into every touchpoint
                </h3>
              </div>

              {/* 4 pillars */}
              <div className={`grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x ${isDark ? 'divide-white/[0.06]' : 'divide-zinc-100'}`}>
                {[
                  { icon: <Shield size={18} />,      name: 'Security',   practice: 'Multi-layer auth, KYC, 2FA, biometric',  metric: 'Every transaction · Every login' },
                  { icon: <Eye size={18} />,         name: 'Clarity',    practice: 'Progressive disclosure, no clutter',     metric: 'One primary action per screen' },
                  { icon: <Zap size={18} />,         name: 'Speed',      practice: 'Single-click trade execution',           metric: 'Sub-100ms response targets' },
                  { icon: <CheckCircle size={18} />, name: 'Confidence', practice: 'Verified status at every step',          metric: 'Visible audit trail' },
                ].map((p) => (
                  <div key={p.name} className={`group/p p-6 lg:p-7 cursor-default transition-colors duration-300 ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-zinc-50'}`}>
                    <div className="w-9 h-9 rounded-lg bg-[#D59A04]/10 flex items-center justify-center mb-4 text-[#D59A04] transition-transform duration-300 group-hover/p:scale-110 group-hover/p:rotate-3">
                      {p.icon}
                    </div>
                    <div className={`text-[14px] mb-2 transition-colors duration-300 group-hover/p:text-[#D59A04] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>{p.name}</div>
                    <div className={`text-[12px] leading-relaxed mb-3 ${bt}`}>{p.practice}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-[#D59A04]/70">{p.metric}</div>
                  </div>
                ))}
              </div>

              {/* Footer stats */}
              <div className={`px-7 lg:px-10 py-4 border-t bg-[#D59A04]/[0.03] ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className={`text-[12px] ${bt}`} style={{ fontFamily: BRAND.bodyFont }}>How trust is engineered into</span>
                  <div className="flex items-center gap-5 text-[12px]">
                    <span className="group/n cursor-default"><span className="text-[#D59A04] font-mono transition-transform inline-block group-hover/n:scale-110" style={{ fontWeight: 700 }}>196</span> <span className={mt}>screens</span></span>
                    <span className="group/n cursor-default"><span className="text-[#D59A04] font-mono transition-transform inline-block group-hover/n:scale-110" style={{ fontWeight: 700 }}>64+</span> <span className={mt}>components</span></span>
                    <span className="group/n cursor-default"><span className="text-[#D59A04] font-mono transition-transform inline-block group-hover/n:scale-110" style={{ fontWeight: 700 }}>3</span> <span className={mt}>surfaces</span></span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── KEY SCREENS ─────────────────────────────────────────────── */}
      <section id="screens" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="03" label="Key Screens" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-4" style={{ fontFamily: BRAND.headingFont }}>
              Core <span className="text-[#D59A04]">experiences</span>
            </h2>
            <p className={`${bt} max-w-xl mb-16 leading-relaxed text-sm`}>
              From onboarding to portfolio management — each screen was designed to feel intuitive while handling complex financial data with care and clarity.
            </p>
          </FadeIn>

          <div className="space-y-20">
            {[
              {
                num: '01', icon: <Home size={16} className="text-[#D59A04]" />,
                title: 'Home Dark',
                desc: 'The landing experience in dark mode — showcasing the platform\'s premium aesthetic with gold accents, clean typography, and inviting entry points.',
                tags: ['Dark Mode', 'Landing', 'Brand Identity'],
                src: cloudScreenHomeDark, reverse: false, isPhone: false
              },
              {
                num: '02', icon: <Monitor size={16} className="text-[#D59A04]" />,
                title: 'Exchange Dashboard',
                desc: 'The heart of the platform — real-time market data, trading pairs, order book, and price charts unified in a clean, scannable layout.',
                tags: ['Real-time Data', 'Order Book', 'Price Charts'],
                src: cloudScreenExchange, reverse: true, isPhone: false
              },
              {
                num: '03', icon: <Lock size={16} className="text-[#D59A04]" />,
                title: 'Login',
                desc: 'Secure entry point with clean form design, trust-building visual indicators, and a clear path to account creation.',
                tags: ['Secure Login', 'Form Design', 'Trust Signals'],
                src: cloudScreenLogin, reverse: false, isPhone: true
              },
              {
                num: '04', icon: <Shield size={16} className="text-[#D59A04]" />,
                title: 'Authentication',
                desc: '2FA verification flow with biometric options and step-by-step guidance that makes security feel effortless and trustworthy.',
                tags: ['2FA', 'Biometrics', 'Verification'],
                src: cloudScreenAuth, reverse: true, isPhone: true
              },
              {
                num: '05', icon: <QrCode size={16} className="text-[#D59A04]" />,
                title: 'QR Transfer',
                desc: 'Instant peer-to-peer transfers via QR code scanning — making crypto transfers as simple as sharing a photo.',
                tags: ['P2P Transfer', 'QR Scanner', 'Instant Send'],
                src: cloudScreenQR, reverse: false, isPhone: true
              },
            ].map((step) => (
              <FadeIn key={step.num}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className={step.reverse ? 'order-1 lg:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl text-[#D59A04]/30" style={{ fontFamily: BRAND.headingFont }}>{step.num}</span>
                      <div className="w-8 h-px bg-[#D59A04]/20" />
                      {step.icon}
                    </div>
                    <h3 className="text-xl mb-3" style={{ fontFamily: BRAND.headingFont }}>{step.title}</h3>
                    <p className={`text-[13px] ${bt} leading-relaxed mb-4`}>{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((t) => (
                        <span key={t} className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-md ${isDark ? 'bg-[#121318] text-[#b0b3c0]' : 'bg-zinc-100 text-zinc-500'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={step.reverse ? 'order-2 lg:order-1' : ''}>
                    <ScrollRevealScale scaleFrom={0.92}>
                      <div className={`rounded-2xl overflow-hidden border shadow-xl ${isDark ? 'border-white/[0.06] shadow-black/40' : 'border-zinc-200 shadow-zinc-200/40'}`}>
                        <img src={step.src} alt={step.title} width="1440" height="900" className="w-full block" />
                      </div>
                    </ScrollRevealScale>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── UX STORIES ──────────────────────────────────────────────── */}
      <section id="ux-stories" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="04" label="UX Stories" /></FadeIn>
          <UXStories />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── INTERACTIVE PREVIEWS ──────────────────────────────────────── */}
      <section id="previews" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="06" label="Interactive Preview" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-4" style={{ fontFamily: BRAND.headingFont }}>
              Live <span className="text-[#D59A04]">components</span>
            </h2>
            <p className={`${bt} max-w-xl mb-12 leading-relaxed text-sm`}>
              Interactive previews of key dashboard components — demonstrating real-time data visualization and trading widget design.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.05}>
              <DashboardPreview />
            </FadeIn>
            <FadeIn delay={0.1}>
              <ExchangeWidget />
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DESIGN SYSTEM ─────────────────────────────────────────────── */}
      <section id="design" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="07" label="Design System" /></FadeIn>
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl leading-tight mb-3" style={{ fontFamily: BRAND.headingFont }}>
                  <span className="text-[#D59A04]">AURUM</span> Design System
                </h2>
                <p className={`${bt} max-w-xl leading-relaxed`}>
                  A comprehensive design system built for scale — 8 semantic color tokens, 2 typeface families, a spatial rhythm, and 64+ reusable components powering all 196 screens.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Palette size={16} className="text-[#D59A04]" />
                <span className={`text-[10px] uppercase tracking-wider ${mt}`}>Tokens & Components</span>
              </div>
            </div>
          </FadeIn>

          <DesignSystemFull />

          {/* Figma Design System Document */}
          <FadeIn delay={0.2}>
            <div className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
                    Component <span className="text-[#D59A04]">Sheet</span>
                  </h3>
                  <p className={`text-sm ${mt}`}>The complete Figma design components document</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Figma size={14} className="text-[#D59A04]" />
                  <span className={`text-[9px] uppercase tracking-[0.15em] ${mt}`}>Figma Source</span>
                </div>
              </div>

              <div className={`rounded-2xl overflow-hidden border ${cb} shadow-2xl ${isDark ? 'shadow-black/40' : 'shadow-zinc-300/40'}`}>
                <div className={`flex items-center gap-3 px-5 py-3 ${isDark ? 'bg-[#0d0f14] border-b border-white/[0.04]' : 'bg-zinc-100 border-b border-zinc-200'}`}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F87171]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFC701]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <Figma size={11} className={`${isDark ? 'text-white/30' : 'text-zinc-400'}`} />
                    <span className={`text-[10px] tracking-wide ${isDark ? 'text-white/30' : 'text-zinc-400'}`}>AURUM — Design Components</span>
                  </div>
                  <div className={`text-[9px] font-mono ${isDark ? 'text-white/20' : 'text-zinc-300'}`}>64+ components</div>
                </div>
                <div className={`relative ${isDark ? 'bg-[#0a0c10]' : 'bg-zinc-50'}`}>
                  <div className="overflow-y-auto max-h-[80vh] scrollbar-thin">
                    <img src={designSystemSheet} alt="AURUM Design System" width="1440" height="1200" className="w-full block" />
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t ${isDark ? 'from-[#0a0c10]' : 'from-zinc-50'} to-transparent`} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {['Navbar', 'Buttons', 'Tabs & Toggles', 'Input Fields', 'Icons', 'Use Case Styles', 'Card Styles', 'Footers', 'Chart Data', 'QR Codes', 'Modals'].map((tag) => (
                  <span key={tag} className={`text-[9px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/[0.03] text-[#9295A6]/70 border border-white/[0.04]' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DESIGN APPROACH ──────────────────────────────────────────── */}
      <section id="approach" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="08" label="Design Approach" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-5" style={{ fontFamily: BRAND.headingFont }}>
              Trust through <span className="text-[#D59A04]">craft</span>
            </h2>
            <p className={`${bt} leading-relaxed max-w-xl mb-12`}>
              In crypto, trust is earned pixel by pixel. Every design decision reinforces security, clarity, and user confidence.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {[
              { icon: <Shield size={16} />, title: 'Security First', desc: 'Trust indicators everywhere' },
              { icon: <Eye size={16} />, title: 'Progressive Disclosure', desc: 'Show only what matters' },
              { icon: <Smartphone size={16} />, title: 'Mobile Native', desc: 'Touch-optimized interactions' },
              { icon: <Zap size={16} />, title: 'Speed', desc: 'Instant visual feedback' },
            ].map((item) => (
              <FadeIn key={item.title} delay={0.05}>
                <motion.div whileHover={{ y: -3 }} className={`p-4 rounded-xl border h-full ${isDark ? 'bg-[#121318]/60 border-white/[0.04]' : 'bg-white border-zinc-200'}`}>
                  <div className="text-[#D59A04] mb-2">{item.icon}</div>
                  <div className={`text-[12px] mb-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{item.title}</div>
                  <div className={`text-[10px] ${mt}`}>{item.desc}</div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* What makes this stand out */}
          <FadeIn delay={0.15}>
            <div className={`p-8 rounded-2xl border ${cb} ${cardBg}`}>
              <h3 className="text-lg mb-4" style={{ fontFamily: BRAND.headingFont }}>
                What makes this work <span className="text-[#D59A04]">stand out</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'End-to-end product thinking',
                  'Mobile-first responsive design',
                  'Comprehensive design system',
                  'Trust-building micro-interactions',
                  'Guided verification flows',
                  'Real-time data visualization',
                ].map((point) => (
                  <div key={point} className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                    <span className="text-[#D59A04] mt-0.5 text-[10px] flex-shrink-0">&#x2713;</span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── OUTCOME ─────────────────────────────────────────────────── */}
      <section id="outcome" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="09" label="Outcome" /></FadeIn>
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="text-3xl lg:text-4xl leading-tight mb-6" style={{ fontFamily: BRAND.headingFont }}>
                A premium <span className="text-[#D59A04]">crypto</span> experience
              </h2>
              <p className={`${bt} leading-relaxed mb-6`}>
                AURUM proves that financial products don't have to sacrifice beauty for functionality. By combining thoughtful UX research, a comprehensive design system, and pixel-perfect execution, we created a platform that makes crypto trading feel premium, secure, and accessible.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Crypto Exchange', 'Mobile-First', 'Design System', '196 Screens', 'Trust-First UX'].map((tag) => (
                  <span key={tag} className={`text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#D59A04]/10 text-[#F0C040] border border-[#D59A04]/20' : 'bg-amber-50 text-[#D59A04] border border-[#D59A04]/20'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* footer removed */}
      <NextProjectRecommendation currentProject="aurum" />
    </div>
  );
}