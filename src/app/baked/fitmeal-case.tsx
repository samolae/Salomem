import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { Parallax, RevealLines, Rise } from '../components/case-motion';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { CASES } from './cases';
import { useI18n } from './i18n';

/*
 * FitMeal: a spring campaign made with AI. The page is as light as the
 * brief asked the pictures to be: cream paper, the deep teal of the
 * packaging for type, and the pictures doing the talking. Two small tools
 * show the craft: one set with three dishes, and the same frame cut for
 * the feed and for stories with room left for the copy.
 */

const P = '/cases/fitmeal';
const TEAL = '#0E4B48';
const CREAM = '#F6F1E7';
const SUN = '#F2C14E';
const LEAF = '#5E8F4E';

type Shot = { key: string; w: number; h: number; en: string; ka: string };
const SHOTS: Shot[] = [
  { key: 'picnic-bowl', w: 1400, h: 1738, en: 'Bowl on a gingham blanket in the grass', ka: 'ბოული ბალახზე, უჯრედიან პლედზე' },
  { key: 'picnic-headphones', w: 1400, h: 1738, en: 'Picnic with headphones and spring flowers', ka: 'პიკნიკი ყურსასმენებით და გაზაფხულის ყვავილებით' },
  { key: 'picnic-bottle', w: 1400, h: 1738, en: 'A fit body holding a FitMeal juice', ka: 'ფიტ სხეული FitMeal-ის წვენით ხელში' },
  { key: 'stripe-spread', w: 1400, h: 1738, en: 'Lunch spread on a striped blanket', ka: 'სადილი ზოლიან პლედზე' },
  { key: 'stripe-hand', w: 1400, h: 1738, en: 'A hand sets down a drink next to the bowl', ka: 'ხელი სასმელს ბოულის გვერდით დებს' },
  { key: 'blanket-flat', w: 1400, h: 1738, en: 'Salmon bowl, camera and hat on a white blanket', ka: 'ორაგულის ბოული, კამერა და ქუდი თეთრ პლედზე' },
  { key: 'blanket-read', w: 1400, h: 1738, en: 'Reading on the blanket, lunch within reach', ka: 'კითხვა პლედზე, სადილი ხელთ' },
  { key: 'blanket-eat', w: 1400, h: 1738, en: 'Eating the salmon bowl, seen from behind', ka: 'ორაგულის ბოული, ზურგიდან' },
  { key: 'park-read', w: 1400, h: 1738, en: 'A book and a box in the park', ka: 'წიგნი და ყუთი პარკში' },
  { key: 'office-desk', w: 1400, h: 1750, en: 'Lunch at the desk', ka: 'სადილი სამუშაო მაგიდასთან' },
  { key: 'office-greek', w: 1400, h: 1738, en: 'Greek salad bowl at work', ka: 'ბერძნული სალათი სამსახურში' },
  { key: 'office-salmon', w: 1400, h: 1738, en: 'Salmon bowl at work', ka: 'ორაგულის ბოული სამსახურში' },
  { key: 'drink-mango', w: 896, h: 1200, en: 'Mango smoothie and wraps in the sun', ka: 'მანგოს სმუზი და რეპები მზეზე' },
  { key: 'drink-berry', w: 896, h: 1200, en: 'Berry smoothie and wraps in the sun', ka: 'კენკრის სმუზი და რეპები მზეზე' },
  { key: 'table-salmon', w: 1400, h: 1738, en: 'Salmon and green beans on the teal table', ka: 'ორაგული და მწვანე ლობიო ფირუზისფერ მაგიდაზე' },
  { key: 'table-greek', w: 1400, h: 1738, en: 'Greek salad on the teal table', ka: 'ბერძნული სალათი ფირუზისფერ მაგიდაზე' },
  { key: 'table-shrimp', w: 1400, h: 1738, en: 'Shrimp and peppers on the teal table', ka: 'კრევეტი და წიწაკა ფირუზისფერ მაგიდაზე' },
  { key: 'floor-tall', w: 1400, h: 2509, en: 'Hands over a box, from above', ka: 'ხელები ყუთთან, ზემოდან' },
  { key: 'floor', w: 1200, h: 1500, en: 'Salmon box on a napkin, from above', ka: 'ორაგულის ყუთი ხელსახოცზე, ზემოდან' },
  { key: 'share', w: 1400, h: 1738, en: 'Two bowls shared between friends', ka: 'ორი ბოული მეგობრებს შორის' },
];
const idx = (k: string) => SHOTS.findIndex((s) => s.key === k);

const H2 = 'text-[26px] sm:text-[30px] leading-[1.12] tracking-[-0.02em]';
const COL = 'text-[14px] leading-[1.7] text-justify [text-align-last:left]';

function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-6 sm:px-10 lg:px-14 ${className}`}>{children}</div>;
}

function Photo({ k, onOpen, sizes = '(min-width: 768px) 33vw, 100vw', className = '', cover }: { k: string; onOpen: (i: number) => void; sizes?: string; className?: string; cover?: boolean }) {
  const { tx } = useI18n();
  const i = idx(k);
  const s = SHOTS[i];
  return (
    <button type="button" onClick={() => onOpen(i)} aria-label={`${tx(s.en, s.ka)}, ${tx('enlarge', 'გადიდება')}`}
      className={`group relative block w-full overflow-hidden rounded-[6px] bg-[#e9e2d3] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0E4B48] ${cover ? 'h-full' : ''} ${className}`}>
      <img
        src={`${P}/${k}.jpg`}
        srcSet={s.w > 900 ? `${P}/${k}-800.jpg 800w, ${P}/${k}.jpg ${s.w}w` : undefined}
        sizes={sizes}
        width={s.w}
        height={s.h}
        alt={tx(s.en, s.ka)}
        loading="lazy"
        decoding="async"
        className={`block w-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] ${cover ? 'h-full object-cover' : 'h-auto'}`}
      />
    </button>
  );
}

function Chapter({ no, name, title, children, id }: { no: string; name: string; title: string; children: string; id: string }) {
  // one compact block, about a third of the section wide
  return (
    <Wrap className="pt-24 sm:pt-32 pb-10 sm:pb-12">
      <div className="max-w-[360px]">
        <div className="flex items-baseline gap-3 text-[12px]">
          <span className="tabular-nums" style={{ color: LEAF }}>{no}</span><span className="text-[#0E4B48]/55">{name}</span>
        </div>
        <RevealLines as="h2" className={`mt-3 ${H2}`} style={{ fontWeight: 500 }}>
          <span id={id}>{title}</span>
        </RevealLines>
        <Rise delay={0.1}><p className={`${COL} mt-4 text-[#0E4B48]/70`}>{children}</p></Rise>
      </div>
    </Wrap>
  );
}

/* ── Two frames of one scene, one tile: the dish changes, the moment stays ── */
function SwapTile({ keys, onOpen, sizes = '(min-width: 768px) 50vw, 100vw', aspect = '1400 / 1738', every = 2600 }: { keys: string[]; onOpen: (i: number) => void; sizes?: string; aspect?: string; every?: number }) {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [hover, setHover] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (reduce || hover || !seen) return;
    const t = setInterval(() => setCur((c) => (c + 1) % keys.length), every);
    return () => clearInterval(t);
  }, [reduce, hover, seen, keys.length, every]);
  const k = keys[cur];
  const sh = SHOTS[idx(k)];
  return (
    <div ref={box} className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button type="button" onClick={() => onOpen(idx(k))} aria-label={`${tx(sh.en, sh.ka)}, ${tx('enlarge', 'გადიდება')}`}
        className="relative block w-full overflow-hidden rounded-[6px] bg-[#e9e2d3] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0E4B48]" style={{ aspectRatio: aspect }}>
        {keys.map((kk, i) => (
          <motion.img key={kk} src={`${P}/${kk}.jpg`} srcSet={SHOTS[idx(kk)].w > 900 ? `${P}/${kk}-800.jpg 800w, ${P}/${kk}.jpg ${SHOTS[idx(kk)].w}w` : undefined} sizes={sizes}
            alt={i === cur ? tx(SHOTS[idx(kk)].en, SHOTS[idx(kk)].ka) : ''} aria-hidden={i !== cur || undefined} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: i === cur ? 1 : 0, scale: i === cur ? 1 : 1.035 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.2, 0.7, 0.2, 1] }} />
        ))}
      </button>
      {/* which frame is showing; tap to switch */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-white/85 px-2 py-1.5 backdrop-blur-sm">
        {keys.map((kk, i) => (
          <button key={kk} type="button" onClick={() => setCur(i)} aria-label={tx(SHOTS[idx(kk)].en, SHOTS[idx(kk)].ka)} aria-pressed={i === cur}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === cur ? 'w-5 bg-[#0E4B48]' : 'w-1.5 bg-[#0E4B48]/30 hover:bg-[#0E4B48]/60'}`} />
        ))}
      </div>
    </div>
  );
}

/* ── One set, three dishes ──────────────────────────────────────────── */
function DishSwitch({ onOpen }: { onOpen: (i: number) => void }) {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const dishes = [
    { k: 'table-salmon', en: 'Salmon', ka: 'ორაგული' },
    { k: 'table-greek', en: 'Greek salad', ka: 'ბერძნული' },
    { k: 'table-shrimp', en: 'Shrimp', ka: 'კრევეტი' },
  ];
  const [cur, setCur] = useState(0);
  const d = dishes[cur];
  return (
    <Wrap>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
        <div className="md:col-span-7 relative aspect-[1400/1738] overflow-hidden rounded-[6px] bg-[#e9e2d3]">
          <AnimatePresence initial={false}>
            <motion.button
              key={d.k}
              type="button"
              onClick={() => onOpen(idx(d.k))}
              className="absolute inset-0 cursor-zoom-in"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              aria-label={`${tx(SHOTS[idx(d.k)].en, SHOTS[idx(d.k)].ka)}, ${tx('enlarge', 'გადიდება')}`}
            >
              <img src={`${P}/${d.k}.jpg`} srcSet={`${P}/${d.k}-800.jpg 800w, ${P}/${d.k}.jpg 1400w`} sizes="(min-width: 768px) 58vw, 100vw"
                alt={tx(SHOTS[idx(d.k)].en, SHOTS[idx(d.k)].ka)} className="h-full w-full object-cover" />
            </motion.button>
          </AnimatePresence>
        </div>
        <div className="md:col-span-5">
          <div className="text-[13px] text-[#0E4B48]/55">{tx('Pick a dish', 'აირჩიე კერძი')}</div>
          <div className="mt-3 flex flex-col gap-2" role="radiogroup" aria-label={tx('Dish', 'კერძი')}>
            {dishes.map((x, i) => (
              <button key={x.k} type="button" role="radio" aria-checked={cur === i} onClick={() => setCur(i)}
                className={`group flex items-center gap-4 rounded-[10px] p-2 pr-4 text-left transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#0E4B48] ${cur === i ? 'bg-white shadow-[0_8px_24px_-12px_rgba(14,75,72,0.35)]' : 'hover:bg-white/60'}`}>
                <img src={`${P}/${x.k}-800.jpg`} alt="" className="h-16 w-14 rounded-[6px] object-cover" loading="lazy" />
                <span className="text-[17px]" style={{ fontWeight: 500 }}>{tx(x.en, x.ka)}</span>
                <span className={`ml-auto h-2 w-2 rounded-full transition-colors ${cur === i ? '' : 'bg-transparent'}`} style={cur === i ? { background: SUN } : undefined} />
              </button>
            ))}
          </div>
          <p className={`${COL} mt-6 max-w-[420px] text-[#0E4B48]/70`}>
            {tx('The cloth, the napkin, the glass and the light stay put, so the eye goes straight to the food. A new dish slots into the same frame.',
              'სუფრა, ხელსახოცი, ჭიქა და შუქი უცვლელია, ამიტომ თვალი პირდაპირ კერძზე მიდის. ახალი კერძი იმავე კადრში ჩაჯდება.')}
          </p>
        </div>
      </div>
    </Wrap>
  );
}

/* ── The same frame for the feed and for stories ────────────────────── */
function FormatSwitch() {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const [fmt, setFmt] = useState<'45' | '916'>('45');
  const k = 'picnic-bowl';
  const H = 'min(68svh, 620px)';
  return (
    <Wrap>
      <div className="flex justify-center pb-6">
        <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-inset ring-[#0E4B48]/10" role="radiogroup" aria-label={tx('Format', 'ფორმატი')}>
          {([['45', '4:5', tx('Feed', 'ფიდი')], ['916', '9:16', tx('Stories', 'სთორი')]] as const).map(([id, r, l]) => (
            <button key={id} type="button" role="radio" aria-checked={fmt === id} onClick={() => setFmt(id)}
              className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-[14px] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#0E4B48] ${fmt === id ? 'bg-[#0E4B48] text-white' : 'text-[#0E4B48]/70 hover:text-[#0E4B48]'}`}>
              <span className="tabular-nums" style={{ fontWeight: 500 }}>{r}</span><span className="opacity-70">{l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <motion.div
          className="relative overflow-hidden rounded-[14px] shadow-[0_30px_60px_-30px_rgba(14,75,72,0.45)]"
          style={{ height: H }}
          animate={{ aspectRatio: fmt === '45' ? 4 / 5 : 9 / 16 }}
          initial={false}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 22 }}
        >
          <img src={`${P}/${k}.jpg`} alt={tx(SHOTS[idx(k)].en, SHOTS[idx(k)].ka)} className="absolute inset-0 h-full w-full object-cover" />
          {/* the space kept free for the headline */}
          <motion.div
            className="absolute inset-x-[7%] rounded-[8px] border border-dashed border-white/80 bg-white/10 backdrop-blur-[1px] flex items-center justify-center"
            animate={{ top: fmt === '45' ? '6%' : '9%', height: fmt === '45' ? '22%' : '20%' }}
            initial={false}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 22 }}
          >
            <span className="rounded-full bg-white/90 px-3 py-1 text-[12px] text-[#0E4B48]">{tx('Room for the copy', 'ადგილი ტექსტისთვის')}</span>
          </motion.div>
        </motion.div>
      </div>
    </Wrap>
  );
}

export function FitmealCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: tx(s.en, s.ka), brand: `FitMeal, ${tx(s.en, s.ka)}` }));

  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'FitMeal'],
    [tx('Year', 'წელი'), '2025'],
    [tx('Role', 'როლი'), tx('Art direction, AI visuals', 'არტ დირექშენი, AI ვიზუალები')],
    [tx('Formats', 'ფორმატები'), '4:5, 9:16'],
  ];

  const rules = [
    { en: 'Real food', ka: 'ნამდვილი საკვები', den: 'As close to a real photo shoot as possible, with food that looks like the real dish.', dka: 'მაქსიმალურად რეალურ ფოტოსესიასთან მიახლოებული, საკვები ნამდვილ კერძს უნდა ჰგავდეს.' },
    { en: 'No faces', ka: 'სახის გარეშე', den: 'FitMeal works with real people as its faces, so AI never shows one. People come in from the back or as hands.', dka: 'FitMeal სახეებად რეალურ ადამიანებს იყენებს, ამიტომ AI სახეს არ აჩვენებს. ადამიანი ზურგით ან ხელით შემოდის.' },
    { en: 'Fit bodies', ka: 'ფიტ სხეული', den: 'Where a body is in the frame, it shows what the food does: strong, healthy, fit.', dka: 'სადაც სხეული ჩანს, მან პროდუქტის ძალა უნდა აჩვენოს: ძლიერი, ჯანსაღი, ფიტ.' },
    { en: 'Room for copy', ka: 'ადგილი ტექსტს', den: 'Every frame keeps a calm area for the headline FitMeal adds later.', dka: 'ყველა კადრში დატოვებულია მშვიდი სივრცე სათაურისთვის, რომელსაც FitMeal მერე ჩასვამს.' },
    { en: 'Two formats', ka: 'ორი ფორმატი', den: 'Each picture works at 4:5 for the feed and 9:16 for stories.', dka: 'თითო ვიზუალი მუშაობს 4:5-ზე ფიდისთვის და 9:16-ზე სთორისთვის.' },
  ];

  return (
    <BakedShell>
      <SEO
        title="FitMeal | AI Spring Campaign Case Study"
        description="FitMeal: a spring campaign made with AI. Photo-real visuals of real dishes, no faces, room for copy, cut for 4:5 and 9:16. Art direction by Salome Mosiava."
        keywords="FitMeal, AI campaign, AI visuals, food photography, social media, art direction, healthy food, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/fitmeal" />

      <article className="px-1.5 pt-14 sm:pt-[52px]">
        <div className="rounded-md overflow-hidden" style={{ background: CREAM, color: TEAL }}>

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <header className="relative">
            <Wrap className="flex items-start justify-between pt-6 sm:pt-8 text-[13px]">
              <Link to="/work" className="inline-flex items-center gap-1.5 text-[#0E4B48]/55 hover:text-[#0E4B48] transition-colors">
                <ArrowLeft size={13} /> {tx('Work', 'ნამუშევრები')}
              </Link>
              <span className="rounded-full bg-white px-3 py-1 text-[12px] ring-1 ring-inset ring-[#0E4B48]/10">{tx('AI campaign', 'AI კამპანია')}</span>
            </Wrap>
            <Wrap className="pt-14 sm:pt-20">
              <RevealLines as="h1" className="text-[44px] sm:text-[76px] lg:text-[96px] leading-[0.95] tracking-[-0.035em]" style={{ fontWeight: 600 }}>
                <span>FitMeal</span>
                <span className="text-[#0E4B48]/45">{tx('Spring, without a shoot', 'გაზაფხული, ფოტოსესიის გარეშე')}</span>
              </RevealLines>
            </Wrap>
            <Wrap className="pt-12 sm:pt-16">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                <Parallax distance={20}><Photo k="picnic-bowl" onOpen={setOpen} /></Parallax>
                <Parallax distance={60} className="translate-y-8"><Photo k="blanket-eat" onOpen={setOpen} /></Parallax>
                <Parallax distance={35}><Photo k="table-greek" onOpen={setOpen} /></Parallax>
              </div>
            </Wrap>
            <Wrap className="pt-16 sm:pt-20 pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-5 pt-6 border-t border-[#0E4B48]/15 text-[13px]">
                <p className="col-span-2 lg:col-span-4 text-[18px] sm:text-[20px] leading-[1.35]" style={{ fontWeight: 500 }}>
                  {tx('A spring campaign for a healthy food brand, made entirely with AI.', 'საგაზაფხულო კამპანია ჯანსაღი კვების ბრენდისთვის, მთლიანად AI-ით.')}
                </p>
                {facts.map(([k, v], i) => (
                  <div key={k} className={['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-3', 'lg:col-span-2'][i]}>
                    <div style={{ color: LEAF }}>{k}</div>
                    <div className="mt-1 text-[#0E4B48]/75 leading-[1.5]">{v}</div>
                  </div>
                ))}
              </div>
            </Wrap>
          </header>

          {/* ── Statement ────────────────────────────────────────────── */}
          <Wrap className="pt-24 sm:pt-32 pb-4">
            <div className="max-w-[400px]">
              <RevealLines as="p" className="text-[24px] sm:text-[30px] leading-[1.18] tracking-[-0.02em]" style={{ fontWeight: 500 }}>
                <span>{tx('The brief: pictures that pass for a real photo shoot,', 'ბრიფი: ვიზუალები, რომლებიც ნამდვილ ფოტოსესიად აღიქმება,')}</span>
                <span className="text-[#0E4B48]/45">{tx('with real dishes and not a single face.', 'ნამდვილი კერძებით და არც ერთი სახით.')}</span>
              </RevealLines>
              <Rise><p className={`${COL} mt-6 text-[#0E4B48]/70`}>{tx(
                'FitMeal wanted spring on its feed: its dishes out in the sun, on a picnic blanket, at a desk, on a quiet morning. A shoot across that many settings costs days. AI let us build every one of them around the real packaging and the real menu.',
                'FitMeal-ს გაზაფხული უნდოდა თავის ფიდზე: კერძები მზეზე, პიკნიკის პლედზე, სამუშაო მაგიდასთან, მშვიდ დილას. ამდენ გარემოში ფოტოსესიას დღეები სჭირდება. AI-ით თითოეული მათგანი ნამდვილი შეფუთვისა და ნამდვილი მენიუს გარშემო ავაწყვეთ.')}</p></Rise>
              <Rise delay={0.08}><p className={`${COL} mt-4 text-[#0E4B48]/70`}>{tx(
                'The brief set two moods. A picnic: grass, flowers, sun, fresh and light. And a healthy spring routine: calm, morning, a book, a coffee, the meal close at hand. Every frame keeps the food as the hero and the light natural.',
                'ბრიფში ორი განწყობა იყო. პიკნიკი: ბალახი, ყვავილები, მზე, სიახლე და სიმსუბუქე. და ჯანსაღი გაზაფხულის რუტინა: სიმშვიდე, დილა, წიგნი, ყავა და კერძი ხელთ. ყველა კადრში საკვებია მთავარი გმირი და შუქი ბუნებრივია.')}</p></Rise>
            </div>
          </Wrap>

          {/* ── 01 Brief ─────────────────────────────────────────────── */}
          <Chapter no="01" name={tx('The rules', 'წესები')} id="rules" title={tx('Five rules from the brief', 'ხუთი წესი ბრიფიდან')}>
            {tx('The brief was short and strict. These five lines decided every prompt and every pick.',
              'ბრიფი მოკლე და მკაცრი იყო. ამ ხუთმა წესმა განსაზღვრა ყველა პრომპტი და ყველა არჩევანი.')}
          </Chapter>
          <Wrap>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {rules.map((r, i) => (
                <Rise key={r.en} delay={i * 0.06} className="h-full">
                  <li className="h-full rounded-[10px] bg-white p-5 ring-1 ring-inset ring-[#0E4B48]/[0.07]">
                    <div className="text-[12px] tabular-nums" style={{ color: LEAF }}>0{i + 1}</div>
                    <div className="mt-6 text-[19px] leading-[1.15]" style={{ fontWeight: 600 }}>{tx(r.en, r.ka)}</div>
                    <p className="mt-2 text-[13.5px] leading-[1.55] text-[#0E4B48]/65">{tx(r.den, r.dka)}</p>
                  </li>
                </Rise>
              ))}
            </ol>
          </Wrap>

          {/* ── 02 Picnic ────────────────────────────────────────────── */}
          <Chapter no="02" name={tx('Picnic', 'პიკნიკი')} id="picnic" title={tx('Out in the grass', 'ბალახზე')}>
            {tx('Grass, wild flowers, a blanket and soft sun. Two blankets, two palettes: pink gingham and butter stripes. The bowl always sits where the eye lands first.',
              'ბალახი, მინდვრის ყვავილები, პლედი და რბილი მზე. ორი პლედი, ორი პალიტრა: ვარდისფერი უჯრა და ყვითელი ზოლი. ბოული ყოველთვის იქაა, სადაც თვალი პირველად ეცემა.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5">
              {['picnic-headphones', 'picnic-bottle', 'stripe-spread', 'stripe-hand'].map((k, i) => (
                <Rise key={k} delay={i * 0.06}><Photo k={k} onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" /></Rise>
              ))}
            </div>
          </Wrap>

          {/* ── 03 One afternoon ─────────────────────────────────────── */}
          <Chapter no="03" name={tx('A story', 'ისტორია')} id="afternoon" title={tx('One afternoon, one reader', 'ერთი შუადღე, ერთი მკითხველი')}>
            {tx('One character carries a short story across three frames: the blanket laid out, a chapter read with lunch close by, then the first bite. Same white linen, same palm shadows, the face always turned away.',
              'ერთი პერსონაჟი სამ კადრში მოკლე ისტორიას ჰყვება: გაშლილი პლედი, წაკითხული თავი სადილთან ახლოს, შემდეგ პირველი ლუკმა. იგივე თეთრი სელი, იგივე პალმის ჩრდილები, სახე კი ყოველთვის მოტრიალებულია.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {['blanket-flat', 'blanket-read', 'blanket-eat'].map((k, i) => (
                <Rise key={k} delay={i * 0.08}>
                  <div className="relative">
                    <Photo k={k} onOpen={setOpen} sizes="(min-width: 768px) 33vw, 50vw" />
                    <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] tabular-nums text-[#0E4B48]">{`0${i + 1}`}</span>
                  </div>
                </Rise>
              ))}
            </div>
          </Wrap>

          {/* ── 04 Routine ───────────────────────────────────────────── */}
          <Chapter no="04" name={tx('Routine', 'რუტინა')} id="routine" title={tx('A healthy spring routine', 'ჯანსაღი გაზაფხულის რუტინა')}>
            {tx('New habits for a new season. A book in the park, lunch at the desk, a smoothie in the sun: FitMeal as part of an ordinary, good day. Where the scene repeats, only the dish changes.',
              'ახალი ჩვევები ახალ სეზონთან ერთად. წიგნი პარკში, სადილი მაგიდასთან, სმუზი მზეზე: FitMeal ჩვეულებრივი, კარგი დღის ნაწილად. სადაც სცენა მეორდება, მხოლოდ კერძი იცვლება.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5">
              <Rise><Photo k="park-read" onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" /></Rise>
              <Rise delay={0.06}><Photo k="office-desk" onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" /></Rise>
              <Rise delay={0.12}><SwapTile keys={['office-greek', 'office-salmon']} onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" /></Rise>
              <Rise delay={0.18}><SwapTile keys={['drink-mango', 'drink-berry']} onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" every={2900} /></Rise>
            </div>
          </Wrap>

          {/* ── 05 One set ───────────────────────────────────────────── */}
          <Chapter no="05" name={tx('Product', 'პროდუქტი')} id="set" title={tx('One set, three dishes', 'ერთი სეტი, სამი კერძი')}>
            {tx('For the menu posts we built one table: teal grid cloth, a yellow napkin, a glass of water in hard sun. Then the dishes take turns.',
              'მენიუს პოსტებისთვის ერთი მაგიდა ავაწყვეთ: ფირუზისფერი უჯრედიანი სუფრა, ყვითელი ხელსახოცი, ჭიქა წყალი მკვეთრ მზეზე. შემდეგ კერძები რიგრიგობით იცვლება.')}
          </Chapter>
          <DishSwitch onOpen={setOpen} />

          {/* ── 06 Hands ─────────────────────────────────────────────── */}
          <Chapter no="06" name={tx('People', 'ადამიანები')} id="hands" title={tx('Hands, never faces', 'ხელები, არასდროს სახე')}>
            {tx('People stay in the story without taking it over: a fork over the box, two friends sharing bowls. Toned arms and a fit silhouette carry the promise of the food.',
              'ადამიანები ისტორიაში რჩებიან, მაგრამ მას არ იპყრობენ: ჩანგალი ყუთთან, ორი მეგობარი ბოულებით. ფიტ ხელები და სილუეტი პროდუქტის დაპირებას ატარებს.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
              <Rise><SwapTile keys={['floor-tall', 'floor']} onOpen={setOpen} every={3000} /></Rise>
              <Rise delay={0.08}><Photo k="share" onOpen={setOpen} sizes="(min-width: 768px) 50vw, 50vw" /></Rise>
            </div>
          </Wrap>

          {/* ── 07 Formats ───────────────────────────────────────────── */}
          <Chapter no="07" name={tx('Formats', 'ფორმატები')} id="formats" title={tx('Built for the crop', 'ჭრისთვის აწყობილი')}>
            {tx('Each picture was composed with both crops in mind. The food sits low and central, the top stays quiet, so the same frame works in the feed and in stories with space for the headline.',
              'ყველა კადრი ორივე ჭრის გათვალისწინებით აეწყო. კერძი ქვემოთ და ცენტრშია, ზედა ნაწილი მშვიდია, ამიტომ ერთი კადრი ფიდშიც მუშაობს და სთორიშიც, სათაურის ადგილით.')}
          </Chapter>
          <FormatSwitch />

          {/* ── Close ────────────────────────────────────────────────── */}
          <Wrap className="py-28 sm:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
              <div className="lg:col-span-4 grid grid-cols-3 gap-4">
                {[['20', tx('frames', 'კადრი')], ['9', tx('scenes', 'სცენა')], ['0', tx('faces', 'სახე')]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-[44px] sm:text-[56px] leading-none tabular-nums" style={{ fontWeight: 600 }}>{n}</div>
                    <div className="mt-2 text-[13px] text-[#0E4B48]/55">{l}</div>
                  </div>
                ))}
              </div>
              <RevealLines as="p" className="lg:col-span-4 text-[22px] sm:text-[26px] leading-[1.2] tracking-[-0.015em]" style={{ fontWeight: 500 }}>
                <span>{tx('A whole season of content,', 'მთელი სეზონის კონტენტი,')}</span>
                <span className="text-[#0E4B48]/45">{tx('without a single shoot day.', 'ერთი გადაღების დღის გარეშე.')}</span>
              </RevealLines>
              <div className="lg:col-span-3 lg:justify-self-end"><CtaLink /></div>
            </div>
          </Wrap>
        </div>
      </article>

      {/* Other cases */}
      <section aria-labelledby="more" className="px-1.5 pt-24">
        <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('More case studies', 'სხვა ქეისები')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5">
          {CASES.map((o) => (
            <CaseLink key={o.slug} to={o.path} cardId={`fitmeal-${o.slug}`} className="group block">
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
