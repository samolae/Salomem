import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Check, Copy } from 'lucide-react';
import { CaseLink } from '../components/case-transition';
import { IMG } from '../lib/cld';
import { AreuliBlock, Caption, CtaLink, FadeImg, Lightbox, PageIntro, Reveal, T, pillCls, darkPillCls, type LightboxItem } from './ui';
import { useMotionPause } from './shell';
import { adsBrands, motionReels, screenAurumMainHQ, schenkerSendung, unispaceLogin } from './data';
import { contactLabelsKa, contactLinks, formOptions, formOptionsKa, processSteps, processStepsKa, reelLabelsKa, services, servicesKa, stats, statsKa, EMAIL } from './content';
import { brandName, useI18n } from './i18n';
import { MomentsWall } from './moments-wall';
import { HeartWall } from './heart-wall';

const short = (name: string) => name.split(' · ')[0];

/* ══ Social Media Ads ═══════════════════════════════════════════════ */
export function AdsContent() {
  const { tx, ka } = useI18n();
  const bn = (n: string) => brandName(n, ka);
  const [brand, setBrand] = useState(-1);
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(() => {
    const list = brand >= 0 ? [adsBrands[brand]] : adsBrands;
    return list.flatMap((b) => b.items.map((it, i) => ({ ...it, brand: b.name, n: i + 1, ai: b.aiContent, whiteBg: b.whiteBg })));
  }, [brand]);
  const lightbox: LightboxItem[] = items.map((v) => ({ src: v.src, alt: `${bn(v.brand)} ${tx('ad', 'რეკლამა')} ${v.n}`, video: v.type === 'video', whiteBg: v.whiteBg, brand: bn(v.brand), logo: adsBrands.find((b) => b.name === v.brand)?.logoImg }));

  return (
    <>
      <PageIntro title={tx('Social Media Ads', 'სოც. მედიის რეკლამა')}>
        {tx(
          `Campaign visuals and ad creatives for ${adsBrands.length} brands, from leasing and real estate to food, health and retail.`,
          `კამპანიის ვიზუალები და სარეკლამო კრეატივები ${adsBrands.length} ბრენდისთვის, ლიზინგიდან და უძრავი ქონებიდან კვებამდე, ჯანდაცვამდე და რითეილამდე.`,
        )}
      </PageIntro>

      <div className="px-1.5 pb-6">
        <div className="flex gap-1 overflow-x-auto sm:flex-wrap sm:justify-center" style={{ scrollbarWidth: 'none' }}>
          <button type="button" onClick={() => setBrand(-1)} aria-pressed={brand === -1} className={pillCls(brand === -1)}>{tx('All', 'ყველა')}</button>
          {adsBrands.map((b, i) => (
            <button key={b.name} type="button" onClick={() => setBrand(i)} aria-pressed={brand === i} className={pillCls(brand === i)}>{bn(b.name)}</button>
          ))}
        </div>
      </div>

      {/* Moments wall: the visuals part under the cursor; click to open */}
      <section aria-label={tx('Ads', 'რეკლამები')} className="px-1.5" key={brand}>
        <MomentsWall
          isDark={false}
          items={items.map((v) => ({ src: v.src, type: v.type, brandName: bn(v.brand), logoImg: adsBrands.find((b) => b.name === v.brand)?.logoImg, whiteBg: v.whiteBg }))}
          onOpen={setOpen}
        />
      </section>

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

/* ══ Social Media Motion ════════════════════════════════════════════ */
export function MotionContent() {
  const { tx, ka } = useI18n();
  const bn = (n: string) => brandName(n, ka);
  const [open, setOpen] = useState<number | null>(null);
  const { paused } = useMotionPause();
  const lightbox: LightboxItem[] = motionReels.map((r) => ({ src: r.src, alt: `${bn(r.brand)} ${tx('reel', 'რილსი')}`, video: true, brand: bn(r.brand), logo: (r as { logoImg?: string }).logoImg }));

  return (
    <>
      <PageIntro title={tx('Social Media Motion', 'სოც. მედიის მოუშენი')}>
        {tx('Reels, logo reveals and animated ads. Click any reel to watch it with sound.', 'რილსები, ლოგოს ანიმაციები და ანიმირებული რეკლამები. დააჭირე ნებისმიერ რილსს, რომ ხმით ნახო.')}
      </PageIntro>
      {/* Frames from every reel gather into a heart, then burst into a wall */}
      <section aria-label={tx('All reels as a heart', 'ყველა რილსი გულად')} className="px-1.5 pb-1.5">
        <HeartWall reels={motionReels} isDark={false} onOpen={setOpen} replayLabel={tx('Replay', 'თავიდან')} />
      </section>

      <section aria-label={tx('Reels', 'რილსები')} className="px-1.5 columns-2 sm:columns-3 lg:columns-4 xl:columns-6 gap-1.5">
        {motionReels.map((r, i) => (
          <Reveal key={r.src} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left outline-none focus-visible:shadow-[0_0_0_2px_#ff4306] rounded-md" aria-label={tx(`Watch ${bn(r.brand)} reel with sound`, `${bn(r.brand)}: რილსის ხმით ნახვა`)}>
              <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
                <video
                  src={r.src} loop muted playsInline preload="metadata" autoPlay={!paused}
                  ref={(v) => { if (v) { paused ? v.pause() : v.play().catch(() => {}); } }}
                  className="block w-full h-auto"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-white/85 px-2 py-1 text-[12px] text-[#111] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">{tx('Play with sound', 'ხმით ნახვა')}</span>
              </div>
              <Caption title={bn(r.brand)} sub={ka ? reelLabelsKa[r.label] ?? r.label : r.label} />
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
  { to: '/projects/aurum', title: 'AURUM', sub: 'Crypto exchange · B2C fintech', subKa: 'კრიპტოგაცვლა · B2C ფინტექი', tag: '196 screens', tagKa: '196 ეკრანი', img: screenAurumMainHQ, bg: 'linear-gradient(160deg,#16130b,#0b0b0f 70%)' },
  { to: '/projects/schenker', title: 'Schenker', sub: 'Logistics platform · enterprise UX', subKa: 'ლოჯისტიკის პლატფორმა · კორპორატიული UX', tag: '9+ screens', tagKa: '9+ ეკრანი', img: schenkerSendung, bg: 'linear-gradient(160deg,#e8ecd8,#d4dab8)' },
  { to: '/projects/unispace', title: 'Unispace', sub: 'Student management · multi-role EdTech', subKa: 'სტუდენტების მართვა · მრავალროლიანი EdTech', tag: 'Web · responsive', tagKa: 'ვები · რესპონსივი', img: unispaceLogin, bg: 'linear-gradient(160deg,#dfe6ff,#eef1ff)' },
];

export function UxUiContent() {
  const { tx, ka } = useI18n();
  return (
    <>
      <PageIntro title={tx('UX/UI Design', 'UX/UI დიზაინი')}>
        {tx('End-to-end product design, from user research to polished interfaces and scalable design systems.', 'პროდუქტის დიზაინი სრულად, მომხმარებლის კვლევიდან დახვეწილ ინტერფეისებამდე და მასშტაბირებად დიზაინ სისტემებამდე.')}
      </PageIntro>
      <section aria-label={tx('Case studies', 'ქეისები')} className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
        {CASES.map((c, i) => (
          <Reveal key={c.to}>
            <CaseLink to={c.to} cardId={`ux-${c.title.toLowerCase()}`} className="group block">
              <div className="relative overflow-hidden rounded-md p-[8%]" style={{ background: c.bg }}>
                <img {...IMG.caseMain(c.img)} alt={`${c.title} interface`} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"
                  className="block w-full h-auto rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
              </div>
              <Caption title={c.title} sub={ka ? c.subKa : c.sub} tag={ka ? c.tagKa : c.tag} />
            </CaseLink>
          </Reveal>
        ))}
        <Reveal>
          <div className="aspect-[4/3] rounded-md bg-[#f2f2f2] flex flex-col items-center justify-center text-center px-8">
            <p className="text-[15px] leading-[1.5] text-[#111] max-w-[320px]">{tx('Have a product that needs a sharper interface or a design system?', 'გაქვს პროდუქტი, რომელსაც უფრო მკაფიო ინტერფეისი ან დიზაინ სისტემა სჭირდება?')}</p>
            <div className="mt-6"><CtaLink /></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ══ Services ═══════════════════════════════════════════════════════ */
export function ServicesContent() {
  const { tx, ka } = useI18n();
  const list = ka ? servicesKa : services;
  return (
    <>
      <PageIntro title={tx('Services', 'სერვისები')}>
        {tx('Four focused engagements, from end-to-end product design to art direction, social and motion. Pick one or combine them.', 'ოთხი მიმართულება: პროდუქტის სრული დიზაინი, არტ დირექცია, სოციალური მედია და მოუშენი. აირჩიე ერთი ან გააერთიანე.')}
      </PageIntro>

      <section aria-label={tx('Services', 'სერვისები')} className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {list.map((s) => (
          <Reveal key={s.title}>
            <article className="h-full rounded-md bg-[#f2f2f2] p-6 sm:p-9 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[18px] leading-tight text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.title}</h2>
                <span className="text-[13px] text-[#6f6f6f] whitespace-nowrap">{s.timeline}</span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[420px]">{s.tagline}</p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-[#111]">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2"><Check size={14} className="mt-[3px] flex-shrink-0 text-[#ff4306]" />{d}</li>
                ))}
              </ul>
              <p className="mt-auto pt-8 text-[13px] text-[#6f6f6f]">{s.outcome}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section aria-labelledby="process-title" className="px-1.5 pt-24">
        <h2 id="process-title" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('How we work together', 'როგორ ვმუშაობთ ერთად')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {(ka ? processStepsKa : processSteps).map((p) => (
            <Reveal key={p.step}>
              <div className="h-full rounded-md bg-[#f2f2f2] p-6">
                <div className="text-[13px] text-[#d93905] tabular-nums">{p.step}</div>
                <div className="mt-8 text-[15px] text-[#111]" style={{ fontWeight: 500 }}>{p.title}</div>
                <p className="mt-1 text-[14px] leading-[1.45] text-[#6f6f6f]">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label={tx('Track record', 'შედეგები')} className="px-1.5 pt-1.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {(ka ? statsKa : stats).map((s) => (
            <div key={s.label} className="rounded-md border border-[#ececec] p-6">
              <div className="text-[30px] leading-none text-[#ff4306]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.num}</div>
              <div className="mt-1 text-[14px] text-[#6f6f6f]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-24 flex flex-col items-center text-center">
        <p className="text-[15px] leading-[1.5] text-[#111] max-w-[340px]" style={{ fontWeight: 500 }}>{tx('Tell me about your goals. I reply within 24 hours.', 'მომიყევი შენი მიზნების შესახებ. 24 საათში გიპასუხებ.')}</p>
        <div className="mt-8"><CtaLink /></div>
      </section>
    </>
  );
}

/* WhatsApp glyph (the brand mark has no Lucide icon) */
function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23a7.4 7.4 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.16 1.75 2.67 4.24 3.75.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  );
}

/* ══ Contact ════════════════════════════════════════════════════════ */
const fieldCls = 'w-full rounded-md bg-[#f2f2f2] px-3.5 py-3 text-[15px] text-[#111] placeholder-[#9a9a9a] outline-none border border-transparent focus:border-[#ff4306] transition-colors';

export function ContactContent() {
  const { tx, ka, to } = useI18n();
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
          _subject: `New inquiry from ${form.name || 'someone'}, ${form.type || 'Portfolio'}`,
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
        <option value="">{tx('Select…', 'აირჩიე…')}</option>
        {formOptions[field].map((o, i) => <option key={o} value={o}>{ka ? formOptionsKa[field][i] : o}</option>)}
      </select>
    </label>
  );

  return (
    <>
      <PageIntro title={tx("Let's work together", 'ვიმუშაოთ ერთად')}>
        {tx('Tell me about your project, or reach me directly. I reply within 24 hours.', 'მომიყევი პროექტის შესახებ ან პირდაპირ დამიკავშირდი. 24 საათში გიპასუხებ.')}
      </PageIntro>

      <section className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 max-w-6xl mx-auto">
        <div className="self-start space-y-1.5">
        <div className="rounded-md bg-[#f2f2f2] p-3 sm:p-4">
          <ul>
            {contactLinks.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-3 rounded-md px-3 py-3.5 hover:bg-[#e8e8e8] transition-colors">
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="min-w-0 flex-1 text-[15px] outline-none focus-visible:underline flex flex-col sm:flex-row sm:gap-3">
                  <span className="text-[#6f6f6f]">{ka ? contactLabelsKa[c.label] ?? c.label : c.label}</span>
                  <span className="text-[#111] truncate">{c.value}</span>
                </a>
                {'whatsapp' in c && c.whatsapp && (
                  <a
                    href={c.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tx('Message me on WhatsApp', 'მომწერე WhatsApp-ზე')}
                    title="WhatsApp"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]"
                  >
                    <WhatsAppIcon />
                  </a>
                )}
                {c.copy ? (
                  <button type="button" onClick={() => copy(c.value, c.label)} className={pillCls()} aria-label={tx(`Copy ${c.label.toLowerCase()}`, 'კოპირება')}>
                    {copied === c.label ? <Check size={13} /> : <Copy size={13} />}
                    {copied === c.label ? tx('copied', 'დაკოპირდა') : tx('copy', 'კოპირება')}
                  </button>
                ) : <span className="text-[#9a9a9a]" aria-hidden>↗</span>}
              </li>
            ))}
          </ul>
          <div className="px-3 pt-4 pb-2 flex items-center gap-2 text-[13px] text-[#6f6f6f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> {tx('Available for new projects · Tbilisi, GMT+4', 'ახალი პროექტებისთვის თავისუფალი ვარ · თბილისი, GMT+4')}
          </div>
        </div>
        <AreuliBlock compact />
        </div>

        <form onSubmit={submit} className="rounded-md border border-[#ececec] p-5 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[13px] text-[#6f6f6f] mb-1.5">{tx('Name', 'სახელი')}</span>
              <input required name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} placeholder={tx('Your name', 'შენი სახელი')} />
            </label>
            <label className="block">
              <span className="block text-[13px] text-[#6f6f6f] mb-1.5">{tx('Email', 'ელფოსტა')}</span>
              <input required type="email" name="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldCls} placeholder="you@company.com" />
            </label>
          </div>
          {select('type', tx('Project type', 'პროექტის ტიპი'))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {select('budget', tx('Budget', 'ბიუჯეტი'))}
            {select('timeline', tx('Timeline', 'ვადები'))}
          </div>
          <label className="block">
            <span className="block text-[13px] text-[#6f6f6f] mb-1.5">{tx('Message', 'შეტყობინება')}</span>
            <textarea name="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${fieldCls} resize-y min-h-[120px]`} placeholder={tx('Tell me about your project…', 'მომიყევი პროექტის შესახებ…')} />
          </label>
          <button type="submit" disabled={state !== 'idle'} className={`${darkPillCls} w-full disabled:opacity-70`}>
            {state === 'sent' ? tx("Sent. I'll get back to you soon", 'გაიგზავნა, მალე გიპასუხებ') : state === 'sending' ? tx('Sending…', 'იგზავნება…') : tx('Send inquiry', 'გაგზავნა')}
          </button>
          <p className="sr-only" role="status" aria-live="polite">{state === 'sent' ? tx('Inquiry sent.', 'შეტყობინება გაიგზავნა.') : ''}</p>
        </form>
      </section>

      <div className="px-5 pt-16 text-center text-[14px] text-[#6f6f6f]">
        {tx('Prefer to look around first?', 'ჯერ დათვალიერება გირჩევნია?')} <Link to={to('/work/ux-ui')} className="text-[#111] underline underline-offset-4 decoration-[#ccc] hover:decoration-[#ff4306]">{tx('See the work', 'ნახე ნამუშევრები')}</Link>
      </div>
    </>
  );
}

export { T };
