import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import { SEO } from '../components/seo';
import { cld } from '../lib/cld';
import { BakedShell } from './shell';
import { CtaLink, Reveal, T } from './ui';
import { useI18n } from './i18n';
import { MoreCases } from './case-studies';

/*
 * A social media case, told the way agencies tell them: title and tags, one
 * big cover, then short chapters (brief, challenge, strategy) set beside the
 * work, a wall of the feed drifting up and down, a pair of large pieces and a
 * strip of posts running across the page.
 */

export type Media = { src: string; poster?: string; video?: boolean; w?: number; h?: number; alt?: string };
type L = { en: string; ka: string };
export type SocialCaseData = {
  path: string;
  brand: string;
  handle: string;
  avatar: string;            // small round logo for the post mock-ups
  year?: string;
  tags: L[];
  facts: [L, L][];
  seo: { title: string; description: string; keywords: string };
  cover: { bg: string; ink?: string; logo?: string; logoH?: number; reels?: Media[]; image?: Media; line?: L };
  brief: L;
  challenge: L;
  strategy: L;
  feed: Media[];             // posts for the wall (4:5)
  pair: [Media, Media];
  strip: Media[];            // the running strip
  closing?: Media[];         // a last justified row
  wallBg?: string;
};

const isVid = (m: Media) => m.video ?? /\.mp4($|\?)/.test(m.src);
const pic = (src: string, w: number) => cld(src, w);

/** one picture or film, never cropped unless asked */
function Piece({ m, className = '', fit = 'cover', w = 1200 }: { m: Media; className?: string; fit?: 'cover' | 'contain'; w?: number }) {
  const cls = `block h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`;
  return isVid(m)
    ? <video src={m.src} poster={m.poster} muted loop playsInline autoPlay preload="none" className={cls} aria-label={m.alt} />
    : <img src={pic(m.src, w)} alt={m.alt ?? ''} loading="lazy" decoding="async" draggable={false} className={cls} />;
}

/** label on the left, the words large on the right */
function Chapter({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="px-5 sm:px-8 py-20 sm:py-28">
      <Reveal className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] gap-4 md:gap-10 max-w-[1400px]">
        <h2 className="text-[17px] sm:text-[19px]" style={{ fontWeight: 600 }}>{label}</h2>
        <p className="text-[22px] sm:text-[30px] leading-[1.22] tracking-[-0.01em] text-[#111] max-w-[900px]">{children}</p>
      </Reveal>
    </section>
  );
}

/** an Instagram post as it sits in the feed */
function Post({ m, avatar, handle }: { m: Media; avatar: string; handle: string }) {
  return (
    <figure className="rounded-[10px] bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,.25)]">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <img src={pic(avatar, 64)} alt="" className="h-5 w-5 rounded-full object-cover bg-[#eee]" loading="lazy" />
        <span className="text-[10.5px] text-[#111]" style={{ fontWeight: 600 }}>{handle}</span>
        <span className="ml-auto text-[#111] text-[12px] leading-none">···</span>
      </div>
      <div className="bg-[#f2f2f2]" style={{ aspectRatio: isVid(m) ? `${m.w ?? 9}/${m.h ?? 16}` : `${Math.min(1.91, Math.max(0.8, (m.w ?? 4) / (m.h ?? 5)))}` }}><Piece m={m} w={520} /></div>
      <div className="flex items-center gap-2.5 px-2.5 py-2 text-[#111]">
        <Heart size={13} /><MessageCircle size={13} /><Send size={13} /><Bookmark size={13} className="ml-auto" />
      </div>
    </figure>
  );
}

/** the feed as a wall: columns drifting up and down */
function FeedWall({ d }: { d: SocialCaseData }) {
  // 5 columns, 3 on a phone (set after mount, so the first paint matches the prerender)
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setCols(mq.matches ? 5 : 3);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const posts = d.feed.length ? d.feed : [];
  // with enough posts each one lives in a single column, so the same post is
  // never on screen twice; a short feed runs whole in every column instead,
  // each column starting at a different post
  const dealt = Array.from({ length: cols }, (_, c) => posts.filter((_, i) => i % cols === c));
  const col = (c: number) => dealt.every((x) => x.length >= 3)
    ? dealt[c]
    : Array.from({ length: Math.max(4, posts.length) }, (_, i) => posts[(i + c * 2) % posts.length]);
  return (
    <section className="px-1.5">
      <div className="relative h-[78svh] min-h-[520px] max-h-[980px] overflow-hidden rounded-md" style={{ background: d.wallBg ?? '#0d0d0d' }} aria-label={`${d.brand} feed`}>
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-6 -rotate-0">
          {Array.from({ length: 5 }, (_, c) => c < cols && (
            <div key={c} className={`${c >= 3 ? 'hidden md:block' : ''} overflow-hidden`}>
              <div className={c % 2 ? 'baked-col-down' : 'baked-col-up'} style={{ ['--dur' as string]: `${46 + c * 7}s` }}>
                {[0, 1].map((k) => (
                  <div key={k} className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4" aria-hidden={k === 1 || undefined}>
                    {col(c).map((m, i) => <Post key={i} m={m} avatar={d.avatar} handle={d.handle} />)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16" style={{ background: `linear-gradient(${d.wallBg ?? '#0d0d0d'}, transparent)` }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(transparent, ${d.wallBg ?? '#0d0d0d'})` }} />
      </div>
    </section>
  );
}

/** posts running across the page, edge to edge; drag or wheel to move */
function Strip({ items }: { items: Media[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, on = false, held = false, last = 0;
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { last = 0; raf = requestAnimationFrame(tick); } });
    const tick = (t: number) => {
      if (!on) return;
      const dt = last ? Math.min(50, t - last) : 16; last = t;
      if (!held) {
        el.scrollLeft += dt * 0.035;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      }
      raf = requestAnimationFrame(tick);
    };
    const hold = () => { held = true; };
    const free = () => { held = false; };
    el.addEventListener('pointerenter', hold); el.addEventListener('pointerleave', free);
    el.addEventListener('touchstart', hold, { passive: true }); el.addEventListener('touchend', free);
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener('pointerenter', hold); el.removeEventListener('pointerleave', free); el.removeEventListener('touchstart', hold); el.removeEventListener('touchend', free); };
  }, []);
  return (
    <section className="py-1.5">
      <div ref={ref} className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[0, 1].map((k) => items.map((m, i) => (
          <div key={`${k}-${i}`} className="shrink-0 h-[52svh] sm:h-[66svh] max-h-[720px] overflow-hidden rounded-md bg-[#f2f2f2]"
            style={{ aspectRatio: `${m.w ?? 4}/${m.h ?? 5}` }} aria-hidden={k === 1 || undefined}>
            <Piece m={m} w={900} />
          </div>
        )))}
      </div>
    </section>
  );
}

/** a row of pieces at their own proportions, nothing cut */
function Row({ items }: { items: Media[] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-1.5">
      {items.map((m, i) => (
        <div key={i} className="overflow-hidden rounded-md bg-[#f2f2f2]" style={{ flex: `${(m.w ?? 4) / (m.h ?? 5)} 1 0%`, aspectRatio: `${m.w ?? 4}/${m.h ?? 5}` }}>
          <Piece m={m} />
        </div>
      ))}
    </div>
  );
}

export function SocialCase({ d }: { d: SocialCaseData }) {
  const { tx } = useI18n();
  const c = d.cover;
  return (
    <BakedShell>
      <SEO title={d.seo.title} description={d.seo.description} keywords={d.seo.keywords} type="article" />
      <article className="pt-14 sm:pt-[52px] text-[#111]">
        {/* title and tags */}
        <header className="px-5 sm:px-8 pt-10 sm:pt-16 pb-6 sm:pb-8">
          <span aria-hidden />
          <h1 className="mt-6 text-[40px] sm:text-[72px] leading-[0.95] tracking-[-0.02em]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            {d.brand}<span className="text-[#9a9a9a]">, {tx('Social Media', 'სოციალური მედია')}</span>
          </h1>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {d.tags.map((t) => <li key={t.en} className="inline-flex items-center h-8 px-3.5 rounded-full border border-[#111]/80 text-[13px]">{tx(t.en, t.ka)}</li>)}
            {d.year && <li className="inline-flex items-center h-8 px-3.5 rounded-full bg-[#f2f2f2] text-[13px] text-[#6f6f6f]">{d.year}</li>}
          </ul>
        </header>

        {/* cover */}
        <section className="px-1.5">
          {/* a cover picture is shown whole, at its own proportions */}
          {c.image && !c.reels ? (
            <div className="overflow-hidden rounded-md" style={{ background: c.bg, aspectRatio: `${c.image.w ?? 16}/${c.image.h ?? 9}` }}>
              <img src={c.image.src} alt={c.image.alt ?? d.brand} fetchPriority="high" decoding="async" draggable={false} className="block h-full w-full object-cover" />
            </div>
          ) : (
          <div className="relative overflow-hidden rounded-md h-[86svh] min-h-[560px] max-h-[1000px] flex flex-col" style={{ background: c.bg, color: c.ink ?? '#fff' }}>
            {c.image && <div className="absolute inset-0"><Piece m={c.image} w={2000} /></div>}
            {c.logo && <div className="relative z-[1] flex justify-center pt-8 sm:pt-10"><img src={c.logo} alt={d.brand} style={{ height: c.logoH ?? 34 }} className="w-auto" /></div>}
            {c.reels && (
              <div className="relative z-[1] flex-1 flex items-center justify-center gap-3 sm:gap-5 px-4 py-6 sm:py-8 min-h-0">
                {c.reels.map((m, i) => (
                  <div key={i} style={{ aspectRatio: `${m.w ?? 9}/${m.h ?? 16}`, transform: i === 0 ? 'translateY(4%) rotate(-2deg)' : i === 2 ? 'translateY(-4%) rotate(2deg)' : undefined }} className={`${(m.w ?? 9) / (m.h ?? 16) > 0.7 ? 'w-[min(30%,440px)] max-md:w-[78%]' : 'h-full max-h-[720px]'} overflow-hidden rounded-[18px] sm:rounded-[26px] shadow-[0_30px_60px_rgba(0,0,0,.28)] ${i !== 1 ? 'hidden sm:block' : ''}`}
>
                    <Piece m={m} />
                  </div>
                ))}
              </div>
            )}
            {c.line && <div className="relative z-[1] mt-auto flex justify-between gap-4 px-5 sm:px-8 pb-5 sm:pb-7 text-[14px] sm:text-[16px] opacity-85"><span>{tx(c.line.en, c.line.ka)}</span><span>{d.handle}</span></div>}
          </div>
          )}
        </section>

        <Chapter label={tx('Brief', 'ბრიფი')}>{tx(d.brief.en, d.brief.ka)}</Chapter>
        <FeedWall d={d} />
        <section className="px-1.5 pt-1.5"><div className="mx-auto max-w-[1000px]"><Row items={d.pair} /></div></section>
        <Chapter label={tx('Challenge', 'გამოწვევა')}>{tx(d.challenge.en, d.challenge.ka)}</Chapter>
        <Strip items={d.strip} />
        <Chapter label={tx('Strategy', 'სტრატეგია')}>{tx(d.strategy.en, d.strategy.ka)}</Chapter>
        {d.closing && <section className="px-1.5"><Row items={d.closing} /></section>}

        {/* facts */}
        <section className="px-5 sm:px-8 pt-20 sm:pt-28">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1100px] text-[14px]">
            {d.facts.map(([k, v]) => (
              <div key={k.en}><dt className="text-[#9a9a9a] mb-1">{tx(k.en, k.ka)}</dt><dd>{tx(v.en, v.ka)}</dd></div>
            ))}
          </dl>
        </section>

        <div className="pt-20 flex justify-center"><CtaLink /></div>
        <MoreCases current={d.path} />
      </article>
    </BakedShell>
  );
}
