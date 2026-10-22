import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { CaseLink } from '../components/case-transition';
import { IMG } from '../lib/cld';
import { HeroCanvas } from './hero-canvas';
import { useMotionPause } from './shell';
import { Caption, CtaLink, FadeImg, LogoStrip, Reveal, T } from './ui';
import { clients, experiences, spotlights } from './content';
import {
  adsBrands, adsCarmall1, adsGino4, adsTerminal1, screenAurumMainHQ, schenkerSendung, unispaceLogin,
} from './data';

const AVATAR = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto,w_160,c_limit/v1777841338/fav_ggorfv.png';

/* A screenshot set on a coloured stage, for the UX/UI case tiles */
function ScreenStage({ src, bg, alt, eager }: { src: string; bg: string; alt: string; eager?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-md p-[8%]" style={{ background: bg }}>
      <img
        {...IMG.caseMain(src)}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block w-full h-auto rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
}

function Tile({ children }: { children: ReactNode }) {
  return <Reveal>{children}</Reveal>;
}

export function HomeContent() {
  const { paused } = useMotionPause();
  const fitmeal = adsBrands[0];

  const left: ReactNode[] = [
    <CaseLink key="aurum" to="/projects/aurum" cardId="home-aurum" className="group block">
      <ScreenStage src={screenAurumMainHQ} bg="linear-gradient(160deg,#16130b,#0b0b0f 70%)" alt="AURUM crypto exchange dashboard" eager />
      <Caption title="AURUM" sub="Crypto exchange · 196 screens, 64+ components" tag="Case study" />
    </CaseLink>,
    <Link key="motion" to="/work/social-media-motion" className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <video
          src="https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/carmall-ne_1_u5ewuz.mp4"
          autoPlay={!paused} loop muted playsInline preload="metadata"
          ref={(v) => { if (v) { paused ? v.pause() : v.play().catch(() => {}); } }}
          className="block w-full h-auto"
        />
      </div>
      <Caption title="Social Media Motion" sub="Reels and brand animations for Carmall, Saloni and more" tag="12 reels" />
    </Link>,
    <div key="about" className="rounded-md bg-[#f2f2f2] px-6 py-14 sm:px-12 sm:py-20 mb-5 text-center">
      <p className="text-[15px] leading-[1.55] text-[#111] max-w-[440px] mx-auto">
        At Scope we started from zero. In under two years I helped grow the team, led design leads, worked with 50+ businesses and managed $70,000+ in monthly ad spend.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 text-[14px] text-[#6f6f6f]">
        <img {...IMG.logo(experiences[2].logo)} alt="" width="24" height="24" className="h-6 w-6 rounded-full object-cover" />
        Art Director, Scope
      </div>
    </div>,
    <Link key="fitmeal" to="/work/social-media-ads" className="group block">
      <div className="grid grid-cols-2 gap-1.5 items-start">
        {fitmeal.items.slice(0, 4).map((it, i) => (
          <div key={i} className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
            <FadeImg src={it.src} sizes="tile" className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
        ))}
      </div>
      <Caption title="FitMeal" sub="AI content for social" tag="Ads" />
    </Link>,
    <CaseLink key="unispace" to="/projects/unispace" cardId="home-unispace" className="group block">
      <ScreenStage src={unispaceLogin} bg="linear-gradient(160deg,#dfe6ff,#eef1ff)" alt="Unispace student management platform" />
      <Caption title="Unispace" sub="Student management · multi-role EdTech" tag="Case study" />
    </CaseLink>,
  ];

  const right: ReactNode[] = [
    <Link key="ads" to="/work/social-media-ads" className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsTerminal1} eager className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Terminal social media ads" />
      </div>
      <Caption title="Social Media Ads" sub="Campaigns for Terminal, Mardi, Crystal Leasing and 13 more" tag="16 brands" />
    </Link>,
    <CaseLink key="schenker" to="/projects/schenker" cardId="home-schenker" className="group block">
      <ScreenStage src={schenkerSendung} bg="linear-gradient(160deg,#e8ecd8,#d4dab8)" alt="Schenker shipment form" />
      <Caption title="Schenker" sub="Enterprise logistics · form systems & tracking" tag="Case study" />
    </CaseLink>,
    <Link key="carmall" to="/work/social-media-ads" className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsCarmall1} className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Carmall ad" />
      </div>
      <Caption title="Carmall" sub="Campaign visuals" tag="Ads" />
    </Link>,
    <div key="exp" className="rounded-md bg-[#f2f2f2] px-5 py-6 sm:px-7 sm:py-8 mb-5">
      <div className="text-[14px] text-[#6f6f6f] mb-4">Experience</div>
      <ul className="divide-y divide-[#e4e4e4]">
        {experiences.map((e) => (
          <li key={e.company + e.start} className="flex items-center gap-3 py-2.5 text-[14px]">
            <img {...IMG.logo(e.logo)} alt="" width="24" height="24" className="h-6 w-6 rounded object-cover flex-shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="text-[#111]">{e.company}</span>
              <span className="text-[#6f6f6f]"> · {e.role}</span>
            </span>
            <span className="text-[#9a9a9a] whitespace-nowrap tabular-nums hidden sm:inline">{e.start} – {e.end}</span>
          </li>
        ))}
      </ul>
    </div>,
    <Link key="gino" to="/work/social-media-ads" className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsGino4} className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Gino Aquapark ad" />
      </div>
      <Caption title="Gino Aquapark" sub="Seasonal campaign" tag="Ads" />
    </Link>,
  ];

  return (
    <>
      <HeroCanvas />

      {/* Intro */}
      <section className="px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <img src={AVATAR} alt="Salome Mosiava" width="52" height="52" className="h-[52px] w-[52px] rounded-xl bg-[#f2f2f2] object-cover mb-7" />
          <h2 className="text-[34px] sm:text-[52px] leading-[1] text-[#111] mb-8 max-w-[760px]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            80+ projects. <span className="text-[#ff4306]">Countless sparks.</span>
          </h2>
          <p className="text-[15px] leading-[1.5] text-[#111] max-w-[370px]" style={{ fontWeight: 500 }}>
            I'm Salome, senior product designer & art director in Tbilisi. I turn the small signals and habits we often miss into ideas that create real business impact.
          </p>
          <p className="mt-5 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[370px]">
            Work across fintech, logistics, edtech, retail, healthcare and hospitality. Top-Rated Plus on Upwork.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <CtaLink book>Book a call</CtaLink>
            <Link to="/contact" className="text-[14px] text-[#6f6f6f] hover:text-[#111] transition-colors">or send a message</Link>
          </div>
          <div className="mt-5 flex items-center gap-2 text-[13px] text-[#6f6f6f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> Available for new projects
          </div>
        </Reveal>
      </section>

      <LogoStrip logos={clients} paused={paused} />

      {/* Selected work */}
      <section aria-labelledby="work-title" className="px-1.5 pt-24 sm:pt-32">
        <h2 id="work-title" className="sr-only">Selected work</h2>
        <div className="columns-1 md:columns-2 xl:columns-3 gap-x-1.5">
          {left.flatMap((n, i) => [n, right[i]]).filter(Boolean).map((n, i) => (
            <div key={i} className="break-inside-avoid"><Tile>{n}</Tile></div>
          ))}
        </div>
      </section>

      {/* Spotlights */}
      <section aria-labelledby="spot-title" className="px-1.5 pt-16">
        <h2 id="spot-title" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">Spotlights of 2025</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {spotlights.map((s) => (
            <Reveal key={s.title}>
              <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
                <FadeImg src={s.img} alt={s.title} className="block w-full h-auto" />
              </div>
              <Caption title={s.title} sub={s.desc} tag={s.tag} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="px-5 pt-24 flex flex-col items-center text-center">
        <p className="text-[15px] leading-[1.5] text-[#111] max-w-[360px]" style={{ fontWeight: 500 }}>
          If you want to spark ideas that turn into business value, let's do it together.
        </p>
        <div className="mt-8"><CtaLink book>Book a call</CtaLink></div>
      </section>
    </>
  );
}
