import { useEffect } from 'react';
import { useParams } from 'react-router';
import { HomeSEO, ServicesSEO, ContactSEO, UxUiSEO, SocialMediaAdsSEO, SocialMediaMotionSEO } from '../components/seo';
import { useActiveSection } from '../components/active-section-context';
import { BakedShell } from './shell';
import { HomeContent } from './home';
import { AdsContent, ContactContent, MotionContent, ServicesContent, UxUiContent } from './pages';
import { useI18n } from './i18n';
import { WorkContent } from './work';
import { CaseStudiesContent } from './case-studies';
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

  const [seo, content] =
    section === 'contact' ? [<ContactSEO />, <ContactContent />]
    : section === 'services' ? [<ServicesSEO />, <ServicesContent />]
    : section === 'work' ? [<SEO title="Work" description="Salome Mosiava's work by category: UX/UI, branding, social media ads and motion." />, <WorkContent />]
    : section === 'ux-ui' ? [<UxUiSEO />, <UxUiContent />]
    : section === 'case-studies' ? [<SEO title="Case Studies" description="Branding and campaign case studies by Salome Mosiava, each told as one story: the brief, the idea, the work." />, <CaseStudiesContent />]
    : section === 'social-media-ads' ? [<SocialMediaAdsSEO />, <AdsContent />]
    : section === 'social-media-motion' ? [<SocialMediaMotionSEO />, <MotionContent />]
    : [<HomeSEO />, <HomeContent />];

  return (
    <BakedShell>
      {seo}
      <div key={section}>{content}</div>
    </BakedShell>
  );
}
