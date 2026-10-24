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

/* ── The label family: rise, foil, switch the edition ─────────────────── */

function LabelSystem() {
  const [edition, setEdition] = useState<'gold' | 'bordeaux'>('gold');
  return (
    <section aria-labelledby="system" className="rounded-md overflow-hidden" style={{ background: STONE, color: BLACK }}>
      <div className="px-7 sm:px-12 lg:px-[9%] pt-20 sm:pt-28 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-end">
        <h2 id="system" className="text-[34px] sm:text-[52px] leading-[1.1]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
          ხუთი ჯიში, ერთი ოჯახი
        </h2>
        <div>
          <p className="max-w-[460px] text-[16px] leading-[1.7] text-[#191A17]/70">
            პანელი, შავი არშია და წითელი ჯვარი ყველა ბოთლზე ერთია. იცვლება მხოლოდ ჯიშის სახელი და წელი. ოქროსფერ გამოცემაში ჯიხვი გამჭვირვალეა და ბოთლის ღვინის ფერს იღებს.
          </p>
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
            <Link to="/work/ux-ui" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={13} /> ქეისები
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
            <h1 className="text-[28px] sm:text-[40px] leading-[1.1]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
              დასტური, ქართული ღვინის ბრენდი
            </h1>
            <p className="text-[14px] text-white/55 sm:text-right">ლოგო, ეტიკეტები და შეფუთვა<br />2026</p>
          </div>
        </header>

        {/* ── Opening ──────────────────────────────────────────────── */}
        <section aria-label="პროექტის შესახებ" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <div className="px-6 sm:px-12 lg:px-[9%] py-20 sm:py-32 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
            <dl className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-6 text-[14px] content-start">
              {[
                ['კლიენტი', 'დასტური'],
                ['წელი', '2026'],
                ['სერვისი', 'ლოგო, ეტიკეტები, შეფუთვა'],
                ['ჯიშები', 'საფერავი, მანავის მწვანე, ქისი, საწური, ცოლიკაური'],
              ].map(([k, val]) => (
                <div key={k}>
                  <dt style={{ color: GOLD }}>{k}</dt>
                  <dd className="mt-1 text-white/75 leading-[1.5]">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="max-w-[640px]">
              <p className="text-[26px] sm:text-[36px] leading-[1.35]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                ნიშნად ავირჩიეთ კავკასიური ჯიხვი: მშვიდი, ამაყი დგომით, აწეული ფეხით და მომრგვალებული რქებით.
              </p>
              <p className="mt-8 text-[16px] leading-[1.7] text-white/65 max-w-[540px]">
                დასტური ქართული ღვინის ახალი ბრენდია. სისტემა აგებულია ოქროსფერ პანელზე, შავ არშიაზე და წითელ ჯვარზე, ასე რომ ხუთივე ჯიში ერთ ოჯახად იკითხება, თითოეული კი თავისი ღვინის ფერს ინარჩუნებს.
              </p>
            </div>
          </div>
          <Photo k="lineup" onOpen={setOpen} />
        </section>

        {/* ── Construction ─────────────────────────────────────────── */}
        <section aria-labelledby="build" className="rounded-md overflow-hidden" style={{ background: BLACK, color: IVORY }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] items-center">
            <div className="px-7 sm:px-12 lg:pl-[15%] pt-20 lg:py-24">
              <h2 id="build" className="text-[34px] sm:text-[48px] leading-[1.12]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                ჯიხვი, აგებული წრეებზე
              </h2>
              <p className="mt-6 max-w-[400px] text-[16px] leading-[1.7] text-white/65">
                რქები ორი თითქმის კონცენტრული წრის რკალია, R 129 და R 65. ოთხივე ჩლიქი ერთ ხაზზე დგას, სიტყვანიშანი კი ჯიხვის სიგანეს იმეორებს.
              </p>
              <p className="mt-4 max-w-[400px] text-[16px] leading-[1.7] text-white/65">
                თავისუფალი სივრცე ყველა მხარეს 1X-ია, DASTURI-ს ასოს სიმაღლე.
              </p>
            </div>
            <div className="px-4 sm:px-10 py-12 lg:py-16"><Construction /></div>
          </div>
        </section>

        {/* ── Wordmark anatomy ─────────────────────────────────────── */}
        <section aria-labelledby="anatomy" className="rounded-md overflow-hidden" style={{ background: BORDEAUX, color: IVORY }}>
          <div className="px-7 sm:px-12 lg:px-[9%] pt-20 sm:pt-28 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-end">
            <h2 id="anatomy" className="text-[34px] sm:text-[52px] leading-[1.1]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
              სიტყვანიშანი, წერტილ-წერტილ
            </h2>
            <p className="max-w-[440px] text-[16px] leading-[1.7] text-white/75">
              ასოები ერთ ფუძის ხაზზე დგას, ფართო ინტერვალით. რბილი მრუდები და წვეტიანი ბოლოები ჯიხვის რქების რიტმს იმეორებს.
            </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
            <div className="lg:aspect-auto"><Photo k="capsule" onOpen={setOpen} sizes="(min-width: 1024px) 56vw, 100vw" /></div>
            <div className="px-7 py-14 sm:px-12 flex flex-col justify-center">
              <h2 id="craft" className="text-[30px] sm:text-[40px] leading-[1.15]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
                ოქროს ფოლგა ბორდოს კაფსულაზე
              </h2>
              <p className="mt-5 max-w-[420px] text-[16px] leading-[1.7] text-white/65">
                დასტური და DASTURI ვერტიკალურად, ისევე როგორც ეტიკეტის არშიაზე. ბოთლი თაროზე ორივე ანბანით იკითხება, რომელი მხრიდანაც არ უნდა შეხედო.
              </p>
            </div>
          </div>
          <Photo k="typefaces" onOpen={setOpen} />
          <div className="px-7 sm:px-12 lg:px-[9%] pb-16 pt-2 grid grid-cols-2 lg:grid-cols-4 gap-6 text-[14px] leading-[1.5]">
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
          <div className="px-7 sm:px-12 lg:px-[9%] py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-end">
            <h2 id="bordeaux" className="text-[34px] sm:text-[52px] leading-[1.1]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
              იგივე სისტემა, მეორე ფერი
            </h2>
            <p className="max-w-[440px] text-[16px] leading-[1.7] text-white/75">
              ბორდოსფერ გამოცემაში ჯიხვი გაუმჭვირვალე ოქროა. ბადე, არშია და ქვედა ზოლი უცვლელია, ამიტომ ორივე ხაზი ერთ თაროზე ერთ ოჯახად დგას.
            </p>
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
          <div className="px-6 py-20 sm:py-28 flex flex-col items-center text-center">
            <p className="max-w-[560px] text-[24px] sm:text-[32px] leading-[1.35]" style={{ fontFamily: SERIF, fontWeight: 300 }}>
              ახალი ჯიში იგივე წესით დაემატება: პანელი, ჯიხვი და სახელი.
            </p>
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
