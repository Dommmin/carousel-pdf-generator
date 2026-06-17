"use client";

import { useState } from "react";
import type { CarouselSchema, Slide } from "@/types";
import { SlidePreview } from "./SlidePreview";

interface CarouselPreviewProps {
  schema: CarouselSchema | null;
  isLoading: boolean;
  onExport: () => void;
  isExporting: boolean;
}

export function CarouselPreview({
  schema,
  isLoading,
  onExport,
  isExporting,
}: CarouselPreviewProps) {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
        <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm">Building your carousel…</p>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600">
        <div className="text-5xl opacity-30">📋</div>
        <p className="text-sm">Paste your markdown and click Generate</p>
        <p className="text-xs text-slate-700">Preview will appear here</p>
      </div>
    );
  }

  const { slides } = schema;
  const focused = slides[activeSlide];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm">{schema.meta.title}</h3>
          <p className="text-xs text-slate-500">{slides.length} slides</p>
        </div>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Exporting…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v6.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V4a1 1 0 00-1-1zM3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Large focused slide */}
      {focused && (
        <div className="flex-shrink-0">
          <SlidePreview slide={focused} isActive={false} />
        </div>
      )}

      {/* Thumbnail strip */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {slides.map((slide, idx) => (
            <SlidePreview
              key={slide.id}
              slide={slide}
              isActive={idx === activeSlide}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
