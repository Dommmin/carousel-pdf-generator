"use client";

import type { Slide, ContentBlock } from "@/types";

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "code":
      return (
        <div className="my-1.5 rounded bg-slate-800 border-l-2 border-indigo-500 px-3 py-2">
          <code className="text-[11px] leading-relaxed text-cyan-300 font-mono whitespace-pre-wrap break-all">
            {block.content}
          </code>
        </div>
      );
    case "text":
      return (
        <p className="text-[11px] text-slate-400 leading-relaxed my-1">{block.content}</p>
      );
    case "list-item":
      return (
        <div className="flex items-start gap-2 my-1">
          <span className="text-indigo-400 text-sm font-bold flex-shrink-0">→</span>
          <span className="text-[11px] text-slate-200 leading-snug">{block.content}</span>
        </div>
      );
    case "badge":
      return (
        <div className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white text-[10px] font-semibold rounded-full tracking-wide">
          {block.content}
        </div>
      );
    default:
      return null;
  }
}

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-10 h-1 bg-indigo-500 rounded mb-5" />
      <h1 className="text-xl font-extrabold text-white leading-tight tracking-tight mb-3">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-[11px] text-slate-400 max-w-[220px] leading-relaxed">{slide.subtitle}</p>
      )}
    </div>
  );
}

function SectionSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col justify-center h-full px-8">
      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
        Section
      </span>
      <h2 className="text-lg font-extrabold text-white leading-tight">{slide.title}</h2>
      <div className="w-8 h-0.5 bg-indigo-500 rounded mt-4" />
    </div>
  );
}

function ContentSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col h-full px-5 py-4">
      <div className="mb-3">
        <h2 className="text-[13px] font-bold text-indigo-400 leading-tight">{slide.title}</h2>
        <div className="w-6 h-0.5 bg-indigo-500 opacity-50 rounded mt-1" />
      </div>
      <div className="flex-1 overflow-hidden">
        {slide.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

function SummarySlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col h-full px-5 py-4">
      <div className="mb-4">
        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Recap</span>
        <h2 className="text-base font-extrabold text-white mt-1">{slide.title}</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        {slide.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </div>
  );
}

function CtaSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="text-3xl mb-3">🔖</div>
      <h2 className="text-base font-extrabold text-white mb-2 leading-tight">{slide.title}</h2>
      {slide.subtitle && (
        <p className="text-[11px] text-slate-400 mb-3">{slide.subtitle}</p>
      )}
      {slide.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.type) {
    case "TITLE_SLIDE":   return <TitleSlide slide={slide} />;
    case "SECTION_SLIDE": return <SectionSlide slide={slide} />;
    case "CONTENT_SLIDE": return <ContentSlide slide={slide} />;
    case "SUMMARY_SLIDE": return <SummarySlide slide={slide} />;
    case "CTA_SLIDE":     return <CtaSlide slide={slide} />;
    default:              return null;
  }
}

interface SlidePreviewProps {
  slide: Slide;
  isActive?: boolean;
  onClick?: () => void;
}

export function SlidePreview({ slide, isActive, onClick }: SlidePreviewProps) {
  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${
        isActive ? "ring-2 ring-indigo-500 scale-[1.02]" : "hover:ring-1 hover:ring-slate-600"
      }`}
      onClick={onClick}
    >
      {/* Fixed aspect ratio 1:1 container */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0 bg-slate-900 rounded-lg overflow-hidden flex flex-col">
          <SlideContent slide={slide} />
          {/* Slide number badge */}
          <div className="absolute bottom-2 right-2.5 text-[9px] text-slate-500 font-medium">
            {slide.slideNumber} / {slide.totalSlides}
          </div>
        </div>
      </div>
    </div>
  );
}
