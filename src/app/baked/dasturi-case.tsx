import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { CASES } from './cases';
import { ChromeLogo } from './chrome-logo';
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
  { key: 'typefaces', w: 2000, h: 1492, title: 'ტიპოგრაფია', alt: 'დასტურის შრიფტები: DM Themestia, GA Lazi, Marcellus, Avenir Next Georgian' },
  { key: 'terrace-bordeaux', w: 2000, h: 1324, title: 'ბორდოსფერი ოჯახი', alt: 'სამი ბოთლი ბორდოსფერი ეტიკეტებით ქვის ტერასაზე' },
  { key: 'duo-bordeaux', w: 1549, h: 1017, title: 'საფერავი და ქისი, ბორდო', alt: 'საფერავი და ქისი ბორდოსფერი ეტიკეტებით ქვის კიბეზე' },
  { key: 'saperavi-bordeaux', w: 1549, h: 1017, title: 'საფერავი, ბორდო', alt: 'საფერავი ბორდოსფერი ეტიკეტით ტრავერტინზე' },
  { key: 'duo-satsuri', w: 1549, h: 1017, title: 'საწური და ცოლიკაური', alt: 'საწური და ცოლიკაური ქვის კიბეზე' },
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
const H2 = 'text-[24px] sm:text-[30px] leading-[1.2]';
const COL = 'text-[13.5px] leading-[1.85] text-justify [hyphens:manual] [text-align-last:left] tracking-[0.01em]';

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
  return <p lang="ka" className={`${COL} max-w-[360px] ${dark ? 'text-[#191A17]/65' : 'text-white/60'} ${className}`}>{hy(children)}</p>;
}

/* ── The label family: rise, foil, switch the edition ─────────────────── */

function LabelSystem() {
  const [edition, setEdition] = useState<'gold' | 'bordeaux'>('gold');
  return (
    <section aria-labelledby="system" className="rounded-md overflow-hidden" style={{ background: STONE, color: BLACK }}>
      <div className="px-7 sm:px-12 lg:px-[9%] pt-16 sm:pt-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
        <h2 id="system" className={H2} style={{ fontFamily: SERIF, fontWeight: 300 }}>
          ხუთი ჯიში, ერთი ოჯახი
        </h2>
        <div>
          <Col dark>პანელი, არშია და ჯვარი ყველა ბოთლზე ერთია. იცვლება მხოლოდ ჯიშის სახელი და წელი.</Col>
          <div className="mt-6 inline-flex rounded-full p-1 bg-[#191A17]/10" role="radiogroup" aria-label="გამოცემა">
            {([['gold', 'ოქროსფერი', GOLD], ['bordeaux', 'ბორდოსფერი', BORDEAUX]] as const).map(([id, label, c]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={edition === id}
                onClick={() => setEdition(id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#191A17] ${edition === id ? 'bg-[#191A17] text-white' : 'text-[#191A17]/70 hover:text-[#191A17]'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 sm:px-12 lg:px-[6%] pt-16 pb-20 sm:pb-28">
        <LabelRow key={edition} edition={edition} />
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

const swatches = [
  { name: 'Champagne Gold', ka: 'ოქროსფერი', role: 'ეტიკეტის პანელი', hex: '#C0A16D', ink: BLACK },
  { name: 'Wine Bordeaux', ka: 'ბორდოსფერი', role: 'კაფსული, მეორე გამოცემა', hex: '#7A1C30', ink: IVORY },
  { name: 'Soft Silver', ka: 'ვერცხლისფერი', role: 'დამატებითი', hex: '#A9ABAE', ink: BLACK },
  { name: 'Deep Black', ka: 'შავი', role: 'არშია, ტექსტი', hex: '#191A17', ink: IVORY },
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

      <div className="px-1.5 pt-14 sm:pt-[52px] space-y-1.5">
        {/* ── Hero: the ibex in chrome ─────────────────────────────── */}
        <header className="relative rounded-md overflow-hidden min-h-[calc(100svh-64px)] flex flex-col" style={{ background: BLACK, color: IVORY }}>
          <div className="flex items-start justify-between p-5 sm:p-8 text-[13px]">
            <Link to="/work" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={13} /> ნამუშევრები
            </Link>
            <span className="hidden sm:inline text-white/40">გაამოძრავე კურსორი</span>
          </div>
          <div className="flex-1 flex items-center justify-center px-6">
            <ChromeLogo
              src={`${P}/ibex-height.png`}
              fallback={`${P}/ibex-gold.png`}
              alt="დასტურის ლოგო: ჯიხვი და სიტყვანიშანი, ქრომში"
              className="h-[min(64svh,620px)] aspect-[1285/1693]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end p-5 sm:p-8">
            <h1 className="text-[22px] sm:text-[28px] leading-[1.2]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
              დასტური, ქართული ღვინის ბრენდი
            </h1>
            <p className="text-[14px] text-white/55 sm:text-right">ლოგო, ეტიკეტები და შეფუთვა<br />2026</p>
          </div>
        </header>

        {/* ── Opening ──────────────────────────────────────────────── */}
        <section aria-label="პროექტის შესახებ" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <div className="px-6 sm:px-12 lg:px-[9%] py-16 sm:py-24 grid grid-cols-2 lg:grid-cols-[1fr_1fr_340px_340px] gap-x-10 gap-y-8">
            <dl className="contents text-[13px]">
              {[['კლიენტი', 'დასტური'], ['სერვისი', 'ლოგო, ეტიკეტები, შეფუთვა']].map(([k, val]) => (
                <div key={k}><dt style={{ color: GOLD }}>{k}</dt><dd className="mt-1 text-white/70">{val}</dd></div>
              ))}
            </dl>
            <Col className="col-span-2 lg:col-span-1">დასტური ქართული ღვინის ახალი ბრენდია. ნიშნად ავირჩიეთ კავკასიური ჯიხვი: მშვიდი, ამაყი დგომით და მომრგვალებული რქებით.</Col>
            <Col className="col-span-2 lg:col-span-1">ოქროსფერი პანელი, შავი არშია და წითელი ჯვარი ხუთ ჯიშს ერთ ოჯახად აერთიანებს, თითოეული კი თავისი ღვინის ფერს ინარჩუნებს.</Col>
          </div>
          <Photo k="lineup" onOpen={setOpen} />
        </section>

        {/* ── Construction ─────────────────────────────────────────── */}
        <section aria-labelledby="build" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] items-end">
            <div className="px-7 sm:px-12 lg:pl-[18%] pt-16 lg:pb-24">
              <h2 id="build" className={H2} style={{ fontFamily: SERIF, fontWeight: 300 }}>კონსტრუქცია</h2>
              <Col className="mt-5">ჯიხვი წრის რკალებზეა აწყობილი: რქებში R 160, R 82 და R 64. თეთრად მონიშნულია მონაკვეთი, რომელსაც წრე ემთხვევა. თავისუფალი სივრცე 1X-ია.</Col>
            </div>
            <div className="px-4 sm:px-10 py-12 lg:py-16"><Construction /></div>
          </div>
        </section>

        {/* ── Wordmark anatomy ─────────────────────────────────────── */}
        <section aria-labelledby="anatomy" className="rounded-md overflow-hidden" style={{ background: BORDEAUX, color: IVORY }}>
          <div className="px-7 sm:px-12 lg:px-[9%] pt-16 sm:pt-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <h2 id="anatomy" className={H2} style={{ fontFamily: SERIF, fontWeight: 300 }}>სიტყვანიშანი</h2>
            <Col className="!text-white/70">ასოები ერთ ფუძის ხაზზე დგას. რბილი მრუდები ჯიხვის რქების რიტმს იმეორებს.</Col>
          </div>
          <div className="px-4 sm:px-10 lg:px-[6%] py-14 sm:py-20"><Anatomy /></div>
        </section>

        {/* ── Label family ─────────────────────────────────────────── */}
        <LabelSystem />

        {/* ── Gold line in the world ───────────────────────────────── */}
        <section aria-label="ფოტოები" className="rounded-md overflow-hidden" style={{ background: BLACK }}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:aspect-[3/2]"><Photo k="saperavi" onOpen={setOpen} sizes={HALF} cover /></div>
            <div className="md:aspect-[3/2]"><Photo k="kisi" onOpen={setOpen} sizes={HALF} cover /></div>
          </div>
          <Photo k="terrace-gold" onOpen={setOpen} />
          <Photo k="duo-gold" onOpen={setOpen} />
        </section>

        {/* ── Craft: capsule and lettering ─────────────────────────── */}
        <section aria-labelledby="craft" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-end">
            <div className="lg:aspect-auto"><Photo k="capsule" onOpen={setOpen} sizes="(min-width: 1024px) 56vw, 100vw" /></div>
            <div className="px-7 py-14 sm:px-12 lg:pb-16">
              <h2 id="craft" className={H2} style={{ fontFamily: SERIF, fontWeight: 300 }}>კაფსული</h2>
              <Col className="mt-5">დასტური და DASTURI ვერტიკალურად, ოქროსფერი ფოლგით ბორდოსფერ კაფსულაზე, ისევე როგორც ეტიკეტის არშიაზე.</Col>
            </div>
          </div>
          <Photo k="typefaces" onOpen={setOpen} />
          <div className="px-7 sm:px-12 lg:px-[9%] pb-14 pt-2 grid grid-cols-2 lg:grid-cols-4 gap-6 text-[13px] leading-[1.5]">
            {[
              ['DM Themestia', 'სათაურები და ღვინის ტიპი'],
              ['GA Lazi', 'ჯიშის სახელი'],
              ['Marcellus', 'ლათინური'],
              ['Avenir Next Georgian', 'ტექსტი'],
            ].map(([f, r]) => (
              <div key={f}><div style={{ color: GOLD }}>{f}</div><div className="mt-1 text-white/60">{r}</div></div>
            ))}
          </div>
        </section>

        {/* ── Colour ───────────────────────────────────────────────── */}
        <section aria-label="ფერები" className="rounded-md overflow-hidden"><Swatches items={swatches} /></section>

        {/* ── Bordeaux edition ─────────────────────────────────────── */}
        <section aria-labelledby="bordeaux" className="rounded-md overflow-hidden" style={{ background: BORDEAUX, color: IVORY }}>
          <div className="px-7 sm:px-12 lg:px-[9%] py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <h2 id="bordeaux" className={H2} style={{ fontFamily: SERIF, fontWeight: 300 }}>ბორდოსფერი გამოცემა</h2>
            <Col className="!text-white/70">იგივე ბადე და არშია, მეორე ფერი. ჯიხვი აქ გაუმჭვირვალე ოქროა.</Col>
          </div>
          <Photo k="terrace-bordeaux" onOpen={setOpen} />
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:aspect-[3/2]"><Photo k="duo-bordeaux" onOpen={setOpen} sizes={HALF} cover /></div>
            <div className="md:aspect-[3/2]"><Photo k="saperavi-bordeaux" onOpen={setOpen} sizes={HALF} cover /></div>
          </div>
        </section>

        {/* ── Close ────────────────────────────────────────────────── */}
        <section aria-label="დასასრული" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <Photo k="duo-satsuri" onOpen={setOpen} />
          <div className="px-6 py-16 sm:py-20 flex flex-col items-center text-center">
            <p className="text-[20px] sm:text-[24px] leading-[1.4]" style={{ fontFamily: SERIF, fontWeight: 300 }}>დასტური</p>
            <p className="mt-2 text-[13px] text-white/50">ლოგო, ეტიკეტები, შეფუთვა, 2026</p>
            <div className="mt-10"><CtaLink /></div>
          </div>
        </section>
      </div>

      {/* Other cases */}
      <section aria-labelledby="more" className="px-1.5 pt-24">
        <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">სხვა ქეისები</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5">
          {CASES.map((o) => (
            <CaseLink key={o.slug} to={o.path} cardId={`dasturi-${o.slug}`} className="group block">
              <div className="overflow-hidden rounded-md" style={{ background: o.stage, padding: '7%' }}>
                <img {...IMG.caseSide(o.hero)} alt={`${o.title} interface`} loading="lazy" decoding="async" className="block w-full h-auto rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-[1.015]" />
              </div>
              <Caption title={o.title} sub={o.subtitle} tag="Case study" />
            </CaseLink>
          ))}
        </div>
      </section>

      <Lightbox items={gallery} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </BakedShell>
  );
}
