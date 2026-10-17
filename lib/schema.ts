import { z } from "zod";

// Severity and Category Enums
export const ChargeSeveritySchema = z.enum(["Minor", "Serious", "Critical"]);
export type ChargeSeverity = z.infer<typeof ChargeSeveritySchema>;

export const ChargeCategorySchema = z.enum(["Logic", "Security", "Maintainability"]);
export type ChargeCategory = z.infer<typeof ChargeCategorySchema>;

// Individual Charge
export const ChargeSchema = z.object({
  id: z.string(),
  severity: ChargeSeveritySchema,
  category: ChargeCategorySchema,
  title: z.string(),
  description: z.string(),
  file: z.string().optional(),
  line: z.number().optional(),
});
export type Charge = z.infer<typeof ChargeSchema>;

// Courtroom Debate Speakers and Turns
export const SpeakerSchema = z.enum(["prosecutor", "defense", "judge"]);
export type Speaker = z.infer<typeof SpeakerSchema>;

export const DebateTurnSchema = z.object({
  speaker: SpeakerSchema,
  text: z.string(),
  chargeId: z.string().optional(),
});
export type DebateTurn = z.infer<typeof DebateTurnSchema>;

// Score breakdown (0-100)
export const TrialScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  logic: z.number().min(0).max(100),
  security: z.number().min(0).max(100),
  maintainability: z.number().min(0).max(100),
});
export type TrialScores = z.infer<typeof TrialScoresSchema>;

// Verdict rulings and sentence
export const VerdictRulingSchema = z.enum([
  "Guilty",
  "Not Guilty",
  "Guilty with Community Service",
]);
export type VerdictRuling = z.infer<typeof VerdictRulingSchema>;

export const TrialVerdictSchema = z.object({
  ruling: VerdictRulingSchema,
  summary: z.string(),
  sentence: z.array(z.string()), // ranked actionable fixes
});
export type TrialVerdict = z.infer<typeof TrialVerdictSchema>;

// Canned Objections for Demo and Offline Modes
export const CannedObjectionSchema = z.object({
  trigger: z.string(),
  ruling: z.enum(["Sustained", "Overruled"]),
  reply: z.string(),
});
export type CannedObjection = z.infer<typeof CannedObjectionSchema>;

// Appeal Data
export const AppealDataSchema = z.object({
  revisedCode: z.string(),
  previousScore: z.number().min(0).max(100),
  newScore: z.number().min(0).max(100),
  improvements: z.array(z.string()),
});
export type AppealData = z.infer<typeof AppealDataSchema>;

// Complete Trial Case Schema
export const TrialCaseSchema = z.object({
  id: z.string(),
  caseName: z.string(),
  timestamp: z.number(),
  codeSnippet: z.string(),
  language: z.string(),
  charges: z.array(ChargeSchema),
  debate: z.array(DebateTurnSchema),
  scores: TrialScoresSchema,
  verdict: TrialVerdictSchema,
  cannedObjections: z.array(CannedObjectionSchema).optional(),
  appealData: AppealDataSchema.optional(),
});
export type TrialCase = z.infer<typeof TrialCaseSchema>;

// API Request Schema for POST /api/trial
export const TrialApiRequestSchema = z.object({
  code: z.string().min(1, "Code snippet cannot be empty"),
  language: z.string().optional(),
  fileName: z.string().optional(),
});
export type TrialApiRequest = z.infer<typeof TrialApiRequestSchema>;
