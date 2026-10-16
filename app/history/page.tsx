import React from "react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { History, Clock, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-hero-charcoal border border-gold-primary/40 flex items-center justify-center mx-auto text-gold-light shadow-md">
          <History className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-charcoal">
            Court Archives & Case History
          </h2>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            Client-side history storage and verdict archive is scheduled for Day 4 milestone.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card-surface border border-card-border text-left space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gold-primary tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Scheduled Milestone: Day 4</span>
          </div>
          <p className="text-xs text-charcoal leading-relaxed">
            Day 4 wires browser <code className="bg-cream-200 px-1 py-0.5 rounded text-charcoal">localStorage</code> persistence, case deletion, and instant verdict restoration without requiring a database.
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
