import { SocialCase, type Media, type SocialCaseData } from './social-case';
import {
  adsCarmall1, adsCarmall2, adsCarmall3, adsCarmall4,
  adsMardi1, adsMardi2, adsMardi3, adsMardi4, adsMardi5,
  adsTerminal1, adsTerminal2, adsTerminal3, adsTerminal4, adsTerminal5,
} from './data';

/*
 * The social media brands, each told as its own case on the shared
 * template. Copy stays to what the posts themselves show.
 */
const CLD = 'https://res.cloudinary.com/dgfn598qb';
const im = (src: string, w: number, h: number, alt = ''): Media => ({ src, w, h, alt });
const up = (p: string, w: number, h: number, alt = '') => im(`${CLD}/image/upload/f_auto,q_auto/${p}`, w, h, alt);
const film = (p: string, alt = ''): Media => ({
  src: `${CLD}/video/upload/f_auto,q_auto/${p}.mp4`,
  poster: `${CLD}/video/upload/so_1,w_720/${p}.jpg`,
  video: true, w: 9, h: 16, alt,
});
const L = (en: string, ka: string) => ({ en, ka });
const SOCIAL = L('Social media', 'სოციალური მედია');
const ADS = L('Ad design', 'სარეკლამო დიზაინი');
const fact = (k: [string, string], v: [string, string]): [{ en: string; ka: string }, { en: string; ka: string }] => [L(...k), L(...v)];
const CLIENT: [string, string] = ['Client', 'კლიენტი'];
const SECTOR: [string, string] = ['Sector', 'სექტორი'];
const WORK: [string, string] = ['Work', 'სამუშაო'];
const FORMAT: [string, string] = ['Formats', 'ფორმატები'];

/* ── Terminal ─────────────────────────────────────────────────────── */
const tm = [im(adsTerminal1, 1, 1, 'Ready for a fresh start?'), im(adsTerminal2, 1, 1, '20% off this month'), im(adsTerminal3, 9, 16, 'Monthly memberships, story'), im(adsTerminal4, 1, 1, 'Discount on Terminal spaces'), im(adsTerminal5, 1, 1, '24/7 access')];
export const TERMINAL: SocialCaseData = {
  path: '/projects/terminal', brand: 'Terminal', handle: 'terminal.ge',
  avatar: `${CLD}/image/upload/f_auto,q_auto/v1773916799/terminal_hcftru.webp`,
  tags: [SOCIAL, ADS, L('Offers', 'შეთავაზებები')],
  facts: [fact(CLIENT, ['Terminal', 'ტერმინალი']), fact(SECTOR, ['Coworking and offices', 'ქოვორკინგი და ოფისები']), fact(WORK, ['Offer posts, stories', 'შეთავაზების პოსტები, სთორები']), fact(FORMAT, ['1:1, 9:16', '1:1, 9:16'])],
  seo: { title: 'Terminal | Social Media Case Study', description: 'Membership offers for Terminal coworking spaces in Georgia: posts and stories where the space leads and the offer is one line.', keywords: 'Terminal, coworking, social media, ad design, Georgia, Salome Mosiava' },
  cover: { bg: '#121212', reels: [tm[1], tm[2], tm[4]], line: L('Your 24/7 office', 'შენი 24/7 ოფისი') },
  brief: L('Terminal runs coworking and office spaces. The brief: fill memberships with monthly offers, in English and in Georgian, for the feed and for stories.', 'ტერმინალი ქოვორკინგ და საოფისე სივრცეებს მართავს. ამოცანა: ყოველთვიური შეთავაზებებით წევრობების გაყიდვა, ინგლისურად და ქართულად, ფიდისა და სთორისთვის.'),
  challenge: L('A discount every month can quickly look like a flyer. The posts had to sell the place first and the price second.', 'ყოველთვიური ფასდაკლება სწრაფად იქცევა ფლაერად. პოსტს ჯერ სივრცე უნდა გაეყიდა და მერე ფასი.'),
  strategy: L('The space itself leads every post, the offer sits in one short line, and the same strip of facts runs along the bottom: 24/7 access, the Terminal card, free events. One frame, many months.', 'ყველა პოსტში მთავარი თავად სივრცეა, შეთავაზება ერთ მოკლე ხაზშია, ქვემოთ კი ერთი და იგივე ზოლი: 24/7 წვდომა, ტერმინალის ბარათი, უფასო ღონისძიებები. ერთი ჩარჩო, ბევრი თვე.'),
  feed: tm, pair: [tm[0], tm[3]], strip: [tm[1], tm[2], tm[4], tm[0], tm[3]], wallBg: '#121212',
};

/* ── Mardi Holding ────────────────────────────────────────────────── */
const md = [im(adsMardi1, 4, 5, "Europe's fastest growing"), im(adsMardi2, 4, 5, 'Resort living'), im(adsMardi3, 4, 5, 'Investment is not just numbers'), im(adsMardi4, 4, 5, 'That do more'), im(adsMardi5, 4, 5, "Happy Mother's Day")];
export const MARDI: SocialCaseData = {
  path: '/projects/mardi', brand: 'Mardi Holding', handle: 'mardi.holding',
  avatar: `${CLD}/image/upload/f_auto,q_auto/v1773916799/mardi_dzhmgm.webp`,
  tags: [SOCIAL, L('AI visuals', 'AI ვიზუალები'), L('Real estate', 'უძრავი ქონება')],
  facts: [fact(CLIENT, ['Mardi Holding', 'მარდი ჰოლდინგი']), fact(SECTOR, ['Resort real estate, Batumi', 'საკურორტო უძრავი ქონება, ბათუმი']), fact(WORK, ['Posts, AI visuals', 'პოსტები, AI ვიზუალები']), fact(FORMAT, ['4:5', '4:5'])],
  seo: { title: 'Mardi Holding | Social Media Case Study', description: 'Social media for Mardi Holding, resort real estate in Batumi: AI-made scenes, short English lines and Georgian holiday posts.', keywords: 'Mardi Holding, Batumi, real estate, social media, AI visuals, Salome Mosiava' },
  cover: { bg: '#1e3328', reels: [md[1], md[0], md[2]], line: L('Resort living, Batumi', 'საკურორტო ცხოვრება, ბათუმი') },
  brief: L('Mardi Holding builds resort residences on the Black Sea coast in Batumi. The feed speaks to buyers and investors.', 'მარდი ჰოლდინგი შავი ზღვის სანაპიროზე, ბათუმში, საკურორტო საცხოვრებლებს აშენებს. ფიდი მყიდველებსა და ინვესტორებს ელაპარაკება.'),
  challenge: L('Sell a place that is partly still being built, and make it feel like a life, not a price per square metre.', 'გაყიდო ადგილი, რომელიც ნაწილობრივ ჯერ შენდება, და ის ცხოვრებად აჩვენო და არა კვადრატული მეტრის ფასად.'),
  strategy: L('AI-made scenes of the buildings in light and greenery, one short English line each (Resort living, Investment is not just numbers), a calm green frame, and Georgian posts for the holidays.', 'AI-ით შექმნილი სცენები შენობებით სინათლესა და სიმწვანეში, თითოზე ერთი მოკლე ინგლისური ფრაზა (Resort living, Investment is not just numbers), მშვიდი მწვანე ჩარჩო და ქართული პოსტები დღესასწაულებისთვის.'),
  feed: md, pair: [md[3], md[4]], strip: [md[0], md[1], md[2], md[3], md[4]], wallBg: '#1e3328',
};

/* ── Carmall ──────────────────────────────────────────────────────── */
const cm = [im(adsCarmall1, 1, 1, 'Ford Fusion Hybrid, $7,000'), im(adsCarmall2, 1, 1, 'Happy New Year from Carmall'), im(adsCarmall3, 1, 1, 'Warranty'), im(adsCarmall4, 400, 152, '10 years of experience')];
const cmReels = [film('carmall-ne_1_u5ewuz', 'Carmall reel'), film('v1773267419/carmall03_vku8z1', 'Carmall motion reel'), film('v1773267418/carmall04_m7zidg', 'Carmall reel'), film('v1773267407/carmall02_nzawuu', 'Carmall reel')];
export const CARMALL: SocialCaseData = {
  path: '/projects/carmall', brand: 'Carmall', handle: 'carmall.ge',
  year: '2024',
  avatar: `${CLD}/image/upload/f_auto,q_auto/v1773917412/carmall_m1az2j.webp`,
  tags: [SOCIAL, L('Motion', 'მოუშენი'), ADS],
  facts: [fact(CLIENT, ['Carmall', 'ქარმოლი']), fact(['Year', 'წელი'], ['2024', '2024']), fact(SECTOR, ['Car sales', 'ავტომობილების გაყიდვა']), fact(WORK, ['Posts, reels, motion', 'პოსტები, რილსები, მოუშენი']), fact(FORMAT, ['1:1, 9:16, cover', '1:1, 9:16, ქავერი'])],
  seo: { title: 'Carmall | Social Media Case Study', description: 'Social media for Carmall, a car dealer in Georgia: price-led car posts, warranty and holiday posts, and short motion reels.', keywords: 'Carmall, cars, social media, reels, motion, Georgia, Salome Mosiava' },
  cover: { bg: '#0b1f44', reels: [cmReels[1], cmReels[0], cmReels[3]], line: L('Cars, with a warranty', 'ავტომობილები გარანტიით') },
  brief: L('Carmall sells cars in Georgia. The feed had to move stock, say clearly that every car comes with a warranty, and keep the brand present between offers.', 'ქარმოლი საქართველოში ავტომობილებს ყიდის. ფიდს მანქანები უნდა გაეყიდა, მკაფიოდ ეთქვა, რომ ყველა მანქანას გარანტია აქვს, და ბრენდი შეთავაზებებს შორისაც ჩანდეს.'),
  challenge: L('Car posts all look alike: a car, a price, a phone number. Carmall needed to be recognised before the price was read.', 'მანქანების პოსტები ერთმანეთს ჰგავს: მანქანა, ფასი, ტელეფონი. ქარმოლი ფასის წაკითხვამდე უნდა გეცნო.'),
  strategy: L('The car large, the model name set big behind it, the price in one corner and the same red bar at the foot of every post. Reels carry the motion, and holiday posts keep the night-time, cinematic mood.', 'მანქანა დიდად, მოდელის სახელი უკან დიდი შრიფტით, ფასი ერთ კუთხეში და ერთი და იგივე წითელი ზოლი ყველა პოსტის ბოლოში. მოძრაობას რილსები ატარებს, სადღესასწაულო პოსტები კი ღამის, კინემატოგრაფიულ განწყობას ინარჩუნებს.'),
  feed: cm.slice(0, 3), pair: [cmReels[2], cm[0]], strip: [cmReels[0], cm[1], cmReels[1], cm[2], cmReels[3], cm[0]], closing: [cm[3]], wallBg: '#0b1f44',
};

/* ── GTCC ─────────────────────────────────────────────────────────── */
const gt = [
  up('v1773269578/%E1%83%92%E1%83%90%E1%83%A1%E1%83%A4-2_otpsiu.png', 4, 5, 'Racing Series, stage 3'),
  up('v1773269575/image_8_pdfeca.png', 4, 5, '5 days to go'),
  up('v1773269575/image_9_yk9ysd.png', 4, 5, '4 days to go'),
  up('v1773269574/image_10_nai9mn.png', 4, 5, '3 days to go'),
  up('v1773269584/image_11_x2ppb1.png', 4, 5, '2 days to go'),
];
export const GTCC: SocialCaseData = {
  path: '/projects/gtcc', brand: 'GTCC', handle: 'gtcc.georgia',
  avatar: `${CLD}/image/upload/f_auto,q_auto/v1773916799/gtcc_sk1wrg.webp`,
  tags: [SOCIAL, L('Event campaign', 'ღონისძიების კამპანია'), L('Motorsport', 'მოტოსპორტი')],
  facts: [fact(CLIENT, ['GTCC', 'GTCC']), fact(SECTOR, ['Motorsport', 'მოტოსპორტი']), fact(WORK, ['Race-week countdown', 'რბოლის კვირის უკუთვლა']), fact(FORMAT, ['4:5', '4:5'])],
  seo: { title: 'GTCC | Social Media Case Study', description: 'A race-week countdown for GTCC and the Setanta Racing Series: one post a day, the number of days left set huge.', keywords: 'GTCC, Racing Series, motorsport, countdown, social media, Georgia, Salome Mosiava' },
  cover: { bg: '#b3121f', reels: [gt[1], gt[0], gt[4]], line: L('5, 4, 3, 2, race day', '5, 4, 3, 2, რბოლის დღე') },
  brief: L('A stage of the Setanta Racing Series. The week before the race, the feed had to build the wait and make the date impossible to miss.', 'Setanta Racing Series-ის ეტაპი. რბოლამდე ერთი კვირით ადრე ფიდს მოლოდინი უნდა აეწია და თარიღი დაუვიწყარი გაეხადა.'),
  challenge: L('Five posts in five days about the same race, each needing a reason to stop and look.', 'ხუთი პოსტი ხუთ დღეში ერთსა და იმავე რბოლაზე, და თითოს ჰქონოდა მიზეზი, რომ შეგაჩეროს.'),
  strategy: L('A countdown. The number of days left fills the post, a different car and colour each day, the date and time always in the same place, and the partners lined up at the foot.', 'უკუთვლა. დარჩენილი დღეების რიცხვი მთელ პოსტს ავსებს, ყოველ დღე სხვა მანქანა და ფერი, თარიღი და დრო ყოველთვის ერთ ადგილას, პარტნიორები კი ქვემოთ, ერთ ხაზზე.'),
  feed: gt, pair: [gt[1], gt[4]], strip: [gt[1], gt[2], gt[3], gt[4], gt[0]], wallBg: '#b3121f',
};

/* ── Arena ────────────────────────────────────────────────────────── */
const ar = [
  up('v1773435781/oalcrhtxt4flbp1eduth_qllomh.webp', 4, 5, 'Skating at Arena'),
  up('v1773435782/beza4apnp1c4doscnpxd_mtdsqy.webp', 400, 308, 'Football day'),
  up('v1773435782/iifw1pa01dahbxlrptpt_etp7vp.webp', 400, 308, 'Bowling with friends'),
  up('v1773435783/osehbfgl6rr2oo4yukpi_htn4qa.webp', 400, 308, 'Swimming lessons at Arena'),
  up('v1773435783/ca33ipml9e1m60ztcjeq_bwuqcv.webp', 2, 1, 'Climbing wall'),
  up('v1773435783/fowo5cxcm6vbdzp8ovwb_sbvfgt.webp', 400, 308, 'Squash at Arena'),
  up('v1773435783/enwazlvpnhsxketleiid_m7mbqr.webp', 400, 308, 'Spring Dance Festival 2025'),
  up('v1773435847/image_9_ddlrv4.webp', 400, 308, 'Shooting range'),
  up('v1773435847/Artboard_1_1_ipw9xn.webp', 4, 5, '20% off'),
];
export const ARENA: SocialCaseData = {
  path: '/projects/arena', brand: 'Arena', handle: 'arena.sports',
  year: '2025',
  avatar: `${CLD}/image/upload/f_auto,q_auto/v1773916799/arena_ydenyt.webp`,
  tags: [SOCIAL, ADS, L('Sport', 'სპორტი')],
  facts: [fact(CLIENT, ['Arena Sports Complex', 'არენა']), fact(['Year', 'წელი'], ['2025', '2025']), fact(SECTOR, ['Sport and leisure', 'სპორტი და დასვენება']), fact(WORK, ['Posts, events, offers', 'პოსტები, ღონისძიებები, შეთავაზებები']), fact(FORMAT, ['4:5, landscape', '4:5, ჰორიზონტალური'])],
  seo: { title: 'Arena Sports Complex | Social Media Case Study', description: 'Social media for Arena Sports Complex: one bold Georgian line and one sport per post, from swimming and squash to bowling and dance.', keywords: 'Arena, sports complex, social media, ad design, Georgia, Salome Mosiava' },
  cover: { bg: '#1557d6', reels: [ar[0], ar[8]], line: L('One place, many sports', 'ერთი ადგილი, ბევრი სპორტი') },
  brief: L('Arena is a sports complex with a pool, courts, a climbing wall, bowling, a shooting range and events. The feed had to show how much is under one roof and bring people in for each of them.', 'არენა სპორტული კომპლექსია აუზით, კორტებით, საცოცი კედლით, ბოულინგით, სასროლეთით და ღონისძიებებით. ფიდს უნდა ეჩვენებინა, რამდენი რამაა ერთ სახურავქვეშ, და ხალხი თითოეულისთვის მოეყვანა.'),
  challenge: L('Many activities, many audiences, one brand. Each post had to speak to its own crowd and still look like Arena.', 'ბევრი აქტივობა, ბევრი აუდიტორია, ერთი ბრენდი. თითო პოსტს თავის აუდიტორიასთან უნდა ელაპარაკა და მაინც არენასავით გამოჩენილიყო.'),
  strategy: L('One sport, one person in motion and one bold Georgian line per post, on the same blue and orange. Events and offers keep the frame, so the feed reads as one place.', 'თითო პოსტზე ერთი სპორტი, ერთი ადამიანი მოძრაობაში და ერთი თამამი ქართული ფრაზა, ერთსა და იმავე ლურჯ და ნარინჯისფერზე. ღონისძიებები და შეთავაზებებიც იმავე ჩარჩოშია, ამიტომ ფიდი ერთ ადგილად იკითხება.'),
  feed: ar, pair: [ar[3], ar[5]], strip: [ar[4], ar[1], ar[6], ar[2], ar[7]], closing: [ar[0], ar[8]], wallBg: '#1557d6',
};

export const TerminalCase = () => <SocialCase d={TERMINAL} />;
export const MardiCase = () => <SocialCase d={MARDI} />;
export const CarmallCase = () => <SocialCase d={CARMALL} />;
export const GtccCase = () => <SocialCase d={GTCC} />;
export const ArenaCase = () => <SocialCase d={ARENA} />;
