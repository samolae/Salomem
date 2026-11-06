import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../components/seo';
import { BakedShell, useMotionPause } from './shell';
import { CtaLink, Reveal, T } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';
import { GaguaLettering } from './gagua-cover';

/*
 * Gagua Clinic: a maternity and family clinic in Tbilisi, told as one brand
 * with many campaigns: Home Care, Born at Gagua, the Medical Concierge, the
 * career page, the 30th anniversary New Year kit and the ads. Each keeps its
 * own voice, mostly a hand-drawn name, inside one system.
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
    <header id={`c${n}`} className="scroll-mt-20 px-5 sm:px-8 pt-24 sm:pt-32 pb-8 sm:pb-10">
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

/** the campaigns, one line: each jumps to its chapter */
function Campaigns() {
  const { tx } = useI18n();
  const list: [string, string][] = [
    ['01', tx('Lettering', 'ლეტერინგი')], ['02', tx('Home Care', 'შინ ზრუნვა')], ['03', tx('Born at Gagua', 'დავიბადე გაგუაში')],
    ['04', tx('Medical Concierge', 'სამედიცინო კონსიერჟი')], ['05', tx('Career', 'კარიერა')], ['06', tx('30 years', '30 წელი')], ['07', tx('Ads', 'რეკლამა')],
  ];
  return (
    <nav aria-label={tx('Campaigns in this case', 'კამპანიები ამ ქეისში')} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px] sm:text-[15px]">
      {list.map(([n, name]) => (
        <a key={n} href={`#c${n}`} className="group inline-flex items-baseline gap-1.5 text-[#111] hover:text-[#40A750] transition-colors">
          <span className="text-[11px] tabular-nums text-[#9a9a9a] group-hover:text-current">{n}</span>{name}
        </a>
      ))}
    </nav>
  );
}

/** printed pieces on a light ground. The shadow is drawn here, with room
 *  around it, so it is never cut at the edge */
const SHADOW = '0 14px 28px rgba(25,40,50,.16), 0 2px 6px rgba(25,40,50,.10)';
type Sheet = { src: string; alt: string; w: number; h: number; radius?: number };
function Stage({ items, bg = '#F4F6F7', className = '' }: { items: Sheet[]; bg?: string; className?: string }) {
  // one justified line: every sheet at the same height, each as wide as its proportion asks;
  // on a narrow screen the line wraps instead of shrinking the pieces to nothing
  return (
    <div className={`gk-stage rounded-md flex flex-wrap items-center justify-center ${className}`} style={{ background: bg }}>
      {items.map((m) => {
        const r = m.w / m.h;
        return (
          <img key={m.src} src={m.src} alt={m.alt} width={m.w} height={m.h} loading="lazy" decoding="async" draggable={false}
            className="block h-auto min-w-0" style={{ flex: `${r} 1 calc(${r} * var(--gk-h))`, maxWidth: `calc(${r} * var(--gk-m))`, aspectRatio: `${m.w}/${m.h}`, boxShadow: SHADOW, borderRadius: m.radius ?? 2 }} />
        );
      })}
    </div>
  );
}

/** the kit's mockups on one line, drifting slowly sideways. Drag to spin it,
 *  it glides on and settles back into the drift; a pointer resting on it holds it */
function MockStrip() {
  const { tx } = useI18n();
  const { paused } = useMotionPause();
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const shots: [string, string][] = [
    ['mock-notebook-held', tx('The notebook held close', 'ბლოკნოტი ხელში')],
    ['mock-calendar-green', tx('The wall calendar held against the clinic green', 'კედლის კალენდარი კლინიკის მწვანეზე')],
    ['mock-card', tx('The card, front and back, and the strip torn off into a bookmark', 'ბარათი, წინა და უკანა მხარე, და სანიშნედ მოხეული ზოლი')],
    ['mock-calendar-wall', tx('The calendar on the wall above a desk', 'კალენდარი კედელზე, მაგიდის ზემოთ')],
    ['mock-spread-held', tx('The notebook open on the year at a glance', 'ბლოკნოტი გაშლილი მთელი წლის გვერდზე')],
  ];

  useEffect(() => {
    const el = box.current, tr = track.current;
    if (!el || !tr) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0, vel = 0, raf = 0, prev = performance.now(), hover = false, inView = false;
    let drag: { x: number; t: number; id: number; moved: number } | null = null;
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
      const half = tr.scrollWidth / 2;
      if (!drag) {
        x += vel * dt;
        vel *= 0.05 ** dt;
        if (Math.abs(vel) < 4) vel = 0;
        if (!reduced && !pausedRef.current && !hover) x -= 28 * dt;
      }
      if (half > 0) x = ((x % half) - half) % half; // keep it inside one copy, so it loops without a seam
      tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      if (inView && (drag || vel || (!reduced && !pausedRef.current && !hover))) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) kick(); });
    io.observe(el);
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { x: e.clientX, t: performance.now(), id: e.pointerId, moved: 0 }; vel = 0;
      el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; kick();
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now(), dx = e.clientX - drag.x, dt = Math.max(1, now - drag.t) / 1000;
      x += dx; drag.moved += Math.abs(dx);
      vel = vel * 0.6 + (dx / dt) * 0.4;
      drag.x = e.clientX; drag.t = now; kick();
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (performance.now() - drag.t > 80) vel = 0; // held still before letting go
      vel = Math.max(-4000, Math.min(4000, vel));
      drag = null; el.style.cursor = ''; kick();
    };
    const on = () => { hover = true; }, off = () => { hover = false; kick(); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('pointerenter', on); el.addEventListener('pointerleave', off);
    kick();
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.removeEventListener('pointerenter', on); el.removeEventListener('pointerleave', off);
    };
  }, []);
  useEffect(() => { window.dispatchEvent(new Event('resize')); }, [paused]);

  return (
    <div ref={box} className="gk-strip overflow-hidden rounded-md cursor-grab select-none" style={{ touchAction: 'pan-y' }} aria-label={tx('Mockups of the kit, drag to spin', 'ნაკრების მოქაფები, გადაატრიალე')}>
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-1.5 pr-1.5" aria-hidden={copy === 1 || undefined}>
            {shots.map(([n, alt]) => (
              <img key={n} src={`${P}/${n}.jpg`} alt={copy ? '' : alt} width={1360} height={2048} loading="lazy" decoding="async" draggable={false}
                className="gk-shot block w-auto rounded-md object-cover pointer-events-none" />
            ))}
          </div>
        ))}
      </div>
      <style>{`.gk-shot { height: clamp(280px, 30vw, 480px); aspect-ratio: 1360 / 2048; }`}</style>
    </div>
  );
}

/** the New Year kit: what each piece is for, in a few words */
function KitNotes() {
  const { tx } = useI18n();
  const notes: [string, string][] = [
    [tx('Three months at once', 'სამი თვე ერთად'), tx('The wall calendar shows last, this and next month. A red frame slides to today, a yellow band marks the week.', 'კედლის კალენდარზე ერთად ჩანს წინა, მიმდინარე და შემდეგი თვე. წითელი ჩარჩო დღეზე გადაადგილდება, ყვითელი ზოლი კვირას აჩვენებს.')],
    [tx('Days worth marking', 'მნიშვნელოვანი დღეები'), tx('Twelve removable window stickers mark a date without hiding it. Weekends and holidays are green, each holiday named.', 'თორმეტი მოსახსნელი ფანჯრის სტიკერი თარიღს ნიშნავს და არ ფარავს. შაბათ-კვირა და უქმეები მწვანეა, უქმე სახელით.')],
    [tx('A notebook for the day', 'ბლოკნოტი ყოველდღისთვის'), tx('The year on the first spread, then a day plan: the one main thing, the hours, a checklist and notes.', 'პირველ გაშლაზე მთელი წელი, შემდეგ დღის გეგმა: დღის მთავარი, საათები, გასაკეთებელი და შენიშვნები.')],
    [tx('Kept, not thrown away', 'შესანახი'), tx('The card’s side strip tears off into a bookmark, and the spine reads “Gagua 2027” on a shelf.', 'ბარათის გვერდითი ზოლი სანიშნედ იხევა, ბლოკნოტის ზურგზე კი თაროზეც იკითხება „გაგუა 2027“.')],
  ];
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 content-start">
      {notes.map(([k, v], i) => (
        <div key={k} className="border-t border-[#e6e6e6] pt-3">
          <dt className="text-[15px] sm:text-[16px]" style={{ fontWeight: 600 }}><span className="mr-2 text-[12px] tabular-nums" style={{ color: GREEN }}>0{i + 1}</span>{k}</dt>
          <dd className="mt-1.5 text-[14px] sm:text-[15px] leading-[1.5] text-[#555]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function GaguaCase() {
  const { tx } = useI18n();
  const tags = [tx('Brand campaigns', 'ბრენდის კამპანიები'), tx('Social media kit', 'სოც. მედიის კიტი'), tx('Lettering', 'ლეტერინგი'), tx('Print', 'ბეჭდვითი')];
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), tx('Gagua Clinic', 'გაგუას კლინიკა')],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Maternity and family medicine', 'მეანობა და საოჯახო მედიცინა')],
    [tx('Work', 'სამუშაო'), tx('Campaigns, social media kit, lettering, print', 'კამპანიები, სოც. მედიის კიტი, ლეტერინგი, ბეჭდვითი')],
  ];

  return (
    <BakedShell>
      <SEO
        title="Gagua Clinic | One Brand, Many Campaigns"
        description="Gagua Clinic as one brand with many campaigns: Home Care, Born at Gagua, the Medical Concierge, the career page, a 30th anniversary New Year kit and the ads, each with its own hand-drawn voice in one system."
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
          <Campaigns />
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
                'One clinic, many campaigns. Home Care, Born at Gagua, the Medical Concierge, the career page, the 30th anniversary and the ads each needed their own voice, usually a name drawn by hand. They all sit in one system: the clinic’s green, a yellow accent, bold Mtavruli and a refreshed social media kit, so every service still reads as Gagua.',
                'ერთი კლინიკა, ბევრი კამპანია. შინ ზრუნვას, „დავიბადე გაგუაში“-ს, სამედიცინო კონსიერჟს, საკარიერო გვერდს, 30 წლის იუბილესა და რეკლამებს თავისი ხმა სჭირდებოდა, ხშირად ხელით დახატული სახელი. ყველა ერთ სისტემაშია: კლინიკის მწვანე, ყვითელი აქცენტი, თამამი მთავრული და განახლებული სოციალური მედიის კიტი, რომ ყოველი სერვისი მაინც გაგუად იკითხებოდეს.'
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
          {tx('The clinic’s career page: the page cover and vacancies in two styles that take turns.', 'კლინიკის საკარიერო გვერდი: გვერდის ქავერი და ვაკანსიები ორ სტილში, რომლებიც ერთმანეთს ცვლიან.')}
        </Chapter>
        <section className="px-1.5 pt-1.5 flex flex-col gap-1.5">
          <Row items={[im('li-career-cover', 2000, 740, 'Gagua Clinic Career, LinkedIn cover')]} />
        </section>
        <Vacancies />

        {/* 06 the 30th year: a New Year kit for the desk */}
        <Chapter n="06" name={tx('30 years of dedication', 'მიძღვნის 30 წელი')} title={tx('A year on the desk', 'მთელი წელი მაგიდაზე')}>
          {tx('For the clinic’s 30th year, a New Year kit for partners and the team: a notebook, a card and a wall calendar. The anniversary lettering and a drawing of the clinic with its people tie it to the campaign. Every page was planned to be used all year.', 'კლინიკის 30-ე წლისთვის საახალწლო ნაკრები პარტნიორებისა და გუნდისთვის: ბლოკნოტი, ბარათი და კედლის კალენდარი. იუბილეს ლეტერინგი და ხელით დახატული კლინიკა თავისი ხალხით მას კამპანიას უკავშირებს. ყოველი გვერდი ისეა დაგეგმილი, რომ მთელი წელი გამოიყენო.')}
        </Chapter>
        {/* the pieces in use, in the clinic's own green and yellow, under one hard, direct light: the full width of the page */}
        <section className="px-1.5 pb-1.5"><MockStrip /></section>
        <section className="px-1.5">
          <div className="mx-auto w-full max-w-[1040px] flex flex-col gap-1.5">
            <Stage items={[
              { src: `${P}/kit-wrap.jpg`, alt: tx('Notebook cover, opened flat: back, spine and front', 'ბლოკნოტის ყდა გაშლილი: უკანა მხარე, ზურგი და წინა მხარე'), w: 907, h: 610 },
              { src: `${P}/kit-plan.jpg`, alt: tx('Inside pages: notes and the day plan', 'შიდა გვერდები: ჩანაწერები და დღის გეგმა'), w: 893, h: 632 },
              { src: `${P}/kit-january.jpg`, alt: tx('January 2027, one sheet: holidays green and named', 'იანვარი 2027, ერთი ფურცელი: უქმეები მწვანე, სახელით'), w: 1153, h: 545 },
              { src: `${P}/kit-stickers.jpg`, alt: tx('Sheet of twelve window stickers', 'თორმეტი ფანჯრის სტიკერის ფურცელი'), w: 293, h: 372, radius: 8 },
            ]} />
            <div className="px-4 sm:px-6 pt-6"><KitNotes /></div>
          </div>
          <style>{`
            .gk-stage { --gk-h: 96px; --gk-m: 154px; padding: 24px 16px; gap: 14px; }
            /* from a tablet up: one line, every sheet at one height, nothing wraps */
            @media (min-width: 640px) { .gk-stage { --gk-h: 0px; --gk-m: 100vw; flex-wrap: nowrap; padding: 36px 32px; gap: 22px; } }
            @media (min-width: 1024px) { .gk-stage { padding: 40px 36px; gap: 26px; } }
          `}</style>
        </section>

        {/* 07 ads */}
        <Chapter n="07" name={tx('Ads', 'რეკლამა')} title={tx('The app, the scan, the birth', 'აპლიკაცია, ექოსკოპია, მშობიარობა')}>
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
