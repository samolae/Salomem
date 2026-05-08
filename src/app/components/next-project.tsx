import { ArrowRight, ArrowUpRight, ArrowLeft, Layers, Video, Image, Home, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { useTheme } from './theme-provider';
import { FadeIn, MagneticWrap, AnimatedDivider } from './animated-helpers';

/* ─── Screen imports ──────────────────────────────────────────────── */
const screenExchange = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041357/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro.webp';
const screenLanding = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774040819/33bde90ba43fe3b089e907b814ef1018193651cd_hptwri.webp';
const schenkerSendung = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041645/1afd387db904f4cec4c15bfa6b7966e601ef294b_towksm.webp';
const schenkerLabels = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041563/78c6f45f9246b9cea5c0520f003d32cb8fb21ff1_kmea60.webp';

/* ─── Ads imports for cross-recommendations ──────────────────────── */
const adsTerminal6 = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1774041033/ae0f296f707bac87ea320800f47aa242e0616131_1_iwntjz.webp';
const adsMardi1 = 'https://res.cloudinary.com/dgfn598qb/image/upload/v1776339520/b62bbc10625805a2bfc4ed4ec0039576272b49ac_1_gwslya.png';

const F = {
  heading: '"Syne", "Space Grotesk", sans-serif',
  body: '"Manrope", "Inter", sans-serif',
  accent: '#ed592b',
};

/* ─── Project data ─────────────────────���─────────────────────── */
const projects = {
  aurum: {
    title: 'AURUM',
    subtitle: 'Crypto Exchange Platform',
    path: '/projects/aurum',
    color: '#D59A04',
    tags: ['UX/UI', 'Design System', 'Web & Mobile'],
    screens: '196 screens',
    bgFrom: '#080B0F',
    bgTo: '#0d0e14',
    images: { main: screenExchange, bg: screenLanding },
  },
  schenker: {
    title: 'SCHENKER',
    subtitle: 'Logistics Platform · Enterprise UX',
    path: '/projects/schenker',
    color: '#6B8E23',
    tags: ['UX/UI', 'Enterprise', 'Form Systems'],
    screens: '9+ screens',
    bgFrom: '#e8ecd8',
    bgTo: '#d4dab8',
    images: { main: schenkerSendung, bg: schenkerLabels },
  },
};

type ProjectKey = keyof typeof projects;

/* ─── Cross-category recommendations ─────────────────────────────── */
const crossRecommendations = [
  {
    title: 'Social Media Ads',
    desc: 'Brand campaigns for Terminal, Mardi, Crystal & more',
    icon: <Image size={14} />,
    section: 'social-media-ads',
    image: adsTerminal6,
    color: '#ed592b',
  },
  {
    title: 'Motion Design',
    desc: 'Animated reels and motion graphics',
    icon: <Video size={14} />,
    section: 'social-media-motion',
    image: adsMardi1,
    color: '#ed592b',
  },
];

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── NEXT PROJECT SECTION ───────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
export function NextProjectRecommendation({ currentProject }: { currentProject: 'aurum' | 'schenker' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  // Get next case study
  const nextKey: ProjectKey = currentProject === 'aurum' ? 'schenker' : 'aurum';
  const next = projects[nextKey];

  return (
    <section className="relative py-20 lg:py-28 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Divider */}
        <AnimatedDivider color={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} />

        <div className="pt-16 lg:pt-20">
          {/* Label */}
          <FadeIn>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#ed592b]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className={`text-[9px] uppercase tracking-[0.25em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                Continue exploring
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h2 className={`text-2xl lg:text-4xl tracking-[-0.03em] mb-10 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
              Next <span style={{ color: next.color }}>Project</span>
            </h2>
          </FadeIn>

          {/* Next Case Study — Large Card */}
          <FadeIn delay={0.1}>
            <Link to={next.path}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`group relative rounded-2xl border overflow-hidden ${cb} ${isDark ? 'bg-[#0a0b0f]' : 'bg-white'}`}
              >
                <div
                  className="relative aspect-[2.2/1] sm:aspect-[2.5/1] overflow-hidden img-hover-zoom"
                  style={{ background: `linear-gradient(135deg, ${next.bgFrom}, ${next.bgTo})` }}
                >
                  {/* Overlay */}
                  <div className={`absolute inset-0 z-10 ${nextKey === 'schenker' ? 'bg-gradient-to-t from-[#1a2a06]/80 via-transparent to-[#1a2a06]/5' : 'bg-gradient-to-t from-black/70 via-transparent to-black/10'}`} />

                  {/* Background screen */}
                  <motion.img
                    src={next.images.bg}
                    alt=""
                    className="absolute top-[6%] left-[4%] w-[40%] rounded-xl shadow-2xl shadow-black/50 opacity-20 group-hover:translate-y-[-4px] transition-transform duration-700"
                  />

                  {/* Main screen */}
                  <motion.img
                    src={next.images.main}
                    alt={next.title}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] rounded-t-xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)] group-hover:-translate-y-3 group-hover:scale-[1.01] transition-all duration-700"
                  />

                  {/* Labels */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span
                      className="text-[8px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full backdrop-blur-xl border"
                      style={{
                        backgroundColor: `${next.color}15`,
                        color: `${next.color}cc`,
                        borderColor: `${next.color}25`,
                      }}
                    >
                      Next Project
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-xl md:text-3xl text-white mb-0.5 tracking-[-0.03em]" style={{ fontFamily: F.heading, fontWeight: 700 }}>
                          {next.title}
                        </h3>
                        <p className="text-white/30 text-[11px] tracking-wide" style={{ fontFamily: F.body }}>
                          {next.subtitle}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{
                          backgroundColor: `${next.color}20`,
                          borderColor: `${next.color}30`,
                        }}
                      >
                        <ArrowUpRight size={16} style={{ color: next.color }} />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex flex-wrap gap-1">
                    {next.tags.map((t) => (
                      <span
                        key={t}
                        className={`text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md whitespace-nowrap ${isDark ? 'bg-white/[0.03] text-white/20' : 'bg-zinc-100 text-zinc-400'}`}
                        style={{ fontFamily: F.body }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-[12px] whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300"
                    style={{
                      color: `${next.color}99`,
                      borderColor: `${next.color}20`,
                      fontFamily: F.body,
                      fontWeight: 500,
                    }}
                  >
                    View Case Study <ArrowRight size={12} />
                  </span>
                </div>
              </motion.div>
            </Link>
          </FadeIn>

          {/* Cross-category recommendations — "Infinite Loop" */}
          <FadeIn delay={0.2}>
            <div className="mt-8">
              <p className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-4`} style={{ fontFamily: F.body, fontWeight: 500 }}>
                Also explore
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {crossRecommendations.map((rec) => (
                  <Link key={rec.section} to={`/work/${rec.section}`}>
                    <motion.div
                      whileHover={{ y: -3, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`group relative rounded-xl border overflow-hidden ${cb} ${isDark ? 'bg-[#121318]/60' : 'bg-white'}`}
                    >
                      {/* Preview image */}
                      <div className="relative h-24 overflow-hidden img-hover-zoom">
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#121318] via-[#121318]/60 to-transparent' : 'bg-gradient-to-t from-white via-white/60 to-transparent'}`} />
                      </div>

                      {/* Content */}
                      <div className="relative px-4 py-3 -mt-6">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${rec.color}15`, color: rec.color }}
                          >
                            {rec.icon}
                          </div>
                          <span
                            className={`text-[12px] ${isDark ? 'text-white/90' : 'text-zinc-800'}`}
                            style={{ fontFamily: F.heading, fontWeight: 600, letterSpacing: '-0.01em' }}
                          >
                            {rec.title}
                          </span>
                        </div>
                        <p className={`text-[10px] ${mt} leading-relaxed pl-[34px]`} style={{ fontFamily: F.body }}>
                          {rec.desc}
                        </p>

                        {/* Hover arrow */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${rec.color}12` }}
                          >
                            <ArrowUpRight size={11} style={{ color: rec.color }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Action buttons */}
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full border text-[12px] group focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${isDark ? 'border-white/[0.08] text-white/60 hover:text-white hover:border-white/[0.15]' : 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'}`}
                  style={{ fontFamily: F.body, fontWeight: 500 }}
                >
                  <ArrowLeft size={13} />
                  Back to Portfolio
                </motion.div>
              </Link>
              <MagneticWrap strength={0.2}>
                <Link to="/contact">
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: '0 4px 24px rgba(237,89,43,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#ed592b] text-white text-[12px] group focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.5),0_0_0_4px_rgba(237,89,43,0.2)]"
                    style={{ fontFamily: F.body, fontWeight: 500 }}
                  >
                    <Mail size={13} />
                    Get in Touch
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              </MagneticWrap>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}