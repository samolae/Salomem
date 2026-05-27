import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, ChevronUp, Eye, Zap, CheckCircle, Layers,
  Users, BookOpen, Shield, Monitor, Component, Palette,
  Code2, PenTool, Search, LayoutGrid, ArrowRight, Mail,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import {
  FadeIn, CountUp, GlowCard, TextReveal,
  StaggerItem, MagneticWrap, AnimatedDivider,
} from './animated-helpers';
import { NextProjectRecommendation } from './next-project';
import { CaseStudySectionNav } from './case-study-nav';
import { UnispaceSEO } from './seo';

/* ─── Real Unispace product screenshots (Cloudinary) ──────────── */
const imgLogin        = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875718/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98_%E1%83%92%E1%83%95%E1%83%94%E1%83%A0%E1%83%93%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A8%E1%83%94%E1%83%A1%E1%83%95%E1%83%9A%E1%83%98%E1%83%A1%E1%83%90%E1%83%A1_uaosn1.png';
const imgFormsTable   = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875712/%E1%83%A8%E1%83%94%E1%83%95%E1%83%A1%E1%83%94%E1%83%91%E1%83%A3%E1%83%9A%E1%83%98_%E1%83%A4%E1%83%9D%E1%83%A0%E1%83%9B%E1%83%94%E1%83%91%E1%83%98%E1%83%A1_%E1%83%AA%E1%83%AE%E1%83%A0%E1%83%98%E1%83%9A%E1%83%98_jtudqc.png';
const imgRegister     = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875712/%E1%83%90%E1%83%AE%E1%83%90%E1%83%9A%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A0%E1%83%94%E1%83%92%E1%83%98%E1%83%A1%E1%83%A2%E1%83%A0%E1%83%90%E1%83%AA%E1%83%98%E1%83%90-%E1%83%A1%E1%83%A2%E1%83%A3%E1%83%93%E1%83%94%E1%83%9C%E1%83%A2%E1%83%98_error_vhhyi0.png';
const imgUploadFlow   = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779875711/%E1%83%9E%E1%83%A0%E1%83%9D%E1%83%94%E1%83%A5%E1%83%A2%E1%83%98%E1%83%A1_%E1%83%90%E1%83%A2%E1%83%95%E1%83%98%E1%83%A0%E1%83%97%E1%83%95%E1%83%90_3_ewqkdw.png';

const imgScreen       = imgLogin;
const imgLayoutGrid   = imgFormsTable;
const imgUpload       = imgUploadFlow;
const imgSeparator    = imgRegister;

/* ─── Project typography — single typeface ──────────────────────
 * Unispace's actual product typography is Noto Sans Georgian
 * (covers Georgian + Latin glyphs). Syne / Manrope are the
 * portfolio's typefaces, not the product's.
 * ────────────────────────────────────────────────────────────── */
const F_GE = '"Noto Sans Georgian", "Inter", sans-serif';

/* ─── Brand Tokens ─────────────────────────────────────────────── */
const BRAND = {
  blue: '#3D82F6',
  blueLight: '#6BA4FF',
  blueDark: '#1A5FCC',
  darkBg: '#090707',
  surface: '#141212',
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
      <span className="text-[#3D82F6] text-sm font-mono">{number}</span>
      <div className="w-8 h-px bg-[#3D82F6]/40" />
      <span className={`text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{label}</span>
    </div>
  );
};

const ScreenCard = ({
  src, label, description, icon, delay = 0, isDark = true,
}: {
  src: string; label: string; description: string; icon: React.ReactNode; delay?: number; isDark?: boolean;
}) => (
  <FadeIn delay={delay}>
    <div className="group">
      <div className={`rounded-xl overflow-hidden mb-4 border shadow-lg transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-2xl ${isDark ? 'border-white/[0.06] shadow-black/30 group-hover:border-[#3D82F6]/30 group-hover:shadow-[#3D82F6]/20' : 'border-zinc-200 shadow-zinc-200/50 group-hover:border-[#3D82F6]/40'}`}>
        <div className="aspect-[16/10] overflow-hidden">
          <img src={src} alt={label} className="w-full h-full block object-cover object-top group-hover:scale-[1.04] transition-transform duration-700" />
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-110 ${isDark ? 'bg-[#3D82F6]/10 group-hover:bg-[#3D82F6]/20' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
          <span className="text-[#3D82F6]">{icon}</span>
        </div>
        <div>
          <h4 className={`text-sm mb-1 transition-colors duration-300 group-hover:text-[#3D82F6] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{label}</h4>
          <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{description}</p>
        </div>
      </div>
    </div>
  </FadeIn>
);

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
          className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl transition-colors group focus-visible:!shadow-[0_0_0_2px_rgba(61,130,246,0.5)] ${
            isDark
              ? 'bg-[#3D82F6]/90 hover:bg-[#3D82F6] shadow-[#3D82F6]/20 text-white'
              : 'bg-[#3D82F6] hover:bg-[#3D82F6]/90 shadow-[#3D82F6]/30 text-white'
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

const ChallengeRow = ({
  number, challenge, solution, isDark,
}: { number: string; challenge: string; solution: string; isDark: boolean }) => (
  <FadeIn delay={Number(number) * 0.08}>
    <div className={`grid md:grid-cols-2 gap-6 p-6 rounded-2xl border transition-colors ${isDark ? 'border-white/[0.06] bg-[#141212]/60' : 'border-zinc-200 bg-white/70'}`}>
      <div className="flex gap-4">
        <span className="text-[#3D82F6] font-mono text-xs flex-shrink-0 mt-0.5">{number}</span>
        <div>
          <div className={`text-[10px] uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-red-400/70' : 'text-red-500/70'}`}>Challenge</div>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{challenge}</p>
        </div>
      </div>
      <div className={`flex gap-4 pl-0 md:pl-6 md:border-l ${isDark ? 'border-white/[0.06]' : 'border-zinc-200'}`}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] mb-2 text-[#3D82F6]/70">Solution</div>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{solution}</p>
        </div>
      </div>
    </div>
  </FadeIn>
);

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

export function UnispaceCaseStudy() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const bg = isDark ? 'bg-[#090707] text-white' : 'bg-[#F3F3F3] text-zinc-900';
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const cardBg = isDark ? 'bg-[#141212]' : 'bg-white';

  return (
    <div className={`${bg} min-h-screen transition-colors duration-500 relative`} style={{ fontFamily: BRAND.bodyFont }}>
      <UnispaceSEO />
      <ScrollToTopButton />
      <CaseStudySectionNav accentColor="#3D82F6" sections={SECTIONS} />

      {/* Custom blue cursor (desktop only) */}
      <motion.div
        className="fixed w-8 h-8 border border-[#3D82F6]/60 rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
      />
      <motion.div
        className="fixed w-1.5 h-1.5 bg-[#3D82F6] rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block"
        animate={{ x: mousePosition.x - 3, y: mousePosition.y - 3 }}
        transition={{ type: 'spring', damping: 50, stiffness: 400 }}
      />

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl ${isDark ? 'bg-[#090707]/80 border-b border-white/[0.04]' : 'bg-white/80 border-b border-zinc-200/60'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 min-h-[44px] focus-visible:!shadow-[0_0_0_2px_rgba(61,130,246,0.4)] ${isDark ? 'text-[#9295A6] hover:text-white hover:bg-white/[0.04]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'} transition-colors`}
            >
              <ArrowLeft size={15} />
              <span className="text-[12px] tracking-wide">Back to Portfolio</span>
            </motion.button>
            <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
            {/* Unilab brand mark + Unispace project tag */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <img
                src="https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1779887428/241852566_416907023197215_4126473183608966576_n_ecyuw4.png"
                alt="Unilab"
                width={32}
                height={32}
                className={`w-8 h-8 object-contain rounded-md ${isDark ? '' : 'invert'}`}
                loading="lazy"
              />
              <div className="flex flex-col leading-none gap-1">
                <span className={`text-[12px] tracking-wide font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>
                  Unilab
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#6BA4FF]" style={{ fontFamily: BRAND.bodyFont, fontWeight: 600 }}>
                  Unispace
                </span>
              </div>
            </motion.div>
          </div>
          <div className="hidden md:flex items-center gap-5">
            {[
              { label: 'Overview',     id: 'overview' },
              { label: 'Screens',      id: 'screens' },
              { label: 'Design System',id: 'design' },
            ].map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                whileHover={{ y: -1 }}
                className={`text-[12px] tracking-wide transition-colors ${isDark ? 'text-[#9295A6] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* ─── META BAR ──────────────────────────────────────────── */}
      <div className={`relative z-20 pt-[72px] border-b ${isDark ? 'border-white/[0.06] bg-[#141212]/30 backdrop-blur-xl' : 'border-zinc-200 bg-white/50 backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: 'Client',   value: 'Unilab / Ilia State Uni.' },
              { label: 'Role',     value: 'Lead UX/UI Designer' },
              { label: 'Platform', value: 'Web (Responsive)' },
              { label: 'Industry', value: 'EdTech / Internal SaaS' },
              { label: 'Tools',    value: 'Figma · Prototyping' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
              >
                <span className={`text-[9px] uppercase tracking-[0.2em] block mb-1 ${mt}`}>{item.label}</span>
                <span className={`text-[13px] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: '#3D82F6' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-[0.03] blur-[100px]" style={{ background: '#3D82F6' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#3D82F6]">EdTech · Internal SaaS · 2024</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl lg:text-7xl tracking-[-0.04em] leading-[0.9] mb-6"
                style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}
              >
                <span className={isDark ? 'text-white' : 'text-zinc-900'}>Uni</span>
                <span style={{ color: BRAND.blue }}>space</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={`text-xl lg:text-2xl leading-relaxed mb-3 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}>
                Student Management Platform
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={`text-base leading-relaxed mb-10 max-w-md ${mt}`}>
                A closed internal platform for Unilab — Ilia State University's Innovative Technologies Cyber Laboratory. One system, three distinct roles: student, lecturer, admin.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }} className="grid grid-cols-3 gap-6">
                {[
                  { value: 3,  label: 'User Roles',  suffix: '+' },
                  { value: 42, label: 'Screens',     suffix: '+' },
                  { value: 38, label: 'Components',  suffix: '+' },
                ].map((stat) => (
                  <div key={stat.label} className="group cursor-default">
                    <div
                      className={`text-3xl lg:text-4xl tracking-[-0.04em] mb-1 transition-colors duration-300 group-hover:text-[#3D82F6] ${isDark ? 'text-white' : 'text-zinc-900'}`}
                      style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}
                    >
                      <CountUp end={stat.value} />{stat.suffix}
                    </div>
                    <div className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${isDark ? `${mt} group-hover:text-white` : `${mt} group-hover:text-zinc-900`}`}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-md mx-auto lg:max-w-none">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                className={`relative rounded-2xl overflow-hidden border shadow-2xl ${isDark ? 'border-white/[0.06] shadow-black/60' : 'border-zinc-200 shadow-zinc-300/40'}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={imgScreen} alt="Unispace platform screenshot" className="w-full h-full block object-cover object-top" />
                </div>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(61,130,246,0.08) 100%)' }} />
              </motion.div>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className={`absolute -bottom-4 -left-4 rounded-xl p-3.5 border shadow-xl backdrop-blur-xl ${isDark ? 'bg-[#141212]/90 border-white/[0.08]' : 'bg-white/90 border-zinc-200'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#3D82F6]/15 flex items-center justify-center">
                    <Users size={14} className="text-[#3D82F6]" />
                  </div>
                  <div>
                    <div className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>3 User Roles</div>
                    <div className={`text-[9px] ${mt}`}>Student · Lecturer · Admin</div>
                  </div>
                </div>
              </motion.div>
              <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className={`absolute -top-4 -right-4 rounded-xl p-3.5 border shadow-xl backdrop-blur-xl ${isDark ? 'bg-[#141212]/90 border-white/[0.08]' : 'bg-white/90 border-zinc-200'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#3D82F6]/15 flex items-center justify-center">
                    <LayoutGrid size={14} className="text-[#3D82F6]" />
                  </div>
                  <div>
                    <div className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>4 Core Flows</div>
                    <div className={`text-[9px] ${mt}`}>Registration · Cabinet · Portfolio</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TLDR · 30-SECOND SNAPSHOT ─────────────────────────── */}
      <section className="relative px-6 lg:px-12 -mt-6 lg:-mt-10 mb-12 lg:mb-16 z-20">
        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`relative rounded-2xl border overflow-hidden backdrop-blur-xl shadow-2xl ${
                isDark
                  ? 'bg-[#0a0a0d]/85 border-[#3D82F6]/20 shadow-[#3D82F6]/10'
                  : 'bg-white/95 border-blue-200 shadow-blue-200/40'
              }`}
            >
              {/* Header band */}
              <div className={`flex items-center justify-between px-6 lg:px-8 pt-4 pb-3.5 border-b ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3D82F6]/60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3D82F6]" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#3D82F6]" style={{ fontWeight: 600 }}>
                    Quick Read · 30s
                  </span>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.15em] ${mt}`}>~9 min full read</span>
              </div>

              {/* Body rows */}
              <div className={`divide-y ${isDark ? 'divide-white/[0.04]' : 'divide-zinc-100'}`}>
                {[
                  { label: 'Challenge', value: 'Three roles, one system, zero compromises',                                              icon: <Zap size={14} /> },
                  { label: 'Role',      value: 'Lead UX/UI · 12 weeks · 42+ screens · 38+ components',                                   icon: <PenTool size={14} /> },
                  { label: 'Impact',    value: '~60% fewer handoff tickets · 0 design-QA issues on form components post-launch',         icon: <CheckCircle size={14} /> },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-3 sm:gap-5 px-6 lg:px-8 py-4 items-start sm:items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#3D82F6] flex-shrink-0">{row.icon}</span>
                      <span className={`text-[10px] uppercase tracking-[0.2em] ${mt}`}>{row.label}</span>
                    </div>
                    <div className={`text-[14px] leading-snug ${isDark ? 'text-white/95' : 'text-zinc-800'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 500 }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA footer */}
              <a
                href="#story"
                className={`group flex items-center justify-between px-6 lg:px-8 py-3.5 border-t transition-colors duration-200 ${isDark ? 'border-white/[0.06] hover:bg-white/[0.03]' : 'border-zinc-100 hover:bg-zinc-50'}`}
              >
                <span className={`text-[12px] transition-colors ${isDark ? 'text-white/70 group-hover:text-white' : 'text-zinc-600 group-hover:text-zinc-900'}`} style={{ fontFamily: BRAND.bodyFont }}>
                  Read full case study
                </span>
                <span className="flex items-center gap-2 text-[#3D82F6] text-[12px]">
                  <span className="font-mono text-[10px] opacity-60">9 sections</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── STORY ──────────────────────────────────────────────── */}
      <section id="story" className="relative py-20 lg:py-28 px-6 lg:px-12 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {[
            { step: 'Hook',    number: '00.1', text: 'What if a single platform could serve three completely different users — student, lecturer, admin — without ever making any of them feel like a secondary thought?', accent: BRAND.blue, icon: <Eye size={16} /> },
            { step: 'Friction',number: '00.2', text: 'Managing a university lab meant juggling spreadsheets, email chains, and disconnected tools. Students had no visibility, lecturers had no control, and admins had no oversight — all at once.', accent: '#F87171', icon: <Zap size={16} /> },
            { step: 'Pivot',   number: '00.3', text: "We designed Unispace around role-based clarity — one login, one design language, three distinct realities. No compromises, no role confusion, no 'which account is mine?'", accent: '#10B981', icon: <CheckCircle size={16} /> },
            { step: 'Proof',   number: '00.4', text: '42+ screens, 38+ components, and a conditional form system that guided 17 edge cases without a single multi-step wizard — all delivered in 12 weeks.', accent: '#A78BFA', icon: <Layers size={16} /> },
          ].map((item, i) => (
            <TextReveal key={item.step} delay={i * 0.12}>
              <div className="flex gap-6 lg:gap-10 mb-14 lg:mb-18 group">
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}15`, color: item.accent }}>{item.icon}</div>
                  <div className="flex-1 w-px" style={{ background: `linear-gradient(to bottom, ${item.accent}40, transparent)` }} />
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] font-mono" style={{ color: item.accent }}>{item.number}</span>
                    <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: item.accent }}>{item.step}</span>
                  </div>
                  <p className={`text-xl lg:text-2xl leading-relaxed tracking-[-0.01em] ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 500 }}>{item.text}</p>
                </div>
              </div>
            </TextReveal>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── OVERVIEW ───────────────────────────────────────────── */}
      <section id="overview" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="01" label="Project Overview" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              One ecosystem,<br /><span style={{ color: BRAND.blue }}>three user realities</span>
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 mt-16">
            <div>
              <FadeIn delay={0.1}>
                <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  Unispace is a closed internal work system for Unilab — the Innovative Technologies Cyber Laboratory of Ilia State University. The platform allows students to register, track projects, build a public portfolio, and apply for competitions. Lecturers manage courses; admins control the entire ecosystem.
                </p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {['Multi-role Platform', 'Student Portal', 'Project Tracking', 'Portfolio Builder', 'Course Management'].map((tag) => (
                    <span key={tag} className={`text-[11px] px-3 py-1.5 rounded-full border ${isDark ? 'border-white/[0.08] text-zinc-300 bg-white/[0.03]' : 'border-zinc-200 text-zinc-600 bg-white'}`}>{tag}</span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h3 className={`text-sm uppercase tracking-[0.15em] mb-5 ${mt}`}>My Contribution</h3>
                <div className="space-y-3">
                  {[
                    'UX Research and Information Architecture (3 roles)',
                    'Conditional Form Logic Design (4 status paths)',
                    'Multi-role Dashboard and Cabinet Design',
                    'Email Verification and Auth Flow Design',
                    'Public Portfolio Template and Sharing System',
                    'Component Library and Developer Handoff',
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: BRAND.blue }} />
                        <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{item}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <div className={`rounded-2xl border p-8 ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: 'Client',       value: 'Unilab / Ilia State Uni.', icon: <BookOpen size={16} /> },
                    { label: 'My Role',      value: 'Lead UX/UI Designer',      icon: <PenTool size={16} /> },
                    { label: 'Platform',     value: 'Web (Responsive)',          icon: <Monitor size={16} /> },
                    { label: 'Tools',        value: 'Figma · Prototyping',          icon: <Component size={16} /> },
                    { label: 'Target Users', value: 'Students, Lecturers, Admins', icon: <Users size={16} /> },
                    { label: 'Duration',     value: '12 Weeks',                 icon: <Search size={16} /> },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: BRAND.blue }}>{item.icon}</span>
                        <span className={`text-[10px] uppercase tracking-[0.2em] ${mt}`}>{item.label}</span>
                      </div>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-8 pt-8 border-t ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { n: '42+',    label: 'Screens Designed' },
                      { n: '38+',    label: 'Components Built' },
                      { n: '4',      label: 'Core UX Flows' },
                      { n: '12 wks', label: 'Research to Handoff' },
                    ].map((stat) => (
                      <div key={stat.label} className={`rounded-xl p-4 ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50'}`}>
                        <div className="text-2xl tracking-[-0.04em] mb-0.5" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}>{stat.n}</div>
                        <div className={`text-[10px] uppercase tracking-[0.1em] ${mt}`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── CHALLENGE & SOLUTION ──────────────────────────────── */}
      <section id="challenge" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="02" label="Challenge & Solution" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              Three users, one system,<br /><span style={{ color: BRAND.blue }}>zero compromises</span>
            </h2>
            <p className={`text-base leading-relaxed max-w-2xl mb-12 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              The core complexity of Unispace: three completely different user journeys — student, lecturer, admin — sharing a single design language. Every screen had to serve its user without bleeding into another role's context.
            </p>
          </FadeIn>

          {/* ── Three Roles → One System · visual diagram ── */}
          <FadeIn delay={0.05}>
            <div className={`relative mb-10 rounded-2xl border p-8 lg:p-10 overflow-hidden ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 50%, rgba(61,130,246,0.06), transparent 60%)' }} />

              <div className="relative grid lg:grid-cols-[1fr_180px_1fr] gap-6 lg:gap-8 items-center">
                {/* Left: Three user roles */}
                <div className="space-y-3">
                  {[
                    { label: 'Student',  sub: 'Self-registers · tracks projects',         color: '#22C55E' },
                    { label: 'Lecturer', sub: 'Manages courses · reviews submissions',    color: '#F59E0B' },
                    { label: 'Admin',    sub: 'Oversees roles · uploads certificates',    color: '#F87171' },
                  ].map((u) => (
                    <motion.div
                      key={u.label}
                      whileHover={{ x: 3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`group/role flex items-center gap-3 p-3 rounded-xl border cursor-default transition-colors duration-300 ${isDark ? 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100'}`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/role:scale-110" style={{ background: `${u.color}1A`, color: u.color, border: `1.5px solid ${u.color}40` }}>
                        <Users size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{u.label}</div>
                        <div className={`text-[10px] leading-relaxed ${mt}`}>{u.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Middle: convergence lines */}
                <div className="relative h-32 lg:h-44 flex items-center justify-center">
                  <svg viewBox="0 0 180 160" className="w-full h-full" fill="none" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="convergeBlue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                        <stop offset="60%" stopColor="#3D82F6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#6BA4FF" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                    {/* Top user line */}
                    <motion.path
                      d="M0 24 Q 90 24, 170 80"
                      stroke="url(#convergeBlue)"
                      strokeWidth="1.5"
                      strokeDasharray="3 4"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* Middle line */}
                    <motion.path
                      d="M0 80 L 170 80"
                      stroke="url(#convergeBlue)"
                      strokeWidth="1.5"
                      strokeDasharray="3 4"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* Bottom user line */}
                    <motion.path
                      d="M0 136 Q 90 136, 170 80"
                      stroke="url(#convergeBlue)"
                      strokeWidth="1.5"
                      strokeDasharray="3 4"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* Pulse dots traveling along lines */}
                    {[24, 80, 136].map((y, i) => (
                      <motion.circle
                        key={y}
                        r="2.5"
                        fill="#6BA4FF"
                        initial={{ cx: 0, cy: y }}
                        animate={{ cx: 170, cy: 80 }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: [0.4, 0, 0.2, 1] }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Right: Unispace platform mark */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex justify-center lg:justify-start"
                >
                  <div
                    className="relative inline-flex flex-col items-center gap-3 p-6 rounded-2xl border overflow-hidden"
                    style={{
                      borderColor: 'rgba(61,130,246,0.35)',
                      background: isDark ? 'linear-gradient(135deg, rgba(61,130,246,0.10), rgba(61,130,246,0.02))' : 'linear-gradient(135deg, rgba(61,130,246,0.06), rgba(61,130,246,0.01))',
                    }}
                  >
                    {/* Pulsing glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'radial-gradient(circle at center, rgba(61,130,246,0.18), transparent 70%)' }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="relative w-12 h-12 rounded-xl bg-[#3D82F6] flex items-center justify-center shadow-lg shadow-[#3D82F6]/40">
                      <LayoutGrid size={20} className="text-white" />
                    </div>
                    <div className="relative text-center">
                      <div className={`text-base font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>Unispace</div>
                      <div className={`text-[10px] mt-1 leading-relaxed max-w-[160px] ${mt}`}>One login · One design language · Three realities</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom stats strip */}
              <div className={`relative mt-8 pt-6 border-t grid grid-cols-3 gap-4 ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                {[
                  { n: '3',   label: 'User Roles',   color: '#22C55E' },
                  { n: '9',   label: 'UX Flows',     color: '#F59E0B' },
                  { n: '17',  label: 'Edge Cases',   color: '#3D82F6' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl tracking-[-0.03em] mb-0.5" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: s.color }}>{s.n}</div>
                    <div className={`text-[10px] uppercase tracking-[0.15em] ${mt}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {[
              { challenge: 'Conditional form complexity — 12 base fields expanding into 4 distinct paths with 0–5 additional fields each. Designing one pattern to cover all cases without cognitive overload.', solution: 'Same-page progressive disclosure — status fields expand inline below the dropdown, labeled as a distinct section. Users always see their position in the form with no multi-step wizard.' },
              { challenge: 'Role asymmetry — Students self-register; lecturers are added by admin. A student who later becomes a lecturer has two separate accounts. The system had to communicate this clearly.', solution: 'Single login endpoint, role-based redirect — one login screen routes to the correct dashboard based on backend role. Role switching is documented as a tooltip, not a UI element.' },
              { challenge: "Certificate gating — The certificate button is always visible but only activates when an admin uploads the certificate. Communicating a 'feature exists but isn't ready yet' state without frustrating users.", solution: "Visible-disabled with tooltip — Certificate button always rendered, opacity 40%, cursor: not-allowed, with tooltip: 'Available once your administrator uploads your certificate.'" },
              { challenge: 'Public vs. private boundary — The portfolio page is a public shareable URL; the cabinet is fully private. One system, two access contexts, one coherent visual language.', solution: 'Dedicated public portfolio route — /portfolio/[username] is a clean, minimal public page optimized for first impressions — no nav clutter, no login prompts. One-click copy button in the private cabinet.' },
              { challenge: 'Verification flow edge cases — 5 distinct states: initial, auto-redirect (countdown), manual redirect, resend link, password recovery. Every state needed a clear action and fallback.', solution: 'Countdown + parallel CTA — Visual countdown timer (5 seconds) for auto-redirect, plus a manual "Go to Login" button. User stays in control regardless of their speed.' },
            ].map((row, i) => (
              <ChallengeRow key={i} number={`0${i + 1}`} challenge={row.challenge} solution={row.solution} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DESIGN PROCESS ─────────────────────────────────────── */}
      <section id="process" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="03" label="Design Process" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-14 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              12 weeks from research<br /><span style={{ color: BRAND.blue }}>to handoff</span>
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { phase: 'PHASE 01', weeks: 'Weeks 1–2',  title: 'Discover', color: '#3D82F6', items: ['Stakeholder interviews (Unilab team, 4 sessions)', 'Competitive audit of EdTech learning platforms, student portals, and online portfolio tools', 'Technical spec analysis', 'User role mapping (student, lecturer, admin)', '17 edge cases identified and documented'] },
              { phase: 'PHASE 02', weeks: 'Weeks 3–4',  title: 'Define',   color: '#A78BFA', items: ['Information architecture (3 role-specific IA maps)', 'User flow mapping per role (9 flows total)', 'Conditional form logic matrix', 'State inventory: 12 states per key screen', 'Design principles established'] },
              { phase: 'PHASE 03', weeks: 'Weeks 5–10', title: 'Design',   color: '#10B981', items: ['Lo-fi wireframes (42 screens)', 'Dark design system — 38+ components built', 'High-fidelity screens (42 total, 3 roles)', 'Micro-interactions prototyped for key flows', 'Responsive adaptation (1440 / 768 / 375px)'] },
              { phase: 'PHASE 04', weeks: 'Weeks 11–12',title: 'Deliver',  color: '#F59E0B', items: ['Usability testing: 8 participants, 2 rounds', '14 issues identified, 11 resolved pre-handoff', 'Dev handoff with Figma annotations', 'Component spec documentation', 'Design QA with engineering team'] },
            ].map((phase, i) => (
              <FadeIn key={phase.phase} delay={i * 0.1}>
                <div className={`group relative rounded-2xl border p-6 h-full overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 ${isDark ? `${cardBg} border-white/[0.06] hover:border-white/[0.15]` : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  {/* Radial glow on hover, tinted by phase color */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${phase.color}22, transparent 70%)` }}
                  />
                  {/* Top accent stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                    style={{ background: phase.color }}
                  />
                  <div className="relative mb-5">
                    <div className="text-[9px] uppercase tracking-[0.25em] mb-1 transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: phase.color }}>{phase.phase}</div>
                    <div className={`text-[10px] uppercase tracking-[0.15em] mb-3 ${mt}`}>{phase.weeks}</div>
                    <h3 className="text-2xl tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-0.5" style={{ fontFamily: BRAND.headingFont, fontWeight: 700, color: phase.color }}>{phase.title}</h3>
                  </div>
                  <div className={`relative w-full h-px mb-5 ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-100'}`} />
                  <ul className="relative space-y-2.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 transition-transform duration-300" style={{ transitionDelay: `${j * 20}ms` }}>
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-150" style={{ background: phase.color }} />
                        <span className={`text-[12px] leading-relaxed transition-colors duration-300 ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-600'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── Delivery Edge — Code Literacy + Collaboration ── */}
          <FadeIn delay={0.5}>
            <div className={`mt-12 lg:mt-16 rounded-2xl border overflow-hidden transition-all duration-500 hover:border-[#3D82F6]/25 hover:shadow-2xl hover:shadow-[#3D82F6]/10 ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
              <div className="grid lg:grid-cols-5">
                {/* Left — narrative */}
                <div className={`lg:col-span-2 p-8 lg:p-10 lg:border-r ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-7 h-7 rounded-md bg-[#3D82F6]/15 flex items-center justify-center">
                      <Code2 size={14} className="text-[#3D82F6]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#3D82F6]">Delivery Edge</span>
                  </div>
                  <h3 className={`text-2xl lg:text-3xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>
                    Code-literate design,<br />
                    built for handoff
                  </h3>
                  <p className={`text-[14px] leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Hands-on knowledge of HTML, CSS, JavaScript, and React shaped every design decision. Components were drawn knowing they'd map 1:1 to React components — no abstract patterns, no wasted iterations, no ambiguity at handoff.
                  </p>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Daily collaboration with engineering during the high-fidelity phase turned design QA into a continuous, paired activity — issues were caught and resolved in the same conversation, not in async ticket cycles.
                  </p>
                </div>

                {/* Right — practices grid */}
                <div className="lg:col-span-3 p-8 lg:p-10">
                  <div className={`text-[10px] uppercase tracking-[0.2em] mb-6 ${mt}`}>Practices that accelerated delivery</div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                    {[
                      { icon: <Code2 size={14} />,      title: '1:1 Component Mapping',   body: 'Every Figma component had a planned React equivalent — no design that couldn’t be built efficiently.' },
                      { icon: <Layers size={14} />,     title: 'Tailwind-aligned tokens', body: 'Spacing, color, and radius tokens mirrored Tailwind defaults so engineers translated zero values by hand.' },
                      { icon: <PenTool size={14} />,    title: 'HTML/CSS in handoff',     body: 'Specs included real CSS snippets for non-trivial states — focus rings, transitions, hover micro-interactions.' },
                      { icon: <Users size={14} />,      title: 'Daily 15-min syncs',      body: 'Async questions resolved same day during weeks 5–10 — no waiting cycles, no email threads.' },
                      { icon: <Search size={14} />,     title: 'Browser DevTools QA',     body: 'Paired live in DevTools to inspect builds — spacing, hierarchy, accessibility verified together in real time.' },
                      { icon: <Component size={14} />,  title: 'Shared component vocab',  body: 'Same terminology in Figma, code, and docs — variants, props, states all named identically across surfaces.' },
                    ].map((p) => (
                      <div key={p.title} className="group/p flex gap-3 cursor-default">
                        <div className="w-7 h-7 rounded-md bg-[#3D82F6]/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/p:bg-[#3D82F6]/20 group-hover/p:scale-110">
                          <span className="text-[#3D82F6]">{p.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13px] font-semibold mb-1 transition-colors duration-300 group-hover/p:text-[#6BA4FF] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{p.title}</div>
                          <div className={`text-[12px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{p.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Impact stats footer */}
              <div className={`border-t p-6 lg:p-7 grid grid-cols-1 sm:grid-cols-3 gap-6 ${isDark ? 'border-white/[0.06] bg-[#3D82F6]/[0.02]' : 'border-zinc-100 bg-blue-50/30'}`}>
                {[
                  { n: '~60%',   label: 'Fewer handoff clarification tickets' },
                  { n: '12 wks', label: 'Total timeline · vs. 16–18 typical for scope' },
                  { n: '0',      label: 'Design QA issues on form components post-launch' },
                ].map((s) => (
                  <div key={s.label} className="group/k cursor-default">
                    <div
                      className="text-2xl lg:text-3xl tracking-[-0.03em] mb-1 transition-transform duration-300 inline-block group-hover/k:scale-105"
                      style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}
                    >
                      {s.n}
                    </div>
                    <div className={`text-[10px] uppercase tracking-[0.15em] ${mt}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── KEY SCREENS ─────────────────────────────────────────── */}
      <section id="screens" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="05" label="Key Screens" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              Core screens<br /><span style={{ color: BRAND.blue }}>in detail</span>
            </h2>
            <p className={`text-base leading-relaxed max-w-xl mb-14 ${mt}`}>
              Registration, verification, cabinet, and portfolio — each screen designed for a specific user in a specific moment.
            </p>
          </FadeIn>

          {/* Registration conditional logic table */}
          <FadeIn delay={0.05}>
            <div className={`rounded-2xl border overflow-hidden mb-8 ${isDark ? `border-white/[0.06] ${cardBg}` : 'border-zinc-200 bg-white'}`}>
              <div className={`px-8 py-6 border-b ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3D82F6]/10 flex items-center justify-center">
                    <Users size={15} className="text-[#3D82F6]" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>Registration — Conditional Logic System</h3>
                    <p className={`text-[12px] ${mt}`}>12 base fields → 4 status paths → 0–5 conditional fields · One unified form pattern</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/[0.06]' : 'border-zinc-100'}`}>
                      {['Status', 'Additional Fields', 'Count', 'Special Inputs', 'Complexity'].map((h) => (
                        <th key={h} className={`px-6 py-3 text-left text-[10px] uppercase tracking-[0.2em] font-medium ${mt}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { status: 'Pupil',    fields: 'School, Grade, Parent name, surname, phone',              count: '+5', special: 'Grade dropdown',                            complexity: 'Medium' },
                      { status: 'Student',  fields: 'University, Faculty, Program, Degree, Semester',         count: '+5', special: 'Dropdown + free input, Degree checkbox',    complexity: 'High' },
                      { status: 'Graduate', fields: 'University, Faculty, Program, Degree, Graduation date',  count: '+5', special: 'Dropdown + free input, Calendar picker',    complexity: 'High' },
                      { status: 'Other',    fields: 'None',                                                    count: '+0', special: '—',                                         complexity: 'Low' },
                    ].map((row) => (
                      <tr key={row.status} className={`border-b ${isDark ? 'border-white/[0.04]' : 'border-zinc-50'} transition-colors`}>
                        <td className={`px-6 py-4 font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>{row.status}</td>
                        <td className={`px-6 py-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.fields}</td>
                        <td className="px-6 py-4 font-mono text-[#3D82F6]">{row.count}</td>
                        <td className={`px-6 py-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{row.special}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] ${row.complexity === 'High' ? 'bg-red-500/10 text-red-400' : row.complexity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{row.complexity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          {/* Registration flow steps */}
          <FadeIn delay={0.1}>
            <h3 className={`text-xl mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>Registration Flow — Step by Step</h3>
            <div className="flex flex-wrap items-center gap-2 mb-16">
              {[
                { label: 'START',       sublabel: 'Begin Registration',       color: BRAND.blue },
                { label: 'BASE',        sublabel: '12 Mandatory Fields',       color: BRAND.blue },
                { label: 'BRANCH',      sublabel: 'Status Dropdown',           color: '#A78BFA' },
                { label: 'CONDITIONAL', sublabel: 'Role-specific 0–5 fields',  color: '#F59E0B' },
                { label: 'CONFIRM',     sublabel: 'Terms & Checkbox',          color: '#10B981' },
                { label: 'SUCCESS',     sublabel: 'Verification Page',         color: '#10B981' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`rounded-xl px-4 py-3 ${isDark ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-white border border-zinc-200'}`}>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-mono mb-0.5" style={{ color: step.color }}>{step.label}</div>
                    <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{step.sublabel}</div>
                  </div>
                  {i < arr.length - 1 && <ArrowRight size={14} className={mt} />}
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ScreenCard src={imgLayoutGrid} label="Layout & Grid System" description="Consistent 12-column grid applied across all 42 screens. Auto-layout components ensure pixel-perfect alignment without manual spacing adjustments." icon={<LayoutGrid size={15} />} delay={0.05} isDark={isDark} />
            <ScreenCard src={imgUpload} label="Project Upload Flow" description="Students upload projects with rich metadata — title, tags, status, media. Progressive disclosure shows relevant fields based on project type." icon={<Code2 size={15} />} delay={0.1} isDark={isDark} />
          </div>

          <FadeIn delay={0.15}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`group rounded-2xl overflow-hidden border mb-8 transition-shadow duration-500 hover:shadow-2xl ${isDark ? 'border-white/[0.06] hover:border-white/[0.12] hover:shadow-[#3D82F6]/10' : 'border-zinc-200 hover:border-zinc-300'}`}
            >
              <div className="aspect-[21/9] overflow-hidden">
                <img src={imgSeparator} alt="Unispace UI components overview" className="w-full h-full block object-cover object-top group-hover:scale-[1.02] transition-transform duration-1000" />
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── KEY DESIGN DECISIONS ───────────────────────────────── */}
      <section id="decisions" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="06" label="Key Design Decisions" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-14 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              Why we made<br /><span style={{ color: BRAND.blue }}>the choices we made</span>
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Conditional Fields — Same Page, Not Wizard',   principle: 'COGNITIVE LOAD REDUCTION', body: "Splitting status-specific fields into a separate step would create unnecessary friction at a critical dropoff point. Same-page expansion keeps the user grounded, always aware of total form length, and avoids 'where am I?' confusion across 4 possible paths.", color: BRAND.blue },
              { n: '02', title: 'Dark Mode as Default for Internal Tools',       principle: 'ACCESSIBILITY AND BRAND',  body: "Unispace is an internal platform used for hours at a time. Dark mode reduces eye fatigue during extended sessions, creates a professional environment that aligns with Unilab's engineering brand, and makes the blue accent significantly more impactful.", color: '#A78BFA' },
              { n: '03', title: 'Countdown Timer with Parallel Manual CTA',     principle: 'USER CONTROL AND CLARITY', body: "After verification, users lose orientation instantly. A visible countdown (5s) provides clear feedback that something is happening; the manual button preserves user agency for those who don't want to wait. Both user types served simultaneously.", color: '#10B981' },
              { n: '04', title: 'Certificate — Visible, Disabled, Explained',   principle: 'FEATURE DISCOVERY',        body: "Hiding the certificate button entirely would make users unaware the feature exists. Showing it as disabled with a clear tooltip sets correct expectations and keeps users engaged rather than confused.", color: '#F59E0B' },
              { n: '05', title: 'Portfolio as a Dedicated Public Route',         principle: 'AUDIENCE-SPECIFIC DESIGN', body: "The portfolio page serves a completely different audience — potential employers and clients, not platform users. It was designed from scratch for first-impression clarity: no nav, no login prompts, clean project banners.", color: '#F87171' },
              { n: '06', title: 'Region → City Cascade Dropdown',               principle: 'FORM USABILITY',           body: "Showing all Georgian cities at once creates a 70+ item dropdown that is nearly unusable. Filtering cities by selected region reduces the list to 3–12 items, eliminates impossible combinations, and cuts selection time by an estimated 60%.", color: '#34D399' },
            ].map((d, i) => (
              <FadeIn key={d.n} delay={i * 0.07}>
                <GlowCard glowColor={d.color} className="h-full">
                  <div className={`rounded-2xl border p-7 h-full ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl font-mono tracking-[-0.04em] opacity-20" style={{ fontFamily: BRAND.headingFont, color: d.color }}>{d.n}</span>
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full" style={{ background: `${d.color}15`, color: d.color }}>{d.principle}</span>
                    </div>
                    <h3 className={`text-base leading-snug mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>{d.title}</h3>
                    <p className={`text-[13px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{d.body}</p>
                  </div>
                </GlowCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DESIGN SYSTEM ──────────────────────────────────────── */}
      <section id="design" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="07" label="Design System" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              A system built<br /><span style={{ color: BRAND.blue }}>to scale</span>
            </h2>
            <p className={`text-base leading-relaxed max-w-2xl mb-16 ${mt}`}>
              38+ components, full Georgian script support, four semantic color groups, and a decorative motif that signs every screen. Built dark-first with auto-layout and variants for every state.
            </p>
          </FadeIn>

          {/* ── 7.1 — COLOR PALETTE (grouped tokens) ── */}
          <FadeIn delay={0.05}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.1</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Color Palette</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                {
                  group: 'Surface',
                  tokens: [
                    { label: 'Canvas',   hex: '#090707' },
                    { label: 'Surface',  hex: '#141212' },
                    { label: 'Elevated', hex: '#1B1A1F' },
                    { label: 'Field',    hex: '#FFFFFF' },
                  ],
                },
                {
                  group: 'Brand',
                  tokens: [
                    { label: 'Primary',    hex: '#3D82F6' },
                    { label: 'Hover',      hex: '#6BA4FF' },
                    { label: 'Pressed',    hex: '#1A5FCC' },
                    { label: 'Accent Glow',hex: 'rgba(61,130,246,0.18)' },
                  ],
                },
                {
                  group: 'Semantic',
                  tokens: [
                    { label: 'Success', hex: '#22C55E' },
                    { label: 'Warning', hex: '#F59E0B' },
                    { label: 'Error',   hex: '#F87171' },
                    { label: 'Info',    hex: '#3D82F6' },
                  ],
                },
                {
                  group: 'Neutral',
                  tokens: [
                    { label: 'Text Primary',   hex: '#FFFFFF' },
                    { label: 'Text Secondary', hex: '#9295A6' },
                    { label: 'Border',         hex: 'rgba(255,255,255,0.06)' },
                    { label: 'Divider',        hex: 'rgba(255,255,255,0.04)' },
                  ],
                },
              ].map((col) => (
                <div key={col.group} className={`group/grp relative rounded-2xl border p-5 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 ${isDark ? `${cardBg} border-white/[0.06] hover:border-white/[0.15]` : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  <div className={`text-[10px] uppercase tracking-[0.2em] mb-4 font-medium transition-colors duration-300 group-hover/grp:text-[#3D82F6] ${mt}`}>{col.group}</div>
                  <div className="space-y-2.5">
                    {col.tokens.map((t) => (
                      <div key={t.label} className="group/tok flex items-center gap-3 cursor-pointer">
                        <div
                          className="w-9 h-9 rounded-lg flex-shrink-0 transition-all duration-300 group-hover/tok:scale-110 group-hover/tok:rotate-3 group-hover/tok:shadow-xl"
                          style={{
                            background: t.hex,
                            boxShadow: t.hex === '#FFFFFF' || t.hex.includes('rgba')
                              ? 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                              : 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] font-medium leading-tight transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>{t.label}</div>
                          <div className={`text-[10px] font-mono leading-tight transition-colors duration-300 group-hover/tok:text-[#6BA4FF] ${mt}`}>{t.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── 7.2 — TYPOGRAPHY (Noto Sans Georgian — single typeface) ── */}
          <FadeIn delay={0.1}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.2</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Typography — Noto Sans Georgian</h3>
            </div>
            <div className="rounded-2xl border overflow-hidden mb-16 bg-[#090707] border-white/[0.06]">
              <div className="p-8 lg:p-10">
                {/* Header note */}
                <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-3 text-[#9295A6]">Single Typeface · Georgian + Latin coverage</div>
                    <div className="text-[13px] text-white/70 leading-relaxed max-w-md" style={{ fontFamily: F_GE }}>
                      Unispace uses Noto Sans Georgian across the entire product. One typeface, one metric set — both Georgian and Latin scripts render with matching baselines, weights, and rhythm.
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full border border-[#3D82F6]/30 bg-[#3D82F6]/10 text-[#6BA4FF] text-[11px] font-mono">
                    Noto Sans Georgian
                  </div>
                </div>

                {/* Mega display */}
                <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">DISPLAY · 72px · 700</div>
                <div className="text-6xl lg:text-7xl text-white mb-10 tracking-[-0.02em]" style={{ fontFamily: F_GE, fontWeight: 700 }}>
                  გამარჯობა
                </div>

                {/* Weight specimen */}
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 mb-10">
                  {[
                    { weight: 700, label: 'Bold · 700',     sample: 'უნივერსიტეტი' },
                    { weight: 600, label: 'SemiBold · 600', sample: 'რეგისტრაცია' },
                    { weight: 500, label: 'Medium · 500',   sample: 'პროექტის ატვირთვა' },
                    { weight: 400, label: 'Regular · 400',  sample: 'უნილაბის სამართავ პანელი' },
                  ].map((w) => (
                    <div key={w.label}>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1.5 font-mono">{w.label}</div>
                      <div className="text-2xl text-white" style={{ fontFamily: F_GE, fontWeight: w.weight }}>{w.sample}</div>
                    </div>
                  ))}
                </div>

                {/* Latin sample with same typeface */}
                <div className="border-t border-white/[0.06] pt-6 grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">GEORGIAN BODY · 14px · 400</div>
                    <p className="text-[14px] text-white/70 leading-relaxed" style={{ fontFamily: F_GE, fontWeight: 400 }}>
                      ერთიანი ტიპოგრაფიული სისტემა — სათაურები, ფორმის ლეიბლები, სტატუსები და მთავარი ტექსტი. ერთი შრიფტი ანბანის ყველა ფორმისთვის.
                    </p>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">LATIN BODY · 14px · 400</div>
                    <p className="text-[14px] text-white/70 leading-relaxed" style={{ fontFamily: F_GE, fontWeight: 400 }}>
                      A single typographic system — headings, form labels, statuses, and body text. One typeface for every shape of the alphabet, both scripts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Type scale footer */}
              <div className="border-t border-white/[0.06] px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
                {[
                  { l: 'Display',  r: '48–72px · 700' },
                  { l: 'Heading',  r: '20–32px · 600–700' },
                  { l: 'Body',     r: '14–16px · 400' },
                  { l: 'Caption',  r: '10–11px · 500 · +0.15em' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-1">{s.l}</div>
                    <div className="text-white/80 font-mono">{s.r}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── 7.3 — FORM SYSTEM (Inputs + Dropdown + Checkbox + Buttons) ── */}
          <FadeIn delay={0.15}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.3</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Form System — Inputs, Selectors & Actions</h3>
            </div>
            <div className="rounded-2xl border p-8 lg:p-10 bg-[#090707] border-white/[0.06] mb-16">
              <div className="grid md:grid-cols-2 gap-12">
                {/* INPUTS COLUMN */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-6 text-[#9295A6]">Input States · 4 variants</div>
                  <div className="space-y-5">
                    {/* Default */}
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">DEFAULT</div>
                      <label className="block text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>ელ-ფოსტა</label>
                      <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center text-[13px] text-zinc-400" style={{ fontFamily: BRAND.bodyFont }}>
                        @unilab.ge
                      </div>
                    </div>
                    {/* Focused */}
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">FOCUSED · WITH ICON</div>
                      <label className="block text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>პაროლი</label>
                      <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900 ring-2 ring-[#3D82F6] ring-offset-2 ring-offset-[#090707]" style={{ fontFamily: BRAND.bodyFont }}>
                        <span>••••••••••</span>
                        <Eye size={14} className="text-zinc-400" />
                      </div>
                    </div>
                    {/* Error */}
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">ERROR</div>
                      <label className="block text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>სახელი</label>
                      <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900 ring-2 ring-[#F87171]" style={{ fontFamily: BRAND.bodyFont }}>
                        <span className="text-zinc-300">........</span>
                        <span className="w-4 h-4 rounded-full border-2 border-[#F87171] text-[#F87171] text-[9px] flex items-center justify-center font-bold">!</span>
                      </div>
                      <p className="text-[11px] mt-2 text-[#F87171]" style={{ fontFamily: F_GE }}>სახელის მითითება აუცილებელია</p>
                    </div>
                    {/* Dropdown */}
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">DROPDOWN · CLOSED</div>
                      <label className="block text-[12px] mb-2 text-white/70" style={{ fontFamily: F_GE }}>სტატუსი</label>
                      <div className="w-full h-11 rounded-[10px] bg-white px-4 flex items-center justify-between text-[13px] text-zinc-900" style={{ fontFamily: BRAND.bodyFont }}>
                        <span style={{ fontFamily: F_GE }}>სტუდენტი</span>
                        <ArrowRight size={13} className="text-zinc-400 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SELECTORS + BUTTONS COLUMN */}
                <div className="space-y-9">
                  {/* Checkbox */}
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">Checkbox · 4 states</div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { state: 'Unchecked', checked: false, disabled: false },
                        { state: 'Checked',   checked: true,  disabled: false },
                        { state: 'Disabled',  checked: false, disabled: true },
                        { state: 'Done',      checked: true,  disabled: true },
                      ].map((c) => (
                        <div key={c.state} className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                            style={{
                              background: c.checked ? '#3D82F6' : 'transparent',
                              border: `1.5px solid ${c.checked ? '#3D82F6' : c.disabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)'}`,
                              opacity: c.disabled ? 0.5 : 1,
                            }}
                          >
                            {c.checked && <CheckCircle size={10} className="text-white" strokeWidth={3} />}
                          </span>
                          <span className="text-[12px] text-white/70" style={{ fontFamily: BRAND.bodyFont }}>{c.state}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">Buttons · 3 variants</div>
                    <div className="space-y-5">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">PRIMARY · FILLED</div>
                        <div className="flex flex-wrap gap-3">
                          <button className="h-11 px-6 rounded-[10px] bg-[#3D82F6] text-white text-[13px] font-medium hover:bg-[#6BA4FF] transition-colors" style={{ fontFamily: F_GE }}>
                            ავტორიზაცია
                          </button>
                          <button className="h-11 px-6 rounded-[10px] bg-[#3D82F6]/40 text-white/50 text-[13px] cursor-not-allowed" style={{ fontFamily: F_GE }}>
                            Disabled
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">SECONDARY · OUTLINED</div>
                        <div className="flex flex-wrap gap-3">
                          <button className="h-11 px-6 rounded-[10px] border border-white/30 text-white text-[13px] hover:bg-white/[0.04] hover:border-white/50 transition-colors" style={{ fontFamily: F_GE }}>
                            გაუქმება
                          </button>
                          <button className="h-11 px-6 rounded-[10px] border border-[#3D82F6] text-[#3D82F6] text-[13px] hover:bg-[#3D82F6]/10 transition-colors" style={{ fontFamily: F_GE }}>
                            დამატება
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 font-mono">TEXT · LINK</div>
                        <div className="flex flex-wrap items-center gap-5">
                          <a className="text-[13px] text-white font-semibold underline underline-offset-4 cursor-pointer" style={{ fontFamily: F_GE }}>
                            დარეგისტრირდი
                          </a>
                          <a className="text-[13px] text-[#9295A6] hover:text-white cursor-pointer transition-colors" style={{ fontFamily: F_GE }}>
                            დაგავიწყდა პაროლი?
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── 7.4 — STATUS SYSTEM ── */}
          <FadeIn delay={0.2}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.4</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Status System — Pills & Row Indicators</h3>
            </div>
            <div className="rounded-2xl border p-8 lg:p-10 bg-[#090707] border-white/[0.06] mb-16">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Pills */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">Status Pills · 5 types</div>
                  <div className="space-y-3">
                    {[
                      { label: 'დასრულებული',   en: 'Completed',   bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.35)',  text: '#22C55E' },
                      { label: 'გამოცხადებული', en: 'Announced',   bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
                      { label: 'მიმდინარე',      en: 'In Progress', bg: 'rgba(61,130,246,0.12)', border: 'rgba(61,130,246,0.35)', text: '#6BA4FF' },
                      { label: 'უარყოფილი',     en: 'Rejected',    bg: 'rgba(248,113,113,0.12)',border: 'rgba(248,113,113,0.35)',text: '#F87171' },
                      { label: 'მონახაზი',       en: 'Draft',       bg: 'rgba(146,149,166,0.12)',border: 'rgba(146,149,166,0.35)',text: '#9295A6' },
                    ].map((s) => (
                      <div key={s.label} className="group/pill flex items-center gap-4 cursor-pointer">
                        <motion.span
                          whileHover={{ scale: 1.06, y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="px-3 py-1 rounded-full text-[11px] border flex-shrink-0 transition-shadow duration-200"
                          style={{ background: s.bg, borderColor: s.border, color: s.text, fontFamily: F_GE, fontWeight: 500, boxShadow: `0 0 0 0 ${s.text}00` }}
                        >
                          {s.label}
                        </motion.span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/30 transition-colors duration-300 group-hover/pill:text-white/60">{s.en}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row indicators */}
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">Table Row · Left-Edge Indicator</div>
                  <div className="space-y-2">
                    {[
                      { state: 'Completed',  color: '#22C55E' },
                      { state: 'Announced',  color: '#F59E0B' },
                      { state: 'In Review',  color: '#3D82F6' },
                      { state: 'Rejected',   color: '#F87171' },
                    ].map((r) => (
                      <div key={r.state} className="group/row relative flex items-center h-11 rounded-r-[10px] bg-white/[0.02] border border-white/[0.06] overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.12] hover:translate-x-1">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] transition-[width] duration-300 group-hover/row:w-[5px]" style={{ background: r.color }} />
                        <div className="pl-5 pr-4 flex items-center justify-between w-full">
                          <span className="text-[12px] text-white/80 transition-colors duration-300 group-hover/row:text-white" style={{ fontFamily: F_GE }}>პითონის სტაჟირება 2024</span>
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] transition-transform duration-300 group-hover/row:scale-105" style={{ color: r.color }}>{r.state}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── 7.5 — DECORATIVE MOTIF ── */}
          <FadeIn delay={0.25}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.5</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Decorative System — Brand Motif</h3>
            </div>
            <div className="rounded-2xl border overflow-hidden mb-16 bg-[#090707] border-white/[0.06]">
              <div className="grid md:grid-cols-2">
                {/* Concentric rings */}
                <div className="relative p-8 overflow-hidden min-h-[300px] border-b md:border-b-0 md:border-r border-white/[0.06]">
                  <svg className="absolute -top-16 -left-16 opacity-50" width="380" height="380" viewBox="0 0 380 380" fill="none" aria-hidden>
                    <defs>
                      <linearGradient id="unispaceRingGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#6BA4FF" />
                        <stop offset="50%"  stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                    </defs>
                    {[...Array(22)].map((_, i) => (
                      <circle
                        key={i}
                        cx="190"
                        cy="190"
                        r={20 + i * 8}
                        fill="none"
                        stroke="url(#unispaceRingGrad)"
                        strokeWidth="0.7"
                        strokeDasharray="2 5"
                        opacity={1 - i * 0.035}
                      />
                    ))}
                  </svg>
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-[0.2em] mb-3 text-[#9295A6]">Concentric Rings</div>
                    <p className="text-[13px] text-white/70 leading-relaxed max-w-xs">Dashed concentric rings on a blue → purple → pink gradient. Signs every auth, onboarding, and verification screen — a calm, technical signature that frames otherwise utilitarian forms.</p>
                  </div>
                </div>

                {/* Spark */}
                <div className="relative p-8 overflow-hidden min-h-[300px] flex items-center justify-center bg-[#0a0a0d]">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden>
                    <defs>
                      <linearGradient id="unispaceSparkGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="#6BA4FF" />
                        <stop offset="100%" stopColor="#A78BFA" />
                      </linearGradient>
                    </defs>
                    <path d="M100 12 L 110 85 L 188 100 L 110 115 L 100 188 L 90 115 L 12 100 L 90 85 Z" fill="none" stroke="url(#unispaceSparkGrad)" strokeWidth="0.9" strokeDasharray="3 3" />
                    <path d="M100 34 L 106 89 L 165 100 L 106 111 L 100 166 L 94 111 L 35 100 L 94 89 Z" fill="none" stroke="url(#unispaceSparkGrad)" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6" />
                  </svg>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#9295A6]">Spark Mark</div>
                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">Corner ornament — used for empty states, success moments, and as a transitional accent between sections.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── 7.6 — LAYOUT & NAVIGATION ── */}
          <FadeIn delay={0.27}>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#3D82F6]">7.6</span>
              <h3 className={`text-sm uppercase tracking-[0.15em] ${mt}`}>Layout & Navigation</h3>
            </div>
            <div className="rounded-2xl border overflow-hidden mb-16 bg-[#090707] border-white/[0.06]">
              <div className="grid md:grid-cols-2">
                {/* 12-Column Grid */}
                <div className="group/grid p-8 border-b md:border-b-0 md:border-r border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">12-Column Grid · Desktop 1440px</div>
                  <div className="relative h-44 bg-white/[0.02] rounded-lg border border-white/[0.04] overflow-hidden transition-colors duration-300 group-hover/grid:border-[#3D82F6]/30">
                    <div className="absolute inset-0 grid grid-cols-12 gap-2 p-3">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.6 }}
                          whileHover={{ opacity: 1, scale: 1.03 }}
                          transition={{ duration: 0.2 }}
                          className="bg-[#3D82F6]/[0.08] border border-[#3D82F6]/20 rounded-sm h-full group-hover/grid:bg-[#3D82F6]/[0.16] group-hover/grid:border-[#3D82F6]/40 transition-all duration-500"
                          style={{ transitionDelay: `${i * 25}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-[10px]">
                    <div>
                      <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-0.5">Columns</div>
                      <div className="text-white/80 font-mono">12</div>
                    </div>
                    <div>
                      <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-0.5">Gutter</div>
                      <div className="text-white/80 font-mono">24px</div>
                    </div>
                    <div>
                      <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-0.5">Margin</div>
                      <div className="text-white/80 font-mono">48px</div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="p-8">
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-5 text-[#9295A6]">Sidebar · Collapsible Icon Rail</div>
                  <div className="flex gap-5 items-start">
                    {/* Mini sidebar mockup */}
                    <div className="w-14 rounded-lg bg-white/[0.02] border border-white/[0.06] p-2 flex flex-col gap-1.5">
                      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-md bg-[#3D82F6] flex items-center justify-center text-white shadow-lg shadow-[#3D82F6]/30 cursor-pointer">
                        <LayoutGrid size={15} />
                      </motion.div>
                      {[<PenTool size={14} key="p" />, <BookOpen size={14} key="b" />, <Component size={14} key="c" />].map((icon, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.08, backgroundColor: 'rgba(255,255,255,0.06)' }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-md flex items-center justify-center text-white/40 cursor-pointer transition-colors hover:text-white"
                        >
                          {icon}
                        </motion.div>
                      ))}
                    </div>
                    {/* Description */}
                    <div className="flex-1">
                      <p className="text-[12px] text-white/70 leading-relaxed mb-4" style={{ fontFamily: F_GE }}>
                        Persistent icon rail at 56px wide. Active route filled with the primary blue. Expands to 240px on chevron click to reveal full Georgian labels.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-[10px]">
                        <div>
                          <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-0.5">Collapsed</div>
                          <div className="text-white/80 font-mono">56px</div>
                        </div>
                        <div>
                          <div className="text-[#9295A6] uppercase tracking-[0.15em] mb-0.5">Expanded</div>
                          <div className="text-white/80 font-mono">240px</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* ── BY THE NUMBERS ── */}
          <FadeIn delay={0.3}>
            <div className={`rounded-2xl border p-6 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500 hover:border-[#3D82F6]/20 ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
              {[
                { n: '38+',  label: 'Total Components' },
                { n: '100%', label: 'Auto-layout Coverage' },
                { n: '4+',   label: 'States per Component' },
                { n: '3',    label: 'Responsive Breakpoints' },
              ].map((s) => (
                <div key={s.label} className="group/n text-center cursor-default">
                  <div className="text-3xl tracking-[-0.03em] mb-1 transition-transform duration-300 group-hover/n:scale-110 group-hover/n:-translate-y-0.5" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}>{s.n}</div>
                  <div className={`text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 group-hover/n:text-[#6BA4FF] ${mt}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── OUTCOME ────────────────────────────────────────────── */}
      <section id="outcome" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <SectionTag number="08" label="Outcome" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              Delivered, tested,<br /><span style={{ color: BRAND.blue }}>and handed off</span>
            </h2>
            <p className={`text-base leading-relaxed max-w-2xl mb-16 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Unispace launched as an active internal platform for Unilab students and staff. All three user roles went live with complete flows, tested with real users before handoff.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[
              { icon: <Users size={20} />,      color: BRAND.blue,    title: '3 Roles Live',              body: 'Student, Lecturer, and Admin dashboards fully designed, documented, and handed off to development.' },
              { icon: <Shield size={20} />,     color: '#10B981',     title: '11 of 14 Issues Resolved',  body: 'Two rounds of usability testing with 8 participants. 14 friction points identified; 11 resolved before final handoff.' },
              { icon: <Palette size={20} />,    color: '#A78BFA',     title: '38+ Component Library',     body: 'Reusable, documented component library with full state coverage. Reduced dev estimation time by ~30%.' },
              { icon: <LayoutGrid size={20} />, color: '#F59E0B',     title: '42 Screens Delivered',       body: 'From registration to portfolio — every screen for every role across three breakpoints (1440 / 768 / 375px).' },
              { icon: <Code2 size={20} />,      color: '#F87171',     title: 'Clean Figma Handoff',        body: 'Full Figma annotations, component specs, spacing tokens, and interaction notes. Engineers had everything they needed on day one.' },
              { icon: <CheckCircle size={20} />,color: '#34D399',     title: '17 Edge Cases Covered',      body: 'Every form state, empty state, loading state, error state, and conditional path documented and designed before handoff.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.07}>
                <div className={`group relative rounded-2xl border p-7 h-full overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 ${isDark ? `${cardBg} border-white/[0.06] hover:border-white/[0.15]` : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  {/* Corner glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 100% 0%, ${item.color}18, transparent 60%)` }}
                  />
                  <div
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${item.color}15`, color: item.color, boxShadow: '0 0 0 0 transparent' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className={`relative text-base mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>{item.title}</h3>
                  <p className={`relative text-[13px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Usability testing callout */}
          <FadeIn delay={0.2}>
            <div className={`rounded-2xl border p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-[#3D82F6]/10 ${isDark ? 'border-[#3D82F6]/20 bg-[#3D82F6]/[0.04] hover:border-[#3D82F6]/40' : 'border-blue-200 bg-blue-50/50 hover:border-blue-300'}`}>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { n: '8',   label: 'Test Participants' },
                  { n: '2',   label: 'Testing Rounds' },
                  { n: '14',  label: 'Issues Found' },
                  { n: '11',  label: 'Resolved Pre-Handoff' },
                ].map((s) => (
                  <div key={s.label} className="group/u cursor-default">
                    <div className="text-4xl tracking-[-0.04em] mb-1 transition-transform duration-300 group-hover/u:scale-110" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}><CountUp end={Number(s.n)} /></div>
                    <div className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 group-hover/u:text-[#6BA4FF] ${mt}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── REFLECTION ─────────────────────────────────────────── */}
      <section id="reflection" className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <SectionTag number="09" label="Reflection" />
            <h2 className={`text-4xl lg:text-5xl tracking-[-0.03em] mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
              What I learned<br /><span style={{ color: BRAND.blue }}>building Unispace</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {[
              {
                label: 'What worked',
                color: '#10B981',
                items: [
                  'Same-page conditional disclosure was the right call — users never felt lost between form states',
                  'Dark-first design aligned perfectly with Unilab\'s brand and reduced eye fatigue for heavy users',
                  'Building the component library in parallel with screens saved significant rework time late in the project',
                  'Early edge-case documentation prevented last-minute surprises during handoff',
                ],
              },
              {
                label: "What I'd do differently",
                color: '#F59E0B',
                items: [
                  'Run usability testing earlier — Week 5 instead of Week 11 — to catch friction before high-fidelity production',
                  'Design mobile-first instead of adapting from desktop; the 375px breakpoint required more rework than expected',
                  'Involve an admin user earlier in the research phase — most insights came from students and lecturers',
                  'Create a more detailed motion spec alongside the component library for better dev alignment',
                ],
              },
              {
                label: 'Key learnings',
                color: BRAND.blue,
                items: [
                  'Role-based design requires a strict separation of context — the same component can mean different things to different roles',
                  'Internal tools demand higher information density than consumer apps — hierarchy becomes critical at every level',
                  'Edge cases are first-class citizens, not afterthoughts — 17 cases documented before design phase saved 40+ hours',
                  'A visible-disabled state with tooltip is almost always better than hiding a feature entirely',
                ],
              },
            ].map((col, i) => (
              <FadeIn key={col.label} delay={i * 0.1}>
                <div className={`group relative rounded-2xl border p-7 h-full overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 ${isDark ? `${cardBg} border-white/[0.06] hover:border-white/[0.15]` : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                  {/* Animated top accent stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                    style={{ background: col.color }}
                  />
                  {/* Subtle glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${col.color}14, transparent 70%)` }}
                  />
                  <div className={`relative text-[10px] uppercase tracking-[0.2em] mb-5 font-medium transition-transform duration-300 group-hover:translate-x-0.5`} style={{ color: col.color }}>{col.label}</div>
                  <ul className="relative space-y-4">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-150" style={{ background: col.color }} />
                        <span className={`text-[13px] leading-relaxed transition-colors duration-300 ${isDark ? 'text-zinc-300 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-700'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* ─── NEXT PROJECT ───────────────────────────────────────── */}
      <NextProjectRecommendation currentProject="unispace" />
    </div>
  );
}
