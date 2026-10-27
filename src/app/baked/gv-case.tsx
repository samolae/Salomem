import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { CaseHeroTarget } from '../components/case-transition';
import { SEO } from '../components/seo';
import { Marquee, RevealLines, Rise } from '../components/case-motion';
import { BakedShell } from './shell';
import { CtaLink, Lightbox, type LightboxItem } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';

/*
 * GV Capital: identity for an investment and development holding.
 * Laid out the way the live guidelines show it: one content width, every
 * picture and film at its own proportions (rows are justified so nothing is
 * cropped or blown up), the motion pieces from the guidelines, and the
 * paper and screen work last and small.
 */

const P = '/cases/gv';
const M = '/cases/gv/m';
const CARBON = '#16232A';
const EMERALD = '#0A6670';
const LIVE = 'https://gv-capital.vercel.app/';

/* The brand's own palette and type, from the live guidelines */
const B = { emerald: '#0A6670', mist: '#E4EEF0', midnight: '#16232A', orange: '#FF5804', paper: '#F4F7F6', mint: '#B4D3D5', mintOn: '#C7E0E1', muted: '#51646B' };
const TITLE = '"GV Extended", "Arial Black", sans-serif';
const TEXT = '"GV Text", Arial, sans-serif';
const FONTS = `
@font-face{font-family:"GV Extended";src:url(/cases/gv/fonts/aktiv-grotesk-extended-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:"GV Extended";src:url(/cases/gv/fonts/aktiv-grotesk-extended-700-normal.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:"GV Text";src:url(/cases/gv/fonts/aktiv-grotesk-georgian-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"GV Text";src:url(/cases/gv/fonts/aktiv-grotesk-georgian-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}`;

type Tone = 'paper' | 'white' | 'mist' | 'midnight' | 'emerald';
const TONES: Record<Tone, { bg: string; ink: string; label: string; soft: string }> = {
  paper: { bg: B.paper, ink: B.midnight, label: B.emerald, soft: B.muted },
  white: { bg: '#FFFFFF', ink: B.midnight, label: B.emerald, soft: B.muted },
  mist: { bg: B.mist, ink: B.midnight, label: B.emerald, soft: B.muted },
  midnight: { bg: B.midnight, ink: '#FFFFFF', label: B.mint, soft: 'rgba(255,255,255,0.62)' },
  emerald: { bg: B.emerald, ink: '#FFFFFF', label: B.mintOn, soft: 'rgba(255,255,255,0.72)' },
};

/** a picture or a film, with its real size */
type Media = { key: string; w: number; h: number; en: string; ka: string; src: string; small?: string; video?: string };

const img = (key: string, w: number, h: number, en: string, ka: string, dir = P, small = '-1200'): Media =>
  ({ key, w, h, en, ka, src: `${dir}/${key}.jpg`, small: `${dir}/${key}${small}.jpg` });
const film = (key: string, w: number, h: number, en: string, ka: string, video: string, poster: string): Media =>
  ({ key, w, h, en, ka, src: poster, video });

const MEDIA = {
  cover: film('cover', 1920, 1080, 'Brand film', 'ბრენდის ფილმი', `${P}/cover.mp4`, `${P}/facade.jpg`),
  foundation: img('foundation', 2000, 2000, 'Perspective from above', 'პერსპექტივა ზემოდან', M, '-1100'),
  focus: img('focus', 2000, 1778, 'A focus booth in the office', 'ფოკუსის კაბინა ოფისში', M, '-1100'),
  logo: film('logo', 720, 1280, 'The logo in motion', 'ლოგო მოძრაობაში', `${M}/logo.mp4`, `${M}/logo-poster.jpg`),
  wall: img('reception-wall', 2000, 1125, 'Reception wall', 'მისაღების კედელი', M, '-1100'),
  campus: film('campus', 1920, 1080, 'Logistics campus', 'ლოჯისტიკური კომპლექსი', `${M}/campus.mp4`, `${M}/campus-poster.jpg`),
  reception: film('reception', 1248, 1664, 'Office reception', 'ოფისის მისაღები', `${P}/reception.mp4`, `${P}/reception-1200.jpg`),
  blade: img('blade', 1333, 2000, 'Layered wayfinding blade', 'შრეებიანი ნავიგაციის ნიშანი', M, '-1100'),
  wayfinding: film('wayfinding-office', 1664, 1248, 'Wayfinding in the office', 'ნავიგაცია ოფისში', `${M}/wayfinding-office.mp4`, `${M}/wayfinding-office-poster.jpg`),
  corridor: img('corridor', 1744, 2336, 'Corridor with directional blades', 'დერეფანი მიმართულების ნიშნებით'),
  facade: film('facade', 1920, 1080, 'Warehouse facade', 'საწყობის ფასადი', `${P}/facade.mp4`, `${P}/facade-1200.jpg`),
  flags: film('flags', 1248, 1664, 'Flags', 'დროშები', `${P}/flags.mp4`, `${P}/flags-1200.jpg`),
  fleet: film('fleet', 1920, 1080, 'Fleet', 'ავტოპარკი', `${M}/fleet.mp4`, `${M}/fleet-poster.jpg`),
  hardhat: img('hardhat-hq', 1086, 1448, 'Site hard hat', 'სამშენებლო ჩაფხუტი', M, '-1100'),
  packaging: img('packaging-hq', 1086, 1448, 'Packaging tape and box', 'შეფუთვის ლენტი და ყუთი', M, '-1100'),
  card: film('business-card', 1248, 1664, 'Business card', 'სავიზიტო ბარათი', `${M}/business-card.mp4`, `${M}/business-card-poster.jpg`),
  folder: film('folder', 1248, 1664, 'Folder', 'საქაღალდე', `${M}/folder.mp4`, `${M}/folder-poster.jpg`),
  uniform: film('uniform', 1248, 1664, 'Uniform', 'უნიფორმა', `${M}/uniform.mp4`, `${M}/uniform-poster.jpg`),
  material: film('material', 1248, 1664, 'Embossed mark on fabric', 'ამოტვიფრული ნიშანი ქსოვილზე', `${M}/material.mp4`, `${M}/material-poster.jpg`),
  s1: img('social-opportunities', 1080, 1350, 'Social post: space that creates opportunities', 'პოსტი: სივრცე, რომელიც ქმნის შესაძლებლობებს'),
  s2: img('social-possibility', 1080, 1350, 'Social post: built around possibility', 'პოსტი: შესაძლებლობის გარშემო'),
  s3: img('social-perspective', 1080, 1350, 'Social post: a long-term view', 'პოსტი: გრძელვადიანი ხედვა'),
  s4: img('social-focus', 1080, 1350, 'Social post: built for focus', 'პოსტი: ფოკუსისთვის'),
  cards: img('cards', 1744, 2336, 'Business cards', 'სავიზიტო ბარათები'),
  letterhead: img('letterhead', 1200, 1697, 'Letterhead', 'ბლანკი', P, ''),
  document: img('document', 1200, 1697, 'Project proposal cover', 'პროექტის შეთავაზების ყდა', P, ''),
  profile: img('profile', 1200, 1697, 'Company profile', 'კომპანიის პროფილი', P, ''),
  company: img('company', 1280, 720, 'Company presentation', 'კომპანიის პრეზენტაცია', P, ''),
  layouts: img('layouts', 1280, 720, 'Presentation template', 'პრეზენტაციის შაბლონი', P, ''),
} satisfies Record<string, Media>;

/** everything that opens large, in page order */
const STILLS = Object.values(MEDIA).filter((m) => !m.video);

function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-3 sm:px-5 lg:px-8 ${className}`}>{children}</div>;
}

/** a film that plays only while on screen */
function Film({ m }: { m: Media }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} src={m.video} poster={m.src} muted loop playsInline preload="none" aria-label={m.en} className="absolute inset-0 h-full w-full object-cover" />;
}

/**
 * A justified row: every item keeps its own proportions and all of them
 * share one height, so nothing is cropped and nothing is scaled past its size.
 */
function Row({ items, onOpen, className = '' }: { items: Media[]; onOpen: (i: number) => void; className?: string }) {
  const { tx } = useI18n();
  const total = items.reduce((a, m) => a + m.w / m.h, 0);
  return (
    <div className={`flex flex-col sm:flex-row gap-1.5 ${className}`}>
      {items.map((m, i) => {
        const r = m.w / m.h;
        const still = STILLS.indexOf(m);
        const body = m.video ? <Film m={m} /> : (
          <img src={m.small ?? m.src} srcSet={m.small && m.small !== m.src ? `${m.small} 1100w, ${m.src} ${m.w}w` : undefined}
            sizes={`(min-width: 1240px) ${Math.round((1180 * r) / total)}px, ${Math.round((100 * r) / total)}vw`}
            width={m.w} height={m.h} alt={tx(m.en, m.ka)} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.02]" />
        );
        return (
          <div key={m.key} className="min-w-0" style={{ flex: `${r} 1 0%` }}>
            <Rise delay={i * 0.05}>
              {m.video ? (
                <div className="relative w-full overflow-hidden rounded-[6px] bg-[#dcd8d0]" style={{ aspectRatio: `${m.w}/${m.h}` }}>{body}</div>
              ) : (
                <button type="button" onClick={() => onOpen(still)} aria-label={`${tx(m.en, m.ka)}, ${tx('enlarge', 'გადიდება')}`}
                  className="group relative block w-full overflow-hidden rounded-[6px] bg-[#dcd8d0] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0A6670]" style={{ aspectRatio: `${m.w}/${m.h}` }}>
                  {body}
                </button>
              )}
            </Rise>
          </div>
        );
      })}
    </div>
  );
}

/** a chapter in the guidelines' manner: a coloured band, "01 / NAME", a big extended title, a short lead */
function Band({ tone, no, name, title, lead, children, pills }: { tone: Tone; no: string; name: string; title: string; lead?: string; children: React.ReactNode; pills?: string[] }) {
  const t = TONES[tone];
  return (
    <section className="px-1.5 pt-1.5">
      <div className="rounded-[10px] py-20 sm:py-28" style={{ background: t.bg, color: t.ink }}>
        <Wrap>
          <div className="grid grid-cols-12 gap-x-6 gap-y-5 items-end pb-10 sm:pb-14 border-b mb-10 sm:mb-14" style={{ borderColor: tone === 'midnight' || tone === 'emerald' ? 'rgba(255,255,255,0.16)' : 'rgba(22,35,42,0.14)' }}>
            <div className="col-span-12 lg:col-span-8">
              <div className="text-[12px] uppercase tracking-[0.14em] mb-4" style={{ color: t.label, fontFamily: TITLE, fontWeight: 500 }}>{no} / {name}</div>
              <RevealLines as="h2" className="text-[38px] sm:text-[60px] lg:text-[76px] leading-[0.98] tracking-[-0.02em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>{title}</span>
              </RevealLines>
            </div>
            {(lead || pills) && (
              <div className="col-span-12 lg:col-span-4">
                {lead && <p className="text-[16px] leading-[1.55]" style={{ color: t.soft, fontFamily: TEXT }}>{lead}</p>}
                {pills && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pills.map((p) => <span key={p} className="rounded-full px-3.5 py-1.5 text-[13px]" style={{ background: tone === 'midnight' || tone === 'emerald' ? 'rgba(255,255,255,0.1)' : B.mist, color: tone === 'midnight' || tone === 'emerald' ? '#fff' : B.emerald, fontFamily: TEXT, fontWeight: 500 }}>{p}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
          {children}
        </Wrap>
      </div>
    </section>
  );
}

/** the colour system, as the guidelines show it: four swatches and the balance they are used in */
function Colours() {
  const { tx } = useI18n();
  const sw = [
    { name: 'GV Emerald', role: tx('Primary', 'ძირითადი'), hex: B.emerald, ink: '#fff', spec: 'PANTONE 7715 C · RAL 5021' },
    { name: 'Cool Mist', role: tx('Light', 'ღია'), hex: B.mist, ink: B.midnight, spec: 'CMYK 5 1 0 6' },
    { name: 'Midnight', role: tx('Dark', 'მუქი'), hex: B.midnight, ink: '#fff', spec: 'CMYK 48 17 0 84' },
    { name: 'Signal Orange', role: tx('Accent, 5% at most', 'აქცენტი, მაქს. 5%'), hex: B.orange, ink: B.midnight, spec: 'CMYK 0 65 98 0' },
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
        {sw.map((c, i) => (
          <Rise key={c.name} delay={i * 0.06}>
            <div className="rounded-[10px] overflow-hidden ring-1 ring-black/[0.06] bg-white">
              <div className="h-[140px] sm:h-[200px] p-4 flex items-start" style={{ background: c.hex, color: c.ink }}>
                <span className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: TITLE, fontWeight: 500 }}>{c.role}</span>
              </div>
              <div className="p-4 sm:p-5" style={{ color: B.midnight }}>
                <div className="text-[17px] sm:text-[20px]" style={{ fontFamily: TITLE, fontWeight: 700 }}>{c.name}</div>
                <div className="mt-1 text-[13px] tabular-nums" style={{ fontFamily: TEXT, fontWeight: 500 }}>{c.hex}</div>
                <div className="mt-1 text-[12px]" style={{ color: B.muted, fontFamily: TEXT }}>{c.spec}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={0.1}>
        <div className="mt-1.5 flex h-11 overflow-hidden rounded-[10px] text-[12px]" style={{ fontFamily: TITLE, fontWeight: 500 }}>
          {[['50%', B.mist, B.midnight, 50], ['30%', B.midnight, '#fff', 30], ['15%', B.emerald, '#fff', 15], ['≤5%', B.orange, B.midnight, 5]].map(([l, bg, ink, w]) => (
            <div key={String(l)} className="flex items-center justify-center" style={{ width: `${w}%`, background: String(bg), color: String(ink) }}>{l}</div>
          ))}
        </div>
      </Rise>
    </>
  );
}

export function GvCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = STILLS.map((s) => ({ src: s.src, alt: tx(s.en, s.ka), brand: `GV Capital, ${tx(s.en, s.ka)}` }));
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'GV Capital'],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Investment & development', 'ინვესტიცია და განვითარება')],
    [tx('Scope', 'სამუშაო'), tx('Brand concept, identity, guidelines', 'კონცეფცია, იდენტობა, გაიდლაინი')],
  ];
  const m = MEDIA;

  return (
    <BakedShell>
      <SEO
        title="GV Capital | Brand Identity Case Study"
        description="GV Capital makes space: brand concept, identity and live guidelines for a Georgian investment and development holding."
        keywords="GV Capital, brand identity, brand guidelines, investment holding, logistics, Georgia, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/gv-capital" />

      <style>{FONTS}</style>
      <article className="pt-14 sm:pt-[52px]" style={{ color: CARBON, fontFamily: TEXT }}>

        {/* ── Hero: the brand's own cover, midnight and huge extended type ── */}
        <header className="px-1.5">
          <div className="relative flex min-h-[calc(100svh-64px)] flex-col overflow-hidden rounded-[10px] text-white" style={{ background: `linear-gradient(180deg, #1d2730 0%, ${B.midnight} 55%, #0f171c 100%)` }}>
            <Wrap className="flex items-start justify-between pt-6 sm:pt-8 text-[13px]">
              <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] uppercase tracking-[0.12em] hover:bg-white/15" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: TITLE, fontWeight: 500 }}>{tx('Live guidelines', 'ცოცხალი გაიდლაინი')} <ArrowUpRight size={12} /></a>
            </Wrap>
            <Wrap className="mt-auto pb-8 sm:pb-10">
              <RevealLines as="h1" className="text-[17vw] sm:text-[13vw] lg:text-[150px] leading-[0.9] tracking-[-0.03em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>GV Capital</span>
                <span style={{ color: B.mint }}>{tx('makes space.', 'ქმნის სივრცეს.')}</span>
              </RevealLines>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-t border-white/15 pt-5">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: B.mint, fontFamily: TITLE, fontWeight: 500 }}>{k}</div>
                    <div className="mt-1.5 text-[14px] text-white/85">{v}</div>
                  </div>
                ))}
              </div>
            </Wrap>
          </div>
        </header>

        {/* the brand's vocabulary running past, as on the guidelines */}
        <div className="px-1.5 pt-1.5">
          <div className="overflow-hidden rounded-[10px] py-4 text-[13px] sm:text-[15px] uppercase tracking-[0.14em] text-white" style={{ background: B.midnight, fontFamily: TITLE, fontWeight: 500 }}>
            <Marquee speed={42} separator="↗" items={['Investment & development', 'Industrial & logistics', 'Georgian ventures', 'Trust', 'Partnership', 'Long-term view', 'Makes space.']} />
          </div>
        </div>

        {/* the brand film at its own size */}
        <section className="px-1.5 pt-1.5"><div className="rounded-[10px] py-10 sm:py-14" style={{ background: B.paper }}><Wrap><Row items={[m.cover]} onOpen={setOpen} /></Wrap></div></section>

        <Band tone="white" no="01" name={tx('The brand', 'ბრენდი')} title={tx('Space for projects, partners and growth.', 'სივრცე პროექტებისთვის, პარტნიორებისა და ზრდისთვის.')}
          lead={tx('GV Capital is an investment and development holding. It starts with industrial and logistics space in Georgia.', 'GV Capital საინვესტიციო და განვითარების ჰოლდინგია. იწყებს ინდუსტრიული და ლოჯისტიკური სივრცით საქართველოში.')}
          pills={[tx('Trust', 'ნდობა'), tx('Partnership', 'პარტნიორობა'), tx('Long-term view', 'გრძელვადიანი ხედვა')]}>
          <Row items={[m.foundation, m.focus]} onOpen={setOpen} />
        </Band>

        <Band tone="emerald" no="02" name={tx('Logo', 'ლოგო')} title={tx('A mark that holds a room.', 'ნიშანი, რომელიც სივრცეს იჭერს.')}
          lead={tx('Italic, wide, built to move: the GV block reads at a glance on a wall, a flag or a favicon.', 'დახრილი, ფართო, მოძრაობისთვის აგებული: GV ბლოკი ერთი შეხედვით იკითხება კედელზე, დროშაზე თუ ფავიკონზე.')}>
          <Row items={[m.logo, m.wall]} onOpen={setOpen} />
        </Band>

        <Band tone="white" no="03" name={tx('Colour', 'ფერი')} title={tx('Colour System', 'ფერების სისტემა')}
          lead={tx('GV Emerald leads. Signal Orange is kept for small accents, never more than five percent.', 'წამყვანია GV Emerald. Signal Orange მხოლოდ პატარა აქცენტებისთვისაა, არაუმეტეს ხუთი პროცენტისა.')}>
          <Colours />
        </Band>

        <Band tone="mist" no="04" name={tx('Space', 'სივრცე')} title={tx('The office becomes the idea.', 'ოფისი თავად იქცევა იდეად.')}
          lead={tx('Logo walls, glass partitions and a wayfinding system built on the same angle as the mark.', 'ლოგოს კედლები, მინის ტიხრები და ნავიგაციის სისტემა ნიშნის იმავე კუთხეზე.')}>
          <div className="space-y-1.5">
            <Row items={[m.reception, m.campus]} onOpen={setOpen} />
            <Row items={[m.blade, m.wayfinding, m.corridor]} onOpen={setOpen} />
          </div>
        </Band>

        <Band tone="midnight" no="05" name={tx('Industrial & Logistics', 'ინდუსტრია და ლოჯისტიკა')} title={tx('The first vertical, the first proof.', 'პირველი მიმართულება, პირველი მტკიცებულება.')}
          lead={tx('Facades, flags and the fleet: one identity across space and movement.', 'ფასადები, დროშები და ავტოპარკი: ერთი იდენტობა სივრცესა და მოძრაობაში.')}>
          <div className="space-y-1.5">
            <Row items={[m.facade, m.flags]} onOpen={setOpen} />
            <Row items={[m.hardhat, m.fleet, m.packaging]} onOpen={setOpen} />
          </div>
        </Band>

        <Band tone="paper" no="06" name={tx('Everyday identity', 'ყოველდღიური იდენტობა')} title={tx('The mark holds up on every material.', 'ნიშანი ყველა მასალაზე მუშაობს.')}>
          <Row items={[m.card, m.folder, m.uniform, m.material]} onOpen={setOpen} />
        </Band>

        <Band tone="emerald" no="07" name={tx('Social', 'სოციალური მედია')} title={tx('Claim, proof, next move.', 'მტკიცება, საბუთი, შემდეგი ნაბიჯი.')}>
          <Row items={[m.s1, m.s2, m.s3, m.s4]} onOpen={setOpen} />
        </Band>

        <Band tone="mist" no="08" name={tx('Paper and screen', 'ქაღალდი და ეკრანი')} title={tx('One grid for print and slides.', 'ერთი ბადე ბეჭდვისა და სლაიდებისთვის.')}>
          <div className="max-w-[860px] space-y-1.5">
            <Row items={[m.cards, m.letterhead, m.document, m.profile]} onOpen={setOpen} />
            <Row items={[m.company, m.layouts]} onOpen={setOpen} />
          </div>
        </Band>

        {/* ── Close: midnight, the line, the link ───────────────────────── */}
        <section className="px-1.5 pt-1.5">
          <div className="rounded-[10px] py-24 sm:py-32 text-white" style={{ background: B.midnight }}>
            <Wrap>
              <RevealLines as="p" className="text-[13vw] sm:text-[9vw] lg:text-[120px] leading-[0.92] tracking-[-0.03em]" style={{ fontFamily: TITLE, fontWeight: 700 }}>
                <span>{tx('Makes', 'ქმნის')}</span>
                <span style={{ color: B.mint }}>{tx('space.', 'სივრცეს.')}<span style={{ color: B.orange }}>↗</span></span>
              </RevealLines>
              <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 border-t border-white/15 pt-6">
                <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[18px] sm:text-[22px] underline decoration-1 underline-offset-[6px] hover:text-[#B4D3D5]" style={{ fontFamily: TITLE, fontWeight: 500 }}>
                  {tx('The whole system lives online', 'მთელი სისტემა ონლაინაა')} <ArrowUpRight size={20} />
                </a>
                <div className="[&_*]:!font-[inherit]"><CtaLink /></div>
              </div>
            </Wrap>
          </div>
        </section>
      </article>

      <MoreCases current="/projects/gv-capital" />

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
