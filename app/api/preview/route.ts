import { NextRequest, NextResponse } from "next/server";
import { parseMarkdown } from "@/parser";
import { buildCarouselSchema } from "@/schema";
import { darkTheme, lightTheme } from "@/schema/theme";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { markdown, theme: themeChoice } = body as {
      markdown: string;
      theme?: "dark" | "light";
    };

    if (!markdown || typeof markdown !== "string" || markdown.trim().length === 0) {
      return NextResponse.json({ slides: [], error: "Empty markdown" }, { status: 400 });
    }

    const theme = themeChoice === "light" ? lightTheme : darkTheme;
    const parsed = parseMarkdown(markdown);
    const schema = buildCarouselSchema(parsed, theme);

    return NextResponse.json(schema);
  } catch (err) {
    console.error("[/api/preview]", err);
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
