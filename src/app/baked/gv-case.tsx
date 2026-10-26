import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { ClipReveal, Parallax, RevealLines, Rise } from '../components/case-motion';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { CASES } from './cases';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';

/*
 * GV Capital: identity for an investment and development holding. The page
 * follows the brand's own proportions: a quiet mineral field, carbon type,
 * one emerald interval doing the work, and orange only as a signal.
 */

const P = '/cases/gv';
const CARBON = '#16232A';
const EMERALD = '#0A6670';
const ORANGE = '#FF5804';
const FIELD = '#EEEBE4';
const LIVE = 'https://gv-capital.vercel.app/';

type Shot = { key: string; w: number; h: number; en: string; ka: string };
const SHOTS: Shot[] = [
  { key: 'reception', w: 2400, h: 1350, en: 'Reception wall with the GV mark', ka: 'მისაღების კედელი GV ნიშნით' },
  { key: 'lounge', w: 2400, h: 1350, en: 'Lounge from above, emerald and carbon', ka: 'ლაუნჯი ზემოდან, ზურმუხტისფერი და ნახშირისფერი' },
  { key: 'overhead', w: 2400, h: 2400, en: 'Meeting corner from above', ka: 'შეხვედრის კუთხე ზემოდან' },
  { key: 'focus-office', w: 2400, h: 2133, en: 'A focus booth in the office', ka: 'ფოკუსის კაბინა ოფისში' },
  { key: 'direction', w: 2400, h: 1350, en: 'Wayfinding in the office', ka: 'ნავიგაცია ოფისში' },
  { key: 'corridor', w: 1744, h: 2336, en: 'Corridor with directional blades', ka: 'დერეფანი მიმართულების ნიშნებით' },
  { key: 'wayfinding', w: 1200, h: 1800, en: 'Layered wayfinding blade', ka: 'შრეებიანი ნავიგაციის ნიშანი' },
  { key: 'cards', w: 1744, h: 2336, en: 'Business cards', ka: 'სავიზიტო ბარათები' },
  { key: 'letterhead', w: 1200, h: 1697, en: 'Letterhead', ka: 'ბლანკი' },
  { key: 'document', w: 1200, h: 1697, en: 'Project proposal cover', ka: 'პროექტის შეთავაზების ყდა' },
  { key: 'profile', w: 1200, h: 1697, en: 'Company profile', ka: 'კომპანიის პროფილი' },
  { key: 'brochure', w: 1200, h: 1697, en: 'Space for your business brochure', ka: 'ბროშურა' },
  { key: 'company', w: 1280, h: 720, en: 'Company presentation', ka: 'კომპანიის პრეზენტაცია' },
  { key: 'layouts', w: 1280, h: 720, en: 'Presentation template', ka: 'პრეზენტაციის შაბლონი' },
  { key: 'digital', w: 1920, h: 1080, en: 'Mark on a warehouse corner at dusk', ka: 'ნიშანი საწყობის კუთხეზე, დაბინდებისას' },
  { key: 'folder', w: 1248, h: 1664, en: 'Folder', ka: 'საქაღალდე' },
  { key: 'packaging', w: 1086, h: 1448, en: 'Packaging tape and box', ka: 'შეფუთვის ლენტი და ყუთი' },
  { key: 'hardhat', w: 1086, h: 1448, en: 'Site hard hat', ka: 'სამშენებლო ჩაფხუტი' },
  { key: 'uniform', w: 1248, h: 1664, en: 'Uniform', ka: 'უნიფორმა' },
  { key: 'material', w: 1248, h: 1664, en: 'Embossed mark on fabric', ka: 'ამოტვიფრული ნიშანი ქსოვილზე' },
  { key: 'concrete', w: 720, h: 1280, en: 'Mark set in concrete', ka: 'ნიშანი ბეტონში' },
  { key: 'hoodie', w: 1536, h: 1024, en: 'Team hoodie', ka: 'გუნდის ჰუდი' },
  { key: 'facade', w: 1920, h: 1080, en: 'Warehouse facade at night', ka: 'საწყობის ფასადი ღამით' },
  { key: 'campus', w: 1920, h: 1080, en: 'Logistics campus at sunset', ka: 'ლოჯისტიკური კომპლექსი მზის ჩასვლისას' },
  { key: 'fleet', w: 1920, h: 1080, en: 'Fleet', ka: 'ავტოპარკი' },
  { key: 'flags', w: 1248, h: 1664, en: 'Flags', ka: 'დროშები' },
  { key: 'social-opportunities', w: 1080, h: 1350, en: 'Social post: space that creates opportunities', ka: 'პოსტი: სივრცე, რომელიც ქმნის შესაძლებლობებს' },
  { key: 'social-possibility', w: 1080, h: 1350, en: 'Social post: built around possibility', ka: 'პოსტი: შესაძლებლობის გარშემო' },
  { key: 'social-perspective', w: 1080, h: 1350, en: 'Social post: a long-term view', ka: 'პოსტი: გრძელვადიანი ხედვა' },
  { key: 'social-focus', w: 1080, h: 1350, en: 'Social post: built for focus', ka: 'პოსტი: ფოკუსისთვის' },
];
const idx = (k: string) => SHOTS.findIndex((s) => s.key === k);

function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full px-3 sm:px-5 lg:px-8 ${className}`}>{children}</div>;
}

function Photo({ k, onOpen, sizes = '(min-width: 768px) 33vw, 100vw', className = '', cover }: { k: string; onOpen: (i: number) => void; sizes?: string; className?: string; cover?: boolean }) {
  const { tx } = useI18n();
  const i = idx(k);
  const s = SHOTS[i];
  return (
    <button type="button" onClick={() => onOpen(i)} aria-label={`${tx(s.en, s.ka)}, ${tx('enlarge', 'გადიდება')}`}
      className={`group relative block w-full overflow-hidden rounded-[6px] bg-[#dcd8d0] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0A6670] ${cover ? 'h-full' : ''} ${className}`}>
      <img src={`${P}/${k}.jpg`} srcSet={s.w > 1200 ? `${P}/${k}-1200.jpg 1200w, ${P}/${k}.jpg ${s.w}w` : undefined} sizes={sizes} width={s.w} height={s.h}
        alt={tx(s.en, s.ka)} loading="lazy" decoding="async"
        className={`block w-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] ${cover ? 'h-full object-cover' : 'h-auto'}`} />
    </button>
  );
}

function Film({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <video src={src} poster={poster} muted loop playsInline autoPlay={!reduce} preload="metadata"
      className={`block w-full h-full object-cover rounded-[6px] ${className}`} />
  );
}



/* ── Visual-first building blocks ─────────────────────────────────────── */

/** a chapter marker: number and name on the left, one line on the right */
function Mark({ no, name, line, dark }: { no: string; name: string; line: string; dark?: boolean }) {
  return (
    <div className={`grid grid-cols-12 gap-x-6 items-baseline px-3 sm:px-5 lg:px-8 pt-24 sm:pt-32 pb-6 sm:pb-8 ${dark ? 'text-white' : ''}`}>
      <div className={`col-span-12 sm:col-span-3 text-[12px] uppercase tracking-[0.08em] ${dark ? 'text-white/55' : 'text-[#16232A]/55'}`}>
        <span className="tabular-nums" style={{ color: dark ? '#7fc4ca' : EMERALD }}>{no}</span>&nbsp;&nbsp;{name}
      </div>
      <RevealLines as="h2" className="col-span-12 sm:col-span-9 mt-2 sm:mt-0 text-[24px] sm:text-[34px] lg:text-[40px] leading-[1.08] tracking-[-0.02em]" style={{ fontWeight: 500 }}>
        <span>{line}</span>
      </RevealLines>
    </div>
  );
}

/** a full-bleed picture or film, revealed as it scrolls in */
function Bleed({ children, ratio = '16/9' }: { children: React.ReactNode; ratio?: string }) {
  return (
    <div className="px-1.5">
      <ClipReveal className="overflow-hidden rounded-[4px]"><div className="w-full" style={{ aspectRatio: ratio }}>{children}</div></ClipReveal>
    </div>
  );
}

/** a row of pictures, edge to edge with a hairline gap */
function Row({ keys, onOpen, ratio, cols }: { keys: string[]; onOpen: (i: number) => void; ratio: string; cols?: string }) {
  return (
    <div className={`px-1.5 pt-1.5 grid gap-1.5 ${cols ?? (keys.length === 2 ? 'grid-cols-2' : keys.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3')}`}>
      {keys.map((k, i) => (
        <Rise key={k} delay={i * 0.05} y={20} className={keys.length === 3 && i === 2 ? 'col-span-2 md:col-span-1' : ''}>
          <div style={{ aspectRatio: ratio }}><Photo k={k} onOpen={onOpen} className="!rounded-[4px]" sizes={keys.length === 2 ? '50vw' : '(min-width: 768px) 33vw, 50vw'} cover /></div>
        </Rise>
      ))}
    </div>
  );
}

export function GvCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: tx(s.en, s.ka), brand: `GV Capital, ${tx(s.en, s.ka)}` }));
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'GV Capital'],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Investment & development', 'ინვესტიცია და განვითარება')],
    [tx('Scope', 'სამუშაო'), tx('Brand concept, identity, guidelines', 'კონცეფცია, იდენტობა, გაიდლაინი')],
  ];

  return (
    <BakedShell>
      <SEO
        title="GV Capital | Brand Identity Case Study"
        description="GV Capital makes space: brand concept, identity and live guidelines for a Georgian investment and development holding."
        keywords="GV Capital, brand identity, brand guidelines, investment holding, logistics, Georgia, Active Interval, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/gv-capital" />

      <article className="pt-14 sm:pt-[52px]" style={{ color: CARBON }}>

        {/* ── Hero: the brand film, full screen, name over it ───────────── */}
        <header className="px-1.5">
          <div className="relative h-[calc(100svh-64px)] min-h-[520px] overflow-hidden rounded-[4px] bg-[#16232A] text-white">
            <Parallax distance={40} className="absolute inset-[-40px_0]"><Film src={`${P}/cover.mp4`} poster={`${P}/facade.jpg`} className="!rounded-none" /></Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6 text-[13px]">
              <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[12px] hover:bg-white/25">{tx('Live guidelines', 'ცოცხალი გაიდლაინი')} <ArrowUpRight size={12} /></a>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
              <RevealLines as="h1" className="text-[48px] sm:text-[88px] lg:text-[120px] leading-[0.9] tracking-[-0.04em]" style={{ fontWeight: 700 }}>
                <span>GV Capital</span>
                <span className="text-[#7fc4ca]">{tx('makes space.', 'ქმნის სივრცეს.')}</span>
              </RevealLines>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-t border-white/20 pt-4 text-[12.5px]">
                {facts.map(([k, v]) => (<div key={k}><div className="text-white/55">{k}</div><div className="mt-0.5 text-white/90">{v}</div></div>))}
              </div>
            </div>
          </div>
        </header>

        {/* ── 01 The idea: the strongest picture first ─────────────────── */}
        <Mark no="01" name={tx('Idea', 'იდეა')} line={tx('Space that creates opportunities.', 'სივრცე, რომელიც ქმნის შესაძლებლობებს.')} />
        <Bleed><Photo k="reception" onOpen={setOpen} sizes="100vw" className="!rounded-none h-full" cover /></Bleed>
        <Row keys={['concrete', 'material', 'hoodie']} ratio="4/5" onOpen={setOpen} />

        {/* ── 03 Holding applications ──────────────────────────────────── */}
        <Mark no="02" name={tx('Holding', 'ჰოლდინგი')} line={tx('Paper and screen on one grid.', 'ქაღალდი და ეკრანი ერთ ბადეზე.')} />
        <Row keys={['cards', 'letterhead', 'document', 'profile']} ratio="3/4" onOpen={setOpen} />
        <Row keys={['company', 'layouts']} ratio="16/9" onOpen={setOpen} />

        {/* ── 04 Space ─────────────────────────────────────────────────── */}
        <Mark no="03" name={tx('Space', 'სივრცე')} line={tx('The office becomes the idea.', 'ოფისი თავად იქცევა იდეად.')} />
        <Bleed><Film src={`${P}/reception.mp4`} poster={`${P}/corridor.jpg`} className="!rounded-none" /></Bleed>
        <Row keys={['corridor', 'wayfinding', 'focus-office']} ratio="3/4" onOpen={setOpen} />
        <Row keys={['lounge', 'direction']} ratio="16/9" onOpen={setOpen} />

        {/* ── 05 Objects ───────────────────────────────────────────────── */}
        <Mark no="04" name={tx('Objects', 'საგნები')} line={tx('The mark holds up on every material.', 'ნიშანი ყველა მასალაზე მუშაობს.')} />
        <Row keys={['folder', 'packaging', 'hardhat', 'uniform']} ratio="3/4" onOpen={setOpen} />

        {/* ── 06 First vertical ────────────────────────────────────────── */}
        <Mark no="05" name={tx('Industrial & Logistics', 'ინდუსტრია და ლოჯისტიკა')} line={tx('The first vertical, the first proof.', 'პირველი მიმართულება, პირველი მტკიცებულება.')} />
        <Bleed><Film src={`${P}/facade.mp4`} poster={`${P}/facade.jpg`} className="!rounded-none" /></Bleed>
        <div className="px-1.5 pt-1.5 grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <Rise className="md:col-span-4"><div className="aspect-[3/4] overflow-hidden rounded-[4px]"><Film src={`${P}/flags.mp4`} poster={`${P}/flags.jpg`} className="!rounded-none" /></div></Rise>
          <div className="md:col-span-8 grid grid-rows-2 gap-1.5">
            <Rise delay={0.05}><div className="h-full min-h-[200px]"><Photo k="campus" onOpen={setOpen} sizes="66vw" className="!rounded-[4px] h-full" cover /></div></Rise>
            <Rise delay={0.1}><div className="h-full min-h-[200px]"><Photo k="fleet" onOpen={setOpen} sizes="66vw" className="!rounded-[4px] h-full" cover /></div></Rise>
          </div>
        </div>

        {/* ── 07 Social ────────────────────────────────────────────────── */}
        <Mark no="06" name={tx('Social', 'სოციალური მედია')} line={tx('Claim, proof, next move.', 'მტკიცება, საბუთი, შემდეგი ნაბიჯი.')} />
        <Row keys={['social-opportunities', 'social-possibility', 'social-perspective', 'social-focus']} ratio="4/5" onOpen={setOpen} />

        {/* ── Close ────────────────────────────────────────────────────── */}
        <div className="px-3 sm:px-5 lg:px-8 py-28 sm:py-40 grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <RevealLines as="p" className="col-span-12 lg:col-span-7 text-[28px] sm:text-[44px] leading-[1.05] tracking-[-0.025em]" style={{ fontWeight: 500 }}>
            <span>{tx('The whole system lives online.', 'მთელი სისტემა ონლაინ ცხოვრობს.')}</span>
            <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline decoration-2 underline-offset-[6px]" style={{ color: EMERALD }}>gv-capital.vercel.app <ArrowUpRight size={28} /></a>
          </RevealLines>
          <div className="col-span-12 lg:col-span-5 lg:justify-self-end"><CtaLink /></div>
        </div>
      </article>

      <MoreCases current="/projects/gv-capital" />

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
