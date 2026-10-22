import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { HomeSEO, ServicesSEO, ContactSEO, UxUiSEO, SocialMediaAdsSEO, SocialMediaMotionSEO } from '../components/seo';
import { useActiveSection } from '../components/active-section-context';
import { BakedShell } from './shell';
import { HomeContent } from './home';
import { AdsContent, ContactContent, MotionContent, ServicesContent, UxUiContent } from './pages';

/**
 * Home, the three work pages, services and contact. One module so a visit
 * between them never waits on another download.
 */
export function BakedPage() {
  const { pathname } = useLocation();
  const { category } = useParams<{ category?: string }>();
  const { setActiveSection } = useActiveSection();

  const section =
    pathname === '/contact' ? 'contact'
    : pathname === '/services' ? 'services'
    : category === 'ux-ui' || category === 'social-media-ads' || category === 'social-media-motion' ? category
    : 'home';

  useEffect(() => { setActiveSection(section); }, [section, setActiveSection]);

  const [seo, content] =
    section === 'contact' ? [<ContactSEO />, <ContactContent />]
    : section === 'services' ? [<ServicesSEO />, <ServicesContent />]
    : section === 'ux-ui' ? [<UxUiSEO />, <UxUiContent />]
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
