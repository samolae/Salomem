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
 * Dasturi: brand identity for a Georgian wine house. Built on the pattern
 * the strongest wine branding cases share (Dieline, BGN, Behance): image
 * first, a short brief, the idea, then the system from the whole to the
 * details, and a quiet close. Content sits on dark, in Georgian.
 */

const P = '/cases/dasturi';
const RED = '#ED1C24';
const GOLD = '#BE975E';
const INK = '#141412';
const PAPER = '#F4EEE2';

const dot = <span style={{ color: RED }}>.</span>;

function Label({ children }: { children: string }) {
  return <div className="text-[13px] tracking-[0.02em]" style={{ color: GOLD }}>{children}</div>;
}

function Block({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md overflow-hidden ${className}`} style={{ background: INK }}>{children}</div>;
}

const facts = [
  { label: 'კლიენტი', value: 'ღვინის სახლი „დასტური"' },
  { label: 'როლი', value: 'ბრენდის იდენტობა, ეტიკეტის დიზაინი' },
  { label: 'სკოუპი', value: 'ლოგო, ფერი, ტიპოგრაფია, ეტიკეტი' },
  { label: 'წელი', value: '2026' },
];

const palette = [
  { name: 'დასტურის წითელი', hex: '#ED1C24', note: 'ჯიხვი, აქცენტები' },
  { name: 'ოქრო', hex: '#BE975E', note: 'ეტიკეტის ქაღალდი' },
  { name: 'ღამის შავი', hex: '#191A17', note: 'გვერდითი ზოლი, ტექსტი' },
  { name: 'სპილოს ძვალი', hex: '#F4EEE2', note: 'ფონი, ბეჭდვა' },
];

export function DasturiCase() {
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = [
    { src: `${P}/label.jpg`, alt: 'საფერავის ეტიკეტი', brand: 'დასტური · საფერავის ეტიკეტი' },
    { src: `${P}/label-ibex.jpg`, alt: 'ამოჭრილი ჯიხვი', brand: 'დასტური · ამოჭრილი ჯიხვი' },
    { src: `${P}/label-type.jpg`, alt: 'ჯიშის სახელი', brand: 'დასტური · ჯიშის სახელი' },
    { src: `${P}/red-selection.jpg`, alt: 'წითლის შერჩევა', brand: 'დასტური · წითლის შერჩევა' },
  ];
  const others = CASES;

  return (
    <BakedShell>
      <SEO
        title="Dasturi | Wine Brand Identity Case Study"
        description="დასტური: ქართული ღვინის სახლის ბრენდის იდენტობა. ჯიხვის ლოგო, ოქროს ეტიკეტი ამოჭრილი წითელი ჯიხვით, ფერი და ტიპოგრაფია."
        keywords="Dasturi, დასტური, wine branding, Georgian wine, label design, Saperavi, brand identity, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/dasturi" />

      {/* ── Hero: the label first ─────────────────────────────────── */}
      <section aria-label="დასტური" className="px-1.5 pt-14 sm:pt-[52px]">
        <div className="rounded-md overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-[calc(100svh-64px)]" style={{ background: INK }}>
          <div className="flex flex-col justify-between p-7 sm:p-12 text-white">
            <Link to="/work/ux-ui" className="inline-flex w-fit items-center gap-1.5 text-[14px] text-white/60 hover:text-white transition-colors">
              <ArrowLeft size={14} /> ქეისები
            </Link>
            <div className="py-14">
              <Label>ქეისი · ბრენდის იდენტობა</Label>
              <h1 className="mt-5 text-[64px] sm:text-[112px] leading-[0.9]" style={{ fontFamily: T.display, fontWeight: 900 }}>
                დასტური{dot}
              </h1>
              <p className="mt-6 max-w-[440px] text-[18px] leading-[1.5] text-white/80">
                ქართული ღვინის სახლის იდენტობა: მთის ჯიხვი, ოქროს ეტიკეტი და ერთი გაბედული წითელი.
              </p>
            </div>
            <div className="text-[13px] text-white/50">გადაახვიე ქვემოთ</div>
          </div>
          <div className="relative flex items-center justify-center p-8 sm:p-14" style={{ background: 'radial-gradient(120% 90% at 50% 40%, #2a2620 0%, #141412 70%)' }}>
            <img src={`${P}/label.jpg`} alt="დასტურის საფერავის ეტიკეტი ოქროს ქაღალდზე ამოჭრილი წითელი ჯიხვით" width="1200" height="2160" loading="eager"
              className="block w-full max-w-[360px] h-auto rounded-sm shadow-[0_40px_90px_rgba(0,0,0,0.55)]" />
          </div>
        </div>
      </section>

      {/* ── Facts ─────────────────────────────────────────────────── */}
      <section aria-label="პროექტი" className="px-1.5 pt-1.5">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {facts.map((f) => (
            <div key={f.label} className="rounded-md px-5 py-4" style={{ background: INK }}>
              <dt className="text-[13px] text-white/50">{f.label}</dt>
              <dd className="mt-1 text-[15px] text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Brief ─────────────────────────────────────────────────── */}
      <section aria-labelledby="brief" className="px-1.5 pt-1.5">
        <Block className="px-6 py-20 sm:px-12 sm:py-28 text-center text-white">
          <Label>ბრიფი</Label>
          <h2 id="brief" className="sr-only">ბრიფი</h2>
          <p className="mx-auto mt-6 max-w-[720px] text-[22px] sm:text-[30px] leading-[1.35]">
            „დასტური" ღვინის სახლია საცხოვრებელი კომპლექსის პირველ სართულზე: სადეგუსტაციო, პრეზენტაციებისა და შეხვედრების სივრცე პრემიუმ ღვინის კოლექციებისთვის.
          </p>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.6] text-white/60">
            ამოცანა იყო იდენტობა, რომელშიც ტრადიცია და თანამედროვე კომფორტი ერთად ცხოვრობს: საკმარისად ძველი, რომ ენდო, და საკმარისად ახალი, რომ დაიმახსოვრო.
          </p>
        </Block>
      </section>

      {/* ── Idea: name + symbol ───────────────────────────────────── */}
      <section aria-labelledby="idea" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <Block className="p-7 sm:p-12 text-white flex flex-col justify-between min-h-[420px]">
            <div>
              <Label>01 · სახელი</Label>
              <h2 id="idea" className="mt-5 text-[34px] sm:text-[44px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>დასტური{dot}</h2>
            </div>
            <p className="mt-10 max-w-[440px] text-[17px] leading-[1.55] text-white/80">
              ქართულად „დასტური" თანხმობასა და მოწონებას ნიშნავს: სიტყვა, რომელიც სუფრაზე სადღეგრძელოს ადასტურებს. ბრენდი ამ ჟესტზე დგას: ღვინო, რომელსაც ენდობი და სხვასაც ურჩევ.
            </p>
          </Block>
          <Block className="p-7 sm:p-12 text-white flex flex-col justify-between min-h-[420px]">
            <div>
              <Label>02 · სიმბოლო</Label>
              <div className="mt-5 text-[34px] sm:text-[44px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>ჯიხვი{dot}</div>
            </div>
            <p className="mt-10 max-w-[440px] text-[17px] leading-[1.55] text-white/80">
              კავკასიის მთის ჯიხვი სიმტკიცისა და მიწასთან კავშირის ნიშანია. ცხოველი მშვიდ, ამაყ ნაბიჯშია ნაჩვენები, რქის მრუდი კი ქართული ასოების რბილ რიტმს იმეორებს.
            </p>
          </Block>
        </div>
      </section>

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <section aria-labelledby="logo" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-1.5">
          <Reveal>
            <div className="rounded-md p-10 sm:p-16 flex items-center justify-center" style={{ background: PAPER }}>
              <img src={`${P}/logo-red.png`} alt="დასტურის ლოგო: ჯიხვი და ქართულ-ლათინური სიტყვანიშანი" width="1200" height="1200" loading="lazy" className="block w-full max-w-[520px] h-auto" />
            </div>
          </Reveal>
          <div className="grid grid-rows-2 gap-1.5">
            <Block className="p-8 flex items-center justify-center">
              <img src={`${P}/logo-gold.png`} alt="ლოგო ოქროსფერში" width="1200" height="1200" loading="lazy" className="block w-full max-w-[240px] h-auto" />
            </Block>
            <div className="rounded-md p-8 flex items-center justify-center" style={{ background: RED }}>
              <img src={`${P}/logo-ivory.png`} alt="ლოგო წითელ ფონზე" width="1200" height="1200" loading="lazy" className="block w-full max-w-[240px] h-auto" />
            </div>
          </div>
        </div>
        <div className="px-0.5 pt-3 pb-1 text-[14px] text-[#6f6f6f]">
          <h2 id="logo" className="inline text-[#111]">ლოგო</h2> · ჯიხვი, ქართული სიტყვანიშანი და ლათინური ხაზი ერთ ვერტიკალურ ლოკაპში. სამი ფერის ვერსია: ქაღალდზე, ოქროსფერი ბნელზე და სპილოს ძვლისფერი წითელზე.
        </div>
      </section>

      {/* ── Colour ────────────────────────────────────────────────── */}
      <section aria-labelledby="colour" className="px-1.5 pt-20">
        <Block className="p-7 sm:p-12 text-white">
          <Label>03 · ფერი</Label>
          <h2 id="colour" className="mt-5 max-w-[760px] text-[28px] sm:text-[40px] leading-[1.05]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            ერთი წითელი, ხუთიდან შერჩეული{dot}
          </h2>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-white/70">
            წითელი ბრენდის ხმაა, ამიტომ ხუთი ტონი ერთმანეთის გვერდით შევადარეთ. საბოლოოდ #ED1C24 დარჩა: ის ყველაზე ახლოსაა საქპატენტში დარეგისტრირებულ ნიშანთან და ოქროზეც მკვეთრად იკითხება.
          </p>
          <button type="button" onClick={() => setOpen(3)} className="mt-10 block w-full rounded-md overflow-hidden bg-white outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label="წითლის შერჩევის გადიდება">
            <img src={`${P}/red-selection.jpg`} alt="ხუთი წითელი ტონის შედარება, მონიშნულია #ED1C24" width="2000" height="790" loading="lazy" className="block w-full h-auto" />
          </button>
          <div className="mt-1.5 grid grid-cols-2 lg:grid-cols-4 gap-1.5">
            {palette.map((c) => (
              <div key={c.hex} className="rounded-md overflow-hidden border border-white/10">
                <div className="h-28" style={{ background: c.hex }} />
                <div className="px-4 py-3">
                  <div className="text-[15px] text-white">{c.name}</div>
                  <div className="mt-0.5 text-[13px] text-white/50 tabular-nums">{c.hex} · {c.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>
      </section>

      {/* ── Label: whole, then details ────────────────────────────── */}
      <section aria-labelledby="label" className="px-1.5 pt-1.5">
        <Block className="p-7 sm:p-12 text-white">
          <Label>04 · ეტიკეტი</Label>
          <h2 id="label" className="mt-5 max-w-[760px] text-[28px] sm:text-[40px] leading-[1.05]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            ოქროს ქაღალდი, ამოჭრილი ჯიხვი{dot}
          </h2>
          <p className="mt-5 max-w-[560px] text-[16px] leading-[1.6] text-white/70">
            ჯიხვი ოქროს ქაღალდში ამოჭრილი ფანჯარასავითაა: წითელი სიღრმიდან ჩანს, კონტური არ სჭირდება. გვერდითი შავი ზოლი ბრენდს ინახავს, ცენტრი კი ჯიშს ეკუთვნის.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-1.5 items-start">
            <button type="button" onClick={() => setOpen(0)} className="rounded-md overflow-hidden outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label="ეტიკეტის გადიდება">
              <img src={`${P}/label.jpg`} alt="საფერავის სრული ეტიკეტი" width="1200" height="2160" loading="lazy" className="block w-full h-auto" />
            </button>
            <div className="grid gap-1.5">
              <button type="button" onClick={() => setOpen(1)} className="rounded-md overflow-hidden outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label="ჯიხვის გადიდება">
                <img src={`${P}/label-ibex.jpg`} alt="ამოჭრილი წითელი ჯიხვი ოქროს ქაღალდზე, ახლო ხედი" loading="lazy" className="block w-full h-auto" />
              </button>
              <button type="button" onClick={() => setOpen(2)} className="rounded-md overflow-hidden outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label="ჯიშის სახელის გადიდება">
                <img src={`${P}/label-type.jpg`} alt="ჯიშის სახელი: საფერავი, ქართული კალიგრაფიული შრიფტით" loading="lazy" className="block w-full h-auto" />
              </button>
            </div>
          </div>

          <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {[
              { t: 'ამოჭრილი ჯიხვი', d: 'წითელი ფენა ოქროს ქაღალდის ქვეშაა, ჭრილი ჩრდილს თავად ქმნის.' },
              { t: 'ჯიშის სახელი', d: 'ქართული კალიგრაფიული ასოები, ლათინური დუბლი იშვიათი ინტერვალით.' },
              { t: 'გვერდითი ზოლი', d: 'შავ ზოლზე ბრენდი, მოცულობა და ალკოჰოლი: ყოველთვის ერთ ადგილას.' },
            ].map((x, i) => (
              <div key={x.t} className="rounded-md border border-white/10 p-6">
                <div className="text-[13px] tabular-nums" style={{ color: RED }}>0{i + 1}</div>
                <div className="mt-6 text-[16px] text-white">{x.t}</div>
                <p className="mt-1.5 text-[14px] leading-[1.5] text-white/60">{x.d}</p>
              </div>
            ))}
          </div>
        </Block>
      </section>

      {/* ── Type ──────────────────────────────────────────────────── */}
      <section aria-labelledby="type" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-1.5">
          <div className="rounded-md overflow-hidden" style={{ background: INK }}>
            <img src={`${P}/label-band.jpg`} alt="ეტიკეტის გვერდითი ზოლი: დასტური ვერტიკალურად" loading="lazy" className="block h-[420px] w-auto mx-auto" />
          </div>
          <Block className="p-7 sm:p-12 text-white flex flex-col justify-center">
            <Label>05 · ტიპოგრაფია</Label>
            <h2 id="type" className="mt-5 text-[28px] sm:text-[40px] leading-[1.05]" style={{ fontFamily: T.display, fontWeight: 900 }}>ორი ანბანი, ერთი ხმა{dot}</h2>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.6] text-white/70">
              ქართული სიტყვანიშანი და ლათინური სერიფი ერთ რიტმზეა აწყობილი, ერთი სიმაღლითა და ფართო ინტერვალით. ასე ეტიკეტი ორივე ენაზე ერთნაირად იკითხება, სახლშიც და ექსპორტზეც.
            </p>
          </Block>
        </div>
      </section>

      {/* ── Outcome ───────────────────────────────────────────────── */}
      <section aria-labelledby="result" className="px-1.5 pt-1.5">
        <Block className="px-6 py-24 sm:px-12 sm:py-32 text-center text-white">
          <Label>შედეგი</Label>
          <h2 id="result" className="mx-auto mt-6 max-w-[860px] text-[32px] sm:text-[56px] leading-[1]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            ბრენდი, რომელსაც დასტური აქვს{dot}
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.6] text-white/70">
            ერთი ნიშანი, ერთი წითელი და ეტიკეტის სისტემა, რომელიც ახალ ჯიშებზე იგივე წესით გაგრძელდება: ღვინის სახლისთვის, რომელიც ტრადიციას თანამედროვე ენით ყვება.
          </p>
          <div className="mt-10 flex justify-center"><CtaLink /></div>
        </Block>
      </section>

      {/* ── Other cases ───────────────────────────────────────────── */}
      <section aria-labelledby="more" className="px-1.5 pt-24">
        <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">სხვა ქეისები</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5">
          {others.map((o) => (
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
