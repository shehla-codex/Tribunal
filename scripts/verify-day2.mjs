import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoDir = path.resolve(__dirname, "../data/demo-cases");

// Define schema matching lib/schema.ts in pure JS/Zod for validation script
const ChargeSeveritySchema = z.enum(["Minor", "Serious", "Critical"]);
const ChargeCategorySchema = z.enum(["Logic", "Security", "Maintainability"]);

const ChargeSchema = z.object({
  id: z.string(),
  severity: ChargeSeveritySchema,
  category: ChargeCategorySchema,
  title: z.string(),
  description: z.string(),
  file: z.string().optional(),
  line: z.number().optional(),
});

const SpeakerSchema = z.enum(["prosecutor", "defense", "judge"]);

const DebateTurnSchema = z.object({
  speaker: SpeakerSchema,
  text: z.string(),
  chargeId: z.string().optional(),
});

const TrialScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  logic: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  maintainability: z.number().min(0).max(100),
});

const VerdictRulingSchema = z.enum([
  "Guilty",
  "Not Guilty",
  "Guilty with Community Service",
]);

const TrialVerdictSchema = z.object({
  ruling: VerdictRulingSchema,
  summary: z.string(),
  sentence: z.array(z.string()),
});

const CannedObjectionSchema = z.object({
  trigger: z.string(),
  ruling: z.enum(["Sustained", "Overruled"]),
  reply: z.string(),
});

const AppealDataSchema = z.object({
  revisedCode: z.string(),
  previousScore: z.number().min(0).max(100),
  newScore: z.number().min(0).max(100),
  improvements: z.array(z.string()),
});

const TrialCaseSchema = z.object({
  id: z.string(),
  caseName: z.string(),
  timestamp: z.number(),
  codeSnippet: z.string(),
  language: z.string(),
  charges: z.array(ChargeSchema),
  debate: z.array(DebateTurnSchema),
  scores: TrialScoresSchema,
  verdict: TrialVerdictSchema,
  cannedObjections: z.array(CannedObjectionSchema),
  appealData: AppealDataSchema,
});

const demoFiles = ["demo-auth.json", "demo-async.json", "demo-sql.json"];
let allPassed = true;

console.log("Checking Demo Cases against strict TrialCase schema...\n");

for (const file of demoFiles) {
  const filePath = path.join(demoDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] File missing: ${file}`);
    allPassed = false;
    continue;
  }

  try {
    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const result = TrialCaseSchema.safeParse(rawData);

    if (!result.success) {
      console.error(`[FAIL] ${file} failed schema validation:`, JSON.stringify(result.error.flatten(), null, 2));
      allPassed = false;
    } else {
      console.log(`[PASS] ${file}:`);
      console.log(`       Case: "${result.data.caseName}"`);
      console.log(`       Ruling: "${result.data.verdict.ruling}" | Score: ${result.data.scores.overall}`);
      console.log(`       Charges: ${result.data.charges.length} | Debate turns: ${result.data.debate.length}`);
      console.log(`       Objections: ${result.data.cannedObjections.length} | Appeal fixed code: present (New Score: ${result.data.appealData.newScore})\n`);
    }
  } catch (err) {
    console.error(`[ERROR] Parsing ${file}:`, err);
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log("All 3 offline demo cases verified successfully!");
}
