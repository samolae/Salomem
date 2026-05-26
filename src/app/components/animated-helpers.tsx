import { useRef, useEffect, useState, useCallback, useMemo, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, useAnimationFrame } from 'motion/react';

/* ═══════════════════════════════════════════════════════════════════ */
/*                      FADE IN ON SCROLL                            */
/* ═══════════════════════════════════════════════════════════════════ */
export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  blur = true,
}: {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  blur?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const dirMap = {
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: blur ? 'blur(4px)' : 'blur(0px)', ...dirMap[direction] }}
      animate={isInView ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 } : { opacity: 0, filter: blur ? 'blur(4px)' : 'blur(0px)', ...dirMap[direction] }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*                      STAGGER CHILDREN                             */
/* ═══════════════════════════════════════════════════════════════════ */
export const StaggerChildren = ({
  children,
  className = '',
  stagger = 0.08,
  style,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  style?: React.CSSProperties;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*                      PARALLAX IMAGE                               */
/* ═══════════════════════════════════════════════════════════════════ */
export const ParallaxImage = ({
  src,
  alt,
  speed = 0.3,
  className = '',
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover scale-110"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*                      COUNT UP                                      */
/* ═══════════════════════════════════════════════════════════════════ */
export const CountUp = ({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
      {isInView && (
        <motion.span>
          {prefix}
          <CountAnimated target={target} />
          {suffix}
        </motion.span>
      )}
    </motion.span>
  );
};

function CountAnimated({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={0}
      animate={isInView ? target : 0}
      transition={{ duration: 2, ease: 'easeOut' }}
      onUpdate={(latest) => {
        if (ref.current) {
          const num = latest as number;
          ref.current.textContent = num % 1 !== 0 ? num.toFixed(1) : Math.round(num).toString();
        }
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                      SHINE TEXT                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export const ShineText = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span
    className={`bg-clip-text text-transparent bg-gradient-to-r from-[#FFC701] via-[#D59A04] to-[#FFC701] bg-[length:200%_100%] ${className}`}
    style={{ animation: 'shimmer 3s ease-in-out infinite' }}
  >
    {children}
  </span>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*                      GLOW CARD                                    */
/* ══════���═══════════════════════════════════════════════════════════ */
export const GlowCard = ({
  children,
  className = '',
  isDark = true,
}: {
  children: ReactNode;
  className?: string;
  isDark?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`relative group ${className}`}
  >
    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D59A04]/20 via-[#D59A04]/5 to-[#D59A04]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    <div className={`relative rounded-2xl backdrop-blur-xl overflow-hidden h-full ${
      isDark ? 'bg-[#121318] border border-white/[0.06]' : 'bg-white border border-zinc-200'
    }`}>
      {children}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════ */
/*                      TEXT REVEAL                                  */
/* ════════════════════════════════════════════════════════════════��══ */
export const TextReveal = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             SCROLL-DRIVEN PARALLAX SECTION                        */
/* ═══════════════════════════════════════════════════════════════════ */
export const ParallaxSection = ({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             MAGNETIC BUTTON / ELEMENT                             */
/* ══════════════════════════════════════════════════════════════════ */
export const MagneticWrap = ({
  children,
  className = '',
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             SCROLL PROGRESS INDICATOR                             */
/* ═══════════════════════════════════════════════════════════════════ */
export const ScrollProgress = ({ color = '#ed592b' }: { color?: string }) => {
  const { scrollYProgress } = useScroll({ layoutEffect: false });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[70] origin-left"
      style={{ scaleX, backgroundColor: color }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             HORIZONTAL SCROLL REVEAL                              */
/* ═���═════════════════════════════════════════════════════════════════ */
export const HorizontalReveal = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             SCALE ON SCROLL                                       */
/* ══════════════════════════════════════════════════════════════════ */
export const ScaleOnScroll = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
    layoutEffect: false,
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*             SPLIT TEXT ANIMATION                                  */
/* ═══════════════════════════════════════════════════════════════════ */
export const SplitText = ({
  text,
  className = '',
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: 45 }}
            animate={isInView ? { y: 0, rotateX: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             LINE DRAW DIVIDER                                     */
/* ══════════════════════════════════════════════════════════════════ */
export const AnimatedDivider = ({ color = 'rgba(255,255,255,0.06)', className = '' }: { color?: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-px"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             SMOOTH SECTION WRAPPER                                */
/* ═════════════════════════════════════════════════════════════════ */
export const SmoothSection = ({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.7]);
  const y = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             CURSOR REACTIVE GLOW                                  */
/* ═══════════════════════════════════════════════════════════════════ */
export const CursorGlow = ({
  color = 'rgba(237,89,43,0.06)',
  size = 600,
}: {
  color?: string;
  size?: number;
}) => {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const smoothX = useSpring(x, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [x, y]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background: useTransform(
          [smoothX, smoothY],
          ([cx, cy]: number[]) =>
            `radial-gradient(${size}px circle at ${cx}px ${cy}px, ${color}, transparent 70%)`
        ),
      }}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             FLOATING PARTICLES                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export const FloatingParticles = ({
  count = 30,
  color = 'rgba(237,89,43,0.15)',
  className = '',
}: {
  count?: number;
  color?: string;
  className?: string;
}) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    })), [count]
  );

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-[0] ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: color,
          }}
          animate={{
            y: [0, -80, -30, -100, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [0, 0.8, 0.4, 0.7, 0],
            scale: [0.5, 1, 0.8, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             TEXT SCRAMBLE / DECODE EFFECT                          */
/* ══════════════════════════════════════════════════════════════════ */
export const TextScramble = ({
  text,
  className = '',
  style,
  delay = 0,
  duration = 1.5,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      let iteration = 0;
      const totalFrames = text.length * 3;
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iteration / 3) return text[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        iteration++;
        if (iteration > totalFrames) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, (duration * 1000) / totalFrames);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, text, delay, duration, chars]);

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {displayText}
    </motion.span>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             INFINITE MARQUEE                                      */
/* ═══════════════════════════════════════════════════════════════════ */
export const InfiniteMarquee = ({
  children,
  speed = 30,
  className = '',
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) => {
  const baseX = useMotionValue(0);
  const dir = reverse ? 1 : -1;

  useAnimationFrame((_, delta) => {
    const moveBy = dir * speed * (delta / 1000);
    let newX = baseX.get() + moveBy;
    if (newX <= -50) newX += 50;
    if (newX >= 0) newX -= 50;
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        <div className="flex-shrink-0 flex">{children}</div>
        <div className="flex-shrink-0 flex">{children}</div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*             MORPHING BLOB BACKGROUND                              */
/* ═══════════════════════════════════════════════════════════════════ */
export const MorphingBlob = ({
  color = 'rgba(237,89,43,0.04)',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    style={{
      width: 400,
      height: 400,
      background: color,
      filter: 'blur(80px)',
    }}
    animate={{
      borderRadius: [
        '30% 70% 70% 30% / 30% 30% 70% 70%',
        '50% 50% 30% 70% / 60% 40% 60% 40%',
        '70% 30% 50% 50% / 40% 60% 40% 60%',
        '30% 70% 70% 30% / 30% 30% 70% 70%',
      ],
      scale: [1, 1.1, 0.95, 1],
      rotate: [0, 90, 180, 360],
    }}
    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ═══════════════════════════════════════════════════════════════════ */
/*             ELASTIC BUTTON                                        */
/* ═══════════════════════════════════════════════════════════════════ */
export const ElasticButton = ({
  children,
  className = '',
  onClick,
  href,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) => {
  const Component = href ? motion.a : motion.button;
  return (
    <Component
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.92, y: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </Component>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             SCROLL VELOCITY TEXT                                   */
/* ═══════════════════════════════════════════════════════════════════ */
export const ScrollVelocityText = ({
  text,
  baseVelocity = 2,
  className = '',
}: {
  text: string;
  baseVelocity?: number;
  className?: string;
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll({ layoutEffect: false });
  const scrollVelocity = useSpring(
    useTransform(scrollY, (v) => v),
    { stiffness: 100, damping: 30 }
  );
  const prevScroll = useRef(0);

  useAnimationFrame((_, delta) => {
    const currentScroll = scrollVelocity.get();
    const diff = currentScroll - prevScroll.current;
    prevScroll.current = currentScroll;

    const velocity = Math.abs(diff) * 0.05;
    const direction = baseVelocity < 0 ? -1 : 1;
    const moveBy = direction * (baseVelocity + velocity) * (delta / 1000);

    let newX = baseX.get() + moveBy;
    if (Math.abs(newX) >= 50) newX = 0;
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const repeated = `${text} · `.repeat(8);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="whitespace-nowrap" style={{ x }}>
        <span>{repeated}</span>
        <span>{repeated}</span>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             REVEAL MASK (clip-path reveal)                        */
/* ═════════════════════════════════════════════════════════════════ */
export const RevealMask = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const clipPaths: Record<string, { initial: string; animate: string }> = {
    up: { initial: 'inset(100% 0% 0% 0%)', animate: 'inset(0% 0% 0% 0%)' },
    down: { initial: 'inset(0% 0% 100% 0%)', animate: 'inset(0% 0% 0% 0%)' },
    left: { initial: 'inset(0% 100% 0% 0%)', animate: 'inset(0% 0% 0% 0%)' },
    right: { initial: 'inset(0% 0% 0% 100%)', animate: 'inset(0% 0% 0% 0%)' },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: clipPaths[direction].initial, opacity: 0 }}
      animate={isInView ? { clipPath: clipPaths[direction].animate, opacity: 1 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*             ANIMATED TIMELINE LINE                                */
/* ═══════════════════════════════════════════════════════════════════ */
export const AnimatedLine = ({
  className = '',
  color = '#ed592b',
  vertical = true,
}: {
  className?: string;
  color?: string;
  vertical?: boolean;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.3'],
    layoutEffect: false,
  });
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className={`absolute ${vertical ? 'top-0 left-0 w-[2px] h-full' : 'top-0 left-0 h-[2px] w-full'}`}
        style={{ backgroundColor: `${color}15` }}
      />
      <motion.div
        className={`absolute ${vertical ? 'top-0 left-0 w-[2px]' : 'top-0 left-0 h-[2px]'}`}
        style={{
          backgroundColor: color,
          ...(vertical ? { height } : { width: height }),
          boxShadow: `0 0 12px ${color}40`,
        }}
      />
    </div>
  );
};

/* ══��════════════════════════════════════════════════════════════════ */
/*             HOVER CARD WITH LIGHT BEAM                            */
/* ═══════════════════════════════════════════════════════════════════ */
export const LightBeamCard = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative group overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]: number[]) =>
              `radial-gradient(250px circle at ${x}px ${y}px, rgba(237,89,43,0.08), transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         LIQUID DESIGN SYSTEM — BENTO TILT CARD                    */
/* ═══════════════════════════════════════════════════════════════════ */
export const BentoTiltCard = ({
  children,
  className = '',
  tiltStrength = 8,
  glareOpacity = 0.12,
  springConfig = { stiffness: 300, damping: 20 },
}: {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
  glareOpacity?: number;
  springConfig?: { stiffness: number; damping: number };
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springGlareX = useSpring(glareX, { stiffness: 150, damping: 25 });
  const springGlareY = useSpring(glareY, { stiffness: 150, damping: 25 });
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(ny * -tiltStrength);
    rotateY.set(nx * tiltStrength);
    glareX.set((nx + 0.5) * 100);
    glareY.set((ny + 0.5) * 100);
  }, [rotateX, rotateY, glareX, glareY, tiltStrength]);

  const handleMouseEnter = useCallback(() => { scale.set(1.02); }, [scale]);
  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    scale.set(1);
  }, [rotateX, rotateY, glareX, glareY, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={`relative group ${className}`}
    >
      {children}
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [springGlareX, springGlareY],
            ([gx, gy]: number[]) =>
              `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         LIQUID DESIGN SYSTEM — ORGANIC CURSOR                     */
/* ═══════════════════════════════════════════════════════════════════ */
export const LiquidCursor = ({
  color = '#ed592b',
  size = 28,
  dotSize = 4,
}: {
  color?: string;
  size?: number;
  dotSize?: number;
}) => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  // Outer ring — slow, organic spring
  const springX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.8 });
  // Inner dot — fast, snappy
  const springDotX = useSpring(dotX, { stiffness: 500, damping: 40 });
  const springDotY = useSpring(dotY, { stiffness: 500, damping: 40 });
  // Scale based on velocity
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const springScaleX = useSpring(scaleX, { stiffness: 200, damping: 20 });
  const springScaleY = useSpring(scaleY, { stiffness: 200, damping: 20 });
  const hoverScale = useMotionValue(1);
  const springHoverScale = useSpring(hoverScale, { stiffness: 350, damping: 26, mass: 0.4 });
  const dotOpacity = useMotionValue(1);
  const springDotOpacity = useSpring(dotOpacity, { stiffness: 350, damping: 26, mass: 0.4 });
  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      // Velocity-based squash/stretch
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      const stretch = Math.min(velocity * 0.008, 0.3);
      const angle = Math.atan2(dy, dx);
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      scaleX.set(1 + stretch * cos);
      scaleY.set(1 + stretch * sin);
      prevPos.current = { x: e.clientX, y: e.clientY };
    };
    const resetScale = () => { scaleX.set(1); scaleY.set(1); };

    const onInteractiveEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], [data-cursor]')) {
        hoverScale.set(2.5);
        dotOpacity.set(0);
      }
    };
    const onInteractiveLeave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], [data-cursor]')) {
        hoverScale.set(1);
        dotOpacity.set(1);
      }
    };

    window.addEventListener('mousemove', handler);
    window.addEventListener('mouseup', resetScale);
    window.addEventListener('mouseover', onInteractiveEnter);
    window.addEventListener('mouseout', onInteractiveLeave);

    // Hide native cursor on desktop
    const mq = window.matchMedia('(min-width: 1024px)');
    const applyCursor = (e: MediaQueryListEvent | MediaQueryList) => {
      document.body.style.cursor = e.matches ? 'none' : '';
    };
    applyCursor(mq);
    mq.addEventListener('change', applyCursor);

    return () => {
      window.removeEventListener('mousemove', handler);
      window.removeEventListener('mouseup', resetScale);
      window.removeEventListener('mouseover', onInteractiveEnter);
      window.removeEventListener('mouseout', onInteractiveLeave);
      document.body.style.cursor = '';
      mq.removeEventListener('change', applyCursor);
    };
  }, [x, y, dotX, dotY, scaleX, scaleY, hoverScale, dotOpacity]);

  return (
    <>
      {/* Outer organic ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden lg:block rounded-full border"
        style={{
          width: size,
          height: size,
          x: useTransform(springX, (v) => v - size / 2),
          y: useTransform(springY, (v) => v - size / 2),
          borderColor: `${color}60`,
          scaleX: springScaleX,
          scaleY: springScaleY,
          scale: springHoverScale,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden lg:block rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          x: useTransform(springDotX, (v) => v - dotSize / 2),
          y: useTransform(springDotY, (v) => v - dotSize / 2),
          backgroundColor: color,
          opacity: springDotOpacity,
        }}
      />
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         LIQUID DESIGN SYSTEM — REACTIVE MESH BACKGROUND           */
/* ═══════════════════════════════════════════════════════════════════ */
export const LiquidMeshBackground = ({
  className = '',
}: {
  className?: string;
}) => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 40 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 40 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-[0] ${className}`}
      style={{
        background: useTransform(
          [smoothX, smoothY],
          ([mx, my]: number[]) => {
            const x1 = 20 + mx * 15;
            const y1 = 15 + my * 20;
            const x2 = 75 - mx * 10;
            const y2 = 80 - my * 15;
            return `
              radial-gradient(ellipse at ${x1}% ${y1}%, rgba(237,89,43,0.03) 0%, transparent 50%),
              radial-gradient(ellipse at ${x2}% ${y2}%, rgba(99,102,241,0.02) 0%, transparent 50%),
              radial-gradient(ellipse at ${50 + mx * 8}% ${50 + my * 8}%, rgba(213,154,4,0.015) 0%, transparent 40%)
            `;
          }
        ),
      }}
    />
  );
};

/* ══════════════════════════════════════════════════════════════════ */
/*         LIQUID DESIGN SYSTEM — SPRING COUNTER BADGE               */
/* ═══════════════════════════════════════════════════════════════════ */
export const SpringBadge = ({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, rotate: -12, opacity: 0 }}
      animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
        mass: 0.6,
        delay,
      }}
      whileHover={{
        scale: 1.08,
        rotate: 2,
        transition: { type: 'spring', stiffness: 500, damping: 12 },
      }}
      whileTap={{ scale: 0.92, rotate: -2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         PARALLAX FLOAT — multi-speed floating layers              */
/* ═══════════════════════════════════════════════════════════════════ */
export const ParallaxFloat = ({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  });
  const factor = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [factor * speed * 120, factor * -speed * 120]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={`relative ${className}`}>
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         SCROLL REVEAL SCALE — zoom + fade as you scroll in        */
/* ═══════════════════════════════════════════════════════════════════ */
export const ScrollRevealScale = ({
  children,
  className = '',
  scaleFrom = 0.88,
}: {
  children: ReactNode;
  className?: string;
  scaleFrom?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: scaleFrom, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: scaleFrom, opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ══════════���═══════════════════════════════════════════════════════ */
/*         MAGNETIC LINK — magnetic pull + underline reveal          */
/* ═══════════════════════════════════════════════════════════════════ */
export const MagneticLink = ({
  children,
  className = '',
  strength = 0.35,
  accentColor = '#ed592b',
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  accentColor?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
    scale.set(1.05);
  };

  const reset = () => { x.set(0); y.set(0); scale.set(1); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, scale: springScale }}
      className={`relative group inline-flex ${className}`}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] w-full rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*         MICRO PULSE — subtle breathing animation                  */
/* ═══════════════════════════════════════════════════════════════════ */
export const MicroPulse = ({
  children,
  className = '',
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) => (
  <motion.div
    animate={{
      scale: [1, 1 + 0.04 * intensity, 1],
      opacity: [1, 0.85, 1],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className={className}
  >
    {children}
  </motion.div>
);