import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { CaseHeroTarget } from '../components/case-transition';
import { SEO } from '../components/seo';
import { RevealLines, Rise } from '../components/case-motion';
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

/** a chapter marker: number and name on the left, one line on the right */
function Mark({ no, name, line }: { no: string; name: string; line: string }) {
  return (
    <Wrap className="pt-24 sm:pt-32 pb-6 sm:pb-8">
      <div className="grid grid-cols-12 gap-x-6 items-baseline">
        <div className="col-span-12 sm:col-span-3 text-[12px] uppercase tracking-[0.08em] text-[#16232A]/55">
          <span className="tabular-nums" style={{ color: EMERALD }}>{no}</span>&nbsp;&nbsp;{name}
        </div>
        <RevealLines as="h2" className="col-span-12 sm:col-span-9 mt-2 sm:mt-0 text-[24px] sm:text-[32px] lg:text-[36px] leading-[1.1] tracking-[-0.02em]" style={{ fontWeight: 500 }}>
          <span>{line}</span>
        </RevealLines>
      </div>
    </Wrap>
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

      <article className="pt-14 sm:pt-[52px]" style={{ color: CARBON }}>

        {/* ── Hero: name, facts, then the brand film at its own size ────── */}
        <Wrap className="pt-10 sm:pt-14">
          <div className="flex items-start justify-between text-[13px]">
            <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-[#16232A]/60 hover:text-[#16232A] transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
            <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#16232A]/20 px-3 py-1 text-[12px] hover:bg-[#16232A]/5">{tx('Live guidelines', 'ცოცხალი გაიდლაინი')} <ArrowUpRight size={12} /></a>
          </div>
          <RevealLines as="h1" className="mt-10 text-[44px] sm:text-[72px] lg:text-[96px] leading-[0.92] tracking-[-0.04em]" style={{ fontWeight: 700 }}>
            <span>GV Capital</span>
            <span style={{ color: EMERALD }}>{tx('makes space.', 'ქმნის სივრცეს.')}</span>
          </RevealLines>
          <div className="mt-8 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-t border-[#16232A]/15 pt-4 text-[12.5px]">
            {facts.map(([k, v]) => (<div key={k}><div className="text-[#16232A]/55">{k}</div><div className="mt-0.5">{v}</div></div>))}
          </div>
          <Row items={[m.cover]} onOpen={setOpen} />
        </Wrap>

        <Mark no="01" name={tx('Idea', 'იდეა')} line={tx('Space that creates opportunities.', 'სივრცე, რომელიც ქმნის შესაძლებლობებს.')} />
        <Wrap><Row items={[m.foundation, m.focus]} onOpen={setOpen} /></Wrap>

        <Mark no="02" name={tx('Logo', 'ლოგო')} line={tx('A mark that holds a room.', 'ნიშანი, რომელიც სივრცეს იჭერს.')} />
        <Wrap><Row items={[m.logo, m.wall]} onOpen={setOpen} /></Wrap>

        <Mark no="03" name={tx('Space', 'სივრცე')} line={tx('The office becomes the idea.', 'ოფისი თავად იქცევა იდეად.')} />
        <Wrap className="space-y-1.5">
          <Row items={[m.reception, m.campus]} onOpen={setOpen} />
          <Row items={[m.blade, m.wayfinding, m.corridor]} onOpen={setOpen} />
        </Wrap>

        <Mark no="04" name={tx('Industrial & Logistics', 'ინდუსტრია და ლოჯისტიკა')} line={tx('The first vertical, the first proof.', 'პირველი მიმართულება, პირველი მტკიცებულება.')} />
        <Wrap className="space-y-1.5">
          <Row items={[m.facade, m.flags]} onOpen={setOpen} />
          <Row items={[m.hardhat, m.fleet, m.packaging]} onOpen={setOpen} />
        </Wrap>

        <Mark no="05" name={tx('Everyday', 'ყოველდღიური')} line={tx('The mark holds up on every material.', 'ნიშანი ყველა მასალაზე მუშაობს.')} />
        <Wrap><Row items={[m.card, m.folder, m.uniform, m.material]} onOpen={setOpen} /></Wrap>

        <Mark no="06" name={tx('Social', 'სოციალური მედია')} line={tx('Claim, proof, next move.', 'მტკიცება, საბუთი, შემდეგი ნაბიჯი.')} />
        <Wrap><Row items={[m.s1, m.s2, m.s3, m.s4]} onOpen={setOpen} /></Wrap>

        <Mark no="07" name={tx('Paper and screen', 'ქაღალდი და ეკრანი')} line={tx('One grid for print and slides.', 'ერთი ბადე ბეჭდვისა და სლაიდებისთვის.')} />
        <Wrap>
          <div className="max-w-[860px] space-y-1.5">
            <Row items={[m.cards, m.letterhead, m.document, m.profile]} onOpen={setOpen} />
            <Row items={[m.company, m.layouts]} onOpen={setOpen} />
          </div>
        </Wrap>

        {/* ── Close ────────────────────────────────────────────────────── */}
        <Wrap className="py-28 sm:py-36">
          <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
            <RevealLines as="p" className="col-span-12 lg:col-span-7 text-[28px] sm:text-[40px] leading-[1.05] tracking-[-0.025em]" style={{ fontWeight: 500 }}>
              <span>{tx('The whole system lives online.', 'მთელი სისტემა ონლაინ ცხოვრობს.')}</span>
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline decoration-2 underline-offset-[6px]" style={{ color: EMERALD }}>gv-capital.vercel.app <ArrowUpRight size={26} /></a>
            </RevealLines>
            <div className="col-span-12 lg:col-span-5 lg:justify-self-end"><CtaLink /></div>
          </div>
        </Wrap>
      </article>

      <MoreCases current="/projects/gv-capital" />

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
