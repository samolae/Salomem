import type { Media } from './social-case';
import {
  adsCarmall1, adsCarmall2, adsCarmall3, adsCarmall4,
  adsMardi1, adsMardi2, adsMardi3, adsMardi4, adsMardi5,
  adsTerminal1, adsTerminal2, adsTerminal3, adsTerminal4, adsTerminal5,
} from './data';

/* The pieces each social case shows, kept apart from the case pages so a
 * case card can use them without loading the page itself. */
const CLD = 'https://res.cloudinary.com/dgfn598qb';
const im = (src: string, w: number, h: number, alt = ''): Media => ({ src, w, h, alt });
const up = (p: string, w: number, h: number, alt = '') => im(`${CLD}/image/upload/f_auto,q_auto/${p}`, w, h, alt);
const film = (p: string, alt = ''): Media => ({
  src: `${CLD}/video/upload/f_auto,q_auto/${p}.mp4`,
  poster: `${CLD}/video/upload/so_1,w_720/${p}.jpg`,
  video: true, w: 9, h: 16, alt,
});

export const tm = [im(adsTerminal1, 1, 1, 'Ready for a fresh start?'), im(adsTerminal2, 1, 1, '20% off this month'), im(adsTerminal3, 9, 16, 'Monthly memberships, story'), im(adsTerminal4, 1, 1, 'Discount on Terminal spaces'), im(adsTerminal5, 1, 1, '24/7 access')];

export const md = [im(adsMardi1, 4, 5, "Europe's fastest growing"), im(adsMardi2, 4, 5, 'Resort living'), im(adsMardi3, 4, 5, 'Investment is not just numbers'), im(adsMardi4, 4, 5, 'That do more'), im(adsMardi5, 4, 5, "Happy Mother's Day")];

export const cm = [im(adsCarmall1, 1, 1, 'Ford Fusion Hybrid, $7,000'), im(adsCarmall2, 1, 1, 'Happy New Year from Carmall'), im(adsCarmall3, 1, 1, 'Warranty'), im(adsCarmall4, 400, 152, '10 years of experience')];

export const cmReels = [film('carmall-ne_1_u5ewuz', 'Carmall reel'), film('v1773267419/carmall03_vku8z1', 'Carmall motion reel'), film('v1773267418/carmall04_m7zidg', 'Carmall reel'), film('v1773267407/carmall02_nzawuu', 'Carmall reel')];

export const gt = [
  up('v1773269578/%E1%83%92%E1%83%90%E1%83%A1%E1%83%A4-2_otpsiu.png', 4, 5, 'Racing Series, stage 3'),
  up('v1773269575/image_8_pdfeca.png', 4, 5, '5 days to go'),
  up('v1773269575/image_9_yk9ysd.png', 4, 5, '4 days to go'),
  up('v1773269574/image_10_nai9mn.png', 4, 5, '3 days to go'),
  up('v1773269584/image_11_x2ppb1.png', 4, 5, '2 days to go'),
];

export const ar = [
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
