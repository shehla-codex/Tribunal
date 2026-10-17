import { NextRequest, NextResponse } from "next/server";
import { TrialApiRequestSchema } from "@/lib/schema";
import { generateCourtTrial } from "@/lib/llm";

export async function POST(req: NextRequest) {
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
