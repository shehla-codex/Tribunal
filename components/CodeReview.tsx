"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Play, 
  Sparkles, 
  FileCode2, 
  AlertCircle, 
  Scale, 
  ShieldAlert, 
  Gavel, 
  RotateCcw, 
  CheckCircle2, 
  Check, 
  ChevronRight,
  Terminal,
  HelpCircle,
  FileCheck
} from "lucide-react";
import { TrialCase, Charge, DebateTurn } from "@/lib/schema";
import { DEMO_CASES, DEMO_CASE_LIST } from "@/data/demo-cases";
import { formatDocketId, saveTrialToHistory, getHistoryItem } from "@/lib/storage";
import Courtroom from "@/components/Courtroom";
import VerdictView from "@/components/VerdictView";

export default function CodeReview() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("auto");
  const [fileName, setFileName] = useState<string>("");
  const [trial, setTrial] = useState<TrialCase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);
  const [isDeliberationComplete, setIsDeliberationComplete] = useState<boolean>(false);

  // Check URL query parameters for ?case=demo-auth or ?history=case-...
  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (caseParam && DEMO_CASES[caseParam]) {
      loadDemo(caseParam);
      return;
    }

    const historyParam = searchParams.get("history");
    if (historyParam) {
      const item = getHistoryItem(historyParam);
      if (item) {
        setCode(item.fullResult.codeSnippet);
        setLanguage(item.fullResult.language);
        setFileName(item.fullResult.charges[0]?.file || "evidence.js");
        setTrial(item.fullResult);
        setActiveDemoId(null);
        setIsDeliberationComplete(true);
        setError(null);
      }
    }
  }, [searchParams]);

  // Load an offline demo case with 0 API calls
  const loadDemo = (id: string) => {
    const demo = DEMO_CASES[id];
    if (demo) {
      setCode(demo.codeSnippet);
      setLanguage(demo.language);
      setFileName(demo.charges[0]?.file || "evidence.js");
      setTrial(demo);
      setActiveDemoId(id);
      setIsDeliberationComplete(false);
      setError(null);
    }
  };

  // Submit code to server-side single-call API route /api/trial
  const handleStartTrial = async () => {
    if (!code.trim()) {
      setError("Please paste code snippet into evidence before submitting to court.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language === "auto" ? undefined : language,
          fileName: fileName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Court deliberation failed with status ${res.status}`);
      }

      setTrial(data);
      setActiveDemoId(null);
      setIsDeliberationComplete(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode("");
    setLanguage("auto");
    setFileName("");
    setTrial(null);
    setActiveDemoId(null);
    setIsDeliberationComplete(false);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header and Case Mode Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-card-border">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            The Docket: Enter Evidence
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Submit your snippet for one-call analysis, or test with offline demo cases.
          </p>
        </div>

        {/* Demo Case Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mr-1">
            Demo Cases:
          </span>
          {DEMO_CASE_LIST.map((demo) => {
            const isSelected = activeDemoId === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => loadDemo(demo.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-gold-primary text-cream-50 shadow-xs"
                    : "bg-card-surface border border-card-border text-charcoal hover:bg-cream-200"
                }`}
              >
                {demo.id === "demo-auth"
                  ? "Auth Leak"
                  : demo.id === "demo-async"
                  ? "Async Race"
                  : "SQL Injection"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-card-surface border border-card-border rounded-2xl overflow-hidden shadow-xs">
            {/* Editor Toolbar */}
            <div className="bg-cream-200/50 px-4 py-2.5 border-b border-card-border flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-gold-primary" />
                <input
                  type="text"
                  placeholder="Filename (e.g. auth.js, query.py)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="bg-card-surface border border-card-border rounded-md px-2 py-1 text-xs text-charcoal focus:outline-hidden focus:border-gold-primary w-48 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-card-surface border border-card-border rounded-md px-2 py-1 text-xs text-charcoal focus:outline-hidden focus:border-gold-primary"
                >
                  <option value="auto">Auto-detect Language</option>
                  <option value="Node.js / Express">Node.js / Express</option>
                  <option value="TypeScript / React">TypeScript / React</option>
                  <option value="Python / FastAPI">Python / FastAPI</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                </select>

                {activeDemoId && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-accent/15 text-teal-accent border border-teal-accent/20">
                    Offline Demo Active
                  </span>
                )}
              </div>
            </div>

            {/* Code Textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (activeDemoId) setActiveDemoId(null);
                }}
                rows={16}
                placeholder="// Paste suspect code here into evidence...&#10;// Example: Express route, async React hook, or SQL database query"
                className="w-full p-4 font-mono text-xs leading-relaxed text-charcoal bg-transparent resize-y focus:outline-hidden"
                spellCheck={false}
              />
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-cream-100/60 px-4 py-3 border-t border-card-border flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-charcoal-muted hover:text-charcoal flex items-center gap-1.5 transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Editor</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleStartTrial}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  loading
                    ? "bg-hero-charcoal/50 text-cream-200 cursor-not-allowed"
                    : "bg-hero-charcoal text-cream-50 hover:bg-hero-charcoal/90 shadow-xs hover:shadow"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
                    <span>The Court is Deliberating...</span>
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4 text-gold-primary" />
                    <span>Bring Code Before Court</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-prosecutor-crimson/10 border border-prosecutor-crimson/20 text-xs text-charcoal flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-prosecutor-crimson shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-prosecutor-crimson">Court Adjourned: Deliberation Halted</p>
                <p className="text-charcoal-muted leading-relaxed">{error}</p>
                <p className="text-[11px] text-charcoal-muted">
                  Tip: You can always click any of the <strong>Demo Cases</strong> above to test complete courtroom trials 100% offline with zero API calls.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Case Instructions & Active Case Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-gold-primary" />
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Courtroom Protocol
              </h3>
            </div>

            <div className="space-y-3 text-xs text-charcoal-muted leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  <strong className="text-charcoal font-medium">Single-Call Analysis:</strong> Pasting live code sends exactly ONE server-side request to Gemini to construct charges, debate turns, scores, and verdict.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  <strong className="text-charcoal font-medium">Offline Demo Mode:</strong> The 3 Demo Case buttons above load pre-computed trials instantly from local JSON without calling external APIs.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  <strong className="text-charcoal font-medium">Courtroom Deliberation:</strong> Watch the Prosecutor and Defense argue each charge before Chief Justice Owl hands down the verdict and code health score.
                </p>
              </div>
            </div>

            {trial && (
              <div className="pt-3 border-t border-card-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-charcoal">Case Loaded:</span>
                  <span className="font-mono text-gold-primary font-semibold">{formatDocketId(trial.id)}</span>
                </div>
                <p className="text-xs font-serif font-bold text-charcoal mt-1">
                  {trial.caseName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courtroom View & Verdict */}
      {trial && (
        <div className="space-y-8 pt-4 border-t border-card-border">
          {/* Animated Courtroom Debate & Charges */}
          <Courtroom
            trial={trial}
            onDeliberationComplete={() => {
              setIsDeliberationComplete(true);
              if (trial) {
                saveTrialToHistory(trial);
              }
            }}
            isDeliberationComplete={isDeliberationComplete}
          />

          {/* Verdict View (appears once deliberation is complete or skipped) */}
          {isDeliberationComplete && (
            <VerdictView trial={trial} />
          )}
        </div>
      )}
    </div>
  );
}
