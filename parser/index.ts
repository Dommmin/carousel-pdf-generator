import type { ParsedContent, ParsedSection, ParsedItem } from "@/types";

// Puppeteer chosen over Playwright: smaller install footprint, native Node.js API,
// no separate browser management daemon needed for Next.js API routes.

const BLANK_LINE = /^\s*$/;
const H1 = /^#\s+(.+)$/;
const H2 = /^##\s+(.+)$/;
const CODE_BLOCK_FENCE = /^```/;
const INLINE_CODE = /^`([^`]+)`\s*(.*)$/;

type LineKind =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "blank" }
  | { kind: "code-fence" }
  | { kind: "text"; text: string };

function classify(line: string): LineKind {
  const h1 = H1.exec(line);
  if (h1) return { kind: "h1", text: h1[1].trim() };
  const h2 = H2.exec(line);
  if (h2) return { kind: "h2", text: h2[1].trim() };
  if (CODE_BLOCK_FENCE.test(line)) return { kind: "code-fence" };
  if (BLANK_LINE.test(line)) return { kind: "blank" };
  return { kind: "text", text: line.trim() };
}

function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .trim();
}

export function parseMarkdown(raw: string): ParsedContent {
  const lines = raw.split("\n");
  let title = "";
  let subtitle: string | undefined;
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;
  let inCodeBlock = false;
  let pendingCodeLines: string[] = [];
  let pendingDescription = "";

  function flushPendingItem() {
    if (!currentSection) return;
    if (pendingCodeLines.length === 0 && !pendingDescription) return;

    const command = pendingCodeLines.join("\n").trim();
    const description = pendingDescription.trim();

    if (command || description) {
      currentSection.items.push({
        command: command || description,
        description: command ? description : "",
      });
    }
    pendingCodeLines = [];
    pendingDescription = "";
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const classified = classify(line);

    if (classified.kind === "code-fence") {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        // closing fence — description may follow on next non-blank line
      }
      continue;
    }

    if (inCodeBlock) {
      pendingCodeLines.push(line);
      continue;
    }

    if (classified.kind === "h1") {
      title = classified.text;
      continue;
    }

    if (classified.kind === "h2") {
      flushPendingItem();
      currentSection = { title: classified.text, items: [] };
      sections.push(currentSection);
      continue;
    }

    if (classified.kind === "blank") {
      // blank line between a command block and description or between items
      const nextNonBlank = findNextNonBlank(lines, i + 1);
      if (
        pendingCodeLines.length > 0 &&
        nextNonBlank &&
        classify(nextNonBlank).kind === "text"
      ) {
        // next line is the description — let loop handle it
      } else if (pendingCodeLines.length > 0 || pendingDescription) {
        flushPendingItem();
      }
      continue;
    }

    if (classified.kind === "text") {
      const text = classified.text;

      if (!title) {
        // lines before H1 are ignored
        continue;
      }

      if (!currentSection && !subtitle) {
        subtitle = stripMarkdownFormatting(text);
        continue;
      }

      if (!currentSection) continue;

      // Detect inline code command pattern: `command` description
      const inlineCode = INLINE_CODE.exec(text);
      if (inlineCode) {
        flushPendingItem();
        pendingCodeLines = [inlineCode[1]];
        pendingDescription = inlineCode[2]
          ? stripMarkdownFormatting(inlineCode[2])
          : "";
        flushPendingItem();
        continue;
      }

      // If we have pending code lines, this text is its description
      if (pendingCodeLines.length > 0 && !pendingDescription) {
        pendingDescription = stripMarkdownFormatting(text);
        flushPendingItem();
        continue;
      }

      // Plain text item (checklist item, mistake, etc.)
      // Handle markdown checklist syntax: - [ ] or - [x] or - text or * text
      const listItem = /^[-*+]\s+(?:\[[ xX]\]\s+)?(.+)$/.exec(text);
      if (listItem) {
        flushPendingItem();
        currentSection.items.push({
          command: "",
          description: stripMarkdownFormatting(listItem[1]),
        });
        continue;
      }

      // Numbered list: 1. text
      const numberedItem = /^\d+\.\s+(.+)$/.exec(text);
      if (numberedItem) {
        flushPendingItem();
        currentSection.items.push({
          command: "",
          description: stripMarkdownFormatting(numberedItem[1]),
        });
        continue;
      }

      // Bare text — treat as either a command (if short, no spaces) or description
      const isLikelyCommand =
        /^[a-z]/.test(text) &&
        (text.includes(" ") ? text.split(" ").length <= 6 : true) &&
        !text.endsWith(".");

      if (pendingCodeLines.length === 0 && isLikelyCommand) {
        flushPendingItem();
        pendingCodeLines = [text];
      } else if (pendingCodeLines.length > 0) {
        pendingDescription = stripMarkdownFormatting(text);
        flushPendingItem();
      } else {
        // general text description item
        flushPendingItem();
        currentSection.items.push({
          command: "",
          description: stripMarkdownFormatting(text),
        });
      }
    }
  }

  flushPendingItem();

  return { title, subtitle, sections };
}

function findNextNonBlank(lines: string[], from: number): string | null {
  for (let i = from; i < lines.length; i++) {
    if (!BLANK_LINE.test(lines[i])) return lines[i];
  }
  return null;
}
