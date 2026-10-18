import {
  TrialCase,
  TrialCaseSchema,
  ObjectionApiResponse,
  ObjectionApiResponseSchema,
} from "./schema";
import { buildTrialPrompt } from "./prompts";

/**
 * Strips markdown code blocks if the LLM wrapped its JSON response in fences.
 */
function extractJsonFromText(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Calls Gemini REST API to conduct the trial analysis in a single call.
 * Retries once if the output fails JSON parsing or Zod schema validation.
 */
export async function generateCourtTrial(
  code: string,
  language?: string,
  fileName?: string
): Promise<TrialCase> {
  const apiKey = process.env.LLM_API_KEY?.trim();
  const model = process.env.LLM_MODEL?.trim() || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error(
      "Court Adjourned: LLM_API_KEY is not configured on the server. Please configure it in .env.local or run in Demo Mode."
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const basePrompt = buildTrialPrompt(code, language, fileName);

  const attemptCall = async (promptText: string, isRetry: boolean): Promise<TrialCase> => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          temperature: isRetry ? 0.0 : 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errMsg =
        errorData?.error?.message ||
        `Courtroom LLM service responded with status code ${res.status}`;
      throw new Error(`Gemini Deliberation Error: ${errMsg}`);
    }

    const responseJson = await res.json();
    const candidateText = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || typeof candidateText !== "string") {
      throw new Error("Courtroom Deliberation Error: The model returned an empty transcript.");
    }

    const cleanedJson = extractJsonFromText(candidateText);
    const parsedData = JSON.parse(cleanedJson);

    // Validate with Zod schema
    const validatedTrial = TrialCaseSchema.parse({
      ...parsedData,
      id: parsedData.id && !parsedData.id.startsWith("trial-")
        ? parsedData.id
        : `case-${Date.now().toString(36).toUpperCase()}`,
      timestamp: parsedData.timestamp || Date.now(),
      codeSnippet: code, // preserve clean unnumbered original code for editor & viewer
      language: parsedData.language || language || "plaintext",
    });

    return validatedTrial;
  };

  try {
    return await attemptCall(basePrompt, false);
  } catch (firstError) {
    // Retry once with strict temperature and explicit JSON instruction
    const retryPrompt = `${basePrompt}\n\nIMPORTANT: The previous attempt failed validation. You MUST return ONLY a strictly valid JSON object matching the requested schema with no syntax errors, no comments, and no trailing commas.`;
    try {
      return await attemptCall(retryPrompt, true);
    } catch (secondError) {
      const message =
        secondError instanceof Error ? secondError.message : "Validation failed";
      throw new Error(`Trial generation failed after retry: ${message}`);
    }
  }
}

/**
 * Calls Gemini REST API to rule on a courtroom objection in character as Chief Justice Owl.
 * Retries once if the output fails JSON parsing or Zod schema validation.
 */
export async function judgeObjection(params: {
  caseSummary?: string;
  charges?: { title: string; description: string; severity?: string }[];
  objectionText: string;
}): Promise<ObjectionApiResponse> {
  const apiKey = process.env.LLM_API_KEY?.trim();
  const model = process.env.LLM_MODEL?.trim() || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error(
      "Court Adjourned: LLM_API_KEY is not configured on the server. Please configure it in .env.local or run in Demo Mode."
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;

  const chargesContext = (params.charges || [])
    .map((c, i) => `${i + 1}. [${c.severity || "Charge"}] ${c.title}: ${c.description}`)
    .join("\n");

  const prompt = `You are Chief Justice Owl, the wise, authoritative, and impartial presiding judge of the Tribunal Court of Code Quality.
Counsel has raised an immediate OBJECTION during the courtroom deliberation.

=== CASE CONTEXT ===
Summary: ${params.caseSummary || "Code under review for software defects and security hazards."}

Formal Charges:
${chargesContext || "None specified."}

=== OBJECTION RAISED BY COUNSEL ===
"${params.objectionText}"
===================================

Rule on this objection as Chief Justice Owl.
- Ruling must be strictly either "Sustained" (if counsel raises a legitimate point, intended design, valid mitigation, or false positive) or "Overruled" (if counsel is offering an excuse for genuine security/logic/maintainability flaws).
- The reply must be 1 to 2 sentences spoken in-character with judicial gravity and technical wisdom.

Return a JSON object strictly matching this schema:
{
  "ruling": "Sustained" | "Overruled",
  "reply": "1-2 sentence in-character judicial ruling explanation."
}

OUTPUT ONLY PURE JSON. Do not include markdown code blocks or explanatory text.`;

  const attemptCall = async (
    promptText: string,
    isRetry: boolean
  ): Promise<ObjectionApiResponse> => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: isRetry ? 0.0 : 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errMsg =
        errorData?.error?.message ||
        `Objection deliberation responded with status ${res.status}`;
      throw new Error(`Gemini Objection Error: ${errMsg}`);
    }

    const responseJson = await res.json();
    const candidateText =
      responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || typeof candidateText !== "string") {
      throw new Error("Objection Error: The model returned an empty transcript.");
    }

    const cleanedJson = extractJsonFromText(candidateText);
    const parsedData = JSON.parse(cleanedJson);

    return ObjectionApiResponseSchema.parse(parsedData);
  };

  try {
    return await attemptCall(prompt, false);
  } catch (firstError) {
    const retryPrompt = `${prompt}\n\nIMPORTANT: The previous attempt failed validation. Return ONLY a valid JSON object matching { "ruling": "Sustained" | "Overruled", "reply": string }.`;
    try {
      return await attemptCall(retryPrompt, true);
    } catch (secondError) {
      const message =
        secondError instanceof Error ? secondError.message : "Validation failed";
      throw new Error(`Objection ruling failed after retry: ${message}`);
    }
  }
}

