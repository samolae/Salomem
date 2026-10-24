import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, Reveal, T, type LightboxItem } from './ui';
import { CASES } from './cases';

/*
 * Dasturi: identity, labels and packaging for a Georgian wine brand.
 * Built on the pattern the strongest wine branding cases share (Dieline,
 * BGN, Behance): the bottles first, a short brief, the idea, the system
 * from the mark to the details, then the bottles in their world.
 * Content sits on dark, in Georgian. Material: the Dasturi brand review.
 */

const P = '/cases/dasturi';
const GOLD = '#C0A16D';
const INK = '#191A17';
const PAPER = '#F0EADF';

const dot = <span style={{ color: GOLD }}>.</span>;

type Shot = { key: string; w: number; h: number; title: string; sub: string; alt: string };

/* Every photo, in page order; the lightbox walks the same list */
const SHOTS: Shot[] = [
  { key: 'lineup', w: 2000, h: 1324, title: 'ჯიშების ოჯახი', sub: 'ხუთივე ჯიში: ოქროსფერი პანელი, მუქი არშია და გამჭვირვალე ჯიხვი.', alt: 'დასტურის ხუთი ბოთლი წითელ კედელთან, ტრავერტინის თაროზე' },
  { key: 'logo-primary', w: 1549, h: 1150, title: 'ლოგო, ოქრო', sub: 'ჯიხვი გვერდიდან, მომრგვალებული რქებით და მოკლე ბეწვით. ქვემოთ დასტური და DASTURI.', alt: 'დასტურის ძირითადი ლოგო: ოქროსფერი ჯიხვი შავ ფონზე' },
  { key: 'logo-secondary', w: 1549, h: 1150, title: 'ლოგო, ბორდო', sub: 'ოქრო და ბორდო ძირითადი ფერებია, ვერცხლი დამატებითი.', alt: 'დასტურის ლოგო ბორდოსფერში, ღია ფონზე' },
  { key: 'labels-gold', w: 2000, h: 1240, title: 'ხუთი ჯიში', sub: 'საფერავი, მანავის მწვანე, ქისი, საწური, ცოლიკაური. თითო ეტიკეტზე ჯიში, ღვინის ტიპი, წელი და ალკოჰოლი.', alt: 'ხუთი ოქროსფერი ეტიკეტი გვერდიგვერდ' },
  { key: 'saperavi', w: 1549, h: 1017, title: 'საფერავი', sub: 'Saperavi · Red Dry. ეტიკეტი ტრავერტინის ფონზე.', alt: 'საფერავის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'kisi', w: 1549, h: 1017, title: 'ქისი', sub: 'Kisi · White Dry. ჯიხვი ყოველ ჯიშზე იმ ღვინის ფერს იღებს, რომელიც ბოთლშია.', alt: 'ქისის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'terrace-gold', w: 2000, h: 1324, title: 'საწური, ქისი, ცოლიკაური', sub: 'ერთი თარო, სამი ჯიში, ერთი ხმა.', alt: 'სამი ბოთლი ქვის ტერასაზე, მთების ფონზე' },
  { key: 'duo-gold', w: 2000, h: 1324, title: 'საფერავი და ქისი', sub: 'ჯიხვი გამჭვირვალე ჭრილია: მასში ბოთლის ღვინის ფერი ჩანს.', alt: 'საფერავი და ქისი ქვის კიბეზე, მზის შუქში' },
  { key: 'labels-bordeaux', w: 2000, h: 1240, title: 'ბორდოსფერი ვარიანტი', sub: 'ბორდოსფერი ეტიკეტის ვარიანტები: გაუმჭვირვალე ოქროსფერი ჯიხვი, ჯიში და წელი.', alt: 'ხუთი ბორდოსფერი ეტიკეტი გვერდიგვერდ' },
  { key: 'saperavi-bordeaux', w: 1549, h: 1017, title: 'საფერავი, ბორდო', sub: 'ოქროსფერი ჯიხვი ბორდოსფერ ეტიკეტზე.', alt: 'საფერავი ბორდოსფერი ეტიკეტით ტრავერტინზე' },
  { key: 'duo-bordeaux', w: 1549, h: 1017, title: 'საფერავი და ქისი, ბორდო', sub: 'კლიენტის ფავორიტი სცენა ბორდოსფერ ეტიკეტებით.', alt: 'საფერავი და ქისი ბორდოსფერი ეტიკეტებით ქვის კიბეზე' },
  { key: 'terrace-bordeaux', w: 2000, h: 1324, title: 'ბორდოსფერი ოჯახი', sub: 'საფერავი, ქისი და მანავის მწვანე ბორდოსფერ ვერსიაში.', alt: 'სამი ბოთლი ბორდოსფერი ეტიკეტებით ქვის ტერასაზე' },
  { key: 'capsule', w: 1549, h: 1150, title: 'კაფსული', sub: 'დასტური და DASTURI ვერტიკალურად, ოქროსფერი ფოლგით ბორდოსფერ კაფსულაზე.', alt: 'ბოთლის ყელი, ბორდოსფერი კაფსულა ოქროსფერი წარწერით' },
  { key: 'duo-satsuri', w: 1549, h: 1017, title: 'საწური და ცოლიკაური', sub: 'წითელი და თეთრი ღვინო ერთ სცენაში, ჯიხვის ჭრილი ღვინის ფერს იღებს.', alt: 'საწური და ცოლიკაური ქვის კიბეზე' },
  { key: 'typefaces', w: 2000, h: 1492, title: 'ტიპოგრაფია', sub: 'DM Themestia სათაურებისთვის, GA Lazi ჯიშის სახელისთვის, Marcellus და Avenir Next Georgian ტექსტისთვის.', alt: 'დასტურის შრიფტები: DM Themestia, GA Lazi, Marcellus, Avenir Next Georgian' },
];
const at = (key: string) => SHOTS.findIndex((s) => s.key === key);

/* A photo from the review, sharp on big screens, light on phones */
function Photo({ k, onOpen, sizes = '(min-width: 1280px) 1100px, 96vw', eager, caption = true }: {
  k: string; onOpen: (i: number) => void; sizes?: string; eager?: boolean; caption?: boolean;
}) {
  const i = at(k);
  const s = SHOTS[i];
  return (
    <Reveal>
      <button type="button" onClick={() => onOpen(i)} className="group block w-full text-left outline-none rounded-md focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label={`${s.title}, გადიდება`}>
        <div className="overflow-hidden rounded-md" style={{ background: INK }}>
          <img
            src={`${P}/${k}.jpg`}
            srcSet={`${P}/${k}-1000.jpg 1000w, ${P}/${k}.jpg ${s.w}w`}
            sizes={sizes}
            width={s.w}
            height={s.h}
            alt={s.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        </div>
        {caption && <Caption title={s.title} sub={s.sub} />}
      </button>
    </Reveal>
  );
}

function Label({ children }: { children: string }) {
  return <div className="text-[13px] tracking-[0.02em]" style={{ color: GOLD }}>{children}</div>;
}

function Block({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md overflow-hidden ${className}`} style={{ background: INK }}>{children}</div>;
}

function Heading({ id, label, title, text }: { id: string; label: string; title: string; text: string }) {
  return (
    <Block className="p-7 sm:p-12 text-white">
      <Label>{label}</Label>
      <h2 id={id} className="mt-5 max-w-[760px] text-[28px] sm:text-[40px] leading-[1.05]" style={{ fontFamily: T.display, fontWeight: 900 }}>
        {title}{dot}
      </h2>
      <p className="mt-5 max-w-[580px] text-[16px] leading-[1.6] text-white/70">{text}</p>
    </Block>
  );
}

const facts = [
  { label: 'კლიენტი', value: 'დასტური' },
  { label: 'სერვისი', value: 'ლოგო, ეტიკეტები, შეფუთვა' },
  { label: 'ჯიშები', value: 'საფერავი, მანავის მწვანე, ქისი, საწური, ცოლიკაური' },
  { label: 'წელი', value: '2026' },
];

const palette = [
  { no: '01', ka: 'ოქროსფერი', name: 'Champagne Gold', hex: '#C0A16D', rgb: '192 · 161 · 109', ink: '#1d1b16' },
  { no: '02', ka: 'ბორდოსფერი', name: 'Wine Bordeaux', hex: '#7A1C30', rgb: '122 · 28 · 48', ink: '#F0EADF' },
  { no: '03', ka: 'ვერცხლისფერი', name: 'Soft Silver', hex: '#A9ABAE', rgb: '169 · 171 · 174', ink: '#1d1b16' },
  { no: '04', ka: 'შავი', name: 'Deep Black', hex: '#191A17', rgb: '25 · 26 · 23', ink: '#F0EADF' },
];

export function DasturiCase() {
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: s.alt, brand: `დასტური · ${s.title}` }));
  const half = '(min-width: 768px) 50vw, 96vw';

  return (
    <BakedShell>
      <SEO
        title="Dasturi | Wine Brand Identity Case Study"
        description="დასტური: ქართული ღვინის ბრენდის იდენტობა, ეტიკეტები და შეფუთვა. კავკასიური ჯიხვი, ოქროსფერი და ბორდოსფერი ეტიკეტები ხუთი ჯიშისთვის."
        keywords="Dasturi, დასტური, wine branding, Georgian wine, label design, packaging, Saperavi, Kisi, brand identity, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/dasturi" />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section aria-label="დასტური" className="px-1.5 pt-14 sm:pt-[52px]">
        <Block className="p-7 sm:p-12 text-white">
          <Link to="/work/ux-ui" className="inline-flex w-fit items-center gap-1.5 text-[14px] text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={14} /> ქეისები
          </Link>
          <div className="pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-end">
            <div>
              <Label>ქეისი · იდენტობა, ეტიკეტები, შეფუთვა</Label>
              <h1 className="mt-5 text-[64px] sm:text-[120px] leading-[0.9]" style={{ fontFamily: T.display, fontWeight: 900 }}>
                დასტური{dot}
              </h1>
            </div>
            <p className="max-w-[520px] text-[17px] sm:text-[18px] leading-[1.55] text-white/80">
              დასტური ქართული ღვინის ახალი ბრენდია. ნიშნად ავირჩიეთ კავკასიური ჯიხვი: მშვიდი, ამაყი დგომით, აწეული ფეხით და მომრგვალებული რქებით.
            </p>
          </div>
        </Block>
      </section>

      <section aria-label="ჯიშების ოჯახი" className="px-1.5 pt-1.5">
        <Photo k="lineup" onOpen={setOpen} eager caption={false} />
      </section>

      {/* ── Facts ─────────────────────────────────────────────────── */}
      <section aria-label="პროექტი" className="px-1.5 pt-1.5">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {facts.map((f) => (
            <div key={f.label} className="rounded-md px-5 py-4" style={{ background: INK }}>
              <dt className="text-[13px] text-white/50">{f.label}</dt>
              <dd className="mt-1 text-[15px] leading-[1.4] text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Brief ─────────────────────────────────────────────────── */}
      <section aria-labelledby="brief" className="px-1.5 pt-1.5">
        <Block className="px-6 py-20 sm:px-12 sm:py-28 text-center text-white">
          <Label>ბრიფი</Label>
          <h2 id="brief" className="sr-only">ბრიფი</h2>
          <p className="mx-auto mt-6 max-w-[760px] text-[22px] sm:text-[30px] leading-[1.35]">
            ხუთი ჯიში, ერთი ოჯახი. სისტემა აგებულია ოქროსფერ პანელზე, შავ არშიაზე და წითელ ჯვარზე, ასე რომ ხუთივე ჯიში ერთ ოჯახად იკითხება.
          </p>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.6] text-white/60">
            თითოეული ბოთლი კი თავისი ღვინის ფერს ინარჩუნებს: საფერავის სიმუქე, ქისის ქარვა, ცოლიკაურის ღია ოქრო.
          </p>
        </Block>
      </section>

      {/* ── Idea: name + symbol ───────────────────────────────────── */}
      <section aria-labelledby="idea" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <Block className="p-7 sm:p-12 text-white flex flex-col justify-between min-h-[380px]">
            <div>
              <Label>01 · სახელი</Label>
              <h2 id="idea" className="mt-5 text-[34px] sm:text-[44px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>დასტური{dot}</h2>
            </div>
            <p className="mt-10 max-w-[440px] text-[17px] leading-[1.55] text-white/80">
              ქართულად „დასტური" თანხმობასა და მოწონებას ნიშნავს: სიტყვა, რომელიც სუფრაზე სადღეგრძელოს ადასტურებს. ბრენდი ამ ჟესტზე დგას: ღვინო, რომელსაც ენდობი და სხვასაც ურჩევ.
            </p>
          </Block>
          <Block className="p-7 sm:p-12 text-white flex flex-col justify-between min-h-[380px]">
            <div>
              <Label>02 · სიმბოლო</Label>
              <div className="mt-5 text-[34px] sm:text-[44px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>ჯიხვი{dot}</div>
            </div>
            <p className="mt-10 max-w-[440px] text-[17px] leading-[1.55] text-white/80">
              კავკასიური ჯიხვი სიმტკიცისა და მიწასთან კავშირის ნიშანია. გვერდიდან, აწეული ფეხით და მომრგვალებული რქებით: ამაყი, მაგრამ მშვიდი, როგორც კარგი ღვინო.
            </p>
          </Block>
        </div>
      </section>

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <section aria-labelledby="logo" className="px-1.5 pt-20">
        <h2 id="logo" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">ლოგო</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
          <Photo k="logo-primary" onOpen={setOpen} sizes={half} />
          <Photo k="logo-secondary" onOpen={setOpen} sizes={half} />
        </div>
      </section>

      {/* ── Colour ────────────────────────────────────────────────── */}
      <section aria-labelledby="colour" className="px-1.5 pt-12">
        <Heading id="colour" label="03 · ფერი" title="ოთხი ფერი, ორი ძირითადი"
          text="ოქროსფერი და ბორდოსფერი ბრენდის ხმაა, ვერცხლისფერი დამატებითია, შავი კი ყველაფერს ერთად კრავს. ოქრო ეტიკეტის პანელია, ბორდო კაფსულა და მეორე ეტიკეტის ფერი." />
        <div className="mt-1.5 rounded-md p-1.5" style={{ background: PAPER }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {palette.map((c) => (
              <div key={c.hex} className="rounded-md p-6 sm:p-8 flex flex-col justify-between min-h-[260px] sm:min-h-[320px]" style={{ background: c.hex, color: c.ink }}>
                <div>
                  <div className="text-[12px] tracking-[0.18em] opacity-60">DASTURI / {c.no}</div>
                  <div className="mt-3 text-[15px] opacity-80">{c.ka}</div>
                  <div className="mt-1 text-[34px] sm:text-[44px] leading-[1]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{c.name}</div>
                </div>
                <div className="mt-10 pt-4 border-t flex gap-10 text-[14px] tabular-nums" style={{ borderTopColor: 'color-mix(in srgb, currentColor 25%, transparent)' }}>
                  <div><div className="text-[11px] tracking-[0.12em] opacity-60">HEX</div><div className="mt-1">{c.hex}</div></div>
                  <div><div className="text-[11px] tracking-[0.12em] opacity-60">RGB</div><div className="mt-1">{c.rgb}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Label system ──────────────────────────────────────────── */}
      <section aria-labelledby="label" className="px-1.5 pt-1.5">
        <Heading id="label" label="04 · ეტიკეტი" title="ჯიხვი, რომელშიც ღვინო ჩანს"
          text="ოქროსფერ პანელზე ჯიხვი გამჭვირვალე ჭრილია: საფერავზე მუქი წითელია, ქისზე ქარვისფერი, ცოლიკაურზე ღია ოქრო. ერთი ნიშანი ხუთ ბოთლზე ხუთ სხვადასხვა ფერს იღებს." />
      </section>
      <section aria-label="ხუთი ჯიში" className="px-1.5 pt-1.5">
        <Photo k="labels-gold" onOpen={setOpen} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {[
            { t: 'გამჭვირვალე ჯიხვი', d: 'ნიშანი ქაღალდში ჭრილია, ამიტომ ბოთლში ღვინის ფერს იღებს.' },
            { t: 'შავი არშია', d: 'ვერტიკალური დასტური და DASTURI: ბრენდი ყოველთვის ერთ ადგილას.' },
            { t: 'ქვედა ზოლი', d: 'ღვინის ტიპი, მოცულობა, ალკოჰოლი და წითელი ჯვარი ერთ რიგში.' },
          ].map((x, i) => (
            <div key={x.t} className="rounded-md p-6" style={{ background: INK }}>
              <div className="text-[13px] tabular-nums" style={{ color: GOLD }}>0{i + 1}</div>
              <div className="mt-6 text-[16px] text-white">{x.t}</div>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-white/60">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gold family in the world ──────────────────────────────── */}
      <section aria-label="ოქროსფერი ოჯახი" className="px-1.5 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
          <Photo k="saperavi" onOpen={setOpen} sizes={half} />
          <Photo k="kisi" onOpen={setOpen} sizes={half} />
        </div>
        <Photo k="terrace-gold" onOpen={setOpen} />
        <Photo k="duo-gold" onOpen={setOpen} />
      </section>

      {/* ── Bordeaux edition ──────────────────────────────────────── */}
      <section aria-labelledby="bordeaux" className="px-1.5 pt-12">
        <Block className="p-7 sm:p-12 text-white" >
          <div style={{ color: GOLD }} className="text-[13px] tracking-[0.02em]">05 · ბორდოსფერი ვარიანტი</div>
          <h2 id="bordeaux" className="mt-5 max-w-[760px] text-[28px] sm:text-[40px] leading-[1.05]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            იგივე სისტემა, მეორე ფერი{dot}
          </h2>
          <p className="mt-5 max-w-[580px] text-[16px] leading-[1.6] text-white/70">
            მეორე ხაზში პანელი <span style={{ color: '#d8a0ad' }}>ბორდოსფერია</span>, ჯიხვი კი გაუმჭვირვალე ოქრო. ბადე, არშია და ქვედა ზოლი უცვლელია, ამიტომ ორივე ხაზი ერთ თაროზე ერთ ოჯახად იკითხება.
          </p>
        </Block>
      </section>
      <section aria-label="ბორდოსფერი ეტიკეტები" className="px-1.5 pt-1.5">
        <Photo k="labels-bordeaux" onOpen={setOpen} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
          <Photo k="saperavi-bordeaux" onOpen={setOpen} sizes={half} />
          <Photo k="duo-bordeaux" onOpen={setOpen} sizes={half} />
        </div>
        <Photo k="terrace-bordeaux" onOpen={setOpen} />
      </section>

      {/* ── Details ───────────────────────────────────────────────── */}
      <section aria-labelledby="details" className="px-1.5 pt-12">
        <h2 id="details" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">დეტალები</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5 items-start">
          <Photo k="capsule" onOpen={setOpen} sizes={half} />
          <Photo k="duo-satsuri" onOpen={setOpen} sizes={half} />
        </div>
      </section>

      {/* ── Type ──────────────────────────────────────────────────── */}
      <section aria-labelledby="type" className="px-1.5 pt-12">
        <Heading id="type" label="06 · ტიპოგრაფია" title="ოთხი შრიფტი, ერთი ხმა"
          text="DM Themestia სათაურებისა და ღვინის ტიპისთვის, GA Lazi კალიგრაფიული ჯიშის სახელისთვის, Marcellus ლათინურისთვის და Avenir Next Georgian ტექსტისთვის. ქართული და ლათინური ერთ რიტმზეა აწყობილი." />
      </section>
      <section aria-label="შრიფტები" className="px-1.5 pt-1.5">
        <Photo k="typefaces" onOpen={setOpen} caption={false} />
      </section>

      {/* ── Outcome ───────────────────────────────────────────────── */}
      <section aria-labelledby="result" className="px-1.5 pt-1.5">
        <Block className="px-6 py-24 sm:px-12 sm:py-32 text-center text-white">
          <Label>შედეგი</Label>
          <h2 id="result" className="mx-auto mt-6 max-w-[860px] text-[32px] sm:text-[56px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            ბრენდი, რომელსაც დასტური აქვს{dot}
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.6] text-white/70">
            ერთი ნიშანი, ორი ეტიკეტის ხაზი და ხუთი ჯიში, რომლებიც თაროზე ერთ ოჯახად დგანან. ახალი ჯიში იგივე წესით დაემატება: ოქროს ან ბორდოს პანელი, ჯიხვი და ჯიშის სახელი.
          </p>
          <div className="mt-10 flex justify-center"><CtaLink /></div>
        </Block>
      </section>

      {/* ── Other cases ───────────────────────────────────────────── */}
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
