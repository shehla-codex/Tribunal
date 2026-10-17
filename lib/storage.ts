import { TrialCase } from "./schema";

export interface HistoryItem {
  id: string;
  title: string;
  verdict: string;
  score: number;
  date: string;
  code: string;
  fullResult: TrialCase;
}

const STORAGE_KEY = "tribunal_history";

/**
 * Formats docket identifier cleanly without raw timestamps.
 */
export function formatDocketId(id: string): string {
  if (!id) return "DOCKET #UNASSIGNED";
  if (id === "demo-auth") return "DOCKET #AUTH-LEAK";
  if (id === "demo-async") return "DOCKET #ASYNC-RACE";
  if (id === "demo-sql") return "DOCKET #SQL-INJECT";
  if (id.startsWith("trial-")) {
    const raw = id.replace("trial-", "");
    const suffix = raw.slice(-5).toUpperCase();
    return `DOCKET #TR-${suffix}`;
  }
  if (id.startsWith("case-")) {
    const raw = id.replace("case-", "");
    const suffix = raw.slice(-5).toUpperCase();
    return `DOCKET #CS-${suffix}`;
  }
  return `DOCKET #${id.slice(-6).toUpperCase()}`;
}

/**
 * Score color mapping:
 * - High (70+): green/teal (#43877C)
 * - Medium (40-69): gold (#B67F3D)
 * - Low (<40): red (#D64545)
 */
export function getScoreColor(score: number): string {
  if (score >= 70) return "#43877C";
  if (score >= 40) return "#B67F3D";
  return "#D64545";
}

/**
 * Retrieve all saved cases from browser localStorage.
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse tribunal history from localStorage:", err);
    return [];
  }
}

/**
 * Save a completed trial (demo or live) to localStorage.
 */
export function saveTrialToHistory(trial: TrialCase): void {
  if (typeof window === "undefined" || !trial) return;
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      id: trial.id,
      title: trial.caseName,
      verdict: trial.verdict.ruling,
      score: trial.scores.overall,
      date: new Date().toISOString(),
      code: trial.codeSnippet,
      fullResult: trial,
    };

    const filtered = history.filter((item) => item.id !== trial.id);
    const updated = [newItem, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save trial to localStorage:", err);
  }
}

/**
 * Delete an individual trial record by ID.
 */
export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete trial from history:", err);
  }
}

/**
 * Clear all trial records from localStorage.
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history from localStorage:", err);
  }
}

/**
 * Find a specific trial record by ID.
 */
export function getHistoryItem(id: string): HistoryItem | undefined {
  const history = getHistory();
  return history.find((item) => item.id === id);
}
