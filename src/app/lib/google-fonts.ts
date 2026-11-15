import { useEffect } from 'react';

/*
 * Manrope, Syne, Inter and Space Grotesk set the text of the older case
 * studies (AURUM, Schenker, Unispace) and the dark pages (the pixel tool,
 * 404). Only those pages carry the Google Fonts link in their HTML
 * (scripts/prerender.mjs); arriving at one from another page, it is added
 * here. Every other page sets its text in the site's own fonts.
 */
export const GOOGLE_FONTS =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Syne:wght@400..800&family=Inter:wght@300..700&family=Space+Grotesk:wght@300..700&display=swap';

export function useGoogleFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${GOOGLE_FONTS}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = GOOGLE_FONTS;
    document.head.appendChild(l);
  }, []);
}
