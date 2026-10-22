import {
  logoScope, logoCubisten, logoSpar, logoUnilab, logoRunwayTeam, logoUpwork,
} from './data';

/* Copy and lists for the redesigned pages. Text is Salome's own, carried
   over from the previous version of the site. */

export const EMAIL = 'mosiavasalome@gmail.com';

export const clients: { name: string; logo: string }[] = [
  { name: 'Terminal', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/terminal_hcftru.webp' },
  { name: 'Mardi Holding', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/mardi_dzhmgm.webp' },
  { name: 'Crystal Leasing', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916798/%E1%83%99%E1%83%A0%E1%83%98%E1%83%A1%E1%83%A2%E1%83%90%E1%83%9A_%E1%83%9A%E1%83%98%E1%83%96%E1%83%98%E1%83%9C%E1%83%92%E1%83%98_xeyoop.webp' },
  { name: 'Gino Aquapark', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/%E1%83%AF%E1%83%98%E1%83%9C%E1%83%9D_%E1%83%90%E1%83%99%E1%83%95%E1%83%90%E1%83%9E%E1%83%90%E1%83%A0%E1%83%99%E1%83%98_r3am9r.webp' },
  { name: 'Carmall', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp' },
  { name: 'Scope', logo: logoScope },
  { name: 'Regus', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917415/regus_nv1pte.webp' },
  { name: 'GTCC', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916799/gtcc_sk1wrg.webp' },
  { name: 'FitMeal', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773917409/fitmeal_bowpri.webp' },
  { name: 'The Khachapuri', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773916800/the_khachapuri_fv6s7a.webp' },
  { name: 'UniLab', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/%E1%83%A3%E1%83%9C%E1%83%98%E1%83%9A%E1%83%90%E1%83%91%E1%83%98_zbfjyi.png' },
  { name: 'Cubisten', logo: logoCubisten },
  { name: 'GCCI', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/georgian_chamber...._ffm4rm.png' },
  { name: 'Modusi', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334357/%E1%83%9B%E1%83%9D%E1%83%93%E1%83%A3%E1%83%A1%E1%83%98_zcltlg.png' },
  { name: 'Gagua Clinic', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334358/gagua_qwqdja.jpg' },
  { name: 'NB Dental', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778347254/nb_dental_qiiahr.jpg' },
  { name: 'Thermocentre', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778334709/%E1%83%97%E1%83%94%E1%83%A0%E1%83%9B%E1%83%9D%E1%83%AA%E1%83%94%E1%83%9C%E1%83%A2%E1%83%A0%E1%83%98_vmkkoc.png' },
  { name: 're:educate', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778354746/re-educate_sioapv.jpg' },
  { name: 'Geolab', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778354745/Geolab_ozodmc.png' },
  { name: 'BTU', logo: 'https://res.cloudinary.com/dgfn598qb/image/upload/v1778354745/BTU_lfezfk.png' },
];

export const experiences = [
  { company: 'RunwayTeam', type: 'Contract', role: 'Visual Designer', start: 'Jan 2026', end: 'Now', logo: logoRunwayTeam },
  { company: 'UniLab', type: 'Part-time', role: 'Head of UI/UX & Graphic Design', start: 'Aug 2024', end: 'Jul 2026', logo: logoUnilab },
  { company: 'Scope', type: 'Full-time', role: 'Art Director', start: 'May 2024', end: 'Dec 2025', logo: logoScope },
  { company: 'Upwork', type: 'Freelance', role: 'Graphic Designer', start: '2021', end: '2024', logo: logoUpwork },
  { company: 'Cubisten', type: 'Full-time', role: 'Graphic Designer → Creative Director', start: 'Jan 2019', end: 'Dec 2024', logo: logoCubisten },
  { company: 'Spar', type: 'Contract', role: 'Graphic Designer', start: '2020', end: '2022', logo: logoSpar },
];

export const spotlights = [
  {
    img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320797/0101_yqkpg2.webp',
    tag: 'Business', title: 'Driving real impact',
    desc: 'At Scope, we started from zero and, in less than two years, grew the team, collaborated with 50+ businesses, and delivered measurable results.',
  },
  {
    img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320796/0202_niubv1.webp',
    tag: 'Education', title: 'After Effects certification',
    desc: 'Expanding skills in motion design and advertising.',
  },
  {
    img: 'https://res.cloudinary.com/dgfn598qb/image/upload/f_auto,q_auto/v1773320797/0303_fz2hzg.webp',
    tag: 'Mentoring', title: 'Mentoring',
    desc: 'Teens, women, and others in design, turning theory into real practice through professional acceleration programs.',
  },
];

export const services = [
  {
    title: 'UX/UI Product Design',
    tagline: 'End-to-end product design from research to pixel-perfect delivery.',
    timeline: '4–12 weeks',
    deliverables: ['User research & interviews', 'Information architecture', 'User flows & wireframes', 'High-fidelity UI design', 'Design system & components', 'Interactive prototypes', 'Developer handoff (Figma)'],
    outcome: 'AURUM — 196 screens, 64+ components shipped',
  },
  {
    title: 'Art Direction',
    tagline: 'Visual strategy and creative direction for brands and campaigns.',
    timeline: '2–6 weeks',
    deliverables: ['Brand visual identity', 'Campaign concept & moodboard', 'Creative direction', 'Visual guidelines', 'Key visual production', 'Art supervision'],
    outcome: 'Scope, Terminal, Carmall — multi-campaign direction',
  },
  {
    title: 'Social Media Design',
    tagline: 'High-impact visuals and campaign assets for social platforms.',
    timeline: 'Ongoing or 1–4 weeks',
    deliverables: ['Static post designs', 'Carousel & story templates', 'Ad creatives (Meta, TikTok)', 'Brand-consistent visual system', 'Copy direction & layouts', 'Monthly content packages'],
    outcome: '10+ brands — Terminal, Mardi, Crystal Leasing, GTCC',
  },
  {
    title: 'Motion Design',
    tagline: 'Animated content that brings brands to life across every platform.',
    timeline: '1–3 weeks',
    deliverables: ['Logo reveals & brand animations', 'Social media reels & stories', 'Animated ad creatives', 'UI micro-interactions', 'Motion style guide'],
    outcome: 'Carmall, Scope, Saloni — reels & brand animations',
  },
];

export const processSteps = [
  { step: '01', title: 'Discovery', desc: 'Align on goals, constraints, and success metrics.' },
  { step: '02', title: 'Design', desc: 'Iterative rounds with regular feedback check-ins.' },
  { step: '03', title: 'Handoff', desc: 'Clean specs, assets, and documentation for devs.' },
  { step: '04', title: 'Support', desc: 'Post-launch refinements and system maintenance.' },
];

export const stats = [
  { num: '80+', label: 'Projects shipped' },
  { num: '50+', label: 'Clients served' },
  { num: '6+', label: 'Years designing' },
  { num: 'Top 3%', label: 'Upwork rating' },
];

export const contactLinks = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, copy: true },
  { label: 'Phone', value: '598 67 14 16', href: 'tel:+995598671416', copy: true },
  { label: 'LinkedIn', value: '@samole', href: 'https://www.linkedin.com/in/samole/', external: true },
  { label: 'Behance', value: '@samole', href: 'https://www.behance.net/samole', external: true },
  { label: 'Instagram', value: '@areuli.design', href: 'https://www.instagram.com/areuli.design/', external: true },
];

export const formOptions = {
  type: ['UX/UI Design', 'Art Direction', 'Social Media', 'Motion Design', 'Other'],
  budget: ['Under ₾500', '₾500–₾2,000', '₾2,000–₾6,000', '₾6,000–₾15,000', '₾15,000+', "Let's discuss"],
  timeline: ['ASAP', 'Within 1 month', '1–3 months', '3+ months', 'Flexible'],
};
