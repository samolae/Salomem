import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Check, Copy, Mail, Phone } from 'lucide-react';
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
/* films made with AI, finished and cut for social: shown apart from the motion reels */
const AI_FILMS: { src: string; brand: string; en: string; ka: string }[] = [
  { src: '/ai/scanomat-cafe.mp4', brand: 'Scanomat', en: 'A café in Tbilisi, paying by hand', ka: 'კაფე თბილისში, ხელით გადახდა' },
  { src: '/ai/zummo-night-bar.mp4', brand: 'Zummo', en: 'Why bars choose Zummo', ka: 'რატომ ირჩევენ ბარები ZUMMO-ს' },
  { src: '/ai/areuli-newspaper.mp4', brand: 'AREULI', en: 'Another brand has a newspaper', ka: 'კიდევ ერთ ბრენდს აქვს გაზეთი' },
  { src: '/ai/zummo-georgia.mp4', brand: 'Zummo', en: 'Zummo, now in Georgia', ka: 'ZUMMO უკვე საქართველოშიც' },
  { src: '/ai/sharp-mobile-data.mp4', brand: 'SHARP', en: 'Mobile data is calling', ka: 'მობილური ინტერნეტი რეკავს' },
  { src: '/ai/zummo-hotel.mp4', brand: 'Zummo', en: 'Do you have a hotel?', ka: 'გაქვს სასტუმრო?' },
  { src: '/ai/prime-square.mp4', brand: 'Prime Square', en: 'Modern living', ka: 'თანამედროვე ცხოვრება' },
  { src: '/ai/zummo-pour.mp4', brand: 'Zummo', en: 'Why the world chooses Zummo', ka: 'რატომ ირჩევს მსოფლიო ZUMMO-ს' },
  { src: '/ai/areuli-thinker.mp4', brand: 'AREULI', en: 'Full creative control', ka: 'სრული კრეატიული კონტროლი' },
  { src: '/ai/sharp-kaizer.mp4', brand: 'SHARP', en: 'Kaizer Chiefs quiz', ka: 'Kaizer Chiefs-ის ქვიზი' },
  { src: '/ai/zummo-safe.mp4', brand: 'Zummo', en: 'Straight from the orange', ka: 'პირდაპირ ფორთოხლიდან' },
  { src: '/ai/sharp-parcel.mp4', brand: 'SHARP', en: 'Parcel scam, four red flags', ka: 'ამანათის თაღლითობა, ოთხი ნიშანი' },
];

/** a film that plays only while it is on screen, so the page does not pull them all at once */
function InViewVideo({ src, poster, paused }: { src: string; poster: string; paused: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !paused) v.play().catch(() => {}); else v.pause(); }, { rootMargin: '200px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [paused]);
  return <video ref={ref} src={src} poster={poster} loop muted playsInline preload="none" className="block w-full h-full object-cover" />;
}

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

      <section aria-label={tx('Reels', 'რილსები')} className="px-1.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
        {motionReels.map((r, i) => (
          <Reveal key={r.src} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left outline-none focus-visible:shadow-[0_0_0_2px_#ff4306] rounded-md" aria-label={tx(`Watch ${bn(r.brand)} reel with sound`, `${bn(r.brand)}: რილსის ხმით ნახვა`)}>
              <div className="relative overflow-hidden rounded-md bg-[#f2f2f2] aspect-[9/16]">
                <video
                  src={r.src} loop muted playsInline preload="metadata" autoPlay={!paused}
                  ref={(v) => { if (v) { paused ? v.pause() : v.play().catch(() => {}); } }}
                  className="block w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-white/85 px-2 py-1 text-[12px] text-[#111] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">{tx('Play with sound', 'ხმით ნახვა')}</span>
              </div>
              <Caption title={bn(r.brand)} sub={ka ? reelLabelsKa[r.label] ?? r.label : r.label} />
            </button>
          </Reveal>
        ))}
      </section>
      <section aria-labelledby="ai-films" className="pt-16 sm:pt-24">
        <div className="px-2 pb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="ai-films" className="text-[14px] text-[#6f6f6f]">{tx('AI films', 'AI ვიდეოები')}</h2>
          <p className="text-[14px] text-[#6f6f6f]">{tx('Directed, generated and edited with AI, for brands', 'ბრენდებისთვის: რეჟისურა, გენერაცია და მონტაჟი AI-ით')}</p>
        </div>
        {/* twelve upright films: full rows at 2, 3 and 4 columns */}
        <div className="px-1.5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 items-start">
          {AI_FILMS.map((f, i) => (
            <Reveal key={f.src}>
              <button type="button" onClick={() => setOpen(motionReels.length + i)} className="group block w-full text-left outline-none focus-visible:shadow-[0_0_0_2px_#ff4306] rounded-md"
                aria-label={tx(`Watch ${f.brand}: ${f.en}`, `ნახე ${f.brand}: ${f.ka}`)}>
                <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]" style={{ aspectRatio: '9/16' }}>
                  <InViewVideo src={f.src} poster={f.src.replace('.mp4', '.jpg')} paused={paused} />
                  <span className="absolute bottom-2 left-2 rounded-md bg-white/85 px-2 py-1 text-[12px] text-[#111] opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">{tx('Play with sound', 'ხმით ნახვა')}</span>
                </div>
                <Caption title={f.brand} sub={tx(f.en, f.ka)} tag="AI" />
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <Lightbox items={[...lightbox, ...AI_FILMS.map((f) => ({ src: f.src, alt: `${f.brand}: ${tx(f.en, f.ka)}`, video: true, brand: f.brand }))]}
        index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
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

/* the networks' own marks, on their own colour, like the WhatsApp one */
const BRAND_ICON: Record<string, { bg: string; hover: string; path: string }> = {
  LinkedIn: { bg: '#0A66C2', hover: '#0957a5', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z' },
  Behance: { bg: '#1769FF', hover: '#0f57dd', path: 'M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM16.94 16.665c.44.428 1.073.643 1.894.643.59 0 1.1-.148 1.53-.447.424-.29.68-.61.78-.94h2.588c-.403 1.28-1.048 2.2-1.9 2.75-.85.56-1.884.83-3.08.83-.837 0-1.584-.13-2.272-.4-.673-.27-1.24-.65-1.72-1.14-.464-.49-.823-1.08-1.077-1.77-.253-.69-.373-1.45-.373-2.27 0-.803.135-1.54.403-2.23.27-.7.644-1.28 1.12-1.79.495-.51 1.063-.9 1.736-1.194s1.4-.433 2.22-.433c.91 0 1.69.164 2.38.523.67.34 1.22.82 1.66 1.4.44.586.75 1.26.94 2.02.19.75.25 1.54.21 2.38h-7.69c0 .84.28 1.632.71 2.065l-.08.03zm-10.24.05c.317 0 .62-.03.906-.093.29-.06.548-.165.763-.3.21-.135.39-.328.52-.583.13-.24.19-.57.19-.96 0-.78-.22-1.33-.663-1.66-.44-.33-1.03-.49-1.75-.49H3.24v4.08h3.46v.006zm13.64-5.4c-.334-.36-.92-.557-1.6-.557-.45 0-.817.074-1.11.226-.29.15-.523.335-.7.553-.175.22-.296.45-.37.69-.07.24-.11.45-.12.64h4.67c-.07-.73-.32-1.26-.65-1.55l-.12.01zM6.52 10.45c.574 0 1.05-.134 1.425-.412.374-.27.554-.72.554-1.338 0-.344-.07-.625-.18-.846-.13-.22-.3-.39-.5-.512-.21-.124-.45-.21-.72-.252-.27-.05-.56-.07-.84-.07H3.24v3.43h3.28zm8.98-4.86h5.98v1.45H15.5V5.59z' },
};

/* ══ Contact ════════════════════════════════════════════════════════ */
const fieldCls = 'w-full rounded-md bg-[#f2f2f2] px-3.5 py-3 text-[15px] text-[#111] placeholder-[#9a9a9a] outline-none border border-transparent focus:border-[#ff4306] transition-colors';

export function ContactContent() {
  const { tx, ka, to } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [copied, setCopied] = useState<string | null>(null);
  const [honey, setHoney] = useState(''); // hidden field: people never fill it, bots do
  const startedAt = useMemo(() => Date.now(), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'sending') return;
    const done = () => {
      setState('sent');
      setForm({ name: '', email: '', type: '', budget: '', timeline: '', message: '' });
      setTimeout(() => setState('idle'), 4000);
    };
    // Bots fill the hidden field or submit within a second or two; drop those quietly
    if (honey || Date.now() - startedAt < 2500) { done(); return; }
    setState('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New inquiry from ${form.name.slice(0, 80) || 'someone'}, ${form.type || 'Portfolio'}`,
          _template: 'table',
          _honey: honey,
          Name: form.name.slice(0, 120) || '-', Email: form.email.slice(0, 160) || '-', 'Project type': form.type || '-',
          Budget: form.budget || '-', Timeline: form.timeline || '-', Message: form.message.slice(0, 5000) || '-',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String((data as { success?: unknown }).success) === 'false') throw new Error('send failed');
      done();
    } catch {
      setState('error');
    }
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
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="min-w-0 flex-1 text-[15px] outline-none focus-visible:underline flex items-center gap-3">
                  {/* each row starts with its mark: the network's own for LinkedIn and Behance */}
                  <span aria-hidden className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-md text-white"
                    style={{ background: BRAND_ICON[c.label]?.bg ?? '#111' }}>
                    {BRAND_ICON[c.label]
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={BRAND_ICON[c.label].path} /></svg>
                      : c.label === 'Phone' ? <Phone size={14} strokeWidth={2} /> : <Mail size={14} strokeWidth={2} />}
                  </span>
                  <span className="min-w-0 flex flex-col sm:flex-row sm:gap-3">
                    <span className="text-[#6f6f6f]">{ka ? contactLabelsKa[c.label] ?? c.label : c.label}</span>
                    <span className="text-[#111] truncate">{c.value}</span>
                  </span>
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
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> {tx('Available for new projects · Georgia, GMT+4', 'ახალი პროექტებისთვის თავისუფალი ვარ · საქართველო, GMT+4')}
          </div>
        </div>
        <AreuliBlock compact />
        </div>

        <form onSubmit={submit} className="relative rounded-md border border-[#ececec] p-5 sm:p-7 space-y-4">
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
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Leave this empty<input type="text" name="_honey" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
          </div>
          {state === 'error' && (
            <p className="text-[14px] text-[#b52f03]" role="alert">
              {tx('The message did not go through. Try again, or write to', 'შეტყობინება ვერ გაიგზავნა. სცადე თავიდან ან მომწერე:')}{' '}
              <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a>
            </p>
          )}
          <button type="submit" disabled={state === 'sending' || state === 'sent'} className={`${darkPillCls} w-full disabled:opacity-70`}>
            {state === 'sent' ? tx("Sent. I'll get back to you soon", 'გაიგზავნა, მალე გიპასუხებ') : state === 'sending' ? tx('Sending…', 'იგზავნება…') : state === 'error' ? tx('Try again', 'თავიდან ცდა') : tx('Send inquiry', 'გაგზავნა')}
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
