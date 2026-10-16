import React from "react";
import { Scale, ShieldAlert, Cpu, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-hero-charcoal text-cream-50 shadow-xl border border-hero-stone/40 mb-8">
      {/* Decorative Background Lighting / Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-6 sm:p-8 lg:p-10 gap-8">
        {/* Left Column: Title, Subtitle, Judge Pills */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-hero-stone/80 border border-gold-primary/50 flex items-center justify-center text-gold-light">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-gold-light">
              Court of Code Quality
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-cream-50 leading-tight">
            AI Coding Court
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-cream-200/90 leading-relaxed font-normal">
            Submit your code, and let 3 specialized AI judges review it from different perspectives.
          </p>

          {/* 3 Judge Perspective Badges */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hero-stone/80 border border-prosecutor-crimson/50 text-xs font-medium text-cream-50">
              <span className="w-2 h-2 rounded-full bg-prosecutor-crimson"></span>
              <span>Logic Judge</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hero-stone/80 border border-gold-amber/50 text-xs font-medium text-cream-50">
              <span className="w-2 h-2 rounded-full bg-gold-amber"></span>
              <span>Security Judge</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hero-stone/80 border border-teal-court/50 text-xs font-medium text-cream-50">
              <span className="w-2 h-2 rounded-full bg-teal-court"></span>
              <span>Maintainability Judge</span>
            </div>
          </div>
        </div>

        {/* Center: Courtroom Owl Judge Illustration */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 flex items-center justify-center">
          <img 
            src="/assets/hero-banner.svg" 
            alt="AI Owl Courtroom" 
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />
        </div>

        {/* Right Column: Quote Card matching reference */}
        <div className="w-full lg:w-72 p-5 rounded-xl bg-hero-stone/60 border border-hero-stone backdrop-blur-xs flex flex-col items-center text-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-full bg-gold-primary/20 text-gold-light flex items-center justify-center mb-3">
            <Scale className="w-5 h-5" />
          </div>
          <p className="font-serif text-sm text-cream-100 font-medium leading-snug">
            Three judges. Different perspectives.
          </p>
          <p className="font-serif text-sm text-gold-light font-bold mt-1">
            One fair verdict.
          </p>
        </div>
      </div>
    </div>
  );
}
