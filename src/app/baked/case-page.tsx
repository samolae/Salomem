import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CaseHeroTarget, CaseLink } from '../components/case-transition';
import { AurumSEO, SchenkerSEO, UnispaceSEO } from '../components/seo';
import { IMG } from '../lib/cld';
import { BakedShell } from './shell';
import { Caption, CtaLink, Lightbox, Reveal, T, type LightboxItem } from './ui';
import { MoreCases } from './case-studies';
import { CASES, caseBySlug, type CaseStudy } from './cases';

/* A screenshot on its product's coloured stage, never cropped */
function Stage({ src, bg, alt, eager, pad = '7%' }: { src: string; bg: string; alt: string; eager?: boolean; pad?: string }) {
  return (
    <div className="overflow-hidden rounded-md" style={{ background: bg, padding: pad }}>
      <img
        {...IMG.wide(src)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block w-full h-auto rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <h2 className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{children}</h2>;
}

function CaseBody({ c }: { c: CaseStudy }) {
  const [open, setOpen] = useState<number | null>(null);
  const lightbox: LightboxItem[] = c.screens.map((s) => ({ src: s.src, alt: `${c.title}, ${s.title}`, brand: `${c.title} · ${s.title}` }));
  const others = CASES.filter((x) => x.slug !== c.slug);
  const dot = <span style={{ color: c.accent }}>.</span>;

  return (
    <>
      <CaseHeroTarget path={c.path} />

      {/* Title */}
      <header className="px-5 pt-28 pb-12 sm:pt-36 sm:pb-16 flex flex-col items-center text-center">
        <Link to="/work/ux-ui" className="mb-8 inline-flex items-center gap-1.5 text-[14px] text-[#6f6f6f] hover:text-[#d93905] transition-colors">
          <ArrowLeft size={14} /> UX/UI case studies
        </Link>
        <div className="text-[14px] text-[#d93905] mb-4">Case study · {c.year}</div>
        <h1 className="text-[44px] sm:text-[88px] leading-[0.95] tracking-[-0.01em] text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>
          {c.title}{dot}
        </h1>
        <p className="mt-5 text-[17px] sm:text-[19px] text-[#111]" style={{ fontWeight: 500 }}>{c.subtitle}</p>
      </header>

      {/* Facts */}
      <section aria-label="Project facts" className="px-1.5">
        <dl className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {c.meta.map((m) => (
            <div key={m.label} className="rounded-md bg-[#f2f2f2] px-4 py-3.5">
              <dt className="text-[13px] text-[#6f6f6f]">{m.label}</dt>
              <dd className="mt-0.5 text-[14px] text-[#111]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Hero screen */}
      <section aria-label={`${c.title} main screen`} className="px-1.5 pt-1.5">
        <Reveal><Stage src={c.hero} bg={c.stage} alt={`${c.title} interface`} eager pad="6%" /></Reveal>
      </section>

      {/* Stats */}
      <section aria-label="In numbers" className="px-1.5 pt-1.5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {c.stats.map((s) => (
            <div key={s.label} className="rounded-md border border-[#ececec] p-6">
              <div className="text-[34px] leading-none" style={{ fontFamily: T.display, fontWeight: 900, color: c.accent }}>{s.num}</div>
              <div className="mt-1.5 text-[14px] text-[#6f6f6f]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section aria-labelledby="overview" className="px-5 pt-24 pb-8 flex flex-col items-center text-center">
        <h2 id="overview" className="text-[14px] text-[#6f6f6f] mb-6">Overview</h2>
        <div className="max-w-[620px] space-y-5 text-[17px] leading-[1.6] text-[#111]">
          {c.intro.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
      </section>

      {/* Story */}
      <section aria-label="The story" className="px-1.5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {c.story.map((s, i) => (
            <Reveal key={s.label}>
              <div className="h-full rounded-md bg-[#f2f2f2] p-6 sm:p-9">
                <div className="flex items-baseline gap-2 text-[13px]">
                  <span className="tabular-nums" style={{ color: c.accent }}>0{i + 1}</span>
                  <span className="text-[#6f6f6f]">{s.label}</span>
                </div>
                <p className="mt-6 text-[18px] sm:text-[20px] leading-[1.45] text-[#111]">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Screens */}
      <section aria-labelledby="screens" className="px-1.5 pt-24">
        <SectionLabel>{`Screens · ${c.screens.length}`}</SectionLabel>
        <h2 id="screens" className="sr-only">Screens</h2>
        <div className="columns-1 md:columns-2 gap-x-1.5">
          {c.screens.map((s, i) => (
            <Reveal key={s.title} className="break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left rounded-md outline-none focus-visible:shadow-[0_0_0_2px_#ff4306]" aria-label={`Open ${s.title}`}>
                <Stage src={s.src} bg={c.stage} alt={`${c.title}, ${s.title}`} />
                <Caption title={s.title} sub={s.desc} tag={String(i + 1).padStart(2, '0')} />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles / decisions */}
      <section aria-labelledby="cards" className="px-1.5 pt-20">
        <div className="px-4 pb-10 flex flex-col items-center text-center">
          <h2 id="cards" className="text-[28px] sm:text-[40px] leading-[1.05] text-[#111] max-w-[760px]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            {c.cardsTitle}{dot}
          </h2>
          {c.cardsIntro && <p className="mt-5 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[460px]">{c.cardsIntro}</p>}
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${c.cards.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-1.5`}>
          {c.cards.map((k, i) => (
            <Reveal key={k.title}>
              <div className="h-full rounded-md bg-[#f2f2f2] p-6">
                <div className="text-[13px] tabular-nums" style={{ color: c.accent }}>0{i + 1}</div>
                <div className="mt-8 text-[16px] leading-snug text-[#111]" style={{ fontWeight: 500 }}>{k.title}</div>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#6f6f6f]">{k.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lists (flow, process, handoff) */}
      {c.lists && (
        <section aria-label="Process" className="px-1.5 pt-1.5">
          <div className={`grid grid-cols-1 ${c.lists.length > 1 ? 'md:grid-cols-2' : ''} gap-1.5`}>
            {c.lists.map((l) => (
              <Reveal key={l.title}>
                <div className="h-full rounded-md border border-[#ececec] p-6 sm:p-9">
                  <h3 className="text-[16px] text-[#111]" style={{ fontWeight: 500 }}>{l.title}</h3>
                  <ol className="mt-5 space-y-3.5">
                    {l.items.map((it, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-[1.5] text-[#333]">
                        <span className="tabular-nums text-[13px] pt-[3px]" style={{ color: c.accent }}>0{i + 1}</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Extra (design system sheet) */}
      {c.extra && (
        <section aria-labelledby="extra" className="px-1.5 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-1.5 items-start">
            <div className="rounded-md bg-[#f2f2f2] p-6 sm:p-9">
              <h2 id="extra" className="text-[22px] leading-tight text-[#111]" style={{ fontFamily: T.display, fontWeight: 900 }}>{c.extra.title}{dot}</h2>
              <p className="mt-4 text-[15px] leading-[1.55] text-[#6f6f6f]">{c.extra.text}</p>
            </div>
            {c.extra.src && (
              <Reveal>
                <div className="overflow-hidden rounded-md bg-[#f2f2f2]">
                  <img {...IMG.wide(c.extra.src)} alt={`${c.title} ${c.extra.title.toLowerCase()}`} loading="lazy" decoding="async" className="block w-full h-auto" />
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Outcome */}
      <section aria-labelledby="outcome" className="px-5 pt-28 flex flex-col items-center text-center">
        <div className="text-[14px] text-[#6f6f6f] mb-4">Outcome</div>
        <h2 id="outcome" className="text-[32px] sm:text-[52px] leading-[1] text-[#111] max-w-[860px]" style={{ fontFamily: T.display, fontWeight: 900 }}>
          {c.outcomeTitle}{dot}
        </h2>
        <p className="mt-6 text-[17px] leading-[1.6] text-[#111] max-w-[620px]">{c.outcome}</p>
      </section>
      {c.outcomeCards && (
        <section aria-label="Reflection" className="px-1.5 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {c.outcomeCards.map((k) => (
              <div key={k.title} className="rounded-md bg-[#f2f2f2] p-6 sm:p-9">
                <div className="text-[16px] text-[#111]" style={{ fontWeight: 500 }}>{k.title}</div>
                <p className="mt-2 text-[15px] leading-[1.55] text-[#6f6f6f]">{k.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="pt-12 flex justify-center"><CtaLink /></div>

      <MoreCases current={`/projects/${c.slug}`} />

      <Lightbox items={lightbox} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

function CasePage({ slug }: { slug: CaseStudy['slug'] }) {
  const c = caseBySlug(slug);
  const Seo = slug === 'aurum' ? AurumSEO : slug === 'schenker' ? SchenkerSEO : UnispaceSEO;
  return (
    <BakedShell>
      <Seo />
      <CaseBody c={c} />
    </BakedShell>
  );
}

export const AurumCase = () => <CasePage slug="aurum" />;
export const SchenkerCase = () => <CasePage slug="schenker" />;
export const UnispaceCase = () => <CasePage slug="unispace" />;
