import { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router';
import { HomeSEO, ServicesSEO, ContactSEO, UxUiSEO, SocialMediaAdsSEO, SocialMediaMotionSEO } from '../components/seo';
import { useActiveSection } from '../components/active-section-context';
import { BakedShell } from './shell';
import { HomeContent } from './home';
import { useI18n } from './i18n';
// the case-study grid (/work/case-studies, /work/ux-ui) is its own chunk, so the
// home page and the others do not wait for it; it is fetched in the background
// once a page has loaded, so moving between pages never waits for it either
const CaseStudiesContent = lazy(() => import('./case-studies').then((m) => ({ default: m.CaseStudiesContent })));
// the same for the work index, services, contact, ads and motion pages: the home
// page carries none of their code (each page's own chunk is preloaded with its HTML)
const WorkContent = lazy(() => import('./work').then((m) => ({ default: m.WorkContent })));
const ServicesContent = lazy(() => import('./pages').then((m) => ({ default: m.ServicesContent })));
const ContactContent = lazy(() => import('./pages').then((m) => ({ default: m.ContactContent })));
const AdsContent = lazy(() => import('./pages').then((m) => ({ default: m.AdsContent })));
const MotionContent = lazy(() => import('./pages').then((m) => ({ default: m.MotionContent })));
import { SEO } from '../components/seo';

/**
 * Home, the three work pages, services and contact. One module so a visit
 * between them never waits on another download.
 */
export function BakedPage() {
  const { bare: pathname } = useI18n();
  const { category } = useParams<{ category?: string }>();
  const { setActiveSection } = useActiveSection();

  const section =
    pathname === '/contact' ? 'contact'
    : pathname === '/services' ? 'services'
    : pathname === '/work' ? 'work'
    : category === 'ux-ui' || category === 'case-studies' || category === 'social-media-ads' || category === 'social-media-motion' ? category
    : 'home';

  useEffect(() => { setActiveSection(section); }, [section, setActiveSection]);

  useEffect(() => {
    // after the page has loaded and settled, fetch the other pages' chunks quietly
    const go = () => { void import('./case-studies'); void import('./home-rest'); void import('./work'); void import('./pages'); };
    const later = () => window.setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 4000 }) : go()), 3000);
    if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });
    return () => window.removeEventListener('load', later);
  }, []);

  const [seo, content] =
    section === 'contact' ? [<ContactSEO />, <Suspense fallback={null}><ContactContent /></Suspense>]
    : section === 'services' ? [<ServicesSEO />, <Suspense fallback={null}><ServicesContent /></Suspense>]
    : section === 'work' ? [<SEO title="Work" description="Salome Mosiava's work by category: UX/UI, branding, social media ads and motion." />, <Suspense fallback={null}><WorkContent /></Suspense>]
    : section === 'ux-ui' ? [<UxUiSEO />, <Suspense fallback={null}><CaseStudiesContent initialTag="UX/UI" /></Suspense>]
    : section === 'case-studies' ? [<SEO title="Case Studies" description="Branding and campaign case studies by Salome Mosiava, each told as one story: the brief, the idea, the work." />, <Suspense fallback={null}><CaseStudiesContent /></Suspense>]
    : section === 'social-media-ads' ? [<SocialMediaAdsSEO />, <Suspense fallback={null}><AdsContent /></Suspense>]
    : section === 'social-media-motion' ? [<SocialMediaMotionSEO />, <Suspense fallback={null}><MotionContent /></Suspense>]
    : [<HomeSEO />, <HomeContent />];

  return (
    <BakedShell>
      {seo}
      <div key={section}>{content}</div>
    </BakedShell>
  );
}
