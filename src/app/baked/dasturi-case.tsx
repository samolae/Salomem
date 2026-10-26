import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { MoreCases } from './case-studies';
import { CASES } from './cases';
import { Anatomy, Construction, LabelRow, MotionStyles, Swatches } from './dasturi-motion';

/*
 * Dasturi. One bold thing: the ibex in liquid chrome, lit by the pointer.
 * Everything else is quiet and takes its cues from the brand itself: the
 * review's own black, champagne gold and bordeaux, the travertine the
 * bottles stand on, and a Georgian serif close to the label's lettering.
 * The middle of the page lets you work the label system yourself: pick a
 * varietal, switch the edition.
 */

const P = '/cases/dasturi';
const BLACK = '#191A17';
const GOLD = '#C0A16D';
const BORDEAUX = '#7A1C30';
const STONE = '#E6DED1'; // the backdrop the labels were shot on
const IVORY = '#F0EADF';

const SERIF = '"Noto Serif Georgian", Georgia, serif';
const LATIN = '"Marcellus", Georgia, serif';

type Shot = { key: string; w: number; h: number; alt: string; title: string };
const SHOTS: Shot[] = [
  { key: 'lineup', w: 2000, h: 1324, title: 'ჯიშების ოჯახი', alt: 'დასტურის ხუთი ბოთლი წითელ კედელთან, ტრავერტინის თაროზე' },
  { key: 'saperavi', w: 1549, h: 1017, title: 'საფერავი', alt: 'საფერავის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'kisi', w: 1549, h: 1017, title: 'ქისი', alt: 'ქისის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'terrace-gold', w: 2000, h: 1324, title: 'საწური, ქისი, ცოლიკაური', alt: 'სამი ბოთლი ქვის ტერასაზე, მთების ფონზე' },
  { key: 'duo-gold', w: 2000, h: 1324, title: 'საფერავი და ქისი', alt: 'საფერავი და ქისი ქვის კიბეზე, მზის შუქში' },
  { key: 'capsule', w: 1549, h: 1150, title: 'კაფსული', alt: 'ბოთლის ყელი, ბორდოსფერი კაფსულა ოქროსფერი წარწერით' },
  { key: 'typefaces', w: 2000, h: 1250, title: 'ტიპოგრაფია', alt: 'დასტურის შრიფტები: DM Themestia, GA Lazi, Marcellus, Avenir Next Georgian' },
  { key: 'terrace-bordeaux', w: 2000, h: 1324, title: 'ბორდოსფერი ოჯახი', alt: 'სამი ბოთლი ბორდოსფერი ეტიკეტებით ქვის ტერასაზე' },
  { key: 'duo-bordeaux', w: 1549, h: 1017, title: 'საფერავი და ქისი, ბორდო', alt: 'საფერავი და ქისი ბორდოსფერი ეტიკეტებით ქვის კიბეზე' },
  { key: 'saperavi-bordeaux', w: 1549, h: 1017, title: 'საფერავი, ბორდო', alt: 'საფერავი ბორდოსფერი ეტიკეტით ტრავერტინზე' },
];
const at = (key: string) => SHOTS.findIndex((s) => s.key === key);

const FULL = '(min-width: 1280px) 1280px, 100vw';
const HALF = '(min-width: 768px) 50vw, 100vw';

function Photo({ k, onOpen, sizes = FULL, cover }: { k: string; onOpen: (i: number) => void; sizes?: string; cover?: boolean }) {
  const i = at(k);
  const s = SHOTS[i];
  return (
    <button type="button" onClick={() => onOpen(i)} className={`group block w-full overflow-hidden cursor-zoom-in outline-none focus-visible:shadow-[inset_0_0_0_2px_#C0A16D] ${cover ? 'h-full' : ''}`} aria-label={`${s.title}, გადიდება`}>
      <img
        src={`${P}/${k}.jpg`}
        srcSet={`${P}/${k}-1000.jpg 1000w, ${P}/${k}.jpg ${s.w}w`}
        sizes={sizes}
        width={s.w}
        height={s.h}
        alt={s.alt}
        loading="lazy"
        decoding="async"
        className={`ds-parallax block w-full ${cover ? 'h-full object-cover' : 'h-auto'}`}
      />
    </button>
  );
}

/* Elegant type: small light headings, short justified columns */
const H2 = 'text-[30px] sm:text-[44px] leading-[1.12] tracking-[-0.01em]';
const COL = 'text-[15px] leading-[1.8] text-left tracking-[0.01em]';

/* Browsers have no Georgian hyphenation, so justified lines open wide gaps.
   Offer soft breaks at the common syllable boundary V-CV, keeping at least
   two letters before and three after the break. */
const VOW = 'აეიოუ';
const isKa = (c: string) => c >= '\u10D0' && c <= '\u10FA';
function hy(text: string) {
  return text.replace(/[\u10D0-\u10FA]{6,}/g, (w) => {
    let out = w[0];
    for (let i = 1; i < w.length; i++) {
      const breakHere = i >= 2 && w.length - i >= 3 && VOW.includes(w[i - 1]) && isKa(w[i]) && !VOW.includes(w[i]) && VOW.includes(w[i + 1] ?? '');
      out += (breakHere ? '\u00AD' : '') + w[i];
    }
    return out;
  });
}
function Col({ children, className = '', dark }: { children: string; className?: string; dark?: boolean }) {
  return <p lang="ka" className={`${COL} max-w-[380px] ${dark ? 'text-[#191A17]/65' : 'text-white/60'} ${className}`}>{hy(children)}</p>;
}


/* ── Layout primitives: one canvas, one grid ───────────────────────── */

/** the content width every section shares */
function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-14 ${className}`}>{children}</div>;
}

/** a chapter opener: index + name on the left, heading in the middle, a justified column on the right */
function Chapter({ no, name, title, children, id }: { no: string; name: string; title: string; children: string; id: string }) {
  return (
    <Wrap className="pt-28 sm:pt-40 pb-14 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6 items-start">
        <div className="lg:col-span-3 flex items-baseline gap-3 text-[13px]" style={{ color: GOLD }}>
          <span className="tabular-nums">{no}</span><span className="text-white/45">{name}</span>
        </div>
        <h2 id={id} className={`lg:col-span-4 ${H2}`} style={{ fontFamily: SERIF, fontWeight: 300 }}>{title}</h2>
        <div className="lg:col-span-5 lg:pt-3"><Col className="!max-w-[460px]">{children}</Col></div>
      </div>
    </Wrap>
  );
}

function LabelSystem() {
  const [edition, setEdition] = useState<'gold' | 'bordeaux'>('gold');
  return (
    <Wrap>
      <div className="flex justify-end pb-8">
        <div className="inline-flex rounded-full p-1 bg-white/[0.06] ring-1 ring-inset ring-white/10" role="radiogroup" aria-label="გამოცემა">
          {([['gold', 'ოქროსფერი', GOLD], ['bordeaux', 'ბორდოსფერი', BORDEAUX]] as const).map(([id, label, c]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={edition === id}
              onClick={() => setEdition(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#C0A16D] ${edition === id ? 'bg-[#F0EADF] text-[#191A17]' : 'text-white/60 hover:text-white'}`}
            >
              <span className="w-2.5 h-2.5 rounded-full ring-1 ring-inset ring-black/10" style={{ background: c }} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <LabelRow key={edition} edition={edition} tone="dark" />
    </Wrap>
  );
}

const swatches = [
  { name: 'Champagne Gold', ka: 'ოქროსფერი', role: 'ეტიკეტის პანელი', hex: '#C0A16D', ink: BLACK },
  { name: 'Wine Bordeaux', ka: 'ბორდოსფერი', role: 'კაფსული, მეორე გამოცემა', hex: '#7A1C30', ink: IVORY },
  { name: 'Soft Silver', ka: 'ვერცხლისფერი', role: 'დამატებითი', hex: '#A9ABAE', ink: BLACK },
  { name: 'Deep Black', ka: 'შავი', role: 'არშია, ტექსტი', hex: '#191A17', ink: IVORY },
];

const facts: [string, string][] = [
  ['კლიენტი', 'დასტური'],
  ['წელი', '2026'],
  ['სერვისი', 'ლოგო, ეტიკეტები, შეფუთვა'],
  ['ჯიშები', 'საფერავი, მანავის მწვანე, ქისი, საწური, ცოლიკაური'],
];

export function DasturiCase() {
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: s.alt, brand: `დასტური, ${s.title}` }));

  return (
    <BakedShell>
      <SEO
        title="Dasturi | Wine Brand Identity Case Study"
        description="დასტური: ქართული ღვინის ბრენდის იდენტობა, ეტიკეტები და შეფუთვა. კავკასიური ჯიხვი, ოქროსფერი და ბორდოსფერი ეტიკეტები ხუთი ჯიშისთვის."
        keywords="Dasturi, დასტური, wine branding, Georgian wine, label design, packaging, Saperavi, Kisi, brand identity, Salome Mosiava"
        type="article"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Marcellus&family=Noto+Serif+Georgian:wght@300;400&display=swap" />
      <CaseHeroTarget path="/projects/dasturi" />
      <MotionStyles />

      <article className="px-1.5 pt-14 sm:pt-[52px]">
        <div className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>

          {/* ── Hero: the ibex in chrome ─────────────────────────────── */}
          <header className="relative min-h-[calc(100svh-64px)] flex flex-col">
            <Wrap className="flex items-start justify-between pt-6 sm:pt-8 text-[13px]">
              <Link to="/work" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
                <ArrowLeft size={13} /> ნამუშევრები
              </Link>
              <span className="hidden sm:inline text-white/35">ბრენდის იდენტობა</span>
            </Wrap>
            <div className="flex-1 flex items-center justify-center px-6 py-10">
<video
                src={`${P}/chrome-logo.mp4`}
                poster={`${P}/chrome-logo.jpg`}
                muted loop playsInline autoPlay preload="auto"
                aria-label="დასტურის ლოგო: ჯიხვი და სიტყვანიშანი, ქრომში"
                className="h-[min(68svh,640px)] aspect-square object-cover"
                style={{ mixBlendMode: 'lighten' }} // the film's near-black melts into the page
              />
            </div>
            <Wrap className="pb-8 sm:pb-10">
              <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-5 pt-6 border-t border-white/10 text-[13px]">
                <h1 className="col-span-2 lg:col-span-4 text-[20px] sm:text-[22px] leading-[1.25]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                  დასტური, ქართული ღვინის ბრენდი
                </h1>
                {facts.map(([k, v], i) => (
                  <div key={k} className={['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-2', 'col-span-2 lg:col-span-3'][i]}>
                    <div style={{ color: GOLD }}>{k}</div>
                    <div className="mt-1 text-white/65 leading-[1.5]">{v}</div>
                  </div>
                ))}
              </div>
            </Wrap>
          </header>

          {/* ── Statement ────────────────────────────────────────────── */}
          <Wrap className="pt-28 sm:pt-40 pb-20 sm:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
              <p className="lg:col-start-4 lg:col-span-8 text-[28px] sm:text-[44px] lg:text-[52px] leading-[1.18] tracking-[-0.01em]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                ნიშნად ავირჩიეთ კავკასიური ჯიხვი: მშვიდი, ამაყი დგომით და მომრგვალებული რქებით.
              </p>
              <div className="lg:col-start-4 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                <Col className="!max-w-none">ოქროსფერი პანელი, შავი არშია და წითელი ჯვარი ხუთ ჯიშს ერთ ოჯახად აერთიანებს, თითოეული კი თავისი ღვინის ფერს ინარჩუნებს.</Col>
              </div>
            </div>
          </Wrap>
          <Photo k="lineup" onOpen={setOpen} />

          {/* ── 01 Mark ──────────────────────────────────────────────── */}
          <Chapter no="01" name="ნიშანი" id="build" title="ჯიხვი, აგებული წრის რკალებზე">
            რქებში სამი რკალია, R 160, R 82 და R 64. თეთრად მონიშნულია მოხაზულობის ის მონაკვეთი, რომელსაც წრე ზუსტად ემთხვევა. თავისუფალი სივრცე ყველა მხარეს 1X-ია, DASTURI-ს ასოს სიმაღლე.
          </Chapter>
          <Wrap>
            <div className="mx-auto max-w-[min(640px,calc((100svh-120px)*0.81))]"><Construction /></div>
          </Wrap>
          <Wrap className="pt-20 sm:pt-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-4 items-end pb-2">
              <div className="lg:col-span-3 text-[13px] text-white/45">სიტყვანიშანი</div>
              <div className="lg:col-span-5 text-[15px] text-white/70" style={{ fontFamily: SERIF }}>ასოები ერთ ფუძის ხაზზე, რბილი მრუდებით</div>
            </div>
            <Anatomy />
          </Wrap>

          {/* ── 02 Label ─────────────────────────────────────────────── */}
          <Chapter no="02" name="ეტიკეტი" id="system" title="ხუთი ჯიში, ერთი ოჯახი">
            პანელი, არშია და ჯვარი ყველა ბოთლზე ერთია. იცვლება ჯიშის სახელი და წელი. ოქროსფერ გამოცემაში ჯიხვი გამჭვირვალე ჭრილია და ბოთლის ღვინის ფერს იღებს.
          </Chapter>
          <LabelSystem />
          <div className="pt-24 sm:pt-32">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="md:aspect-[3/2]"><Photo k="saperavi" onOpen={setOpen} sizes={HALF} cover /></div>
              <div className="md:aspect-[3/2]"><Photo k="kisi" onOpen={setOpen} sizes={HALF} cover /></div>
            </div>
            <Photo k="terrace-gold" onOpen={setOpen} />
          </div>

          {/* ── 03 Craft ─────────────────────────────────────────────── */}
          <Chapter no="03" name="დეტალები" id="craft" title="ოქროს ფოლგა ბორდოს კაფსულაზე">
            დასტური და DASTURI ვერტიკალურად, ისევე როგორც ეტიკეტის არშიაზე. ბოთლი თაროზე ორივე ანბანით იკითხება.
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-5 overflow-hidden rounded-[4px] md:aspect-[4/5]"><Photo k="capsule" onOpen={setOpen} sizes="(min-width: 768px) 40vw, 100vw" cover /></div>
              <div className="md:col-span-7 overflow-hidden rounded-[4px] md:aspect-[7/5]"><Photo k="duo-gold" onOpen={setOpen} sizes="(min-width: 768px) 56vw, 100vw" cover /></div>
            </div>
          </Wrap>

          {/* ── 04 Colour and type ───────────────────────────────────── */}
          <Chapter no="04" name="ფერი და შრიფტი" id="colour" title="ოთხი ფერი, ოთხი შრიფტი">
            ოქროსფერი და ბორდოსფერი ძირითადია, ვერცხლისფერი დამატებითი. სათაურებზე DM Themestia, ჯიშის სახელზე GA Lazi, ლათინურზე Marcellus, ტექსტზე Avenir Next Georgian.
          </Chapter>
          <Wrap>
            <Swatches items={swatches} />
          </Wrap>
          <Wrap className="pt-2"><div className="rounded-[4px] overflow-hidden ring-1 ring-inset ring-white/10"><Photo k="typefaces" onOpen={setOpen} sizes="(min-width: 1240px) 1140px, 100vw" /></div></Wrap>

          {/* ── 05 Bordeaux ──────────────────────────────────────────── */}
          <Chapter no="05" name="მეორე გამოცემა" id="bordeaux" title="იგივე სისტემა, ბორდოსფერში">
            ბადე, არშია და ქვედა ზოლი უცვლელია. პანელი ბორდოსფერია, ჯიხვი კი გაუმჭვირვალე ოქრო, ამიტომ ორივე ხაზი ერთ თაროზე ერთ ოჯახად დგას.
          </Chapter>
          <Photo k="terrace-bordeaux" onOpen={setOpen} />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:aspect-[3/2]"><Photo k="duo-bordeaux" onOpen={setOpen} sizes={HALF} cover /></div>
            <div className="md:aspect-[3/2]"><Photo k="saperavi-bordeaux" onOpen={setOpen} sizes={HALF} cover /></div>
          </div>

          {/* ── Close ────────────────────────────────────────────────── */}
          <Wrap className="py-28 sm:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
              <p className="lg:col-start-4 lg:col-span-6 text-[28px] sm:text-[40px] leading-[1.2] tracking-[-0.01em]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                ახალი ჯიში იგივე წესით დაემატება: პანელი, ჯიხვი და სახელი.
              </p>
              <div className="lg:col-span-3 lg:justify-self-end"><CtaLink /></div>
            </div>
          </Wrap>
        </div>
      </article>

      <MoreCases current="/projects/dasturi" />

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
