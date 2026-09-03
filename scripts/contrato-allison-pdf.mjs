#!/usr/bin/env node
/**
 * Gadamax · Extrae el contrato de Host (Allison) firmado
 *
 * 1. Consulta /api/contracts/allison?ver=<clave> y guarda el registro completo
 *    (con IP, navegador y huella) como JSON.
 * 2. Imprime a PDF la vista de Gadamax de la página (?ver=<clave>) con Chrome
 *    en modo headless: es el mismo documento que ve Allison, más el bloque de
 *    evidencia de la firma.
 *
 * Uso:
 *   CLAVE=tu_clave node scripts/contrato-allison-pdf.mjs
 *   CLAVE=tu_clave node scripts/contrato-allison-pdf.mjs ~/Desktop
 *
 * La clave es CONTRATOS_CLAVE (o CUESTIONARIO_CLAVE) de Netlify.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const SITIO = process.env.SITIO || "https://www.gadamax.com";
const CLAVE = process.env.CLAVE || process.env.CONTRATOS_CLAVE || process.env.CUESTIONARIO_CLAVE;
const destino = resolve(process.argv[2] || join(homedir(), "Desktop"));

if (!CLAVE) {
  console.error("Falta la clave. Ejecuta:  CLAVE=tu_clave node scripts/contrato-allison-pdf.mjs");
  process.exit(1);
}

const api = `${SITIO}/api/contracts/allison?ver=${encodeURIComponent(CLAVE)}`;
const r = await fetch(api, { headers: { accept: "application/json" } });
const d = await r.json();
if (!r.ok || d.error) { console.error("La API respondió:", d.error || r.status); process.exit(1); }
if (!d.firmado) { console.log("Todavía no está firmado. Versión vigente:", d.documento.version, "· huella", d.hash_actual.slice(0, 16) + "…"); process.exit(0); }

const reg = d.registro;
const fecha = reg.firmado_el.slice(0, 10);
mkdirSync(destino, { recursive: true });
const base = join(destino, `Contrato-Host-Allison-${fecha}-${reg.id}`);

writeFileSync(`${base}.json`, JSON.stringify(reg, null, 2));
console.log("Registro guardado:", `${base}.json`);
console.log(`Firmó ${reg.contratista.nombre} el ${reg.firmado_el} desde IP ${reg.evidencia?.ip ?? "—"}`);
if (reg.hash !== d.hash_actual) console.warn("⚠ El texto publicado cambió después de la firma; el PDF usa la versión vigente. Revisa VERSION en contrato-allison-texto.mjs.");

/* Chrome headless: busca el binario en macOS, Linux o por PATH. */
const candidatos = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"
];
const chrome = process.env.CHROME || candidatos.find((p) => existsSync(p));
const pagina = `${SITIO}/contracts/allison/?ver=${encodeURIComponent(CLAVE)}`;

if (!chrome) {
  console.log("No encontré Chrome. Abre esta dirección y usa Imprimir → Guardar como PDF:\n ", pagina);
  process.exit(0);
}

execFileSync(chrome, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--no-pdf-header-footer", "--virtual-time-budget=20000",
  `--print-to-pdf=${base}.pdf`, pagina
], { stdio: "ignore" });

console.log("PDF generado:", `${base}.pdf`);
