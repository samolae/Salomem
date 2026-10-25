import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { CaseLink } from '../components/case-transition';
import { IMG } from '../lib/cld';
import { HeroCanvas } from './hero-canvas';
import { useMotionPause } from './shell';
import { AreuliBlock, Caption, CtaLink, FadeImg, LogoStrip, Reveal, T } from './ui';
import { clients, experiences, spotlights, spotlightsKa } from './content';
import { useI18n } from './i18n';
import { FoldingCards } from './flourish';
import {
  adsBrands, adsCarmall1, adsGino4, adsTerminal1, screenAurumMainHQ, schenkerSendung, unispaceLogin,
} from './data';

const AVATAR = '/avatar.jpg';

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
  const { tx, to, ka } = useI18n();
  const fitmeal = adsBrands[0];
  const brandCount = adsBrands.length;
  const caseTag = tx('Case study', 'ქეისი');
  const adsTag = tx('Ads', 'რეკლამა');

  const left: ReactNode[] = [
    <CaseLink key="aurum" to="/projects/aurum" cardId="home-aurum" className="group block">
      <ScreenStage src={screenAurumMainHQ} bg="linear-gradient(160deg,#16130b,#0b0b0f 70%)" alt="AURUM crypto exchange dashboard" eager />
      <Caption title="AURUM" sub={tx('Crypto exchange · 196 screens, 64+ components', 'კრიპტოგაცვლა · 196 ეკრანი, 64+ კომპონენტი')} tag={caseTag} />
    </CaseLink>,
    <Link key="motion" to={to('/work/social-media-motion')} className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2] aspect-[9/16]">
        <video
          src="https://res.cloudinary.com/dgfn598qb/video/upload/f_auto,q_auto/carmall-ne_1_u5ewuz.mp4"
          autoPlay={!paused} loop muted playsInline preload="metadata"
          ref={(v) => { if (v) { paused ? v.pause() : v.play().catch(() => {}); } }}
          className="block w-full h-full object-cover"
        />
      </div>
      <Caption
        title={tx('Social Media Motion', 'სოც. მედიის მოუშენი')}
        sub={tx('Reels and brand animations for Carmall, Saloni and more', 'რილსები და ბრენდის ანიმაციები Carmall-ისთვის, Saloni-სთვის და სხვებისთვის')}
        tag={tx('12 reels', '12 რილსი')}
      />
    </Link>,
    <div key="about" className="rounded-md bg-[#f2f2f2] px-6 py-14 sm:px-12 sm:py-20 mb-5 text-center">
      <p className="text-[15px] leading-[1.55] text-[#111] max-w-[440px] mx-auto">
        {tx(
          'At Scope we started from zero. In under two years I helped grow the team, led design leads, worked with 50+ businesses and managed $70,000+ in monthly ad spend.',
          'Scope-ში ნულიდან დავიწყეთ. ორ წელზე ნაკლებ დროში გუნდის ზრდაში მივიღე მონაწილეობა, ვხელმძღვანელობდი დიზაინის ლიდებს, ვიმუშავე 50+ ბიზნესთან და ვმართავდი თვეში $70,000+ სარეკლამო ბიუჯეტს.',
        )}
      </p>
      <div className="mt-5 flex items-center justify-center gap-2 text-[14px] text-[#6f6f6f]">
        <img {...IMG.logo(experiences[2].logo)} alt="" width="24" height="24" className="h-6 w-6 rounded-full object-cover" />
        {tx('Art Director, Scope', 'არტ დირექტორი, Scope')}
      </div>
    </div>,
    <Link key="fitmeal" to={to('/work/social-media-ads')} className="group block">
      <div className="grid grid-cols-2 gap-1.5 items-start">
        {fitmeal.items.slice(0, 4).map((it, i) => (
          <div key={i} className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
            <FadeImg src={it.src} sizes="tile" className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
        ))}
      </div>
      <Caption title="FitMeal" sub={tx('AI content for social', 'AI კონტენტი სოციალური მედიისთვის')} tag={adsTag} />
    </Link>,
    <CaseLink key="unispace" to="/projects/unispace" cardId="home-unispace" className="group block">
      <ScreenStage src={unispaceLogin} bg="linear-gradient(160deg,#dfe6ff,#eef1ff)" alt="Unispace student management platform" />
      <Caption title="Unispace" sub={tx('Student management · multi-role EdTech', 'სტუდენტების მართვა · მრავალროლიანი EdTech')} tag={caseTag} />
    </CaseLink>,
  ];

  const dasturi: ReactNode = (
    <CaseLink key="dasturi" to="/projects/dasturi" cardId="home-dasturi" className="group block">
      <div className="overflow-hidden rounded-md bg-[#191A17]">
        <img src="/cases/dasturi/lineup-1000.jpg" srcSet="/cases/dasturi/lineup-1000.jpg 1000w, /cases/dasturi/lineup.jpg 2000w" sizes="(min-width: 768px) 50vw, 96vw"
          alt="Dasturi wine bottles, five varietals" width="2000" height="1324" loading="lazy" decoding="async"
          className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
      </div>
      <Caption title="Dasturi" sub={tx('Wine brand identity · logo, labels, packaging', 'ღვინის ბრენდის იდენტობა · ლოგო, ეტიკეტები, შეფუთვა')} tag={tx('Case study', 'ქეისი')} />
    </CaseLink>
  );

  const right: ReactNode[] = [
    <Link key="ads" to={to('/work/social-media-ads')} className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsTerminal1} eager className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Terminal social media ads" />
      </div>
      <Caption
        title={tx('Social Media Ads', 'სოც. მედიის რეკლამა')}
        sub={tx(
          `Campaigns for Terminal, Mardi, Crystal Leasing and ${brandCount - 3} more`,
          `კამპანიები Terminal-ისთვის, Mardi-სთვის, Crystal Leasing-ისთვის და კიდევ ${brandCount - 3} ბრენდისთვის`,
        )}
        tag={tx(`${brandCount} brands`, `${brandCount} ბრენდი`)}
      />
    </Link>,
    <CaseLink key="schenker" to="/projects/schenker" cardId="home-schenker" className="group block">
      <ScreenStage src={schenkerSendung} bg="linear-gradient(160deg,#e8ecd8,#d4dab8)" alt="Schenker shipment form" />
      <Caption title="Schenker" sub={tx('Enterprise logistics · form systems & tracking', 'კორპორატიული ლოჯისტიკა · ფორმების სისტემა და თრექინგი')} tag={caseTag} />
    </CaseLink>,
    <Link key="carmall" to={to('/work/social-media-ads')} className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsCarmall1} className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Carmall ad" />
      </div>
      <Caption title={ka ? 'ქარმოლი' : 'Carmall'} sub={tx('Campaign visuals', 'კამპანიის ვიზუალები')} tag={adsTag} />
    </Link>,
    <div key="exp" className="rounded-md bg-[#f2f2f2] px-5 py-6 sm:px-7 sm:py-8 mb-5">
      <div className="text-[14px] text-[#6f6f6f] mb-4">{tx('Experience', 'გამოცდილება')}</div>
      <ul className="divide-y divide-[#e4e4e4]">
        {experiences.map((e) => (
          <li key={e.company + e.start} className="flex items-center gap-3 py-2.5 text-[14px]">
            <img {...IMG.logo(e.logo)} alt="" width="24" height="24" className="h-6 w-6 rounded object-cover flex-shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="text-[#111]">{e.company}</span>
              <span className="text-[#6f6f6f]"> · {ka ? e.roleKa : e.role}</span>
            </span>
            <span className="text-[#9a9a9a] whitespace-nowrap tabular-nums hidden sm:inline">
              {ka ? `${e.startKa} – ${e.endKa}` : `${e.start} – ${e.end}`}
            </span>
          </li>
        ))}
      </ul>
    </div>,
    <Link key="gino" to={to('/work/social-media-ads')} className="group block">
      <div className="relative overflow-hidden rounded-md bg-[#f2f2f2]">
        <FadeImg src={adsGino4} className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" alt="Gino Aquapark ad" />
      </div>
      <Caption title={ka ? 'ჯინო აკვაპარკი' : 'Gino Aquapark'} sub={tx('Seasonal campaign', 'სეზონური კამპანია')} tag={adsTag} />
    </Link>,
  ];

  return (
    <>
      <HeroCanvas />

      {/* Intro */}
      <section className="px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          <img src={AVATAR} alt={tx('Salome Mosiava', 'სალომე მოსიავა')} width="52" height="52" className="h-[52px] w-[52px] rounded-xl bg-[#f2f2f2] object-cover mb-7" />
          <h2 className="text-[34px] sm:text-[52px] leading-[1] text-[#111] mb-8 max-w-[860px]" style={{ fontFamily: T.display, fontWeight: 900 }}>
            {tx('80+ projects.', '80+ პროექტი.')} <span className="text-[#ff4306]">{tx('Countless sparks.', 'უთვალავი ნაპერწკალი.')}</span>
          </h2>
          <p className="text-[15px] leading-[1.5] text-[#111] max-w-[390px]" style={{ fontWeight: 500 }}>
            {tx(
              "I'm Salome, senior product designer & art director in Tbilisi. I turn the small signals and habits we often miss into ideas that create real business impact.",
              'მე ვარ სალომე, სენიორ პროდაქტ დიზაინერი და არტ დირექტორი თბილისიდან. პატარა სიგნალებსა და ჩვევებს, რომლებსაც ხშირად ვერ ვამჩნევთ, ვაქცევ იდეებად, რომლებიც ბიზნესს რეალურ შედეგს მოუტანს.',
            )}
          </p>
          <p className="mt-5 text-[15px] leading-[1.5] text-[#6f6f6f] max-w-[390px]">
            {tx(
              'Work across fintech, logistics, edtech, retail, healthcare and hospitality. Top-Rated Plus on Upwork.',
              'ვმუშაობ ფინტექში, ლოჯისტიკაში, განათლებაში, რითეილში, ჯანდაცვასა და სტუმარმასპინძლობაში. Upwork-ზე Top-Rated Plus სტატუსით.',
            )}
          </p>
          <div className="mt-9"><CtaLink /></div>
          <div className="mt-5 flex items-center gap-2 text-[13px] text-[#6f6f6f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /> {tx('Available for new projects', 'ახალი პროექტებისთვის თავისუფალი ვარ')}
          </div>
        </Reveal>
      </section>

      <LogoStrip logos={clients} paused={paused} />

      {/* Selected work */}
      <section aria-labelledby="work-title" className="px-1.5 pt-24 sm:pt-32">
        <h2 id="work-title" className="sr-only">{tx('Selected work', 'რჩეული ნამუშევრები')}</h2>
        <div className="columns-1 md:columns-2 xl:columns-3 gap-x-1.5">
          {[dasturi, ...left.flatMap((n, i) => [n, right[i]])].filter(Boolean).map((n, i) => (
            <div key={i} className="break-inside-avoid"><Tile>{n}</Tile></div>
          ))}
        </div>
      </section>

      {/* Spotlights */}
      <section aria-labelledby="spot-title" className="px-1.5 pt-16">
        <h2 id="spot-title" className="px-0.5 pb-3 text-[14px] text-[#6f6f6f]">{tx('Spotlights of 2025', '2025 წლის მთავარი მომენტები')}</h2>
        <FoldingCards
          label={tx('Spotlights of 2025', '2025 წლის მთავარი მომენტები')}
          items={spotlights.map((s, i) => { const t = ka ? spotlightsKa[i] : s; return { img: s.img, title: t.title, desc: t.desc, tag: t.tag }; })}
        />
      </section>

      {/* areuli.design, Salome's own brand */}
      <section aria-label="areuli.design" className="px-1.5 pt-20">
        <Reveal><AreuliBlock /></Reveal>
      </section>

      {/* Closing */}
      <section className="px-5 pt-24 flex flex-col items-center text-center">
        <p className="text-[15px] leading-[1.5] text-[#111] max-w-[380px]" style={{ fontWeight: 500 }}>
          {tx(
            "If you want to spark ideas that turn into business value, let's do it together.",
            'თუ გინდა იდეები, რომლებიც ბიზნესისთვის ღირებულებად იქცევა, მოდი, ერთად შევქმნათ.',
          )}
        </p>
        <div className="mt-8"><CtaLink /></div>
      </section>
    </>
  );
}
