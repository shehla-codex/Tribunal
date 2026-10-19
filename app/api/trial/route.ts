import { NextRequest, NextResponse } from "next/server";
import { TrialApiRequestSchema } from "@/lib/schema";
import { generateCourtTrial } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Best-effort per-IP rate limit: 5 requests per hour
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip, "trial")) {
    return NextResponse.json(
      {
        error:
          "The court's docket is full for now. Try Demo Mode or come back later.",
      },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const validationResult = TrialApiRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { code, language, fileName } = validationResult.data;

    const trial = await generateCourtTrial(code, language, fileName);

    return NextResponse.json(trial, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected courtroom error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
