"use client";

import { useState, useCallback } from "react";
import type { CarouselSchema } from "@/types";
import { templates } from "@/templates";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { CarouselPreview } from "@/components/CarouselPreview";

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(templates[0].markdown);
  const [schema, setSchema] = useState<CarouselSchema | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!markdown.trim()) return;
    setIsPreviewing(true);
    setError(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Preview failed");
      }

      const data: CarouselSchema = await res.json();
      setSchema(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsPreviewing(false);
    }
  }, [markdown]);

  const handleExport = useCallback(async () => {
    if (!markdown.trim()) return;
    setIsExporting(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const nameMatch = /filename="([^"]+)"/.exec(disposition);
      a.download = nameMatch?.[1] ?? "carousel.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  }, [markdown]);

  const handleTemplateLoad = useCallback((md: string) => {
    setMarkdown(md);
    setSchema(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="flex-shrink-0 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-100">Carousel Generator</span>
          <span className="hidden sm:block text-xs text-slate-600 font-medium px-2 py-0.5 bg-slate-800 rounded">
            LinkedIn PDF
          </span>
        </div>
        <span className="text-xs text-slate-600">Markdown → LinkedIn Carousel</span>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 mx-6 mt-3 px-4 py-3 bg-red-950 border border-red-800 rounded-lg text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300 ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Main layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6" style={{ height: "calc(100vh - 57px)" }}>
        {/* Left panel — Editor */}
        <div className="flex flex-col w-1/2 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Markdown Input
            </h2>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <MarkdownEditor
              value={markdown}
              onChange={setMarkdown}
              templates={templates}
              onTemplateLoad={handleTemplateLoad}
              isLoading={isPreviewing}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex-shrink-0 w-px bg-slate-800" />

        {/* Right panel — Preview */}
        <div className="flex flex-col w-1/2 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Slide Preview
            </h2>
            {schema && (
              <span className="text-xs text-indigo-400 font-medium">
                {schema.slides.length} slides ready
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            <CarouselPreview
              schema={schema}
              isLoading={isPreviewing}
              onExport={handleExport}
              isExporting={isExporting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
