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

/* ─── Image constants — replace with real screenshots when available ── */
// TODO: Add actual Unispace screenshots to src/imports/ and update these paths
const IMG_PLACEHOLDER = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const imgScreen       = IMG_PLACEHOLDER;
const imgLayoutGrid   = IMG_PLACEHOLDER;
const imgUpload       = IMG_PLACEHOLDER;
const imgSeparator    = IMG_PLACEHOLDER;
const imgButton       = IMG_PLACEHOLDER;
const imgCheckbox     = IMG_PLACEHOLDER;
const imgDropdown     = IMG_PLACEHOLDER;
const imgFilter       = IMG_PLACEHOLDER;
const imgIcons        = IMG_PLACEHOLDER;

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
      <div className={`rounded-xl overflow-hidden mb-4 border shadow-lg ${isDark ? 'border-white/[0.06] shadow-black/30' : 'border-zinc-200 shadow-zinc-200/50'}`}>
        <img src={src} alt={label} className="w-full block group-hover:scale-[1.02] transition-transform duration-700" />
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isDark ? 'bg-[#3D82F6]/10' : 'bg-blue-50'}`}>
          <span className="text-[#3D82F6]">{icon}</span>
        </div>
        <div>
          <h4 className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{label}</h4>
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
      <CaseStudySectionNav
        accentColor="#3D82F6"
        sections={[
          { id: 'story',      label: 'Story' },
          { id: 'overview',   label: 'Overview' },
          { id: 'challenge',  label: 'Challenge' },
          { id: 'process',    label: 'Process' },
          { id: 'screens',    label: 'Screens' },
          { id: 'decisions',  label: 'Decisions' },
          { id: 'design',     label: 'Design System' },
          { id: 'outcome',    label: 'Outcome' },
          { id: 'reflection', label: 'Reflection' },
        ]}
      />

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
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="#3D82F6" opacity="0.15" stroke="#3D82F6" strokeWidth="1.5" />
                <polygon points="14,5 22,9.5 22,18.5 14,23 6,18.5 6,9.5" fill="#3D82F6" opacity="0.08" />
                <text x="14" y="17.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#3D82F6" fontFamily="Syne, sans-serif">U</text>
              </svg>
              <span className={`text-[13px] tracking-wide font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>
                Unispace
              </span>
            </div>
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
              { label: 'Tools',    value: 'Figma · ProtoPie' },
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
                  { value: 3,  label: 'User Roles',  suffix: '' },
                  { value: 42, label: 'Screens',     suffix: '+' },
                  { value: 38, label: 'Components',  suffix: '+' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className={`text-3xl lg:text-4xl tracking-[-0.04em] mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>
                      <CountUp end={stat.value} />{stat.suffix}
                    </div>
                    <div className={`text-[11px] uppercase tracking-[0.15em] ${mt}`}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className={`relative rounded-2xl overflow-hidden border shadow-2xl ${isDark ? 'border-white/[0.06] shadow-black/60' : 'border-zinc-200 shadow-zinc-300/40'}`}>
                <img src={imgScreen} alt="Unispace platform screenshot" className="w-full block" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(61,130,246,0.08) 100%)' }} />
              </div>
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
                    { label: 'Tools',        value: 'Figma · ProtoPie',          icon: <Component size={16} /> },
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
            <p className={`text-base leading-relaxed max-w-2xl mb-14 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              The core complexity of Unispace: three completely different user journeys — student, lecturer, admin — sharing a single design language. Every screen had to serve its user without bleeding into another role's context.
            </p>
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
              { phase: 'PHASE 01', weeks: 'Weeks 1–2',  title: 'Discover', color: '#3D82F6', items: ['Stakeholder interviews (Unilab team, 4 sessions)', 'Competitive audit (Moodle, Google Classroom, Behance)', 'Technical spec analysis', 'User role mapping (student, lecturer, admin)', '17 edge cases identified and documented'] },
              { phase: 'PHASE 02', weeks: 'Weeks 3–4',  title: 'Define',   color: '#A78BFA', items: ['Information architecture (3 role-specific IA maps)', 'User flow mapping per role (9 flows total)', 'Conditional form logic matrix', 'State inventory: 12 states per key screen', 'Design principles established'] },
              { phase: 'PHASE 03', weeks: 'Weeks 5–10', title: 'Design',   color: '#10B981', items: ['Lo-fi wireframes (42 screens)', 'Dark design system — 38+ components built', 'High-fidelity screens (42 total, 3 roles)', 'Micro-interactions prototyped in ProtoPie', 'Responsive adaptation (1440 / 768 / 375px)'] },
              { phase: 'PHASE 04', weeks: 'Weeks 11–12',title: 'Deliver',  color: '#F59E0B', items: ['Usability testing: 8 participants, 2 rounds', '14 issues identified, 11 resolved pre-handoff', 'Dev handoff with Figma annotations', 'Component spec documentation', 'Design QA with engineering team'] },
            ].map((phase, i) => (
              <FadeIn key={phase.phase} delay={i * 0.1}>
                <div className={`rounded-2xl border p-6 h-full ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
                  <div className="mb-5">
                    <div className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: phase.color }}>{phase.phase}</div>
                    <div className={`text-[10px] uppercase tracking-[0.15em] mb-3 ${mt}`}>{phase.weeks}</div>
                    <h3 className="text-2xl tracking-[-0.03em]" style={{ fontFamily: BRAND.headingFont, fontWeight: 700, color: phase.color }}>{phase.title}</h3>
                  </div>
                  <div className={`w-full h-px mb-5 ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-100'}`} />
                  <ul className="space-y-2.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: phase.color }} />
                        <span className={`text-[12px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
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
            <div className={`rounded-2xl overflow-hidden border mb-8 ${isDark ? 'border-white/[0.06]' : 'border-zinc-200'}`}>
              <img src={imgSeparator} alt="Unispace UI components overview" className="w-full block" />
            </div>
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
              38+ components built with auto-layout, variants, and full state coverage. Noto Sans Georgian ensures consistent readability across both English and Georgian scripts.
            </p>
          </FadeIn>

          {/* Color Tokens */}
          <FadeIn delay={0.05}>
            <h3 className={`text-sm uppercase tracking-[0.15em] mb-6 ${mt}`}>Color Tokens</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-14">
              {[
                { label: 'Background',     hex: '#090707' },
                { label: 'Surface',        hex: '#141212' },
                { label: 'Primary Blue',   hex: '#3D82F6' },
                { label: 'Text Primary',   hex: '#FFFFFF' },
                { label: 'Text Secondary', hex: '#9295A6' },
                { label: 'Success',        hex: '#10B981' },
                { label: 'Error',          hex: '#F87171' },
                { label: 'Warning',        hex: '#FFC701' },
              ].map((color) => (
                <div key={color.label}>
                  <div className="w-full aspect-square rounded-xl mb-2 border" style={{ background: color.hex, borderColor: color.hex === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : color.hex === '#090707' || color.hex === '#141212' ? 'rgba(255,255,255,0.08)' : 'transparent' }} />
                  <div className={`text-[10px] mb-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 600 }}>{color.label}</div>
                  <div className={`text-[10px] font-mono ${mt}`}>{color.hex}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Typography */}
          <FadeIn delay={0.1}>
            <h3 className={`text-sm uppercase tracking-[0.15em] mb-6 ${mt}`}>Typography</h3>
            <div className={`rounded-2xl border p-8 mb-14 ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <div className={`text-[10px] uppercase tracking-[0.2em] mb-3 ${mt}`}>Headings — Syne</div>
                  <div className={`text-5xl tracking-[-0.04em] mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 800 }}>Aa</div>
                  <div className={`text-[13px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Used for all headings, titles, and display text. Weight range: 600–800. Letter-spacing: -0.03em to -0.04em.</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['800', '700', '600'].map((w) => (
                      <span key={w} className={`text-[11px] px-2.5 py-1 rounded-md ${isDark ? 'bg-white/[0.04] text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>Weight {w}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className={`text-[10px] uppercase tracking-[0.2em] mb-3 ${mt}`}>Body + Georgian — Manrope / Noto Sans Georgian</div>
                  <div className={`text-5xl tracking-[-0.02em] mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.bodyFont, fontWeight: 700 }}>Aa</div>
                  <div className={`text-[13px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Body copy, labels, UI text. Noto Sans Georgian ensures native readability for all Georgian-script content with matching metrics.</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['400', '500', '600'].map((w) => (
                      <span key={w} className={`text-[11px] px-2.5 py-1 rounded-md ${isDark ? 'bg-white/[0.04] text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>Weight {w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Component grid */}
          <FadeIn delay={0.15}>
            <h3 className={`text-sm uppercase tracking-[0.15em] mb-6 ${mt}`}>Component Library — 38+ Components</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {[
                { src: imgButton,   label: 'Button',    desc: '6 variants · 3 sizes · All states' },
                { src: imgCheckbox, label: 'Checkbox',  desc: 'Default, checked, error, disabled' },
                { src: imgDropdown, label: 'Dropdown',  desc: 'Single select, multi-select, search' },
                { src: imgFilter,   label: 'Filter',    desc: 'Tag, toggle, range filter types' },
                { src: imgIcons,    label: 'Icons',     desc: '80+ custom icons, 3 sizes' },
                { src: imgLayoutGrid, label: 'Grid',    desc: '12-col, 8-col, and 4-col variants' },
                { src: imgUpload,   label: 'Upload',    desc: 'Drag-and-drop + click-to-browse' },
                { src: imgSeparator,label: 'Dividers',  desc: 'Horizontal, vertical, section breaks' },
              ].map((comp, i) => (
                <FadeIn key={comp.label} delay={i * 0.04}>
                  <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-white/[0.06]' : 'border-zinc-200'}`}>
                    <div className={`overflow-hidden ${isDark ? 'bg-[#141212]' : 'bg-zinc-50'}`}>
                      <img src={comp.src} alt={comp.label} className="w-full block hover:scale-[1.03] transition-transform duration-500" />
                    </div>
                    <div className={`px-3 py-2.5 border-t ${isDark ? 'border-white/[0.04]' : 'border-zinc-100'}`}>
                      <div className={`text-[12px] font-medium mb-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{comp.label}</div>
                      <div className={`text-[10px] ${mt}`}>{comp.desc}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* Component stats row */}
          <FadeIn delay={0.2}>
            <div className={`rounded-2xl border p-6 grid grid-cols-2 md:grid-cols-4 gap-6 ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
              {[
                { n: '38+',  label: 'Total Components' },
                { n: '100%', label: 'Auto-layout' },
                { n: '4+',   label: 'States per Component' },
                { n: '3',    label: 'Breakpoints' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl tracking-[-0.03em] mb-1" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}>{s.n}</div>
                  <div className={`text-[10px] uppercase tracking-[0.15em] ${mt}`}>{s.label}</div>
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
                <div className={`rounded-2xl border p-7 h-full ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <h3 className={`text-base mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 700 }}>{item.title}</h3>
                  <p className={`text-[13px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Usability testing callout */}
          <FadeIn delay={0.2}>
            <div className={`rounded-2xl border p-8 ${isDark ? 'border-[#3D82F6]/20 bg-[#3D82F6]/[0.04]' : 'border-blue-200 bg-blue-50/50'}`}>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { n: '8',   label: 'Test Participants' },
                  { n: '2',   label: 'Testing Rounds' },
                  { n: '14',  label: 'Issues Found' },
                  { n: '11',  label: 'Resolved Pre-Handoff' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-4xl tracking-[-0.04em] mb-1" style={{ fontFamily: BRAND.headingFont, fontWeight: 800, color: BRAND.blue }}><CountUp end={Number(s.n)} /></div>
                    <div className={`text-[11px] uppercase tracking-[0.15em] ${mt}`}>{s.label}</div>
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
                <div className={`rounded-2xl border p-7 h-full ${isDark ? `${cardBg} border-white/[0.06]` : 'bg-white border-zinc-200'}`}>
                  <div className={`text-[10px] uppercase tracking-[0.2em] mb-5 font-medium`} style={{ color: col.color }}>{col.label}</div>
                  <ul className="space-y-4">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: col.color }} />
                        <span className={`text-[13px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Closing quote */}
          <FadeIn delay={0.3}>
            <div className={`mt-14 rounded-2xl border p-10 text-center ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
              <div className="text-5xl mb-4 opacity-20" style={{ color: BRAND.blue, fontFamily: BRAND.headingFont }}>"</div>
              <p className={`text-xl lg:text-2xl leading-relaxed tracking-[-0.01em] max-w-2xl mx-auto ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`} style={{ fontFamily: BRAND.headingFont, fontWeight: 500 }}>
                Designing for three roles in one system taught me that clarity is not a feature — it's the foundation everything else is built on.
              </p>
              <div className={`mt-6 text-[11px] uppercase tracking-[0.2em] ${mt}`}>Salome Mosiava — Lead Designer, Unispace</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── NEXT PROJECT ───────────────────────────────────────── */}
      <NextProjectRecommendation currentProject="unispace" />
    </div>
  );
}
