import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMG } from '../lib/cld';
import { useI18n } from './i18n';

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
  `inline-flex items-center gap-1.5 h-8 px-2.5 pb-[2px] rounded-md text-[14px] leading-none whitespace-nowrap transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#ff4306] ${
    active ? 'bg-[#d93905] text-white hover:bg-[#c23304]' : 'bg-[#f0f0f0]/90 text-[#111] hover:bg-[#ffe7de] hover:text-[#b52f03] backdrop-blur-md'
  }`;

export const darkPillCls =
  'inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#d93905] text-white text-[15px] whitespace-nowrap shadow-[0_10px_30px_rgba(255,67,6,0.35)] hover:bg-[#c23304] transition-colors outline-none focus-visible:shadow-[0_0_0_3px_rgba(255,67,6,0.8)]';

export function CtaLink({ to = '/contact', children }: { to?: string; children?: ReactNode }) {
  const { tx, to: lp } = useI18n();
  return (
    <Link to={lp(to)} className={darkPillCls} data-cta>
      {children ?? tx('Contact me', 'დამიკავშირდი')}
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
      <h1 className="text-[30px] sm:text-[44px] leading-[1.05] tracking-[-0.01em] text-[#111] max-w-[720px]" style={{ fontFamily: T.display, fontWeight: 900 }}>{title}<span className="text-[#ff4306]">.</span></h1>
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
      {tag && <div className="text-[#d93905] whitespace-nowrap flex-shrink-0">{tag}</div>}
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
export type LightboxItem = { src: string; alt: string; video?: boolean; whiteBg?: boolean; brand?: string; logo?: string };

export function Lightbox({ items, index, onClose, onIndex }: {
  items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const { tx } = useI18n();
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
          {item.brand && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2.5 rounded-lg bg-white/95 pl-1.5 pr-3.5 py-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.10)]" onClick={(e) => e.stopPropagation()}>
              {item.logo && <img {...IMG.logo(item.logo)} alt="" width="36" height="36" className="h-9 w-9 rounded-md object-cover" />}
              <span className="text-[16px] text-[#111]" style={{ fontWeight: 500 }}>{item.brand}</span>
            </div>
          )}
          <button onClick={onClose} aria-label={tx("Close", "დახურვა")} className={`${pillCls()} absolute top-3 right-3 z-10`}>
            <X size={14} /> {tx('close', 'დახურვა')}
          </button>
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button aria-label={tx("Previous", "წინა")} disabled={index === 0} onClick={() => onIndex(index! - 1)} className={`${pillCls()} disabled:opacity-40`}><ChevronLeft size={15} /></button>
              <span className="text-[13px] text-[#6f6f6f] tabular-nums px-2">{index! + 1} / {items.length}</span>
              <button aria-label={tx("Next", "შემდეგი")} disabled={index === items.length - 1} onClick={() => onIndex(index! + 1)} className={`${pillCls()} disabled:opacity-40`}><ChevronRight size={15} /></button>
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
    <div className="overflow-hidden py-2" role="list" aria-label="Clients">
      <div className="baked-marquee flex w-max gap-2.5" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
        {row.map((c, i) => (
          <div
            key={i}
            role={i < logos.length ? 'listitem' : undefined}
            aria-hidden={i >= logos.length || undefined}
            className="relative h-[120px] w-[230px] sm:h-[136px] sm:w-[250px] flex-shrink-0 rounded-md bg-[#f3f3f3] flex items-center justify-center gap-3"
            style={{ transform: `rotate(${((i * 37) % 7 - 3) * 0.25}deg)` }}
          >
            <img {...IMG.logo(c.logo)} alt="" width="40" height="40" loading="lazy" className="h-10 w-10 rounded-lg object-contain bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" />
            <span className="text-[17px] text-[#111] tracking-[-0.01em]" style={{ fontWeight: 500 }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── areuli.design: Salome's own brand, given its own stage ──────── */
export function AreuliBlock({ compact = false }: { compact?: boolean }) {
  const { tx } = useI18n();
  return (
    <a
      href="https://www.instagram.com/areuli.design/"
      target="_blank"
      rel="noopener noreferrer"
      className={`group grid ${compact ? 'grid-cols-[112px_1fr] sm:grid-cols-[150px_1fr]' : 'grid-cols-1 md:grid-cols-2'} overflow-hidden rounded-md bg-[#111] text-white outline-none focus-visible:shadow-[0_0_0_3px_#ff4306]`}
    >
      <div className="relative overflow-hidden">
        <img src="/areuli.jpg" alt="areuli.design" loading="lazy" decoding="async" width="960" height="960"
          className="block w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>
      <div className={`flex flex-col justify-center ${compact ? 'p-5 sm:p-6' : 'p-8 sm:p-14'}`}>
        <div className="text-[13px] text-[#ff8a5c] mb-3">{tx('My brand', 'ჩემი ბრენდი')}</div>
        <div className={`${compact ? 'text-[24px] sm:text-[30px]' : 'text-[36px] sm:text-[56px]'} leading-[0.95] tracking-[-0.01em]`} style={{ fontFamily: T.display, fontWeight: 900 }}>
          areuli<span className="text-[#ff4306]">.</span>design
        </div>
        <p className={`${compact ? 'mt-3 text-[14px]' : 'mt-5 text-[16px]'} leading-[1.5] text-white/70 max-w-[380px]`}>
          {tx('Brand identities. Digital design. Visual experiments.', 'ბრენდის იდენტობები. ციფრული დიზაინი. ვიზუალური ექსპერიმენტები.')}
        </p>
        <span className={`${compact ? 'mt-4' : 'mt-8'} inline-flex w-fit items-center gap-2 h-11 px-5 rounded-full bg-[#d93905] text-white text-[15px] transition-colors group-hover:bg-[#c23304]`}>
          {tx('Follow on Instagram', 'გამოიწერე Instagram-ზე')} ↗
        </span>
      </div>
    </a>
  );
}
