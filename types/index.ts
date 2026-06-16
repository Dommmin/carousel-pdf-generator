// Core domain types for the LinkedIn Carousel Generator

export interface ParsedItem {
  command: string;
  description: string;
}

export interface ParsedSection {
  title: string;
  items: ParsedItem[];
}

export interface ParsedContent {
  title: string;
  subtitle?: string;
  sections: ParsedSection[];
}

export type SlideType =
  | "TITLE_SLIDE"
  | "SECTION_SLIDE"
  | "CONTENT_SLIDE"
  | "SUMMARY_SLIDE"
  | "CTA_SLIDE";

export type LayoutType = "center" | "left" | "code-heavy";

export type ContentBlockType = "text" | "code" | "list-item" | "badge";

export interface ContentBlock {
  type: ContentBlockType;
  content: string;
  label?: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  layout: LayoutType;
  title: string;
  subtitle?: string;
  blocks: ContentBlock[];
  slideNumber: number;
  totalSlides: number;
  theme: ThemeConfig;
}

export interface ThemeConfig {
  bg: string;
  text: string;
  accent: string;
  code: string;
  codeBg: string;
  muted: string;
  border: string;
}

export interface CarouselSchema {
  slides: Slide[];
  meta: {
    title: string;
    totalSlides: number;
    theme: ThemeConfig;
    generatedAt: string;
  };
}

export type BuiltinTemplate = "docker" | "laravel-security" | "devops-mistakes";

export interface Template {
  id: BuiltinTemplate;
  name: string;
  description: string;
  markdown: string;
}
