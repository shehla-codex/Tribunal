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

export default function CodeReview() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("auto");
  const [fileName, setFileName] = useState<string>("");
  const [trial, setTrial] = useState<TrialCase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);

  // Check URL query parameters for ?case=demo-auth etc.
  useEffect(() => {
    const caseParam = searchParams.get("case");
    if (caseParam && DEMO_CASES[caseParam]) {
      loadDemo(caseParam);
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
                  <strong className="text-charcoal font-medium">Day 2 Milestone:</strong> Raw trial data is presented below in a structured, readable format. Animated courtroom debates and stamps arrive in Day 3.
                </p>
              </div>
            </div>

            {trial && (
              <div className="pt-3 border-t border-card-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-charcoal">Case Loaded:</span>
                  <span className="font-mono text-gold-primary font-semibold">{trial.id}</span>
                </div>
                <p className="text-xs font-serif font-bold text-charcoal mt-1">
                  {trial.caseName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raw Trial Result Display (Day 2 Milestone) */}
      {trial && (
        <div className="space-y-6 pt-4 border-t border-card-border">
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-primary">
                Day 2 Milestone Output
              </span>
              <h3 className="font-serif font-bold text-2xl text-charcoal">
                Trial Proceedings & Judicial Record
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-cream-200 text-charcoal font-mono">
                {trial.language}
              </span>
            </div>
          </div>

          {/* Verdict and Health Score Card */}
          <div className="p-6 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-card-border">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                  Official Ruling
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg sm:text-xl font-serif font-bold px-3 py-1 rounded-lg ${
                      trial.verdict.ruling === "Guilty"
                        ? "bg-prosecutor-crimson/10 text-prosecutor-crimson border border-prosecutor-crimson/20"
                        : trial.verdict.ruling === "Guilty with Community Service"
                        ? "bg-gold-primary/10 text-gold-primary border border-gold-primary/20"
                        : "bg-teal-accent/10 text-teal-accent border border-teal-accent/20"
                    }`}
                  >
                    {trial.verdict.ruling.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Score Badges */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-cream-100 border border-card-border">
                  <span className="block text-[10px] uppercase font-semibold text-charcoal-muted">Overall Health</span>
                  <span className="font-serif font-bold text-2xl text-charcoal">
                    {trial.scores.overall}<span className="text-xs font-sans text-charcoal-muted font-normal">/100</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-cream-50 border border-card-border text-center">
                    <span className="block text-[10px] text-charcoal-muted">Logic</span>
                    <span className="font-bold text-charcoal">{trial.scores.logic}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cream-50 border border-card-border text-center">
                    <span className="block text-[10px] text-charcoal-muted">Security</span>
                    <span className="font-bold text-charcoal">{trial.scores.security}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-cream-50 border border-card-border text-center">
                    <span className="block text-[10px] text-charcoal-muted">Maintainability</span>
                    <span className="font-bold text-charcoal">{trial.scores.maintainability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict Summary */}
            <div className="text-xs sm:text-sm text-charcoal leading-relaxed bg-cream-100/60 p-4 rounded-xl border border-card-border">
              <strong className="font-serif text-charcoal font-bold block mb-1">Judicial Summary:</strong>
              {trial.verdict.summary}
            </div>

            {/* Sentence / Actionable Fixes */}
            <div>
              <h4 className="font-serif font-bold text-sm text-charcoal mb-2.5 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-gold-primary" />
                <span>The Court's Sentence (Mandated Fixes):</span>
              </h4>
              <ol className="space-y-2">
                {trial.verdict.sentence.map((fix, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-charcoal flex items-start gap-2.5 p-2.5 rounded-lg bg-cream-50 border border-card-border/60"
                  >
                    <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{fix}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Charges Filed */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-prosecutor-crimson" />
              <span>Formal Charges Filed ({trial.charges.length})</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trial.charges.map((charge) => (
                <div
                  key={charge.id}
                  className="p-4 rounded-xl bg-card-surface border border-card-border shadow-2xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-charcoal-muted text-[11px]">
                        {charge.file ? `${charge.file}${charge.line ? `:${charge.line}` : ""}` : charge.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            charge.severity === "Critical"
                              ? "bg-prosecutor-crimson/10 text-prosecutor-crimson border border-prosecutor-crimson/20"
                              : charge.severity === "Serious"
                              ? "bg-gold-primary/10 text-gold-primary border border-gold-primary/20"
                              : "bg-cream-200 text-charcoal"
                          }`}
                        >
                          {charge.severity}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cream-100 text-charcoal-muted border border-card-border">
                          {charge.category}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-charcoal">
                      {charge.title}
                    </h5>

                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      {charge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courtroom Debate Transcript */}
          <div className="p-6 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                <Terminal className="w-5 h-5 text-defense-blue" />
                <span>Courtroom Debate Transcript ({trial.debate.length} Turns)</span>
              </h4>
              <span className="text-xs text-charcoal-muted">
                Turn-by-turn debate animation scheduled for Day 3
              </span>
            </div>

            <div className="space-y-3">
              {trial.debate.map((turn, idx) => {
                const isProsecutor = turn.speaker === "prosecutor";
                const isDefense = turn.speaker === "defense";
                const isJudge = turn.speaker === "judge";

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      isProsecutor
                        ? "bg-prosecutor-crimson/5 border-prosecutor-crimson/20"
                        : isDefense
                        ? "bg-defense-blue/5 border-defense-blue/20"
                        : "bg-gold-primary/5 border-gold-primary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span
                        className={
                          isProsecutor
                            ? "text-prosecutor-crimson uppercase tracking-wider"
                            : isDefense
                            ? "text-defense-blue uppercase tracking-wider"
                            : "text-gold-primary uppercase tracking-wider"
                        }
                      >
                        {isProsecutor
                          ? "Prosecutor Owl"
                          : isDefense
                          ? "Defense Owl"
                          : "Judge Owl"}
                      </span>
                      {turn.chargeId && (
                        <span className="font-mono text-charcoal-muted text-[10px]">
                          Ref: {turn.chargeId}
                        </span>
                      )}
                    </div>
                    <p className="text-charcoal">{turn.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demo Extras: Canned Objections & Appeal Preview (if present) */}
          {trial.cannedObjections && trial.cannedObjections.length > 0 && (
            <div className="p-5 rounded-2xl bg-cream-50 border border-card-border space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gold-primary" />
                  <span>Pre-written In-Character Objections (Demo Data for Day 5)</span>
                </h5>
                <span className="text-[11px] text-teal-accent font-medium">Ready for Objection Trigger</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {trial.cannedObjections.map((obj, i) => (
                  <div key={i} className="p-3 rounded-xl bg-card-surface border border-card-border text-xs space-y-1.5">
                    <p className="font-medium text-charcoal italic">"{obj.trigger}"</p>
                    <div className="text-[11px] flex items-center gap-1.5">
                      <span className={`font-bold ${obj.ruling === "Sustained" ? "text-teal-accent" : "text-prosecutor-crimson"}`}>
                        [{obj.ruling}]
                      </span>
                      <span className="text-charcoal-muted line-clamp-2">{obj.reply}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trial.appealData && (
            <div className="p-5 rounded-2xl bg-cream-50 border border-card-border space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-accent" />
                  <span>Appeal Fixed Code Version (Demo Data for Day 6)</span>
                </h5>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-accent/15 text-teal-accent">
                  Score: {trial.appealData.previousScore} ➔ {trial.appealData.newScore} (+{trial.appealData.newScore - trial.appealData.previousScore} pts)
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-medium text-charcoal">Implemented Improvements:</p>
                <ul className="list-disc list-inside text-charcoal-muted space-y-0.5">
                  {trial.appealData.improvements.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-card-surface border border-card-border rounded-xl p-3 overflow-x-auto max-h-48">
                <pre className="font-mono text-[11px] text-charcoal leading-relaxed whitespace-pre">
                  {trial.appealData.revisedCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
