import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FadeIn, CountUp, GlowCard, ShineText, StaggerChildren, StaggerItem, ScrollProgress, AnimatedDivider, ScaleOnScroll, MagneticWrap, ParallaxFloat, ScrollRevealScale } from './animated-helpers';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Sun, Moon,
  Package, FileText, Settings, HelpCircle, Code,
  Truck, Tags, ClipboardList, Send, Users, Search,
  PenTool, CheckCircle, Layers, Zap, Eye, Shield,
  Monitor, ChevronDown, ChevronUp, Home,
} from 'lucide-react';

import { useTheme } from './theme-provider';
import { BrowserMockup } from './device-mockup';
import { NextProjectRecommendation } from './next-project';
import { CaseStudySectionNav } from './case-study-nav';
import { SchenkerSEO } from './seo';
import schenkerSvgPaths from '../../imports/svg-0abw9z02wj';

// ─── Schenker Screen Imports ───────────────────────────────────
const screenSettings = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041604/d4d1e42280872aa3079a1b940b29790994d2b241_jcnrf6.webp';
const screenFrachtbrief = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenHelp = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenLabels = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041563/78c6f45f9246b9cea5c0520f003d32cb8fb21ff1_kmea60.webp';
const screenLadeliste = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungEmpfanger = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041645/1afd387db904f4cec4c15bfa6b7966e601ef294b_towksm.webp';
const screenSendungInfo = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungPakete = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungVersender = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenApiSchluessel = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenApiDoku = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenSendungsdaten = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';
const screenVersenderForm = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774018732/Sendung_yy4ptf.png';

/* ─── Cloudinary Key Screens ─────────────────────────────────────── */
const cloudSendungEmpfanger = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017032/Sendung-Empfa%CC%88nger_fuype4.webp';
const cloudSendungInfo = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017032/Sendung-Informationen_zumtpf.webp';
const cloudSendungPakete = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774017030/Sendung-Pakete_qo2biq.webp';
const cloudLabelsTracking = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018698/Labels_und_Tracking_qetlrm.png';
const cloudEinstellungen = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018694/Einstellungen_huzhr5.png';
const cloudEntwickler = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774018734/Entwickler_vekdwm.png';

/* ─── Brand Tokens ─────────────────────────────────────────────── */
const BRAND = {
  olive: '#6B8E23',
  oliveLight: '#8FBC3B',
  oliveDark: '#4A6B16',
  red: '#CC0000',
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
      <span className="text-[#6B8E23] text-sm font-mono">{number}</span>
      <div className="w-8 h-px bg-[#6B8E23]/40" />
      <span className={`text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{label}</span>
    </div>
  );
};

/* ─── Screen Gallery Item ──────────────────────────────────────── */
const ScreenCard = ({
  src, label, description, icon, delay = 0, isDark = true,
}: {
  src: string; label: string; description: string; icon: React.ReactNode; delay?: number; isDark?: boolean;
}) => (
  <FadeIn delay={delay}>
    <div className="group">
      <div className={`rounded-xl overflow-hidden mb-4 border shadow-lg ${isDark ? 'border-white/[0.06] shadow-black/30' : 'border-zinc-200 shadow-zinc-200/50'}`}>
        <img src={src} alt={label} width="1440" height="900" className="w-full group-hover:scale-[1.02] transition-transform duration-700" />
      </div>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isDark ? 'bg-[#6B8E23]/10' : 'bg-lime-50'}`}>
          <span className="text-[#6B8E23]">{icon}</span>
        </div>
        <div>
          <h4 className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{label}</h4>
          <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{description}</p>
        </div>
      </div>
    </div>
  </FadeIn>
);

/* ─── Process Step ─────────────────────────────────────────────── */
const ProcessStep = ({
  number, title, desc, icon, isDark,
}: {
  number: string; title: string; desc: string; icon: React.ReactNode; isDark: boolean;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`p-6 rounded-xl border text-center group ${isDark ? 'border-white/[0.04] bg-[#121318]/60' : 'border-zinc-200 bg-white'}`}
  >
    <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-[#6B8E23]/10' : 'bg-lime-50'} text-[#6B8E23] group-hover:bg-[#6B8E23] group-hover:text-white transition-all duration-300`}>
      {icon}
    </div>
    <div className="text-[#6B8E23]/40 text-[10px] font-mono mb-2">{number}</div>
    <h4 className={`text-sm mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{title}</h4>
    <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{desc}</p>
  </motion.div>
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
          className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl transition-colors group focus-visible:!shadow-[0_0_0_2px_rgba(107,142,35,0.5)] ${
            isDark
              ? 'bg-[#6B8E23]/90 hover:bg-[#6B8E23] shadow-[#6B8E23]/20 text-white'
              : 'bg-[#6B8E23] hover:bg-[#6B8E23]/90 shadow-[#6B8E23]/30 text-white'
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

/* ═════════════════════════════════════════════════════════════════ */
/* ─── SCHENKER CASE STUDY PAGE ────────────────────────────────── */
/* ═════════════════════════════════════════════════════════════════ */
export function SchenkerCaseStudy() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Tab state removed — key screens now use side-by-side layout
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

  const screenTabs = [
    { label: 'Sendung — Empfänger', src: screenSendungEmpfanger, desc: 'Receiver data entry with structured form fields for address, contact info, and shipment details', icon: <Users size={14} /> },
    { label: 'Sendung — Informationen', src: screenSendungInfo, desc: 'Shipment settings with delivery options, notification toggles, and transport notes', icon: <FileText size={14} /> },
    { label: 'Sendung — Versender', src: screenSendungVersender, desc: 'Sender information form with company details, address, and contact fields', icon: <Send size={14} /> },
    { label: 'Sendung — Pakete', src: screenSendungPakete, desc: 'Package management with dimensions, weight, volume, and pallet configuration', icon: <Package size={14} /> },
    { label: 'Labels & Tracking', src: screenLabels, desc: 'Label generation and tracking URL management with tabular shipment list view', icon: <Tags size={14} /> },
    { label: 'Ladeliste', src: screenLadeliste, desc: 'Packing list management with document viewing, editing, and download controls', icon: <ClipboardList size={14} /> },
    { label: 'Frachtbrief', src: screenFrachtbrief, desc: 'Waybill management interface with structured document actions and filtering', icon: <Truck size={14} /> },
    { label: 'Einstellungen', src: screenSettings, desc: 'Workstation settings with printer configuration, API setup, and license management', icon: <Settings size={14} /> },
    { label: 'Help', src: screenHelp, desc: 'Help center with documentation access and support contact options', icon: <HelpCircle size={14} /> },
    { label: 'Entwickler — API-Schlüssel', src: screenApiSchluessel, desc: 'API key management with webhook configuration for developer integration', icon: <Code size={14} /> },
    { label: 'Entwickler — API-Doku', src: screenApiDoku, desc: 'API documentation with REST endpoints, authentication guide, and error codes', icon: <Code size={14} /> },
    { label: 'Sendungsdaten', src: screenSendungsdaten, desc: 'Shipment data entry with product selection, incoterms, customs and logistics options', icon: <Truck size={14} /> },
  ];

  // screenTabs data is still used by the key screens section for descriptions

  return (
    <div className={`${bg} min-h-screen transition-colors duration-500 relative`} style={{ fontFamily: BRAND.bodyFont }}>
      <SchenkerSEO />
      {/* Scroll to top */}
      <ScrollToTopButton />
      {/* Section navigator */}
      <CaseStudySectionNav
        accentColor="#6B8E23"
        sections={[
          { id: 'hero', label: 'Hero' },
          { id: 'story', label: 'Story' },
          { id: 'overview', label: 'Overview' },
          { id: 'challenge', label: 'Challenge' },
          { id: 'structure', label: 'Structure' },
          { id: 'flow', label: 'Shipment Flow' },
          { id: 'screens', label: 'Screens' },
          { id: 'documents', label: 'Documents' },
          { id: 'approach', label: 'Approach' },
          { id: 'outcome', label: 'Outcome' },
        ]}
      />
      {/* Cursor */}
      <motion.div className="fixed w-8 h-8 border border-[#6B8E23]/60 rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block" animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} />
      <motion.div className="fixed w-1.5 h-1.5 bg-[#6B8E23] rounded-full pointer-events-none z-[60] mix-blend-difference hidden lg:block" animate={{ x: mousePosition.x - 3, y: mousePosition.y - 3 }} transition={{ type: 'spring', damping: 50, stiffness: 400 }} />

      {/* ─── NAV ──────────────────────────────────────────────────────── */}
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
                className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1.5 min-h-[44px] focus-visible:!shadow-[0_0_0_2px_rgba(107,142,35,0.4)] ${isDark ? 'text-[#9295A6] hover:text-white hover:bg-white/[0.04]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'} transition-colors`}
              >
                <ArrowLeft size={15} />
                <span className="text-[12px] tracking-wide">Back to Portfolio</span>
              </motion.button>
            <div className={`w-px h-5 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
            <div className="flex items-center gap-2.5">
              <svg className="h-[24px] w-auto" fill="none" viewBox="0 0 227.898 36.56">
                <g clipPath="url(#schenkerNavClip)">
                  <path d={schenkerSvgPaths.p21938980} fill={isDark ? 'white' : '#121212'} />
                  <path d={schenkerSvgPaths.p1fc21500} fill="#FF0000" />
                </g>
                <defs>
                  <clipPath id="schenkerNavClip">
                    <rect fill="white" height="36.56" width="227.898" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:flex gap-5">
              {['Overview', 'Screens', 'Flow'].map((item) => (
                <motion.a key={item} href={`#${item.toLowerCase()}`} whileHover={{ y: -1 }} className={`text-[12px] tracking-wide rounded-md px-2 py-1 focus-visible:!shadow-[0_0_0_2px_rgba(107,142,35,0.4)] ${isDark ? 'text-[#9295A6] hover:text-white' : 'text-zinc-500 hover:text-zinc-900'} transition-colors`}>{item}</motion.a>
              ))}
            </div>

          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-6 lg:px-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #6B8E23 0%, transparent 60%)' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${isDark ? 'border-[#6B8E23]/30 bg-[#6B8E23]/10 text-[#8FBC3B]' : 'border-[#6B8E23]/20 bg-[#6B8E23]/5 text-[#6B8E23]'}`}>Case Study</span>
              <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${isDark ? 'bg-white/[0.03] text-[#9295A6]' : 'bg-zinc-100 text-zinc-400'}`}>Enterprise UX</span>
              <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${isDark ? 'bg-white/[0.03] text-[#9295A6]' : 'bg-zinc-100 text-zinc-400'}`}>Desktop</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-[-0.03em] mb-6" style={{ fontFamily: BRAND.headingFont }}>
              <span className="text-[#6B8E23]">SCHENKER</span>
              <br />
              <span className={isDark ? 'text-white/90' : 'text-zinc-800'}>Logistics Platform</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mb-8 ${bt}`}>
              Simplifying a complex shipping workflow — designing a structured logistics interface for shipment creation, document handling, and operational efficiency.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-2 mb-12">
              {['UI/UX Design', 'Enterprise', 'Form Systems', 'Desktop App', 'Logistics'].map((tag) => (
                <span key={tag} className={`text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg ${isDark ? 'bg-white/[0.03] text-[#9295A6] border border-white/[0.04]' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Hero Screen Preview */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <BrowserMockup url="schenkerclient.cubsten.com" dark={false}>
                <img src={screenSendungEmpfanger} alt="Schenker — Sendung" width="1440" height="900" className="w-full" />
              </BrowserMockup>
              {/* Floating secondary screens */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hidden lg:block absolute -right-6 top-20 w-[35%] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10"
              >
                <img src={screenSettings} alt="Settings" width="1440" height="900" className="w-full" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="hidden lg:block absolute -left-4 bottom-10 w-[30%] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10"
              >
                <img src={screenLabels} alt="Labels" width="1440" height="900" className="w-full" />
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <FadeIn delay={0.8}>
          <div className="flex flex-col items-center mt-16 gap-2">
            <span className={`text-[9px] uppercase tracking-[0.2em] ${mt}`}>Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={14} className={mt} />
            </motion.div>
          </div>
        </FadeIn>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── STORYTELLING: Hook → Friction → Pivot → Proof ──────────── */}
      <section id="story" className="relative py-20 lg:py-28 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {[
            {
              step: 'Hook',
              number: '00.1',
              text: 'What if enterprise logistics software could feel intuitive — not like a spreadsheet with buttons?',
              accent: BRAND.olive,
              icon: <Eye size={16} />,
            },
            {
              step: 'Friction',
              number: '00.2',
              text: 'Schenker\'s internal tools drowned operators in form complexity, scattered workflows, and inconsistent UI patterns. Training costs soared. Error rates climbed.',
              accent: '#F87171',
              icon: <Zap size={16} />,
            },
            {
              step: 'Pivot',
              number: '00.3',
              text: 'We unified shipment creation, label management, and settings into one coherent design language — progressive disclosure over cognitive overload.',
              accent: '#10B981',
              icon: <PenTool size={16} />,
            },
            {
              step: 'Proof',
              number: '00.4',
              text: 'Desktop-first enterprise platform. Streamlined multi-step forms. Contextual help system. One design system for the entire logistics workflow.',
              accent: BRAND.oliveLight,
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
              Designing <span className="text-[#6B8E23]">clarity</span> for<br />enterprise logistics
            </h2>
            <div className="max-w-3xl">
              <p className={`${bt} leading-relaxed mb-4`}>
                SCHENKER is a desktop shipping management platform built for operational logistics tasks. The system brings together shipment creation, sender and receiver data, package setup, labels and tracking, packing lists, waybills, settings, and technical tools inside one workflow.
              </p>
              <p className={`${mt} text-sm leading-relaxed`}>
                The goal was to make this complexity feel clear, structured, and manageable in daily use — a product built for real operations, not just presentation.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
              {[
                { value: 9, suffix: '', label: 'Modules', sub: 'Product Areas', icon: <Layers size={20} />, color: '#6B8E23' },
                { value: 5, suffix: '', label: 'Shipment Steps', sub: 'Multi-step flow', icon: <Truck size={20} />, color: '#8FBC3B' },
                { value: 3, suffix: '', label: 'Document Types', sub: 'Labels · Lists · Waybills', icon: <FileText size={20} />, color: '#6B8E23' },
                { value: 1, suffix: '', label: 'Platform', sub: 'Desktop App', icon: <Monitor size={20} />, color: '#9295A6' },
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
                    <h3 className="text-xl text-[#6B8E23]" style={{ fontFamily: BRAND.headingFont }}>The Challenge</h3>
                  </div>
                  <p className={`text-[13px] ${bt} leading-relaxed mb-5`}>
                    Enterprise logistics systems become difficult to use because they combine many repetitive, detail-heavy tasks in one place.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      'Multi-step shipment setup complexity',
                      'Large amounts of form input',
                      'Document-heavy workflows',
                      'Need for operational speed',
                      'Technical setup & configuration'
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
                    <div className="w-9 h-9 rounded-xl bg-[#6B8E23]/10 flex items-center justify-center"><Shield size={16} className="text-[#6B8E23]" /></div>
                    <h3 className="text-xl text-[#6B8E23]" style={{ fontFamily: BRAND.headingFont }}>The Solution</h3>
                  </div>
                  <p className={`text-[13px] ${bt} leading-relaxed mb-5`}>
                    A clear, modular interface with strong workflow thinking, structured form design, and consistency across complex modules.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      'Step-based shipment creation flow',
                      'Grouped & scannable form fields',
                      'Consistent table-based document views',
                      'Strong side navigation structure',
                      'Separated operational & technical areas'
                    ].map((item, i) => (
                      <li key={i} className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                        <span className="text-[#6B8E23] mt-0.5 text-[10px]">&#x2713;</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── PRODUCT STRUCTURE ─────────────────────────────────────────── */}
      <section id="structure" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="03" label="Product Structure" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-16" style={{ fontFamily: BRAND.headingFont }}>
              Modular <span className="text-[#6B8E23]">architecture</span>
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { num: '01', title: 'Sendung', desc: 'Shipment creation', icon: <Truck size={18} /> },
              { num: '02', title: 'Labels', desc: 'Labels & Tracking', icon: <Tags size={18} /> },
              { num: '03', title: 'Ladeliste', desc: 'Packing lists', icon: <ClipboardList size={18} /> },
              { num: '04', title: 'Frachtbrief', desc: 'Waybills', icon: <FileText size={18} /> },
              { num: '05', title: 'Einstellungen', desc: 'Settings', icon: <Settings size={18} /> },
              { num: '06', title: 'Help', desc: 'Documentation', icon: <HelpCircle size={18} /> },
              { num: '07', title: 'Entwickler', desc: 'Developer tools', icon: <Code size={18} /> },
            ].map((step) => (
              <StaggerItem key={step.num}>
                <ProcessStep {...step} isDark={isDark} number={step.num} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── SHIPMENT FLOW ───────────────────────────────────────────── */}
      <section id="flow" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="04" label="Shipment Flow" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-4" style={{ fontFamily: BRAND.headingFont }}>
              Step-based <span className="text-[#6B8E23]">shipment</span> creation
            </h2>
            <p className={`${bt} max-w-xl mb-16 leading-relaxed text-sm`}>
              Instead of placing everything on one screen, the flow is divided into clear steps that reduce cognitive load and make complex data entry easier to complete.
            </p>
          </FadeIn>

          <div className="space-y-20">
            {[
              {
                num: '01', icon: <Send size={16} className="text-[#6B8E23]" />,
                title: 'Sendungsdaten & Informationen',
                desc: 'The starting point: delivery options, notification toggles (SMS, email, driver notifications), and transport remarks.',
                tags: ['Fix Day Zustellung', 'Zustell-Avis', 'Fahreravis'],
                src: screenSendungInfo, url: 'schenkerclient/sendung/informationen', reverse: false
              },
              {
                num: '02', icon: <Users size={16} className="text-[#6B8E23]" />,
                title: 'Versender & Empfanger',
                desc: 'Sender and receiver each have their own focused step — company, address, email, and phone fields separated for clarity and fewer mistakes.',
                tags: ['Firma', 'Address fields', 'Contact info'],
                src: screenSendungEmpfanger, url: 'schenkerclient/sendung/empfanger', reverse: true
              },
              {
                num: '03', icon: <Package size={16} className="text-[#6B8E23]" />,
                title: 'Pakete & Paletten',
                desc: 'Package details as a separate operational layer — dimensions, quantity, weight, volume, and packaging type without mixing with contact data.',
                tags: ['Dimensions', 'Gewicht/Volumen', 'Palette hinzufugen'],
                src: screenSendungPakete, url: 'schenkerclient/sendung/pakete', reverse: false
              },
            ].map((step) => (
              <FadeIn key={step.num}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className={step.reverse ? 'order-1 lg:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl text-[#6B8E23]/30" style={{ fontFamily: BRAND.headingFont }}>{step.num}</span>
                      <div className="w-8 h-px bg-[#6B8E23]/20" />
                      {step.icon}
                    </div>
                    <h3 className="text-xl mb-3" style={{ fontFamily: BRAND.headingFont }}>{step.title}</h3>
                    <p className={`text-[13px] ${bt} leading-relaxed mb-4`}>{step.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((t) => (
                        <span key={t} className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-md ${isDark ? 'bg-[#121318] text-[#9295A6]' : 'bg-zinc-100 text-zinc-400'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={step.reverse ? 'order-2 lg:order-1' : ''}>
                    <ScrollRevealScale scaleFrom={0.92}>
                      <BrowserMockup url={step.url} dark={false}>
                        <img src={step.src} alt={step.title} width="1440" height="900" className="w-full" />
                      </BrowserMockup>
                    </ScrollRevealScale>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── KEY SCREENS ──────────────────────────────────────────────── */}
      <section id="screens" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="05" label="Key Screens" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-5xl leading-tight mb-4" style={{ fontFamily: BRAND.headingFont }}>
              Every module, <span className="text-[#6B8E23]">designed</span>
            </h2>
            <p className={`${bt} max-w-xl leading-relaxed text-sm mb-16`}>
              From shipment data to technical settings — each screen follows the same design language with consistent spacing, layout, and interaction patterns.
            </p>
          </FadeIn>

          <div className="space-y-20">
            {[
              { num: '01', title: 'Sendung — Empfänger', desc: screenTabs[0].desc, src: cloudSendungEmpfanger, icon: <Users size={16} className="text-[#6B8E23]" />, reverse: false, tags: ['Form Design', 'Data Entry', 'Address Fields'] },
              { num: '02', title: 'Sendung — Informationen', desc: screenTabs[1].desc, src: cloudSendungInfo, icon: <FileText size={16} className="text-[#6B8E23]" />, reverse: true, tags: ['Delivery Options', 'Notifications', 'Transport'] },
              { num: '03', title: 'Sendung — Pakete', desc: screenTabs[3].desc, src: cloudSendungPakete, icon: <Package size={16} className="text-[#6B8E23]" />, reverse: false, tags: ['Dimensions', 'Weight', 'Pallet Config'] },
              { num: '04', title: 'Labels & Tracking', desc: screenTabs[4].desc, src: cloudLabelsTracking, icon: <Tags size={16} className="text-[#6B8E23]" />, reverse: true, tags: ['Label Generation', 'Tracking URLs', 'Shipment List'] },
              { num: '05', title: 'Einstellungen', desc: screenTabs[7].desc, src: cloudEinstellungen, icon: <Settings size={16} className="text-[#6B8E23]" />, reverse: false, tags: ['Printer Config', 'API Setup', 'License'] },
              { num: '06', title: 'API-Schlüssel', desc: screenTabs[9].desc, src: cloudEntwickler, icon: <Code size={16} className="text-[#6B8E23]" />, reverse: true, tags: ['API Keys', 'Webhooks', 'Integration'] },
            ].map((step) => (
              <FadeIn key={step.num}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className={step.reverse ? 'order-1 lg:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl text-[#6B8E23]/30" style={{ fontFamily: BRAND.headingFont }}>{step.num}</span>
                      <div className="w-8 h-px bg-[#6B8E23]/20" />
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
                      <BrowserMockup url={`schenkerclient/${step.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} dark={false}>
                        <img src={step.src} alt={step.title} width="1440" height="900" className="w-full block" />
                      </BrowserMockup>
                    </ScrollRevealScale>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DOCUMENT WORKFLOWS ───────────────────────────────────────── */}
      <section id="documents" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="06" label="Document Workflows" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-4" style={{ fontFamily: BRAND.headingFont }}>
              Structured <span className="text-[#6B8E23]">table views</span>
            </h2>
            <p className={`${bt} max-w-xl mb-12 leading-relaxed text-sm`}>
              Labels, packing lists, and waybills rely on structured table views that support quick review, editing, downloading, and deletion. Consistency across these modules helps the system feel more stable.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ScreenCard src={screenLabels} label="Labels und Tracking" description="Shipment list with checkboxes, tracking URLs, label generation, and bulk export functionality." icon={<Tags size={14} />} isDark={isDark} delay={0} />
            <ParallaxFloat speed={0.15} direction="down">
              <ScreenCard src={screenLadeliste} label="Ladeliste (Packing List)" description="Document management table with name, sender, date, download status, edit and delete controls." icon={<ClipboardList size={14} />} isDark={isDark} delay={0.08} />
            </ParallaxFloat>
            <ParallaxFloat speed={0.12}>
              <ScreenCard src={screenFrachtbrief} label="Frachtbrief (Waybill)" description="Waybill management with the same consistent table structure — quick review, download, and edit." icon={<Truck size={14} />} isDark={isDark} delay={0.04} />
            </ParallaxFloat>
            <ScreenCard src={screenSettings} label="Einstellungen (Settings)" description="Workstation and printer configuration, API key management, and license status display." icon={<Settings size={14} />} isDark={isDark} delay={0.12} />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-12"><Divider /></div>

      {/* ─── DESIGN APPROACH ──────────────────────────────────────────── */}
      <section id="approach" className="relative py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <FadeIn><SectionTag number="07" label="Design Approach" /></FadeIn>
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl leading-tight mb-5" style={{ fontFamily: BRAND.headingFont }}>
              Clarity over <span className="text-[#6B8E23]">decoration</span>
            </h2>
            <p className={`${bt} leading-relaxed max-w-xl mb-12`}>
              The interface is built around clarity and operational speed. Its strength comes from structure, not excess.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {[
              { icon: <Eye size={16} />, title: 'Navigation', desc: 'Strong side navigation' },
              { icon: <Layers size={16} />, title: 'Surfaces', desc: 'Large structured areas' },
              { icon: <ArrowRight size={16} />, title: 'Progression', desc: 'Tab-based flow steps' },
              { icon: <Zap size={16} />, title: 'Actions', desc: 'Clear primary & destructive' },
            ].map((item) => (
              <FadeIn key={item.title} delay={0.05}>
                <motion.div whileHover={{ y: -3 }} className={`p-4 rounded-xl border ${isDark ? 'bg-[#121318]/60 border-white/[0.04]' : 'bg-white border-zinc-200'}`}>
                  <div className="text-[#6B8E23] mb-2">{item.icon}</div>
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
                What makes this work <span className="text-[#6B8E23]">stand out</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Strong workflow thinking',
                  'Clear information architecture',
                  'Structured form design',
                  'Consistency across complex modules',
                  'Usability for repeated daily tasks',
                  'Operational & technical support in one product',
                ].map((point) => (
                  <div key={point} className={`flex items-start gap-2.5 text-[13px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                    <span className="text-[#6B8E23] mt-0.5 text-[10px] flex-shrink-0">&#x2713;</span>
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
          <FadeIn><SectionTag number="08" label="Outcome" /></FadeIn>
          <FadeIn>
            <div className="max-w-3xl">
              <h2 className="text-3xl lg:text-4xl leading-tight mb-6" style={{ fontFamily: BRAND.headingFont }}>
                A clearer <span className="text-[#6B8E23]">enterprise</span> interface
              </h2>
              <p className={`${bt} leading-relaxed mb-6`}>
                By breaking complex workflows into focused modules and step-based screens, the platform becomes easier to navigate, easier to complete, and more useful in real working conditions.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Enterprise workflows', 'Complex form systems', 'Document-heavy interfaces', 'Clarity under operational complexity'].map((tag) => (
                  <span key={tag} className={`text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-lg ${isDark ? 'bg-[#6B8E23]/10 text-[#8FBC3B] border border-[#6B8E23]/20' : 'bg-lime-50 text-[#6B8E23] border border-[#6B8E23]/20'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* footer removed */}
      <NextProjectRecommendation currentProject="schenker" />
    </div>
  );
}