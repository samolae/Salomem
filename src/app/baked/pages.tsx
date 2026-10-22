import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Check, Copy } from 'lucide-react';
import { CaseLink } from '../components/case-transition';
import { IMG } from '../lib/cld';
import { Caption, CtaLink, FadeImg, Lightbox, PageIntro, Reveal, T, pillCls, darkPillCls, type LightboxItem } from './ui';
import { useMotionPause } from './shell';
import { adsBrands, motionReels, screenAurumMainHQ, schenkerSendung, unispaceLogin } from './data';
import { contactLinks, formOptions, processSteps, services, stats, EMAIL } from './content';

const short = (name: string) => name.split(' · ')[0];

/* ══ Social Media Ads ═══════════════════════════════════════════════ */
export function AdsContent() {
  const [brand, setBrand] = useState(-1);
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(() => {
    const list = brand >= 0 ? [adsBrands[brand]] : adsBrands;
    return list.flatMap((b) => b.items.map((it, i) => ({ ...it, brand: b.name, n: i + 1, ai: b.aiContent, whiteBg: b.whiteBg })));
  }, [brand]);
  const lightbox: LightboxItem[] = items.map((v) => ({ src: v.src, alt: `${short(v.brand)} ad ${v.n}`, video: v.type === 'video', whiteBg: v.whiteBg }));

  return (
    <>
      <PageIntro title="Social Media Ads">
        Campaign visuals and ad creatives for {adsBrands.length} brands, from leasing and real estate to food, health and retail.
      </PageIntro>

      <div className="px-1.5 pb-6">
        <div className="flex gap-1 overflow-x-auto sm:flex-wrap sm:justify-center" style={{ scrollbarWidth: 'none' }}>
          <button type="button" onClick={() => setBrand(-1)} aria-pressed={brand === -1} className={pillCls(brand === -1)}>All</button>
          {adsBrands.map((b, i) => (
            <button key={b.name} type="button" onClick={() => setBrand(i)} aria-pressed={brand === i} className={pillCls(brand === i)}>{short(b.name)}</button>
          ))}
        </div>
      </div>

      <section aria-label="Ads" className="px-1.5 columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-1.5" key={brand}>
        {items.map((v, i) => (
          <Reveal key={`${v.brand}-${v.src}`} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left outline-none focus-visible:shadow-[0_0_0_2px_#111] rounded-md" aria-label={`Open ${short(v.brand)} ad ${v.n}`}>
              <div className={`relative overflow-hidden rounded-md ${v.whiteBg ? 'bg-white border border-[#eee]' : 'bg-[#f2f2f2]'}`}>
                {v.type === 'video' ? (
                  <video src={v.src} autoPlay loop muted playsInline className="block w-full h-auto" />
                ) : (
                  <FadeImg src={v.src} sizes="tileLarge" alt="" className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
                )}
              </div>
              <Caption title={short(v.brand)} tag={v.ai ? 'AI content' : String(v.n).padStart(2, '0')} />
            </button>
          </Reveal>
        ))}
      </section>

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

/* ══ Social Media Motion ════════════════════════════════════════════ */
export function MotionContent() {
  const [open, setOpen] = useState<number | null>(null);
  const { paused } = useMotionPause();
  const lightbox: LightboxItem[] = motionReels.map((r) => ({ src: r.src, alt: `${short(r.brand)} reel`, video: true }));

  return (
    <>
      <PageIntro title="Social Media Motion">
        Reels, logo reveals and animated ads. Click any reel to watch it with sound.
      </PageIntro>
      <section aria-label="Reels" className="px-1.5 columns-2 sm:columns-3 lg:columns-4 xl:columns-6 gap-1.5">
        {motionReels.map((r, i) => (
          <Reveal key={r.src} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left outline-none focus-visible:shadow-[0_0_0_2px_#111] rounded-md" aria-label={`Watch ${short(r.brand)} reel with sound`}>
              <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
                <video
                  src={r.src} loop muted playsInline preload="metadata" autoPlay={!paused}
                  ref={(v) => { if (v) { paused ? v.pause() : v.play().catch(() => {}); } }}
                  className="block w-full h-auto"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-white/85 px-2 py-1 text-[12px] text-[#111] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">Play with sound</span>
              </div>
              <Caption title={short(r.brand)} sub={r.label} />
            </button>
          </Reveal>
        ))}
      </section>
      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

/* ══ UX/UI ══════════════════════════════════════════════════════════ */
const CASES = [
  { to: '/projects/aurum', title: 'AURUM', sub: 'Crypto exchange · B2C fintech', tag: '196 screens', img: screenAurumMainHQ, bg: 'linear-gradient(160deg,#16130b,#0b0b0f 70%)' },
  { to: '/projects/schenker', title: 'Schenker', sub: 'Logistics platform · enterprise UX', tag: '9+ screens', img: schenkerSendung, bg: 'linear-gradient(160deg,#e8ecd8,#d4dab8)' },
  { to: '/projects/unispace', title: 'Unispace', sub: 'Student management · multi-role EdTech', tag: 'Web · responsive', img: unispaceLogin, bg: 'linear-gradient(160deg,#dfe6ff,#eef1ff)' },
];

export function UxUiContent() {
  return (
    <>
      <PageIntro title="UX/UI Design">
        End-to-end product design, from user research to polished interfaces and scalable design systems.
      </PageIntro>
      <section aria-label="Case studies" className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
        {CASES.map((c, i) => (
          <Reveal key={c.to}>
            <CaseLink to={c.to} cardId={`ux-${c.title.toLowerCase()}`} className="group block">
              <div className="relative overflow-hidden rounded-md p-[8%]" style={{ background: c.bg }}>
                <img {...IMG.caseMain(c.img)} alt={`${c.title} interface`} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
                  className="block w-full h-auto rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
              </div>
              <Caption title={c.title} sub={c.sub} tag={c.tag} />
            </CaseLink>
          </Reveal>
        ))}
        <Reveal>
          <div className="aspect-[4/3] rounded-md bg-[#f2f2f2] flex flex-col items-center justify-center text-center px-8">
            <p className="text-[15px] leading-[1.5] text-[#111] max-w-[300px]">Have a product that needs a sharper interface or a design system?</p>
            <div className="mt-6"><CtaLink>Contact me</CtaLink></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ══ Services ═══════════════════════════════════════════════════════ */
export function ServicesContent() {
  return (
    <>
      <PageIntro title="Services">
        Four focused engagements, from end-to-end product design to art direction, social and motion. Pick one or combine them.
      </PageIntro>

      <section aria-label="Services" className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {services.map((s) => (
          <Reveal key={s.title}>
            <article className="h-full rounded-md bg-[#f2f2f2] p-6 sm:p-9 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[18px] leading-tight text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.title}</h2>
                <span className="text-[13px] text-[#6f6f6f] whitespace-nowrap">{s.timeline}</span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[420px]">{s.tagline}</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-[#111]">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2"><Check size={14} className="mt-[3px] flex-shrink-0 text-[#9a9a9a]" />{d}</li>
                ))}
              </ul>
              <p className="mt-auto pt-8 text-[13px] text-[#6f6f6f]">{s.outcome}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section aria-labelledby="process-title" className="px-1.5 pt-24">
        <h2 id="process-title" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">How we work together</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {processSteps.map((p) => (
            <Reveal key={p.step}>
              <div className="h-full rounded-md bg-[#f2f2f2] p-6">
                <div className="text-[13px] text-[#9a9a9a] tabular-nums">{p.step}</div>
                <div className="mt-8 text-[15px] text-[#111]" style={{ fontWeight: 500 }}>{p.title}</div>
                <p className="mt-1 text-[14px] leading-[1.45] text-[#6f6f6f]">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Track record" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-md border border-[#ececec] p-6">
              <div className="text-[30px] leading-none text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.num}</div>
              <div className="mt-1 text-[14px] text-[#6f6f6f]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-24 flex flex-col items-center text-center">
        <p className="text-[15px] leading-[1.5] text-[#111] max-w-[340px]" style={{ fontWeight: 500 }}>Tell me about your goals. I reply within 24 hours.</p>
        <div className="mt-8"><CtaLink>Contact me</CtaLink></div>
      </section>
    </>
  );
}

/* ══ Contact ════════════════════════════════════════════════════════ */
const fieldCls = 'w-full rounded-md bg-[#f2f2f2] px-3.5 py-3 text-[15px] text-[#111] placeholder-[#9a9a9a] outline-none border border-transparent focus:border-[#111] transition-colors';

export function ContactContent() {
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copied, setCopied] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New inquiry from ${form.name || 'someone'} — ${form.type || 'Portfolio'}`,
          Name: form.name || '—', Email: form.email || '—', 'Project type': form.type || '—',
          Budget: form.budget || '—', Timeline: form.timeline || '—', Message: form.message || '—',
        }),
      });
    } catch { /* the message may still arrive; show success as before */ }
    setState('sent');
    setForm({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
    setTimeout(() => setState('idle'), 4000);
  };

  const copy = (v: string, label: string) => {
    navigator.clipboard?.writeText(v).then(() => { setCopied(label); setTimeout(() => setCopied(null), 1600); }).catch(() => {});
  };

  const select = (field: 'type' | 'budget' | 'timeline', label: string) => (
    <label className="block">
      <span className="block text-[13px] text-[#6f6f6f] mb-1.5">{label}</span>
      <select value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className={`${fieldCls} appearance-none`}>
        <option value="">Select…</option>
        {formOptions[field].map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <>
      <PageIntro title="Let's work together">
        Tell me about your project, or reach me directly. I reply within 24 hours.
      </PageIntro>

      <section className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 max-w-6xl mx-auto">
        <div className="self-start space-y-1.5">
        <div className="rounded-md bg-[#f2f2f2] p-3 sm:p-4">
          <ul>
            {contactLinks.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 rounded-md px-3 py-3.5 hover:bg-[#e8e8e8] transition-colors">
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="min-w-0 flex-1 text-[15px] outline-none focus-visible:underline flex flex-col sm:flex-row sm:gap-3">
                  <span className="text-[#6f6f6f]">{c.label}</span>
                  <span className="text-[#111] truncate">{c.value}</span>
                </a>
                {c.copy ? (
                  <button type="button" onClick={() => copy(c.value, c.label)} className={pillCls()} aria-label={`Copy ${c.label.toLowerCase()}`}>
                    {copied === c.label ? <Check size={13} /> : <Copy size={13} />}
                    {copied === c.label ? 'copied' : 'copy'}
                  </button>
                ) : <span className="text-[#9a9a9a]" aria-hidden>↗</span>}
              </li>
            ))}
          </ul>
          <div className="px-3 pt-4 pb-2 flex items-center gap-2 text-[13px] text-[#6f6f6f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> Available for new projects · Tbilisi, GMT+4
          </div>
        </div>
        </div>

        <form onSubmit={submit} className="rounded-md border border-[#ececec] p-5 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[13px] text-[#6f6f6f] mb-1.5">Name</span>
              <input required name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} placeholder="Your name" />
            </label>
            <label className="block">
              <span className="block text-[13px] text-[#6f6f6f] mb-1.5">Email</span>
              <input required type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldCls} placeholder="you@company.com" />
            </label>
          </div>
          {select('type', 'Project type')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {select('budget', 'Budget')}
            {select('timeline', 'Timeline')}
          </div>
          <label className="block">
            <span className="block text-[13px] text-[#6f6f6f] mb-1.5">Message</span>
            <textarea name="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${fieldCls} resize-y min-h-[120px]`} placeholder="Tell me about your project…" />
          </label>
          <button type="submit" disabled={state !== 'idle'} className={`${darkPillCls} w-full disabled:opacity-70`}>
            {state === 'sent' ? "Sent — I'll get back to you soon" : state === 'sending' ? 'Sending…' : 'Send inquiry'}
          </button>
          <p className="sr-only" role="status" aria-live="polite">{state === 'sent' ? 'Inquiry sent.' : ''}</p>
        </form>
      </section>

      <div className="px-5 pt-16 text-center text-[14px] text-[#6f6f6f]">
        Prefer to look around first? <Link to="/work/ux-ui" className="text-[#111] underline underline-offset-4 decoration-[#ccc] hover:decoration-[#111]">See the work</Link>
      </div>
    </>
  );
}

export { T };
