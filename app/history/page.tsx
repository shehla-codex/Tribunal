"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Courtroom from "@/components/Courtroom";
import VerdictView from "@/components/VerdictView";
import { TrialCase } from "@/lib/schema";
import { 
  getHistory, 
  deleteHistoryItem, 
  clearHistory, 
  HistoryItem, 
  formatDocketId, 
  getScoreColor 
} from "@/lib/storage";
import { 
  History, 
  Scale, 
  Trash2, 
  ArrowLeft, 
  Play, 
  Calendar, 
  FileCode2, 
  AlertTriangle 
} from "lucide-react";

function HistoryContent() {
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedTrial, setSelectedTrial] = useState<TrialCase | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const items = getHistory();
    setHistory(items);
    setLoaded(true);

    const caseIdParam = searchParams.get("caseId");
    if (caseIdParam) {
      const match = items.find((item) => item.id === caseIdParam);
      if (match) {
        setSelectedTrial(match.fullResult);
      }
    }
  }, [searchParams]);

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    if (selectedTrial?.id === id) {
      setSelectedTrial(null);
    }
  };

  const handleConfirmClear = () => {
    clearHistory();
    setHistory([]);
    setSelectedTrial(null);
    setShowClearConfirm(false);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AppShell>
      {selectedTrial ? (
        /* Reopened Trial View: Full Courtroom & Verdict without animation */
        <div className="space-y-6">
          {/* Top Return Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card-surface border border-card-border shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedTrial(null)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cream-200/80 hover:bg-cream-200 text-xs sm:text-sm font-semibold text-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to History Archives</span>
              </button>
              <div className="h-5 w-px bg-card-border hidden sm:block" />
              <div className="hidden sm:block">
                <span className="font-mono text-xs text-gold-primary font-semibold">
                  {formatDocketId(selectedTrial.id)}
                </span>
                <h3 className="font-serif font-bold text-sm text-charcoal truncate max-w-md">
                  {selectedTrial.caseName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/review?history=${selectedTrial.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-hero-charcoal text-cream-50 text-xs sm:text-sm font-medium hover:bg-hero-charcoal/90 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5 text-gold-primary" />
                <span>Open in Code Editor</span>
              </Link>
            </div>
          </div>

          {/* Full Courtroom Deliberation (No animation, instant render) */}
          <Courtroom
            trial={selectedTrial}
            onDeliberationComplete={() => {}}
            isDeliberationComplete={true}
            initialSkipAnimation={true}
          />

          {/* Full Verdict & Scoring View (No delay) */}
          <VerdictView trial={selectedTrial} initialSkipAnimation={true} />
        </div>
      ) : (
        /* History Archive List View */
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-card-border">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gold-primary" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                  Court Archives & Case History
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Browse past judicial rulings, verdicts, and code health scores saved in local browser storage.
              </p>
            </div>

            {history.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream-200 text-charcoal">
                  {history.length} {history.length === 1 ? "Case" : "Cases"} Recorded
                </span>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-card-border hover:border-prosecutor-crimson text-xs font-medium text-charcoal hover:text-prosecutor-crimson transition-colors bg-card-surface shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {loaded && history.length === 0 && (
            <div className="p-12 rounded-2xl bg-card-surface border border-card-border text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-hero-charcoal border border-gold-primary/40 flex items-center justify-center mx-auto text-gold-light shadow-md">
                <Scale className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-xl text-charcoal">
                  No Cases on Record Yet
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  Run a demo trial or bring suspect code before the court to record judicial determinations and scores in your browser history.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/review"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-hero-charcoal text-cream-50 text-sm font-medium hover:bg-hero-charcoal/90 transition-all shadow-xs"
                >
                  <Play className="w-4 h-4 fill-current text-gold-primary" />
                  <span>Start a Trial</span>
                </Link>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {history.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.map((item) => {
                const scoreColor = getScoreColor(item.score);
                const isGuilty = item.verdict === "Guilty";
                const isCommunity = item.verdict === "Guilty with Community Service";

                const verdictBg = isGuilty
                  ? "bg-red-50 text-prosecutor-crimson border-red-200"
                  : isCommunity
                  ? "bg-amber-50 text-gold-primary border-amber-200"
                  : "bg-teal-50 text-teal-accent border-teal-200";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTrial(item.fullResult)}
                    className="p-5 rounded-2xl bg-card-surface border border-card-border hover:border-gold-primary/50 transition-all shadow-xs flex flex-col justify-between group cursor-pointer hover:shadow-md"
                  >
                    <div>
                      {/* Top Bar: Docket & Date & Delete */}
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-card-border/70">
                        <span className="font-mono font-semibold text-gold-primary text-[11px]">
                          {formatDocketId(item.id)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-charcoal-muted flex items-center gap-1 font-sans">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.date)}
                          </span>
                          <button
                            type="button"
                            title="Delete this case"
                            onClick={(e) => handleDeleteItem(e, item.id)}
                            className="p-1 rounded-md text-charcoal-muted hover:text-prosecutor-crimson hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-serif font-bold text-base text-charcoal group-hover:text-gold-primary transition-colors mt-3 line-clamp-2">
                        {item.title}
                      </h4>

                      {/* Verdict & Score Badges */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${verdictBg}`}
                        >
                          {item.verdict}
                        </span>

                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cream-200/80 text-[11px] font-semibold">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: scoreColor }}
                          />
                          <span className="font-mono text-charcoal font-bold">{item.score}</span>
                          <span className="text-[10px] text-charcoal-muted font-normal">Score</span>
                        </div>
                      </div>

                      {/* Code Snippet Excerpt */}
                      {item.code && (
                        <pre className="bg-cream-100/70 p-2.5 rounded-xl text-[11px] font-mono text-charcoal-muted line-clamp-2 overflow-hidden mt-3 border border-card-border/60">
                          {item.code.trim().split("\n").slice(0, 2).join("\n")}
                        </pre>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-charcoal-muted">
                        {item.fullResult.language || "Code Snippet"}
                      </span>
                      <span className="font-semibold text-gold-primary group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 text-[11px]">
                        <span>Reopen Verdict</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-hero-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card-surface border border-card-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-prosecutor-crimson flex items-center justify-center shrink-0 border border-red-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-charcoal">
                  Clear All Court Archives?
                </h4>
                <p className="text-xs text-charcoal-muted">
                  Permanent removal from local storage
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
              This will permanently delete all {history.length} completed cases and judicial determinations from your browser. This action cannot be reversed.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-charcoal hover:bg-cream-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl bg-prosecutor-crimson text-cream-50 text-xs sm:text-sm font-medium hover:bg-prosecutor-crimson/90 transition-colors shadow-xs"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-12 text-center text-charcoal-muted text-sm">
            Loading Court Archives...
          </div>
        </AppShell>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
