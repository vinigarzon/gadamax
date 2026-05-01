# Source Site Asset Audit

Inspected pages:

- `/`
- `/about-us/`
- `/services/`
- `/portfolio-2/`
- `/contact/`
- `/portfolio/*` detail pages

Source-site dependencies identified before rebuild:

- Fonts: `IBM Plex Sans` served from `wp-content/fonts/ibm-plex-sans/*.woff2`
- Elementor font CSS: `roboto.css` and `robotoslab.css`
- Icon fonts: `remixicon.css` and `socicon.css`
- Video reference: YouTube CTA on homepage and services page
- Images: logo, page hero backgrounds, portfolio mockups, testimonial avatars, and product showcase screenshots from `wp-content/uploads/...`

Rebuild decisions:

- Images used by the new static site are downloaded locally by `scripts/download-assets.mjs`
- Old icon-font dependencies are replaced with local SVG icons in `/public/assets/icons`
- Old font dependencies are replaced with self-hosted package fonts bundled locally during build
- The WordPress YouTube CTA is not embedded directly in the rebuilt site; the focus shifts to portfolio and contact CTAs for a faster, cleaner experience
