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
const film = (n: string, alt: string): Media => ({ src: `${P}/${n}.mp4`, poster: `${P}/${n}.jpg`, video: true, w: 4, h: 5, alt });
const ig = {
  where: img('ig-where', 4, 5, 'Where will you meet Zummo?'),
  hotels: img('ig-hotels', 4, 5, 'Hotels and restaurants'),
  retail: img('ig-retail', 4, 5, 'Supermarkets and bars'),
  one: img('ig-one', 4, 5, 'Different businesses, one goal'),
  business: img('ig-business', 4, 5, 'How long until it pays back?'),
};
const aug = [img('aug-01', 4, 5, 'Meet Zummo'), img('aug-02', 4, 5, 'Since 1992'), img('aug-03', 4, 5, 'Hotels, supermarkets, cafés, restaurants'), img('aug-04', 4, 5, 'Zummo in Georgia')];
const bar = [img('bar-01', 4, 5, 'Bar?'), img('bar-02', 4, 5, 'Cocktails'), img('bar-03', 4, 5, 'Fresh juice'), img('bar-04', 4, 5, 'Want it for your bar?')];
const hotel = [img('hotel-01', 4, 5, 'Do you have a hotel?'), img('hotel-02', 4, 5, 'Fresh juice at breakfast'), img('hotel-03', 4, 5, 'Comfortable service'), img('hotel-04', 4, 5, 'For your hotel')];
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
    bg: '#f9f9f9',
    image: { src: `${P}/cover.jpg`, w: 2688, h: 1152, alt: 'Zummo' },
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
  // dealt across the wall's columns (5, or 3 on a phone) in this order: no campaign twice in a column
  feed: [hotel[0], ig.one, aug[3], bar[2], bar[0], ig.business, post.hero, hotel[2], aug[0], aug[2], post.quality, hotel[3], bar[1], ig.hotels, post.finance, aug[1], bar[3], ig.where, hotel[1], ig.retail],
  pair: [film('film-night-bar', 'Night Bar'), film('film-hotel', 'Hotels and cafés')],
  // the hotel carousel and pieces the feed above does not show, so nothing appears twice
  strip: [hotel[0], hotel[1], hotel[2], hotel[3], film('film-safe', 'Straight from the orange'), img('story-business', 9, 16, 'Story'), img('yellow-machine', 9, 16, 'Zummo on yellow'), img('fb-grid', 1, 1, 'Facebook grid'), img('sky-machine', 9, 16, 'Zummo on blue')],
  closing: [reels.evs, reels.natural, reels.sept],
  wallBg: '#FF6B04',
};

export function ZummoCase() {
  return <SocialCase d={ZUMMO} />;
}
