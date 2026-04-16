Optimize my website for PageSpeed / Lighthouse performance while keeping analytics fully intact and preserving the existing design, UI, UX, layout, and brand feel exactly as they are.

Website: samole.ge

Critical constraints:
- Do NOT remove, replace, or break analytics
- Google Tag Manager and Google Analytics must remain working
- Do NOT redesign anything
- Do NOT change the UI
- Do NOT change the UX
- Do NOT change layout structure, spacing system, visual hierarchy, typography style, color palette, or interaction logic
- Do NOT simplify the premium look unless a change is visually imperceptible
- All optimizations must be invisible to users

Main goal:
Improve performance, especially LCP, FCP, TBT, render-blocking behavior, and main-thread work, without changing how the site looks or behaves.

Problems to solve:
1. Render-blocking CSS and font requests
2. Missing font-display optimization
3. Forced reflow from JavaScript
4. Slow LCP caused by delayed hero image rendering
5. Critical request chains from CSS and fonts
6. No preconnect for important origins
7. Large unused JavaScript
8. JS payload could be smaller/minified better
9. Heavy third-party cost from GTM / GA, but analytics must remain intact
10. Non-composited animations hurting rendering performance
11. Heavy Cloudinary image payloads
12. Too much startup main-thread work
13. Some images missing explicit width and height
14. Unused CSS
15. Above-the-fold loading not prioritized enough

What to do:
- Keep analytics fully enabled and functioning
- Keep design and UI/UX visually identical
- Only make technical performance improvements behind the scenes

Required implementation:

A. Analytics
- Preserve Google Tag Manager and Google Analytics fully
- Do not remove tracking
- Do not break existing events, page views, or measurement logic
- Only defer or sequence analytics loading in a safe way that keeps tracking reliable
- Avoid duplicate analytics requests if duplicates exist
- Optimize loading order without changing data collection behavior

B. Fonts
- Add font-display: swap to custom fonts
- Reduce unnecessary font variants and unused weights
- Preload only critical above-the-fold font files
- Use metric-compatible fallbacks to reduce layout shift
- Remove unnecessary external font dependencies only if the final visual result stays the same

C. CSS
- Inline critical above-the-fold CSS
- Defer non-critical CSS where safe
- Minify CSS
- Remove unused CSS without affecting appearance
- Preserve exact visual output

D. LCP / Hero
- Identify the LCP element and optimize it directly
- Make the LCP image discoverable in initial HTML
- Do not lazy-load the LCP image
- Add fetchpriority="high" to the LCP image
- Add explicit width and height
- Preload the LCP image if appropriate
- Reduce render delay in the hero section without changing its look or motion feel

E. Images
- Optimize Cloudinary delivery
- Use responsive image sizing with srcset and sizes
- Serve smaller files where possible without visible quality loss
- Keep modern image formats
- Lazy-load only below-the-fold images
- Add decoding="async" where appropriate
- Ensure all images have width and height attributes

F. JavaScript
- Reduce unused JS
- Split non-critical code from critical startup code
- Defer below-the-fold and non-essential interactive logic
- Minify production JS
- Keep all existing interactions working exactly the same
- Do not alter navigation, filtering, hover logic, animation triggers, or page behavior

G. Forced reflow
- Find layout thrashing issues caused by DOM reads after writes
- Batch reads and writes properly
- Use requestAnimationFrame where needed
- Avoid repeated layout measurements during animations and scrolling

H. Animations
- Preserve the same motion design feel
- Optimize animations to rely on transform and opacity where possible
- Reduce costly filter/blur rendering only if the visual result remains effectively identical
- Keep the same timing, mood, and premium feel
- Respect prefers-reduced-motion

I. Network optimization
- Add preconnect/preload only where truly useful
- Prioritize first-screen resources
- Reduce critical request chains
- Avoid unnecessary early downloads

J. DOM and rendering
- Reduce startup rendering cost without changing visible structure
- Simplify implementation only under the hood
- Keep the same interface and content order

Output required:
1. Production-ready optimized code
2. Short explanation of what changed technically
3. Confirmation that analytics, design, UI, and UX were preserved
4. Summary of expected gains in LCP, FCP, TBT, and render-blocking performance

Success criteria:
- Analytics remains fully working
- Design looks the same
- UI/UX behaves the same
- Faster first render
- Faster LCP
- Lower main-thread work
- Less unused JS
- Better font and image loading
- No visual regressions