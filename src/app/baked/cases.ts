/*
 * The three UX/UI case studies, as data for the white case layout.
 * Text and screens are carried over from the previous dark case pages.
 */

export type CaseScreen = { title: string; desc: string; src: string };
export type CaseCard = { title: string; desc: string };
export type CaseList = { title: string; items: string[] };

export type CaseStudy = {
  slug: 'aurum' | 'schenker' | 'unispace';
  path: string;
  title: string;
  subtitle: string;
  year: string;
  /** Brand colour of the product, used sparingly as its accent */
  accent: string;
  /** Background of the screenshot stages */
  stage: string;
  intro: string[];
  meta: { label: string; value: string }[];
  stats: { num: string; label: string }[];
  hero: string;
  story: { label: string; text: string }[];
  screens: CaseScreen[];
  cardsTitle: string;
  cardsIntro?: string;
  cards: CaseCard[];
  lists?: CaseList[];
  extra?: { title: string; text: string; src?: string };
  outcomeTitle: string;
  outcome: string;
  outcomeCards?: CaseCard[];
};

const C = 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto';

export const CASES: CaseStudy[] = [
  {
    slug: 'aurum',
    path: '/projects/aurum',
    title: 'AURUM',
    subtitle: 'Crypto exchange platform',
    year: '2025',
    accent: '#D59A04',
    stage: 'linear-gradient(160deg,#16130b,#0b0b0f 70%)',
    intro: [
      'AURUM is a full-featured cryptocurrency exchange platform designed to make digital asset trading accessible, secure, and visually refined. The platform encompasses everything from onboarding and KYC verification to real-time trading, portfolio management, and peer-to-peer transfers.',
      'Every interaction was carefully crafted to reduce friction and build trust, transforming complex financial operations into intuitive, confidence-inspiring experiences.',
    ],
    meta: [
      { label: 'Client', value: 'AURUM' },
      { label: 'Role', value: 'Lead UX/UI Designer' },
      { label: 'Platform', value: 'Web & Mobile' },
      { label: 'Industry', value: 'FinTech / Crypto' },
      { label: 'Tools', value: 'Figma, Protopie' },
    ],
    stats: [
      { num: '196', label: 'Screens' },
      { num: '64+', label: 'Components' },
      { num: '12', label: 'Weeks' },
      { num: '2', label: 'Platforms' },
    ],
    hero: `${C}/v1774048886/470258954933ae7f3b3615ad0fe2098ae46160f5_2_wvsmro.webp`,
    story: [
      { label: 'Hook', text: 'What if crypto trading could feel as simple as sending a message, secure, fast, and beautiful?' },
      { label: 'Challenge', text: 'Existing crypto platforms overwhelm users with cluttered dashboards, confusing charts, and intimidating verification flows. New users abandon. Experienced traders settle for poor UX.' },
      { label: 'Approach', text: 'We designed AURUM around progressive disclosure, showing only what matters at each step, with guided onboarding, contextual education, and confidence-building visual feedback.' },
      { label: 'Result', text: '196 screens. 64+ components. Mobile-first responsive design. End-to-end crypto exchange platform covering trading, transfers, verification, and portfolio management.' },
    ],
    screens: [
      { title: 'Home Dark', desc: "The landing experience in dark mode, showcasing the platform's premium aesthetic with gold accents, clean typography, and inviting entry points.", src: `${C}/v1774016538/homedark_zieimk.webp` },
      { title: 'Exchange Dashboard', desc: 'The heart of the platform, real-time market data, trading pairs, order book, and price charts unified in a clean, scannable layout.', src: `${C}/v1774016554/exchange_ggykpz.webp` },
      { title: 'Login', desc: 'Secure entry point with clean form design, trust-building visual indicators, and a clear path to account creation.', src: `${C}/v1774016548/login-_au5gne.webp` },
      { title: 'Authentication', desc: '2FA verification flow with biometric options and step-by-step guidance that makes security feel effortless and trustworthy.', src: `${C}/v1774016553/authentication_r7las2.webp` },
      { title: 'QR Transfer', desc: 'Instant peer-to-peer transfers via QR code scanning, making crypto transfers as simple as sharing a photo.', src: `${C}/v1774016553/qr_vsfslb.webp` },
      { title: 'Profile', desc: 'Account overview with verification status, balances and quick access to every money flow.', src: `${C}/v1774040904/259c40c789033b795135eecd13ffa040e408d1d8_g0b0ks.webp` },
      { title: 'Landing', desc: 'The public entry to the exchange, built to earn trust before the first sign-up.', src: `${C}/v1774040819/33bde90ba43fe3b089e907b814ef1018193651cd_hptwri.webp` },
    ],
    cardsTitle: 'Trust, engineered into every touchpoint',
    cardsIntro: 'In crypto, trust is earned pixel by pixel. Every design decision reinforces security, clarity, and user confidence.',
    cards: [
      { title: 'Security first', desc: 'Trust indicators everywhere.' },
      { title: 'Progressive disclosure', desc: 'Show only what matters.' },
      { title: 'Mobile native', desc: 'Touch-optimized interactions.' },
      { title: 'Speed', desc: 'Instant visual feedback.' },
    ],
    extra: {
      title: 'Design system',
      text: 'A comprehensive design system built for scale, 8 semantic color tokens, 2 typeface families, a spatial rhythm, and 64+ reusable components powering all 196 screens.',
      src: `${C}/v1773321666/aurumn_design_iap0vm.png`,
    },
    outcomeTitle: 'A premium experience',
    outcome: "AURUM proves that financial products don't have to sacrifice beauty for functionality. By combining thoughtful UX research, a comprehensive design system, and pixel-perfect execution, we created a platform that makes crypto trading feel premium, secure, and accessible.",
  },
  {
    slug: 'schenker',
    path: '/projects/schenker',
    title: 'Schenker',
    subtitle: 'Logistics platform',
    year: '2025',
    accent: '#6B8E23',
    stage: 'linear-gradient(160deg,#e8ecd8,#d4dab8)',
    intro: [
      'SCHENKER is a desktop shipping management platform built for operational logistics tasks. The system brings together shipment creation, sender and receiver data, package setup, labels and tracking, packing lists, waybills, settings, and technical tools inside one workflow.',
      'The goal was to make this complexity feel clear, structured, and manageable in daily use, a product built for real operations, not just presentation.',
    ],
    meta: [
      { label: 'Client', value: 'DB Schenker' },
      { label: 'Role', value: 'UX/UI Designer' },
      { label: 'Platform', value: 'Desktop app' },
      { label: 'Industry', value: 'Enterprise logistics' },
      { label: 'Tools', value: 'Figma' },
    ],
    stats: [
      { num: '7', label: 'Product areas' },
      { num: '4', label: 'Shipment steps' },
      { num: '3', label: 'Document types' },
      { num: '1', label: 'Design language' },
    ],
    hero: `${C}/v1774018719/Sendung-Empfa%CC%88nger_rkbeci.png`,
    story: [
      { label: 'Hook', text: 'What if enterprise logistics software could feel intuitive, not like a spreadsheet with buttons?' },
      { label: 'Challenge', text: "Schenker's internal tools drowned operators in form complexity, scattered workflows, and inconsistent UI patterns. Training costs soared. Error rates climbed." },
      { label: 'Approach', text: 'We unified shipment creation, label management, and settings into one coherent design language, progressive disclosure over cognitive overload.' },
      { label: 'Result', text: 'Desktop-first enterprise platform. Streamlined multi-step forms. Contextual help system. One design system for the entire logistics workflow.' },
    ],
    screens: [
      { title: 'Sendung, Empfänger', desc: 'Receiver data entry with structured form fields for address, contact info, and shipment details.', src: `${C}/v1774017032/Sendung-Empfa%CC%88nger_fuype4.webp` },
      { title: 'Sendung, Informationen', desc: 'Shipment settings with delivery options, notification toggles, and transport notes.', src: `${C}/v1774017032/Sendung-Informationen_zumtpf.webp` },
      { title: 'Sendung, Pakete', desc: 'Package management with dimensions, weight, volume, and pallet configuration.', src: `${C}/v1774017030/Sendung-Pakete_qo2biq.webp` },
      { title: 'Labels & Tracking', desc: 'Label generation and tracking URL management with tabular shipment list view.', src: `${C}/v1774018698/Labels_und_Tracking_qetlrm.png` },
      { title: 'Einstellungen', desc: 'Workstation settings with printer configuration, API setup, and license management.', src: `${C}/v1774018694/Einstellungen_huzhr5.png` },
      { title: 'Entwickler, API-Schlüssel', desc: 'API key management with webhook configuration for developer integration.', src: `${C}/v1774018734/Entwickler_vekdwm.png` },
    ],
    cardsTitle: 'From friction to flow',
    cardsIntro: 'Enterprise logistics systems become difficult to use because they combine many repetitive, detail-heavy tasks in one place. Four principles kept that complexity under control.',
    cards: [
      { title: 'Modular structure', desc: 'Seven product areas, shipments, labels, packing lists, waybills, settings, help and developer tools, each a focused module.' },
      { title: 'Step-based creation', desc: 'Instead of placing everything on one screen, the flow is divided into clear steps that reduce cognitive load and make complex data entry easier to complete.' },
      { title: 'Every module, one language', desc: 'From shipment data to technical settings, each screen follows the same design language with consistent spacing, layout, and interaction patterns.' },
      { title: 'Structured documents', desc: 'Labels, packing lists, and waybills rely on structured table views that support quick review, editing, downloading, and deletion.' },
    ],
    lists: [
      { title: 'Shipment flow', items: [
        'Sendungsdaten & Informationen, delivery options, notification toggles (SMS, email, driver notifications), and transport remarks.',
        'Versender & Empfänger, sender and receiver each have their own focused step, with company, address, email, and phone fields separated for clarity and fewer mistakes.',
        'Pakete & Paletten, package details as a separate operational layer: dimensions, quantity, weight, volume, and packaging type without mixing with contact data.',
      ] },
    ],
    outcomeTitle: 'A clearer working interface',
    outcome: 'By breaking complex workflows into focused modules and step-based screens, the platform becomes easier to navigate, easier to complete, and more useful in real working conditions. Its strength comes from structure, not excess.',
  },
  {
    slug: 'unispace',
    path: '/projects/unispace',
    title: 'Unispace',
    subtitle: 'Student management platform',
    year: '2024',
    accent: '#3D82F6',
    stage: 'linear-gradient(160deg,#dfe6ff,#eef1ff)',
    intro: [
      'Unispace is a closed internal work system for Unilab, the Innovative Technologies Cyber Laboratory of Ilia State University. The platform allows students to register, track projects, build a public portfolio, and apply for competitions. Lecturers manage courses; admins control the entire ecosystem.',
      "The core complexity: three completely different user journeys, student, lecturer, admin, sharing a single design language. Every screen had to serve its user without bleeding into another role's context.",
    ],
    meta: [
      { label: 'Client', value: 'Unilab / Ilia State Uni.' },
      { label: 'Role', value: 'Lead UX/UI Designer' },
      { label: 'Platform', value: 'Web (responsive)' },
      { label: 'Industry', value: 'EdTech / Internal SaaS' },
      { label: 'Tools', value: 'Figma · Prototyping' },
    ],
    stats: [
      { num: '3', label: 'User roles' },
      { num: '12', label: 'Weeks' },
      { num: '42+', label: 'Screens' },
      { num: '38+', label: 'Components' },
    ],
    hero: `${C}/v1779875718/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98_%E1%83%92%E1%83%95%E1%83%94%E1%83%A0%E1%83%93%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A8%E1%83%94%E1%83%A1%E1%83%95%E1%83%9A%E1%83%98%E1%83%A1%E1%83%90%E1%83%A1_uaosn1.png`,
    story: [
      { label: 'Hook', text: 'What if a single platform could serve three completely different users, student, lecturer, admin, without ever making any of them feel like a secondary thought?' },
      { label: 'Challenge', text: 'Managing a university lab meant juggling spreadsheets, email chains, and disconnected tools. Students had no visibility, lecturers had no control, and admins had no oversight, all at once.' },
      { label: 'Approach', text: "We designed Unispace around role-based clarity, one login, one design language, three distinct realities. No compromises, no role confusion, no 'which account is mine?'" },
      { label: 'Result', text: '42+ screens, 38+ components, and a conditional form system that guided 17 edge cases without a single multi-step wizard, all delivered in 12 weeks.' },
    ],
    screens: [
      { title: 'Login', desc: 'The first screen every user sees, one entry point for students, lecturers and admins.', src: `${C}/v1779875718/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98_%E1%83%92%E1%83%95%E1%83%94%E1%83%A0%E1%83%93%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A8%E1%83%94%E1%83%A1%E1%83%95%E1%83%9A%E1%83%98%E1%83%A1%E1%83%90%E1%83%A1_uaosn1.png` },
      { title: 'Registration, conditional logic', desc: '12 base fields → 4 status paths → 0–5 conditional fields, in one unified form pattern. Shown here with validation errors.', src: `${C}/v1779875712/%E1%83%90%E1%83%AE%E1%83%90%E1%83%9A%E1%83%98_%E1%83%9B%E1%83%9D%E1%83%9B%E1%83%AE%E1%83%9B%E1%83%90%E1%83%A0%E1%83%94%E1%83%91%E1%83%9A%E1%83%98%E1%83%A1_%E1%83%A0%E1%83%94%E1%83%92%E1%83%98%E1%83%A1%E1%83%A2%E1%83%A0%E1%83%90%E1%83%AA%E1%83%98%E1%83%90-%E1%83%A1%E1%83%A2%E1%83%A3%E1%83%93%E1%83%94%E1%83%9C%E1%83%A2%E1%83%98_error_vhhyi0.png` },
      { title: 'Submitted forms', desc: 'Admin table of submissions with status pills and left-edge row indicators.', src: `${C}/v1779875712/%E1%83%A8%E1%83%94%E1%83%95%E1%83%A1%E1%83%94%E1%83%91%E1%83%A3%E1%83%9A%E1%83%98_%E1%83%A4%E1%83%9D%E1%83%A0%E1%83%9B%E1%83%94%E1%83%91%E1%83%98%E1%83%A1_%E1%83%AA%E1%83%AE%E1%83%A0%E1%83%98%E1%83%9A%E1%83%98_jtudqc.png` },
      { title: 'Project upload', desc: 'Students add projects to their cabinet and public portfolio.', src: `${C}/v1779875711/%E1%83%9E%E1%83%A0%E1%83%9D%E1%83%94%E1%83%A5%E1%83%A2%E1%83%98%E1%83%A1_%E1%83%90%E1%83%A2%E1%83%95%E1%83%98%E1%83%A0%E1%83%97%E1%83%95%E1%83%90_3_ewqkdw.png` },
    ],
    cardsTitle: 'Why we made the choices we made',
    cards: [
      { title: 'Conditional fields, same page, not a wizard', desc: "Splitting status-specific fields into a separate step would create unnecessary friction at a critical drop-off point. Same-page expansion keeps the user grounded and avoids 'where am I?' confusion across 4 possible paths." },
      { title: 'Dark mode as default for internal tools', desc: "Unispace is used for hours at a time. Dark mode reduces eye fatigue, aligns with Unilab's engineering brand, and makes the blue accent significantly more impactful." },
      { title: 'Countdown timer with a parallel manual CTA', desc: "After verification, a visible 5s countdown shows something is happening; the manual button preserves agency for those who don't want to wait." },
      { title: 'Certificate, visible, disabled, explained', desc: 'Showing the button as disabled with a clear tooltip sets correct expectations instead of hiding the feature entirely.' },
      { title: 'Portfolio as a dedicated public route', desc: 'The portfolio serves employers and clients, not platform users, so it was designed from scratch for first-impression clarity: no nav, no login prompts.' },
      { title: 'Region → city cascade dropdown', desc: 'Filtering cities by region cuts a 70+ item list to 3–12 items and selection time by an estimated 60%.' },
    ],
    lists: [
      { title: 'Process · 12 weeks', items: [
        'Discover, stakeholder interviews (4 sessions), competitive audit, technical spec analysis, user role mapping, 17 edge cases documented.',
        'Define, 3 role-specific IA maps, 9 user flows, conditional form logic matrix, 12 states per key screen.',
        'Design, 42 screens across 3 roles, dark design system with 38+ components, responsive at 1440 / 768 / 375px.',
        'Deliver, usability testing with 8 participants in 2 rounds, 11 of 14 issues resolved before handoff, annotated Figma handoff and design QA with engineering.',
      ] },
      { title: 'Code-literate design, built for handoff', items: [
        '1:1 component mapping, every Figma component had a planned React equivalent.',
        'Tailwind-aligned tokens, spacing, color and radius mirrored Tailwind defaults.',
        'HTML/CSS in handoff, real CSS snippets for focus rings, transitions and hover states.',
        'Daily 15-min syncs with engineering during weeks 5–10.',
      ] },
    ],
    outcomeTitle: 'Delivered, tested, live',
    outcome: 'Unispace launched as an active internal platform for Unilab students and staff. All three user roles went live with complete flows, tested with real users before handoff, with ~60% fewer handoff clarification tickets and zero design-QA issues on form components after launch.',
    outcomeCards: [
      { title: 'What worked', desc: 'Same-page conditional disclosure kept users oriented; building the component library in parallel with screens saved rework; early edge-case documentation prevented last-minute surprises.' },
      { title: "What I'd do differently", desc: 'Run usability testing in week 5 instead of 11, design mobile-first, involve an admin user earlier, and write a motion spec alongside the component library.' },
    ],
  },
];

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug)!;
