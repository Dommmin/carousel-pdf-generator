"use client";

import { useRef } from "react";
import type { Template } from "@/types";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  templates: Template[];
  onTemplateLoad: (markdown: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

export function MarkdownEditor({
  value,
  onChange,
  templates,
  onTemplateLoad,
  isLoading,
  onGenerate,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Template pills */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center mr-1">Examples:</span>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onTemplateLoad(t.markdown)}
            className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors"
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={`# Your Title\n\n## Section Name\n\`\`\`\nyour command here\n\`\`\`\nShort description\n\n- Checklist item\n- Another item`}
        className="flex-1 w-full bg-slate-900 text-slate-200 text-sm font-mono leading-relaxed rounded-lg border border-slate-700 p-4 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
      />

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-600">
          {value.trim() ? `${value.split("\n").length} lines` : "Empty"}
        </span>
        <button
          onClick={onGenerate}
          disabled={isLoading || !value.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Generate Carousel
            </>
          )}
        </button>
      </div>
    </div>
  );
}
