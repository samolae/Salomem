/*
 * The drum knows the shape of every picture before it loads.
 *
 * SHAPE is width / height of each Cloudinary picture on the drum, and STILL
 * is the point each reel's still is taken from (the first of 35%, 60%, 20%,
 * 80%, 50%, 10% that is not a blank frame). Both were measured once from the
 * real files. With them the drum is laid out in its final form from the first
 * frame: no tile changes height when its picture arrives, so nothing shifts
 * on screen, and no reel swaps its still for another one a moment later.
 *
 * Keys are the last six characters of the Cloudinary id (the random suffix).
 * A picture or reel added later and missing here still works: its shape is
 * learned when it loads and its still is checked in the browser, as before.
 */
export const heroKey = (src: string) => src.split('/').pop()!.replace(/\.[a-z0-9]+$/i, '').slice(-6);

export const SHAPE: Record<string, number> = {
  brx0fw: 0.8, bwuqcv: 2, c0cm7h: 0.8, ckiq2l: 0.5623, dcwoc0: 0.8, ddlrv4: 1.2987,
  dinhde: 1, dw6a0y: 0.8, dzan8l: 0.8, e9uyoz: 1.2987, eslqq8: 0.8, etp7vp: 1.2987,
  eudlkm: 0.8, eweuys: 0.8054, eyvpsf: 0.8, f6d050: 0.8, fz2hzg: 1, fzg0k8: 1,
  grqvyn: 1, gu31ka: 1.2987, gu38vo: 1, gwslya: 0.8, gy0yln: 0.8, gy67ba: 1.7804,
  hcac4g: 0.8, htn4qa: 1.2987, hzqwjm: 0.8, ipw9xn: 0.8, iwntjz: 1, ix9wkc: 1,
  jzzk57: 1, lquzrl: 0.7742, lxtkoy: 1.5, m7mbqr: 1.2987, mkkjtu: 0.8, mtdsqy: 1.2987,
  mtrhqg: 1, nafa1y: 0.8, nai9mn: 0.8, niubv1: 1.7751, nr1rbc: 0.8, ogilbx: 1,
  onab1t: 1, otpsiu: 0.8, pdfeca: 0.8, pjqki6: 0.8, qllomh: 0.8, rllapb: 0.8,
  rs3227: 0.8, sbvfgt: 1.2987, shjapo: 0.8, siknqu: 0.8, taleoy: 0.8, tng1vh: 1,
  u7cbzp: 0.8, uy6mzb: 1, vutvcx: 1, wcgakf: 0.8, whpwt4: 1, wlbo1j: 0.8,
  x2ppb1: 0.8, x8oklv: 0.8, x8vcgr: 1, xkrwdx: 0.7742, xwdji2: 1, yk9ysd: 0.8,
  zwhfcu: 0.8,
};

export const STILL: Record<string, string> = {
  jclsib: '35p', u5ewuz: '35p', vku8z1: '35p', m7zidg: '35p', nzawuu: '20p', s9rlwa: '35p', efercf: '35p', qzmhxx: '35p', urad4o: '35p', q98ayn: '35p', wggbwt: '35p', b1eg8e: '35p',
};
