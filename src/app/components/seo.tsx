import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';

interface SEOProps {
  title?: string;
  rawTitle?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Salome Mosiava';
const BASE_URL = 'https://samole.ge';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1778246294/hero_boli7m.jpg';
const DEFAULT_DESCRIPTION =
  'Salome Mosiava is a Senior Product Designer and Art Director based in Tbilisi, Georgia. Specializing in UX/UI, social media art direction, and motion design. Top-Rated Plus on Upwork.';

export function SEO({
  title,
  rawTitle,
  description = DEFAULT_DESCRIPTION,
  keywords = 'Salome Mosiava, product designer, art director, UX design, UI design, social media design, motion design, Tbilisi, Georgia, portfolio',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}: SEOProps) {
  const { pathname } = useLocation();
  const pageTitle = rawTitle ?? (title ? `${title} — ${SITE_NAME}` : SITE_NAME);
  const fullUrl = `${BASE_URL}${pathname}`;
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: fullUrl,
    mainEntity: {
      '@type': 'Person',
      name: 'Salome Mosiava',
      jobTitle: 'Art Director & Senior Product Designer',
      url: BASE_URL,
      description:
        'Senior Product Designer and Art Director based in Tbilisi, Georgia. Specializing in UX/UI design, social media art direction, and motion design.',
      sameAs: [
        'https://www.instagram.com/areuli.design/',
        'https://www.behance.net/samole',
        'https://www.upwork.com/freelancers/~0163986e2d8967d783',
        'https://www.linkedin.com/in/samole',
      ],
      knowsAbout: [
        'UX Design',
        'UI Design',
        'Art Direction',
        'Motion Design',
        'Design Systems',
        'Social Media Design',
      ],
    },
  };

  return (
    <Helmet>
      {/* ─── Primary Meta ─────────────────────────────────── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Salome Mosiava" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* ─── Open Graph ────────────────────────────────────── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* ─── Twitter Card ──────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* ─── Preconnect ─────────────────────────────────────── */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* ─── Theme ─────────────────────────────────────────── */}
      <meta name="theme-color" content="#0a0a0c" />
      <meta name="color-scheme" content="dark" />

      {/* ─── JSON-LD ───────────────────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  Pre-built SEO configs for each page                          */
/* ═══════════════════════════════════════════════════════════════ */

export function HomeSEO() {
  return (
    <SEO
      rawTitle="Salome Mosiava — Art Director & Senior Product Designer"
      description="Salome Mosiava is a Senior Product Designer and Art Director based in Tbilisi, Georgia. Specializing in UX/UI, social media art direction, and motion design. Top-Rated Plus on Upwork."
      keywords="Salome Mosiava, art director, senior product designer, UX/UI design, social media design, motion design, Tbilisi, Georgia, portfolio, Upwork"
    />
  );
}

export function ServicesSEO() {
  return (
    <SEO
      title="Services"
      description="Design services by Salome Mosiava — UX/UI product design, art direction, social media visual design, motion graphics, and brand identity for startups and enterprises."
      keywords="design services, UX/UI design services, art direction, social media design, motion graphics, Salome Mosiava"
    />
  );
}

export function ContactSEO() {
  return (
    <SEO
      title="Contact"
      description="Get in touch with Salome Mosiava for freelance projects, collaborations, and full-time opportunities in design and art direction."
      keywords="contact Salome Mosiava, hire designer, freelance UX designer, art director for hire"
    />
  );
}

export function UxUiSEO() {
  return (
    <SEO
      title="UX/UI Design"
      description="UX/UI design case studies by Salome Mosiava — including AURUM crypto exchange platform (196 screens) and SCHENKER enterprise logistics platform."
      keywords="UX/UI design, product design case studies, AURUM crypto exchange, SCHENKER logistics, Salome Mosiava"
      image="https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773344688/aurum_og_xkrwdx.jpg"
    />
  );
}

export function SocialMediaAdsSEO() {
  return (
    <SEO
      title="Social Media Ads"
      description="Social media advertising and visual campaigns by Salome Mosiava. Clients include Terminal, Mardi Holding, Crystal Leasing, Gino Aquapark, Carmall, Scope, and more."
      keywords="social media ads, visual campaigns, art direction, Terminal, Mardi, Crystal Leasing, Carmall, Salome Mosiava"
      image="https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773344688/WhatsApp_Image_2026-03-08_at_14.44.08_xkrwdx.jpg"
    />
  );
}

export function SocialMediaMotionSEO() {
  return (
    <SEO
      title="Motion Design"
      description="Motion design and animated social media content by Salome Mosiava. Logo reveals, social media reels, and brand animation for Carmall, Scope, Saloni Furniture, and more."
      keywords="motion design, animation, social media motion, logo reveals, brand animation, Salome Mosiava"
      image="https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/%E1%83%AF%E1%83%98%E1%83%9C%E1%83%9D_%E1%83%90%E1%83%99%E1%83%95%E1%83%90%E1%83%9E%E1%83%90%E1%83%A0%E1%83%99%E1%83%98_r3am9r.webp"
    />
  );
}

export function AurumSEO() {
  return (
    <SEO
      title="AURUM Crypto Exchange — Case Study"
      description="AURUM crypto exchange platform case study: 196 screens, 64+ components, comprehensive design system. Simplifying cryptocurrency trading for the Georgian market with trust-first UX."
      keywords="AURUM, crypto exchange, UX case study, cryptocurrency platform, Georgian fintech, design system, dark UI, product design"
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'AURUM — Crypto Exchange Platform Case Study',
        description:
          'Complete UX/UI case study for AURUM cryptocurrency exchange. 196 screens across web and mobile, 64+ reusable components, and a comprehensive design system.',
        author: { '@type': 'Person', name: 'Salome Mosiava', url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'Salome Mosiava Portfolio', url: BASE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/projects/aurum` },
        keywords: 'crypto exchange, UX design, fintech, design system, dark UI',
        articleSection: 'Case Study',
        about: {
          '@type': 'SoftwareApplication',
          name: 'AURUM',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web, Mobile',
        },
      }}
    />
  );
}

export function SchenkerSEO() {
  return (
    <SEO
      title="SCHENKER Logistics Platform — Case Study"
      description="SCHENKER logistics platform case study: enterprise-grade shipment management, document workflows, and API integration. Streamlining logistics operations with intuitive UX."
      keywords="SCHENKER, logistics platform, UX case study, shipment management, enterprise design, document workflows, API integration, product design"
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'SCHENKER — Logistics Platform Case Study',
        description:
          'Complete UX/UI case study for SCHENKER logistics platform. Enterprise shipment management, document workflows, and seamless API integration.',
        author: { '@type': 'Person', name: 'Salome Mosiava', url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'Salome Mosiava Portfolio', url: BASE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/projects/schenker` },
        keywords: 'logistics, enterprise UX, shipment management, document workflows',
        articleSection: 'Case Study',
        about: {
          '@type': 'SoftwareApplication',
          name: 'SCHENKER Logistics Platform',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
        },
      }}
    />
  );
}

export function UnispaceSEO() {
  return (
    <SEO
      title="Unispace — Student Management Platform Case Study"
      description="Unispace case study: multi-role EdTech platform for Unilab / Ilia State University. 42+ screens, 38+ components, conditional form system, three user roles — student, lecturer, admin."
      keywords="Unispace, EdTech, student management, UX case study, multi-role platform, Unilab, Ilia State University, internal SaaS, Figma, product design"
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Unispace — Student Management Platform Case Study',
        description:
          'Complete UX/UI case study for Unispace, an internal platform for Unilab at Ilia State University. 42+ screens across 3 user roles, 38+ components, conditional form logic, and full developer handoff.',
        author: { '@type': 'Person', name: 'Salome Mosiava', url: BASE_URL },
        publisher: { '@type': 'Organization', name: 'Salome Mosiava Portfolio', url: BASE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/projects/unispace` },
        keywords: 'EdTech, multi-role UX, student management, design system, internal SaaS',
        articleSection: 'Case Study',
        about: {
          '@type': 'SoftwareApplication',
          name: 'Unispace',
          applicationCategory: 'EducationApplication',
          operatingSystem: 'Web',
        },
      }}
    />
  );
}
