// Puppeteer is used over Playwright because:
// 1. Zero extra daemon/server process — just a single npm package
// 2. First-class support in Node.js/Next.js API routes
// 3. Smaller install footprint (no cross-browser overhead for this use-case)
// 4. Mature API, deterministic PDF output, and stable page.pdf() implementation

import puppeteer from "puppeteer";
import type { CarouselSchema } from "@/types";
import { renderFullPageHtml } from "./slideHtml";

export async function generatePdf(schema: CarouselSchema): Promise<Buffer> {
  const html = renderFullPageHtml(schema.slides);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();

    // Block external network to ensure deterministic output regardless of font CDN availability
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      // Allow data URIs and same-origin; block external fonts for determinism
      if (url.startsWith("data:") || url.startsWith("about:")) {
        req.continue();
      } else if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
        req.abort(); // fallback to system fonts — still readable
      } else {
        req.continue();
      }
    });

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // 794px × 794px viewport — square slide matching LinkedIn's optimal 1:1 ratio
    // We use A4 PDF paper so slides stack cleanly, one per "page"
    await page.setViewport({ width: 794, height: 794, deviceScaleFactor: 2 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
