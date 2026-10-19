import { NextRequest, NextResponse } from "next/server";
import { ObjectionApiRequestSchema } from "@/lib/schema";
import { judgeObjection } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Best-effort per-IP rate limit: 15 objections per hour
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip, "objection")) {
    // Return friendly in-character ruling — same shape as a normal response so UI never crashes
    return NextResponse.json(
      {
        ruling: "Overruled",
        reply:
          "The court's docket is full for now. Try Demo Mode or come back later.",
      },
      { status: 200 }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody) {
      return NextResponse.json(
        {
          ruling: "Overruled",
          reply: "The court is in recess, please try again.",
        },
        { status: 200 }
      );
    }

    const validationResult = ObjectionApiRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          ruling: "Overruled",
          reply: "The court is in recess, please try again.",
        },
        { status: 200 }
      );
    }

    const { caseSummary, charges, objectionText } = validationResult.data;

    const result = await judgeObjection({
      caseSummary,
      charges,
      objectionText,
    });

    return NextResponse.json(result, { status: 200 });
  } catch {
    // Always provide friendly in-character fallback without crashing
    return NextResponse.json(
      {
        ruling: "Overruled",
        reply: "The court is in recess, please try again.",
      },
      { status: 200 }
    );
  }
}
