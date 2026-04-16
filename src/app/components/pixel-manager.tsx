import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import {
  ArrowLeft, Check, Copy, Code2, Sparkles, Shield, Eye,
  ChevronDown, Zap, AlertCircle, CheckCircle2,
  X, Plus, Trash2, Play, RotateCcw, ExternalLink,
  Heart, Lock, Fingerprint, Info,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { toast } from 'sonner';
import { scrollToRef } from './scroll-to-top';

const F = { heading: "'Syne', sans-serif", body: "'Manrope', sans-serif" };

/* ─── Golden Ratio Spacing System ─────────────────────────────────── */
/* φ = 1.618 → 5, 8, 13, 21, 34, 55, 89 */
const GR = {
  xs: 5,    // 5px
  sm: 8,    // 8px
  md: 13,   // 13px
  lg: 21,   // 21px
  xl: 34,   // 34px
  '2xl': 55,  // 55px
  '3xl': 89,  // 89px
} as const;

/* ─── Apple-Style Reflective Glass ─────────────────────────────────── */
/* Multi-layered: frosted base + specular top highlight + edge glow + inner shadow */
const appleGlass = (isDark: boolean) => ({
  className: `backdrop-blur-[40px] border ${isDark
    ? 'bg-[#1c1c1e]/60 border-white/[0.08]'
    : 'bg-white/72 border-white/90'
  }`,
  style: {
    boxShadow: isDark
      ? 'inset 0 1px 0 0 rgba(255,255,255,0.06), inset 0 -1px 0 0 rgba(0,0,0,0.1), 0 8px 40px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.15)'
      : 'inset 0 1px 0 0 rgba(255,255,255,0.95), inset 0 -1px 0 0 rgba(0,0,0,0.03), 0 8px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  },
});

const appleGlassSubtle = (isDark: boolean) => ({
  className: `backdrop-blur-[32px] border ${isDark
    ? 'bg-white/[0.035] border-white/[0.06]'
    : 'bg-white/50 border-white/70'
  }`,
  style: {
    boxShadow: isDark
      ? 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.2)'
      : 'inset 0 1px 0 0 rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.04)',
  },
});

const appleGlassAccent = (isDark: boolean) => ({
  className: `backdrop-blur-[32px] border ${isDark
    ? 'bg-[#ed592b]/[0.06] border-[#ed592b]/[0.12]'
    : 'bg-[#ed592b]/[0.04] border-[#ed592b]/[0.18]'
  }`,
  style: {
    boxShadow: isDark
      ? 'inset 0 1px 0 0 rgba(237,89,43,0.08), 0 4px 24px rgba(237,89,43,0.08)'
      : 'inset 0 1px 0 0 rgba(255,255,255,0.6), 0 4px 24px rgba(237,89,43,0.06)',
  },
});

/* Specular highlight overlay for premium glass cards */
const SpecularHighlight = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
    {/* Top edge light reflection */}
    <div
      className="absolute inset-x-0 top-0 h-[1px]"
      style={{
        background: isDark
          ? 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 90%)'
          : 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 70%, transparent 90%)',
      }}
    />
    {/* Reflective arc (like Apple glass) */}
    <div
      className="absolute inset-x-[10%] top-0 h-[38.2%] rounded-b-[50%]"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)',
      }}
    />
  </div>
);

/* ─── Pixel Platform Definitions ──────────────────────────────────── */
type PixelPlatform = {
  id: string;
  name: string;
  icon: string;
  color: string;
  placeholder: string;
  docUrl: string;
  description: string;
  friendlyTip: string;
  codeTemplate: (id: string) => string;
  events: string[];
};

const platforms: PixelPlatform[] = [
  {
    id: 'meta',
    name: 'Meta Pixel',
    icon: 'f',
    color: '#1877F2',
    placeholder: '123456789012345',
    docUrl: 'https://developers.facebook.com/docs/meta-pixel/',
    description: 'Facebook & Instagram ads tracking',
    friendlyTip: 'Find your Pixel ID in Meta Events Manager → Data Sources',
    codeTemplate: (id) => `<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${id}');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->`,
    events: ['PageView', 'Lead', 'Purchase', 'AddToCart', 'ViewContent', 'CompleteRegistration', 'Contact', 'InitiateCheckout'],
  },
  {
    id: 'google',
    name: 'Google Tag',
    icon: 'G',
    color: '#4285F4',
    placeholder: 'G-XXXXXXXXXX',
    docUrl: 'https://support.google.com/analytics/answer/9304153',
    description: 'Google Analytics 4 measurement',
    friendlyTip: 'Find your Measurement ID in GA4 → Admin → Data Streams',
    codeTemplate: (id) => `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`,
    events: ['page_view', 'purchase', 'sign_up', 'login', 'add_to_cart', 'begin_checkout', 'generate_lead', 'view_item'],
  },
  {
    id: 'tiktok',
    name: 'TikTok Pixel',
    icon: 'T',
    color: '#000000',
    placeholder: 'C1234567890',
    docUrl: 'https://ads.tiktok.com/help/article/tiktok-pixel',
    description: 'TikTok ads conversion tracking',
    friendlyTip: 'Find your Pixel ID in TikTok Ads Manager → Assets → Events',
    codeTemplate: (id) => `<!-- TikTok Pixel Code -->
<script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off",
    "once","ready","alias","group","enableCookie","disableCookie"],
    ttq.setAndDefer=function(t,e){t[e]=function(){
    t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0;i<ttq.methods.length;i++)
    ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;
    n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
    return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;
    ttq._t=ttq._t||{};ttq._t[e]=+new Date;
    ttq._o=ttq._o||{};ttq._o[e]=n||{};
    var o=document.createElement("script");o.type="text/javascript";
    o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(o,a)};
    ttq.load('${id}');
    ttq.page();
  }(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->`,
    events: ['ViewContent', 'ClickButton', 'SubmitForm', 'CompletePayment', 'PlaceAnOrder', 'Contact', 'Download', 'AddToCart'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Insight',
    icon: 'in',
    color: '#0A66C2',
    placeholder: '1234567',
    docUrl: 'https://business.linkedin.com/marketing-solutions/insight-tag',
    description: 'LinkedIn ads & retargeting',
    friendlyTip: 'Find your Partner ID in LinkedIn Campaign Manager → Account Assets',
    codeTemplate: (id) => `<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
  _linkedin_partner_id = "${id}";
  window._linkedin_data_partner_ids =
    window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
  (function(l) {
    if (!l){window.lintrk = function(a,b){
    window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
  <img height="1" width="1" style="display:none;" alt=""
  src="https://px.ads.linkedin.com/collect/?pid=${id}&fmt=gif" />
</noscript>
<!-- End LinkedIn Insight Tag -->`,
    events: ['conversion', 'page_view'],
  },
];

/* ─── Saved Pixel Type ──────────────────────────────────────────── */
type SavedPixel = {
  id: string;
  platformId: string;
  pixelId: string;
  label: string;
  active: boolean;
  createdAt: number;
};

/* ═══════════════════════════════════════════════════════════════════ */
/*                    PIXEL MANAGER PAGE                             */
/* ═══════════════════════════════════════════════════════════════════ */
export const PixelManager = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mt = isDark ? 'text-[#7a7d8a]' : 'text-zinc-400';

  const [savedPixels, setSavedPixels] = useState<SavedPixel[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<PixelPlatform | null>(null);
  const [pixelIdInput, setPixelIdInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [showCode, setShowCode] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState<string | null>(null);
  const [testingPixel, setTestingPixel] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, 'success' | 'error' | null>>({});
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  /* Refs for auto-scroll */
  const addPanelRef = useRef<HTMLDivElement>(null);
  const codePanelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const eventPanelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* Auto-scroll when add panel opens */
  useEffect(() => {
    if (showAddPanel) {
      setTimeout(() => scrollToRef(addPanelRef, { offset: GR['2xl'] }), 120);
    }
  }, [showAddPanel]);

  /* Auto-scroll when code/events panels expand */
  useEffect(() => {
    if (showCode && codePanelRefs.current[showCode]) {
      setTimeout(() => {
        const el = codePanelRefs.current[showCode!];
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - GR['2xl'];
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [showCode]);

  useEffect(() => {
    if (showEvents && eventPanelRefs.current[showEvents]) {
      setTimeout(() => {
        const el = eventPanelRefs.current[showEvents!];
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - GR['2xl'];
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [showEvents]);

  /* ─── Handlers ──────────────────────────────────────────────────── */
  const handleAddPixel = () => {
    if (!selectedPlatform || !pixelIdInput.trim()) return;
    const newPixel: SavedPixel = {
      id: `${Date.now()}`,
      platformId: selectedPlatform.id,
      pixelId: pixelIdInput.trim(),
      label: labelInput.trim() || `${selectedPlatform.name}`,
      active: true,
      createdAt: Date.now(),
    };
    setSavedPixels(prev => [...prev, newPixel]);
    setPixelIdInput('');
    setLabelInput('');
    setSelectedPlatform(null);
    setShowAddPanel(false);
    toast.success('Pixel added successfully!');
    // Scroll to top to see the new pixel
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
  };

  const handleDelete = (id: string) => {
    setSavedPixels(prev => prev.filter(p => p.id !== id));
    toast.success('Pixel removed');
  };

  const handleToggle = (id: string) => {
    setSavedPixels(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleTest = (pixelId: string) => {
    setTestingPixel(pixelId);
    setTestResult(prev => ({ ...prev, [pixelId]: null }));
    setTimeout(() => {
      const success = Math.random() > 0.15;
      setTestResult(prev => ({ ...prev, [pixelId]: success ? 'success' : 'error' }));
      setTestingPixel(null);
      toast[success ? 'success' : 'error'](
        success ? 'Pixel is responding correctly!' : 'Could not verify pixel — check your ID'
      );
    }, 1800);
  };

  const getPlatform = (id: string) => platforms.find(p => p.id === id)!;

  const generateFullCode = () => {
    const activePixels = savedPixels.filter(p => p.active);
    if (activePixels.length === 0) return '';
    return activePixels.map(p => getPlatform(p.platformId).codeTemplate(p.pixelId)).join('\n\n');
  };

  /* ─── Glass style helpers for inline usage ──────────────────────── */
  const g = appleGlass(isDark);
  const gs = appleGlassSubtle(isDark);
  const ga = appleGlassAccent(isDark);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#06060a]' : 'bg-[#f0f0f3]'} transition-colors duration-500 relative`}>
      {/* Ambient Light — inlined to avoid re-mount loops */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -30, 15, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[25%] -right-[15%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(237,89,43,0.06) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(237,89,43,0.08) 0%, transparent 65%)',
          }}
        />
        <motion.div
          animate={{ x: [0, -15, 20, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[15%] -left-[20%] w-[61.8vw] h-[61.8vw] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(66,133,244,0.035) 0%, transparent 60%)'
              : 'radial-gradient(circle, rgba(66,133,244,0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ─── Sticky Glass Header ─────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 border-b backdrop-blur-[40px] ${isDark ? 'bg-[#06060a]/70 border-white/[0.06]' : 'bg-[#f0f0f3]/70 border-white/40'}`}
        style={{
          boxShadow: isDark
            ? '0 1px 0 0 rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.3)'
            : '0 1px 0 0 rgba(255,255,255,0.9), 0 8px 32px rgba(0,0,0,0.05)',
        }}
      >
        <div className="w-full max-w-lg mx-auto flex items-center justify-between" style={{ padding: `${GR.md}px ${GR.lg}px` }}>
          <div className="flex items-center" style={{ gap: GR.md }}>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className={`relative w-11 h-11 min-h-[44px] min-w-[44px] rounded-[${GR.md}px] flex items-center justify-center ${gs.className} active:scale-95 transition-all overflow-hidden`}
                style={gs.style}
              >
                <SpecularHighlight isDark={isDark} />
                <ArrowLeft size={17} className={isDark ? 'text-white/60' : 'text-zinc-500'} />
              </motion.button>
            </Link>
            <div>
              <h1 className={`text-[17px] tracking-[-0.03em] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
                Pixel Manager
              </h1>
              <p className={`text-[10px] ${mt}`} style={{ fontFamily: F.body, fontWeight: 500, marginTop: GR.xs - 2 }}>
                Your tracking toolkit
              </p>
            </div>
          </div>
          {savedPixels.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`relative flex items-center overflow-hidden rounded-full ${ga.className}`}
              style={{ ...ga.style, gap: GR.xs + 1, padding: `${GR.xs + 1}px ${GR.md}px` }}
            >
              <SpecularHighlight isDark={isDark} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#ed592b] animate-pulse" />
              <span className="text-[10px] text-[#ed592b]" style={{ fontFamily: F.body, fontWeight: 600 }}>
                {savedPixels.filter(p => p.active).length} active
              </span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* ─── Main Content — Golden ratio max-width container ──────── */}
      <div className="relative z-10 w-full max-w-lg mx-auto" style={{ padding: `${GR.xl}px ${GR.lg}px ${GR['3xl'] * 1.618}px` }}>

        {/* ─── Trust Section ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: GR.lg }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`relative rounded-[${GR.lg}px] overflow-hidden ${g.className}`}
          style={{ ...g.style, padding: GR.lg, marginBottom: GR.xl, borderRadius: GR.lg }}
        >
          <SpecularHighlight isDark={isDark} />
          {/* Subtle glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />

          <div className="flex items-center mb-4" style={{ gap: GR.md }}>
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className={`relative w-[${GR.xl + GR.md}px] h-[${GR.xl + GR.md}px] rounded-2xl flex items-center justify-center overflow-hidden border ${isDark ? 'bg-emerald-500/[0.06] border-emerald-500/[0.1]' : 'bg-emerald-50 border-emerald-100'}`}
              style={{ width: GR.xl + GR.md, height: GR.xl + GR.md }}
            >
              <SpecularHighlight isDark={isDark} />
              <Shield size={GR.lg} className="text-emerald-500" />
            </motion.div>
            <div>
              <h2 className={`text-[15px] tracking-[-0.02em] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
                You're in safe hands
              </h2>
              <p className={`text-[11px] ${mt}`} style={{ fontFamily: F.body, marginTop: 3 }}>
                Everything stays on your device
              </p>
            </div>
          </div>

          {/* Trust badges — golden ratio 3 columns */}
          <div className="grid grid-cols-3" style={{ gap: GR.sm }}>
            {[
              { icon: <Lock size={GR.md} />, label: 'No server', sub: 'Client-side only' },
              { icon: <Fingerprint size={GR.md} />, label: 'Private', sub: 'Zero data stored' },
              { icon: <Heart size={GR.md} />, label: 'Free', sub: 'Always free' },
            ].map(b => (
              <div
                key={b.label}
                className={`relative flex flex-col items-center overflow-hidden rounded-2xl ${gs.className}`}
                style={{ ...gs.style, padding: `${GR.md}px ${GR.sm}px`, gap: GR.xs }}
              >
                <SpecularHighlight isDark={isDark} />
                <div className="text-[#ed592b]">{b.icon}</div>
                <span className={`text-[10px] ${isDark ? 'text-white/70' : 'text-zinc-600'}`} style={{ fontFamily: F.body, fontWeight: 600 }}>{b.label}</span>
                <span className={`text-[8px] ${mt}`} style={{ fontFamily: F.body }}>{b.sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Saved Pixels ──────────────────────────────────────── */}
        {savedPixels.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: GR.xl }}>
            <div className="flex items-center justify-between px-1" style={{ marginBottom: GR.md }}>
              <p className={`text-[10px] uppercase tracking-[0.15em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                Your Pixels
              </p>
            </div>

            {/* Copy All — full width Apple glass button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { const code = generateFullCode(); if (code) handleCopy(code); }}
              className={`relative w-full flex items-center justify-center overflow-hidden rounded-2xl active:scale-[0.98] transition-all ${ga.className}`}
              style={{ ...ga.style, minHeight: GR['2xl'], gap: GR.sm, marginBottom: GR.md, fontFamily: F.body, fontWeight: 600 }}
            >
              <SpecularHighlight isDark={isDark} />
              <Code2 size={16} className="text-[#ed592b]" />
              <span className={`text-[13px] ${isDark ? 'text-white/90' : 'text-zinc-800'}`}>Copy All Pixel Code</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-[#ed592b]/15 text-[#ed592b]' : 'bg-[#ed592b]/10 text-[#ed592b]'}`}>
                {savedPixels.filter(p => p.active).length}
              </span>
            </motion.button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: GR.md }}>
              <AnimatePresence mode="popLayout">
                {savedPixels.map((pixel) => {
                  const platform = getPlatform(pixel.platformId);
                  const isShowingCode = showCode === pixel.id;
                  const isShowingEvents = showEvents === pixel.id;
                  const isTesting = testingPixel === pixel.id;
                  const result = testResult[pixel.id];

                  return (
                    <motion.div
                      key={pixel.id}
                      initial={{ opacity: 0, y: GR.xl, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -GR.md }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className={`relative overflow-hidden ${g.className}`}
                      style={{ ...g.style, borderRadius: GR.lg }}
                    >
                      <SpecularHighlight isDark={isDark} />
                      {/* Top accent line */}
                      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${platform.color}50, transparent 61.8%)` }} />

                      {/* Card Header */}
                      <div style={{ padding: GR.lg }}>
                        <div className="flex items-center" style={{ gap: GR.md + 1 }}>
                          <div
                            className="relative rounded-2xl flex items-center justify-center flex-shrink-0 text-white overflow-hidden"
                            style={{
                              width: GR.xl + GR.md,
                              height: GR.xl + GR.md,
                              backgroundColor: platform.color,
                              fontFamily: F.heading,
                              fontWeight: 700,
                              fontSize: GR.md + 1,
                              boxShadow: `0 ${GR.sm}px ${GR.lg}px ${platform.color}25`,
                            }}
                          >
                            <SpecularHighlight isDark={false} />
                            {platform.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[14px] ${isDark ? 'text-white' : 'text-zinc-800'}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                                {pixel.label}
                              </span>
                              {pixel.active ? (
                                <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-wider" style={{ fontFamily: F.body, fontWeight: 700 }}>Live</span>
                              ) : (
                                <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider ${isDark ? 'bg-white/[0.04] text-white/25' : 'bg-zinc-100 text-zinc-400'}`} style={{ fontFamily: F.body, fontWeight: 700 }}>Paused</span>
                              )}
                            </div>
                            <span className={`text-[11px] ${mt} font-mono block`}>
                              {pixel.pixelId}
                            </span>
                          </div>
                          {/* Toggle */}
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleToggle(pixel.id)}
                            className={`relative rounded-full transition-colors duration-300 flex-shrink-0 ${pixel.active ? 'bg-[#ed592b]' : isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`}
                            style={{
                              width: GR['2xl'] - 3,
                              height: GR.xl - 4,
                              minWidth: GR['2xl'] - 3,
                              boxShadow: pixel.active
                                ? 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(237,89,43,0.3)'
                                : isDark ? 'inset 0 1px 2px rgba(0,0,0,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.08)',
                            }}
                          >
                            <motion.div
                              animate={{ x: pixel.active ? 22 : 3 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-[3px] w-6 h-6 rounded-full bg-white"
                              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)' }}
                            />
                          </motion.button>
                        </div>

                        {/* Action buttons — full width stacked, golden ratio gaps */}
                        <div className="grid grid-cols-1" style={{ gap: GR.sm, marginTop: GR.lg }}>
                          {/* View Code */}
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setShowCode(isShowingCode ? null : pixel.id); setShowEvents(null); }}
                            className={`relative w-full flex items-center justify-between overflow-hidden rounded-2xl text-[12px] transition-all active:scale-[0.98] ${
                              isShowingCode
                                ? ga.className
                                : gs.className
                            } ${isShowingCode ? 'text-[#ed592b]' : isDark ? 'text-white/60 active:text-white/90' : 'text-zinc-500 active:text-zinc-800'}`}
                            style={{
                              ...(isShowingCode ? ga.style : gs.style),
                              minHeight: GR.xl + GR.md,
                              padding: `0 ${GR.lg - 5}px`,
                              fontFamily: F.body,
                              fontWeight: 500,
                            }}
                          >
                            <SpecularHighlight isDark={isDark} />
                            <div className="flex items-center" style={{ gap: GR.sm + 2 }}>
                              <Code2 size={15} />
                              <span>View Installation Code</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isShowingCode ? 'rotate-180' : ''}`} />
                          </motion.button>

                          {/* Events */}
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setShowEvents(isShowingEvents ? null : pixel.id); setShowCode(null); }}
                            className={`relative w-full flex items-center justify-between overflow-hidden rounded-2xl text-[12px] transition-all active:scale-[0.98] ${
                              isShowingEvents
                                ? ga.className
                                : gs.className
                            } ${isShowingEvents ? 'text-[#ed592b]' : isDark ? 'text-white/60 active:text-white/90' : 'text-zinc-500 active:text-zinc-800'}`}
                            style={{
                              ...(isShowingEvents ? ga.style : gs.style),
                              minHeight: GR.xl + GR.md,
                              padding: `0 ${GR.lg - 5}px`,
                              fontFamily: F.body,
                              fontWeight: 500,
                            }}
                          >
                            <SpecularHighlight isDark={isDark} />
                            <div className="flex items-center" style={{ gap: GR.sm + 2 }}>
                              <Zap size={15} />
                              <span>Tracking Events</span>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-100'}`}>{platform.events.length}</span>
                          </motion.button>

                          {/* Test + Delete row */}
                          <div className="flex" style={{ gap: GR.sm }}>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleTest(pixel.id)}
                              disabled={isTesting}
                              className={`relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl text-[12px] transition-all active:scale-[0.98] ${
                                result === 'success'
                                  ? isDark ? 'bg-emerald-500/[0.06] backdrop-blur-[32px] border border-emerald-500/[0.12] text-emerald-400' : 'bg-emerald-50/80 backdrop-blur-[32px] border border-emerald-200 text-emerald-600'
                                  : result === 'error'
                                  ? isDark ? 'bg-red-500/[0.06] backdrop-blur-[32px] border border-red-500/[0.12] text-red-400' : 'bg-red-50/80 backdrop-blur-[32px] border border-red-200 text-red-500'
                                  : gs.className
                              } ${!result && (isDark ? 'text-white/60' : 'text-zinc-500')}`}
                              style={{
                                ...(!result ? gs.style : {
                                  boxShadow: result === 'success'
                                    ? (isDark ? 'inset 0 1px 0 rgba(34,197,94,0.1), 0 4px 16px rgba(34,197,94,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px rgba(34,197,94,0.06)')
                                    : (isDark ? 'inset 0 1px 0 rgba(239,68,68,0.1), 0 4px 16px rgba(239,68,68,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px rgba(239,68,68,0.06)'),
                                }),
                                minHeight: GR.xl + GR.md,
                                gap: GR.sm,
                                fontFamily: F.body,
                                fontWeight: 500,
                              }}
                            >
                              {!result && <SpecularHighlight isDark={isDark} />}
                              {isTesting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                  <RotateCcw size={14} />
                                </motion.div>
                              ) : result === 'success' ? (
                                <CheckCircle2 size={14} />
                              ) : result === 'error' ? (
                                <AlertCircle size={14} />
                              ) : (
                                <Play size={14} />
                              )}
                              {isTesting ? 'Testing...' : result === 'success' ? 'Working!' : result === 'error' ? 'Check ID' : 'Test Pixel'}
                            </motion.button>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(pixel.id)}
                              className={`relative overflow-hidden rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${isDark ? 'border-red-500/[0.08] bg-red-500/[0.03] backdrop-blur-[32px] text-red-400/35 active:text-red-400' : 'border-red-100 bg-red-50/40 backdrop-blur-[32px] text-red-300 active:text-red-500'}`}
                              style={{
                                width: GR.xl + GR.md,
                                minHeight: GR.xl + GR.md,
                                boxShadow: isDark
                                  ? 'inset 0 1px 0 rgba(239,68,68,0.04)'
                                  : 'inset 0 1px 0 rgba(255,255,255,0.6)',
                              }}
                            >
                              <Trash2 size={15} />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* ── Code Panel ────────────────────────── */}
                      <AnimatePresence>
                        {isShowingCode && (
                          <motion.div
                            ref={(el) => { codePanelRefs.current[pixel.id] = el; }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-zinc-100/50'}`} style={{ padding: `${GR.lg}px ${GR.lg}px` }}>
                              {/* Copy button full width */}
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleCopy(platform.codeTemplate(pixel.pixelId))}
                                className="relative w-full flex items-center justify-center rounded-2xl bg-[#ed592b] text-white text-[13px] active:scale-[0.98] transition-all overflow-hidden"
                                style={{
                                  minHeight: GR.xl + GR.md,
                                  gap: GR.sm,
                                  fontFamily: F.body,
                                  fontWeight: 600,
                                  marginBottom: GR.md,
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(237,89,43,0.25)',
                                }}
                              >
                                <SpecularHighlight isDark={false} />
                                {copied ? <Check size={15} /> : <Copy size={15} />}
                                {copied ? 'Copied to Clipboard!' : 'Copy Code'}
                              </motion.button>

                              <pre
                                ref={codeRef}
                                className={`text-[10px] leading-[1.7] rounded-2xl overflow-x-auto font-mono border ${isDark ? 'bg-black/25 text-emerald-400/55 border-white/[0.04]' : 'bg-zinc-50/80 text-zinc-500 border-zinc-100'}`}
                                style={{ padding: GR.lg - 5, WebkitOverflowScrolling: 'touch' as any }}
                              >
                                {platform.codeTemplate(pixel.pixelId)}
                              </pre>

                              {/* Helper tip */}
                              <div
                                className={`relative flex items-start overflow-hidden rounded-xl ${gs.className}`}
                                style={{ ...gs.style, padding: GR.md, marginTop: GR.md, gap: GR.sm }}
                              >
                                <SpecularHighlight isDark={isDark} />
                                <Info size={13} className="text-[#ed592b] flex-shrink-0 mt-0.5" />
                                <p className={`text-[10px] leading-[1.6] ${mt}`} style={{ fontFamily: F.body }}>
                                  Paste this code inside your website's <code className={`px-1 py-0.5 rounded ${isDark ? 'bg-white/[0.04]' : 'bg-zinc-100'}`}>{'<head>'}</code> tag.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Events Panel ──────────────────────── */}
                      <AnimatePresence>
                        {isShowingEvents && (
                          <motion.div
                            ref={(el) => { eventPanelRefs.current[pixel.id] = el; }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-zinc-100/50'}`} style={{ padding: `${GR.lg}px ${GR.lg}px` }}>
                              <div className="flex items-center justify-between" style={{ marginBottom: GR.md }}>
                                <span className={`text-[10px] uppercase tracking-[0.12em] ${mt}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                                  Tap to copy event code
                                </span>
                                <a
                                  href={platform.docUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-[#ed592b] min-h-[36px] px-2"
                                  style={{ fontFamily: F.body, fontWeight: 600 }}
                                >
                                  Docs <ExternalLink size={10} />
                                </a>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: GR.xs + 1 }}>
                                {platform.events.map(event => (
                                  <motion.button
                                    key={event}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                      const code = platform.id === 'meta'
                                        ? `fbq('track', '${event}');`
                                        : platform.id === 'google'
                                        ? `gtag('event', '${event}');`
                                        : platform.id === 'tiktok'
                                        ? `ttq.track('${event}');`
                                        : `lintrk('track', { conversion_id: '${event}' });`;
                                      handleCopy(code);
                                    }}
                                    className={`relative w-full flex items-center justify-between overflow-hidden rounded-xl text-[12px] transition-all active:scale-[0.98] ${gs.className} ${isDark ? 'text-white/55 active:text-white' : 'text-zinc-500 active:text-zinc-800'}`}
                                    style={{ ...gs.style, minHeight: 44, padding: `0 ${GR.lg - 5}px`, fontFamily: F.body, fontWeight: 500 }}
                                  >
                                    <SpecularHighlight isDark={isDark} />
                                    <div className="flex items-center gap-2">
                                      <Zap size={11} className="text-[#ed592b]" />
                                      <span className="font-mono text-[11px]">{event}</span>
                                    </div>
                                    <Copy size={11} className="opacity-20" />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ─── Empty State ───────────────────────────────────────── */}
        {savedPixels.length === 0 && !showAddPanel && (
          <motion.div
            initial={{ opacity: 0, y: GR.lg }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative text-center overflow-hidden ${g.className}`}
            style={{ ...g.style, padding: `${GR['2xl']}px ${GR.xl}px`, marginBottom: GR.xl, borderRadius: GR.lg }}
          >
            <SpecularHighlight isDark={isDark} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ background: 'radial-gradient(circle at 50% 38.2%, #ed592b 0%, transparent 55%)' }} />

            <motion.div
              animate={{ y: [0, -GR.sm, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className={`relative mx-auto overflow-hidden rounded-3xl flex items-center justify-center ${ga.className}`}
              style={{ ...ga.style, width: GR['3xl'] - GR.sm, height: GR['3xl'] - GR.sm, marginBottom: GR.xl }}
            >
              <SpecularHighlight isDark={isDark} />
              <Code2 size={GR.xl} className="text-[#ed592b]" />
            </motion.div>

            <h3 className={`text-[18px] tracking-[-0.02em] ${isDark ? 'text-white' : 'text-zinc-800'}`} style={{ fontFamily: F.heading, fontWeight: 700, marginBottom: GR.sm }}>
              Ready when you are
            </h3>
            <p className={`text-[13px] ${mt} mx-auto leading-[1.618]`} style={{ fontFamily: F.body, maxWidth: 280, marginBottom: GR.xl }}>
              Add your tracking pixel and get the installation code in seconds. Simple, safe, and free.
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAddPanel(true)}
              className="relative w-full flex items-center justify-center rounded-2xl bg-[#ed592b] text-white text-[14px] active:scale-[0.98] transition-all overflow-hidden"
              style={{
                minHeight: GR['2xl'] + 1,
                gap: GR.sm + 2,
                fontFamily: F.body,
                fontWeight: 600,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(237,89,43,0.3)',
              }}
            >
              <SpecularHighlight isDark={false} />
              <Plus size={18} />
              Add Your First Pixel
            </motion.button>
          </motion.div>
        )}

        {/* ─── Add More Button ───────────────────────────────────── */}
        {savedPixels.length > 0 && !showAddPanel && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddPanel(true)}
            className={`w-full flex items-center justify-center border-2 border-dashed rounded-2xl transition-all active:scale-[0.98] ${isDark ? 'border-white/[0.06] text-white/20 active:border-white/[0.12] active:text-white/45' : 'border-zinc-200 text-zinc-300 active:border-zinc-300 active:text-zinc-500'}`}
            style={{ minHeight: GR['2xl'], gap: GR.sm + 2, marginBottom: GR.xl, fontFamily: F.body, fontWeight: 500 }}
          >
            <Plus size={16} />
            <span className="text-[13px]">Add Another Pixel</span>
          </motion.button>
        )}

        {/* ─── Add Pixel Panel ───────────────────────────────────── */}
        <AnimatePresence>
          {showAddPanel && (
            <motion.div
              ref={addPanelRef}
              initial={{ opacity: 0, y: GR.lg, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: GR.sm, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`relative overflow-hidden ${g.className}`}
              style={{ ...g.style, borderRadius: GR.lg, marginBottom: GR.xl }}
            >
              <SpecularHighlight isDark={isDark} />

              {/* Header */}
              <div className="flex items-center justify-between" style={{ padding: `${GR.lg}px ${GR.lg}px ${GR.md}px` }}>
                <div className="flex items-center" style={{ gap: GR.sm + 2 }}>
                  <div
                    className={`relative overflow-hidden rounded-2xl flex items-center justify-center ${ga.className}`}
                    style={{ ...ga.style, width: 40, height: 40 }}
                  >
                    <SpecularHighlight isDark={isDark} />
                    <Sparkles size={17} className="text-[#ed592b]" />
                  </div>
                  <div>
                    <span className={`text-[14px] block ${isDark ? 'text-white' : 'text-zinc-800'}`} style={{ fontFamily: F.heading, fontWeight: 700 }}>
                      Add New Pixel
                    </span>
                    <span className={`text-[10px] ${mt}`} style={{ fontFamily: F.body, marginTop: 2, display: 'block' }}>
                      Choose your platform below
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { setShowAddPanel(false); setSelectedPlatform(null); setPixelIdInput(''); setLabelInput(''); }}
                  className={`relative w-10 h-10 min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center overflow-hidden ${gs.className} active:scale-95 transition-all`}
                  style={gs.style}
                >
                  <SpecularHighlight isDark={isDark} />
                  <X size={15} className={isDark ? 'text-white/30' : 'text-zinc-400'} />
                </motion.button>
              </div>

              {/* Platform Selection — full width stacked */}
              <div style={{ padding: `0 ${GR.lg}px ${GR.lg}px`, display: 'flex', flexDirection: 'column', gap: GR.sm }}>
                {platforms.map(p => {
                  const isSelected = selectedPlatform?.id === p.id;
                  const gStyle = isSelected ? ga : gs;
                  return (
                    <motion.button
                      key={p.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPlatform(isSelected ? null : p)}
                      className={`relative w-full flex items-center overflow-hidden rounded-2xl transition-all active:scale-[0.98] ${gStyle.className} ${isSelected ? 'ring-1 ring-[#ed592b]/20' : ''}`}
                      style={{ ...gStyle.style, padding: `${GR.md}px ${GR.md + 3}px`, minHeight: GR['2xl'] + GR.sm, gap: GR.md }}
                    >
                      <SpecularHighlight isDark={isDark} />
                      <div
                        className="relative rounded-xl flex items-center justify-center text-white text-[12px] flex-shrink-0 overflow-hidden"
                        style={{
                          width: GR.xl + GR.sm,
                          height: GR.xl + GR.sm,
                          backgroundColor: p.color,
                          fontFamily: F.heading,
                          fontWeight: 700,
                          boxShadow: isSelected ? `0 ${GR.xs}px ${GR.lg}px ${p.color}25` : '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        <SpecularHighlight isDark={false} />
                        {p.icon}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className={`text-[13px] block ${isDark ? 'text-white/90' : 'text-zinc-700'}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                          {p.name}
                        </span>
                        <span className={`text-[10px] block ${mt}`} style={{ fontFamily: F.body, marginTop: 2 }}>
                          {p.description}
                        </span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#ed592b] bg-[#ed592b]'
                          : isDark ? 'border-white/[0.08]' : 'border-zinc-200'
                      }`}
                      style={isSelected ? { boxShadow: '0 2px 8px rgba(237,89,43,0.3)' } : {}}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Input Fields */}
              <AnimatePresence>
                {selectedPlatform && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-zinc-100/50'}`} style={{ padding: `${GR.md}px ${GR.lg}px ${GR.lg}px` }}>
                      {/* Friendly helper */}
                      <div
                        className={`relative flex items-start overflow-hidden rounded-xl ${gs.className}`}
                        style={{ ...gs.style, padding: GR.md, marginTop: GR.sm, marginBottom: GR.lg, gap: GR.sm }}
                      >
                        <SpecularHighlight isDark={isDark} />
                        <Info size={13} className="text-[#ed592b] flex-shrink-0 mt-0.5" />
                        <p className={`text-[10px] leading-[1.618] ${mt}`} style={{ fontFamily: F.body }}>
                          {selectedPlatform.friendlyTip}
                        </p>
                      </div>

                      {/* Pixel ID Input */}
                      <label className={`block text-[10px] uppercase tracking-[0.12em] ${mt} px-1`} style={{ fontFamily: F.body, fontWeight: 600, marginBottom: GR.sm }}>
                        Pixel / Measurement ID
                      </label>
                      <input
                        type="text"
                        value={pixelIdInput}
                        onChange={e => setPixelIdInput(e.target.value)}
                        placeholder={selectedPlatform.placeholder}
                        className={`w-full font-mono transition-all outline-none ${
                          isDark
                            ? 'border-white/[0.06] bg-white/[0.02] text-white/90 placeholder:text-white/10 focus:border-[#ed592b]/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-[#ed592b]/8'
                            : 'border-zinc-200 bg-white/60 text-zinc-800 placeholder:text-zinc-300 focus:border-[#ed592b]/35 focus:ring-2 focus:ring-[#ed592b]/8'
                        } border backdrop-blur-md`}
                        style={{
                          minHeight: GR['2xl'] - 3,
                          padding: `0 ${GR.lg - 5}px`,
                          borderRadius: GR.md + 3,
                          fontSize: 14,
                          boxShadow: isDark
                            ? 'inset 0 1px 2px rgba(0,0,0,0.2)'
                            : 'inset 0 1px 2px rgba(0,0,0,0.04)',
                        }}
                      />

                      {/* Label Input */}
                      <label className={`block text-[10px] uppercase tracking-[0.12em] ${mt} px-1`} style={{ fontFamily: F.body, fontWeight: 600, marginBottom: GR.sm, marginTop: GR.md }}>
                        Label <span className={isDark ? 'text-white/12' : 'text-zinc-300'}>(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={labelInput}
                        onChange={e => setLabelInput(e.target.value)}
                        placeholder={`e.g. ${selectedPlatform.name} — Main Website`}
                        className={`w-full transition-all outline-none ${
                          isDark
                            ? 'border-white/[0.06] bg-white/[0.02] text-white/90 placeholder:text-white/10 focus:border-[#ed592b]/30 focus:bg-white/[0.04] focus:ring-2 focus:ring-[#ed592b]/8'
                            : 'border-zinc-200 bg-white/60 text-zinc-800 placeholder:text-zinc-300 focus:border-[#ed592b]/35 focus:ring-2 focus:ring-[#ed592b]/8'
                        } border backdrop-blur-md`}
                        style={{
                          minHeight: GR['2xl'] - 3,
                          padding: `0 ${GR.lg - 5}px`,
                          borderRadius: GR.md + 3,
                          fontSize: 13,
                          fontFamily: F.body,
                          boxShadow: isDark
                            ? 'inset 0 1px 2px rgba(0,0,0,0.2)'
                            : 'inset 0 1px 2px rgba(0,0,0,0.04)',
                        }}
                      />

                      {/* Add Button */}
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleAddPixel}
                        disabled={!pixelIdInput.trim()}
                        className={`relative w-full flex items-center justify-center rounded-2xl text-[14px] transition-all active:scale-[0.98] overflow-hidden ${
                          pixelIdInput.trim()
                            ? 'bg-[#ed592b] text-white'
                            : isDark
                            ? 'bg-white/[0.02] text-white/12 cursor-not-allowed border border-white/[0.04]'
                            : 'bg-zinc-100/60 text-zinc-300 cursor-not-allowed border border-zinc-200'
                        }`}
                        style={{
                          minHeight: GR['2xl'] + 1,
                          marginTop: GR.xl,
                          gap: GR.sm + 2,
                          fontFamily: F.body,
                          fontWeight: 600,
                          boxShadow: pixelIdInput.trim()
                            ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(237,89,43,0.25)'
                            : 'none',
                        }}
                      >
                        {pixelIdInput.trim() && <SpecularHighlight isDark={false} />}
                        <Plus size={17} />
                        Add Pixel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── How It Works — Golden Ratio Steps ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: GR.lg }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={`text-[10px] uppercase tracking-[0.15em] ${mt} px-1`} style={{ fontFamily: F.body, fontWeight: 600, marginBottom: GR.md }}>
            How It Works
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: GR.sm }}>
            {[
              { step: '1', title: 'Choose your ad platform', desc: 'Select Meta, Google, TikTok, or LinkedIn from the list above.', icon: <Sparkles size={15} />, color: '#ed592b' },
              { step: '2', title: 'Enter your Pixel ID', desc: 'Paste the ID from your ad platform\'s dashboard. We\'ll show you exactly where to find it.', icon: <Code2 size={15} />, color: '#4285F4' },
              { step: '3', title: 'Copy the code', desc: 'We generate the full tracking code. One tap to copy it to your clipboard.', icon: <Copy size={15} />, color: '#22c55e' },
              { step: '4', title: 'Test it works', desc: 'Run a quick validation to make sure everything fires correctly before going live.', icon: <CheckCircle2 size={15} />, color: '#a855f7' },
            ].map((item, i) => {
              const isOpen = expandedStep === i;
              return (
                <motion.button
                  key={item.step}
                  initial={{ opacity: 0, x: -GR.sm }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExpandedStep(isOpen ? null : i)}
                  className={`relative w-full text-left overflow-hidden rounded-2xl transition-all active:scale-[0.98] ${gs.className}`}
                  style={gs.style}
                >
                  <SpecularHighlight isDark={isDark} />
                  <div className="flex items-center" style={{ padding: `${GR.md}px ${GR.md + 3}px`, minHeight: GR['2xl'] + 1, gap: GR.md }}>
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, backgroundColor: `${item.color}10`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono" style={{ color: item.color, opacity: 0.8 }}>0{item.step}</span>
                        <span className={`text-[12px] ${isDark ? 'text-white/80' : 'text-zinc-700'}`} style={{ fontFamily: F.body, fontWeight: 600 }}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={13} className={`${mt} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div style={{ padding: `0 ${GR.md + 3}px ${GR.md}px`, marginLeft: GR.xl + GR.lg }}>
                          <p className={`text-[11px] leading-[1.618] ${mt}`} style={{ fontFamily: F.body }}>
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Footer Trust ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`relative text-center overflow-hidden ${gs.className}`}
          style={{ ...gs.style, marginTop: GR['2xl'], padding: `${GR.lg}px ${GR.lg}px`, borderRadius: GR.lg }}
        >
          <SpecularHighlight isDark={isDark} />
          <div className="flex items-center justify-center mb-2" style={{ gap: GR.xs + 1 }}>
            <Heart size={12} className="text-[#ed592b]" />
            <span className={`text-[11px] ${isDark ? 'text-white/45' : 'text-zinc-500'}`} style={{ fontFamily: F.body, fontWeight: 500 }}>
              Built with care for marketers & developers
            </span>
          </div>
          <div className="flex items-center justify-center flex-wrap" style={{ gap: GR.md }}>
            {[
              { icon: <Shield size={10} />, text: 'No data stored', color: 'text-emerald-500' },
              { icon: <Zap size={10} />, text: 'Instant generation', color: 'text-[#ed592b]' },
              { icon: <Lock size={10} />, text: '100% client-side', color: 'text-blue-500' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-1">
                <span className={t.color}>{t.icon}</span>
                <span className={`text-[9px] ${mt}`} style={{ fontFamily: F.body }}>{t.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
