import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const assets = [
  {
    url: "https://www.gadamax.com/wp-content/uploads/2024/04/logo_gadamax.png",
    output: "public/assets/images/brand-logo-gadamax.png",
    note: "Source site logo"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2024/04/cropped-logo_gadamax-180x180.png",
    output: "public/assets/images/favicon-touch.png",
    note: "Apple touch icon"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/about-us.jpg",
    output: "public/assets/images/about-driven-impact.jpg",
    note: "About page visual"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/femal-programmer.png",
    output: "public/assets/images/services-web-development.png",
    note: "Services visual"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/matrix.png",
    output: "public/assets/images/hero-automation-matrix.png",
    note: "Automation texture"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/10/attachment-01.jpg",
    output: "public/assets/images/page-header-about-services.jpg",
    note: "Page hero background"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/10/attachment-04.jpg",
    output: "public/assets/images/page-header-portfolio.jpg",
    note: "Portfolio hero background"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/product.png",
    output: "public/assets/images/portfolio-travel-finder.png",
    note: "Travel Finder card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/10/product-1.png",
    output: "public/assets/images/portfolio-smart-loyalty-app.png",
    note: "Smart Loyalty App card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/02/product-2.png",
    output: "public/assets/images/portfolio-modern-ecommerce-template.png",
    note: "Modern E-Commerce Template card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/02/product-3.png",
    output: "public/assets/images/portfolio-corporate-web-presence.png",
    note: "Corporate Web Presence card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/02/product-4.png",
    output: "public/assets/images/portfolio-digital-rewards-catalog.png",
    note: "Digital Rewards Catalog card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/02/product-5.png",
    output: "public/assets/images/portfolio-performance-dashboard.png",
    note: "Performance Dashboard card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/02/product-6.png",
    output: "public/assets/images/portfolio-real-estate-finder.png",
    note: "Real Estate Finder card"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/Screenshot-2025-05-24-at-7.46.44%E2%80%AFAM-Editado.png",
    output: "public/assets/images/showcase-corporate-platform.png",
    note: "Showcase image"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/Screenshot-2025-05-24-at-7.46.54%E2%80%AFAM-Editado.png",
    output: "public/assets/images/showcase-rewards-mobile.png",
    note: "Showcase image"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/Screenshot-2025-05-24-at-7.47.04%E2%80%AFAM-Editado.png",
    output: "public/assets/images/showcase-dashboard-ui.png",
    note: "Showcase image"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/Screenshot-2025-05-24-at-7.47.15%E2%80%AFAM-Editado.png",
    output: "public/assets/images/showcase-commerce-ui.png",
    note: "Showcase image"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2025/05/Screenshot-2025-05-24-at-7.47.30%E2%80%AFAM-Editado.png",
    output: "public/assets/images/showcase-property-search-ui.png",
    note: "Showcase image"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/04/avatar-01.jpg",
    output: "public/assets/images/testimonial-laura-mendez.jpg",
    note: "Testimonial portrait"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/04/avatar-02.jpg",
    output: "public/assets/images/testimonial-valentina-rios.jpg",
    note: "Testimonial portrait"
  },
  {
    url: "https://www.gadamax.com/wp-content/uploads/2020/04/avatar-03.jpg",
    output: "public/assets/images/testimonial-ricardo-jimenez.jpg",
    note: "Testimonial portrait"
  },
  {
    url: "https://fincalaclementina.com/wp-content/uploads/2023/06/logo_clementina_white.png",
    output: "public/assets/images/portfolio-finca-la-clementina-logo.png",
    note: "Finca La Clementina logo"
  },
  {
    url: "https://fincalaclementina.com/wp-content/uploads/2023/06/cropped-Sin-titulo-512-%C3%97-512-px-180x180.png",
    output: "public/assets/images/portfolio-finca-la-clementina-mark.png",
    note: "Finca La Clementina mark"
  },
  {
    url: "https://fincalaclementina.com/wp-content/uploads/2023/06/Diseno-sin-titulo-17.jpg",
    output: "public/assets/images/portfolio-finca-la-clementina-preview.jpg",
    note: "Finca La Clementina preview"
  },
  {
    url: "https://lincolnbizlab.com/assets/logo-dark-B7-tRwtt.png",
    output: "public/assets/images/portfolio-lincoln-bizlab-logo.png",
    note: "Lincoln BizLab logo"
  },
  {
    url: "https://lincolnbizlab.com/assets/hero-building-HBQzlvto.webp",
    output: "public/assets/images/portfolio-lincoln-bizlab-preview.webp",
    note: "Lincoln BizLab preview"
  },
  {
    url: "https://app.ohmyrewards.com/assets/ohmyrewards-logo-Dh1hOM6V.png",
    output: "public/assets/images/portfolio-ohmyrewards-logo.png",
    note: "OhMyRewards logo"
  },
  {
    url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/816b05fe-608c-4ba6-9b50-8d60d7b6396d/id-preview-5231b0fe--0327238c-8069-4476-900c-3aaa630ce546.lovable.app-1766191665887.png",
    output: "public/assets/images/portfolio-ohmyrewards-preview.png",
    note: "OhMyRewards preview"
  },
  {
    url: "https://pulso.bet/assets/logo-pulso-C-5CeA7U.png",
    output: "public/assets/images/portfolio-pulso-logo.png",
    note: "Pulso.bet logo"
  },
  {
    url: "https://pulso.bet/og-image.png",
    output: "public/assets/images/portfolio-pulso-preview.png",
    note: "Pulso.bet preview"
  },
  {
    url: "https://santalucia.store/assets/logo-santa-lucia-BDItE8-P.png",
    output: "public/assets/images/portfolio-santa-lucia-logo.png",
    note: "Club Santa Lucía logo"
  },
  {
    url: "https://santalucia.store/assets/hero-santa-lucia-71BKfAwP.jpg",
    output: "public/assets/images/portfolio-santa-lucia-preview.jpg",
    note: "Club Santa Lucía preview"
  },
  {
    url: "https://clubab.store/assets/logo-club-ab-RxEoPMkH.png",
    output: "public/assets/images/portfolio-club-ab-logo.png",
    note: "Club AB+ logo"
  },
  {
    url: "https://clubab.store/assets/hero-clubab-DciG7Pa0.png",
    output: "public/assets/images/portfolio-club-ab-preview.png",
    note: "Club AB+ preview"
  },
  {
    url: "https://diegobuitron.art/favicon.png",
    output: "public/assets/images/portfolio-diego-buitron-logo.png",
    note: "Diego Buitrón mark"
  },
  {
    url: "https://diegobuitron.art/og-image.jpg",
    output: "public/assets/images/portfolio-diego-buitron-preview.jpg",
    note: "Diego Buitrón preview"
  },
  {
    url: "https://gurumba.com/wp-content/uploads/2024/08/logo-gurumba-280-80.png",
    output: "public/assets/images/portfolio-gurumba-logo.png",
    note: "Gurumba logo"
  },
  {
    url: "https://www.gurumba.com/wp-content/uploads/2025/09/gurumba-home-1200x630-1.jpg",
    output: "public/assets/images/portfolio-gurumba-preview.jpg",
    note: "Gurumba preview"
  }
];

const report = [];

for (const asset of assets) {
  const outputPath = join(process.cwd(), asset.output);
  await mkdir(dirname(outputPath), { recursive: true });

  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`Failed to download ${asset.url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, buffer);
  report.push({
    source: asset.url,
    destination: asset.output,
    bytes: buffer.byteLength,
    note: asset.note
  });
  console.log(`Saved ${asset.output}`);
}

await mkdir(join(process.cwd(), "data"), { recursive: true });

await writeFile(
  join(process.cwd(), "data", "download-report.json"),
  JSON.stringify(report, null, 2)
);

console.log(`Downloaded ${report.length} assets.`);
