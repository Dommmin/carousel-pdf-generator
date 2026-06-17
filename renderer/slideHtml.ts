import type { Slide, ContentBlock, ThemeConfig } from "@/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBlock(block: ContentBlock, theme: ThemeConfig): string {
  switch (block.type) {
    case "code":
      return `<div class="code-block" style="background:${theme.codeBg};border-left:3px solid ${theme.accent};border-radius:6px;padding:10px 14px;margin:6px 0;font-family:'Fira Code','Courier New',monospace;font-size:15px;line-height:1.5;color:${theme.code};white-space:pre-wrap;word-break:break-all;overflow:hidden">${escapeHtml(block.content)}</div>`;

    case "text":
      return `<p style="margin:4px 0 8px;font-size:14px;color:${theme.muted};line-height:1.5">${escapeHtml(block.content)}</p>`;

    case "list-item":
      return `<div style="display:flex;align-items:flex-start;gap:10px;margin:6px 0"><span style="color:${theme.accent};font-size:16px;font-weight:700;flex-shrink:0">→</span><span style="font-size:15px;color:${theme.text};line-height:1.4">${escapeHtml(block.content)}</span></div>`;

    case "badge":
      return `<div style="display:inline-block;margin-top:16px;padding:10px 24px;background:${theme.accent};color:#fff;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:0.05em">${escapeHtml(block.content)}</div>`;

    default:
      return "";
  }
}

function renderTitleSlide(slide: Slide): string {
  const { theme } = slide;
  return `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:100%;padding:60px 48px">
      <div style="width:56px;height:4px;background:${theme.accent};border-radius:2px;margin-bottom:32px"></div>
      <h1 style="font-size:42px;font-weight:800;color:${theme.text};line-height:1.2;margin:0 0 20px;letter-spacing:-0.02em">${escapeHtml(slide.title)}</h1>
      ${slide.subtitle ? `<p style="font-size:18px;color:${theme.muted};margin:0;max-width:480px;line-height:1.5">${escapeHtml(slide.subtitle)}</p>` : ""}
      <div style="position:absolute;bottom:36px;right:40px;font-size:12px;color:${theme.muted};opacity:0.6;font-weight:500">1 / ${slide.totalSlides}</div>
    </div>`;
}

function renderSectionSlide(slide: Slide): string {
  const { theme } = slide;
  return `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;height:100%;padding:60px 56px">
      <div style="font-size:13px;font-weight:700;color:${theme.accent};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px">Section</div>
      <h2 style="font-size:36px;font-weight:800;color:${theme.text};line-height:1.2;margin:0;letter-spacing:-0.02em">${escapeHtml(slide.title)}</h2>
      <div style="width:48px;height:3px;background:${theme.accent};border-radius:2px;margin-top:24px"></div>
      <div style="position:absolute;bottom:36px;right:40px;font-size:12px;color:${theme.muted};opacity:0.6;font-weight:500">${slide.slideNumber} / ${slide.totalSlides}</div>
    </div>`;
}

function renderContentSlide(slide: Slide): string {
  const { theme } = slide;
  const blocksHtml = slide.blocks.map((b) => renderBlock(b, theme)).join("");
  return `
    <div style="display:flex;flex-direction:column;height:100%;padding:36px 44px 48px">
      <div style="margin-bottom:20px">
        <h2 style="font-size:22px;font-weight:700;color:${theme.accent};margin:0 0 4px;letter-spacing:-0.01em">${escapeHtml(slide.title)}</h2>
        <div style="width:36px;height:2px;background:${theme.accent};opacity:0.5;border-radius:1px"></div>
      </div>
      <div style="flex:1;overflow:hidden">${blocksHtml}</div>
      <div style="position:absolute;bottom:24px;right:40px;font-size:12px;color:${theme.muted};opacity:0.6;font-weight:500">${slide.slideNumber} / ${slide.totalSlides}</div>
    </div>`;
}

function renderSummarySlide(slide: Slide): string {
  const { theme } = slide;
  const blocksHtml = slide.blocks.map((b) => renderBlock(b, theme)).join("");
  return `
    <div style="display:flex;flex-direction:column;height:100%;padding:36px 44px 48px">
      <div style="margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;color:${theme.accent};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px">Recap</div>
        <h2 style="font-size:30px;font-weight:800;color:${theme.text};margin:0;letter-spacing:-0.01em">${escapeHtml(slide.title)}</h2>
      </div>
      <div style="flex:1;overflow:hidden">${blocksHtml}</div>
      <div style="position:absolute;bottom:24px;right:40px;font-size:12px;color:${theme.muted};opacity:0.6;font-weight:500">${slide.slideNumber} / ${slide.totalSlides}</div>
    </div>`;
}

function renderCtaSlide(slide: Slide): string {
  const { theme } = slide;
  const blocksHtml = slide.blocks.map((b) => renderBlock(b, theme)).join("");
  return `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;height:100%;padding:60px 48px">
      <div style="font-size:48px;margin-bottom:20px">🔖</div>
      <h2 style="font-size:34px;font-weight:800;color:${theme.text};margin:0 0 12px;letter-spacing:-0.02em">${escapeHtml(slide.title)}</h2>
      ${slide.subtitle ? `<p style="font-size:16px;color:${theme.muted};margin:0 0 24px">${escapeHtml(slide.subtitle)}</p>` : ""}
      ${blocksHtml}
      <div style="position:absolute;bottom:36px;right:40px;font-size:12px;color:${theme.muted};opacity:0.6;font-weight:500">${slide.slideNumber} / ${slide.totalSlides}</div>
    </div>`;
}

export function renderSlideBody(slide: Slide): string {
  switch (slide.type) {
    case "TITLE_SLIDE":    return renderTitleSlide(slide);
    case "SECTION_SLIDE":  return renderSectionSlide(slide);
    case "CONTENT_SLIDE":  return renderContentSlide(slide);
    case "SUMMARY_SLIDE":  return renderSummarySlide(slide);
    case "CTA_SLIDE":      return renderCtaSlide(slide);
    default:               return "";
  }
}

export function renderFullPageHtml(slides: Slide[]): string {
  const theme = slides[0]?.theme;
  if (!theme) return "";

  const slidesHtml = slides
    .map((slide) => {
      const body = renderSlideBody(slide);
      return `<div class="slide" style="width:794px;min-height:794px;background:${theme.bg};position:relative;page-break-after:always;overflow:hidden;box-sizing:border-box">${body}</div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkedIn Carousel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #111; font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
    .slide { font-family: 'Inter', -apple-system, sans-serif; }
    @media print {
      body { background: transparent; }
      .slide { page-break-after: always; }
      .slide:last-child { page-break-after: avoid; }
    }
  </style>
</head>
<body>
${slidesHtml}
</body>
</html>`;
}
