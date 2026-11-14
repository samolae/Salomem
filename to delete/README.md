# To delete

Unused shadcn/ui components from the original Figma Make export. Nothing in
`src/` imports them. Kept here until Salome confirms they can be deleted.

`sitemap.xml`: the old hand-written sitemap from `public/`. The build now
writes `dist/sitemap.xml` from `PRERENDER_PATHS` (scripts/prerender.mjs), so
this copy is no longer used.
