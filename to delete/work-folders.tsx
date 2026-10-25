import { useState } from 'react';
import { Link } from 'react-router';
import { CaseLink } from '../components/case-transition';
import { cld } from '../lib/cld';
import { Caption, CtaLink, PageIntro, Reveal } from './ui';
import { adsBrands, adsMardi1, adsTerminal1, motionReels, screenAurumMainHQ, schenkerSendung, unispaceLogin } from './data';
import { useI18n } from './i18n';

/*
 * All work, as folders. Each category is a folder: point at it (or tap it
 * on a phone) and it opens, its projects fanning out above as small cards.
 * Below, the projects told in full, marked "full case" rather than relying
 * on the visitor knowing the term "case study".
 */

/** first frame of a Cloudinary video, as a small still */
const still = (mp4: string) => mp4.replace('/video/upload/f_auto,q_auto/', '/video/upload/so_1,w_320,c_limit,f_jpg/').replace(/\.mp4$/, '.jpg');

type Folder = { id: string; to: string; en: string; ka: string; countEn: string; countKa: string; color: [string, string]; thumbs: string[] };

const FOLDERS: Folder[] = [
  { id: 'ux', to: '/work/ux-ui', en: 'UX/UI', ka: 'UX/UI', countEn: '3 products', countKa: '3 პროდუქტი', color: ['#5a74ff', '#3f57e6'],
    thumbs: [screenAurumMainHQ, schenkerSendung, unispaceLogin].map((s) => cld(s, 360)) },
  { id: 'brand', to: '/projects/dasturi', en: 'Branding', ka: 'ბრენდინგი', countEn: '1 brand', countKa: '1 ბრენდი', color: ['#c9ab76', '#a9884f'],
    thumbs: ['/cases/dasturi/labels/saperavi-gold.jpg', '/cases/dasturi/lineup-1000.jpg', '/cases/dasturi/labels/kisi-bordeaux.jpg'] },
  { id: 'ads', to: '/work/social-media-ads', en: 'Ads', ka: 'რეკლამა', countEn: `${adsBrands.length} brands`, countKa: `${adsBrands.length} ბრენდი`, color: ['#ff6a3d', '#e9450f'],
    thumbs: [adsTerminal1, adsBrands[0].items[2].src, adsMardi1].map((s) => cld(s, 360)) },
  { id: 'motion', to: '/work/social-media-motion', en: 'Motion', ka: 'მოუშენი', countEn: `${motionReels.length} reels`, countKa: `${motionReels.length} რილსი`, color: ['#9b7bff', '#7a55f0'],
    thumbs: motionReels.slice(1, 4).map((r) => still(r.src)) },
];

function FolderCard({ f, open, onOpen }: { f: Folder; open: boolean; onOpen: (id: string | null) => void }) {
  const { tx, to } = useI18n();
  const fan = [
    { x: -34, y: -78, r: -10 },
    { x: 0, y: -96, r: 0 },
    { x: 34, y: -78, r: 10 },
  ];
  return (
    <Link
      to={to(f.to)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') onOpen(f.id); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') onOpen(null); }}
      onFocus={() => onOpen(f.id)}
      onBlur={() => onOpen(null)}
      onClick={(e) => {
        // on touch: first tap opens the folder, the second goes in
        if (!open && window.matchMedia('(hover: none)').matches) { e.preventDefault(); onOpen(f.id); }
      }}
      className="wf group relative block outline-none"
      data-open={open || undefined}
      aria-label={`${tx(f.en, f.ka)}, ${tx(f.countEn, f.countKa)}`}
    >
      <div className="relative mx-auto w-full max-w-[260px] aspect-[5/4]" style={{ perspective: '700px' }}>
        {/* back panel with its tab */}
        <div className="absolute inset-x-0 bottom-0 top-[8%] rounded-[14px] rounded-tl-none" style={{ background: f.color[1] }} />
        <div className="absolute left-0 top-0 h-[14%] w-[42%] rounded-t-[12px]" style={{ background: f.color[1], clipPath: 'polygon(0 0, 78% 0, 100% 100%, 0 100%)' }} />

        {/* the projects, waiting inside */}
        {f.thumbs.map((src, i) => (
          <div
            key={i}
            className="wf-card absolute left-1/2 top-[22%] w-[46%] aspect-[4/5] -ml-[23%] rounded-[8px] overflow-hidden bg-white shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
            style={{ ['--x' as string]: `${fan[i].x}%`, ['--y' as string]: `${fan[i].y}%`, ['--r' as string]: `${fan[i].r}deg`, transitionDelay: `${i * 40}ms`, zIndex: i === 1 ? 2 : 1 }}
          >
            <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        ))}

        {/* front panel: tips forward when the folder opens */}
        <div
          className="wf-front absolute inset-x-0 bottom-0 top-[22%] rounded-[14px] p-4 sm:p-5 flex flex-col justify-end text-white shadow-[0_18px_30px_-14px_rgba(0,0,0,0.45)]"
          style={{ background: `linear-gradient(180deg, ${f.color[0]}, ${f.color[1]})`, zIndex: 3 }}
        >
          <div className="text-[17px] sm:text-[19px] leading-tight" style={{ fontWeight: 500 }}>{tx(f.en, f.ka)}</div>
          <div className="mt-0.5 text-[13px] text-white/75">{tx(f.countEn, f.countKa)}</div>
        </div>
      </div>
    </Link>
  );
}

const FULL_CASES = [
  { to: '/projects/dasturi', title: 'Dasturi', subEn: 'Georgian wine brand · identity, labels, packaging', subKa: 'ქართული ღვინის ბრენდი · იდენტობა, ეტიკეტები, შეფუთვა', img: '/cases/dasturi/lineup-1000.jpg', bg: '#191A17', local: true },
  { to: '/projects/aurum', title: 'AURUM', subEn: 'Crypto exchange · B2C fintech', subKa: 'კრიპტოგაცვლა · B2C ფინტექი', img: screenAurumMainHQ, bg: 'linear-gradient(160deg,#16130b,#0b0b0f 70%)' },
  { to: '/projects/schenker', title: 'Schenker', subEn: 'Logistics platform · enterprise UX', subKa: 'ლოჯისტიკის პლატფორმა · კორპორატიული UX', img: schenkerSendung, bg: 'linear-gradient(160deg,#e8ecd8,#d4dab8)' },
  { to: '/projects/unispace', title: 'Unispace', subEn: 'Student management · EdTech', subKa: 'სტუდენტების მართვა · EdTech', img: unispaceLogin, bg: 'linear-gradient(160deg,#dfe6ff,#eef1ff)' },
];

export function WorkContent() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .wf-card{transform:translate(var(--x0,0),12%) rotate(0deg) scale(.92);transition:transform .45s cubic-bezier(.2,1.2,.3,1),opacity .3s;opacity:0}
        .wf[data-open] .wf-card{transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1);opacity:1}
        .wf-front{transform-origin:50% 100%;transition:transform .45s cubic-bezier(.2,1,.3,1)}
        .wf[data-open] .wf-front{transform:rotateX(-24deg) translateY(2%)}
        .wf:focus-visible .wf-front{box-shadow:0 0 0 3px #fff,0 0 0 5px #111}
        @media (prefers-reduced-motion: reduce){.wf-card,.wf-front{transition:none}}
      `}</style>

      <PageIntro title={tx('Work', 'ნამუშევრები')}>
        {tx('Pick a folder to see what is inside.', 'აირჩიე საქაღალდე და ნახე, რა არის შიგნით.')}
      </PageIntro>

      <section aria-label={tx('Categories', 'კატეგორიები')} className="px-4 sm:px-8 pt-24 sm:pt-28 pb-10">
        <div className="mx-auto max-w-[1160px] grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-24 sm:gap-x-10">
          {FOLDERS.map((f) => <FolderCard key={f.id} f={f} open={open === f.id} onOpen={setOpen} />)}
        </div>
      </section>

      <section aria-labelledby="full" className="px-1.5 pt-20">
        <h2 id="full" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('Told in full', 'დეტალურად აღწერილი პროექტები')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
          {FULL_CASES.map((c) => (
            <Reveal key={c.to}>
              <CaseLink to={c.to} cardId={`work-${c.title.toLowerCase()}`} className="group block">
                <div className={`relative overflow-hidden rounded-md ${c.local ? '' : 'p-[8%]'}`} style={{ background: c.bg }}>
                  <img src={c.local ? c.img : cld(c.img, 1100)} alt={`${c.title}`} loading="lazy" decoding="async"
                    className={`block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02] ${c.local ? '' : 'rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.35)]'}`} />
                </div>
                <Caption title={c.title} sub={tx(c.subEn, c.subKa)} tag={tx('Full case', 'სრული ქეისი')} />
              </CaseLink>
            </Reveal>
          ))}
        </div>
        <div className="pt-12 flex justify-center"><CtaLink /></div>
      </section>
    </>
  );
}
