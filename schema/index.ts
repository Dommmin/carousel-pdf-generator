import type {
  ParsedContent,
  ParsedSection,
  ParsedItem,
  Slide,
  CarouselSchema,
  ContentBlock,
  LayoutType,
  ThemeConfig,
} from "@/types";
import { darkTheme } from "./theme";

const MAX_ITEMS_PER_CONTENT_SLIDE = 6;

let _slideCounter = 0;
const nextId = () => `slide-${++_slideCounter}`;
const resetCounter = () => { _slideCounter = 0; };

function makeBlocks(items: ParsedItem[]): ContentBlock[] {
  return items.flatMap((item): ContentBlock[] => {
    const blocks: ContentBlock[] = [];
    if (item.command) blocks.push({ type: "code", content: item.command });
    if (item.description) blocks.push({ type: "text", content: item.description });
    return blocks;
  });
}

function detectLayout(items: ParsedItem[]): LayoutType {
  return items.some((i) => i.command !== "") ? "code-heavy" : "left";
}

function chunkItems(items: ParsedItem[], max: number): ParsedItem[][] {
  const chunks: ParsedItem[][] = [];
  for (let i = 0; i < items.length; i += max) chunks.push(items.slice(i, i + max));
  return chunks;
}

type PartialSlide = Omit<Slide, "slideNumber" | "totalSlides">;

const buildTitleSlide = (content: ParsedContent, theme: ThemeConfig): PartialSlide => ({
  id: nextId(),
  type: "TITLE_SLIDE",
  layout: "center",
  title: content.title,
  subtitle: content.subtitle,
  blocks: [],
  theme,
});

const buildSectionSlide = (section: ParsedSection, theme: ThemeConfig): PartialSlide => ({
  id: nextId(),
  type: "SECTION_SLIDE",
  layout: "center",
  title: section.title,
  blocks: [],
  theme,
});

const buildContentSlide = (
  sectionTitle: string,
  items: ParsedItem[],
  partIndex: number,
  theme: ThemeConfig
): PartialSlide => ({
  id: nextId(),
  type: "CONTENT_SLIDE",
  layout: detectLayout(items),
  title: partIndex > 0 ? `${sectionTitle} (cont.)` : sectionTitle,
  blocks: makeBlocks(items),
  theme,
});

const buildSummarySlide = (content: ParsedContent, theme: ThemeConfig): PartialSlide => ({
  id: nextId(),
  type: "SUMMARY_SLIDE",
  layout: "left",
  title: "Summary",
  blocks: content.sections.map((s) => ({ type: "list-item", content: s.title })),
  theme,
});

const buildCtaSlide = (content: ParsedContent, theme: ThemeConfig): PartialSlide => ({
  id: nextId(),
  type: "CTA_SLIDE",
  layout: "center",
  title: "Found this useful?",
  subtitle: `Save this ${content.title} for later`,
  blocks: [
    { type: "text", content: "Follow for more developer content" },
    { type: "badge", content: "Like • Share • Repost" },
  ],
  theme,
});

function numberSlides(partials: PartialSlide[]): Slide[] {
  const total = partials.length;
  return partials.map((s, i) => ({ ...s, slideNumber: i + 1, totalSlides: total }));
}

export function buildCarouselSchema(
  content: ParsedContent,
  theme: ThemeConfig = darkTheme
): CarouselSchema {
  resetCounter();

  const partials: PartialSlide[] = [buildTitleSlide(content, theme)];

  for (const section of content.sections) {
    if (section.items.length === 0) {
      partials.push(buildSectionSlide(section, theme));
      continue;
    }

    const chunks = chunkItems(section.items, MAX_ITEMS_PER_CONTENT_SLIDE);

    // Add a section divider only when content spans multiple slides
    if (chunks.length > 1) {
      partials.push(buildSectionSlide(section, theme));
    }

    chunks.forEach((chunk, idx) => {
      partials.push(buildContentSlide(section.title, chunk, idx, theme));
    });
  }

  if (content.sections.length > 2) {
    partials.push(buildSummarySlide(content, theme));
  }

  partials.push(buildCtaSlide(content, theme));

  return {
    slides: numberSlides(partials),
    meta: {
      title: content.title,
      totalSlides: partials.length,
      theme,
      generatedAt: new Date().toISOString(),
    },
  };
}
