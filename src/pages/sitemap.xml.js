import { portfolioItems } from "../content/site.js";

const staticPages = ["", "about-us", "services", "portfolio", "contact"];

export async function GET({ site }) {
  const siteUrl = site ?? new URL("https://gadamax-studio.netlify.app");
  const urls = [
    ...staticPages.map((path) => new URL(`/${path}`, siteUrl).toString()),
    ...portfolioItems.map((item) => new URL(`/portfolio/${item.slug}`, siteUrl).toString())
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
