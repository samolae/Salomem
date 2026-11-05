import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../components/seo';
import { BakedShell } from './shell';
import { CtaLink, Reveal, T } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';
import { GaguaLettering } from './gagua-cover';

/*
 * Gagua Clinic: a maternity and family clinic in Tbilisi. Three campaigns,
 * each with its own hand-drawn Georgian lettering (Home Care, Born at Gagua,
 * the Medical Concierge), and the ads that
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
    <div className="mx-auto w-full flex flex-col sm:flex-row gap-1.5" style={{ maxWidth: max ?? 1040 }}>
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


/** the palette as moving panels: they rise in one by one, the one you point at opens */
function Palette() {
  const { tx } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const sw: [string, string, string][] = [[GREEN, tx('Gagua green', 'გაგუას მწვანე'), '#fff'], [YELLOW, tx('Warm yellow', 'თბილი ყვითელი'), '#111'], [NAVY, tx('Deep navy', 'მუქი ლურჯი'), '#fff'], ['#F7F7F2', tx('Paper', 'ქაღალდი'), '#111']];
  return (
    <section className="px-1.5 pt-1.5">
      <div ref={ref} className="gp flex gap-1.5 h-[180px] sm:h-[260px]" data-on={on || undefined}>
        {sw.map(([c, name, ink], i) => (
          <div key={c} className="gp-sw relative overflow-hidden rounded-md p-4 flex flex-col justify-end text-[13px]" style={{ background: c, color: ink, transitionDelay: `${i * 110}ms`, border: c === '#F7F7F2' ? '1px solid #eee' : undefined }}>
            <div style={{ fontWeight: 600 }}>{name}</div><div className="opacity-70">{c}</div>
          </div>
        ))}
      </div>
      <style>{`
        .gp-sw { flex: 1 1 0; transform: translateY(40%); opacity: 0; transition: transform .8s cubic-bezier(.2,.8,.2,1), opacity .5s ease, flex-grow .6s cubic-bezier(.2,.8,.2,1); }
        .gp[data-on] .gp-sw { transform: none; opacity: 1; }
        .gp[data-on] .gp-sw:hover { flex-grow: 2.4; transition-delay: 0ms !important; }
        @media (prefers-reduced-motion: reduce) { .gp-sw { transform: none; opacity: 1; transition: none; } }
      `}</style>
    </section>
  );
}

/** the LinkedIn carousel: the slides come in stacked and fan out into a row */
function Fan() {
  const { tx } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const slides = ['li-01-cover', 'li-02-professionalism', 'li-03-care', 'li-04-development', 'li-05-accountability', 'li-06-closing'];
  return (
    <section className="px-1.5" aria-label={tx('LinkedIn carousel', 'LinkedIn კარუსელი')}>
      <div ref={ref} className="lf relative overflow-hidden rounded-md py-8 sm:py-14" style={{ background: GREEN }} data-on={on || undefined}>
        <div className="overflow-x-auto -my-8 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max sm:w-auto sm:justify-center gap-2 sm:gap-3 px-3">
          {slides.map((n, i) => (
            <div key={n} className="lf-card shrink-0 w-[42vw] sm:w-[15%] aspect-[4/5] overflow-hidden rounded-[6px] shadow-[0_14px_30px_rgba(0,0,0,.14)]"
              style={{ ['--x' as string]: `${(2.5 - i) * 100}%`, ['--r' as string]: `${(i - 2.5) * 3}deg`, transitionDelay: `${i * 70}ms`, zIndex: 10 - i }}>
              <img src={`${P}/${n}.jpg`} alt={`${tx('LinkedIn slide', 'LinkedIn სლაიდი')} ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        </div>
      </div>
      <style>{`
        .lf-card { transform: translateX(var(--x)) rotate(var(--r)); transition: transform 1s cubic-bezier(.2,.8,.2,1); }
        .lf[data-on] .lf-card { transform: none; }
        .lf[data-on] .lf-card:hover { transform: translateY(-8px); transition-delay: 0ms !important; transition-duration: .35s; }
        @media (max-width: 639px) { .lf-card { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .lf-card { transform: none; transition: none; } }
      `}</style>
    </section>
  );
}

/** vacancies in the kit's two styles, each frame cycling through its posts */
function Vacancies() {
  const { tx } = useI18n();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setK((x) => x + 1), 1800);
    return () => clearInterval(t);
  }, []);
  const sets = [
    ['vac-it', 'vac-orderly'],                          // white card
    ['vac-midwife', 'vac-style2', 'li-vacancy'],        // yellow bar
  ];
  return (
    <section className="px-1.5 pt-1.5" aria-label={tx('Vacancy posts', 'ვაკანსიების პოსტები')}>
      {/* same width and edges as the cover above, one vertical line */}
      <div className="mx-auto w-full max-w-[1040px] grid grid-cols-2 gap-1.5">
      {sets.map((set, si) => {
        // the two frames change on alternate beats
        const at = Math.floor((k + si) / 2) % set.length;
        return (
          <div key={si} className="relative aspect-square overflow-hidden rounded-md bg-[#f2f2f2]">
            {set.map((n, i) => (
              <img key={n} src={`${P}/${n}.jpg`} alt={tx('Gagua vacancy post', 'გაგუას ვაკანსიის პოსტი')} loading="lazy" decoding="async" draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
                style={{ opacity: i === at ? 1 : 0, transform: i === at ? 'scale(1)' : 'scale(1.06)' }} />
            ))}
          </div>
        );
      })}
      </div>
    </section>
  );
}

export function GaguaCase() {
  const { tx } = useI18n();
  const tags = [tx('Social media kit', 'სოც. მედიის კიტი'), tx('Visual style', 'ვიზუალური სტილი'), tx('Lettering', 'ლეტერინგი')];
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), tx('Gagua Clinic', 'გაგუას კლინიკა')],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Maternity and family medicine', 'მეანობა და საოჯახო მედიცინა')],
    [tx('Work', 'სამუშაო'), tx('Social media kit, lettering, LinkedIn', 'სოც. მედიის კიტი, ლეტერინგი, LinkedIn')],
  ];

  return (
    <BakedShell>
      <SEO
        title="Gagua Clinic | Social Media Kit Case Study"
        description="Gagua Clinic: a refreshed social media kit, hand-drawn Georgian lettering for three campaigns, the Medical Concierge and the LinkedIn career page."
        keywords="Gagua Clinic, გაგუას კლინიკა, lettering, Georgian lettering, campaign, medical concierge, social media, Salome Mosiava"
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

        {/* cover: the three hand-drawn names, trading places */}
        <section className="px-1.5">
          <div className="overflow-hidden rounded-md aspect-[4/3] sm:aspect-[16/9]">
            <GaguaLettering />
          </div>
        </section>

        <section className="px-5 sm:px-8 pt-20 sm:pt-28">
          <Reveal className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-4 md:gap-10 max-w-[1400px]">
            <h2 className="text-[17px] sm:text-[19px]" style={{ fontWeight: 600 }}>{tx('Brief', 'ბრიფი')}</h2>
            <p className="text-[22px] sm:text-[30px] leading-[1.22] tracking-[-0.01em] max-w-[900px]">
              {tx(
                'A refresh of Gagua Clinic’s visual style for social media. One kit for Facebook, Instagram and LinkedIn: the clinic’s green panel, a yellow accent, bold Mtavruli headlines, and a hand-drawn name for every campaign, so each new service feels like the same clinic.',
                'გაგუას კლინიკის ვიზუალური სტილის განახლება სოციალური მედიისთვის. ერთი კიტი Facebook-ის, Instagram-ისა და LinkedIn-ისთვის: კლინიკის მწვანე პანელი, ყვითელი აქცენტი, თამამი მთავრული სათაურები და ხელით დახატული სახელი ყველა კამპანიისთვის, რომ ყოველი ახალი სერვისი იმავე კლინიკად იკითხებოდეს.'
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
        </section>

        {/* 03 born at gagua */}
        <Chapter n="03" name={tx('Born at Gagua', 'დავიბადე გაგუაში')} title={tx('A sticker every family wants to share', 'სტიკერი, რომლის გაზიარებაც ყველა ოჯახს უნდა')}>
          {tx('“Born at Gagua” is lettering made to travel: on the Facebook cover and on stickers for new parents.', '„დავიბადე გაგუაში“ ლეტერინგია, რომელიც უნდა გავრცელდეს: Facebook-ის ქავერზე და სტიკერებზე ახალი მშობლებისთვის.')}
        </Chapter>
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('born-cover', 3280, 1248, 'Born at Gagua, Facebook cover')]} />
        </section>

        {/* 04 concierge */}
        <Chapter n="04" name={tx('Medical Concierge', 'სამედიცინო კონსიერჟი')} title={tx('A new standard of care', 'ზრუნვის ახალი სტანდარტი')}>
          {tx('A line where doctors answer patients from 09:00 to 01:00. Bold Mtavruli, a yellow script word, the phone number always in reach.', 'ხაზი, სადაც ექიმები პაციენტებს 09:00-დან 01:00-მდე პასუხობენ. თამამი მთავრული, ყვითელი ხელწერის სიტყვა, ტელეფონის ნომერი ყოველთვის ხელთ.')}
        </Chapter>
        <section className="px-1.5 pt-1.5 flex flex-col gap-1.5">
          <Row items={[im('cc-post', 4, 5, 'Concierge post'), { src: `${P}/cc-endcard.mp4`, poster: `${P}/cc-endcard.jpg`, video: true, w: 9, h: 16, alt: 'Concierge story end card' }]} />
        </section>

        {/* colours, in motion */}
        <Palette />

        {/* 05 linkedin */}
        <Chapter n="05" name="LinkedIn" title={tx('Gagua Clinic Career', 'გაგუას კლინიკა, კარიერა')}>
          {tx('The clinic’s career page: a carousel of the four principles the team works by, the page cover, and vacancies in two styles that take turns.', 'კლინიკის საკარიერო გვერდი: კარუსელი ოთხ პრინციპზე, რომლითაც გუნდი მუშაობს, გვერდის ქავერი და ვაკანსიები ორ სტილში, რომლებიც ერთმანეთს ცვლიან.')}
        </Chapter>
        <Fan />
        <section className="px-1.5 pt-1.5 flex flex-col gap-1.5">
          <Row items={[im('li-career-cover', 2000, 740, 'Gagua Clinic Career, LinkedIn cover')]} />
        </section>
        <Vacancies />

        {/* 06 ads */}
        <Chapter n="06" name={tx('Ads', 'რეკლამა')} title={tx('The app, the scan, the birth', 'აპლიკაცია, ექოსკოპია, მშობიარობა')}>
          {tx('Each service as a story, the action always in one green bar.', 'თითო სერვისი სთორიში, მოქმედება კი ყოველთვის ერთ მწვანე ზოლშია.')}
        </Chapter>
        <section className="px-1.5 flex flex-col gap-1.5">
          <Row items={[im('ad-app-story', 9, 16, 'Download the Gagua app'), im('ad-scan-story', 9, 16, 'Book a 4D scan'), im('ad-birth-story', 9, 16, 'Plan your birth at Gagua')]} max={820} />
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
