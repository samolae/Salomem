import { SocialCase, type Media, type SocialCaseData } from './social-case';

/*
 * Zummo in Georgia: professional citrus juicers from Spain, sold here to
 * cafés, hotels and restaurants. The content speaks to the owner, not the
 * person drinking the juice.
 */
const P = '/cases/zummo';
const img = (n: string, w: number, h: number, alt = ''): Media => ({ src: `${P}/${n}.jpg`, w, h, alt });
const reel = (n: string, alt: string): Media => ({ src: `${P}/${n}.mp4`, poster: `${P}/${n}.jpg`, video: true, w: 9, h: 16, alt });

const post = {
  hero: img('post-hero', 4, 5, 'Add juice to the breakfast'),
  quality: img('post-quality', 4, 5, 'Quality you can see'),
  finance: img('post-finance', 4, 5, 'Ask for a financial calculation'),
  cta: img('post-cta', 4, 5, 'Zummo post'),
};
const reels = {
  natural: reel('reel-natural', '100% natural, in front of you'),
  evs: reel('reel-evs', 'No bitterness from the peel'),
  sept: reel('reel-sept', 'Since 1992'),
};

export const ZUMMO: SocialCaseData = {
  path: '/projects/zummo',
  brand: 'Zummo Georgia',
  handle: 'zummo.georgia',
  avatar: `${P}/avatar.jpg`,
  year: '2026',
  tags: [{ en: 'Social media', ka: 'სოციალური მედია' }, { en: 'Motion', ka: 'მოუშენი' }, { en: 'AI visuals', ka: 'AI ვიზუალები' }, { en: 'B2B content', ka: 'B2B კონტენტი' }],
  facts: [
    [{ en: 'Client', ka: 'კლიენტი' }, { en: 'Zummo Georgia', ka: 'Zummo საქართველო' }],
    [{ en: 'Year', ka: 'წელი' }, { en: '2026', ka: '2026' }],
    [{ en: 'Audience', ka: 'აუდიტორია' }, { en: 'Cafés, hotels, restaurants', ka: 'კაფეები, სასტუმროები, რესტორნები' }],
    [{ en: 'Work', ka: 'სამუშაო' }, { en: 'Posts, reels, AI product visuals', ka: 'პოსტები, რილსები, AI ვიზუალები' }],
  ],
  seo: {
    title: 'Zummo Georgia | Social Media Case Study',
    description: 'Social media for Zummo in Georgia: Georgian reels, posts and AI product visuals for cafés, hotels and restaurants.',
    keywords: 'Zummo, Zummo Georgia, social media, reels, B2B content, AI visuals, juicer, HoReCa, Salome Mosiava',
  },
  cover: {
    bg: '#FF6B04',
    logo: `${P}/logo-white.png`,
    logoH: 30,
    reels: [reels.evs, reels.natural, reels.sept],
    line: { en: 'Fresh juice, for business', ka: 'ახალი წვენი ბიზნესისთვის' },
  },
  brief: {
    en: 'Zummo makes professional citrus juicers in Spain. In Georgia the buyer is not the person drinking the juice but the business serving it, so every post had to speak to owners of cafés, hotels and restaurants, in Georgian, within Zummo’s own fresh look.',
    ka: 'Zummo ესპანეთში აწარმოებს პროფესიონალურ წვენსაწურებს. საქართველოში მყიდველი წვენის დამლევი კი არა, ბიზნესია, რომელიც მას ემსახურება. ამიტომ ყველა პოსტი კაფეების, სასტუმროებისა და რესტორნების მფლობელებს ელაპარაკება, ქართულად და Zummo-ს საკუთარ, სუფთა სტილში.',
  },
  challenge: {
    en: 'Talk about margin, payback and reliability without losing what actually sells the machine: the orange, the glass, the juice made in front of you.',
    ka: 'ვილაპარაკოთ მარჟაზე, ამოგებაზე და საიმედოობაზე ისე, რომ არ დავკარგოთ ის, რაც რეალურად ყიდის აპარატს: ფორთოხალი, ჭიქა და წვენი, რომელიც შენს თვალწინ კეთდება.',
  },
  strategy: {
    en: 'One clear line per piece, set on an orange pill: 100% natural, no bitterness from the peel, see the process, ask for a calculation. Short reels for the feed, product scenes made with AI in bright studio colours, and posts that end with one action.',
    ka: 'თითო ნამუშევარზე ერთი მკაფიო ფრაზა, ნარინჯისფერ ფირფიტაზე: 100% ნატურალური, კანის სიმწარე არ მოჰყვება, პროცესს თავად ხედავ, მოითხოვეთ კალკულაცია. მოკლე რილსები ფიდისთვის, AI-ით შექმნილი პროდუქტის სცენები ნათელ სტუდიურ ფერებში და პოსტები, რომლებიც ერთი მოქმედებით მთავრდება.',
  },
  feed: [post.hero, img('blue-machine', 9, 16), post.quality, img('cafe-machine', 2, 3), post.finance, img('yellow-machine', 9, 16), img('breakfast', 2, 3), post.cta, img('glasses', 9, 16), img('pour', 2, 3)],
  pair: [img('yellow-machine', 9, 16, 'Zummo on yellow'), reels.natural],
  strip: [post.hero, img('sky-machine', 9, 16), post.quality, img('tap', 2, 3), post.finance, img('plinth', 3, 4), post.cta, img('blue-machine', 9, 16), img('fruit-table', 2, 3), img('glasses', 9, 16)],
  closing: [img('cafe-machine', 2, 3), img('pour', 2, 3), img('sky-machine-2', 9, 16)],
  wallBg: '#FF6B04',
};

export function ZummoCase() {
  return <SocialCase d={ZUMMO} />;
}
