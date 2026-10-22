import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';

/* Booking a call: Salome's Cal.com page, opened over the site */
export const CAL_URL = 'https://cal.com/salome-mosiava-dbfaf4/30min';
const EMBED_URL = `${CAL_URL}?embed=true&layout=month_view&theme=light`;

const BookingCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useBooking = () => useContext(BookingCtx);

const pill =
  'inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[14px] leading-none whitespace-nowrap bg-[#f0f0f0] text-[#111] hover:bg-[#e4e4e4] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#111]';

function BookingModal({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
      role="dialog" aria-modal="true" aria-label="Book a 30 minute call"
      onClick={onClose}
      style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />
      <motion.div
        initial={{ y: 16, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1020px] h-[min(760px,92svh)] rounded-xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] border border-[#ececec] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[#f0f0f0]">
          <span className="text-[14px] text-[#111] pl-1">Book a 30 min call</span>
          <div className="flex gap-1">
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={pill}>Open in Cal.com <ArrowUpRight size={13} /></a>
            <button type="button" onClick={onClose} className={pill} aria-label="Close"><X size={14} /> close</button>
          </div>
        </div>
        <div className="relative flex-1">
          {!loaded && <div className="absolute inset-0 flex items-center justify-center text-[14px] text-[#9a9a9a]">Loading calendar…</div>}
          <iframe
            src={EMBED_URL}
            title="Book a call with Salome on Cal.com"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            allow="payment"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <BookingCtx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>{open && <BookingModal onClose={() => setOpen(false)} />}</AnimatePresence>,
        document.body
      )}
    </BookingCtx.Provider>
  );
}

/** Black pill that opens the booking calendar; a plain link without JavaScript */
export function BookButton({ children = 'Book a call', className }: { children?: ReactNode; className: string }) {
  const { open } = useBooking();
  return (
    <a
      href={CAL_URL}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); open(); }}
      className={className}
    >
      {children}
    </a>
  );
}
