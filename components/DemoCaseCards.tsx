import React from "react";
import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  FileCode2, 
  ShieldAlert, 
  Lock, 
  RefreshCw, 
  Gavel, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";

export default function DemoCaseCards() {
  const demoCases = [
    {
      id: "demo-auth",
      title: "Hardcoded API Secret & JWT Validation",
      language: "Node.js / Express",
      status: "Guilty",
      score: 58,
      severity: "Critical",
      tag: "Security",
      description: "A production auth handler with hardcoded JWT secrets, unhashed passwords, and missing error catch blocks.",
      chargesCount: 4,
    },
    {
      id: "demo-async",
      title: "Async Race Condition & Memory Leak",
      language: "TypeScript / React",
      status: "Guilty with Service",
      score: 72,
      severity: "Serious",
      tag: "Logic",
      description: "A data-fetching hook with stale closure race conditions, uncancelled async subscriptions, and missing dependencies.",
      chargesCount: 3,
    },
    {
      id: "demo-sql",
      title: "SQL String Interpolation & Param Injection",
      language: "Python / FastAPI",
      status: "Guilty",
      score: 45,
      severity: "Critical",
      tag: "Security",
      description: "Raw SQL query formatting via f-strings with unsanitized user inputs exposing database exfiltration.",
      chargesCount: 4,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Primary Call to Action Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-card-surface border border-card-border shadow-xs gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-charcoal">
            Ready to bring your code before the court?
          </h3>
          <p className="text-sm text-charcoal-muted mt-1">
            Analyze your snippets, verify edge cases, or test an offline trial scenario.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/review"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-hero-charcoal text-cream-50 font-medium text-sm hover:bg-hero-charcoal/90 transition-all shadow-sm hover:shadow"
          >
            <Play className="w-4 h-4 fill-current text-gold-primary" />
            <span>Start a Trial</span>
          </Link>
        </div>
      </div>

      {/* 3 Offline Demo Cases Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-charcoal">
              Instant Demo Cases
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Run complete courtroom sessions offline with 0 API calls and zero API keys.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-accent/10 text-teal-accent border border-teal-accent/20">
            Offline Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {demoCases.map((demo) => (
            <div
              key={demo.id}
              className="p-5 rounded-2xl bg-card-surface border border-card-border hover:border-gold-primary/50 transition-all shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-charcoal-muted">{demo.language}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                    demo.tag === "Security" 
                      ? "bg-prosecutor-crimson/10 text-prosecutor-crimson border border-prosecutor-crimson/20" 
                      : "bg-defense-blue/10 text-defense-blue border border-defense-blue/20"
                  }`}>
                    {demo.tag}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-charcoal group-hover:text-gold-primary transition-colors">
                  {demo.title}
                </h4>

                <p className="text-xs text-charcoal-muted mt-2 line-clamp-3 leading-relaxed">
                  {demo.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-card-border flex items-center justify-between">
                <div className="text-xs text-charcoal-muted">
                  <span className="font-semibold text-charcoal">{demo.chargesCount}</span> Charges Filed
                </div>

                <Link
                  href={`/review?case=${demo.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-primary hover:text-gold-amber transition-colors"
                >
                  <span>Examine Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-cream-50 border border-card-border">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="font-serif font-bold text-2xl text-charcoal">
            How The Trial Unfolds
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1.5">
            Three AI personalities turn code review from a mundane scan into a memorable courtroom drama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-card-surface border border-card-border">
            <div className="w-9 h-9 rounded-lg bg-cream-200 text-charcoal flex items-center justify-center font-serif font-bold mb-3">
              1
            </div>
            <h4 className="font-serif font-bold text-base text-charcoal mb-1">
              Submit the Evidence
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Paste your raw snippet or select a demo scenario. The court identifies specific lines and constructs the charges.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card-surface border border-card-border">
            <div className="w-9 h-9 rounded-lg bg-prosecutor-crimson/10 text-prosecutor-crimson flex items-center justify-center font-serif font-bold mb-3">
              2
            </div>
            <h4 className="font-serif font-bold text-base text-charcoal mb-1">
              Watch The Debate
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Prosecutor owl attacks weaknesses; Defense owl argues context and solutions. Click <strong>OBJECTION!</strong> to interject.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-card-surface border border-card-border">
            <div className="w-9 h-9 rounded-lg bg-gold-primary/10 text-gold-primary flex items-center justify-center font-serif font-bold mb-3">
              3
            </div>
            <h4 className="font-serif font-bold text-base text-charcoal mb-1">
              The Final Sentence
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              The Judge delivers a stamped verdict, a 0–100 Code Health Score ring, and a prioritized fix list with exact file & line references.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="pt-6 border-t border-card-border text-center text-xs text-charcoal-muted space-y-1">
        <p className="font-medium text-charcoal">
          Fun code-review tool. Not legal advice.
        </p>
        <p className="text-[11px]">
          Live trials send submitted code snippets to your configured AI provider for analysis. Demo mode operates 100% offline.
        </p>
      </footer>
    </div>
  );
}
