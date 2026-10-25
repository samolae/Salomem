import { useState } from 'react';
import { Link } from 'react-router';
import { CaseLink } from '../components/case-transition';
import { cld } from '../lib/cld';
import { Caption, CtaLink, PageIntro, Reveal } from './ui';
import { adsBrands, adsMardi1, adsTerminal1, motionReels, screenAurumMainHQ, schenkerSendung, unispaceLogin } from './data';
import { useI18n } from './i18n';

/*
 * All work, as a row of desktop folders in the @areuli.design style. Point
 * at one and it opens, its projects peeking out above.
 * Below, the projects told in full, marked "full case" rather than relying
 * on the visitor knowing the term "case study".
 */

/** first frame of a Cloudinary video, as a small still */
const still = (mp4: string) => mp4.replace('/video/upload/f_auto,q_auto/', '/video/upload/so_1,w_320,c_limit,f_jpg/').replace(/\.mp4$/, '.jpg');

type Folder = { id: string; to: string; label: string; en: string; ka: string; countEn: string; countKa: string; color: [string, string, string]; thumbs: string[] };

// macOS-style desktop folders with snake_case names, as on @areuli.design
const FOLDERS: Folder[] = [
  { id: 'ux', to: '/work/ux-ui', label: 'ui_ux', en: 'UX/UI', ka: 'UX/UI', countEn: '3 products', countKa: '3 პროდუქტი', color: ['#62b5ff', '#3d9bf0', '#2b86dc'],
    thumbs: [screenAurumMainHQ, schenkerSendung, unispaceLogin].map((s) => cld(s, 240)) },
  /* Dasturi hidden for now
  { id: 'brand', to: '/projects/dasturi', label: 'brand_design', en: 'Branding', ka: 'ბრენდინგი', countEn: '1 brand', countKa: '1 ბრენდი', color: ['#ffd25e', '#f6c03a', '#e5a91d'],
    thumbs: ['/cases/dasturi/labels/saperavi-gold.jpg', '/cases/dasturi/lineup-1000.jpg', '/cases/dasturi/labels/kisi-bordeaux.jpg'] },
  */
  { id: 'ads', to: '/work/social-media-ads', label: 'soc_media_ads', en: 'Ads', ka: 'რეკლამა', countEn: `${adsBrands.length} brands`, countKa: `${adsBrands.length} ბრენდი`, color: ['#5fd06e', '#3fb24f', '#2f9a3f'],
    thumbs: [adsTerminal1, adsBrands[0].items[2].src, adsMardi1].map((s) => cld(s, 240)) },
  { id: 'motion', to: '/work/social-media-motion', label: 'motion', en: 'Motion', ka: 'მოუშენი', countEn: `${motionReels.length} reels`, countKa: `${motionReels.length} რილსი`, color: ['#ffa35a', '#f5852d', '#e06d17'],
    thumbs: motionReels.slice(1, 4).map((r) => still(r.src)) },
];

/* One desktop folder: back with tab, papers inside, a lighter front that tips open */
function FolderCard({ f, open, onOpen }: { f: Folder; open: boolean; onOpen: (id: string | null) => void }) {
  const { tx, to } = useI18n();
  const fan = [{ x: -26, r: -9 }, { x: 0, r: 0 }, { x: 26, r: 9 }];
  return (
    <Link
      to={to(f.to)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') onOpen(f.id); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') onOpen(null); }}
      onFocus={() => onOpen(f.id)}
      onBlur={() => onOpen(null)}
      className="wf group flex flex-col items-center gap-2.5 outline-none shrink-0"
      data-open={open || undefined}
      aria-label={`${tx(f.en, f.ka)}, ${tx(f.countEn, f.countKa)}`}
    >
      <div className="relative w-[64px] sm:w-[112px] aspect-[6/5]" style={{ perspective: '400px' }}>
        <svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M8 8h34c3 0 5 1 7 3l6 6h57c4.4 0 8 3.6 8 8v67c0 4.4-3.6 8-8 8H8c-4.4 0-8-3.6-8-8V16c0-4.4 3.6-8 8-8z" fill={f.color[2]} />
        </svg>
        {f.thumbs.map((src, i) => (
          <div key={i} className="wf-card absolute left-1/2 top-[14%] w-[52%] aspect-[4/5] -ml-[26%] rounded-[4px] overflow-hidden bg-white shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
            style={{ ['--x' as string]: `${fan[i].x}%`, ['--r' as string]: `${fan[i].r}deg`, transitionDelay: `${i * 35}ms`, zIndex: i === 1 ? 2 : 1 }}>
            <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        ))}
        <svg viewBox="0 0 120 76" className="wf-front absolute inset-x-0 bottom-0 w-full h-[76%]" style={{ zIndex: 3 }} aria-hidden>
          <defs>
            <linearGradient id={`g-${f.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={f.color[0]} />
              <stop offset="1" stopColor={f.color[1]} />
            </linearGradient>
          </defs>
          <path d="M8 0h104c4.4 0 8 3.6 8 8v60c0 4.4-3.6 8-8 8H8c-4.4 0-8-3.6-8-8V8c0-4.4 3.6-8 8-8z" fill={`url(#g-${f.id})`} />
          <path d="M8 1.2h104" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center leading-tight">
        <div className="wf-label text-[10.5px] sm:text-[13px] px-1 sm:px-1.5 py-0.5 rounded-[4px] text-[#111] transition-colors" style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>{f.label}</div>
        <div className="mt-1 text-[10.5px] sm:text-[12px] text-[#9a9a9a]">{tx(f.countEn, f.countKa)}</div>
      </div>
    </Link>
  );
}

const FULL_CASES = [
  // Dasturi hidden for now:
  // { to: '/projects/dasturi', title: 'Dasturi', subEn: 'Georgian wine brand · identity, labels, packaging', subKa: 'ქართული ღვინის ბრენდი · იდენტობა, ეტიკეტები, შეფუთვა', img: '/cases/dasturi/lineup-1000.jpg', bg: '#191A17', local: true },
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
        .wf-card{transform:translate(0,30%) scale(.9);opacity:0;transition:transform .4s cubic-bezier(.2,1.3,.3,1),opacity .25s}
        .wf[data-open] .wf-card{transform:translate(var(--x),-34%) rotate(var(--r));opacity:1}
        .wf-front{transform-origin:50% 100%;transition:transform .4s cubic-bezier(.2,1,.3,1)}
        .wf[data-open] .wf-front{transform:rotateX(-28deg)}
        .wf[data-open] .wf-label{background:#2b6fe8;color:#fff}
        .wf:focus-visible .wf-label{outline:2px solid #111;outline-offset:2px}
        @media (prefers-reduced-motion: reduce){.wf-card,.wf-front{transition:none}}
      `}</style>

      <PageIntro title={tx('Work', 'ნამუშევრები')}>
        {tx('Pick a folder to see what is inside.', 'აირჩიე საქაღალდე და ნახე, რა არის შიგნით.')}
      </PageIntro>

      <section aria-label={tx('Categories', 'კატეგორიები')} className="px-1.5 pt-6">
        <div className="rounded-md bg-[#f2f2f2]">
          <div className="flex justify-center gap-2 sm:gap-16 px-2 sm:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
            {FOLDERS.map((f) => <FolderCard key={f.id} f={f} open={open === f.id} onOpen={setOpen} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="full" className="px-1.5 pt-16">
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
