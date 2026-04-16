import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from './theme-provider';

/* ═══════════════════════════════════════════════════════════════════ */
/*  CASE STUDY FLOATING SECTION NAV                                  */
/*  Shows scroll progress + section dots on the right side           */
/* ═══════════════════════════════════════════════════════════════════ */

interface Section {
  id: string;
  label: string;
}

interface CaseStudySectionNavProps {
  sections: Section[];
  accentColor: string;
}

export const CaseStudySectionNav = ({ sections, accentColor }: CaseStudySectionNavProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { scrollYProgress } = useScroll({ layoutEffect: false });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  /* Stabilize sections reference — parent passes inline array literal each render */
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);

      const s = sectionsRef.current;
      const viewportCenter = window.innerHeight * 0.4;
      let currentIdx = 0;

      for (let i = s.length - 1; i >= 0; i--) {
        const el = document.getElementById(s[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter) {
            currentIdx = i;
            break;
          }
        }
      }
      setActiveIndex(currentIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // stable — reads from ref

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpanded(false);
    }
  }, []);

  const goNext = useCallback(() => {
    const s = sectionsRef.current;
    setActiveIndex(prev => {
      const next = Math.min(prev + 1, s.length - 1);
      const el = document.getElementById(s[next].id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setExpanded(false); }
      return prev; // scroll handler will update activeIndex
    });
  }, []);

  const goPrev = useCallback(() => {
    const s = sectionsRef.current;
    setActiveIndex(prev => {
      const prevIdx = Math.max(prev - 1, 0);
      const el = document.getElementById(s[prevIdx].id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setExpanded(false); }
      return prev; // scroll handler will update activeIndex
    });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-3 sm:right-5 lg:right-8 z-50 flex flex-col items-center gap-2"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {/* Up arrow */}
          <motion.button
            onClick={goPrev}
            whileTap={{ scale: 0.85 }}
            disabled={activeIndex === 0}
            className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xl transition-all focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
              activeIndex === 0
                ? 'opacity-20 cursor-not-allowed'
                : isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white active:bg-white/[0.15]' : 'bg-black/[0.04] text-zinc-500 hover:bg-black/[0.08] hover:text-zinc-900 active:bg-black/[0.12]'
            }`}
          >
            <ChevronUp size={16} />
          </motion.button>

          {/* Section dots + progress track */}
          <div
            className={`relative rounded-full py-3 px-[6px] backdrop-blur-xl border ${
              isDark ? 'bg-black/60 border-white/[0.06]' : 'bg-white/80 border-zinc-200/60'
            }`}
          >
            {/* Vertical progress track */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[2px] rounded-full ${isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`}>
              <motion.div
                className="w-full rounded-full origin-top"
                style={{ height: '100%', scaleY: progress, backgroundColor: accentColor }}
              />
            </div>

            {/* Dots */}
            <div className="relative flex flex-col items-center gap-[10px]">
              {sections.map((section, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="relative group flex items-center min-w-[44px] min-h-[20px] sm:min-w-[20px] justify-center focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] rounded-full"
                    title={section.label}
                  >
                    {/* Dot */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.7,
                        backgroundColor: isActive ? accentColor : isPast ? accentColor : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                        opacity: isActive ? 1 : isPast ? 0.5 : 0.4,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-[8px] h-[8px] rounded-full relative z-10"
                    />

                    {/* Active ring */}
                    {isActive && (
                      <motion.div
                        layoutId="sectionActiveRing"
                        className="absolute w-[16px] h-[16px] rounded-full border-[1.5px] z-0"
                        style={{ borderColor: accentColor, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Tooltip label — show on hover (desktop) */}
                    <div className={`absolute right-full mr-3 px-2.5 py-1.5 rounded-lg text-[10px] tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block ${
                      isDark ? 'bg-white/[0.1] text-white/80 backdrop-blur-xl' : 'bg-black/[0.06] text-zinc-700 backdrop-blur-xl'
                    }`}>
                      {section.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section counter pill */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.9 }}
            className={`px-2.5 py-1.5 rounded-full text-[10px] tracking-wide backdrop-blur-xl border transition-all min-h-[32px] min-w-[44px] flex items-center justify-center focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
              isDark ? 'bg-black/60 border-white/[0.06] text-white/50' : 'bg-white/80 border-zinc-200/60 text-zinc-400'
            }`}
            style={{ fontFamily: '"Manrope", "Inter", sans-serif' }}
          >
            <span style={{ color: accentColor }}>{activeIndex + 1}</span>
            <span className="mx-[2px]">/</span>
            <span>{sections.length}</span>
          </motion.button>

          {/* Down arrow */}
          <motion.button
            onClick={goNext}
            whileTap={{ scale: 0.85 }}
            disabled={activeIndex === sections.length - 1}
            className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xl transition-all focus-visible:!shadow-[0_0_0_2px_rgba(237,89,43,0.4)] ${
              activeIndex === sections.length - 1
                ? 'opacity-20 cursor-not-allowed'
                : isDark ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.12] hover:text-white active:bg-white/[0.15]' : 'bg-black/[0.04] text-zinc-500 hover:bg-black/[0.08] hover:text-zinc-900 active:bg-black/[0.12]'
            }`}
          >
            <ChevronDown size={16} />
          </motion.button>

          {/* Expanded section list (mobile) */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 bottom-full mb-2 rounded-xl border backdrop-blur-2xl overflow-hidden min-w-[180px] ${
                  isDark ? 'bg-[#121318]/95 border-white/[0.08]' : 'bg-white/95 border-zinc-200'
                }`}
              >
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 text-[12px] flex items-center gap-3 transition-colors min-h-[44px] ${
                      i === activeIndex
                        ? isDark ? 'bg-white/[0.06]' : 'bg-zinc-100'
                        : isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: i === activeIndex ? accentColor : i < activeIndex ? accentColor : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                        opacity: i === activeIndex ? 1 : i < activeIndex ? 0.4 : 0.3,
                      }}
                    />
                    <span className={i === activeIndex ? (isDark ? 'text-white' : 'text-zinc-900') : isDark ? 'text-white/40' : 'text-zinc-400'}>
                      {section.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};