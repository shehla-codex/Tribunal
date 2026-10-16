import React from "react";
import { Scale } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] flex items-center shadow-xl border border-hero-stone/40 mb-8 bg-hero-charcoal">
      {/* Background Courtroom Image (Owl centered at 72% width, whole face & wig visible) */}
      <img
        src="/assets/hero-banner.png"
        alt="Courtroom Owl Judge"
        className="absolute inset-0 w-full h-full object-cover object-[72%_25%] pointer-events-none select-none"
      />

      {/* Dark gradient on the left for text readability; subtle overall tint on mobile */}
      <div className="absolute inset-0 bg-hero-charcoal/60 sm:bg-transparent sm:bg-gradient-to-r sm:from-hero-charcoal sm:via-hero-charcoal/90 sm:via-50% sm:to-transparent pointer-events-none" />

      {/* Hero Content (Left-aligned over the dark courtroom area) */}
      <div className="relative z-10 w-full p-6 sm:p-8 lg:p-12 flex flex-col justify-center max-w-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-hero-stone/90 border border-gold-primary/50 flex items-center justify-center text-gold-light shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-gold-light">
            Court of Code Quality
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream-50 leading-tight">
          Put Your Code on Trial
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-cream-200/95 leading-relaxed font-normal max-w-lg">
          Submit your code and watch an owl prosecutor and defense argue it out before a judge delivers the verdict.
        </p>

        {/* Three Character Pills */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hero-charcoal/85 border border-prosecutor-crimson/60 backdrop-blur-xs text-xs font-medium text-cream-50 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-prosecutor-crimson"></span>
            <span>Prosecutor</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hero-charcoal/85 border border-defense-blue/60 backdrop-blur-xs text-xs font-medium text-cream-50 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-defense-blue"></span>
            <span>Defense</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hero-charcoal/85 border border-gold-primary/60 backdrop-blur-xs text-xs font-medium text-cream-50 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-primary"></span>
            <span>Judge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
