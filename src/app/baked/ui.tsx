import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMG } from '../lib/cld';
import { BookButton } from './booking';

/* ── Tokens ───────────────────────────────────────────────────────── */
export const T = {
  font: '"Avenir Next Georgian", "Inter", system-ui, sans-serif',
  display: '"Loos Wide Black", "Avenir Next Georgian", system-ui, sans-serif',
  ink: '#111111',
  muted: '#6f6f6f',
  faint: '#9a9a9a',
  card: '#f2f2f2',
  line: '#e8e8e8',
  accent: '#ff4306',
};

/* ── Pills ────────────────────────────────────────────────────────── */
export const pillCls = (active = false) =>
  `inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[14px] leading-none whitespace-nowrap transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#111] ${
    active ? 'bg-[#111] text-white' : 'bg-[#f0f0f0]/90 text-[#111] hover:bg-[#e4e4e4] backdrop-blur-md'
  }`;

export const darkPillCls =
  'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#111] text-white text-[15px] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-black transition-colors outline-none focus-visible:shadow-[0_0_0_3px_rgba(255,67,6,0.8)]';

export function CtaLink({ to = '/contact', children = 'Contact me', book = false }: { to?: string; children?: ReactNode; book?: boolean }) {
  if (book) return <BookButton className={darkPillCls}>{children}</BookButton>;
  return (
    <Link to={to} className={darkPillCls}>
      {children}
    </Link>
  );
}

/* ── Fade in on scroll ────────────────────────────────────────────── */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={seen || reduce ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Centered page intro, the way the home intro reads ───────────── */
export function PageIntro({ title, children, icon }: { title: string; children?: ReactNode; icon?: ReactNode }) {
  return (
    <header className="px-5 pt-32 pb-16 sm:pt-40 sm:pb-20 flex flex-col items-center text-center">
      {icon && <div className="mb-6">{icon}</div>}
      <h1 className="text-[30px] sm:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#111] max-w-[720px]" style={{ fontFamily: T.display, fontWeight: 900 }}>{title}</h1>
      {children && <div className="mt-5 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[380px]">{children}</div>}
    </header>
  );
}

/* ── Caption under a work tile ────────────────────────────────────── */
export function Caption({ title, sub, tag }: { title: string; sub?: string; tag?: string }) {
  return (
    <div className="pt-2 pb-5 px-0.5 flex items-start justify-between gap-3 text-[14px] leading-[1.4]">
      <div className="min-w-0">
        <div className="text-[#111] truncate">{title}</div>
        {sub && <div className="text-[#6f6f6f]">{sub}</div>}
      </div>
      {tag && <div className="text-[#6f6f6f] whitespace-nowrap flex-shrink-0">{tag}</div>}
    </div>
  );
}

/* ── Image that fades in once loaded ──────────────────────────────── */
export function FadeImg({ src, alt = '', className = '', sizes = 'tileLarge', eager = false, contain = false }: {
  src: string; alt?: string; className?: string; sizes?: 'tile' | 'tileLarge' | 'wide' | 'caseMain'; eager?: boolean; contain?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...IMG[sizes](src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }}
      className={`${className} ${contain ? 'object-contain' : 'object-cover'} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

/* ── Lightbox (light) ─────────────────────────────────────────────── */
export type LightboxItem = { src: string; alt: string; video?: boolean; whiteBg?: boolean };

export function Lightbox({ items, index, onClose, onIndex }: {
  items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void;
}) {
  const open = index !== null;
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index! > 0) onIndex(index! - 1);
      if (e.key === 'ArrowRight' && index! < items.length - 1) onIndex(index! + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, index, items.length, onClose, onIndex]);

  if (typeof document === 'undefined') return null;
  const item = open ? items[index!] : null;
  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={item.alt}
          style={{ fontFamily: T.font }}
        >
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
          <AnimatePresence mode="wait">
            {item.video ? (
              <motion.video
                key={item.src} src={item.src} autoPlay controls playsInline
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[84vh] max-w-[90vw] rounded-lg bg-black shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
              />
            ) : (
              <motion.img
                key={item.src} {...IMG.full(item.src)} alt={item.alt}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative max-h-[84vh] max-w-[90vw] rounded-lg object-contain shadow-[0_30px_80px_rgba(0,0,0,0.2)] ${item.whiteBg ? 'bg-white p-4' : ''}`}
              />
            )}
          </AnimatePresence>
          <button onClick={onClose} aria-label="Close" className={`${pillCls()} absolute top-3 right-3 z-10`}>
            <X size={14} /> close
          </button>
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button aria-label="Previous" disabled={index === 0} onClick={() => onIndex(index! - 1)} className={`${pillCls()} disabled:opacity-40`}><ChevronLeft size={15} /></button>
              <span className="text-[13px] text-[#6f6f6f] tabular-nums px-2">{index! + 1} / {items.length}</span>
              <button aria-label="Next" disabled={index === items.length - 1} onClick={() => onIndex(index! + 1)} className={`${pillCls()} disabled:opacity-40`}><ChevronRight size={15} /></button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Logo strip: grey tiles drifting sideways ─────────────────────── */
export function LogoStrip({ logos, paused }: { logos: { name: string; logo: string }[]; paused: boolean }) {
  const row = [...logos, ...logos];
  return (
    <div className="overflow-hidden py-2" role="list" aria-label="Selected clients">
      <div className="baked-marquee flex w-max gap-2.5" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
        {row.map((c, i) => (
          <div
            key={i}
            role={i < logos.length ? 'listitem' : undefined}
            aria-hidden={i >= logos.length || undefined}
            className="relative h-[120px] w-[230px] sm:h-[136px] sm:w-[250px] flex-shrink-0 rounded-md bg-[#f3f3f3] flex items-center justify-center gap-3"
            style={{ transform: `rotate(${((i * 37) % 7 - 3) * 0.25}deg)` }}
          >
            <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[#c9c9c9]" aria-hidden />
            <img {...IMG.logo(c.logo)} alt="" width="40" height="40" loading="lazy" className="h-10 w-10 rounded-lg object-contain bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" />
            <span className="text-[17px] text-[#111] tracking-[-0.01em]" style={{ fontWeight: 500 }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
