import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { SEO } from '../components/seo';
import { RevealLines, Rise } from '../components/case-motion';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, type LightboxItem } from './ui';
import { CASES } from './cases';
import { useI18n } from './i18n';

/*
 * GV Capital: identity for an investment and development holding. The page
 * follows the brand's own proportions: a quiet mineral field, carbon type,
 * one emerald interval doing the work, and orange only as a signal.
 */

const P = '/cases/gv';
const CARBON = '#16232A';
const EMERALD = '#0A6670';
const ORANGE = '#FF5804';
const FIELD = '#EEEBE4';
const LIVE = 'https://gv-capital.vercel.app/';

type Shot = { key: string; w: number; h: number; en: string; ka: string };
const SHOTS: Shot[] = [
  { key: 'reception', w: 2400, h: 1350, en: 'Reception wall with the GV mark', ka: 'მისაღების კედელი GV ნიშნით' },
  { key: 'lounge', w: 2400, h: 1350, en: 'Lounge from above, emerald and carbon', ka: 'ლაუნჯი ზემოდან, ზურმუხტისფერი და ნახშირისფერი' },
  { key: 'overhead', w: 2400, h: 2400, en: 'Meeting corner from above', ka: 'შეხვედრის კუთხე ზემოდან' },
  { key: 'focus-office', w: 2400, h: 2133, en: 'A focus booth in the office', ka: 'ფოკუსის კაბინა ოფისში' },
  { key: 'direction', w: 2400, h: 1350, en: 'Wayfinding in the office', ka: 'ნავიგაცია ოფისში' },
  { key: 'corridor', w: 1744, h: 2336, en: 'Corridor with directional blades', ka: 'დერეფანი მიმართულების ნიშნებით' },
  { key: 'wayfinding', w: 1200, h: 1800, en: 'Layered wayfinding blade', ka: 'შრეებიანი ნავიგაციის ნიშანი' },
  { key: 'cards', w: 1744, h: 2336, en: 'Business cards', ka: 'სავიზიტო ბარათები' },
  { key: 'letterhead', w: 1200, h: 1697, en: 'Letterhead', ka: 'ბლანკი' },
  { key: 'document', w: 1200, h: 1697, en: 'Project proposal cover', ka: 'პროექტის შეთავაზების ყდა' },
  { key: 'profile', w: 1200, h: 1697, en: 'Company profile', ka: 'კომპანიის პროფილი' },
  { key: 'brochure', w: 1200, h: 1697, en: 'Space for your business brochure', ka: 'ბროშურა' },
  { key: 'company', w: 1280, h: 720, en: 'Company presentation', ka: 'კომპანიის პრეზენტაცია' },
  { key: 'layouts', w: 1280, h: 720, en: 'Presentation template', ka: 'პრეზენტაციის შაბლონი' },
  { key: 'digital', w: 1920, h: 1080, en: 'Mark on a warehouse corner at dusk', ka: 'ნიშანი საწყობის კუთხეზე, დაბინდებისას' },
  { key: 'folder', w: 1248, h: 1664, en: 'Folder', ka: 'საქაღალდე' },
  { key: 'packaging', w: 1086, h: 1448, en: 'Packaging tape and box', ka: 'შეფუთვის ლენტი და ყუთი' },
  { key: 'hardhat', w: 1086, h: 1448, en: 'Site hard hat', ka: 'სამშენებლო ჩაფხუტი' },
  { key: 'uniform', w: 1248, h: 1664, en: 'Uniform', ka: 'უნიფორმა' },
  { key: 'material', w: 1248, h: 1664, en: 'Embossed mark on fabric', ka: 'ამოტვიფრული ნიშანი ქსოვილზე' },
  { key: 'concrete', w: 720, h: 1280, en: 'Mark set in concrete', ka: 'ნიშანი ბეტონში' },
  { key: 'hoodie', w: 1536, h: 1024, en: 'Team hoodie', ka: 'გუნდის ჰუდი' },
  { key: 'facade', w: 1920, h: 1080, en: 'Warehouse facade at night', ka: 'საწყობის ფასადი ღამით' },
  { key: 'campus', w: 1920, h: 1080, en: 'Logistics campus at sunset', ka: 'ლოჯისტიკური კომპლექსი მზის ჩასვლისას' },
  { key: 'fleet', w: 1920, h: 1080, en: 'Fleet', ka: 'ავტოპარკი' },
  { key: 'flags', w: 1248, h: 1664, en: 'Flags', ka: 'დროშები' },
  { key: 'social-opportunities', w: 1080, h: 1350, en: 'Social post: space that creates opportunities', ka: 'პოსტი: სივრცე, რომელიც ქმნის შესაძლებლობებს' },
  { key: 'social-possibility', w: 1080, h: 1350, en: 'Social post: built around possibility', ka: 'პოსტი: შესაძლებლობის გარშემო' },
  { key: 'social-perspective', w: 1080, h: 1350, en: 'Social post: a long-term view', ka: 'პოსტი: გრძელვადიანი ხედვა' },
  { key: 'social-focus', w: 1080, h: 1350, en: 'Social post: built for focus', ka: 'პოსტი: ფოკუსისთვის' },
];
const idx = (k: string) => SHOTS.findIndex((s) => s.key === k);

/* editorial text, as on the other cases */
/** the home page type: Avenir Next Georgian for everything */
const SERIF = 'inherit';
const LABEL = 'text-[12px] uppercase tracking-[0.06em] text-[#16232A]/70';
const HEAD = 'text-[26px] sm:text-[32px] leading-[1.12] tracking-[-0.015em]';
const BODY = 'text-[16px] sm:text-[17px] leading-[1.6] text-[#16232A]';

function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full px-3 sm:px-5 lg:px-8 ${className}`}>{children}</div>;
}

function Chapter({ name, title, children, id }: { no?: string; name: string; title: string; children: string; id: string }) {
  // spread across the full width: label, heading, then the text in its own columns
  return (
    <Wrap className="pt-24 sm:pt-32 pb-10 sm:pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-3 items-start">
        <div className={`lg:col-span-2 lg:pt-3 ${LABEL}`}>{name}</div>
        <RevealLines as="h2" className={`lg:col-span-4 ${HEAD}`} style={{ fontWeight: 500 }}><span id={id}>{title}</span></RevealLines>
        <Rise delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:pt-2"><p className={`mt-3 lg:mt-0 ${BODY} lg:columns-2 lg:gap-8`}>{children}</p></Rise>
      </div>
    </Wrap>
  );
}

function Photo({ k, onOpen, sizes = '(min-width: 768px) 33vw, 100vw', className = '', cover }: { k: string; onOpen: (i: number) => void; sizes?: string; className?: string; cover?: boolean }) {
  const { tx } = useI18n();
  const i = idx(k);
  const s = SHOTS[i];
  return (
    <button type="button" onClick={() => onOpen(i)} aria-label={`${tx(s.en, s.ka)}, ${tx('enlarge', 'გადიდება')}`}
      className={`group relative block w-full overflow-hidden rounded-[6px] bg-[#dcd8d0] cursor-zoom-in outline-none focus-visible:shadow-[0_0_0_2px_#0A6670] ${cover ? 'h-full' : ''} ${className}`}>
      <img src={`${P}/${k}.jpg`} srcSet={s.w > 1200 ? `${P}/${k}-1200.jpg 1200w, ${P}/${k}.jpg ${s.w}w` : undefined} sizes={sizes} width={s.w} height={s.h}
        alt={tx(s.en, s.ka)} loading="lazy" decoding="async"
        className={`block w-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] ${cover ? 'h-full object-cover' : 'h-auto'}`} />
    </button>
  );
}

function Film({ src, poster, className = '' }: { src: string; poster: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <video src={src} poster={poster} muted loop playsInline autoPlay={!reduce} preload="metadata"
      className={`block w-full h-full object-cover rounded-[6px] ${className}`} />
  );
}

/* ── The Active Interval: hover or tap and the emerald gap opens ─────── */
function ActiveInterval() {
  const { tx } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const t = reduce ? { duration: 0 } : { duration: 0.32, ease: [0.2, 0.7, 0.2, 1] as const };
  return (
    <Wrap>
      <button type="button" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onClick={() => setOpen((o) => !o)} aria-pressed={open}
        className="group block w-full rounded-[10px] p-6 sm:p-10 text-left outline-none focus-visible:shadow-[0_0_0_2px_#0A6670]" style={{ background: FIELD }}>
        <div className="flex h-[200px] sm:h-[280px] items-stretch">
          <div className="flex-[3] rounded-l-[4px] p-5 sm:p-7 flex flex-col justify-end" style={{ background: CARBON }}>
            <div className="text-white text-[22px] sm:text-[34px] leading-[1]" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>GV CAPITAL</div>
          </div>
          <motion.div className="relative" style={{ background: EMERALD }} animate={{ width: open ? 34 : 20 }} transition={t} />
          <motion.div className="flex-[2] rounded-r-[4px] p-5 sm:p-7 flex flex-col justify-end" style={{ background: CARBON }} animate={{ flexGrow: open ? 2.6 : 2 }} transition={t}>
            <motion.div className="text-white/80 text-[13px] sm:text-[15px] leading-[1.3]" animate={{ opacity: open ? 1 : 0, y: open ? 0 : 8 }} transition={t}>
              {tx('Industrial & Logistics', 'ინდუსტრია და ლოჯისტიკა')}
            </motion.div>
          </motion.div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[13px] text-[#16232A]/70">
          <span>{tx('20px at rest, 34px when it opens, 320ms', '20px მშვიდ მდგომარეობაში, 34px გახსნისას, 320ms')}</span>
          <span className="hidden sm:inline">{tx('Hover to open the interval', 'მიიტანე კურსორი')}</span>
        </div>
      </button>
    </Wrap>
  );
}

/* ── Colour by proportion ─────────────────────────────────────────────── */
function Proportions() {
  const { tx } = useI18n();
  const parts = [
    { p: 60, en: 'Mineral beige', ka: 'მინერალური ბეჟი', role: tx('Space, the open field', 'სივრცე, ღია ველი'), bg: FIELD, ink: CARBON },
    { p: 25, en: 'Carbon black', ka: 'ნახშირისფერი', role: tx('Structure, the holding layer', 'სტრუქტურა, ჰოლდინგის შრე'), bg: CARBON, ink: '#fff' },
    { p: 10, en: 'GV emerald', ka: 'GV ზურმუხტისფერი', role: tx('The interval, the decision', 'შუალედი, გადაწყვეტილება'), bg: EMERALD, ink: '#fff' },
    { p: 5, en: 'Blaze orange', ka: 'ნარინჯისფერი', role: tx('Signal: wayfinding, the main action', 'სიგნალი: ნავიგაცია, მთავარი ქმედება'), bg: ORANGE, ink: '#fff' },
  ];
  return (
    <Wrap>
      <div className="flex h-[140px] sm:h-[180px] overflow-hidden rounded-[8px] ring-1 ring-inset ring-black/5">
        {parts.map((x) => <div key={x.en} className="h-full" style={{ flexGrow: x.p, flexBasis: 0, background: x.bg }} />)}
      </div>
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
        {parts.map((x) => (
          <div key={x.en}>
            <div className="flex items-baseline gap-2"><span className="text-[28px] tabular-nums leading-none" style={{ fontWeight: 600 }}>{x.p}%</span></div>
            <div className="mt-2 text-[15px]" style={{ fontWeight: 500 }}>{tx(x.en, x.ka)}</div>
            <div className="mt-1 text-[13px] leading-[1.45] text-[#16232A]/65">{x.role}</div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

export function GvCase() {
  const { tx } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const gallery: LightboxItem[] = SHOTS.map((s) => ({ src: `${P}/${s.key}.jpg`, alt: tx(s.en, s.ka), brand: `GV Capital, ${tx(s.en, s.ka)}` }));
  const facts: [string, string][] = [
    [tx('Client', 'კლიენტი'), 'GV Capital'],
    [tx('Year', 'წელი'), '2026'],
    [tx('Sector', 'სექტორი'), tx('Investment and development, industrial & logistics', 'ინვესტიცია და განვითარება, ინდუსტრია და ლოჯისტიკა')],
    [tx('Scope', 'სამუშაო'), tx('Brand concept, identity, guidelines', 'ბრენდის კონცეფცია, იდენტობა, გაიდლაინი')],
  ];

  return (
    <BakedShell>
      <SEO
        title="GV Capital | Brand Identity Case Study"
        description="GV Capital makes space: brand concept, identity and live guidelines for a Georgian investment and development holding. The Active Interval, colour by proportion, holding applications and the first vertical, industrial & logistics."
        keywords="GV Capital, brand identity, brand guidelines, investment holding, logistics, Georgia, Active Interval, Salome Mosiava"
        type="article"
      />
      <CaseHeroTarget path="/projects/gv-capital" />

      <article className="px-1.5 pt-14 sm:pt-[52px]">
        <div className="rounded-md overflow-hidden bg-[#F6F4EF]" style={{ color: CARBON }}>

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <header>
            <Wrap className="flex items-start justify-between pt-6 sm:pt-8 text-[13px]">
              <Link to="/work/case-studies" className="inline-flex items-center gap-1.5 text-[#16232A]/55 hover:text-[#16232A] transition-colors">
                <ArrowLeft size={13} /> {tx('Case studies', 'ქეისები')}
              </Link>
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px] ring-1 ring-inset ring-black/10 hover:bg-[#f2f2f2]">
                {tx('Live guidelines', 'ცოცხალი გაიდლაინი')} <ArrowUpRight size={12} />
              </a>
            </Wrap>
            <Wrap className="pt-14 sm:pt-20">
              <RevealLines as="h1" className="text-[44px] sm:text-[76px] lg:text-[96px] leading-[0.95] tracking-[-0.035em]" style={{ fontWeight: 700 }}>
                <span>GV Capital</span>
                <span style={{ color: EMERALD }}>{tx('Makes space.', 'ქმნის სივრცეს.')}</span>
              </RevealLines>
            </Wrap>
            <Wrap className="pt-12 sm:pt-16">
              <div className="aspect-[16/9] overflow-hidden rounded-[6px] bg-[#16232A]"><Film src={`${P}/cover.mp4`} poster={`${P}/facade.jpg`} /></div>
            </Wrap>
            <Wrap className="pt-10 pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-5 pt-6 border-t border-[#16232A]/15 text-[13px]">
                <p className="col-span-2 lg:col-span-4 text-[18px] sm:text-[20px] leading-[1.35]" style={{ fontWeight: 500 }}>
                  {tx('A brand for a Georgian investment and development holding, and the live guidelines that run it.', 'ბრენდი ქართული საინვესტიციო და განვითარების ჰოლდინგისთვის და ცოცხალი გაიდლაინი, რომელიც მას მართავს.')}
                </p>
                {facts.map(([k, v], i) => (
                  <div key={k} className={['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-3', 'lg:col-span-2'][i]}>
                    <div style={{ color: EMERALD }}>{k}</div>
                    <div className="mt-1 text-[#16232A]/75 leading-[1.5]">{v}</div>
                  </div>
                ))}
              </div>
            </Wrap>
          </header>

          {/* ── The idea ─────────────────────────────────────────────── */}
          <Wrap className="pt-28 sm:pt-36 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-3 items-start">
              <div className={`lg:col-span-2 lg:pt-3 ${LABEL}`}>{tx('Brand idea', 'ბრენდის იდეა')}</div>
              <RevealLines as="h2" className={`lg:col-span-4 ${HEAD}`} style={{ fontWeight: 500 }}><span>{tx('Space that creates opportunities', 'სივრცე, რომელიც ქმნის შესაძლებლობებს')}</span></RevealLines>
              <Rise className="lg:col-span-3 lg:col-start-7 lg:pt-2"><p className={`mt-3 lg:mt-0 ${BODY}`}>{tx(
                'GV Capital builds the ground for projects, partnerships and new lines of business. The brand says it in three words, GV Capital makes space, and keeps the approved Georgian line as its public promise: space that creates opportunities.',
                'GV Capital ქმნის ადგილს პროექტებისთვის, პარტნიორობებისთვის და ახალი ბიზნეს-მიმართულებებისთვის. ბრენდი ამას სამი სიტყვით ამბობს, GV Capital makes space, საჯარო დაპირებად კი დამტკიცებული სლოგანი რჩება: სივრცე, რომელიც ქმნის შესაძლებლობებს.')}</p></Rise>
              <Rise delay={0.08} className="lg:col-span-3 lg:pt-2"><p className={`mt-3 lg:mt-0 ${BODY}`}>{tx(
                'Industrial and logistics is the first real proof. A new direction enters the brand only once the business behind it is real: no ghost icons, no placeholder promises.',
                'ინდუსტრია და ლოჯისტიკა ამ იდეის პირველი რეალური მტკიცებულებაა. ახალი მიმართულება ბრენდში მხოლოდ მაშინ ჩნდება, როცა მის უკან ბიზნესი რეალურია: არც მოჩვენებითი აიქონები, არც ცარიელი დაპირებები.')}</p></Rise>
            </div>
          </Wrap>
          <Wrap className="pt-12"><Photo k="overhead" onOpen={setOpen} sizes="(min-width: 1240px) 1140px, 100vw" className="aspect-[16/9]" cover /></Wrap>

          {/* ── Active Interval ──────────────────────────────────────── */}
          <Chapter name={tx('Signature device', 'მთავარი ნიშანი')} id="interval" title={tx('The Active Interval', 'მოქმედი შუალედი')}>
            {tx('One straight emerald gap between two solid planes. It opens space, separates levels, joins the masterbrand to a vertical and points to the main action. One per composition, never a pattern, never more than about a tenth of the surface.',
              'ერთი სწორი ზურმუხტისფერი შუალედი ორ მყარ სიბრტყეს შორის. ის ხსნის სივრცეს, ყოფს დონეებს, აერთებს მასტერბრენდს მიმართულებასთან და მიუთითებს მთავარ ქმედებაზე. ერთ კომპოზიციაში ერთი, არასდროს pattern, არასდროს ზედაპირის მეათედზე მეტი.')}
          </Chapter>
          <ActiveInterval />

          {/* ── Colour ───────────────────────────────────────────────── */}
          <Chapter name={tx('Colour', 'ფერი')} id="colour" title={tx('Colour by proportion', 'ფერი პროპორციით')}>
            {tx('Colour is a ratio, not a list. A calm mineral field carries most of every layout, carbon holds the structure, emerald marks the decision, and orange appears only as a short live signal.',
              'ფერი პროპორციაა და არა სია. მშვიდი მინერალური ველი ყოველი კომპოზიციის დიდ ნაწილს იკავებს, ნახშირისფერი სტრუქტურას იჭერს, ზურმუხტისფერი გადაწყვეტილებას აღნიშნავს, ნარინჯისფერი კი მხოლოდ მოკლე სიგნალად ჩნდება.')}
          </Chapter>
          <Proportions />

          {/* ── Holding applications ─────────────────────────────────── */}
          <Chapter name={tx('Applications', 'გამოყენება')} id="holding" title={tx('The holding, on paper and on screen', 'ჰოლდინგი ქაღალდზე და ეკრანზე')}>
            {tx('Business cards, letterhead, proposals, the company profile and presentation templates share one grid: carbon panel, emerald interval, the photograph opening into the space.',
              'სავიზიტოები, ბლანკი, შეთავაზებები, კომპანიის პროფილი და პრეზენტაციის შაბლონები ერთ ბადეზეა: ნახშირისფერი პანელი, ზურმუხტისფერი შუალედი და ფოტო, რომელიც სივრცეში იხსნება.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5">
              {['cards', 'letterhead', 'document', 'profile'].map((k, i) => (
                <Rise key={k} delay={i * 0.05}><Photo k={k} onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[3/4]" cover /></Rise>
              ))}
            </div>
            <div className="mt-1.5 sm:mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2.5">
              <Rise><Photo k="company" onOpen={setOpen} sizes="(min-width: 768px) 50vw, 100vw" /></Rise>
              <Rise delay={0.06}><Photo k="layouts" onOpen={setOpen} sizes="(min-width: 768px) 50vw, 100vw" /></Rise>
            </div>
          </Wrap>

          {/* ── Space ────────────────────────────────────────────────── */}
          <Chapter name={tx('Space', 'სივრცე')} id="space" title={tx('An office that says it', 'ოფისი, რომელიც ამას ამბობს')}>
            {tx('In the office the idea becomes the room: the mark on a carbon wall, emerald where a path opens, orange only where you need to turn.',
              'ოფისში იდეა თავად ოთახად იქცევა: ნიშანი ნახშირისფერ კედელზე, ზურმუხტისფერი იქ, სადაც გზა იხსნება, ნარინჯისფერი მხოლოდ იქ, სადაც მოსახვევია.')}
          </Chapter>
          <Wrap>
            <div className="aspect-[16/9] overflow-hidden rounded-[6px] bg-[#16232A]"><Film src={`${P}/reception.mp4`} poster={`${P}/reception.jpg`} /></div>
            <div className="mt-1.5 sm:mt-2.5 grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2.5">
              {['corridor', 'wayfinding', 'focus-office'].map((k, i) => (
                <Rise key={k} delay={i * 0.06} className={i === 2 ? 'col-span-2 md:col-span-1' : ''}><Photo k={k} onOpen={setOpen} className="aspect-[3/4]" cover /></Rise>
              ))}
            </div>
            <div className="mt-1.5 sm:mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2.5">
              <Rise><Photo k="lounge" onOpen={setOpen} sizes="(min-width: 768px) 50vw, 100vw" /></Rise>
              <Rise delay={0.06}><Photo k="direction" onOpen={setOpen} sizes="(min-width: 768px) 50vw, 100vw" /></Rise>
            </div>
          </Wrap>

          {/* ── Objects ──────────────────────────────────────────────── */}
          <Chapter name={tx('Objects', 'საგნები')} id="objects" title={tx('From the folder to the hard hat', 'საქაღალდიდან ჩაფხუტამდე')}>
            {tx('The mark holds up in every material the company touches: paper, tape, fabric, concrete and a site helmet.',
              'ნიშანი ყველა მასალაზე მუშაობს, რასაც კომპანია ეხება: ქაღალდი, ლენტი, ქსოვილი, ბეტონი და სამშენებლო ჩაფხუტი.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2.5">
              {['folder', 'packaging', 'hardhat', 'uniform', 'material', 'concrete'].map((k, i) => (
                <Rise key={k} delay={(i % 3) * 0.06}><Photo k={k} onOpen={setOpen} className="aspect-[3/4]" cover /></Rise>
              ))}
            </div>
          </Wrap>

          {/* ── First vertical ───────────────────────────────────────── */}
          <Chapter name={tx('First vertical', 'პირველი მიმართულება')} id="vertical" title={tx('Industrial & Logistics', 'ინდუსტრია და ლოჯისტიკა')}>
            {tx('The facade, the fleet and the flags come last on purpose. They are the system’s first proof, not its leader: the holding brand stays the same, the vertical brings its own real content.',
              'ფასადი, ავტოპარკი და დროშები განზრახ ბოლოს მოდის. ისინი სისტემის პირველი მტკიცებულებაა და არა მისი ლიდერი: ჰოლდინგის ბრენდი იგივე რჩება, მიმართულებას კი საკუთარი რეალური კონტენტი მოაქვს.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 sm:gap-2.5">
              <div className="md:col-span-8 aspect-[16/9] overflow-hidden rounded-[6px] bg-[#16232A]"><Film src={`${P}/facade.mp4`} poster={`${P}/facade.jpg`} /></div>
              <div className="md:col-span-4 aspect-[3/4] md:aspect-auto overflow-hidden rounded-[6px] bg-[#16232A]"><Film src={`${P}/flags.mp4`} poster={`${P}/flags.jpg`} /></div>
            </div>
            <div className="mt-1.5 sm:mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-2.5">
              {['campus', 'fleet', 'digital'].map((k, i) => (
                <Rise key={k} delay={i * 0.06}><Photo k={k} onOpen={setOpen} /></Rise>
              ))}
            </div>
          </Wrap>

          {/* ── Social ───────────────────────────────────────────────── */}
          <Chapter name={tx('Social', 'სოციალური მედია')} id="social" title={tx('Claim, proof, next move', 'მტკიცება, საბუთი, შემდეგი ნაბიჯი')}>
            {tx('Every post follows the brand’s message order: a claim, the proof behind it, the next move. The interval cuts the frame and leaves the headline its space.',
              'ყველა პოსტი ბრენდის თანმიმდევრობას მიჰყვება: მტკიცება, მისი საბუთი, შემდეგი ნაბიჯი. შუალედი კადრს ჭრის და სათაურს თავის სივრცეს უტოვებს.')}
          </Chapter>
          <Wrap>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5">
              {['social-opportunities', 'social-possibility', 'social-perspective', 'social-focus'].map((k, i) => (
                <Rise key={k} delay={i * 0.06}><Photo k={k} onOpen={setOpen} sizes="(min-width: 768px) 25vw, 50vw" /></Rise>
              ))}
            </div>
          </Wrap>

          {/* ── Close ────────────────────────────────────────────────── */}
          <Wrap className="py-28 sm:py-40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 items-end">
              <div className="lg:col-span-5" style={{ fontFamily: SERIF }}>
                <div className={LABEL}>{tx('Live guidelines', 'ცოცხალი გაიდლაინი')}</div>
                <p className={`mt-2 ${HEAD}`}>{tx('The whole system lives online: logo, colour, type, voice, templates and downloads.', 'მთელი სისტემა ონლაინ ცხოვრობს: ლოგო, ფერი, შრიფტი, ტონი, შაბლონები და ჩამოსატვირთი ფაილები.')}</p>
                <a href={LIVE} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-[15px] underline underline-offset-4 decoration-[#0A6670]/40 hover:decoration-[#0A6670]" style={{ fontFamily: 'inherit' }}>
                  gv-capital.vercel.app <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="lg:col-start-9 lg:col-span-4 lg:justify-self-end"><CtaLink /></div>
            </div>
          </Wrap>
        </div>
      </article>

      <section aria-labelledby="more" className="px-1.5 pt-24">
        <h2 id="more" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('More case studies', 'სხვა ქეისები')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1.5">
          {CASES.map((o) => (
            <CaseLink key={o.slug} to={o.path} cardId={`gv-${o.slug}`} className="group block">
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
