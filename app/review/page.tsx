import React from "react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { Gavel, Clock, ArrowLeft } from "lucide-react";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-hero-charcoal border border-gold-primary/40 flex items-center justify-center mx-auto text-gold-light shadow-md">
          <Gavel className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-charcoal">
            The Courtroom Dockets
          </h2>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            Review mode and live deliberation are scheduled for Day 2 milestone.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card-surface border border-card-border text-left space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gold-primary tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Next Milestone: Day 2</span>
          </div>
          <p className="text-xs text-charcoal leading-relaxed">
            Day 2 activates the Code Review editor, the 3 offline demo cases with pre-written debate scripts, and the single-call LLM analysis pipeline.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card-surface border border-card-border text-sm font-medium text-charcoal hover:bg-cream-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </AppShell>
  );
}
