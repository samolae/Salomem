import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Building2, ShieldCheck, ShieldAlert, AlertTriangle,
  ArrowRight, ArrowDown, Check, X, Wifi, WifiOff,
  MapPin, Clock, TrendingUp, FileCheck, Smartphone, Mail,
  ChevronRight, Fingerprint, BadgeCheck, Ban, Globe, Store,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { FadeIn, GlowCard, StaggerChildren, StaggerItem } from './animated-helpers';

const BRAND = {
  headingFont: '"BPG LE Studio 02 Caps", "Space Grotesk", sans-serif',
  bodyFont: '"TBC Contractica", "Inter", sans-serif',
};

/* ─── Flow Node Component ─────────────────────────────────────────── */
const FlowNode = ({
  icon,
  label,
  sublabel,
  status = 'default',
  isDark,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  status?: 'default' | 'success' | 'warning' | 'blocked' | 'active';
  isDark: boolean;
  className?: string;
}) => {
  const statusColors = {
    default: isDark ? 'border-white/[0.06] bg-[#121318]' : 'border-zinc-200 bg-white',
    success: 'border-[#10B981]/30 bg-[#10B981]/5',
    warning: 'border-[#FFC701]/30 bg-[#FFC701]/5',
    blocked: 'border-[#F87171]/30 bg-[#F87171]/5',
    active: 'border-[#D59A04]/40 bg-[#D59A04]/5',
  };
  const iconColors = {
    default: 'text-[#9295A6]',
    success: 'text-[#10B981]',
    warning: 'text-[#FFC701]',
    blocked: 'text-[#F87171]',
    active: 'text-[#D59A04]',
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`px-4 py-3 rounded-xl border ${statusColors[status]} flex items-center gap-3 ${className}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[status]} ${isDark ? 'bg-white/[0.03]' : 'bg-zinc-50'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className={`text-[12px] ${isDark ? 'text-white' : 'text-zinc-900'}`}>{label}</div>
        {sublabel && <div className={`text-[10px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>{sublabel}</div>}
      </div>
    </motion.div>
  );
};

/* ─── Connector Arrow ─────────────────────────────────────────────── */
const FlowArrow = ({ direction = 'right', isDark }: { direction?: 'right' | 'down'; isDark: boolean }) => (
  <div className={`flex items-center justify-center ${direction === 'down' ? 'py-1' : 'px-1'}`}>
    {direction === 'right' ? (
      <ChevronRight size={14} className={isDark ? 'text-[#9295A6]/40' : 'text-zinc-300'} />
    ) : (
      <ArrowDown size={14} className={isDark ? 'text-[#9295A6]/40' : 'text-zinc-300'} />
    )}
  </div>
);

/* ─── Story Card Wrapper ──────────────────────────────────────────── */
const StoryWrapper = ({
  storyNum,
  titleEn,
  titleGe,
  description,
  children,
  isDark,
  decisions,
  screens,
}: {
  storyNum: number;
  titleEn: string;
  titleGe: string;
  description: string;
  children: React.ReactNode;
  isDark: boolean;
  decisions: { title: string; rationale: string }[];
  screens: string[];
}) => {
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const bt = isDark ? 'text-zinc-300' : 'text-zinc-600';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const cardBg = isDark ? 'bg-[#121318]' : 'bg-white';

  return (
    <div className="space-y-8">
      {/* Story Header */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl text-[#D59A04]/20" style={{ fontFamily: BRAND.headingFont }}>
              {String(storyNum).padStart(2, '0')}
            </span>
            <div className="w-6 h-px bg-[#D59A04]/30" />
            <span className={`text-[9px] uppercase tracking-[0.2em] ${mt}`}>UX Story</span>
          </div>
          <h3 className="text-xl lg:text-2xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
            {titleEn}
          </h3>
          <p className="text-[#D59A04]/60 text-sm mb-3" style={{ fontFamily: BRAND.bodyFont }}>
            {titleGe}
          </p>
          <p className={`text-[13px] ${bt} leading-relaxed max-w-xl`}>
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end flex-shrink-0">
          {screens.map((s) => (
            <span key={s} className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md ${isDark ? 'bg-[#D59A04]/5 text-[#D59A04]/70 border border-[#D59A04]/10' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Flow Diagram */}
      <div className={`rounded-2xl border ${cb} ${cardBg} p-4 sm:p-6 lg:p-8`}>
        <div className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-6`}>User Flow</div>
        {children}
      </div>

      {/* UX Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decisions.map((d, i) => (
          <motion.div
            key={d.title}
            whileHover={{ y: -3 }}
            className={`p-5 rounded-xl border ${cb} ${cardBg}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${isDark ? 'bg-[#D59A04]/10 text-[#D59A04]' : 'bg-amber-50 text-amber-600'}`}>
                {i + 1}
              </div>
              <span className={`text-[12px] ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>
                {d.title}
              </span>
            </div>
            <p className={`text-[11px] ${mt} leading-relaxed`}>{d.rationale}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── MAIN UX STORIES SECTION ─────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
export function UXStories() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeStory, setActiveStory] = useState(0);
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  const stories = [
    { id: 0, label: 'Onboarding', tag: 'Story 1' },
    { id: 1, label: 'KYC Gates', tag: 'Story 2' },
    { id: 2, label: 'Exchange Flow', tag: 'Story 3' },
  ];

  return (
    <div className="space-y-12">
      {/* Story Switcher — prominent with step indicators */}
      <FadeIn>
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-1">
            {stories.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center gap-2">
                <div className={`h-1 rounded-full flex-1 transition-all duration-500 ${i <= activeStory ? 'bg-[#D59A04]' : isDark ? 'bg-white/[0.06]' : 'bg-zinc-200'}`} />
              </div>
            ))}
          </div>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {stories.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStory(s.id)}
                className={`flex-1 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border text-left transition-all relative ${
                  activeStory === s.id
                    ? `border-[#D59A04]/40 ${isDark ? 'bg-[#D59A04]/5' : 'bg-amber-50'} shadow-[0_0_20px_rgba(213,154,4,0.08)]`
                    : `${cb} ${isDark ? 'bg-[#121318]/40 hover:bg-[#121318]' : 'bg-white hover:bg-zinc-50'}`
                }`}
              >
                {activeStory === s.id && (
                  <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#D59A04] to-transparent" />
                )}
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
                    activeStory === s.id
                      ? 'bg-[#D59A04] text-black'
                      : isDark ? 'bg-white/[0.04] text-[#9295A6]' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <span className={`text-[9px] uppercase tracking-[0.2em] block mb-0.5 ${activeStory === s.id ? 'text-[#D59A04]' : mt}`}>
                      {s.tag}
                    </span>
                    <span className={`text-[13px] sm:text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Navigation hint */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setActiveStory(Math.max(0, activeStory - 1))}
          disabled={activeStory === 0}
          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
            activeStory === 0
              ? 'opacity-30 cursor-not-allowed'
              : isDark ? 'bg-white/[0.04] text-[#9295A6] hover:bg-white/[0.08]' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
          }`}
        >
          ← Previous
        </button>
        <span className={`text-[10px] ${mt}`}>{activeStory + 1} / {stories.length}</span>
        <button
          onClick={() => setActiveStory(Math.min(stories.length - 1, activeStory + 1))}
          disabled={activeStory === stories.length - 1}
          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
            activeStory === stories.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'bg-[#D59A04]/10 text-[#D59A04] hover:bg-[#D59A04]/20'
          }`}
        >
          Next →
        </button>
      </div>

      {/* Story Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeStory === 0 && <Story1 isDark={isDark} />}
          {activeStory === 1 && <Story2 isDark={isDark} />}
          {activeStory === 2 && <Story3 isDark={isDark} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── STORY 1: Dual-User Onboarding ──────────────────────────────── */
/* ══════════════════════════════════════════════════════════════════ */
function Story1({ isDark }: { isDark: boolean }) {
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';

  return (
    <StoryWrapper
      storyNum={1}
      titleEn="Dual-User Onboarding"
      titleGe="ფიზიკური vs იურიდიული პირი"
      description="Georgian regulation requires different onboarding paths for individual users (ფიზიკური პირი) and legal entities (იურიდიული პირი). The challenge was designing a single entry point that smoothly branches into two distinct verification flows without overwhelming either user type."
      isDark={isDark}
      screens={['Login', 'Registration', 'Verification', 'Profile']}
      decisions={[
        { title: 'Single Entry Point', rationale: 'One registration screen with a clear type selector reduces cognitive load and prevents users from landing on the wrong flow.' },
        { title: 'Progressive Disclosure', rationale: 'Legal entity fields (company name, tax ID, director info) only appear after selecting იურიდიული პირი — keeping the individual flow minimal.' },
        { title: 'Parallel Verification', rationale: 'Both user types reach the same verification screen but with type-specific document requirements, ensuring regulatory compliance without duplicating UI.' },
      ]}
    >
      {/* Flow Diagram */}
      <div className="flex flex-col items-center gap-2">
        {/* Entry */}
        <FlowNode icon={<Smartphone size={14} />} label="Registration" sublabel="Phone + Password" status="active" isDark={isDark} className="w-full max-w-xs" />
        <FlowArrow direction="down" isDark={isDark} />

        {/* Branch selector */}
        <div className={`w-full max-w-sm px-4 py-3 rounded-xl border-2 border-dashed ${isDark ? 'border-[#D59A04]/20' : 'border-amber-200'} text-center`}>
          <span className={`text-[10px] uppercase tracking-wider ${mt}`}>Account Type Selection</span>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[11px] text-[#D59A04]">ფიზიკური პირი</span>
            <span className={`text-[10px] ${mt}`}>/</span>
            <span className="text-[11px] text-[#D59A04]">იურიდიული პირი</span>
          </div>
        </div>
        <FlowArrow direction="down" isDark={isDark} />

        {/* Two branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {/* Individual */}
          <div className="space-y-2">
            <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#10B981]/5 text-[#10B981]' : 'bg-green-50 text-green-600'}`}>
              Individual Path
            </div>
            <FlowNode icon={<User size={14} />} label="Personal Info" sublabel="Name, ID, DOB" status="default" isDark={isDark} />
            <FlowArrow direction="down" isDark={isDark} />
            <FlowNode icon={<Fingerprint size={14} />} label="ID Verification" sublabel="Document upload" status="default" isDark={isDark} />
            <FlowArrow direction="down" isDark={isDark} />
            <FlowNode icon={<Mail size={14} />} label="Contact Verify" sublabel="SMS / Email / Telegram" status="success" isDark={isDark} />
          </div>

          {/* Legal Entity */}
          <div className="space-y-2">
            <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#FFC701]/5 text-[#FFC701]' : 'bg-amber-50 text-amber-600'}`}>
              Legal Entity Path
            </div>
            <FlowNode icon={<Building2 size={14} />} label="Company Info" sublabel="Name, Tax ID, Registration" status="default" isDark={isDark} />
            <FlowArrow direction="down" isDark={isDark} />
            <FlowNode icon={<User size={14} />} label="Director / Rep" sublabel="Authorized person details" status="default" isDark={isDark} />
            <FlowArrow direction="down" isDark={isDark} />
            <FlowNode icon={<FileCheck size={14} />} label="Document Pack" sublabel="Extract, license, power of attorney" status="default" isDark={isDark} />
            <FlowArrow direction="down" isDark={isDark} />
            <FlowNode icon={<Mail size={14} />} label="Contact Verify" sublabel="SMS / Email / Telegram" status="success" isDark={isDark} />
          </div>
        </div>

        <FlowArrow direction="down" isDark={isDark} />

        {/* Merge */}
        <FlowNode icon={<BadgeCheck size={14} />} label="KYC Review & Approval" sublabel="Manual review for legal entities" status="success" isDark={isDark} className="w-full max-w-xs" />
        <FlowArrow direction="down" isDark={isDark} />
        <FlowNode icon={<Check size={14} />} label="Dashboard Access" sublabel="Full platform functionality" status="success" isDark={isDark} className="w-full max-w-xs" />
      </div>
    </StoryWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── STORY 2: KYC-Gated Financial Operations ────────────────────── */
/* ══════════════════════════════════════════════════════════════════ */
function Story2({ isDark }: { isDark: boolean }) {
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  return (
    <StoryWrapper
      storyNum={2}
      titleEn="KYC-Gated Financial Operations"
      titleGe="ვერიფიკაციამდე ოპერაცია blocked"
      description="Financial regulations require identity verification before any transaction. Rather than hiding features from unverified users — which causes confusion — the design shows all features but gates actions with contextual verification prompts, guiding users to complete KYC at the moment of intent."
      isDark={isDark}
      screens={['Profile', 'Exchange', 'Verification']}
      decisions={[
        { title: 'Visible but Gated', rationale: 'All features are visible to unverified users. Tapping a blocked action triggers a KYC prompt — preserving feature discoverability while enforcing compliance.' },
        { title: 'Contextual Motivation', rationale: 'The gate message explains WHY verification is needed for THIS specific action (e.g., "Verify to exchange crypto") — not a generic "complete verification" nag.' },
        { title: 'Tiered Verification', rationale: 'Basic operations (viewing rates) require no KYC. Financial operations (exchange, withdrawal) require Level 1. Large transactions require Level 2 with enhanced due diligence.' },
      ]}
    >
      {/* Flow Diagram */}
      <div className="space-y-6">
        {/* Verification Tiers */}
        <div className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-2`}>Verification Tiers</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { level: 'Tier 0', label: 'Unverified', desc: 'View rates, browse assets, read content', color: 'text-[#9295A6]', bg: isDark ? 'bg-[#121318]' : 'bg-zinc-50', border: cb },
            { level: 'Tier 1', label: 'Basic KYC', desc: 'Exchange, deposit, standard withdrawal', color: 'text-[#FFC701]', bg: isDark ? 'bg-[#FFC701]/5' : 'bg-amber-50', border: 'border-[#FFC701]/20' },
            { level: 'Tier 2', label: 'Enhanced KYC', desc: 'Large transactions, institutional trading', color: 'text-[#10B981]', bg: isDark ? 'bg-[#10B981]/5' : 'bg-green-50', border: 'border-[#10B981]/20' },
          ].map((tier) => (
            <div key={tier.level} className={`p-4 rounded-xl border ${tier.border} ${tier.bg}`}>
              <div className={`text-[10px] uppercase tracking-wider mb-1 ${tier.color}`}>{tier.level}</div>
              <div className={`text-[12px] mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{tier.label}</div>
              <div className={`text-[10px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'} leading-relaxed`}>{tier.desc}</div>
            </div>
          ))}
        </div>

        {/* Blocked State Flow */}
        <div className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-2`}>Blocked Operation Flow</div>
        <div className="flex flex-col items-center gap-2 max-w-lg mx-auto">
          <FlowNode icon={<User size={14} />} label="Unverified User" sublabel="Tier 0 — browsing dashboard" status="default" isDark={isDark} className="w-full" />
          <FlowArrow direction="down" isDark={isDark} />
          <FlowNode icon={<ArrowRight size={14} />} label="Taps 'Exchange Now'" sublabel="Attempts financial operation" status="warning" isDark={isDark} className="w-full" />
          <FlowArrow direction="down" isDark={isDark} />

          {/* Blocked Modal */}
          <div className={`w-full rounded-xl border-2 border-dashed ${isDark ? 'border-[#F87171]/20 bg-[#F87171]/[0.02]' : 'border-red-200 bg-red-50/30'} p-5 text-center`}>
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F87171]/10 flex items-center justify-center">
                <ShieldAlert size={18} className="text-[#F87171]" />
              </div>
            </div>
            <div className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>Verification Required</div>
            <div className={`text-[11px] ${mt} mb-3`}>Complete identity verification to exchange crypto assets</div>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D59A04] to-[#FFC701] text-black text-[10px]">Verify Now</span>
              <span className={`px-3 py-1.5 rounded-lg text-[10px] ${isDark ? 'bg-white/[0.04] text-[#9295A6]' : 'bg-zinc-100 text-zinc-500'}`}>Later</span>
            </div>
          </div>

          <FlowArrow direction="down" isDark={isDark} />

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="space-y-2">
              <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#10B981]/5 text-[#10B981]' : 'bg-green-50 text-green-600'}`}>
                Verify Path
              </div>
              <FlowNode icon={<Fingerprint size={14} />} label="KYC Flow" sublabel="ID + Selfie + Proof" status="active" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<ShieldCheck size={14} />} label="Verified!" sublabel="Returns to exchange" status="success" isDark={isDark} />
            </div>
            <div className="space-y-2">
              <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#F87171]/5 text-[#F87171]' : 'bg-red-50 text-red-500'}`}>
                Dismiss Path
              </div>
              <FlowNode icon={<X size={14} />} label="Dismiss" sublabel="Returns to dashboard" status="blocked" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<Ban size={14} />} label="Still Blocked" sublabel="Badge shows on locked features" status="blocked" isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
    </StoryWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ─── STORY 3: Online / Offline Exchange Flow ────────────────────── */
/* ═══════════════════════════════════════════════════════════════════ */
function Story3({ isDark }: { isDark: boolean }) {
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';

  return (
    <StoryWrapper
      storyNum={3}
      titleEn="Online / Offline Crypto Exchange"
      titleGe="ონლაინ / ოფლაინ კრიპტო გაცვლა"
      description="AURUM supports both online (digital wallet-to-wallet) and offline (in-person at branch locations) crypto exchange. Each channel has distinct risk profiles, confirmation patterns, and order tracking — unified under one consistent exchange interface with contextual adaptation."
      isDark={isDark}
      screens={['Exchange', 'Transfer', 'QR Code', 'Verification']}
      decisions={[
        { title: 'Unified Entry', rationale: 'Both online and offline flows start from the same exchange screen. Channel selection happens after amount entry — so users commit to the "what" before choosing the "how".' },
        { title: 'Risk-Aware UI', rationale: 'Large transactions trigger enhanced verification. The UI shows risk level indicators and may require additional confirmation steps or cooling periods.' },
        { title: 'Real-time Tracking', rationale: 'Online orders show blockchain confirmation progress. Offline orders show appointment details, branch location on map, and time-slot countdown.' },
      ]}
    >
      {/* Flow Diagram */}
      <div className="space-y-6">
        {/* Channel Comparison */}
        <div className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-2`}>Channel Comparison</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className={`p-5 rounded-xl border ${cb} ${isDark ? 'bg-[#121318]' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-[#D59A04]" />
              <span className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>Online Exchange</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: <Wifi size={11} />, text: 'Wallet-to-wallet transfer' },
                { icon: <QrCodeIcon size={11} />, text: 'QR code & address generation' },
                { icon: <TrendingUp size={11} />, text: 'Real-time rate lock (60s)' },
                { icon: <ShieldCheck size={11} />, text: 'Blockchain confirmation tracking' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 text-[11px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                  <span className="text-[#D59A04]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className={`p-5 rounded-xl border ${cb} ${isDark ? 'bg-[#121318]' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Store size={16} className="text-[#D59A04]" />
              <span className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>Offline Exchange</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: <MapPin size={11} />, text: 'Branch location selection' },
                { icon: <Clock size={11} />, text: 'Time-slot appointment booking' },
                { icon: <User size={11} />, text: 'In-person ID verification' },
                { icon: <FileCheck size={11} />, text: 'Cash or bank transfer settlement' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 text-[11px] ${isDark ? 'text-[#9295A6]' : 'text-zinc-500'}`}>
                  <span className="text-[#D59A04]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unified Flow */}
        <div className={`text-[9px] uppercase tracking-[0.2em] ${mt} mb-2`}>Unified Transaction Flow</div>
        <div className="flex flex-col items-center gap-2 max-w-2xl mx-auto">
          <FlowNode icon={<ArrowRight size={14} />} label="Select Currency Pair" sublabel="BTC → GEL, ETH → USD, etc." status="active" isDark={isDark} className="w-full max-w-md" />
          <FlowArrow direction="down" isDark={isDark} />
          <FlowNode icon={<TrendingUp size={14} />} label="Enter Amount + Rate Preview" sublabel="Live rate with 60s lock timer" status="active" isDark={isDark} className="w-full max-w-md" />
          <FlowArrow direction="down" isDark={isDark} />

          {/* Risk Check */}
          <div className={`w-full max-w-md px-4 py-3 rounded-xl border-2 border-dashed ${isDark ? 'border-[#FFC701]/20 bg-[#FFC701]/[0.02]' : 'border-amber-200 bg-amber-50/30'} text-center`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle size={12} className="text-[#FFC701]" />
              <span className={`text-[10px] uppercase tracking-wider text-[#FFC701]`}>Risk Assessment</span>
            </div>
            <div className={`text-[10px] ${mt}`}>Amount threshold check • AML screening • Tier verification</div>
          </div>

          <FlowArrow direction="down" isDark={isDark} />

          {/* Channel Branch */}
          <div className={`w-full max-w-md px-4 py-2 rounded-xl border-2 border-dashed ${isDark ? 'border-[#D59A04]/20' : 'border-amber-200'} text-center`}>
            <span className={`text-[10px] uppercase tracking-wider ${mt}`}>Channel Selection</span>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-[11px] text-[#D59A04] flex items-center gap-1"><Wifi size={10} /> Online</span>
              <span className={`text-[10px] ${mt}`}>or</span>
              <span className="text-[11px] text-[#D59A04] flex items-center gap-1"><WifiOff size={10} /> Offline</span>
            </div>
          </div>
          <FlowArrow direction="down" isDark={isDark} />

          {/* Two Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {/* Online */}
            <div className="space-y-2">
              <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#D59A04]/5 text-[#D59A04]' : 'bg-amber-50 text-amber-600'}`}>
                Online Path
              </div>
              <FlowNode icon={<Smartphone size={14} />} label="Wallet Address" sublabel="QR code generated" status="active" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<Clock size={14} />} label="Awaiting Transfer" sublabel="Blockchain confirmations" status="warning" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<Check size={14} />} label="Complete" sublabel="Funds credited" status="success" isDark={isDark} />
            </div>

            {/* Offline */}
            <div className="space-y-2">
              <div className={`text-center text-[9px] uppercase tracking-[0.2em] py-1 rounded-t-lg ${isDark ? 'bg-[#D59A04]/5 text-[#D59A04]' : 'bg-amber-50 text-amber-600'}`}>
                Offline Path
              </div>
              <FlowNode icon={<MapPin size={14} />} label="Select Branch" sublabel="Map + available slots" status="active" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<Clock size={14} />} label="Book Time Slot" sublabel="Date, time, appointment ID" status="warning" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<User size={14} />} label="In-Person Visit" sublabel="ID check + cash/bank settlement" status="default" isDark={isDark} />
              <FlowArrow direction="down" isDark={isDark} />
              <FlowNode icon={<Check size={14} />} label="Complete" sublabel="Receipt generated" status="success" isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
    </StoryWrapper>
  );
}

/* Small QR icon alias to avoid import conflict */
function QrCodeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
    </svg>
  );
}