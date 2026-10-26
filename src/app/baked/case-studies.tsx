import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Eye } from 'lucide-react';
import { CaseLink } from '../components/case-transition';
import { CtaLink, PageIntro, Reveal, T } from './ui';
import { IMG } from '../lib/cld';
import { screenAurumMainHQ, schenkerSendung, unispaceLogin } from './data';
import { useI18n } from './i18n';
import { ScopeCover } from './scope-logo';

/*
 * Case studies: product, branding and campaigns told as whole stories, laid out like
 * a studio's works page (after holymotors.com/works). A large cover, the
 * name with "View case", two lines on what it is, and the disciplines as
 * tags. Filters appear once there is more than one case to sort.
 */

/** Holy Motors style: a dash before "View case" that turns into an eye on hover */
function ViewCase({ small }: { small?: boolean }) {
  const { tx } = useI18n();
  return (
    <span className={`inline-flex items-center gap-3 whitespace-nowrap text-[#111] ${small ? 'text-[13px]' : 'text-[14px]'}`}>
      <span aria-hidden className="relative flex h-5 w-8 items-center justify-end">
        <span className="absolute right-0 h-px w-8 bg-current origin-right transition-transform duration-300 ease-out group-hover:scale-x-0 group-focus-visible:scale-x-0" />
        <Eye size={small ? 16 : 18} className="absolute right-0 opacity-0 scale-50 transition-[opacity,transform] duration-300 delay-100 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100" />
      </span>
      {tx('View case', 'ქეისის ნახვა')}
    </span>
  );
}

/** cover with a capsule picture that springs out and follows the cursor */
function PeekCover({ cover, peek, className }: { cover: React.ReactNode; peek: string; className: string }) {
  const cap = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cap.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    cap.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
  };
  return (
    <div className="relative" onPointerMove={move}>
      <div className={className}>{cover}</div>
      <div ref={cap} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 transition-transform duration-300 ease-out [@media(hover:none)]:hidden" style={{ transform: 'translate3d(50%, 50%, 0)' }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="w-[clamp(110px,13vw,190px)] aspect-[7/12] overflow-hidden rounded-full bg-[#ddd] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] opacity-0 scale-[0.35] -rotate-[10deg] transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,1.5,.4,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0">
            <img src={peek} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

type Study = {
  to: string;
  title: string;
  en: string; ka: string;
  tags: { en: string; ka: string }[];
  cover: React.ReactNode;
  /** a tall picture that pops out under the cursor on hover */
  peek: string;
};

/** Dasturi is hidden until its case is finished */
const DASTURI_LIVE = true;


function UnispaceCover() {
  return (
    <div className="flex h-full items-center justify-center p-[7%] bg-[radial-gradient(circle_at_70%_25%,#2a2f6b,#0b0d16_70%)]">
      <img {...IMG.caseMain(unispaceLogin)} alt="" loading="lazy" decoding="async" className="max-h-full w-auto max-w-full rounded-[10px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
    </div>
  );
}

function DasturiCover() {
  return (
    <div className="flex h-full items-center justify-center bg-[#111111]">
      <video src="/cases/dasturi/chrome-logo.mp4" poster="/cases/dasturi/chrome-logo.jpg" muted loop playsInline autoPlay preload="metadata" aria-hidden
        className="h-full aspect-square object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ mixBlendMode: 'lighten' }} />
    </div>
  );
}

/** FitMeal: a bento of the campaign, the strongest frame largest */
function FitmealBento() {
  // an editorial mosaic: one hero dish, then the picnic, the office and the drinks around it
  const tiles: [string, string, string][] = [
    ['table-salmon', '1 / span 2', '1 / span 3'],
    ['picnic-bowl', '3', '1 / span 2'],
    ['drink-mango', '4', '1'],
    ['drink-berry', '4', '2'],
    ['blanket-eat', '5 / span 2', '1 / span 2'],
    ['share', '3 / span 2', '3 / span 2'],
    ['stripe-spread', '5', '3'],
    ['floor-tall', '6', '3 / span 2'],
    ['office-greek', '1', '4'],
    ['park-read', '2', '4'],
    ['picnic-headphones', '5', '4'],
  ];
  return (
    <div className="grid h-full grid-cols-6 grid-rows-4 gap-1 bg-[#F6F1E7] p-1">
      {tiles.map(([k, col, row], i) => (
        <div key={k} className="relative overflow-hidden rounded-[4px]" style={{ gridColumn: col, gridRow: row }}>
          <img src={`/cases/fitmeal/${k}-800.jpg`} srcSet={`/cases/fitmeal/${k}-800.jpg 800w, /cases/fitmeal/${k}-1200.jpg 1200w`} sizes={i === 0 ? '(min-width: 768px) 17vw, 34vw' : '(min-width: 768px) 9vw, 17vw'} alt="" loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
            style={{ transitionDelay: `${(i % 4) * 60}ms` }} />
        </div>
      ))}
    </div>
  );
}

/** product work: the main screen on its own stage */


const CLD = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto';

/** a still that turns into its film on hover (desktop), or a second still */
function HoverCover({ img, srcSet, alt = '', film, swap }: { img: string; srcSet?: string; alt?: string; film?: string; swap?: string }) {
  return (
    <div className="relative h-full w-full">
      <img src={img} srcSet={srcSet} sizes="(min-width: 768px) 50vw, 100vw" alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
      {swap && <img src={swap} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
      {film && (
        <video src={film} muted loop playsInline preload="none" aria-hidden
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ref={(v) => { if (!v) return; const card = v.closest('a'); if (!card || (card as HTMLElement).dataset.film) return; (card as HTMLElement).dataset.film = '1';
            card.addEventListener('mouseenter', () => { v.play().catch(() => {}); }); card.addEventListener('mouseleave', () => v.pause()); }} />
      )}
    </div>
  );
}

/** product work: screens floating in perspective on the product's own colour */
function ScreensCover({ bg, screens, glow }: { bg: string; screens: string[]; glow?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: bg }}>
      {glow && <div aria-hidden className="absolute -inset-[20%] opacity-60" style={{ background: `radial-gradient(closest-side, ${glow}, transparent)` }} />}
      <div className="absolute inset-0 [perspective:1800px]">
        <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] [transform:rotateX(22deg)_rotateZ(-10deg)] group-hover:[transform:rotateX(14deg)_rotateZ(-6deg)_scale(1.03)]">
          {screens.map((src, i) => (
            <img key={src} {...IMG.caseMain(src)} alt="" loading="lazy" decoding="async"
              className="absolute left-0 top-0 w-full rounded-[8px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{ transform: `translate3d(${(i - (screens.length - 1) / 2) * 16}%, ${(i - (screens.length - 1) / 2) * -14}%, ${i * 40}px)`, position: i === screens.length - 1 ? 'relative' : 'absolute', zIndex: i }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const UX = { en: 'UX/UI', ka: 'UX/UI' };

const STUDIES: Study[] = [
  ...(DASTURI_LIVE ? [{
    to: '/projects/dasturi', title: 'Dasturi',
    en: 'Identity, labels and packaging for a Georgian wine brand: an ibex built on circles and one label system for five varietals.',
    ka: 'იდენტობა, ეტიკეტები და შეფუთვა ქართული ღვინის ბრენდისთვის: წრეებზე აგებული ჯიხვი და ერთი ეტიკეტის სისტემა ხუთი ჯიშისთვის.',
    tags: [{ en: 'Branding', ka: 'ბრენდინგი' }, { en: 'Packaging', ka: 'შეფუთვა' }, { en: 'Visual identity', ka: 'ვიზუალური იდენტობა' }],
    cover: <DasturiCover />,
    peek: '/cases/dasturi/saperavi-1000.jpg',
  }] : []),
  {
    to: '/projects/gv-capital', title: 'GV Capital',
    en: 'Brand concept, identity and live guidelines for a Georgian investment and development holding. GV Capital makes space.',
    ka: 'ბრენდის კონცეფცია, იდენტობა და ცოცხალი გაიდლაინი ქართული საინვესტიციო და განვითარების ჰოლდინგისთვის.',
    tags: [{ en: 'Branding', ka: 'ბრენდინგი' }, { en: 'Visual identity', ka: 'ვიზუალური იდენტობა' }, { en: 'Brand guidelines', ka: 'გაიდლაინი' }],
    cover: <HoverCover img="/cases/gv/lounge-1200.jpg" srcSet="/cases/gv/lounge-1200.jpg 1200w, /cases/gv/lounge.jpg 2400w" />,
    peek: '/cases/gv/corridor-1200.jpg',
  },
  {
    to: '/projects/scope', title: 'Scope',
    en: 'Logo and identity for a Georgian marketing agency: an o that is a lens, built on an 8 unit grid and carried into motion and social.',
    ka: 'ლოგო და იდენტობა ქართული მარკეტინგული სააგენტოსთვის: o, რომელიც ლინზაა, 8 მოდულის ბადეზე, მოუშენსა და სოც. მედიაში.',
    tags: [{ en: 'Logo design', ka: 'ლოგოს დიზაინი' }, { en: 'Visual identity', ka: 'ვიზუალური იდენტობა' }, { en: 'Motion', ka: 'მოუშენი' }, { en: 'Social media', ka: 'სოციალური მედია' }],
    cover: <ScopeCover />,
    peek: '/cases/scope/casting.jpg',
  },
  {
    to: '/projects/fitmeal', title: 'FitMeal',
    en: 'A spring campaign for a healthy food brand, made entirely with AI. Real dishes, no faces, cut for the feed and for stories.',
    ka: 'საგაზაფხულო კამპანია ჯანსაღი კვების ბრენდისთვის, მთლიანად AI-ით. ნამდვილი კერძები, სახის გარეშე, ფიდისა და სთორისთვის.',
    tags: [{ en: 'AI campaign', ka: 'AI კამპანია' }, { en: 'Social media', ka: 'სოციალური მედია' }, { en: 'Art direction', ka: 'არტ დირექშენი' }],
    cover: <FitmealBento />,
    peek: '/cases/fitmeal/floor-tall-800.jpg',
  },
  {
    to: '/projects/aurum', title: 'AURUM',
    en: 'A crypto exchange for everyday investors: onboarding, trading and the wallet in one calm, trustworthy interface.',
    ka: 'კრიპტოგაცვლა ყოველდღიური ინვესტორისთვის: რეგისტრაცია, ვაჭრობა და საფულე ერთ მშვიდ, სანდო ინტერფეისში.',
    tags: [UX, { en: 'Product design', ka: 'პროდუქტის დიზაინი' }, { en: 'Fintech', ka: 'ფინტექი' }],
    cover: <ScreensCover bg="linear-gradient(160deg,#17130a,#0a0a0d 70%)" glow="rgba(212,166,60,0.35)" screens={[`${CLD}/v1774016554/exchange_ggykpz.webp`, `${CLD}/v1774016548/login-_au5gne.webp`, screenAurumMainHQ]} />,
    peek: `${CLD}/v1774016548/login-_au5gne.webp`,
  },
  {
    to: '/projects/schenker', title: 'Schenker',
    en: 'An enterprise logistics platform: shipments, parties and documents organised so dispatch teams move faster.',
    ka: 'კორპორატიული ლოჯისტიკის პლატფორმა: გზავნილები, მხარეები და დოკუმენტები ისე, რომ გუნდი უფრო სწრაფად მუშაობდეს.',
    tags: [UX, { en: 'Enterprise', ka: 'კორპორატიული' }, { en: 'Logistics', ka: 'ლოჯისტიკა' }],
    cover: <ScreensCover bg="linear-gradient(160deg,#eef2df,#cfd8ac)" screens={[`${CLD}/v1774041604/d4d1e42280872aa3079a1b940b29790994d2b241_jcnrf6.webp`, `${CLD}/v1774041563/78c6f45f9246b9cea5c0520f003d32cb8fb21ff1_kmea60.webp`, schenkerSendung]} />,
    peek: schenkerSendung,
  },
  {
    to: '/projects/unispace', title: 'Unispace',
    en: 'A student management platform for several roles at once: students, lecturers and administrators in one product.',
    ka: 'სტუდენტების მართვის პლატფორმა რამდენიმე როლისთვის: სტუდენტები, ლექტორები და ადმინისტრაცია ერთ პროდუქტში.',
    tags: [UX, { en: 'EdTech', ka: 'EdTech' }, { en: 'Web app', ka: 'ვებ აპლიკაცია' }],
    cover: <UnispaceCover />,
    peek: unispaceLogin,
  },
];

const FILTERS = ['UX/UI', 'Branding', 'Logo design', 'Visual identity', 'Brand guidelines', 'Packaging', 'AI campaign', 'Social media', 'Motion', 'Art direction'];

/** Holy Motors style tag: a thin outlined pill, filled when chosen */
const tagCls = (on: boolean) =>
  `inline-flex items-center h-8 px-3.5 rounded-full text-[13px] leading-none whitespace-nowrap border transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#fff,0_0_0_4px_#111] ${on ? 'bg-[#111] border-[#111] text-white' : 'border-[#111]/80 text-[#111] hover:bg-[#111] hover:text-white'}`;

/** every case, with filters by discipline; the filter lives in ?tag= */
export function CaseGrid({ initialTag }: { initialTag?: string }) {
  const { tx } = useI18n();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<string | null>(params.get('tag') ?? initialTag ?? null);
  useEffect(() => { const t = params.get('tag'); if (t) setFilter(t); }, [params]);
  // disciplines only, as on the reference; sectors stay on the cards
  const tags = useMemo(() => FILTERS.filter((f) => STUDIES.some((s) => s.tags.some((t) => t.en === f))), []);
  const shown = filter ? STUDIES.filter((s) => s.tags.some((t) => t.en === filter)) : STUDIES;
  const label = (en: string) => { const t = STUDIES.flatMap((s) => s.tags).find((x) => x.en === en); return t ? tx(t.en, t.ka) : en; };
  const pick = (t: string | null) => {
    setFilter(t);
    const next = new URLSearchParams(params);
    if (t) next.set('tag', t); else next.delete('tag');
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <div className="px-1.5 pb-8 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        <span className="shrink-0 text-[14px] text-[#111] mr-1">{tx('Filter by', 'ფილტრი')} →</span>
        <button type="button" onClick={() => pick(null)} aria-pressed={filter === null} className={tagCls(filter === null)}>{tx('All', 'ყველა')}</button>
        {tags.map((t) => (
          <button key={t} type="button" onClick={() => pick(filter === t ? null : t)} aria-pressed={filter === t} className={tagCls(filter === t)}>{label(t)}</button>
        ))}
      </div>

      <section aria-label={tx('Case studies', 'ქეისები')} className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-1.5 gap-y-12">
        {shown.map((s) => (
          <Reveal key={s.to}>
            <CaseLink to={s.to} cardId={`cases-${s.title.toLowerCase()}`} className="group block">
              <PeekCover cover={s.cover} peek={s.peek} className="relative aspect-[16/11] overflow-hidden rounded-md" />
              <div className="mt-4 flex items-baseline justify-between gap-4 px-0.5">
                <h2 className="text-[22px] sm:text-[26px] leading-[1.1] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.title}</h2>
                <ViewCase />
              </div>
              <p className="mt-2 px-0.5 max-w-[560px] text-[14px] leading-[1.55] text-[#6f6f6f] line-clamp-2">{tx(s.en, s.ka)}</p>
              <div className="mt-3 px-0.5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t.en} className="inline-flex items-center h-7 px-3 rounded-full border border-[#111]/80 text-[12.5px] text-[#111]">{tx(t.en, t.ka)}</span>
                ))}
              </div>
            </CaseLink>
          </Reveal>
        ))}
      </section>
    </>
  );
}

export function CaseStudiesContent({ initialTag }: { initialTag?: string }) {
  const { tx } = useI18n();
  return (
    <>
      <PageIntro title={tx('Case studies', 'ქეისები')}>
        {tx('Product, branding and campaigns, each told as one story.', 'პროდუქტი, ბრენდინგი და კამპანიები, თითო ერთ ისტორიად.')}
      </PageIntro>
      <CaseGrid initialTag={initialTag} />
      <div className="pt-16 flex justify-center"><CtaLink /></div>
    </>
  );
}

/** "More case studies" at the end of every case: the same covers as the grid, three at a time */
export function MoreCases({ current }: { current: string }) {
  const { tx } = useI18n();
  const i = STUDIES.findIndex((x) => x.to === current);
  const rest = [...STUDIES.slice(i + 1), ...STUDIES.slice(0, Math.max(0, i))].filter((x) => x.to !== current).slice(0, 3);
  return (
    <section aria-labelledby="more" className="px-1.5 pt-24">
      <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('More case studies', 'სხვა ქეისები')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5 gap-y-10">
        {rest.map((x) => (
          <CaseLink key={x.to} to={x.to} cardId={`more-${x.title.toLowerCase()}`} className="group block">
            <PeekCover cover={x.cover} peek={x.peek} className="relative aspect-[16/11] overflow-hidden rounded-md" />
            <div className="mt-3 flex items-baseline justify-between gap-4 px-0.5">
              <h3 className="text-[18px] leading-[1.1] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{x.title}</h3>
              <ViewCase small />
            </div>
            <div className="mt-1 px-0.5 text-[13px] text-[#6f6f6f]">{x.tags.slice(0, 2).map((t) => tx(t.en, t.ka)).join(' · ')}</div>
          </CaseLink>
        ))}
      </div>
    </section>
  );
}

/** a case's own cover (the same one the case grid shows), for use elsewhere */
export function StudyCover({ to }: { to: string }) {
  const st = STUDIES.find((x) => x.to === to);
  if (!st) return null;
  return <PeekCover cover={st.cover} peek={st.peek} className="relative aspect-[16/11] overflow-hidden rounded-md" />;
}
