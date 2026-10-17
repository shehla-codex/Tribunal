"use client";

import React, { useState, useEffect } from "react";
import { 
  Gavel, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  FileCode2, 
  TrendingUp, 
  FileCheck, 
  Copy, 
  Check, 
  AlertCircle,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { TrialCase, Charge } from "@/lib/schema";

interface VerdictViewProps {
  trial: TrialCase;
}

export default function VerdictView({ trial }: VerdictViewProps) {
  const [activeTab, setActiveTab] = useState<"findings" | "suggestions" | "appeal">("findings");
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const [barsLoaded, setBarsLoaded] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const { verdict, scores, charges, appealData } = trial;

  // Animated count-up for Code Health Score
  useEffect(() => {
    setAnimatedScore(0);
    setBarsLoaded(false);

    const duration = 1200;
    const steps = 35;
    const target = scores.overall;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    const barTimer = setTimeout(() => {
      setBarsLoaded(true);
    }, 150);

    return () => {
      clearInterval(timer);
      clearTimeout(barTimer);
    };
  }, [trial.id, scores.overall]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Determine ruling stamp styling
  const isGuilty = verdict.ruling === "Guilty";
  const isCommunityService = verdict.ruling === "Guilty with Community Service";
  const isNotGuilty = verdict.ruling === "Not Guilty";

  const stampColor = isGuilty 
    ? "#D64545" 
    : isCommunityService 
    ? "#B67F3D" 
    : "#43877C";

  // Score Ring SVG circumference (radius 44)
  const radius = 44;
  const circumference = 2 * Math.PI * radius; // ~276.46
  const strokeOffset = circumference - (circumference * animatedScore) / 100;

  const scoreColor = scores.overall < 60 
    ? "#D64545" 
    : scores.overall < 85 
    ? "#B67F3D" 
    : "#43877C";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Verdict & Code Health Scoring Panel */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card-surface border border-card-border shadow-md space-y-8 relative overflow-hidden">
        {/* Top Header & Official Stamp */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-card-border">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-gold-primary" />
              <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                Official Judicial Determination
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal leading-tight">
              {trial.caseName}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              The court has concluded deliberations and rendered its final verdict on the submitted evidence.
            </p>
          </div>

          {/* Animated Rubber Stamp */}
          <div className="shrink-0 flex items-center justify-center lg:justify-end">
            <div
              className="animate-stamp inline-block px-6 py-3 border-4 border-dashed rounded-xl uppercase font-serif font-extrabold text-xl sm:text-2xl tracking-widest shadow-sm select-none"
              style={{
                borderColor: stampColor,
                color: stampColor,
                backgroundColor: `${stampColor}12`,
              }}
            >
              {verdict.ruling}
            </div>
          </div>
        </div>

        {/* Score Ring & Category Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular SVG Code Health Score Ring */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-cream-50 border border-card-border text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
                {/* Background track circle */}
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  stroke="#E8E2D8"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated progress circle */}
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Score Number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-charcoal">
                  {animatedScore}
                </span>
                <span className="text-[11px] font-sans font-medium text-charcoal-muted -mt-1">
                  out of 100
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-serif font-bold text-base text-charcoal">
                Code Health Score
              </h5>
              <p className="text-[11px] text-charcoal-muted mt-0.5">
                Composite evaluation across judicial benchmarks
              </p>
            </div>
          </div>

          {/* Logic, Security, Maintainability Horizontal Bars */}
          <div className="md:col-span-7 space-y-4">
            <h5 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
              <Scale className="w-4 h-4 text-gold-primary" />
              <span>Category Score Breakdown</span>
            </h5>

            <div className="space-y-4">
              {/* Logic Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-charcoal flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-defense-blue" />
                    <span>Logic & Correctness</span>
                  </span>
                  <span className="font-mono font-bold text-charcoal">{scores.logic}/100</span>
                </div>
                <div className="h-3 w-full bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-defense-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: barsLoaded ? `${scores.logic}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Security Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-charcoal flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]" />
                    <span>Security & Vulnerabilities</span>
                  </span>
                  <span className="font-mono font-bold text-charcoal">{scores.security}/100</span>
                </div>
                <div className="h-3 w-full bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D64545] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: barsLoaded ? `${scores.security}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Maintainability Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-charcoal flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-primary" />
                    <span>Maintainability & Architecture</span>
                  </span>
                  <span className="font-mono font-bold text-charcoal">{scores.maintainability}/100</span>
                </div>
                <div className="h-3 w-full bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: barsLoaded ? `${scores.maintainability}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Judicial Summary */}
        <div className="p-4 sm:p-5 rounded-xl bg-cream-100/70 border border-card-border space-y-1.5">
          <div className="flex items-center gap-2">
            <img
              src="/assets/judge.jpg"
              alt="Chief Justice Owl"
              className="w-5 h-5 rounded-full object-cover border border-gold-primary shrink-0"
            />
            <strong className="font-serif font-bold text-xs sm:text-sm text-charcoal">
              Chief Justice's Summary:
            </strong>
          </div>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans pl-7">
            {verdict.summary}
          </p>
        </div>

        {/* Ranked "Sentence" Fix List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base sm:text-lg text-charcoal flex items-center gap-2">
              <Gavel className="w-4 h-4 sm:w-5 sm:h-5 text-gold-primary" />
              <span>The Court's Sentence (Ranked Actionable Fixes)</span>
            </h4>
            <span className="text-[11px] text-charcoal-muted uppercase font-medium tracking-wider">
              Prioritized by severity
            </span>
          </div>

          <ol className="space-y-2.5">
            {verdict.sentence.map((fix, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-cream-50 border border-card-border/80 hover:border-gold-primary/30 transition-all text-xs sm:text-sm text-charcoal"
              >
                <span className="w-6 h-6 rounded-full bg-cream-200 text-charcoal font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs font-mono">
                  {idx + 1}
                </span>
                <span className="leading-relaxed mt-0.5">{fix}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 2. Findings Tabs: Detailed Findings | Code Suggestions | Appeal */}
      <div className="space-y-4">
        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-2 border-b border-card-border pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("findings")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "findings"
                ? "bg-hero-charcoal text-cream-50 shadow-xs"
                : "text-charcoal-muted hover:text-charcoal hover:bg-cream-200"
            }`}
          >
            Detailed Findings ({charges.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suggestions")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "suggestions"
                ? "bg-hero-charcoal text-cream-50 shadow-xs"
                : "text-charcoal-muted hover:text-charcoal hover:bg-cream-200"
            }`}
          >
            Code Suggestions ({verdict.sentence.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("appeal")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "appeal"
                ? "bg-hero-charcoal text-cream-50 shadow-xs"
                : "text-charcoal-muted hover:text-charcoal hover:bg-cream-200"
            }`}
          >
            <span>Appeal</span>
            {appealData && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-accent/20 text-teal-accent border border-teal-accent/30 font-bold">
                +{appealData.newScore - appealData.previousScore} pts
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Detailed Findings */}
        {activeTab === "findings" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {charges.map((charge) => {
                const isCritical = charge.severity === "Critical";
                const isSerious = charge.severity === "Serious";

                return (
                  <div
                    key={charge.id}
                    className="p-5 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-charcoal-muted">
                          <FileCode2 className="w-3.5 h-3.5 text-gold-primary" />
                          <span>
                            {charge.file
                              ? `${charge.file}${charge.line ? `:${charge.line}` : ""}`
                              : charge.line
                              ? `Line ${charge.line}`
                              : charge.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isCritical
                                ? "bg-red-50 text-[#D64545] border border-red-200"
                                : isSerious
                                ? "bg-amber-50 text-gold-primary border border-amber-200"
                                : "bg-cream-200 text-charcoal border border-card-border"
                            }`}
                          >
                            {charge.severity}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cream-100 text-charcoal border border-card-border">
                            {charge.category}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-serif font-bold text-base text-charcoal mb-1">
                        {charge.title}
                      </h5>

                      <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                        {charge.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-card-border/60 flex items-center justify-between text-[11px] text-charcoal-muted">
                      <span>Status: <strong className="text-[#D64545] font-semibold">Culpable Violation</strong></span>
                      <span className="font-mono text-gold-primary">{charge.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Code Suggestions */}
        {activeTab === "suggestions" && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-cream-100/60 border border-card-border text-xs text-charcoal-muted flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gold-primary shrink-0" />
              <span>
                These concrete code recommendations represent the court's remedial instructions to rehabilitate the codebase.
              </span>
            </div>

            <div className="space-y-3">
              {verdict.sentence.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-primary/20 text-gold-primary font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <span>Remedial Directive #{idx + 1}</span>
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-teal-accent/15 text-teal-accent">
                      Recommended
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans pl-7">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Appeal */}
        {activeTab === "appeal" && (
          <div className="space-y-5 animate-fade-in">
            {appealData ? (
              <div className="p-6 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-6">
                {/* Score Comparison Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-cream-50 border border-card-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-teal-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                        Judicial Appeal Evaluation
                      </span>
                    </div>
                    <h5 className="font-serif font-bold text-lg text-charcoal">
                      Rehabilitated Code Review
                    </h5>
                  </div>

                  {/* Before / After Score Pills */}
                  <div className="flex items-center gap-3">
                    <div className="text-center px-3.5 py-1.5 rounded-xl bg-cream-200 border border-card-border">
                      <span className="block text-[10px] text-charcoal-muted uppercase font-medium">Prior Score</span>
                      <span className="font-mono font-bold text-base text-charcoal">
                        {appealData.previousScore}
                      </span>
                    </div>

                    <TrendingUp className="w-4 h-4 text-teal-accent" />

                    <div className="text-center px-3.5 py-1.5 rounded-xl bg-teal-accent/15 border border-teal-accent/30 text-teal-accent">
                      <span className="block text-[10px] uppercase font-medium">Appealed Score</span>
                      <span className="font-mono font-bold text-base">
                        {appealData.newScore}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-accent text-cream-50 shadow-2xs">
                      +{appealData.newScore - appealData.previousScore} pts
                    </span>
                  </div>
                </div>

                {/* Improvements Checklist */}
                <div className="space-y-2.5">
                  <h6 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-accent" />
                    <span>Implemented Fixes & Compliance Certifications:</span>
                  </h6>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {appealData.improvements.map((imp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-cream-50/70 border border-card-border/60 text-charcoal"
                      >
                        <Check className="w-3.5 h-3.5 text-teal-accent shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fixed Code Viewer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-charcoal-muted flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-gold-primary" />
                      <span>Sanitized Evidence (Fixed Code)</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(appealData.revisedCode)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream-200 hover:bg-cream-300 text-charcoal font-medium transition-colors text-[11px]"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-teal-accent" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-charcoal-muted" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-hero-charcoal rounded-xl p-4 overflow-x-auto max-h-96 border border-card-border/40">
                    <pre className="font-mono text-xs leading-relaxed text-cream-50 whitespace-pre">
                      {appealData.revisedCode}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-card-surface border border-card-border text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-cream-200 text-gold-primary flex items-center justify-center mx-auto">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h5 className="font-serif font-bold text-lg text-charcoal">
                    Appeal Mode (Scheduled for Day 6)
                  </h5>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    Live Appeal mode allows submitting revised code and automatically recalculating health scores.
                    To preview the Appeal tab in action right now, select any of the <strong>Demo Cases</strong> above.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
