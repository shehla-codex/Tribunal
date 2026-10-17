import { TrialCase } from "@/lib/schema";
import demoAuth from "./demo-auth.json";
import demoAsync from "./demo-async.json";
import demoSql from "./demo-sql.json";

export const DEMO_CASES: Record<string, TrialCase> = {
  "demo-auth": demoAuth as unknown as TrialCase,
  "demo-async": demoAsync as unknown as TrialCase,
  "demo-sql": demoSql as unknown as TrialCase,
};

export function getDemoCase(id: string): TrialCase | null {
  return DEMO_CASES[id] || null;
}

export const DEMO_CASE_LIST: TrialCase[] = [
  demoAuth as unknown as TrialCase,
  demoAsync as unknown as TrialCase,
  demoSql as unknown as TrialCase,
];
