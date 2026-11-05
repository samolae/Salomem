import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../components/seo';
import { BakedShell } from './shell';
import { CtaLink, Reveal, T } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';

/*
 * Gagua Clinic: a maternity and family clinic in Tbilisi. Three campaigns,
 * each with its own hand-drawn Georgian lettering (Home Care, Born at Gagua,
 * the Medical Concierge), a guideline for the concierge, and the ads that
 * carried all of it.
 */
const P = '/cases/gagua';
const GREEN = '#40A750';
const YELLOW = '#F6B21B';
const NAVY = '#1F3547';
const MINT = '#EEF6EF';

type M = { src: string; w: number; h: number; alt?: string; video?: boolean; poster?: string; bg?: string; contain?: boolean };
const im = (n: string, w: number, h: number, alt = '', ext = 'jpg'): M => ({ src: `${P}/${n}.${ext}`, w, h, alt });

function Piece({ m }: { m: M }) {
  const cls = `block h-full w-full ${m.contain ? 'object-contain p-[8%]' : 'object-cover'}`;
  return m.video
    ? <video src={m.src} poster={m.poster} muted loop playsInline autoPlay preload="none" className={cls} aria-label={m.alt} />
    : <img src={m.src} alt={m.alt ?? ''} loading="lazy" decoding="async" draggable={false} className={cls} />;
}

/** pieces side by side at their own proportions, nothing cropped */
function Row({ items, max }: { items: M[]; max?: number }) {
  return (
    <div className="mx-auto flex flex-col sm:flex-row gap-1.5" style={{ maxWidth: max }}>
      {items.map((m, i) => (
        <div key={i} className="overflow-hidden rounded-md" style={{ flex: `${m.w / m.h} 1 0%`, aspectRatio: `${m.w}/${m.h}`, background: m.bg ?? '#f2f2f2' }}>
          <Piece m={m} />
        </div>
      ))}
    </div>
  );
}

/** a chapter: number and name, a large title, a few words */
function Chapter({ n, name, title, children }: { n: string; name: string; title: string; children?: ReactNode }) {
  return (
    <header className="px-5 sm:px-8 pt-24 sm:pt-32 pb-8 sm:pb-10">
      <Reveal className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-4 md:gap-10 max-w-[1400px]">
        <div className="text-[13px] tracking-[0.08em] uppercase" style={{ color: GREEN, fontWeight: 600 }}>{n} / {name}</div>
        <div>
          <h2 className="text-[30px] sm:text-[48px] leading-[1.02] tracking-[-0.015em]" style={{ fontFamily: T.display, fontWeight: 900 }}>{title}</h2>
          {children && <p className="mt-4 text-[18px] sm:text-[22px] leading-[1.35] text-[#333] max-w-[820px]">{children}</p>}
        </div>
      </Reveal>
    </header>
  );
}

/** the concierge guideline, page by page, as a slider */
function Guide() {
  const { tx } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const pages = Array.from({ length: 15 }, (_, i) => `${P}/guide-${String(i + 1).padStart(2, '0')}.jpg`);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setAt(Math.round(el.scrollLeft / (el.firstElementChild as HTMLElement).offsetWidth));
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);
  const go = (d: number) => {
    const el = ref.current;
    if (!el) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 6;
    el.scrollTo({ left: Math.max(0, Math.min(pages.length - 1, at + d)) * w, behavior: 'smooth' });
  };
  return (
    <section className="px-1.5" aria-label={tx('Medical Concierge guideline', 'სამედიცინო კონსიერჟის გაიდლაინი')}>
      <div ref={ref} className="flex gap-1.5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pages.map((src, i) => (
          <div key={src} className="snap-start shrink-0 w-[92%] md:w-[78%] aspect-[16/9] overflow-hidden rounded-md bg-[#f2f2f2]">
            <img src={src} alt={`${tx('Guideline page', 'გაიდლაინის გვერდი')} ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" draggable={false} className="block h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between px-0.5 text-[13px] text-[#6f6f6f]">
        <span>{String(at + 1).padStart(2, '0')} / {pages.length}</span>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => go(-1)} aria-label={tx('Previous page', 'წინა გვერდი')} className="h-10 w-10 rounded-full border border-[#ddd] flex items-center justify-center hover:bg-[#111] hover:text-white transition-colors"><ArrowLeft size={16} /></button>
          <button type="button" onClick={() => go(1)} aria-label={tx('Next page', 'შემდეგი გვერდი')} className="h-10 w-10 rounded-full border border-[#ddd] flex items-center justify-center hover:bg-[#111] hover:text-white transition-colors"><ArrowRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}

export function GaguaCase() {
  const { tx } = useI18n();
  const tags = [tx('Lettering', 'ლეტერინგი'), tx('Campaigns', 'კამპანიები'), tx('Brand guideline', 'გაიდლაინი'), tx('Social media', 'სოციალური მედია')];
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), tx('Gagua Clinic', 'გაგუას კლინიკა')],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Maternity and family medicine', 'მეანობა და საოჯახო მედიცინა')],
    [tx('Work', 'სამუშაო'), tx('Lettering, campaigns, guideline, ads', 'ლეტერინგი, კამპანიები, გაიდლაინი, რეკლამა')],
  ];

  return (
    <BakedShell>
      <SEO
        title="Gagua Clinic | Lettering, Campaigns & Guideline Case Study"
        description="Gagua Clinic: hand-drawn Georgian lettering for three campaigns (Home Care, Born at Gagua, the Medical Concierge), a concierge guideline and the ads that carried them."
        keywords="Gagua Clinic, გაგუას კლინიკა, lettering, Georgian lettering, campaign, brand guideline, medical concierge, social media, Salome Mosiava"
        type="article"
      />
      <article className="pt-14 sm:pt-[52px] text-[#111]">
        {/* title */}
        <header className="px-5 sm:px-8 pt-10 sm:pt-16 pb-6 sm:pb-8">
          <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-[13px] text-[#6f6f6f] hover:text-[#111] transition-colors"><ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}</Link>
          <h1 className="mt-6 text-[40px] sm:text-[72px] leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            {tx('Gagua Clinic', 'გაგუას კლინიკა')}<span style={{ color: GREEN }}>.</span>
          </h1>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {tags.map((t) => <li key={t} className="inline-flex items-center h-8 px-3.5 rounded-full border border-[#111]/80 text-[13px]">{t}</li>)}
            <li className="inline-flex items-center h-8 px-3.5 rounded-full bg-[#f2f2f2] text-[13px] text-[#6f6f6f]">2026</li>
          </ul>
        </header>

        {/* cover: the concierge guideline's own cover */}
        <section className="px-1.5">
          <div className="overflow-hidden rounded-md aspect-[16/9]" style={{ background: GREEN }}>
            <img src={`${P}/guide-01.jpg`} alt={tx('Gagua Medical Concierge', 'გაგუას სამედიცინო კონსიერჟი')} fetchPriority="high" decoding="async" className="block h-full w-full object-cover" />
          </div>
        </section>

        <section className="px-5 sm:px-8 pt-20 sm:pt-28">
          <Reveal className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-4 md:gap-10 max-w-[1400px]">
            <h2 className="text-[17px] sm:text-[19px]" style={{ fontWeight: 600 }}>{tx('Brief', 'ბრიფი')}</h2>
            <p className="text-[22px] sm:text-[30px] leading-[1.22] tracking-[-0.01em] max-w-[900px]">
              {tx(
                'Gagua Clinic has looked after mothers and families for thirty years. Each new service needed to be told warmly, in Georgian, and still feel like one clinic. So every campaign got its own hand-drawn name, set in the clinic’s green and yellow.',
                'გაგუას კლინიკა ოცდაათი წელია დედებსა და ოჯახებს უვლის. ყოველ ახალ სერვისს თბილად, ქართულად უნდა ეთქვა და მაინც ერთ კლინიკად ჩანდეს. ამიტომ ყველა კამპანიამ საკუთარი, ხელით დახატული სახელი მიიღო, კლინიკის მწვანესა და ყვითელში.'
              )}
            </p>
          </Reveal>
        </section>

        {/* 01 lettering */}
        <Chapter n="01" name={tx('Lettering', 'ლეტერინგი')} title={tx('Three names, drawn by hand', 'სამი სახელი, ხელით დახატული')}>
          {tx('A script for each campaign: soft where the clinic speaks to mothers, firm where it promises a service.', 'თითო კამპანიას თავისი ხელწერა: რბილი, სადაც კლინიკა დედებს ელაპარაკება, მტკიცე, სადაც სერვისს გპირდება.')}
        </Chapter>
        <section className="px-1.5 grid grid-cols-1 md:grid-cols-3 gap-1.5">
          <div className="aspect-square overflow-hidden rounded-md" style={{ background: GREEN }}><img src={`${P}/home-lettering.jpg`} alt={tx('Home Care lettering', 'შინ ზრუნვის ლეტერინგი')} loading="lazy" className="h-full w-full object-cover" /></div>
          <div className="aspect-square overflow-hidden rounded-md flex items-center justify-center p-[8%]" style={{ background: MINT }}><img src={`${P}/born-sticker.png`} alt={tx('Born at Gagua lettering', 'დავიბადე გაგუაში, ლეტერინგი')} loading="lazy" className="w-full h-auto" /></div>
          <div className="aspect-square overflow-hidden rounded-md flex items-center justify-center p-[8%] bg-white border border-[#eee]"><img src={`${P}/cc-lockup.png`} alt={tx('Medical Concierge lockup', 'სამედიცინო კონსიერჟის ლოკაპი')} loading="lazy" className="w-full h-auto" /></div>
        </section>

        {/* 02 home care */}
        <Chapter n="02" name={tx('Home Care', 'შინ ზრუნვა')} title={tx('Care continues at home', 'ზრუნვა სახლშიც გრძელდება')}>
          {tx('After discharge, a Gagua nurse visits the mother and newborn at home, free of charge. The campaign keeps to quiet rooms, soft light and one warm word.', 'გაწერის შემდეგ გაგუას ექთანი დედასა და ახალშობილს სახლში სტუმრობს, უფასოდ. კამპანია მშვიდ ოთახებს, რბილ სინათლესა და ერთ თბილ სიტყვას ეყრდნობა.')}
        </Chapter>
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('home-grid', 3649, 3600, 'Home Care feed'), im('home-care-en', 4, 5, 'Care continues at home, English')]} />
          <Row items={[im('home-mother', 1, 1, 'Home Care from Gagua'), im('home-newsletter', 2892, 4096, 'Home Care newsletter')]} />
          <Row items={[im('home-banner', 16, 9, 'Home Care web banner')]} />
        </section>

        {/* 03 born at gagua */}
        <Chapter n="03" name={tx('Born at Gagua', 'დავიბადე გაგუაში')} title={tx('A sticker every family wants to share', 'სტიკერი, რომლის გაზიარებაც ყველა ოჯახს უნდა')}>
          {tx('“Born at Gagua” is lettering made to travel: on the Facebook cover, on stickers for new parents, on ads for the maternity ward.', '„დავიბადე გაგუაში“ ლეტერინგია, რომელიც უნდა გავრცელდეს: Facebook-ის ქავერზე, სტიკერებზე ახალი მშობლებისთვის, სამშობიარო განყოფილების რეკლამებში.')}
        </Chapter>
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('born-cover', 3280, 1248, 'Born at Gagua, Facebook cover')]} />
          <Row items={[{ ...im('born-sticker-logo', 1400, 614, 'Born at Gagua sticker with the logo', 'png'), bg: MINT, contain: true }, im('ad-birth', 1, 1, 'Plan your birth at Gagua'), im('ad-birth-story', 9, 16, 'Birth story')]} />
        </section>

        {/* 04 concierge */}
        <Chapter n="04" name={tx('Medical Concierge', 'სამედიცინო კონსიერჟი')} title={tx('A new standard of care, with a guideline', 'ზრუნვის ახალი სტანდარტი, გაიდლაინით')}>
          {tx('A line where doctors answer patients from 09:00 to 01:00. Bold Mtavruli, a yellow script word, the phone number always in reach. The guideline sets the lockups, colours, type, icons and every format.', 'ხაზი, სადაც ექიმები პაციენტებს 09:00-დან 01:00-მდე პასუხობენ. თამამი მთავრული, ყვითელი ხელწერის სიტყვა, ტელეფონის ნომერი ყოველთვის ხელთ. გაიდლაინი ადგენს ლოკაპებს, ფერებს, შრიფტს, იკონებს და ყველა ფორმატს.')}
        </Chapter>
        <Guide />
        <section className="px-1.5 pt-1.5 flex flex-col gap-1.5">
          <Row items={[im('cc-post', 4, 5, 'Concierge post'), im('cc-post-en', 4, 5, 'Concierge post, English'), im('cc-story', 9, 16, 'Concierge story'), { src: `${P}/cc-endcard.mp4`, poster: `${P}/cc-endcard.jpg`, video: true, w: 9, h: 16, alt: 'Concierge story end card' }]} />
          <Row items={[im('cc-newsletter', 6912, 2672, 'Concierge newsletter')]} />
          <Row items={[im('cc-web', 5190, 2310, 'Concierge on the website'), im('cc-app', 1335, 750, 'Concierge in the app')]} />
        </section>

        {/* colours */}
        <section className="px-1.5 pt-1.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {[[GREEN, tx('Gagua green', 'გაგუას მწვანე'), '#fff'], [YELLOW, tx('Warm yellow', 'თბილი ყვითელი'), '#111'], [NAVY, tx('Deep navy', 'მუქი ლურჯი'), '#fff'], ['#F7F7F2', tx('Paper', 'ქაღალდი'), '#111']].map(([c, name, ink]) => (
              <div key={c} className="aspect-[4/3] rounded-md p-4 flex flex-col justify-end text-[13px]" style={{ background: c, color: ink }}>
                <div style={{ fontWeight: 600 }}>{name}</div><div className="opacity-70">{c}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 05 ads */}
        <Chapter n="05" name={tx('Ads', 'რეკლამა')} title={tx('The app, the scan, the birth', 'აპლიკაცია, ექოსკოპია, მშობიარობა')}>
          {tx('Three services, each cut square for the feed and tall for stories, with the action always in one green bar.', 'სამი სერვისი, თითო კვადრატულად ფიდისთვის და ვერტიკალურად სთორისთვის, მოქმედება კი ყოველთვის ერთ მწვანე ზოლშია.')}
        </Chapter>
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('ad-app', 1, 1, 'Download the Gagua app'), im('ad-app-story', 9, 16, 'Gagua app story'), im('ad-scan', 1, 1, 'Book a 4D scan'), im('ad-scan-story', 9, 16, '4D scan story')]} />
        </section>

        {/* 06 thirty years */}
        <Chapter n="06" name={tx('30 years', '30 წელი')} title={tx('Thirty years of Gagua', 'გაგუას ოცდაათი წელი')} />
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('thirty', 1, 1, 'Gagua Clinic, 30 years'), im('kv', 1730, 770, 'Dedicated to 30 years, key visual')]} />
        </section>

        {/* facts */}
        <section className="px-5 sm:px-8 pt-20 sm:pt-28">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1100px] text-[14px]">
            {facts.map(([k, v]) => <div key={k}><dt className="text-[#9a9a9a] mb-1">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </section>

        <div className="pt-20 flex justify-center"><CtaLink /></div>
        <MoreCases current="/projects/gagua" />
      </article>
    </BakedShell>
  );
}
