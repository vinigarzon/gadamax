# Gadamax Static Site

Modern static rebuild of the original Gadamax website for Netlify, migrated away from WordPress/Hostinger.

## Stack

- Astro
- Local static assets in `public/assets`
- Netlify form-compatible contact form

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Download the migrated source-site assets into the local project:

   ```bash
   node scripts/download-assets.mjs
   ```

3. Start development:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build locally:

   ```bash
   npm run preview
   ```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Netlify config: `netlify.toml`
- Contact form markup is prepared with `data-netlify="true"` and hidden `form-name` input
- The form includes a hidden `subject` field so Netlify email notifications can use a clearer subject line

### Netlify form notifications

After the first deploy, Netlify will detect the `contact` form from the generated HTML.

1. Deploy the site to Netlify.
2. Submit the contact form once on the live site so the form shows up in Netlify.
3. In Netlify, go to `Project configuration > Notifications > Emails and webhooks > Form submission notifications`.
4. Add an email notification for the `contact` form.
5. Set the notification recipient to the inbox you want to monitor, for example `info@gadamax.com`.

Notes:

- Submissions are stored in the site `Forms` tab in Netlify.
- Because the form includes an `email` field, Netlify can use that value as the `Reply-to` address in the notification email.
- The inline success message is handled in the browser after a successful form submission response.

## File structure

- `src/layouts` shared page layout
- `src/components` reusable UI components
- `src/pages` static routes and portfolio detail pages
- `src/content/site.js` centralized content model
- `public/assets/images` downloaded local images
- `public/assets/icons` local SVG icons
- `scripts/download-assets.mjs` asset migration script
- `data/source-asset-inventory.md` source-site audit notes

## What changed from the original site

- Rebuilt from WordPress/Elementor into a static Astro codebase
- Removed WordPress, WooCommerce, Visual Portfolio, Elementor, and theme dependencies
- Replaced remote media references with local asset paths
- Reframed the design with stronger typography, spacing, hierarchy, and card presentation
- Turned portfolio pages into clean static case-study routes
- Replaced icon fonts with local SVGs
- Replaced source-site font loading with locally bundled fonts
- Prepared the contact form for Netlify Forms

## Notes

- `astro.config.mjs` currently uses `https://gadamax-studio.netlify.app` as the default site URL. Update it if deploying to a custom domain.
- `public/robots.txt` uses the same default URL for the sitemap reference.
