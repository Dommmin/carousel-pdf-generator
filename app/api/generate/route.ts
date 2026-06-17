import { NextRequest, NextResponse } from "next/server";
import { parseMarkdown } from "@/parser";
import { buildCarouselSchema } from "@/schema";
import { generatePdf } from "@/renderer/pdfGenerator";
import { darkTheme, lightTheme } from "@/schema/theme";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { markdown, theme: themeChoice } = body as {
      markdown: string;
      theme?: "dark" | "light";
    };

    if (!markdown || typeof markdown !== "string") {
      return NextResponse.json({ error: "markdown is required" }, { status: 400 });
    }

    if (markdown.trim().length === 0) {
      return NextResponse.json({ error: "markdown cannot be empty" }, { status: 400 });
    }

    const theme = themeChoice === "light" ? lightTheme : darkTheme;
    const parsed = parseMarkdown(markdown);

    if (!parsed.title) {
      return NextResponse.json(
        { error: "Markdown must start with an H1 title (# Your Title)" },
        { status: 400 }
      );
    }

    const schema = buildCarouselSchema(parsed, theme);
    const pdfBuffer = await generatePdf(schema);

    const filename = `${parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-carousel.pdf`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json(
      { error: "PDF generation failed. Please check your markdown and try again." },
      { status: 500 }
    );
  }
}
