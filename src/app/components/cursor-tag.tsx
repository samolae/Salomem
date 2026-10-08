import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Copy, Maximize2, Volume2, VolumeX, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CursorTag                                                          */
/*  A contextual label that rides along with the native cursor, in the */
/*  spirit of Figma's multiplayer cursors. The system cursor is never  */
/*  hidden, so pointing stays instant and precise everywhere.          */
/*                                                                     */
/*  Opt in on any element:            data-cursor="view"               */
/*  Override the preset text:         data-cursor-label="Copy email"   */
/*  Opt out inside a tagged parent:   data-cursor="none"               */
/*  Links and buttons without data-cursor never show a tag.            */
/* ------------------------------------------------------------------ */

type Preset = { label: string; icon: LucideIcon };

const PRESETS: Record<string, Preset> = {
  view: { label: 'View case', icon: ArrowUpRight },
  explore: { label: 'Explore', icon: ArrowRight },
  expand: { label: 'Expand', icon: Maximize2 },
  close: { label: 'Close', icon: X },
  copy: { label: 'Copy', icon: Copy },
  copied: { label: 'Copied', icon: Check },
  unmute: { label: 'Sound on', icon: Volume2 },
  mute: { label: 'Mute', icon: VolumeX },
};

const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [contenteditable]';
const SELECTOR = `[data-cursor], ${INTERACTIVE}`;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const GAP_X = 16; // clears the system arrow and hand
const GAP_Y = 20;
const NEAR = 8; // gap when the tag flips to the other side of the cursor
const EDGE = 8; // breathing room from the viewport edge
const H = 28;

const ACCENT = '#ed592b';
const INK = '#0a0a0c'; // 6:1 on the accent, readable at 12px
const FONT = '"Manrope", "Inter", sans-serif';
const SHADOW =
  '0 10px 24px -10px rgba(237,89,43,0.65), 0 2px 6px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.2)';

type Tag = { kind: string; label: string };
/** Which corner of the tag sits next to the cursor */
type Corner = 'tl' | 'tr' | 'bl' | 'br';

const POSITION: Record<Corner, CSSProperties> = {
  tl: { left: GAP_X, top: GAP_Y },
  tr: { right: NEAR, top: GAP_Y },
  bl: { left: GAP_X, bottom: NEAR },
  br: { right: NEAR, bottom: NEAR },
};
const RADIUS: Record<Corner, string> = {
  tl: '4px 14px 14px 14px',
  tr: '14px 4px 14px 14px',
  bl: '14px 14px 14px 4px',
  br: '14px 14px 4px 14px',
};
const ORIGIN: Record<Corner, string> = {
  tl: '0% 0%',
  tr: '100% 0%',
  bl: '0% 100%',
  br: '100% 100%',
};

function readTag(node: Element | null): Tag | null {
  const el = node ? node.closest(SELECTOR) : null;
  const kind = el?.getAttribute('data-cursor');
  if (!el || !kind || !Object.prototype.hasOwnProperty.call(PRESETS, kind)) return null;
  return { kind, label: el.getAttribute('data-cursor-label') || PRESETS[kind].label };
}

function useFinePointer() {
  const [fine, setFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE_POINTER).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return fine;
}

/** Mouse and trackpad only. Touch devices never mount the layer. */
export function CursorTag() {
  const fine = useFinePointer();
  return fine ? <CursorTagLayer /> : null;
}

function CursorTagLayer() {
  const prefersReduced = useReducedMotion();
  const reduce = useRef(false);
  reduce.current = !!prefersReduced;

  const [tag, setTag] = useState<Tag | null>(null);
  const [corner, setCorner] = useState<Corner>('tl');
  const [pressed, setPressed] = useState(false);

  // Raw pointer position plus a softly sprung copy the tag rides on
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const sx = useSpring(px, { stiffness: 600, damping: 38, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 600, damping: 38, mass: 0.4 });

  // Tag width springs between labels
  const width = useMotionValue(0);
  const sWidth = useSpring(width, { stiffness: 520, damping: 40, mass: 0.5 });

  const sizerRef = useRef<HTMLSpanElement>(null);
  const s = useRef({
    x: -1,
    y: -1,
    target: null as Element | null,
    hitTest: false,
    key: '',
    visible: false,
    appearing: false,
    corner: 'tl' as Corner,
    w: 96,
    raf: 0,
  }).current;

  // Flip to the other side of the cursor near the viewport edges
  const fitCorner = () => {
    const flipX = s.x + GAP_X + s.w > window.innerWidth - EDGE;
    const flipY = s.y + GAP_Y + H > window.innerHeight - EDGE;
    const next = `${flipY ? 'b' : 't'}${flipX ? 'r' : 'l'}` as Corner;
    if (next !== s.corner) {
      s.corner = next;
      setCorner(next);
    }
  };

  const follow = (jump: boolean) => {
    px.set(s.x);
    py.set(s.y);
    if (jump) {
      sx.jump(s.x);
      sy.jump(s.y);
    }
    fitCorner();
  };

  useEffect(() => {
    const update = () => {
      s.raf = 0;
      let target = s.target;
      if (s.hitTest || !target || !target.isConnected) {
        target = s.x >= 0 ? document.elementFromPoint(s.x, s.y) : null;
        s.target = target;
        s.hitTest = false;
      }
      const next = s.x >= 0 ? readTag(target) : null;
      const key = next ? `${next.kind}|${next.label}` : '';
      if (key === s.key) return;
      s.key = key;
      if (next && !s.visible) {
        // Appear right at the cursor instead of flying in from the last spot
        s.appearing = true;
        follow(true);
      }
      s.visible = !!next;
      setTag(next);
    };
    const schedule = () => {
      if (!s.raf) s.raf = requestAnimationFrame(update);
    };
    // Content can move under a still cursor: scroll, resize, lightbox, state changes
    const rehit = () => {
      s.hitTest = true;
      schedule();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      s.x = e.clientX;
      s.y = e.clientY;
      s.target = e.target instanceof Element ? e.target : null;
      if (s.visible) follow(false);
      schedule();
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      s.x = -1;
      s.y = -1;
      s.target = null;
      schedule();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' && s.visible) setPressed(true);
    };
    const onUp = () => setPressed(false);
    const onBlur = () => {
      s.x = -1;
      s.y = -1;
      s.target = null;
      setPressed(false);
      schedule();
    };

    const observer = new MutationObserver(rehit);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-cursor', 'data-cursor-label'],
    });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('scroll', rehit, { passive: true, capture: true });
    window.addEventListener('resize', rehit, { passive: true });
    window.addEventListener('blur', onBlur);
    document.addEventListener('mouseout', onLeaveWindow);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('scroll', rehit, { capture: true });
      window.removeEventListener('resize', rehit);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mouseout', onLeaveWindow);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
    // Everything inside reads refs and stable motion values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure the new label so the tag can spring to its width
  useLayoutEffect(() => {
    if (!tag || !sizerRef.current) return;
    s.w = sizerRef.current.offsetWidth;
    width.set(s.w);
    if (s.appearing || reduce.current) sWidth.jump(s.w);
    s.appearing = false;
    fitCorner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag?.kind, tag?.label]);

  const Icon = tag ? PRESETS[tag.kind].icon : null;
  const content =
    tag && Icon ? (
      <>
        <Icon size={13} strokeWidth={2.25} aria-hidden />
        <span>{tag.label}</span>
      </>
    ) : null;
  const row = 'absolute left-0 top-0 flex h-7 w-max items-center gap-1.5 whitespace-nowrap pl-2.5 pr-3';

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-0 w-0"
      style={{ x: prefersReduced ? px : sx, y: prefersReduced ? py : sy }}
    >
      <AnimatePresence>
        {tag && (
          <motion.div
            key="cursor-tag"
            className="absolute overflow-hidden"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: pressed && !prefersReduced ? 0.9 : 1 }}
            exit={
              prefersReduced
                ? { opacity: 0, transition: { duration: 0.1 } }
                : { opacity: 0, scale: 0.5, transition: { duration: 0.14, ease: [0.4, 0, 1, 1] } }
            }
            transition={
              prefersReduced ? { duration: 0.12 } : { type: 'spring', stiffness: 560, damping: 30, mass: 0.6 }
            }
            style={{
              ...POSITION[corner],
              height: H,
              width: prefersReduced ? width : sWidth,
              borderRadius: RADIUS[corner],
              transformOrigin: ORIGIN[corner],
              background: ACCENT,
              color: INK,
              boxShadow: SHADOW,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            {/* Invisible copy of the current label, used only for measuring */}
            <span ref={sizerRef} className={`${row} invisible`}>
              {content}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${tag.kind}|${tag.label}`}
                className={row}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -7 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                {content}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
