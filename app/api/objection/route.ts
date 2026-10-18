import { NextRequest, NextResponse } from "next/server";
import { ObjectionApiRequestSchema } from "@/lib/schema";
import { judgeObjection } from "@/lib/llm";

export async function POST(req: NextRequest) {
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
