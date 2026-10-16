"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History as HistoryIcon, 
  Settings, 
  Scale, 
  Sun, 
  ShieldCheck, 
  FileCode,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "New Review", href: "/review", icon: PlusCircle },
    { label: "History", href: "/history", icon: HistoryIcon },
  ];

  return (
    <div className="flex min-h-screen bg-cream-100 font-sans text-charcoal">
      {/* Sidebar */}
      <aside className="w-64 border-r border-card-border bg-card-surface flex flex-col justify-between p-5 shrink-0 hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <img 
              src="/assets/tribunal-logo.png" 
              alt="Tribunal Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <h1 className="font-serif font-bold text-lg text-charcoal tracking-tight leading-none">
                Tribunal
              </h1>
              <p className="text-[11px] text-charcoal-muted mt-1 leading-none font-medium">
                Your code. Put on trial.
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cream-200/80 text-charcoal font-semibold shadow-xs border border-card-border"
                      : "text-charcoal-muted hover:text-charcoal hover:bg-cream-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-primary" : "text-charcoal-muted"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-charcoal-muted hover:text-charcoal hover:bg-cream-100 transition-all text-left"
            >
              <Settings className="w-4 h-4 text-charcoal-muted" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Branding */}
        <div className="pt-6 border-t border-card-border/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cream-200 flex items-center justify-center text-gold-primary">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-charcoal-muted leading-tight">
              <p className="font-semibold text-charcoal">Better Code. Fairer Reviews.</p>
              <p>Powered by 3 AI Owls.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-card-border bg-card-surface/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 md:hidden">
              <img src="/assets/tribunal-logo.png" alt="Tribunal" className="w-8 h-8 object-contain" />
              <span className="font-serif font-bold text-charcoal">Tribunal</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-charcoal-muted font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-accent"></span>
              <span>Court is in Session</span>
              <span className="text-card-border mx-1">•</span>
              <span>Devpost "Build With AI" Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/" 
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/" ? "text-charcoal font-semibold bg-cream-200/60" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/review" 
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/review" ? "text-charcoal font-semibold bg-cream-200/60" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                New Review
              </Link>
              <Link 
                href="/history" 
                className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  pathname === "/history" ? "text-charcoal font-semibold bg-cream-200/60" : "text-charcoal-muted hover:text-charcoal"
                }`}
              >
                History
              </Link>
            </nav>

            <div className="h-4 w-px bg-card-border hidden sm:block"></div>

            {/* Profile Avatar Placeholder matching reference mockup */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-hero-stone text-cream-50 flex items-center justify-center font-bold text-xs border border-card-border shadow-xs">
                SS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Settings Modal (Placeholder for Day 1) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-hero-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card-surface border border-card-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-card-border">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold-primary" />
                <h3 className="font-serif font-bold text-lg text-charcoal">Courtroom Settings</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-charcoal-muted hover:text-charcoal text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            
            <div className="py-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-1.5">
                  Execution Mode
                </label>
                <div className="p-3 bg-cream-100 rounded-xl border border-card-border">
                  <div className="flex items-center gap-2 font-medium text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-teal-accent" />
                    <span>Demo Mode (Active)</span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Runs 100% offline using 3 pre-built courtroom cases with zero API calls.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-1.5">
                  Live API Provider (Day 2+)
                </label>
                <p className="text-xs text-charcoal-muted">
                  Configured server-side via <code className="bg-cream-200 px-1.5 py-0.5 rounded text-charcoal">.env.local</code>. Never exposed to browser.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-card-border flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-hero-charcoal text-cream-50 rounded-xl text-sm font-medium hover:bg-hero-charcoal/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
