import { motion } from 'motion/react';
import { useTheme } from './theme-provider';
import { FadeIn, StaggerChildren, StaggerItem } from './animated-helpers';

const BRAND = {
  headingFont: '"BPG LE Studio 02 Caps", "Space Grotesk", sans-serif',
  bodyFont: '"TBC Contractica", "Inter", sans-serif',
};

const brandColors = [
  { name: 'Primary Gold', hex: '#D59A04', role: 'Primary brand color', cssVar: '--aurum-gold' },
  { name: 'Accent Yellow', hex: '#FFC701', role: 'Highlights & CTAs', cssVar: '--aurum-yellow' },
  { name: 'Dark Background', hex: '#080B0F', role: 'App background', cssVar: '--aurum-dark' },
  { name: 'Surface', hex: '#121318', role: 'Cards & panels', cssVar: '--aurum-surface' },
  { name: 'Light Background', hex: '#F3F3F3', role: 'Light mode base', cssVar: '--aurum-light' },
  { name: 'Neutral', hex: '#9295A6', role: 'Muted text & icons', cssVar: '--aurum-neutral' },
  { name: 'Success', hex: '#10B981', role: 'Positive states', cssVar: '--aurum-success' },
  { name: 'Warning', hex: '#F87171', role: 'Errors & alerts', cssVar: '--aurum-warning' },
];

const typeSystem = [
  { label: 'Display', family: 'BPG LE Studio 02 Caps', fallback: 'Space Grotesk', size: '72px', weight: '500', sample: 'AURUM', use: 'Hero & Page Titles' },
  { label: 'Heading 1', family: 'BPG LE Studio 02 Caps', fallback: 'Space Grotesk', size: '48px', weight: '500', sample: 'Exchange', use: 'Section Headers' },
  { label: 'Heading 2', family: 'BPG LE Studio 02 Caps', fallback: 'Space Grotesk', size: '32px', weight: '500', sample: 'Dashboard', use: 'Sub-sections' },
  { label: 'Body Large', family: 'TBC Contractica', fallback: 'Inter', size: '18px', weight: '400', sample: 'Secure crypto trading made simple', use: 'Lead paragraphs' },
  { label: 'Body', family: 'TBC Contractica', fallback: 'Inter', size: '16px', weight: '400', sample: 'Exchange your assets with confidence', use: 'Paragraphs' },
  { label: 'Caption', family: 'TBC Contractica', fallback: 'Inter', size: '12px', weight: '400', sample: 'LAST UPDATED 2 MIN AGO', use: 'Labels & metadata' },
];

const spacingScale = [
  { name: '4', px: '4px' },
  { name: '8', px: '8px' },
  { name: '12', px: '12px' },
  { name: '16', px: '16px' },
  { name: '24', px: '24px' },
  { name: '32', px: '32px' },
  { name: '48', px: '48px' },
  { name: '64', px: '64px' },
];

const radiusScale = [
  { name: 'sm', value: '6px' },
  { name: 'md', value: '8px' },
  { name: 'lg', value: '12px' },
  { name: 'xl', value: '16px' },
  { name: '2xl', value: '24px' },
  { name: 'full', value: '9999px' },
];

/* ═══════════════════════════════════════════════════════════════════ */
/* Full Design System Section — Awwwards-level showcase               */
/* ═══════════════════════════════════════════════════════════════════ */
export function DesignSystemFull() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mt = isDark ? 'text-[#9295A6]' : 'text-zinc-400';
  const cb = isDark ? 'border-white/[0.06]' : 'border-zinc-200';
  const cardBg = isDark ? 'bg-[#121318]' : 'bg-white';

  return (
    <div className="space-y-24">
      {/* ─── Color Palette ──────────────────────────────────────────── */}
      <div>
        <FadeIn>
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h3 className="text-2xl lg:text-3xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
                Color <span className="text-[#D59A04]">Palette</span>
              </h3>
              <p className={`text-sm ${mt}`}>8 semantic tokens powering the entire interface</p>
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${mt}`}>8 Colors</span>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brandColors.map((c) => (
            <StaggerItem key={c.name}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="group">
                <div
                  className="rounded-2xl h-28 lg:h-36 mb-3 ring-1 ring-white/5 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-current/10 relative overflow-hidden"
                  style={{ backgroundColor: c.hex }}
                >
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-[9px] font-mono opacity-70" style={{ color: c.hex === '#F3F3F3' || c.hex === '#FFC701' ? '#080B0F' : '#fff' }}>{c.hex}</span>
                  </div>
                </div>
                <div className={`text-sm mb-0.5 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.name}</div>
                <div className={`text-[11px] ${mt}`}>{c.role}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Gradient combinations */}
        <FadeIn delay={0.2}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl h-20 bg-gradient-to-r from-[#D59A04] to-[#FFC701] flex items-center justify-center">
              <span className="text-[10px] text-black/70 font-mono uppercase tracking-wider">Primary Gradient</span>
            </div>
            <div className="rounded-2xl h-20 bg-gradient-to-r from-[#080B0F] to-[#121318] flex items-center justify-center border border-white/[0.06]">
              <span className="text-[10px] text-[#9295A6] font-mono uppercase tracking-wider">Surface Gradient</span>
            </div>
            <div className="rounded-2xl h-20 bg-gradient-to-r from-[#10B981] to-[#10B981]/40 flex items-center justify-center">
              <span className="text-[10px] text-black/70 font-mono uppercase tracking-wider">Success Gradient</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ─── Typography ─────────────────────────────────────────────── */}
      <div>
        <FadeIn>
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h3 className="text-2xl lg:text-3xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
                Typo<span className="text-[#D59A04]">graphy</span>
              </h3>
              <p className={`text-sm ${mt}`}>Two typeface families — display and body</p>
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${mt}`}>2 Families</span>
          </div>
        </FadeIn>

        {/* Font family showcase */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className={`p-8 rounded-2xl border ${cb} ${cardBg}`}>
              <div className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-4`}>Display Font</div>
              <div className={`text-4xl lg:text-5xl mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont, lineHeight: 1.1 }}>
                BPG LE Studio<br />02 Caps
              </div>
              <div className={`text-[12px] ${mt} mb-4`}>Georgian display typeface for headings and brand elements</div>
              <div className={`text-lg ${isDark ? 'text-white/30' : 'text-zinc-300'} break-all`} style={{ fontFamily: BRAND.headingFont }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                0123456789
              </div>
            </div>
            <div className={`p-8 rounded-2xl border ${cb} ${cardBg}`}>
              <div className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-4`}>Body Font</div>
              <div className={`text-4xl lg:text-5xl mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.bodyFont, lineHeight: 1.1 }}>
                TBC<br />Contractica
              </div>
              <div className={`text-[12px] ${mt} mb-4`}>Georgian body typeface for readable content and UI labels</div>
              <div className={`text-lg ${isDark ? 'text-white/30' : 'text-zinc-300'} break-all`} style={{ fontFamily: BRAND.bodyFont }}>
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789 !@#$%
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Type scale */}
        <FadeIn delay={0.1}>
          <div className={`rounded-2xl border ${cb} ${cardBg} overflow-hidden`}>
            {typeSystem.map((t, i) => (
              <div key={t.label} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-8 py-5 ${i < typeSystem.length - 1 ? `border-b ${cb}` : ''} group hover:bg-white/[0.02] transition-colors`}>
                <div className="flex items-center gap-4 flex-shrink-0 min-w-[140px]">
                  <span className={`text-[10px] uppercase tracking-wider w-20 ${mt}`}>{t.label}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isDark ? 'bg-[#080B0F] text-[#9295A6]' : 'bg-zinc-100 text-zinc-400'}`}>{t.size}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}
                    style={{
                      fontFamily: `"${t.family}", "${t.fallback}", sans-serif`,
                      fontSize: Math.min(parseInt(t.size), 48) + 'px',
                      fontWeight: Number(t.weight),
                      lineHeight: 1.2,
                    }}
                  >
                    {t.sample}
                  </span>
                </div>
                <span className={`text-[10px] flex-shrink-0 ${mt}`}>{t.use}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ─── Spacing & Radius ───────────────────────────────────────── */}
      <div>
        <FadeIn>
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h3 className="text-2xl lg:text-3xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
                Spacing & <span className="text-[#D59A04]">Radius</span>
              </h3>
              <p className={`text-sm ${mt}`}>Consistent spatial rhythm across all components</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spacing */}
          <FadeIn>
            <div className={`p-6 rounded-2xl border ${cb} ${cardBg}`}>
              <div className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-6`}>Spacing Scale</div>
              <div className="space-y-3">
                {spacingScale.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className={`text-[10px] font-mono w-8 text-right ${mt}`}>{s.px}</span>
                    <div className="flex-1 flex items-center">
                      <div
                        className="h-3 rounded-sm bg-gradient-to-r from-[#D59A04] to-[#FFC701] opacity-60"
                        style={{ width: s.px }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono ${mt}`}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Border Radius */}
          <FadeIn delay={0.1}>
            <div className={`p-6 rounded-2xl border ${cb} ${cardBg}`}>
              <div className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-6`}>Border Radius</div>
              <div className="grid grid-cols-3 gap-4">
                {radiusScale.map((r) => (
                  <div key={r.name} className="text-center">
                    <div
                      className={`w-full aspect-square border-2 border-[#D59A04]/40 mb-2 ${isDark ? 'bg-[#D59A04]/5' : 'bg-amber-50'}`}
                      style={{ borderRadius: r.value }}
                    />
                    <div className={`text-[10px] ${isDark ? 'text-white' : 'text-zinc-900'}`}>{r.name}</div>
                    <div className={`text-[9px] font-mono ${mt}`}>{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ─── Component Inventory ────────────────────────────────────── */}
      <div>
        <FadeIn>
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h3 className="text-2xl lg:text-3xl mb-2" style={{ fontFamily: BRAND.headingFont }}>
                Component <span className="text-[#D59A04]">Library</span>
              </h3>
              <p className={`text-sm ${mt}`}>Reusable building blocks for consistency at scale</p>
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${mt}`}>196 Screens</span>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Buttons', count: '12 variants', desc: 'Primary, secondary, ghost, icon' },
            { name: 'Inputs', count: '8 variants', desc: 'Text, amount, search, select' },
            { name: 'Cards', count: '15 variants', desc: 'Data, asset, transaction, info' },
            { name: 'Modals', count: '6 variants', desc: 'Confirm, alert, QR, form' },
            { name: 'Tables', count: '4 variants', desc: 'Asset list, history, rates' },
            { name: 'Navigation', count: '5 variants', desc: 'Header, tabs, sidebar, bottom' },
            { name: 'Feedback', count: '8 variants', desc: 'Toast, badge, progress, loading' },
            { name: 'Charts', count: '6 variants', desc: 'Line, candle, pie, sparkline' },
          ].map((comp) => (
            <StaggerItem key={comp.name}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`p-5 rounded-xl border ${cb} ${cardBg} group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#D59A04]/10' : 'bg-amber-50'} group-hover:bg-[#D59A04] transition-colors duration-300`}>
                    <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-[#D59A04]' : 'bg-[#D59A04]'} group-hover:bg-black transition-colors`} />
                  </div>
                  <span className={`text-[9px] font-mono ${mt}`}>{comp.count}</span>
                </div>
                <div className={`text-sm mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>{comp.name}</div>
                <div className={`text-[10px] ${mt} leading-relaxed`}>{comp.desc}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>

      {/* ─── Button Samples ─────────────────────────────────────────── */}
      <FadeIn>
        <div className={`p-8 rounded-2xl border ${cb} ${cardBg}`}>
          <div className={`text-[10px] uppercase tracking-[0.2em] ${mt} mb-6`}>Button Styles</div>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D59A04] to-[#FFC701] text-black text-sm">Primary</button>
            <button className={`px-6 py-2.5 rounded-xl border text-sm ${isDark ? 'border-white/10 text-white' : 'border-zinc-300 text-zinc-900'}`}>Secondary</button>
            <button className="px-6 py-2.5 rounded-xl text-sm text-[#D59A04]">Ghost</button>
            <button className="px-6 py-2.5 rounded-xl bg-[#F87171]/10 text-[#F87171] text-sm">Destructive</button>
            <button className="px-6 py-2.5 rounded-xl bg-[#10B981]/10 text-[#10B981] text-sm">Success</button>
            <button className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#121318] border border-white/[0.06]' : 'bg-zinc-100 border border-zinc-200'}`}>
              <span className="text-[#D59A04]">+</span>
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Compact Design System — used in sidebar context                    */
/* ═══════════════════════════════════════════════════════════════════ */
export function DesignSystem() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      <div>
        <h3 className={`text-[10px] uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>
          Color Palette
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {brandColors.map((c) => (
            <div key={c.name}>
              <div className="rounded-lg h-14 mb-2 ring-1 ring-white/5" style={{ backgroundColor: c.hex }} />
              <div className={`text-[10px] ${isDark ? 'text-white' : 'text-zinc-900'}`}>{c.name}</div>
              <div className={`text-[9px] font-mono ${isDark ? 'text-[#9295A6]/60' : 'text-zinc-300'}`}>{c.hex}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-[10px] uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-[#9295A6]' : 'text-zinc-400'}`}>
          Typography
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-[#121318]' : 'bg-zinc-50'}`}>
            <div className={`text-[8px] uppercase tracking-wider mb-1 ${isDark ? 'text-[#9295A6]/50' : 'text-zinc-400'}`}>Headings</div>
            <div className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.headingFont }}>BPG LE Studio</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-[#121318]' : 'bg-zinc-50'}`}>
            <div className={`text-[8px] uppercase tracking-wider mb-1 ${isDark ? 'text-[#9295A6]/50' : 'text-zinc-400'}`}>Body</div>
            <div className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: BRAND.bodyFont }}>TBC Contractica</div>
          </div>
        </div>
      </div>
    </div>
  );
}