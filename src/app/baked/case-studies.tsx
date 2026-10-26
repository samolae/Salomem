import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { CaseLink } from '../components/case-transition';
import { CtaLink, PageIntro, Reveal, T, pillCls } from './ui';
import { useI18n } from './i18n';

/*
 * Case studies: branding and campaigns told as whole stories, laid out like
 * a studio's works page (after holymotors.com/works). A large cover, the
 * name with "View case", two lines on what it is, and the disciplines as
 * tags. Filters appear once there is more than one case to sort.
 */

type Study = {
  to: string;
  title: string;
  en: string; ka: string;
  tags: { en: string; ka: string }[];
  cover: React.ReactNode;
};

/** Dasturi is hidden until its case is finished */
const DASTURI_LIVE = true;

function FitmealCover() {
  const k = ['picnic-bowl', 'blanket-eat', 'table-greek'];
  return (
    <div className="grid h-full grid-cols-3 gap-[3%] p-[6%] items-center" style={{ background: '#F6F1E7' }}>
      {k.map((x, i) => (
        <img key={x} src={`/cases/fitmeal/${x}-800.jpg`} alt="" loading="lazy" decoding="async"
          className={`w-full aspect-[1400/1738] object-cover rounded-[6px] shadow-[0_18px_40px_-20px_rgba(14,75,72,0.45)] transition-transform duration-700 ease-out ${i === 1 ? 'translate-y-[6%] group-hover:translate-y-[2%]' : 'group-hover:-translate-y-[3%]'}`} />
      ))}
    </div>
  );
}

function DasturiCover() {
  return <img src="/cases/dasturi/lineup-1000.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />;
}

const STUDIES: Study[] = [
  {
    to: '/projects/gv-capital', title: 'GV Capital',
    en: 'Brand concept, identity and live guidelines for a Georgian investment and development holding. GV Capital makes space.',
    ka: 'ბრენდის კონცეფცია, იდენტობა და ცოცხალი გაიდლაინი ქართული საინვესტიციო და განვითარების ჰოლდინგისთვის.',
    tags: [{ en: 'Branding', ka: 'ბრენდინგი' }, { en: 'Visual identity', ka: 'ვიზუალური იდენტობა' }, { en: 'Brand guidelines', ka: 'გაიდლაინი' }],
    cover: <img src="/cases/gv/reception-800.jpg" srcSet="/cases/gv/reception-800.jpg 800w, /cases/gv/reception.jpg 1400w" sizes="(min-width: 768px) 50vw, 100vw" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />,
  },
  {
    to: '/projects/fitmeal', title: 'FitMeal',
    en: 'A spring campaign for a healthy food brand, made entirely with AI. Real dishes, no faces, cut for the feed and for stories.',
    ka: 'საგაზაფხულო კამპანია ჯანსაღი კვების ბრენდისთვის, მთლიანად AI-ით. ნამდვილი კერძები, სახის გარეშე, ფიდისა და სთორისთვის.',
    tags: [{ en: 'AI campaign', ka: 'AI კამპანია' }, { en: 'Social media', ka: 'სოციალური მედია' }, { en: 'Art direction', ka: 'არტ დირექშენი' }],
    cover: <FitmealCover />,
  },
  ...(DASTURI_LIVE ? [{
    to: '/projects/dasturi', title: 'Dasturi',
    en: 'Identity, labels and packaging for a Georgian wine brand: an ibex built on circles and one label system for five varietals.',
    ka: 'იდენტობა, ეტიკეტები და შეფუთვა ქართული ღვინის ბრენდისთვის: წრეებზე აგებული ჯიხვი და ერთი ეტიკეტის სისტემა ხუთი ჯიშისთვის.',
    tags: [{ en: 'Branding', ka: 'ბრენდინგი' }, { en: 'Packaging', ka: 'შეფუთვა' }, { en: 'Visual identity', ka: 'ვიზუალური იდენტობა' }],
    cover: <DasturiCover />,
  }] : []),
];

export function CaseStudiesContent() {
  const { tx } = useI18n();
  const [filter, setFilter] = useState<string | null>(null);
  const tags = useMemo(() => Array.from(new Set(STUDIES.flatMap((s) => s.tags.map((t) => t.en)))), []);
  const shown = filter ? STUDIES.filter((s) => s.tags.some((t) => t.en === filter)) : STUDIES;
  const label = (en: string) => {
    const t = STUDIES.flatMap((s) => s.tags).find((x) => x.en === en);
    return t ? tx(t.en, t.ka) : en;
  };

  return (
    <>
      <PageIntro title={tx('Case studies', 'ქეისები')}>
        {tx('Branding and campaigns, each told as one story: the brief, the idea, the work.', 'ბრენდინგი და კამპანიები, თითო ერთ ისტორიად: ბრიფი, იდეა, შედეგი.')}
      </PageIntro>

      {STUDIES.length > 1 && (
        <div className="px-1.5 pb-6 flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-[#6f6f6f] mr-1">{tx('Filter by', 'ფილტრი')} →</span>
          <button type="button" onClick={() => setFilter(null)} aria-pressed={filter === null} className={pillCls(filter === null)}>{tx('All', 'ყველა')}</button>
          {tags.map((t) => (
            <button key={t} type="button" onClick={() => setFilter(t)} aria-pressed={filter === t} className={pillCls(filter === t)}>{label(t)}</button>
          ))}
        </div>
      )}

      <section aria-label={tx('Case studies', 'ქეისები')} className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-1.5 gap-y-12">
        {shown.map((s) => (
          <Reveal key={s.to}>
            <CaseLink to={s.to} cardId={`cases-${s.title.toLowerCase()}`} className="group block">
              <div className="relative aspect-[16/11] overflow-hidden rounded-md">{s.cover}</div>
              <div className="mt-4 flex items-baseline justify-between gap-4 px-0.5">
                <h2 className="text-[22px] sm:text-[26px] leading-[1.1] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{s.title}</h2>
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[14px] text-[#111]">
                  <Eye size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:scale-x-100">{tx('View case', 'ქეისის ნახვა')}</span>
                </span>
              </div>
              <p className="mt-2 px-0.5 max-w-[520px] text-[14px] leading-[1.55] text-[#6f6f6f] line-clamp-2">{tx(s.en, s.ka)}</p>
              <div className="mt-3 px-0.5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t.en} className="rounded-full px-3 py-1 text-[12.5px] text-[#111] ring-1 ring-inset ring-[#111]/70">{tx(t.en, t.ka)}</span>
                ))}
              </div>
            </CaseLink>
          </Reveal>
        ))}
        <Reveal>
          <div className="aspect-[16/11] rounded-md bg-[#f2f2f2] flex flex-col items-center justify-center text-center px-8">
            <p className="text-[15px] leading-[1.5] text-[#111] max-w-[320px]">{tx('More cases are on the way. Have a brand or a campaign in mind?', 'სხვა ქეისებიც მალე დაემატება. გაქვს ბრენდი ან კამპანია გეგმაში?')}</p>
            <div className="mt-6"><CtaLink /></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
