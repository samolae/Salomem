import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Salome Mosiava';
const DEFAULT_DESCRIPTION =
  'Award-winning product designer specializing in crypto exchange platforms, logistics systems, and enterprise UX. Case studies include AURUM Crypto Exchange and SCHENKER Logistics Platform.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop';
const BASE_URL = 'https://portfolio.design'; // replace with your real domain

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'product designer, UX design, UI design, crypto exchange, logistics platform, case study, portfolio, AURUM, SCHENKER',
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
  jsonLd,
}: SEOProps) {
  const pageTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const fullUrl = `${BASE_URL}${url}`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: 'Product Designer',
      jobTitle: 'Senior Product Designer',
      knowsAbout: [
        'UX Design',
        'UI Design',
        'Product Design',
        'Design Systems',
        'Crypto Exchange',
        'Logistics Platforms',
      ],
    },
  };

  return (
    <Helmet>
      {/* ─── Primary Meta ─────────────────────────────────── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Product Designer" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* ─── Open Graph (Facebook, LinkedIn) ───────────────── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* ─── Twitter Card ──────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ─── Preconnect for performance ─────────────────────── */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* ─── Theme & Mobile ────────────────────────────────── */}
      <meta name="theme-color" content="#0a0a0c" />
      <meta name="color-scheme" content="dark" />

      {/* ─── JSON-LD Structured Data ───────────────────────── */}
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
      description="Product designer portfolio showcasing award-winning case studies in crypto exchange, logistics platforms, and enterprise UX design. Featuring AURUM and SCHENKER projects."
      url="/"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Product Designer',
          jobTitle: 'Senior Product Designer',
          description:
            'Specializing in crypto exchange platforms, logistics systems, and enterprise UX with Awwwards-level design quality.',
          knowsAbout: ['UX Design', 'UI Design', 'Design Systems', 'Crypto Exchange', 'Logistics'],
        },
      }}
    />
  );
}

export function AurumSEO() {
  return (
    <SEO
      title="AURUM Crypto Exchange — Case Study"
      description="AURUM crypto exchange platform case study: 196 screens, 64+ components, comprehensive design system. Simplifying cryptocurrency trading for the Georgian market with trust-first UX."
      keywords="AURUM, crypto exchange, UX case study, cryptocurrency platform, Georgian fintech, design system, dark UI, product design"
      url="/projects/aurum"
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'AURUM — Crypto Exchange Platform Case Study',
        description:
          'Complete UX/UI case study for AURUM cryptocurrency exchange. 196 screens across web and mobile, 64+ reusable components, and a comprehensive design system.',
        author: {
          '@type': 'Person',
          name: 'Product Designer',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Portfolio',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://portfolio.design/projects/aurum',
        },
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
      url="/projects/schenker"
      type="article"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'SCHENKER — Logistics Platform Case Study',
        description:
          'Complete UX/UI case study for SCHENKER logistics platform. Enterprise shipment management, document workflows, and seamless API integration.',
        author: {
          '@type': 'Person',
          name: 'Product Designer',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Portfolio',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://portfolio.design/projects/schenker',
        },
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