import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, T, type LightboxItem } from './ui';
import { CASES } from './cases';

/*
 * Dasturi, laid out the way the most appreciated wine cases on Behance are
 * (Kelly Washington, Bouchon, Tre Acini): one dark canvas, images joined
 * edge to edge with no gaps or captions, a short client/brief note at the
 * top, a rhythm of full-bleed, two-up and framed shots, and the mark again
 * at the end. The pictures tell the story; text only where it must.
 */

const P = '/cases/dasturi';
const CANVAS = '#1A1A18'; // the black of the review's own artwork, so images melt into the page
const GOLD = '#C0A16D';

type Shot = { key: string; w: number; h: number; alt: string; title: string };
const SHOTS: Shot[] = [
  { key: 'logo-primary', w: 1549, h: 1150, title: 'ლოგო', alt: 'დასტურის ლოგო: ოქროსფერი ჯიხვი შავ ფონზე' },
  { key: 'lineup', w: 2000, h: 1324, title: 'ჯიშების ოჯახი', alt: 'დასტურის ხუთი ბოთლი წითელ კედელთან, ტრავერტინის თაროზე' },
  { key: 'labels-gold', w: 2000, h: 1240, title: 'ხუთი ჯიში', alt: 'ხუთი ოქროსფერი ეტიკეტი გვერდიგვერდ' },
  { key: 'saperavi', w: 1549, h: 1017, title: 'საფერავი', alt: 'საფერავის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'kisi', w: 1549, h: 1017, title: 'ქისი', alt: 'ქისის ბოთლი ტრავერტინის ფილაზე' },
  { key: 'terrace-gold', w: 2000, h: 1324, title: 'საწური, ქისი, ცოლიკაური', alt: 'სამი ბოთლი ქვის ტერასაზე, მთების ფონზე' },
  { key: 'capsule', w: 1549, h: 1150, title: 'კაფსული', alt: 'ბოთლის ყელი, ბორდოსფერი კაფსულა ოქროსფერი წარწერით' },
  { key: 'duo-gold', w: 2000, h: 1324, title: 'საფერავი და ქისი', alt: 'საფერავი და ქისი ქვის კიბეზე, მზის შუქში' },
  { key: 'typefaces', w: 2000, h: 1492, title: 'ტიპოგრაფია', alt: 'დასტურის შრიფტები: DM Themestia, GA Lazi, Marcellus, Avenir Next Georgian' },
  { key: 'logo-secondary', w: 1549, h: 1150, title: 'ლოგო, ბორდო', alt: 'დასტურის ლოგო ბორდოსფერში, ღია ფონზე' },
  { key: 'saperavi-bordeaux', w: 1549, h: 1017, title: 'საფერავი, ბორდო', alt: 'საფერავი ბორდოსფერი ეტიკეტით ტრავერტინზე' },
  { key: 'labels-bordeaux', w: 2000, h: 1240, title: 'ბორდოსფერი ვარიანტი', alt: 'ხუთი ბორდოსფერი ეტიკეტი გვერდიგვერდ' },
  { key: 'terrace-bordeaux', w: 2000, h: 1324, title: 'ბორდოსფერი ოჯახი', alt: 'სამი ბოთლი ბორდოსფერი ეტიკეტებით ქვის ტერასაზე' },
  { key: 'duo-bordeaux', w: 1549, h: 1017, title: 'საფერავი და ქისი, ბორდო', alt: 'საფერავი და ქისი ბორდოსფერი ეტიკეტებით ქვის კიბეზე' },
  { key: 'duo-satsuri', w: 1549, h: 1017, title: 'საწური და ცოლიკაური', alt: 'საწური და ცოლიკაური ქვის კიბეზე' },
];
const at = (key: string) => SHOTS.findIndex((s) => s.key === key);

const FULL = '(min-width: 1280px) 1280px, 100vw';
const HALF = '(min-width: 768px) 50vw, 100vw';

/* One picture, no frame, no caption; click to enlarge */
function Shot({ k, onOpen, sizes = FULL, cover, eager }: { k: string; onOpen: (i: number) => void; sizes?: string; cover?: boolean; eager?: boolean }) {
  const i = at(k);
  const s = SHOTS[i];
  return (
    <button type="button" onClick={() => onOpen(i)} className={`group block w-full overflow-hidden outline-none focus-visible:shadow-[inset_0_0_0_2px_#ff4306] cursor-zoom-in ${cover ? 'h-full' : ''}`} aria-label={`${s.title}, გადიდება`}>
      <img
        src={`${P}/${k}.jpg`}
        srcSet={`${P}/${k}-1000.jpg 1000w, ${P}/${k}.jpg ${s.w}w`}
        sizes={sizes}
        width={s.w}
        height={s.h}
        alt={s.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`block w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.012] ${cover ? 'h-full object-cover' : 'h-auto'}`}
      />
    </button>
  );
}

function TwoUp({ a, b, onOpen }: { a: string; b: string; onOpen: (i: number) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="md:aspect-[3/2]"><Shot k={a} onOpen={onOpen} sizes={HALF} cover /></div>
      <div className="md:aspect-[3/2]"><Shot k={b} onOpen={onOpen} sizes={HALF} cover /></div>
    </div>
  );
}

/* A smaller picture floating on the canvas, the way Bouchon frames its stills */
function Framed({ k, onOpen }: { k: string; onOpen: (i: number) => void }) {
  return (
    <div className="px-[12%] sm:px-[22%] py-16 sm:py-28">
      <Shot k={k} onOpen={onOpen} sizes="(min-width: 768px) 56vw, 76vw" />
    </div>
  );
}

/* A quiet line between chapters */
function Interlude({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-20 sm:py-32 flex flex-col items-center text-center">
      <div className="text-[12px] tracking-[0.22em] uppercase" style={{ color: GOLD }}>{label}</div>
      <p className="mt-6 max-w-[560px] text-[19px] sm:text-[24px] leading-[1.45] text-white/85">{children}</p>
    </div>
  );
}

const swatches = [
  { name: 'Champagne Gold', ka: 'ოქროსფერი', hex: '#C0A16D', ink: '#1A1A18' },
  { name: 'Wine Bordeaux', ka: 'ბორდოსფერი', hex: '#7A1C30', ink: '#F0EADF' },
  { name: 'Soft Silver', ka: 'ვერცხლისფერი', hex: '#A9ABAE', ink: '#1A1A18' },
  { name: 'Deep Black', ka: 'შავი', hex: '#191A17', ink: '#F0EADF' },
];

export function DasturiCase() {
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: s.alt, brand: `დასტური · ${s.title}` }));

  return (
    <BakedShell>
      <SEO
        title="Dasturi | Wine Brand Identity Case Study"
        description="დასტური: ქართული ღვინის ბრენდის იდენტობა, ეტიკეტები და შეფუთვა. კავკასიური ჯიხვი, ოქროსფერი და ბორდოსფერი ეტიკეტები ხუთი ჯიშისთვის."
        keywords="Dasturi, დასტური, wine branding, Georgian wine, label design, packaging, Saperavi, Kisi, brand identity, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/dasturi" />

      <article className="px-1.5 pt-14 sm:pt-[52px]">
        <div className="rounded-md overflow-hidden text-white" style={{ background: CANVAS }}>
          {/* Cover: the mark, nothing else */}
          <div className="relative">
            <Link to="/work/ux-ui" className="absolute left-5 top-5 sm:left-8 sm:top-7 z-10 inline-flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={13} /> ქეისები
            </Link>
            <h1 className="sr-only">დასტური, ღვინის ბრენდის იდენტობა</h1>
            <Shot k="logo-primary" onOpen={setOpen} eager />
          </div>

          {/* Client / brief / scope: small, like a colophon */}
          <div className="px-6 sm:px-[12%] py-16 sm:py-24 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-16 text-[15px] leading-[1.65]">
            <dl className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-5 text-[14px]">
              {[
                ['კლიენტი', 'დასტური'],
                ['წელი', '2026'],
                ['სერვისი', 'ლოგო, ეტიკეტები, შეფუთვა'],
                ['ჯიშები', 'საფერავი, მანავის მწვანე, ქისი, საწური, ცოლიკაური'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt style={{ color: GOLD }}>{k}</dt>
                  <dd className="mt-1 text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-5 text-white/80 max-w-[620px]">
              <p className="text-[20px] sm:text-[24px] leading-[1.45] text-white">
                დასტური ქართული ღვინის ახალი ბრენდია. ნიშნად ავირჩიეთ კავკასიური ჯიხვი: მშვიდი, ამაყი დგომით, აწეული ფეხით და მომრგვალებული რქებით.
              </p>
              <p>
                სისტემა აგებულია ოქროსფერ პანელზე, შავ არშიაზე და წითელ ჯვარზე, ასე რომ ხუთივე ჯიში ერთ ოჯახად იკითხება, თითოეული კი თავისი ღვინის ფერს ინარჩუნებს. ჯიხვი ეტიკეტზე გამჭვირვალე ჭრილია: მასში ბოთლის ღვინის ფერი ჩანს.
              </p>
            </div>
          </div>

          {/* Gold line */}
          <Shot k="lineup" onOpen={setOpen} />
          <Shot k="labels-gold" onOpen={setOpen} />
          <TwoUp a="saperavi" b="kisi" onOpen={setOpen} />
          <Shot k="terrace-gold" onOpen={setOpen} />
          <Framed k="capsule" onOpen={setOpen} />
          <Shot k="duo-gold" onOpen={setOpen} />

          {/* Colour, as one strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {swatches.map((c) => (
              <div key={c.hex} className="aspect-[3/4] lg:aspect-[2/3] p-5 sm:p-7 flex flex-col justify-between" style={{ background: c.hex, color: c.ink }}>
                <div className="text-[13px] opacity-70">{c.ka}</div>
                <div>
                  <div className="text-[22px] sm:text-[28px] leading-[1.05]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{c.name}</div>
                  <div className="mt-2 text-[13px] tabular-nums opacity-70">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
          <Shot k="typefaces" onOpen={setOpen} />

          {/* Bordeaux line */}
          <Interlude label="ბორდოსფერი ვარიანტი">
            იგივე სისტემა, მეორე ფერი: ბორდოსფერი პანელი და გაუმჭვირვალე ოქროსფერი ჯიხვი.
          </Interlude>
          <TwoUp a="logo-secondary" b="saperavi-bordeaux" onOpen={setOpen} />
          <Shot k="labels-bordeaux" onOpen={setOpen} />
          <Shot k="terrace-bordeaux" onOpen={setOpen} />
          <TwoUp a="duo-bordeaux" b="duo-satsuri" onOpen={setOpen} />

          {/* Outro: the mark again, then a way to talk */}
          <div className="px-6 py-24 sm:py-36 flex flex-col items-center text-center">
            <div className="text-[56px] sm:text-[96px] leading-[0.9]" style={{ fontFamily: T.display, fontWeight: 900 }}>
              დასტური<span style={{ color: GOLD }}>.</span>
            </div>
            <p className="mt-5 text-[14px] text-white/50">ლოგო · ეტიკეტები · შეფუთვა · 2026</p>
            <div className="mt-10"><CtaLink /></div>
          </div>
        </div>
      </article>

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
