import { useEffect, useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useMotionValue, useAnimationFrame, useSpring, useMotionValueEvent, useReducedMotion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Link, useSearchParams, useLocation, useParams, useNavigate } from 'react-router';
import { useActiveSection } from './active-section-context';
import {
  ArrowUpRight, ArrowRight, Sun, Moon,
  Home, Mail, Image, Video, Briefcase,
  Instagram, Download, ChevronLeft, ChevronRight, ChevronDown,
  Monitor, Layers, Palette, Smartphone, Copy, Send,
  Menu, X, Clock, Phone, Linkedin, ExternalLink,
  Play, Pen, Globe, MessageCircle, Check,
  Volume2, VolumeX, Code2, Pause, LayoutGrid,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { FadeIn, StaggerChildren, StaggerItem, ScrollProgress, MagneticWrap, AnimatedDivider, SplitText, ScaleOnScroll, CursorGlow, FloatingParticles, TextScramble, MorphingBlob, RevealMask, AnimatedLine, LightBeamCard, BentoTiltCard, LiquidCursor, LiquidMeshBackground, SpringBadge, ParallaxFloat, ScrollRevealScale, MagneticLink, MicroPulse } from './animated-helpers';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HomeSEO, ServicesSEO, ContactSEO, UxUiSEO, SocialMediaAdsSEO, SocialMediaMotionSEO } from './seo';
import { scrollContentToTop } from './scroll-to-top';

/* ─── Screen imports for AURUM ─────��─────────────���─────────────────����─ */
const screenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774200199/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro_plhle1.webp';
const screenLanding = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040819/33bde90ba43fe3b089e907b814ef1018193651cd_hptwri.webp';
const screenProfile = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040904/259c40c789033b795135eecd13ffa040e408d1d8_g0b0ks.webp';
const screenTransfer = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenQR = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const screenVerify = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const portfolioScreenshot = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';
const spotlightImage = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339514/code_wp94ox.avif';

/* ─── Schenker Screen imports ─────────────────────────────────────── */
const schenkerSettings = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041604/d4d1e42280872aa3079a1b940b29790994d2b241_jcnrf6.webp';
const schenkerSendung = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774200130/1afd387db904f4cec4c15bfa6b7966e601ef294b_towksm_1_sritlp.webp';
const schenkerLabels = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774199882/1afd387db904f4cec4c15bfa6b7966e601ef294b_towksm_tlzijs.webp';

/* ─── Logo imports ──────────────────────────────────────────────────── */
const logoCubisten = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/bf9f7288d54df661173113607cc615479c446e18_sgs5u3.jpg';
const logoScope = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339517/f21f10a3e079a3afcc32f1c3bf161e7432e2daad_1_wilrmf.jpg';
const logoSpar = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/eb6337b24e75eee3f8c97c5faffbfb96a7395f90_fu7cjj.jpg';
const logoUnilab = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339517/f3fdff4d8158dacf0a12b0777c362f22f0cb78c7_vkww33.jpg';
import logoUpwork from '../../imports/upwork-1.svg';
const logoRunwayTeam = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339515/7cab6531835c509d1293dc3e519cb8808de775ac_ebqpyf.jpg';

/* ─── Social Media Ads brand images ────────────────────────────────── */
const adsTerminal1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1774041033/ae0f296f707bac87ea320800f47aa242e0616131_1_iwntjz.webp';
const adsTerminal2 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/646b2cbd1750a68745f4239b582693bed5cb6b0a_dinhde.jpg';
const adsTerminal3 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/89a476ac5a17773249772da85d98aba4eadfc858_ckiq2l.jpg';
const adsTerminal4 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/54ba414ef43d9471946833f7cc750e279f84db97_fzg0k8.jpg';
const adsTerminal5 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339516/95b0d375fa7224253428546078e356e49713209d_xwdji2.jpg';
const adsMardi1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339520/b62bbc10625805a2bfc4ed4ec0039576272b49ac_1_gwslya.png';
const adsMardi2 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1777838649/0743fa47e5f0c6879ca534305dd5c3d69484955e_wcgakf.webp';
const adsMardi3 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773407375/10-marti-2_1_mkkjtu.png';
const adsMardi4 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339519/52ad53951ffafafdc024cae95470cde6635376e2_brx0fw.png';
const adsMardi5 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1777838699/22f519bac2554d08e87ae2e50aa5fe6121e4492b_eudlkm.avif';
const adsCrystal1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838851/fdb3ca9219148ac4d7ef1c8b8d35fd17399b163f_f6d050.avif';
const adsCrystal2 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838852/7b6a04531412e6b682ff158e70815feb485fafd2_u7cbzp.webp';
const adsCrystal3 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838851/f58feecc7e898f1a82e525b20bc7d640c1c141a0_dcwoc0.webp';
const adsCrystal4 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838851/b458a6b717839cc398f8b2f50064ed40123f5e4d_eweuys.webp';
const adsGino1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838988/adea50f483fd41994a8d719b8fbfd5c2c8781aac_zwhfcu.webp';
const adsGino2 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838988/b71aabe04eb978d68a33b691016c4cb2c7c30f63_dzan8l.webp';
const adsGino3 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1777838987/1cb73cf5a5411498981da19ae8e2b885c2a98d01_dw6a0y.webp';
const adsGino4 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777838986/a5b2b7d1cca1e3e78b272724078e77d54dcedc56_whpwt4.webp';
const adsCarmall1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040983/47ecb13f7ae4f95236a54f6344dbb3e5c98a2f6b_1_onab1t.webp';
const adsCarmall2 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777839182/ac7ba222fd607dcea69dad174a308efdf426d3e5_uy6mzb.webp';
const adsCarmall3 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777839180/dee169945319d35bd9e8c1c23e7706f16d47a654_ogilbx.webp';
const adsCarmall4 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777839182/bfde800820519296d3523c1c4ab2d8c948005d20_l9q8nx.webp';

/* ─── Font config ──────────────────────────────────────────────────── */
const F = {
  heading: '"Syne", "Space Grotesk", sans-serif',
  body: '"Manrope", "Inter", sans-serif',
  accent: '#ed592b',
  gold: '#D59A04',
  yellow: '#FFC701',
  green: '#22c55e',
};

/* ─── Behance SVG icon ─────────────────────────────────────────��─��─── */
const BehanceIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*                           NAV CONFIG                              */
/* ═══════════════════════════════════════════════════════════════════ */
const navItems = [
  { id: 'home', label: 'Home', icon: <Home size={15} /> },
  { id: 'services', label: 'Services', icon: <Briefcase size={15} /> },
  { id: 'contact', label: 'Contact', icon: <Mail size={15} /> },
];

const navHref = (id: string): string => {
  if (id === 'contact') return '/contact';
  if (id === 'services') return '/services';
  return '/';
};

const catHref = (id: string): string => {
  if (id === 'ux-ui') return '/work/ux-ui';
  if (id === 'social-media-ads') return '/work/social-media-ads';
  if (id === 'social-media-motion') return '/work/social-media-motion';
  return '/';
};

const projectCategories = [
  { id: 'ux-ui', label: 'UX/UI Design', icon: <Layers size={15} /> },
  { id: 'social-media-ads', label: 'Social Media Ads', icon: <Image size={15} /> },
  { id: 'social-media-motion', label: 'Social Media Motion', icon: <Video size={15} /> },
];

/* ═════════════════════��═════════════════════���═══════════════════════ */
/*                     LIVE CLOCK COMPONENT                          */
/* ═���══════════════════════════════════════�����══════════════════════════ */
const LiveClock = ({ isDark }: { isDark: boolean }) => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Tbilisi' }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] ${isDark ? 'border-white/[0.06] text-white/50' : 'border-zinc-200 text-zinc-400'}`} style={{ fontFamily: F.body }}>
      <Clock size={13} className="opacity-50" />
      {time}
    </div>
  );
};

/* ═══════════════��══════════════════�����═�����════════════════════��═════════ */
/*                          SIDEBAR                                  */
/* ═══════════════���════════════��══════════════════════════════════════ */
const Sidebar = ({
  activeSection, onSectionChange, isMobileOpen, onMobileClose,
}: {
  activeSection: string; onSectionChange: (id: string) => void; isMobileOpen: boolean; onMobileClose: () => void;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ fontFamily: F.body }}>
      <div className="px-4 pt-5 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1777841338/fav_ggorfv.png"
            alt="Salome Mosiava"
            width="64" height="64"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/[0.08]"
          />
          <div className="min-w-0">
            <h2 className={`text-[13px] truncate ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: F.heading, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Salome Mosiava
            </h2>
            <p className="text-[10px] text-[#ed592b] uppercase tracking-[0.12em]" style={{ fontFamily: F.body }}>Art Director & Senior Product Designer</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 space-y-0.5">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <MagneticWrap key={item.id} strength={0.15}>
              <Link to={navHref(item.id)} onClick={() => { onSectionChange(item.id); onMobileClose(); }} className="block">
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 lg:py-[7px] rounded-[10px] text-[13px] whitespace-nowrap transition-all overflow-hidden min-h-[44px] lg:min-h-0 focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                    active
                      ? isDark ? 'bg-white/[0.06] text-white' : 'bg-zinc-200/70 text-zinc-900'
                      : isDark ? 'text-[#7a7d8a] hover:text-white/80 hover:bg-white/[0.03]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebarActiveNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-[#ed592b]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className={active ? 'text-[#ed592b]' : 'opacity-50'}>{item.icon}</span>
                  {item.label}
                </motion.div>
              </Link>
            </MagneticWrap>
          );
        })}

        <div className={`h-px mx-2 my-2 ${isDark ? 'bg-white/[0.05]' : 'bg-zinc-200'}`} />

        {projectCategories.map((cat) => {
          const active = activeSection === cat.id;
          return (
            <MagneticWrap key={cat.id} strength={0.15}>
              <Link to={catHref(cat.id)} onClick={() => { onSectionChange(cat.id); onMobileClose(); }} className="block">
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 lg:py-[7px] rounded-[10px] text-[13px] whitespace-nowrap transition-all overflow-hidden min-h-[44px] lg:min-h-0 focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                    active
                      ? isDark ? 'bg-white/[0.06] text-white' : 'bg-zinc-200/70 text-zinc-900'
                      : isDark ? 'text-[#7a7d8a] hover:text-white/80 hover:bg-white/[0.03]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebarActiveCat"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-[#ed592b]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className={active ? 'text-[#ed592b]' : 'opacity-50'}>{cat.icon}</span>
                  {cat.label}
                </motion.div>
              </Link>
            </MagneticWrap>
          );
        })}
      </nav>

      <div className="p-2.5 space-y-[3px] mt-auto">
        {/* Status box */}
        <div className={`px-3 py-2.5 rounded-[10px] border ${border} ${isDark ? 'bg-white/[0.015]' : 'bg-zinc-50'}`}>
          <div className="flex items-center justify-between">
            <div className={`text-[11px] ${isDark ? 'text-white/50' : 'text-zinc-500'}`} style={{ fontFamily: F.body }}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-[5px] w-[5px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
                <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-[#22c55e]" />
              </span>
            </div>
          </div>

        </div>

        {[
          { icon: <Instagram size={12} />, label: 'Instagram', accent: false, href: 'https://www.instagram.com/areuli.design/' },
          { icon: <BehanceIcon size={12} />, label: 'Behance', accent: false, href: 'https://www.behance.net/samole' },
        ].map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.href !== '#' ? '_blank' : undefined}
            rel={item.href !== '#' ? 'noopener noreferrer' : undefined}
            whileHover={{ scale: 1.01, x: 1 }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 lg:py-[7px] rounded-[10px] text-[11px] whitespace-nowrap border transition-all min-h-[44px] lg:min-h-0 focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
              item.accent
                ? 'border-[#ed592b]/20 text-[#ed592b]/70 hover:text-[#ed592b] hover:bg-[#ed592b]/[0.05] hover:border-[#ed592b]/30'
                : isDark ? `${border} text-[#7a7d8a] hover:text-white/80 hover:bg-white/[0.03]` : `${border} text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50`
            }`}
            style={{ fontFamily: F.body }}
          >
            {item.icon}
            {item.label}
          </motion.a>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] z-40 border-r ${isDark ? 'bg-[#0b0b0e] border-white/[0.05]' : 'bg-white border-zinc-200'}`}>
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={onMobileClose} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className={`fixed left-0 top-0 bottom-16 w-[240px] z-50 lg:hidden border-r rounded-br-2xl ${isDark ? 'bg-[#0b0b0e] border-white/[0.05]' : 'bg-white border-zinc-200'}`}>
              <button onClick={onMobileClose} className="absolute top-3 right-3 p-2.5 rounded-xl text-[#7a7d8a] hover:text-white hover:bg-white/[0.06] min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)]"><X size={20} /></button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ════════���══════════════════════════════════════════════════════════ */
/*                    DISCOVERY TILE COMPONENT                       */
/* ════════════════════════════════════��═════════════════════════════�� */
const DiscoveryTile = ({
  image,
  label,
  category,
  categoryColor,
  isDark,
  border,
  videoSrc,
  link,
  alt,
}: {
  image: string;
  label: string;
  category: string;
  categoryColor: string;
  isDark: boolean;
  border: string;
  videoSrc?: string;
  link?: string;
  alt?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy load: only mount <video> when tile enters viewport
  useEffect(() => {
    if (!videoSrc || !tileRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVideoLoaded(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [videoSrc]);

  useEffect(() => {
    if (videoSrc && videoRef.current && videoLoaded) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, videoSrc, videoLoaded]);

  const tile = (
    <BentoTiltCard
      tiltStrength={10}
      glareOpacity={0.08}
      className={`rounded-xl border overflow-hidden cursor-pointer ${border} ${isDark ? 'bg-[#0e0f13]' : 'bg-white'}`}
    >
      <div
        ref={tileRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={alt || label}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered && videoSrc ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'}`}
          />
          {videoSrc && videoLoaded && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="none"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          <div className={`absolute inset-0 transition-all duration-300 ${isHovered ? 'bg-black/20' : 'bg-black/0'}`} />
          <div className="absolute top-2 left-2 z-10">
            <SpringBadge delay={0.1}>
              <span
                className="text-[7px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full backdrop-blur-xl border"
                style={{
                  backgroundColor: `${categoryColor}15`,
                  color: `${categoryColor}cc`,
                  borderColor: `${categoryColor}20`,
                }}
              >
                {category}
              </span>
            </SpringBadge>
          </div>
          {videoSrc && (
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Play size={12} className="text-white ml-0.5 fill-white" />
              </div>
            </div>
          )}
          <div className={`absolute bottom-1.5 right-1.5 z-10 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="w-5 h-5 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10">
              <ArrowUpRight size={9} className="text-white" />
            </div>
          </div>
        </div>
        <div className="px-2 py-1.5">
          <span className={`text-[9px] ${isDark ? 'text-white/60' : 'text-zinc-500'}`} style={{ fontFamily: F.heading, fontWeight: 500 }}>
            {label}
          </span>
        </div>
      </div>
    </BentoTiltCard>
  );

  return link ? <Link to={link}>{tile}</Link> : tile;
};

/* ─── Spotlight types ─────────────────────────────────────────────── */
type SpotlightData = { img: string; tag: string; tagColor: string; title: string; desc: string };

/* ─── Spotlight Card Inner ────────────────────────────────────────── */
const SpotlightCardInner = ({
  sp, index, total, isDark, border,
}: { sp: SpotlightData; index: number; total: number; isDark: boolean; border: string }) => (
  <div className={`relative w-full h-full rounded-2xl overflow-hidden border ${border} shadow-2xl shadow-black/60 cursor-pointer`}>
    <div className="absolute inset-0">
      <ImageWithFallback src={sp.img} alt={`${sp.title} — ${sp.tag}`} className="w-full h-full object-cover" style={{ filter: 'blur(1.5px)', transform: 'scale(1.04)' }} />
    </div>
    {/* Dark overlay — tones down brightness */}
    <div className="absolute inset-0 bg-black/65" />
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.12]"
      style={{
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute top-4 right-4 z-10">
      <span className="text-[10px] font-mono text-white/25 tabular-nums">
        {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
    <motion.div
      className="absolute top-4 left-4 z-10"
      initial={{ scale: 0.7, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.25 }}
    >
      <span
        className="text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border"
        style={{ backgroundColor: `${sp.tagColor}20`, color: sp.tagColor, borderColor: `${sp.tagColor}30` }}
      >
        {sp.tag}
      </span>
    </motion.div>
    <div className="absolute bottom-5 left-5 right-5 z-10">
      <h3 className="text-xl md:text-2xl text-white tracking-[-0.02em] mb-1.5" style={{ fontFamily: F.heading, fontWeight: 700 }}>
        {sp.title}
      </h3>
      <p className="text-white/50 text-[12px] leading-relaxed max-w-md" style={{ fontFamily: F.body }}>
        {sp.desc}
      </p>
    </div>
  </div>
);


/* ─── Spotlight Deck Section ─────────────────────────────────────── */
const SpotlightDeckSection = ({ isDark, border }: { isDark: boolean; border: string }) => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile] = useState(false);

  const spotlights: SpotlightData[] = [
    {
      img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320797/0101_yqkpg2.webp',
      tag: 'Business', tagColor: '#ed592b',
      title: 'Driving Real Impact',
      desc: 'At Scope, we started from zero and, in less than two years, grew the team, collaborated with 50+ businesses, and delivered measurable results.',
    },
    {
      img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320796/0202_niubv1.webp',
      tag: 'Education', tagColor: '#22c55e',
      title: 'Completed Certification',
      desc: 'After Effects certification, expanding skills in motion design and advertising.',
    },
    {
      img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320797/0303_fz2hzg.webp',
      tag: 'Mentoring', tagColor: '#a855f7',
      title: 'Mentoring',
      desc: 'Teens, women, and others in design, turning theory into real practice through professional acceleration programs.',
    },
  ];

  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';

  return (
    <div ref={sectionRef}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
        <p className={`text-[11px] uppercase tracking-[0.15em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>Spotlights of 2025</p>
        <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-200'}`} />
      </div>
      <div className="space-y-4">
        {spotlights.map((sp, i) => (
          <div key={sp.tag} className="h-[260px]">
            <SpotlightCardInner sp={sp} index={i} total={spotlights.length} isDark={isDark} border={border} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════���══════════════════════���════════════════════ */
/*                        HOME CONTENT                               */
/* ═══════════════════════════════════════════════════════════════════ */
const HomeContent = ({ isDark, onSectionNavigate }: { isDark: boolean; onSectionNavigate?: (section: string) => void }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const bt = isDark ? 'text-[#a0a3af]' : 'text-zinc-500';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  const experiences = [
    { company: 'RunwayTeam', type: 'Contract', role: 'Visual Designer', start: 'JAN 2026', end: 'NOW', color: '#00d26a', logoImg: logoRunwayTeam },
    { company: 'Scope · სქოუფი', type: 'Full-time', role: 'Art Director', start: 'MAY 2024', end: 'DEC 2025', color: '#ed592b', logoImg: logoScope },
    { company: 'UniLab · უნილაბი', type: 'Part-time', role: 'Head of UI/UX & Graphic Design', start: '2024', end: 'NOW', color: '#22c55e', logoImg: logoUnilab },
    { company: 'Upwork', type: '', role: 'Freelance Graphic Designer', start: '2021', end: '2024', color: '#14a800', logoImg: logoUpwork },
    { company: 'Cubisten', type: 'Full-time', role: 'Graphic Designer → Creative Director', start: 'JAN 2019', end: 'DEC 2024', color: '#6366f1', logoImg: logoCubisten },
    { company: 'Spar', type: 'Contract', role: 'Graphic Designer', start: '2020', end: '2022', color: '#a855f7', logoImg: logoSpar },
  ];

  return (
    <div>
      {/* Top bar — Available badge only (name/photo live in the sidebar) */}
      <FadeIn>
        <div className="flex items-center justify-end mb-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[12px] ${border} ${isDark ? 'text-[#7a7d8a]' : 'text-zinc-400'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
            </span>
            Available for new projects
          </motion.div>
        </div>
      </FadeIn>

      {/* Hero tagline */}
      <FadeIn delay={0.05}>
        <div className="mb-6">
          <p className="uppercase tracking-[0.15em] mb-3" style={{ fontFamily: F.body, fontWeight: 500, fontSize: '10px' }}>
            <span className={isDark ? 'text-white/70' : 'text-zinc-600'}>
              <TextScramble text="80+ projects." delay={0.3} duration={1} style={{ fontFamily: F.body, fontWeight: 500, fontSize: '10px' }} />
            </span>
            {' '}
            <span className="bg-gradient-to-r from-[#ed592b] via-[#f47a4d] to-[#ed592b] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">
              <TextScramble text="Countless sparks." delay={0.8} duration={1} style={{ fontFamily: F.body, fontWeight: 500, fontSize: '10px' }} />
            </span>
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className={`max-w-2xl mb-8 space-y-4 text-[14px] leading-[1.8] ${bt}`} style={{ fontFamily: F.body, fontWeight: 400 }}>
          <p>
            I'm <span className={`${isDark ? 'text-white/90' : 'text-zinc-800'}`} style={{ fontWeight: 500 }}>Salome</span>, senior designer & art director.
            I work across design, direction, and digital culture, turning the small signals and habits we often miss into ideas that create real business impact.
          </p>
          <p>
            If you want to spark ideas that transform into business value,
            <span className={isDark ? 'text-white/80' : 'text-zinc-700'} style={{ fontWeight: 500 }}> let's do it together.</span>
          </p>
        </div>
      </FadeIn>

      {/* CTA buttons */}
      <FadeIn delay={0.15}>
        <div className="flex items-center gap-3 mb-14">
          <MagneticWrap strength={0.25}>
            <Link to="/contact">
              <motion.div
                whileHover={{ scale: 1.06, boxShadow: '0 6px 30px rgba(237,89,43,0.3)' }}
                whileTap={{ scale: 0.93, y: 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c94a20] text-white text-[13px] whitespace-nowrap shadow-[0_2px_16px_rgba(237,89,43,0.2)] overflow-hidden group"
                style={{ fontFamily: F.body, fontWeight: 500 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                <Mail size={13} className="relative z-10" />
                <span className="relative z-10">Contact me</span>
              </motion.div>
            </Link>
          </MagneticWrap>
          <LiveClock isDark={isDark} />
        </div>
      </FadeIn>

      {/* Selected clients — scrolling logo strip */}
      <div className="mb-10">
        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-r from-[#0b0b0e] to-transparent' : 'bg-gradient-to-r from-[#f5f5f5] to-transparent'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none ${isDark ? 'bg-gradient-to-l from-[#0b0b0e] to-transparent' : 'bg-gradient-to-l from-[#f5f5f5] to-transparent'}`} />
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="flex items-center gap-7 w-max py-1"
            >
              {(() => {
                const clients = [
                  { name: 'Terminal', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/terminal_hcftru.webp' },
                  { name: 'Mardi Holding', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/mardi_dzhmgm.webp' },
                  { name: 'Crystal Leasing', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916798/%E1%83%99%E1%83%A0%E1%83%98%E1%83%A1%E1%83%A2%E1%83%90%E1%83%9A_%E1%83%9A%E1%83%98%E1%83%96%E1%83%98%E1%83%9C%E1%83%92%E1%83%98_xeyoop.webp' },
                  { name: 'Gino Aquapark', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/%E1%83%AF%E1%83%98%E1%83%9C%E1%83%9D_%E1%83%90%E1%83%99%E1%83%95%E1%83%90%E1%83%9E%E1%83%90%E1%83%A0%E1%83%99%E1%83%98_r3am9r.webp' },
                  { name: 'Carmall', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp' },
                  { name: 'Scope', logo: logoScope },
                  { name: 'Regus', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917415/regus_nv1pte.webp' },
                  { name: 'GTCC', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/gtcc_sk1wrg.webp' },
                  { name: 'FitMeal', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917409/fitmeal_bowpri.webp' },
                  { name: 'The Khachapuri', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/the_khachapuri_fv6s7a.webp' },
                  { name: 'UniLab', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/%E1%83%A3%E1%83%9C%E1%83%98%E1%83%9A%E1%83%90%E1%83%91%E1%83%98_zbfjyi.png' },
                  { name: 'Cubisten', logo: logoCubisten },
                  { name: 'GCCI', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/georgian_chamber...._ffm4rm.png' },
                  { name: 'Modusi', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/%E1%83%9B%E1%83%9D%E1%83%93%E1%83%A3%E1%83%A1%E1%83%98_zcltlg.png' },
                  { name: 'Gagua Clinic', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334358/gagua_qwqdja.jpg' },
                  { name: 'NB Dental', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778347254/nb_dental_qiiahr.jpg' },
                  { name: 'Thermocentre', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334709/%E1%83%97%E1%83%94%E1%83%A0%E1%83%9B%E1%83%9D%E1%83%AA%E1%83%94%E1%83%9C%E1%83%A2%E1%83%A0%E1%83%98_vmkkoc.png' },
                ];
                return [...clients, ...clients];
              })().map((client, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-5 h-5 rounded overflow-hidden flex-shrink-0 ${isDark ? 'opacity-35' : 'opacity-50'}`}>
                    <img src={client.logo} alt={client.name} width="20" height="20" className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-white/20' : 'text-zinc-300'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>{client.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </FadeIn>
      </div>

      {/* ═══ FEATURED WORK — Compact Bento Grid ═══ */}
      <FadeIn delay={0.2}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ed592b]" />
          <p className={`text-[11px] uppercase tracking-[0.15em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
            Featured Work
          </p>
          <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-200'}`} />
        </div>
      </FadeIn>

      {/* TRUE BENTO GRID — 3-col asymmetric, dense row spans */}
      <FadeIn delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5" style={{ gridTemplateRows: 'auto auto auto' }}>

          {/* AURUM — spans 2 cols × 2 rows: the hero cell */}
          <Link to="/projects/aurum" className="sm:col-span-2 sm:row-span-2">
            <motion.div whileHover={{ y: -3, scale: 1.004 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} className="h-full">
              <BentoTiltCard tiltStrength={5} glareOpacity={0.06} className={`rounded-2xl border overflow-hidden h-full ${border} ${isDark ? 'bg-[#0a0b0f]' : 'bg-white'}`}>
                <div className="relative h-full min-h-[220px] sm:min-h-[320px] overflow-hidden bg-gradient-to-br from-[#080B0F] via-[#0d0e14] to-[#0a0c12] img-hover-zoom">
                  <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(213,154,4,0.08) 0%, transparent 60%)' }} />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                  <motion.img src={screenLanding} alt="AURUM crypto platform landing page design" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 0.2, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-[8%] left-[3%] w-[42%] rounded-xl shadow-2xl shadow-black/60" />
                  <motion.img src={screenProfile} alt="AURUM user profile dashboard" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 0.3, y: 0 }} transition={{ duration: 1, delay: 0.35 }} className="absolute top-[4%] right-[3%] w-[38%] rounded-xl shadow-2xl shadow-black/60" />
                  <motion.img src={screenExchange} alt="AURUM Crypto Exchange UI/UX Design by Salome Mosiava" initial={{ opacity: 0, y: 50, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] rounded-t-xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)]" />
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#D59A04]/10 backdrop-blur-xl text-[#D59A04]/80 border border-[#D59A04]/15">UX/UI</span>
                    <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/[0.03] backdrop-blur-xl text-white/30 border border-white/[0.06]">196 Screens</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                    <h3 className="text-lg text-white mb-0.5 tracking-[-0.03em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>AURUM</h3>
                    <p className="text-white/30 text-[10px] tracking-wide mb-2.5" style={{ fontFamily: F.body }}>Crypto Exchange Platform</p>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D59A04]/15 border border-[#D59A04]/20 text-[10px] text-[#D59A04]/80 transition-all" style={{ fontFamily: F.body, fontWeight: 500 }}>
                      View Case Study <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </BentoTiltCard>
            </motion.div>
          </Link>

          {/* Terminal — col 3, row 1 */}
          <div className="sm:col-start-3 sm:row-start-1">
            <DiscoveryTile image={adsTerminal1} label="Terminal" category="Social Media Ads" categoryColor="#ed592b" isDark={isDark} border={border} link="/work/social-media-ads" alt="Terminal Social Media Ads Design by Salome Mosiava" />
          </div>

          {/* Carmall — col 3, row 2 */}
          <div className="sm:col-start-3 sm:row-start-2">
            <DiscoveryTile
              image={adsCarmall1}
              label="Carmall"
              category="Motion Design"
              categoryColor="#a855f7"
              isDark={isDark}
              border={border}
              videoSrc="https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/carmall-ne_1_u5ewuz.mp4"
              link="/work/social-media-motion"
              alt="Salome Mosiava Portfolio Art Direction Georgia"
            />
          </div>

          {/* SCHENKER — full-width bottom row, 3 cols */}
          <div className="sm:col-span-3">
            <Link to="/projects/schenker">
              <motion.div whileHover={{ y: -3, scale: 1.004 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                <BentoTiltCard tiltStrength={4} glareOpacity={0.05} className={`rounded-2xl border overflow-hidden ${border} ${isDark ? 'bg-[#0a0b0f]' : 'bg-white'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr]">
                    <div className="p-4 sm:p-5 flex flex-col justify-center order-2 sm:order-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#6B8E23]/10 text-[#8FBC3B]/80 border border-[#6B8E23]/15">Enterprise · UX/UI</span>
                        <span className="text-[7px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-white/[0.03] text-white/60 border border-white/[0.1]">Desktop</span>
                      </div>
                      <h3 className="text-base md:text-lg text-white mb-0.5 tracking-[-0.03em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>SCHENKER</h3>
                      <p className={`text-[10px] ${bt} mb-2.5 leading-relaxed`} style={{ fontFamily: F.body }}>
                        Enterprise logistics — form systems, label management & shipment tracking.
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {['UX/UI', 'Enterprise', 'Form Systems'].map((t) => (
                          <span key={t} className={`text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md whitespace-nowrap ${isDark ? 'bg-white/[0.06] text-white/50' : 'bg-zinc-100 text-zinc-400'}`} style={{ fontFamily: F.body }}>{t}</span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6B8E23]/12 border border-[#6B8E23]/20 text-[10px] text-[#8FBC3B]/70 transition-all w-full sm:w-auto justify-center sm:justify-start" style={{ fontFamily: F.body, fontWeight: 500 }}>
                        View Case Study <ArrowRight size={10} />
                      </span>
                    </div>
                    <div className="relative h-[140px] sm:h-auto min-h-[160px] overflow-hidden bg-gradient-to-br from-[#e8ecd8] via-[#dfe4cc] to-[#d4dab8] order-1 sm:order-2 rounded-t-2xl sm:rounded-t-none sm:rounded-r-2xl img-hover-zoom">
                      <img src={schenkerLabels} alt="Schenker label management" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-[10%] left-[4%] w-[44%] rounded-lg shadow-xl shadow-black/30 opacity-25" />
                      <img src={schenkerSettings} alt="Schenker settings dashboard" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-[6%] right-[4%] w-[40%] rounded-lg shadow-xl shadow-black/30 opacity-30" />
                      <img src={schenkerSendung} alt="Schenker shipment tracking" loading="lazy" decoding="async" width="1440" height="900" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[68%] rounded-t-lg shadow-xl shadow-black/40" />
                    </div>
                  </div>
                </BentoTiltCard>
              </motion.div>
            </Link>
          </div>

        </div>
      </FadeIn>

      {/* Explore more — inline CTA */}
      <FadeIn delay={0.3}>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { label: 'All Ads', section: 'social-media-ads', icon: <Image size={10} /> },
            { label: 'All Motion', section: 'social-media-motion', icon: <Video size={10} /> },
            { label: 'All UX/UI', section: 'ux-ui', icon: <Layers size={10} /> },
          ].map((cta) => (
            <motion.button
              key={cta.section}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSectionNavigate?.(cta.section)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] border transition-all focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isDark ? 'border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.1]' : 'border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
              style={{ fontFamily: F.body, fontWeight: 500 }}
            >
              {cta.icon}
              {cta.label}
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* Who I am — experience table */}
      <div className="mb-20">
        <FadeIn delay={0.05}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <p className={`text-[11px] uppercase tracking-[0.15em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>Who I am</p>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-200'}`} />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className={`max-w-2xl mb-10 text-[14px] leading-[1.7] ${bt}`} style={{ fontFamily: F.body }}>
            <p>
              I work across design, direction, and digital culture, turning the small signals and habits we often miss into ideas that create real business impact.
            </p>
            <p className="mt-3">
              At <a href="https://www.facebook.com/Scopegeorgia" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>Scope</a>, we started from zero, and in less than two years, I've helped grow the team, led design team leads, worked with 50+ businesses, managed $70,000+ in monthly ad spend, and delivered real results. Before that, at <a href="https://www.facebook.com/cubisten" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>Cubisten</a>, I built design systems and lifted brand aesthetics across B2B and B2C projects.
            </p>
            <p className="mt-3">
              I mentor designers at <a href="https://unilab.iliauni.edu.ge/" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>UniLab</a> and <a href="https://tbcbank.ge/ka/tbc-education/tech-school" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>TBC Tech School</a>, including in the <a href="https://btu.edu.ge/en/women-mentorship-in-tech-programmes/" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>Women in Tech</a> program, helping people put theory into practice and guiding the next generation of creatives.
            </p>
            <p className="mt-3">
              As a <span className={isDark ? 'text-white/90' : 'text-zinc-800'} style={{ fontWeight: 500 }}>Top-Rated Plus</span> freelancer on <a href="https://www.upwork.com/freelancers/~0163986e2d8967d783" target="_blank" rel="noopener noreferrer" className={`${isDark ? 'text-white/90 hover:text-[#ed592b]' : 'text-zinc-800 hover:text-[#ed592b]'} transition-colors underline decoration-[#ed592b]/20 hover:decoration-[#ed592b]/60 underline-offset-2`} style={{ fontWeight: 500 }}>Upwork</a>, I'm in the top 3% of performers, delivering high-quality work across a variety of clients.
            </p>
          </div>
        </FadeIn>

        {/* Experience timeline */}
        <div className="relative">
          <AnimatedLine className="absolute left-[14px] sm:left-[14px] top-2 bottom-2 z-0" color="#ed592b" />
        <StaggerChildren className="space-y-0 relative z-10" stagger={0.06}>
          {experiences.map((exp, i) => (
            <StaggerItem key={exp.company + exp.start}>
              <MagneticWrap strength={0.12}>
              <LightBeamCard className={`rounded-xl ${i < experiences.length - 1 ? `border-b ${isDark ? 'border-white/[0.04]' : 'border-zinc-100'}` : ''}`}>
              <motion.div
                whileHover={{ x: 6, backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-3.5 px-3 rounded-xl transition-colors gap-1.5 sm:gap-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="w-7 h-7 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: `${exp.color}15` }}
                  >
                    {exp.logoImg ? (
                      <img src={exp.logoImg} alt={`${exp.company} logo`} loading="lazy" width="28" height="28" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-mono text-white/60" style={{ fontWeight: 600 }}>{exp.company.slice(0, 2).toUpperCase()}</span>
                    )}
                  </motion.div>
                  <div className="min-w-0">
                    <span className={`text-[13px] ${isDark ? 'text-white/90' : 'text-zinc-800'} flex items-center gap-2 truncate`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                      {exp.company}
                      {exp.type && (
                        <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-[2px] rounded-[4px] flex-shrink-0 ${isDark ? 'bg-white/[0.05] text-white/35' : 'bg-zinc-100 text-zinc-400'}`}>{exp.type}</span>
                      )}
                    </span>
                    <span className={`text-[11px] ${bt} block sm:hidden truncate`} style={{ fontFamily: F.body }}>
                      {exp.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 pl-9 sm:pl-0">
                  <span className={`text-[12px] ${bt} hidden sm:block max-w-[240px] truncate`} style={{ fontFamily: F.body }}>
                    {exp.role}
                  </span>
                  <div className={`flex items-center gap-2 text-[10px] sm:text-[11px] font-mono ${mt}`}>
                    <span>{exp.start}</span>
                    <motion.span className="opacity-40" whileHover={{ scale: 1.3 }}>→</motion.span>
                    {exp.end === 'NOW' ? (
                      <MicroPulse intensity={0.8}>
                        <span className="text-[#22c55e] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                          NOW
                        </span>
                      </MicroPulse>
                    ) : (
                      <span>{exp.end}</span>
                    )}
                  </div>
                </div>
              </motion.div>
              </LightBeamCard>
              </MagneticWrap>
            </StaggerItem>
          ))}
        </StaggerChildren>
        </div>
      </div>

      {/* Spotlights — Cinematic Deck */}
      <div className="mb-16">
        <SpotlightDeckSection isDark={isDark} border={border} />
      </div>

    </div>
  );
};

/* ══════════════��═════════���═════════════════════════════���════════════ */
/*                      SERVICES CONTENT                             */
/* ═══════════════════════════════════════════════════════════════════ */

const ServicesContent = ({ isDark }: { isDark: boolean }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const services = [
    {
      icon: <Monitor size={16} />,
      title: 'UX/UI Product Design',
      tagline: 'End-to-end product design from research to pixel-perfect delivery.',
      timeline: '4–12 weeks',
      deliverables: ['User research & interviews', 'Information architecture', 'User flows & wireframes', 'High-fidelity UI design', 'Design system & components', 'Interactive prototypes', 'Developer handoff (Figma)'],
      outcome: 'AURUM — 196 screens, 64+ components shipped',
    },
    {
      icon: <Palette size={16} />,
      title: 'Art Direction',
      tagline: 'Visual strategy and creative direction for brands and campaigns.',
      timeline: '2–6 weeks',
      deliverables: ['Brand visual identity', 'Campaign concept & moodboard', 'Creative direction', 'Visual guidelines', 'Key visual production', 'Art supervision'],
      outcome: 'Scope, Terminal, Carmall — multi-campaign direction',
    },
    {
      icon: <Image size={16} />,
      title: 'Social Media Design',
      tagline: 'High-impact visuals and campaign assets for social platforms.',
      timeline: 'Ongoing or 1–4 weeks',
      deliverables: ['Static post designs', 'Carousel & story templates', 'Ad creatives (Meta, TikTok)', 'Brand-consistent visual system', 'Copy direction & layouts', 'Monthly content packages'],
      outcome: '10+ brands — Terminal, Mardi, Crystal Leasing, GTCC',
    },
    {
      icon: <Video size={16} />,
      title: 'Motion Design',
      tagline: 'Animated content that brings brands to life across every platform.',
      timeline: '1–3 weeks',
      deliverables: ['Logo reveals & brand animations', 'Social media reels & stories', 'Animated ad creatives', 'UI micro-interactions', 'Motion style guide'],
      outcome: 'Carmall, Scope, Saloni — reels & brand animations',
    },
  ];

  const process = [
    { step: '01', title: 'Discovery', desc: 'Align on goals, constraints, and success metrics.' },
    { step: '02', title: 'Design', desc: 'Iterative rounds with regular feedback check-ins.' },
    { step: '03', title: 'Handoff', desc: 'Clean specs, assets, and documentation for devs.' },
    { step: '04', title: 'Support', desc: 'Post-launch refinements and system maintenance.' },
  ];

  return (
    <div>
      {/* Heading */}
      <FadeIn>
        <div className="mb-8">
          <p className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-4 flex items-center gap-2`} style={{ fontFamily: F.body, fontWeight: 500 }}>
            <span className="inline-block w-6 h-px bg-[#ed592b]" />
            What I do
          </p>
          <h1 className={`text-[22px] sm:text-[28px] tracking-[-0.03em] leading-[1.15] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
            Design <span className="text-[#ed592b]">Services</span><span className={isDark ? 'text-white/15' : 'text-zinc-200'}>.</span>
          </h1>
        </div>
      </FadeIn>

      {/* Service cards */}
      <div className="space-y-2 mb-7">
        {services.map((s, i) => {
          const isOpen = openIndex === i;
          return (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={`rounded-2xl overflow-hidden cursor-pointer border transition-colors duration-300 ${
                  isOpen
                    ? isDark ? 'border-[#ed592b]/15 bg-[#0d0e13]' : 'border-[#ed592b]/15 bg-white'
                    : isDark ? 'border-white/[0.05] bg-[#0c0d11] hover:border-white/[0.08]' : `${border} bg-white hover:border-zinc-300`
                }`}
              >
                <div className={`h-[2px] transition-all duration-500 ${isOpen ? 'bg-gradient-to-r from-[#ed592b] to-transparent' : 'bg-transparent'}`} />

                <div className="px-5 py-4 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${isOpen ? 'bg-[#ed592b]/12 text-[#ed592b]' : isDark ? 'bg-white/[0.04] text-white/30' : 'bg-zinc-100 text-zinc-400'}`}>{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-[14px] tracking-[-0.02em] transition-colors duration-300 ${isOpen ? (isDark ? 'text-white' : 'text-zinc-900') : isDark ? 'text-white/60' : 'text-zinc-500'}`} style={{ fontFamily: F.heading, fontWeight: 600 }}>{s.title}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-white/[0.05] text-white/25' : 'bg-zinc-100 text-zinc-400'}`} style={{ fontFamily: F.body }}>{s.timeline}</span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/25' : 'text-zinc-400'}`} style={{ fontFamily: F.body }}>{s.tagline}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#ed592b]/12 text-[#ed592b] rotate-180' : isDark ? 'bg-white/[0.03] text-white/15' : 'bg-zinc-100 text-zinc-300'}`}>
                    <ChevronDown size={12} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.25, delay: 0.1 } }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className={`h-px mb-4 ${isDark ? 'bg-white/[0.05]' : 'bg-zinc-100'}`} />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                          {s.deliverables.map((d) => (
                            <div key={d} className="flex items-start gap-2">
                              <Check size={11} className="text-[#ed592b]/60 flex-shrink-0 mt-[2px]" />
                              <span className={`text-[11px] leading-[1.4] ${isDark ? 'text-white/40' : 'text-zinc-500'}`} style={{ fontFamily: F.body }}>{d}</span>
                            </div>
                          ))}
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-[#ed592b]/[0.06]' : 'bg-[#ed592b]/[0.04]'}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ed592b]/50 flex-shrink-0" />
                          <span className={`text-[10px] ${isDark ? 'text-white/35' : 'text-zinc-400'}`} style={{ fontFamily: F.body }}>{s.outcome}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* How we'll work together */}
      <FadeIn delay={0.3}>
        <div className={`rounded-2xl border p-5 mb-4 ${isDark ? 'border-white/[0.05] bg-[#0c0d11]' : `${border} bg-white`}`}>
          <p className={`text-[10px] uppercase tracking-[0.15em] ${mt} mb-4`} style={{ fontFamily: F.body, fontWeight: 500 }}>How we'll work together</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                {i < process.length - 1 && (
                  <div className={`hidden sm:block absolute top-[7px] left-[55%] right-[-45%] h-px ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-100'}`} />
                )}
                <div className={`text-[10px] mb-1.5 font-mono ${isDark ? 'text-[#ed592b]/50' : 'text-[#ed592b]/60'}`}>{p.step}</div>
                <div className={`text-[12px] mb-1 ${isDark ? 'text-white/70' : 'text-zinc-700'}`} style={{ fontFamily: F.heading, fontWeight: 600 }}>{p.title}</div>
                <p className={`text-[10px] leading-[1.5] ${mt}`} style={{ fontFamily: F.body }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.35}>
        <div className={`flex items-center justify-between px-4 py-3.5 rounded-xl border mb-4 ${isDark ? 'border-white/[0.04] bg-white/[0.015]' : 'border-zinc-100 bg-zinc-50'}`}>
          {[
            { num: '80+', label: 'Projects' },
            { num: '50+', label: 'Clients' },
            { num: '6+', label: 'Years' },
            { num: 'Top 3%', label: 'Upwork' },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex-1">
              <div className={`text-[13px] sm:text-[15px] tracking-[-0.02em] ${isDark ? 'text-white/80' : 'text-zinc-800'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>{stat.num}</div>
              <div className={`text-[8px] uppercase tracking-[0.1em] ${mt} mt-0.5`} style={{ fontFamily: F.body }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Start a project CTA */}
      <FadeIn delay={0.4}>
        <Link to="/contact">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#ed592b] cursor-pointer group"
          >
            <div>
              <div className="text-white text-[14px] tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 600 }}>Start a project</div>
              <div className="text-white/60 text-[11px] mt-0.5" style={{ fontFamily: F.body }}>Tell me about your goals — I'll get back within 24h</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors flex-shrink-0">
              <ArrowUpRight size={15} className="text-white" />
            </div>
          </motion.div>
        </Link>
      </FadeIn>
    </div>
  );
};

/* ════════════════��═════════════════��═══��════════════════════════════ */
/*                      CONTACT CONTENT                              */
/* ═══��════════════════════════════════════════════════════���══════════ */
const ContactSkeleton = ({ isDark }: { isDark: boolean }) => {
  const pulse = isDark ? 'bg-white/[0.06] animate-pulse' : 'bg-zinc-200 animate-pulse';
  return (
    <div className="space-y-6">
      <div className="space-y-3 mb-6">
        <div className={`h-2.5 w-24 rounded-full ${pulse}`} />
        <div className={`h-5 w-56 rounded-lg ${pulse}`} />
        <div className={`h-3 w-80 rounded-md ${pulse}`} />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`h-[60px] rounded-xl border ${isDark ? 'border-white/[0.06]' : 'border-zinc-200'} ${pulse}`} />
      ))}
    </div>
  );
};

const ContactContent = ({ isDark }: { isDark: boolean }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const bg2 = isDark ? 'bg-white/[0.02]' : 'bg-zinc-50';
  const [ready, setReady] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSending(true);
    try {
      await fetch('https://formsubmit.co/ajax/mosiavasalome@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New inquiry from ${form.name || 'someone'} — ${form.type || 'Portfolio'}`,
          Name: form.name || '—',
          Email: form.email || '—',
          'Project type': form.type || '—',
          Budget: form.budget || '—',
          Timeline: form.timeline || '—',
          Message: form.message || '—',
        }),
      });
    } catch (_) {
      // silent — still show success; email may arrive with delay
    }
    setFormSending(false);
    setFormSent(true);
    setForm({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
    setTimeout(() => setFormSent(false), 4000);
  };

  if (!ready) return <ContactSkeleton isDark={isDark} />;

  const contactItems = [
    { icon: <Mail size={18} />, label: 'Email', value: 'mosiavasalome@gmail.com', href: 'mailto:mosiavasalome@gmail.com', color: '#ed592b', copyable: true, external: false },
    { icon: <Phone size={18} />, label: 'Phone', value: '598 67 14 16', href: 'tel:+995598671416', color: '#22c55e', copyable: true, external: false },
    { icon: <Linkedin size={18} />, label: 'Linkedin', value: '@samole', href: 'https://www.linkedin.com/in/samole/', color: '#0077b5', copyable: false, external: true },
    { icon: <BehanceIcon size={18} />, label: 'Behance', value: '@samole', href: 'https://www.behance.net/samole', color: '#1769ff', copyable: false, external: true },
    { icon: <Instagram size={18} />, label: 'Instagram', value: '@areuli.design', href: 'https://www.instagram.com/areuli.design/', color: '#e4405f', copyable: false, external: true },
  ];

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })} className="select-text">
      {/* Compact hero — availability + heading in one tight block */}
      <FadeIn>
        <div className="relative mb-6">
          <motion.div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(237,89,43,0.06) 0%, transparent 70%)' }}
            animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative">
            {/* Label row: "Get in touch" + availability inline */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5 mb-3"
            >
              <motion.span
                className="inline-block w-6 h-px bg-[#ed592b] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <span className={`text-[10px] uppercase tracking-[0.2em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                Get in touch
              </span>
              <div className={`h-3 w-px ${isDark ? 'bg-white/[0.08]' : 'bg-zinc-200'}`} />
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex h-[6px] w-[6px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
                  <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#22c55e]" />
                </span>
                <span className={`text-[10px] ${isDark ? 'text-[#22c55e]/80' : 'text-emerald-600/70'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                  Available for new projects
                </span>
              </span>
            </motion.div>

            {/* Single-line heading */}
            <div className="overflow-hidden mb-2.5">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`text-[16px] sm:text-[18px] tracking-[-0.02em] leading-[1.2] ${isDark ? 'text-white' : 'text-zinc-900'}`}
                style={{ fontFamily: F.heading, fontWeight: 600 }}
              >
                Let's create <span className="text-[#ed592b]">something amazing.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-[12px] leading-[1.6] max-w-md ${mt}`}
              style={{ fontFamily: F.body }}
            >
              Open for freelance projects, collaborations, and full-time opportunities.
            </motion.p>
          </div>
        </div>
      </FadeIn>

      {/* Contact cards — interactive grid */}
      <div className="space-y-1.5 mb-6">
        {contactItems.map((item, i) => (
          <FadeIn key={item.label} delay={0.35 + i * 0.06}>
            <motion.div
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ scale: 1.01 }}
              className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${border} ${
                hoveredIdx === i
                  ? isDark ? 'bg-white/[0.04] border-white/[0.1]' : 'bg-white border-zinc-300 shadow-lg shadow-black/[0.03]'
                  : isDark ? 'bg-white/[0.015]' : 'bg-white/80'
              }`}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.color}08, transparent 60%)` }}
              />

              <div className="relative flex items-center p-4">
                {/* Icon container — neutral by default, brand color on hover */}
                <motion.div
                  animate={{ rotate: hoveredIdx === i ? 6 : 0, scale: hoveredIdx === i ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 transition-colors duration-300 ${
                    hoveredIdx === i
                      ? ''
                      : isDark ? 'bg-white/[0.04] text-[#7a7d8a]' : 'bg-zinc-100 text-zinc-400'
                  }`}
                  style={hoveredIdx === i ? { backgroundColor: `${item.color}15`, color: item.color } : undefined}
                >
                  {item.icon}
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] uppercase tracking-[0.12em] mb-0.5 ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`text-[12px] sm:text-[14px] block truncate transition-colors duration-300 ${
                      hoveredIdx === i
                        ? isDark ? 'text-white' : 'text-zinc-900'
                        : isDark ? 'text-white/70' : 'text-zinc-600'
                    }`}
                    style={{ fontFamily: F.body, fontWeight: 500 }}
                  >
                    {item.value}
                  </a>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 sm:gap-1.5 flex-shrink-0">
                  {/* Button 1: Copy (for Email & Phone) */}
                  {item.copyable && (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => { e.preventDefault(); handleCopy(item.value, item.label); }}
                      className={`w-10 h-10 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] focus-visible:!opacity-100 ${
                        copied === item.label
                          ? 'bg-[#22c55e]/15 text-[#22c55e]'
                          : isDark ? 'bg-white/[0.05] text-white/40 hover:text-white/80' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-600'
                      }`}
                      title="Copy"
                    >
                      {copied === item.label ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[11px] sm:text-[10px]">✓</motion.span>
                      ) : (
                        <Copy size={14} className="sm:w-3 sm:h-3" />
                      )}
                    </motion.button>
                  )}

                  {/* Button 2: Send email / Ring phone / Open link */}
                  <motion.a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.85 }}
                    className={`w-10 h-10 sm:w-8 sm:h-8 rounded-xl sm:rounded-lg flex items-center justify-center transition-all duration-300 focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                      hoveredIdx === i
                        ? 'bg-[#ed592b]/15 text-[#ed592b]'
                        : isDark ? 'bg-white/[0.03] text-white/20' : 'bg-zinc-50 text-zinc-300'
                    }`}
                    title={item.label === 'Email' ? 'Send email' : item.label === 'Phone' ? 'Call' : `Open ${item.label}`}
                  >
                    {item.external ? <ExternalLink size={15} className="sm:w-[13px] sm:h-[13px]" /> : item.label === 'Email' ? <Send size={15} className="sm:w-[13px] sm:h-[13px]" /> : <Phone size={15} className="sm:w-[13px] sm:h-[13px]" />}
                  </motion.a>
                </div>
              </div>

              {/* Bottom accent line on hover */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: '0%' }}
                animate={{ width: hoveredIdx === i ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* Intake form */}
      <FadeIn delay={0.55}>
        <div className={`rounded-2xl border p-5 ${isDark ? 'border-white/[0.06] bg-[#0c0d11]' : `${border} bg-white`}`}>
          <p className={`text-[10px] uppercase tracking-[0.15em] ${mt} mb-4`} style={{ fontFamily: F.body, fontWeight: 500 }}>Quick inquiry</p>
          {/* Close dropdown when clicking outside */}
          {openDropdown && (
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-3">
              {([
                { field: 'name' as const, label: 'Your name', placeholder: 'What should I call you?', type: 'text', required: false },
                { field: 'email' as const, label: 'Email', placeholder: 'Where can I reach you?', type: 'email', required: true },
              ]).map(({ field, label, placeholder, type, required }) => (
                <div key={field}>
                  <label className={`text-[10px] uppercase tracking-[0.1em] ${mt} block mb-1.5`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                    {label}{required && <span className="text-[#ed592b] ml-0.5">*</span>}
                  </label>
                  <input
                    type={type}
                    required={required}
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className={`w-full text-[12px] px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                      isDark
                        ? 'bg-[#0a0b0f] border-white/[0.08] text-white/70 placeholder-white/15 focus:border-[#ed592b]/30 focus:shadow-[0_0_0_3px_rgba(237,89,43,0.06)]'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 placeholder-zinc-300 focus:border-[#ed592b]/30 focus:shadow-[0_0_0_3px_rgba(237,89,43,0.06)]'
                    } outline-none`}
                    style={{ fontFamily: F.body }}
                  />
                </div>
              ))}
            </div>

            {/* Inline dropdown renderer — no hooks, uses parent state */}
            {([
              {
                cols: 2,
                fields: [
                  { field: 'type' as const, label: 'Project type', placeholder: 'Select...', options: [
                    { value: 'UX/UI Design', label: 'UX/UI Design' },
                    { value: 'Art Direction', label: 'Art Direction' },
                    { value: 'Social Media', label: 'Social Media' },
                    { value: 'Motion Design', label: 'Motion Design' },
                    { value: 'Other', label: 'Other' },
                  ]},
                  { field: 'budget' as const, label: 'Budget', placeholder: 'Select...', options: [
                    { value: 'Under ₾500', label: 'Under ₾500' },
                    { value: '₾500–₾2,000', label: '₾500–₾2,000' },
                    { value: '₾2,000–₾6,000', label: '₾2,000–₾6,000' },
                    { value: '₾6,000–₾15,000', label: '₾6,000–₾15,000' },
                    { value: '₾15,000+', label: '₾15,000+' },
                    { value: "Let's discuss", label: "Let's discuss" },
                  ]},
                ],
              },
              {
                cols: 1,
                fields: [
                  { field: 'timeline' as const, label: 'Timeline', placeholder: 'Select...', options: [
                    { value: 'ASAP', label: 'ASAP' },
                    { value: 'Within 1 month', label: 'Within 1 month' },
                    { value: '1–3 months', label: '1–3 months' },
                    { value: '3+ months', label: '3+ months' },
                    { value: 'Flexible', label: 'Flexible' },
                  ]},
                ],
              },
            ] as { cols: number; fields: { field: keyof typeof form; label: string; placeholder: string; options: { value: string; label: string }[] }[] }[]).map((row, ri) => (
              <div key={ri} className={row.cols === 2 ? 'grid grid-cols-2 gap-3' : ''}>
                {row.fields.map(({ field, label, placeholder, options }) => {
                  const isOpen = openDropdown === field;
                  const selected = options.find((o) => o.value === form[field]);
                  return (
                    <div key={field}>
                      <label className={`text-[10px] uppercase tracking-[0.1em] ${mt} block mb-1.5`} style={{ fontFamily: F.body, fontWeight: 500 }}>{label}</label>
                      <div className="relative" style={{ zIndex: isOpen ? 50 : 'auto' }}>
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(isOpen ? null : field)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[12px] transition-all duration-200 cursor-pointer ${
                            isOpen
                              ? isDark ? 'border-[#ed592b]/35 bg-[#0a0b0f] shadow-[0_0_0_3px_rgba(237,89,43,0.07)]' : 'border-[#ed592b]/35 bg-white shadow-[0_0_0_3px_rgba(237,89,43,0.07)]'
                              : isDark ? 'border-white/[0.08] bg-[#0a0b0f] hover:border-white/[0.16]' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
                          }`}
                          style={{ fontFamily: F.body }}
                        >
                          <span className={selected ? (isDark ? 'text-white/80' : 'text-zinc-800') : (isDark ? 'text-white/20' : 'text-zinc-300')}>
                            {selected?.label ?? placeholder}
                          </span>
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 ml-2">
                            <ChevronDown size={13} className={isOpen ? 'text-[#ed592b]' : isDark ? 'text-white/20' : 'text-zinc-300'} />
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
                              animate={{ opacity: 1, y: 0, scaleY: 1 }}
                              exit={{ opacity: 0, y: -4, scaleY: 0.94 }}
                              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                              style={{ transformOrigin: 'top', zIndex: 51 }}
                              className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl border py-1 overflow-hidden ${
                                isDark ? 'bg-[#0e0f15] border-white/[0.1] shadow-2xl shadow-black/70' : 'bg-white border-zinc-200 shadow-xl shadow-black/[0.08]'
                              }`}
                            >
                              {options.map((opt, oi) => {
                                const isSel = form[field] === opt.value;
                                return (
                                  <motion.button
                                    key={opt.value}
                                    type="button"
                                    initial={{ opacity: 0, x: -4 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.12, delay: oi * 0.025 }}
                                    onClick={() => { setForm((f) => ({ ...f, [field]: opt.value })); setOpenDropdown(null); }}
                                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] transition-colors duration-100 ${
                                      isSel
                                        ? isDark ? 'text-[#ed592b] bg-[#ed592b]/[0.08]' : 'text-[#ed592b] bg-[#ed592b]/[0.05]'
                                        : isDark ? 'text-white/50 hover:text-white/90 hover:bg-white/[0.04]' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                                    }`}
                                    style={{ fontFamily: F.body }}
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center ${isSel ? 'bg-[#ed592b] border-[#ed592b]' : isDark ? 'border-white/[0.15]' : 'border-zinc-300'}`}>
                                      {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                                    </span>
                                    {opt.label}
                                  </motion.button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div>
              <label className={`text-[10px] uppercase tracking-[0.1em] ${mt} block mb-1.5`} style={{ fontFamily: F.body, fontWeight: 500 }}>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project..."
                rows={3}
                className={`w-full text-[12px] px-3 py-2.5 rounded-xl border resize-none transition-all duration-200 ${isDark ? 'bg-[#0a0b0f] border-white/[0.08] text-white/70 placeholder-white/15 focus:border-[#ed592b]/30 focus:shadow-[0_0_0_3px_rgba(237,89,43,0.06)]' : 'bg-zinc-50 border-zinc-200 text-zinc-700 placeholder-zinc-300 focus:border-[#ed592b]/30 focus:shadow-[0_0_0_3px_rgba(237,89,43,0.06)]'} outline-none`}
                style={{ fontFamily: F.body }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={formSending || formSent}
              whileHover={formSending || formSent ? {} : { scale: 1.02 }}
              whileTap={formSending || formSent ? {} : { scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition-all disabled:cursor-not-allowed ${
                formSent
                  ? 'bg-[#22c55e] text-white'
                  : formSending
                  ? 'bg-[#ed592b]/60 text-white'
                  : 'bg-[#ed592b] text-white hover:brightness-110 hover:shadow-[0_4px_20px_rgba(237,89,43,0.3)]'
              }`}
              style={{ fontFamily: F.body, fontWeight: 500 }}
            >
              {formSent ? (
                <><Check size={13} /> Sent — I'll get back to you soon!</>
              ) : formSending ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> Sending...</>
              ) : (
                <><Send size={13} /> Send inquiry</>
              )}
            </motion.button>
          </form>
        </div>
      </FadeIn>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*                   SOCIAL MEDIA ADS CONTENT                        */
/* ═════════════════════════════════════════════════════���═════════════ */
type AdsMedia = {
  src: string;
  type: 'image' | 'video';
  fullWidth?: boolean;
  tall?: boolean;
};

const adsBrands: { name: string; logoImg?: string; items: AdsMedia[]; aiContent?: boolean; compactGrid?: boolean; darkPhotoBg?: boolean; twoCol?: boolean; threeCol?: boolean; bentoGrid?: boolean; squareGrid?: boolean; whiteBg?: boolean }[] = [
  { name: 'FitMeal', aiContent: true, threeCol: true, squareGrid: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917409/fitmeal_bowpri.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773344688/WhatsApp_Image_2026-03-08_at_14.44.08_xkrwdx.jpg', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773344688/WhatsApp_Image_2026-03-08_at_14.44.08_1_lquzrl.jpg', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1778350259/fitmeal2_nr1rbc.jpg', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1778350259/fitmeal03_eslqq8.jpg', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1778350260/fitmeal1_pjqki6.jpg', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1778350260/fitmeal04_siknqu.jpg', type: 'image' },
  ]},
  { name: 'Terminal · ტერმინალი', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/terminal_hcftru.webp', items: [
    { src: adsTerminal1, type: 'image' },
    { src: adsTerminal2, type: 'image' },
    { src: adsTerminal3, type: 'image' },
    { src: adsTerminal4, type: 'image' },
    { src: adsTerminal5, type: 'image' },
  ]},
  { name: 'Mardi Holding', aiContent: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/mardi_dzhmgm.webp', items: [
    { src: adsMardi1, type: 'image' },
    { src: adsMardi2, type: 'image' },
    { src: adsMardi3, type: 'image' },
    { src: adsMardi4, type: 'image' },
    { src: adsMardi5, type: 'image' },
  ]},
  { name: 'Crystal Leasing · კრისტალ ლიზინგი', squareGrid: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916798/%E1%83%99%E1%83%A0%E1%83%98%E1%83%A1%E1%83%A2%E1%83%90%E1%83%9A_%E1%83%9A%E1%83%98%E1%83%96%E1%83%98%E1%83%9C%E1%83%92%E1%83%98_xeyoop.webp', items: [
    { src: adsCrystal4, type: 'image' },
    { src: adsCrystal1, type: 'image' },
    { src: adsCrystal2, type: 'image' },
    { src: adsCrystal3, type: 'image' },
  ]},
  { name: 'Gino Aquapark · ჯინო აკვაპარკი', twoCol: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/%E1%83%AF%E1%83%98%E1%83%9C%E1%83%9D_%E1%83%90%E1%83%99%E1%83%95%E1%83%90%E1%83%9E%E1%83%90%E1%83%A0%E1%83%99%E1%83%98_r3am9r.webp', items: [
    { src: adsGino4, type: 'image' },
    { src: adsGino1, type: 'image' },
    { src: adsGino2, type: 'image' },
    { src: adsGino3, type: 'image' },
  ]},
  { name: 'Carmall · ქარმოლი', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp', items: [
    { src: adsCarmall1, type: 'image' },
    { src: adsCarmall2, type: 'image' },
    { src: adsCarmall3, type: 'image' },
    { src: adsCarmall4, type: 'image', fullWidth: true },
  ]},
  { name: 'Scope', logoImg: logoScope, compactGrid: true, items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268321/image_15_nafa1y.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268322/%E1%83%A0%E1%83%90%E1%83%A2%E1%83%9D%E1%83%9B-%E1%83%95%E1%83%94%E1%83%A0-%E1%83%A7%E1%83%98%E1%83%93%E1%83%98%E1%83%A1_1_taleoy.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268323/image_16_gy0yln.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268322/image_13_x8vcgr.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268322/image_12_mtrhqg.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773268323/image_14_tng1vh.png', type: 'image' },
  ]},
  { name: 'Regus', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917415/regus_nv1pte.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773319425/cover_2_o8jqva.webp', type: 'image', fullWidth: true },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773319931/1_ENG_gu31ka.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773319943/2_ENG_e9uyoz.webp', type: 'image' },
  ]},
  { name: 'GTCC', twoCol: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/gtcc_sk1wrg.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773269578/%E1%83%92%E1%83%90%E1%83%A1%E1%83%A4-2_otpsiu.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773269575/image_8_pdfeca.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773269575/image_9_yk9ysd.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773269574/image_10_nai9mn.png', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773269584/image_11_x2ppb1.png', type: 'image' },
  ]},
  { name: 'The Khachapuri · ხაჭაპური', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/the_khachapuri_fv6s7a.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435381/XACHAPURI_1_hzqwjm.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435381/%E1%83%AA%E1%83%94%E1%83%96%E1%83%90%E1%83%A0%E1%83%98-%E1%83%99%E1%83%A0%E1%83%94%E1%83%95%E1%83%94%E1%83%A2%E1%83%94%E1%83%91%E1%83%98%E1%83%97_rs3227.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435380/menuuu_rllapb.webp', type: 'image' },
  ]},
  { name: 'არენა · Arena Sports Complex', compactGrid: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/arena_ydenyt.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435781/oalcrhtxt4flbp1eduth_qllomh.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435782/beza4apnp1c4doscnpxd_mtdsqy.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435782/iifw1pa01dahbxlrptpt_etp7vp.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435783/osehbfgl6rr2oo4yukpi_htn4qa.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435783/ca33ipml9e1m60ztcjeq_bwuqcv.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435783/fowo5cxcm6vbdzp8ovwb_sbvfgt.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435783/enwazlvpnhsxketleiid_m7mbqr.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435847/image_9_ddlrv4.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773435847/Artboard_1_1_ipw9xn.webp', type: 'image' },
  ]},
  { name: 'Assorti · ასორტი', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/assorti_qhgw5n.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436031/uni-1_hcac4g.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436033/image_9_ix9wkc.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436031/image_8_wlbo1j.webp', type: 'image' },
  ]},
  { name: 'Art Gallery Noblesse', twoCol: true, whiteBg: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/noblesse_e6stj6.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436241/veijim0y6cb5zalzagwc_gy67ba.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436241/zk7oi25rajic4j8elyz0_lxtkoy.webp', type: 'image' },
  ]},
  { name: 'Thermo Center', twoCol: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/thermocenter_vpkndk.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436457/webujgonn1sbaw4qclev_c0cm7h.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436457/nxt3gjff8cyo0slzjzlb_shjapo.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436456/fmepbqewulixfvqdohme_eyvpsf.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436457/u2tfvzpttg0lj5cstpw6_x8oklv.webp', type: 'image' },
  ]},
  { name: 'BORDO', logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916798/bordo_zti82j.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436835/qvfr9gim6yny9wf0nvmp_nvtljn.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436836/utueqfyuvx5czb4xberv_xomlrg.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436836/o2yjvifvas7icnj6nfyf_oepl6o.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436836/xrr21mdxwoyjrby3oxxe_x3qnhl.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436836/zgzezo2aubimywxpo9zq_oiuama.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773436837/zyhlbbnsefsnopaul3un_ew25rm.webp', type: 'image' },
  ]},
  { name: "DrBrown's Georgia", twoCol: true, logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917410/drbrowns_wdyytm.webp', items: [
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773437123/ktblhmxptaigpkewk8qy_vutvcx.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773437123/vbt7g1pii5omcqg3dbsr_jzzk57.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773437122/robkplfcbo6hrmbrbljq_grqvyn.webp', type: 'image' },
    { src: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773437123/ugedj1sodnylgbwypb58_gu38vo.webp', type: 'image' },
  ]},
];

/* Lightbox for full-size image viewing — rendered via portal to avoid parent transform issues */
const ImageLightbox = ({ src, alt, onClose, whiteBg, onPrev, onNext, hasPrev, hasNext }: {
  src: string; alt: string; onClose: () => void; whiteBg?: boolean;
  onPrev: () => void; onNext: () => void; hasPrev: boolean; hasNext: boolean;
}) => {

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6 md:p-8 cursor-pointer"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
      />
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-10 max-w-[82vw] max-h-[82vh] rounded-xl shadow-2xl object-contain select-none cursor-default ${whiteBg ? 'bg-white p-4' : ''}`}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </AnimatePresence>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:bg-white/30 transition-colors focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.5)]"
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </motion.div>,
    document.body
  );
};

/* Module-level cache: tracks URLs already loaded so re-visiting a brand is instant */
const imgLoadCache = new Set<string>();

/* Shimmer loading skeleton for media */
const MediaShimmer = ({ isDark }: { isDark: boolean }) => (
  <div className={`absolute inset-0 z-10 ${isDark ? 'bg-[#121318]' : 'bg-zinc-100'}`}>
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)'
            : 'linear-gradient(105deg, transparent 40%, rgba(0,0,0,0.04) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className={`w-6 h-6 rounded-full border-2 border-t-transparent ${isDark ? 'border-white/10' : 'border-zinc-300'}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  </div>
);

/* Media with loading state */
const AdsMediaItem = ({ item, brandName, index, isDark, border, onImageClick, whiteBg, fill }: {
  item: { src: string; type: 'image' | 'video'; fullWidth?: boolean };
  brandName: string;
  index: number;
  isDark: boolean;
  border: string;
  onImageClick: () => void;
  whiteBg?: boolean;
  fill?: boolean;
}) => {
  // Start as loaded if this URL was already fetched — instant display on tab revisit
  const [loaded, setLoaded] = useState(() => item.type === 'image' && imgLoadCache.has(item.src));

  return (
    <TiltCard
      onClick={() => item.type === 'image' ? onImageClick() : undefined}
      className={`relative rounded-lg overflow-hidden border ${border} group cursor-pointer ${fill ? 'h-full' : 'break-inside-avoid mb-2.5'} ${whiteBg ? 'bg-white' : ''}`}
    >
      <div className={`relative ${fill ? 'h-full' : ''}`}>
        {!loaded && <MediaShimmer isDark={isDark} />}
        {item.type === 'video' ? (
          <video
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
            className={`${fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto'} block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={() => setLoaded(true)}
          />
        ) : (
          <img
            src={item.src}
            alt={`${brandName} social media ad design — ${index + 1}`}
            loading={imgLoadCache.has(item.src) ? 'eager' : 'lazy'}
            decoding="async"
            className={`${fill ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto'} block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${!fill && whiteBg ? 'h-full object-cover' : ''}`}
            onLoad={() => { imgLoadCache.add(item.src); setLoaded(true); }}
          />
        )}
        {/* Reserve space for shimmer when not loaded — skip in fill mode (parent defines height) */}
        {!loaded && !fill && <div className="w-full" style={{ paddingBottom: '100%' }} />}
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-400 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
          <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/10">
            {item.type === 'video' ? <Play size={11} className="text-white ml-0.5" /> : <ArrowUpRight size={11} className="text-white" />}
          </div>
        </div>
      </div>
      {item.type === 'video' && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/[0.08]">
            <Play size={8} className="text-white/70 fill-white/70" />
            <span className="text-[7px] font-mono text-white/60 uppercase tracking-wider">Reel</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-md text-white/50 border border-white/[0.04]">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </TiltCard>
  );
};

/* Simple hover card for images — no 3D transforms (avoids CSS columns + preserve-3d browser bugs) */
const TiltCard = ({ children, className, onClick, style: extraStyle }: { children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      style={extraStyle}
    >
      {children}
    </motion.div>
  );
};

const SocialMediaAdsContent = ({ isDark }: { isDark: boolean }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const bg2 = isDark ? 'bg-white/[0.03]' : 'bg-zinc-50';
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; whiteBg?: boolean; images: string[]; index: number } | null>(null);

  const navigateLightbox = useCallback((delta: number) => {
    setLightbox(prev => {
      if (!prev) return null;
      const newIdx = prev.index + delta;
      if (newIdx < 0 || newIdx >= prev.images.length) return prev;
      return { ...prev, src: prev.images[newIdx], index: newIdx };
    });
  }, []);
  const [activeBrand, setActiveBrand] = useState(0);
  const [direction, setDirection] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [viewAllPage, setViewAllPage] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brand = adsBrands[activeBrand];

  /* Pause autoplay on user interaction, resume after 10s */
  const pauseForInteraction = () => {
    setIsPaused(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => setIsPaused(false), 10000);
  };

  useEffect(() => {
    return () => { if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current); };
  }, []);

  const ITEMS_PER_PAGE = 9;
  const allVisuals = useMemo(() =>
    adsBrands.flatMap((b) => b.items.map((item) => ({ ...item, brandName: b.name, brandIdx: adsBrands.indexOf(b), logoImg: b.logoImg, whiteBg: b.whiteBg }))),
    []
  );
  const totalPages = Math.ceil(allVisuals.length / ITEMS_PER_PAGE);
  const pagedVisuals = allVisuals.slice(viewAllPage * ITEMS_PER_PAGE, (viewAllPage + 1) * ITEMS_PER_PAGE);

  const goTo = (idx: number) => { setDirection(idx > activeBrand ? 1 : -1); setActiveBrand(idx); pauseForInteraction(); };
  const goPrev = () => { setDirection(-1); setActiveBrand(p => p === 0 ? adsBrands.length - 1 : p - 1); pauseForInteraction(); };
  const goNext = () => { setDirection(1); setActiveBrand(p => (p + 1) % adsBrands.length); pauseForInteraction(); };

  /* Preload a brand's images on tab hover so switching feels instant */
  const preloadBrand = useCallback((idx: number) => {
    adsBrands[idx]?.items.forEach(item => {
      if (item.type === 'image' && !imgLoadCache.has(item.src)) {
        const img = new window.Image();
        img.onload = () => imgLoadCache.add(item.src);
        img.src = item.src;
      }
    });
  }, []);

  /* Scroll active tab into view horizontally */
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.children[activeBrand] as HTMLElement;
    if (!activeBtn) return;
    const left = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
    container.scrollTo({ left, behavior: 'smooth' });
  }, [activeBrand]);

  /* Autoplay — uses functional updater so no activeBrand dep needed */
  useEffect(() => {
    if (lightbox || isPaused || showAll) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveBrand(p => (p + 1) % adsBrands.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [lightbox, isPaused, showAll]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(null);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(+1);
        return;
      }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape' && showAll) setShowAll(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, navigateLightbox]); // goPrev/goNext use functional updaters

  const slideVariants = {
    enter: (_d: number) => ({ opacity: 0, scale: 0.97, filter: 'blur(4px)' }),
    center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: (_d: number) => ({ opacity: 0, scale: 0.97, filter: 'blur(3px)' }),
  };

  return (
    <div className="overflow-hidden">
      <FadeIn>
        {/* ── Desktop: single row (sm+) ── */}
        <div className="hidden sm:flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#ed592b]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
            <h1 className="text-[15px] tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 600 }}>Social Media Ads</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.span key={activeBrand} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={`text-[10px] font-mono ${mt} mr-1`}>
              {String(activeBrand + 1).padStart(2, '0')}/{String(adsBrands.length).padStart(2, '0')}
            </motion.span>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={goPrev} aria-label="Previous brand"
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            ><ChevronLeft size={13} /></motion.button>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={() => setIsPaused(p => !p)} aria-label={isPaused ? 'Resume' : 'Pause'}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isPaused ? 'text-[#ed592b]' : isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            >{isPaused ? <Play size={11} className="ml-0.5" /> : <Pause size={11} />}</motion.button>
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} onClick={goNext} aria-label="Next brand"
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            ><ChevronRight size={13} /></motion.button>
            <div className={`w-px h-3.5 mx-0.5 ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`} />
            <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }}
              onClick={() => { setShowAll(p => { if (!p) setViewAllPage(0); return !p; }); setIsPaused(true); }}
              aria-label={showAll ? 'Close gallery' : 'View all brands'}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${showAll ? 'text-[#ed592b]' : isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            >{showAll ? <X size={11} /> : <LayoutGrid size={11} />}</motion.button>
          </div>
        </div>

        {/* ── Mobile: 2 rows ── */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-[#ed592b]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              </div>
              <h1 className="text-[15px] tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 600 }}>Social Media Ads</h1>
            </div>
            <motion.span key={`m-${activeBrand}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={`text-[10px] font-mono ${mt}`}>
              {String(activeBrand + 1).padStart(2, '0')}/{String(adsBrands.length).padStart(2, '0')}
            </motion.span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={goPrev} aria-label="Previous"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'text-[#8a8d9a] bg-white/[0.05] border border-white/[0.06] active:bg-white/[0.1]' : 'text-zinc-400 bg-zinc-100 border border-zinc-200 active:bg-zinc-200'}`}
            ><ChevronLeft size={18} /></motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsPaused(p => !p)} aria-label={isPaused ? 'Resume' : 'Pause'}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPaused ? 'text-[#ed592b] bg-[#ed592b]/10 border border-[#ed592b]/20' : isDark ? 'text-[#8a8d9a] bg-white/[0.05] border border-white/[0.06] active:bg-white/[0.1]' : 'text-zinc-400 bg-zinc-100 border border-zinc-200 active:bg-zinc-200'}`}
            >{isPaused ? <Play size={16} className="ml-0.5" /> : <Pause size={16} />}</motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={goNext} aria-label="Next"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'text-[#8a8d9a] bg-white/[0.05] border border-white/[0.06] active:bg-white/[0.1]' : 'text-zinc-400 bg-zinc-100 border border-zinc-200 active:bg-zinc-200'}`}
            ><ChevronRight size={18} /></motion.button>
            <div className="flex-1" />
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => { setShowAll(p => { if (!p) setViewAllPage(0); return !p; }); setIsPaused(true); }}
              aria-label={showAll ? 'Close' : 'View all'}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${showAll ? 'text-[#ed592b] bg-[#ed592b]/10 border border-[#ed592b]/20' : isDark ? 'text-[#8a8d9a] bg-white/[0.05] border border-white/[0.06] active:bg-white/[0.1]' : 'text-zinc-400 bg-zinc-100 border border-zinc-200 active:bg-zinc-200'}`}
            >{showAll ? <X size={16} /> : <LayoutGrid size={16} />}</motion.button>
          </div>
        </div>

        {/* Segmented progress bar — taller on mobile */}
        <div className="flex gap-[3px] sm:gap-[2px] mb-6 sm:mb-5 ml-0 sm:ml-4">
          {adsBrands.map((_, i) => (
            <div key={i} className={`h-1 sm:h-[2px] flex-1 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-200'}`}>
              {i < activeBrand ? (
                <div className="h-full w-full bg-[#ed592b] rounded-full" />
              ) : i === activeBrand ? (
                <motion.div
                  className="h-full bg-[#ed592b] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: isPaused ? undefined : '100%' }}
                  key={`${activeBrand}-${isPaused}`}
                  transition={isPaused ? { duration: 0 } : { duration: 7, ease: 'linear' }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Company slider tabs with magnetic hover */}
      <FadeIn delay={0.04}>
        <div className="relative mb-4">
          <div ref={tabsRef} className="flex gap-1 pb-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {adsBrands.map((b, i) => {
              const active = i === activeBrand;
              const hovered = i === hoveredTab;
              return (
                <motion.button
                  key={b.name}
                  onClick={() => goTo(i)}
                  onMouseEnter={() => { setHoveredTab(i); preloadBrand(i); }}
                  onMouseLeave={() => setHoveredTab(null)}
                  whileTap={{ scale: 0.94 }}
                  animate={{ y: hovered && !active ? -2 : 0 }}
                  className={`relative flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-colors duration-200 ${
                    active
                      ? isDark ? 'text-white' : 'text-zinc-900'
                      : isDark ? 'text-[#5a5d6a] hover:text-white/60' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                  style={{ fontFamily: F.body, fontWeight: active ? 600 : 400 }}
                >
                  {active && (
                    <motion.div
                      layoutId="ads-tab-pill"
                      className={`absolute inset-0 rounded-lg ${isDark ? 'bg-white/[0.07]' : 'bg-zinc-100'} overflow-hidden`}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    >
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(105deg, transparent 40%, ${isDark ? 'rgba(237,89,43,0.08)' : 'rgba(237,89,43,0.05)'} 50%, transparent 60%)`, backgroundSize: '200% 100%' }}
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  )}
                  {hovered && !active && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 rounded-lg ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50'}`} />
                  )}
                  <span className="relative z-10">
                    {b.name.split(' · ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <div className={`absolute top-0 right-0 bottom-1 w-10 pointer-events-none bg-gradient-to-l ${isDark ? 'from-[#0a0a0c]' : 'from-[#f5f5f5]'} to-transparent`} />
        </div>
      </FadeIn>

      {/* "View All" gallery grid */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mb-3"
          >
            <div className={`rounded-xl ${bg2} border ${border} p-3`}>
              {/* Page header */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-mono ${mt}`}>
                  {allVisuals.length} visuals · Page {viewAllPage + 1}/{totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setViewAllPage(p => Math.max(0, p - 1))}
                    disabled={viewAllPage === 0}
                    aria-label="Previous page"
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors min-h-[44px] min-w-[32px] focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                      viewAllPage === 0
                        ? isDark ? 'text-white/10 cursor-not-allowed' : 'text-zinc-200 cursor-not-allowed'
                        : isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <ChevronLeft size={13} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setViewAllPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={viewAllPage === totalPages - 1}
                    aria-label="Next page"
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors min-h-[44px] min-w-[32px] focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
                      viewAllPage === totalPages - 1
                        ? isDark ? 'text-white/10 cursor-not-allowed' : 'text-zinc-200 cursor-not-allowed'
                        : isDark ? 'text-[#5a5d6a] hover:text-white hover:bg-white/[0.06]' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <ChevronRight size={13} />
                  </motion.button>
                </div>
              </div>

              {/* Paginated visuals grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewAllPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="columns-2 md:columns-3"
                  style={{ columnGap: '0.375rem' }}
                >
                  {(() => {
                    const pageImgSrcs = pagedVisuals.filter(v => v.type === 'image').map(v => v.src);
                    return pagedVisuals.map((v, i) => (
                    <motion.button
                      key={`${v.brandName}-${v.src}`}
                      onClick={() => v.type === 'image' ? setLightbox({ src: v.src, alt: v.brandName, whiteBg: v.whiteBg, images: pageImgSrcs, index: pageImgSrcs.indexOf(v.src) }) : undefined}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className={`group relative rounded-lg overflow-hidden border ${border} transition-all duration-200 block break-inside-avoid mb-1.5 ${isDark ? 'hover:border-white/[0.12]' : 'hover:border-zinc-300'}`}
                    >
                      <div className="overflow-hidden">
                        {v.type === 'video' ? (
                          <video src={v.src} autoPlay loop muted playsInline className="w-full h-auto object-cover block" />
                        ) : (
                          <img src={v.src} alt={`${v.brandName} social media advertising design`} loading="lazy" decoding="async" width="800" height="800" className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/70' : 'from-black/50'} to-transparent flex items-end p-2`}>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[7px] flex-shrink-0 ${isDark ? 'bg-white/15 text-white/70' : 'bg-white/20 text-white/80'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
                            {v.logoImg ? <img src={v.logoImg} alt={`${v.brandName} logo`} loading="lazy" width="16" height="16" className="w-full h-full object-cover rounded" /> : v.brandName.charAt(0)}
                          </div>
                          <span className="text-[9px] text-white/90 truncate" style={{ fontFamily: F.body, fontWeight: 500 }}>
                            {v.brandName.split(' · ')[0]}
                          </span>
                        </div>
                      </div>
                      {v.type === 'video' && (
                        <div className="absolute top-1.5 left-1.5">
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/[0.08]">
                            <Play size={7} className="text-white/70 fill-white/70" />
                            <span className="text-[7px] font-mono text-white/60 uppercase tracking-wider">Reel</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/10">
                            {v.type === 'video' ? <Play size={11} className="text-white ml-0.5" /> : <ArrowUpRight size={11} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ));})()}
                </motion.div>
              </AnimatePresence>

              {/* Page dots */}
              <div className="flex items-center justify-center gap-1 mt-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setViewAllPage(i)} className="p-0.5" aria-label={`Page ${i + 1}`}>
                    <motion.div
                      animate={{
                        width: i === viewAllPage ? 16 : 4,
                        height: 4,
                        backgroundColor: i === viewAllPage ? '#ed592b' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        borderRadius: 2,
                      }}
                      whileHover={{ backgroundColor: i === viewAllPage ? '#ed592b' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', scale: i === viewAllPage ? 1 : 1.5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active brand — directional slide with blur + swipe */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeBrand}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          onDragEnd={(_e, info) => {
            const swipe = Math.abs(info.offset.x) * info.velocity.x;
            if (info.offset.x > 40 || swipe > 800) goPrev();
            else if (info.offset.x < -40 || swipe < -800) goNext();
          }}
          style={{ touchAction: 'pan-y' }}
        >
          <div className={`rounded-xl ${bg2} border ${border} p-3 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, #ed592b 0%, transparent 70%)' }} />

            {/* Brand info + nav arrows */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <motion.div
                  key={brand.name}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden text-[10px] tracking-wider ${isDark ? 'bg-[#ed592b]/15 text-[#ed592b]' : 'bg-[#ed592b]/10 text-[#ed592b]'}`}
                  style={{ fontFamily: F.heading, fontWeight: 700 }}
                >
                  {brand.logoImg ? (
                    <img src={brand.logoImg} alt={`${brand.name} logo`} loading="lazy" width="32" height="32" className="w-full h-full object-cover" />
                  ) : (
                    brand.name.charAt(0)
                  )}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <motion.span key={`n-${activeBrand}`} initial={{ opacity: 0, x: direction * 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={`text-[12px] block ${isDark ? 'text-white/90' : 'text-zinc-800'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                      {brand.name}
                    </motion.span>
                    {brand.aiContent && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] uppercase tracking-[0.1em] ${isDark ? 'bg-[#ed592b]/10 text-[#ed592b] border border-[#ed592b]/20' : 'bg-[#ed592b]/8 text-[#ed592b] border border-[#ed592b]/15'}`}
                        style={{ fontFamily: F.body, fontWeight: 600 }}
                      >
                        <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2.2 4.4L15 6.3l-3.5 3.4.8 4.9L8 12.4l-4.3 2.2.8-4.9L1 6.3l4.8-.9L8 1z"/></svg>
                        AI Content
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] uppercase tracking-[0.08em] ${isDark ? 'bg-white/[0.04] text-[#5a5d6a]' : 'bg-zinc-100 text-zinc-400'}`}
                    style={{ fontFamily: F.body, fontWeight: 500 }}
                  >
                    <Pause size={7} />
                    Paused
                  </motion.div>
                )}
                <span className={`text-[9px] font-mono ${mt}`}>
                  {brand.items.length} {brand.items.length === 1 ? 'visual' : 'visuals'}
                </span>
              </div>
            </div>

            {/* Grid layout — splits fullWidth items into their own rows */}
            {(() => {
              /* Bento: tall item left (spans full height) + 2 stacked items right */
              if (brand.bentoGrid) {
                const tallItem = brand.items.find(it => it.tall);
                const regularItems = brand.items.filter(it => !it.tall);
                const imgSrcs = brand.items.filter(it => it.type === 'image').map(it => it.src);
                const btnCls = `relative rounded-lg overflow-hidden border ${border} group cursor-pointer`;
                const hoverOverlay = (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/10">
                        <ArrowUpRight size={11} className="text-white" />
                      </div>
                    </div>
                  </div>
                );
                return (
                  <div className="relative z-10 flex gap-2.5 items-stretch">
                    {tallItem && (
                      <motion.button
                        className={`flex-1 ${btnCls}`}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        onClick={() => setLightbox({ src: tallItem.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcs, index: imgSrcs.indexOf(tallItem.src) })}
                      >
                        <img src={tallItem.src} alt={`${brand.name} visual`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover block" />
                        {hoverOverlay}
                      </motion.button>
                    )}
                    <div className="flex-1 flex flex-col gap-2.5">
                      {regularItems.slice(0, 2).map((item, i) => (
                        <motion.button
                          key={i}
                          className={`flex-1 aspect-square ${btnCls}`}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          onClick={() => setLightbox({ src: item.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcs, index: imgSrcs.indexOf(item.src) })}
                        >
                          <img src={item.src} alt={`${brand.name} visual ${i + 2}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover block" />
                          {hoverOverlay}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              }
              /* Square grid: uniform aspect-ratio cells, CSS grid */
              if (brand.squareGrid) {
                const cols = brand.threeCol ? 'grid-cols-3' : 'grid-cols-2';
                const imgSrcs = brand.items.filter(it => it.type === 'image').map(it => it.src);
                return (
                  <div className={`relative z-10 grid ${cols} gap-2`}>
                    {brand.items.map((item, i) => (
                      <div key={`${brand.name}-${i}`} className="aspect-square">
                        <AdsMediaItem item={item} brandName={brand.name} index={i} isDark={isDark} border={border} whiteBg={brand.whiteBg} fill
                          onImageClick={() => setLightbox({ src: item.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcs, index: imgSrcs.indexOf(item.src) })} />
                      </div>
                    ))}
                  </div>
                );
              }
              const hasFullWidth = brand.items.some(it => it.fullWidth);
              if (!hasFullWidth) {
                const colsClass = brand.whiteBg
                  ? `grid ${brand.twoCol ? 'grid-cols-2' : brand.threeCol ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'} gap-2.5`
                  : brand.twoCol ? 'columns-2'
                  : brand.threeCol ? 'grid grid-cols-3 gap-2.5'
                  : brand.items.length <= 2 ? 'columns-2' : 'columns-2 md:columns-3';
                const isGrid = brand.whiteBg || brand.threeCol;
                return (
                  <div className={`relative z-10 ${colsClass}`} style={isGrid ? undefined : { columnGap: '0.625rem' }}>
                    {(() => {
                      const imgSrcs = brand.items.filter(it => it.type === 'image').map(it => it.src);
                      return brand.items.map((item, i) => (
                        <AdsMediaItem key={`${brand.name}-${i}`} item={item} brandName={brand.name} index={i} isDark={isDark} border={border} whiteBg={brand.whiteBg}
                          onImageClick={() => setLightbox({ src: item.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcs, index: imgSrcs.indexOf(item.src) })} />
                      ));
                    })()}
                  </div>
                );
              }
              /* Group consecutive non-fullWidth items into column groups */
              const groups: { fullWidth: boolean; items: { item: AdsMedia; idx: number }[] }[] = [];
              brand.items.forEach((item, i) => {
                const fw = !!item.fullWidth;
                const last = groups[groups.length - 1];
                if (last && last.fullWidth === fw) { last.items.push({ item, idx: i }); }
                else { groups.push({ fullWidth: fw, items: [{ item, idx: i }] }); }
              });
              const regColsClass = brand.whiteBg
                ? `grid ${brand.twoCol ? 'grid-cols-2' : brand.threeCol ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'} gap-2.5`
                : brand.twoCol ? 'columns-2'
                : brand.threeCol ? 'grid grid-cols-3 gap-2.5'
                : 'columns-2 md:columns-3';
              const isRegGrid = brand.whiteBg || brand.threeCol;
              const imgSrcsGroups = brand.items.filter(it => it.type === 'image').map(it => it.src);
              return (
                <div className="relative z-10 flex flex-col gap-2.5">
                  {groups.map((g, gi) => g.fullWidth ? (
                    g.items.map(({ item, idx }) => (
                      <AdsMediaItem key={`${brand.name}-${idx}`} item={item} brandName={brand.name} index={idx} isDark={isDark} border={border} whiteBg={brand.whiteBg}
                        onImageClick={() => setLightbox({ src: item.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcsGroups, index: imgSrcsGroups.indexOf(item.src) })} />
                    ))
                  ) : (
                    <div key={`grp-${gi}`} className={regColsClass} style={isRegGrid ? undefined : { columnGap: '0.625rem' }}>
                      {g.items.map(({ item, idx }) => (
                        <AdsMediaItem key={`${brand.name}-${idx}`} item={item} brandName={brand.name} index={idx} isDark={isDark} border={border} whiteBg={brand.whiteBg}
                          onImageClick={() => setLightbox({ src: item.src, alt: brand.name, whiteBg: brand.whiteBg, images: imgSrcsGroups, index: imgSrcsGroups.indexOf(item.src) })} />
                      ))}
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>

          {/* Swipe hint for mobile */}
          <div className="flex items-center justify-center gap-1.5 mt-2 sm:hidden">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className={`text-[9px] ${mt} flex items-center gap-1`}
              style={{ fontFamily: F.body }}
            >
              <motion.span animate={{ x: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>←</motion.span>
              Swipe to browse
              <motion.span animate={{ x: [3, -3, 3] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
            </motion.span>
          </div>

          {/* Spring-animated progress dots */}
          <div className="flex items-center justify-center gap-1 mt-3">
            {adsBrands.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="p-0.5 group">
                <motion.div
                  animate={{ width: i === activeBrand ? 20 : 4, height: 4, backgroundColor: i === activeBrand ? '#ed592b' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 2 }}
                  whileHover={{ backgroundColor: i === activeBrand ? '#ed592b' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', scale: i === activeBrand ? 1 : 1.5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Fixed mobile nav arrows — always same screen position */}
      {createPortal(
        <div className="fixed left-0 right-0 z-[100] pointer-events-none flex items-center justify-between px-0 sm:hidden" style={{ top: '50vh', transform: 'translateY(-50%)' }}>
          <button onClick={goPrev} className="pointer-events-auto w-9 h-14 rounded-r-xl flex items-center justify-center bg-black/40 backdrop-blur-md text-white/80 active:bg-black/60 transition-colors" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="pointer-events-auto w-9 h-14 rounded-l-xl flex items-center justify-center bg-black/40 backdrop-blur-md text-white/80 active:bg-black/60 transition-colors" aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>,
        document.body
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && <ImageLightbox src={lightbox.src} alt={lightbox.alt} whiteBg={lightbox.whiteBg} onClose={() => setLightbox(null)}
          onPrev={() => navigateLightbox(-1)} onNext={() => navigateLightbox(+1)}
          hasPrev={lightbox.index > 0} hasNext={lightbox.index < lightbox.images.length - 1} />}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*                 SOCIAL MEDIA MOTION CONTENT                       */
/* ════�����════════════════════════════════════════════════════════���════ */
const motionReels = [
  {
    brand: 'Brand Signature',
    brandInitial: 'B',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773268073/2026-01-09_10.16.26_jclsib.mp4',
    label: 'Logo Reveal',
  },
  {
    brand: 'Carmall · ქარმოლი',
    brandInitial: 'C',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/carmall-ne_1_u5ewuz.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Carmall · ქარმოლი',
    brandInitial: 'C',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267419/carmall03_vku8z1.mp4',
    label: 'Motion Reel',
  },
  {
    brand: 'Carmall · ქარმოლი',
    brandInitial: 'C',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267418/carmall04_m7zidg.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Carmall · ქარმოლი',
    brandInitial: 'C',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267407/carmall02_nzawuu.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Saloni Furniture · სალონი',
    brandInitial: 'S',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916806/saloni_iko8hs.jpg',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267381/AQNTAkFnbjZnlwjm_eclmDvDyCogE1mExFHdPOXmljSK8h-bzDQjiAebMf56wWY7BbU54DeSDuWeujtdSu3QEwUoqV98BMGjQ965ZLX5feFgOQ_s9rlwa.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Saloni Furniture · სალონი',
    brandInitial: 'S',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916806/saloni_iko8hs.jpg',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267381/AQNPbFENbOtkvJI0IY6pp-qh3xFwqmckiau6vxoJa9Kwl7wRwFhd9HX3dcaY4HSdpKi10gb5xyCcwHC8BTZkzj35UckmIN3VoEQPorjF5pIW7A_efercf.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Saloni Furniture · სალონი',
    brandInitial: 'S',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916806/saloni_iko8hs.jpg',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267381/AQMXbkt8sE4pG7lHm8iaVHCoeoWEwJfVG8aFPI19fZ_B-kdBe36uG1SQ7Yy6PPstEwM8RXUqcW7_i6mdh-_NYNuFLxoNoCJ7w-lauRKyQMh8nw_qzmhxx.mp4',
    label: 'Social Media Reel',
  },
  {
    brand: 'Scope · სქოუფი',
    brandInitial: 'S',
    logoImg: logoScope,
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267408/bog_scope_urad4o.mp4',
    label: 'BOG × Scope',
  },
  {
    brand: 'Scope · სქოუფი',
    brandInitial: 'S',
    logoImg: logoScope,
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267433/saloni_q98ayn.mp4',
    label: 'Saloni Furniture Reel',
  },
  {
    brand: 'Scope · სქოუფი',
    brandInitial: 'S',
    logoImg: logoScope,
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267441/scope-partner_wggbwt.mp4',
    label: 'Scope Partner',
  },
  {
    brand: 'Art Gallery Noblesse',
    brandInitial: 'N',
    logoImg: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/noblesse_e6stj6.webp',
    src: 'https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/v1773267923/0209_b1eg8e.mp4',
    label: 'Social Media Reel',
  },
];

/* ── Motion Reel Card with mute/unmute ──────────────────────────── */
const MotionReelCard = ({
  reel,
  idx,
  isDark,
  mt,
  bg2,
  border,
  activeUnmutedIdx,
  onUnmute,
}: {
  reel: typeof motionReels[number];
  idx: number;
  isDark: boolean;
  mt: string;
  bg2: string;
  border: string;
  activeUnmutedIdx: number | null;
  onUnmute: (idx: number | null) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMuted = activeUnmutedIdx !== idx;

  /* sync muted attribute whenever activeUnmutedIdx changes */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    if (isMuted) {
      onUnmute(idx);       // unmute this → auto-mutes all others
    } else {
      onUnmute(null);      // mute this one too
    }
  };

  return (
    <LightBeamCard className={`rounded-xl ${bg2} border ${border} p-3`}>
      <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.04] pointer-events-none" style={{ background: `radial-gradient(circle, #ed592b 0%, transparent 70%)` }} />

      {/* Brand info header */}
      <div className="flex items-center gap-2.5 mb-3 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: idx * 0.06 }}
          className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden text-[10px] tracking-wider ${isDark ? 'bg-[#ed592b]/15 text-[#ed592b]' : 'bg-[#ed592b]/10 text-[#ed592b]'}`}
          style={{ fontFamily: F.heading, fontWeight: 700 }}
        >
          {reel.logoImg ? (
            <img src={reel.logoImg} alt={`${reel.brand} logo`} loading="lazy" width="40" height="40" className="w-full h-full object-cover" />
          ) : (
            reel.brandInitial
          )}
        </motion.div>
        <div className="min-w-0">
          <span className={`text-[11px] block truncate ${isDark ? 'text-white/90' : 'text-zinc-800'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
            {reel.brand}
          </span>
          <span className={`text-[9px] block truncate ${mt}`} style={{ fontFamily: F.body }}>
            {reel.label}
          </span>
        </div>
      </div>

      {/* Video player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`relative rounded-lg overflow-hidden border ${border} group`}
      >
        <video
          ref={videoRef}
          src={reel.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-400 pointer-events-none" />

        {/* Mute / Unmute button */}
        <motion.button
          onClick={toggleMute}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md bg-black/50 border border-white/10 text-white/70 hover:text-white hover:bg-black/70 transition-colors cursor-pointer focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.5)]"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.span key="off" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                <VolumeX size={13} />
              </motion.span>
            ) : (
              <motion.span key="on" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Volume2 size={13} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </LightBeamCard>
  );
};

const SocialMediaMotionContent = ({ isDark }: { isDark: boolean }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const bg2 = isDark ? 'bg-white/[0.03]' : 'bg-zinc-50';
  const [activeUnmutedIdx, setActiveUnmutedIdx] = useState<number | null>(null);

  return (
    <div>
      <FadeIn>
        <div className="flex items-center gap-2.5 mb-1">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-[#ed592b]" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <h1 className="text-[15px] tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 600 }}>Social Media Motion</h1>
        </div>
        <div className="relative h-[1px] mb-5 ml-4">
          <div className={`absolute inset-0 ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-200'}`} />
        </div>
        <p className={`${mt} max-w-xl leading-relaxed mb-8 text-[13px]`} style={{ fontFamily: F.body }}>
          Animated social media content, reels, and motion graphics for brands and campaigns.
        </p>
      </FadeIn>

      {/* All Reels Grid */}
      <StaggerChildren className="columns-2 md:columns-3" style={{ columnGap: '0.75rem' }} stagger={0.06}>
          {motionReels.map((reel, idx) => (
            <StaggerItem key={`${reel.brand}-${idx}`} className="break-inside-avoid mb-3">
              <MotionReelCard reel={reel} idx={idx} isDark={isDark} mt={mt} bg2={bg2} border={border} activeUnmutedIdx={activeUnmutedIdx} onUnmute={setActiveUnmutedIdx} />
            </StaggerItem>
          ))}
      </StaggerChildren>
    </div>
  );
};

/* ══════════════════════���═══════════════════���════════════════════════ */
/*                      UX/UI DESIGN CONTENT                         */
/* ═══════════════════════════════════════════════════════════════════ */
const UxUiContent = ({ isDark }: { isDark: boolean }) => {
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';
  const border = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  return (
    <div>
      <FadeIn>
        <h1 className="text-3xl lg:text-4xl mb-3 tracking-[-0.03em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>
          <TextScramble text="UX/UI Design" delay={0.2} duration={1} style={{ fontFamily: F.heading, fontWeight: 700 }} />
        </h1>
        <p className={`${mt} max-w-xl leading-relaxed mb-12 text-[14px]`} style={{ fontFamily: F.body }}>
          End-to-end product design — from user research to polished interfaces and scalable design systems.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Link to="/projects/aurum">
          <motion.div
            whileHover={{ y: -6 }}
            className={`group rounded-2xl border overflow-hidden ${border} ${isDark ? 'bg-[#0e0f13]' : 'bg-white'} mb-6`}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#080B0F] img-hover-zoom">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <img src={screenLanding} alt="AURUM crypto landing page UX design" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-4 left-4 w-[50%] rounded-lg shadow-2xl shadow-black/50 opacity-25" />
              <img src={screenProfile} alt="AURUM user profile UX design" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-8 right-4 w-[45%] rounded-lg shadow-2xl shadow-black/50 opacity-35" />
              <img src={screenExchange} alt="AURUM exchange dashboard — cryptocurrency trading platform case study" loading="lazy" decoding="async" width="1440" height="900" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] rounded-t-lg shadow-2xl shadow-black/60 group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500" />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-[#ed592b]/20 backdrop-blur-md text-[#ed592b] border border-[#ed592b]/30">Featured</span>
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/50 border border-white/10">2025</span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/40 border border-white/10 flex items-center gap-1.5">
                  <Monitor size={10} /> 196 screens
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl text-white mb-1 tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>AURUM</h3>
                    <p className="text-white/40 text-[13px]" style={{ fontFamily: F.body }}>Crypto Exchange Platform</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#ed592b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:shadow-[0_0_30px_rgba(237,89,43,0.3)]">
                    <ArrowUpRight size={18} className="text-black" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:p-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-1.5">
                {['UX/UI', 'Design System', 'Web & Mobile'].map((t) => (
                  <span key={t} className={`text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-md whitespace-nowrap ${isDark ? 'bg-white/[0.04] text-[#7a7d8a]' : 'bg-zinc-100 text-zinc-400'}`}>{t}</span>
                ))}
              </div>
              <span className="text-[12px] whitespace-nowrap text-[#ed592b]/70 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#ed592b]/15 group-hover:border-[#ed592b]/30 group-hover:bg-[#ed592b]/5 group-hover:text-[#ed592b] transition-all duration-300 w-full sm:w-auto" style={{ fontFamily: F.body, fontWeight: 500 }}>
                View Case Study <ArrowRight size={12} />
              </span>
            </div>
          </motion.div>
        </Link>
      </FadeIn>

      {/* SCHENKER Card */}
      <FadeIn delay={0.2}>
        <Link to="/projects/schenker">
          <motion.div
            whileHover={{ y: -6 }}
            className={`group rounded-2xl border overflow-hidden ${border} ${isDark ? 'bg-[#0e0f13]' : 'bg-white'} mb-6`}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#e8ecd8] img-hover-zoom">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#2a3a0e]/90 via-[#2a3a0e]/20 to-transparent" />
              <img src={schenkerLabels} alt="Schenker logistics label tracking interface" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-4 left-4 w-[50%] rounded-lg shadow-2xl shadow-black/50 opacity-30" />
              <img src={schenkerSettings} alt="Schenker enterprise settings panel" loading="lazy" decoding="async" width="1440" height="900" className="absolute top-8 right-4 w-[45%] rounded-lg shadow-2xl shadow-black/50 opacity-35" />
              <img src={schenkerSendung} alt="Schenker shipment management — enterprise logistics platform case study" loading="lazy" decoding="async" width="1440" height="900" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] rounded-t-lg shadow-2xl shadow-black/60 group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500" />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-[#6B8E23]/20 backdrop-blur-md text-[#8FBC3B] border border-[#6B8E23]/30">Enterprise</span>
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/70 border border-white/15">Desktop</span>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <span className="text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/40 border border-white/10 flex items-center gap-1.5">
                  <Monitor size={10} /> 9+ screens
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl text-white mb-1 tracking-[-0.02em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>SCHENKER</h3>
                    <p className="text-white/50 text-[13px]" style={{ fontFamily: F.body }}>Logistics Platform · Enterprise UX</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#6B8E23] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:shadow-[0_0_30px_rgba(107,142,35,0.3)]">
                    <ArrowUpRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:p-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-1.5">
                {['UX/UI', 'Enterprise', 'Form Systems'].map((t) => (
                  <span key={t} className={`text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-md whitespace-nowrap ${isDark ? 'bg-white/[0.04] text-[#7a7d8a]' : 'bg-zinc-100 text-zinc-400'}`}>{t}</span>
                ))}
              </div>
              <span className="text-[12px] whitespace-nowrap text-[#6B8E23]/70 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#6B8E23]/15 group-hover:border-[#6B8E23]/30 group-hover:bg-[#6B8E23]/5 group-hover:text-[#8FBC3B] transition-all duration-300 w-full sm:w-auto" style={{ fontFamily: F.body, fontWeight: 500 }}>
                View Case Study <ArrowRight size={12} />
              </span>
            </div>
          </motion.div>
        </Link>
      </FadeIn>
    </div>
  );
};

/* ═══��══��═════════════════════════════════���═��════════════════════════ */
/*                         HOME PAGE                                 */
/* ══════��════════════════════════════════════════════════════════════ */
/* Work categories that get their own /work/:category URL */
const WORK_CATEGORIES = new Set(['ux-ui', 'social-media-ads', 'social-media-motion']);

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isContactRoute = location.pathname === '/contact';
  const isServicesRoute = location.pathname === '/services';

  /* Derive activeSection: URL route param > query param > 'home' */
  const [localSection, setLocalSection] = useState(() => {
    if (isContactRoute) return 'contact';
    if (isServicesRoute) return 'services';
    if (category && WORK_CATEGORIES.has(category)) return category;
    const section = searchParams.get('section');
    return section || 'home';
  });

  /* Keep localSection synced with route param changes */
  useEffect(() => {
    if (isContactRoute) {
      setLocalSection('contact');
    } else if (isServicesRoute) {
      setLocalSection('services');
    } else if (category && WORK_CATEGORIES.has(category)) {
      setLocalSection(category);
    } else if (!category) {
      const section = searchParams.get('section');
      if (section && !WORK_CATEGORIES.has(section)) {
        setLocalSection(section);
        setSearchParams({}, { replace: true });
      } else if (!section && localSection !== 'home') {
        setLocalSection('home');
      }
    }
  }, [category, searchParams, isContactRoute, isServicesRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeSection = (category && WORK_CATEGORIES.has(category)) ? category : localSection;

  // Sync active section to global context for bottom bar
  const { setActiveSection: setGlobalSection } = useActiveSection();
  useEffect(() => { setGlobalSection(activeSection); }, [activeSection, setGlobalSection]);

  /* Smart navigation — work categories use URL, others use state */
  const handleSectionChange = useCallback((id: string) => {
    if (WORK_CATEGORIES.has(id)) {
      navigate(`/work/${id}`);
    } else if (id === 'contact') {
      navigate('/contact');
    } else if (id === 'services') {
      navigate('/services');
    } else {
      if (category || isContactRoute || isServicesRoute) {
        navigate('/');
      }
      setLocalSection(id);
    }
  }, [navigate, category, isContactRoute, isServicesRoute]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#f5f5f5] text-zinc-900';
  const { search, pathname } = useLocation();

  /* Read section param from URL on navigation — keyed on stable search string */
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      if (WORK_CATEGORIES.has(section)) {
        navigate(`/work/${section}`, { replace: true });
      } else {
        setLocalSection(section);
        setSearchParams({}, { replace: true });
      }
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Scroll to top whenever the active sidebar section changes —
     useLayoutEffect fires before paint so users never see stale scroll position */
  useLayoutEffect(() => {
    scrollContentToTop('instant');
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return <HomeContent isDark={isDark} onSectionNavigate={handleSectionChange} />;
      case 'services': return <ServicesContent isDark={isDark} />;
      case 'contact': return <ContactContent isDark={isDark} />;
      case 'ux-ui': return <UxUiContent isDark={isDark} />;
      case 'social-media-ads': return <SocialMediaAdsContent isDark={isDark} />;
      case 'social-media-motion': return <SocialMediaMotionContent isDark={isDark} />;
      default: return <HomeContent isDark={isDark} />;
    }
  };

  return (
    <div className="relative" style={{ fontFamily: F.body }}>
      {activeSection === 'contact' ? <ContactSEO />
        : activeSection === 'services' ? <ServicesSEO />
        : activeSection === 'ux-ui' ? <UxUiSEO />
        : activeSection === 'social-media-ads' ? <SocialMediaAdsSEO />
        : activeSection === 'social-media-motion' ? <SocialMediaMotionSEO />
        : <HomeSEO />}

      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main content */}
      <main className="lg:ml-[220px] min-h-screen lg:pt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-5 lg:px-10 py-4 sm:py-5 lg:py-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className={`px-5 lg:px-10 py-8 border-t ${isDark ? 'border-white/[0.03]' : 'border-zinc-200'}`}>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-zinc-300'}`} style={{ fontFamily: F.body }}>
                  Designed and developed by Salome Mosiava
                </span>
                <span className={`text-[10px] ${isDark ? 'text-white/15' : 'text-zinc-250'}`} style={{ fontFamily: F.body }}>
                  © 2026
                </span>
              </div>
            </div>
          </FadeIn>
        </footer>
      </main>

      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 50%; } 100% { background-position: -200% 50%; } }
        .masonry-grid { columns: 2; }
        @media (min-width: 768px) { .masonry-grid { columns: 3; } }
      `}</style>
    </div>
  );
}