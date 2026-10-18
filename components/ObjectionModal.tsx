"use client";

import React, { useState, useEffect, useRef } from "react";
import { Gavel, AlertCircle, X, Send, Sparkles } from "lucide-react";

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (objectionText: string) => Promise<void>;
  isSubmitting?: boolean;
}

const SUGGESTION_CHIPS = [
  "That line is not actually reachable",
  "This is intended behavior",
  "The fix breaks existing users",
  "Upstream validation already guards this",
];

export default function ObjectionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ObjectionModalProps) {
  const [text, setText] = useState<string>("");
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // When opened, trigger the dramatic flash banner first, then focus input
  useEffect(() => {
    if (isOpen) {
      setShowFlash(true);
      setText("");

      const timer = setTimeout(() => {
        setShowFlash(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setShowFlash(false);
      setText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    await onSubmit(trimmed);
  };

  const handleChipClick = (chip: string) => {
    setText(chip);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-hero-charcoal/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Stage 1: Big Dramatic "OBJECTION!" Flash Banner */}
      {showFlash && (
        <div className="relative z-50 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="w-screen py-10 sm:py-14 bg-gradient-to-r from-wood-dark via-prosecutor-crimson to-wood-dark border-y-4 border-gold-primary shadow-2xl flex flex-col items-center justify-center transform animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <Gavel className="w-8 h-8 sm:w-12 sm:h-12 text-gold-light animate-bounce" />
              <h1 className="font-serif font-black text-4xl sm:text-7xl tracking-widest text-cream-50 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                OBJECTION!
              </h1>
              <Gavel className="w-8 h-8 sm:w-12 sm:h-12 text-gold-light animate-bounce scale-x-[-1]" />
            </div>
            <p className="font-serif italic text-gold-light text-xs sm:text-base tracking-widest uppercase">
              Counsel intervenes before Chief Justice Owl
            </p>
          </div>
        </div>
      )}

      {/* Stage 2: Small Objection Input Modal */}
      {!showFlash && (
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-50 w-full max-w-lg bg-card-surface border-2 border-gold-primary/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200 motion-reduce:animate-none"
        >
          {/* Modal Header */}
          <div className="bg-hero-charcoal px-5 py-4 border-b border-white/10 flex items-center justify-between text-cream-50">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-ping" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-gold-light flex items-center gap-2">
                <Gavel className="w-4 h-4 text-gold-primary" />
                <span>Lodge Your Objection</span>
              </h3>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="p-1 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-white/10 transition-colors"
              title="Withdraw Objection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="objection-input"
                className="block text-xs font-semibold text-charcoal"
              >
                Enter your counter-argument for the presiding judge:
              </label>
              <p className="text-[11px] text-charcoal-muted">
                Chief Justice Owl will pause deliberation and issue an immediate in-character ruling.
              </p>
            </div>

            {/* Quick-pick suggestion chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-charcoal-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-primary" />
                <span>Quick-Pick Arguments:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleChipClick(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-cream-200/70 hover:bg-gold-light/40 text-charcoal border border-card-border hover:border-gold-primary/50 transition-all text-left font-medium active:scale-98"
                  >
                    "{chip}"
                  </button>
                ))}
              </div>
            </div>

            {/* Single-line Input */}
            <div className="space-y-1.5 pt-1">
              <div className="relative">
                <input
                  id="objection-input"
                  ref={inputRef}
                  type="text"
                  maxLength={200}
                  disabled={isSubmitting}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your objection (e.g. That line is not actually reachable)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-card-border bg-cream-50 text-xs sm:text-sm text-charcoal focus:outline-hidden focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all font-sans pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-charcoal-muted">
                  {text.length}/200
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-card-border/70">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-charcoal hover:bg-cream-200 transition-colors"
              >
                Withdraw
              </button>

              <button
                type="submit"
                disabled={!text.trim() || isSubmitting}
                className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  !text.trim() || isSubmitting
                    ? "bg-hero-charcoal/40 text-cream-300 cursor-not-allowed"
                    : "bg-prosecutor-crimson hover:bg-prosecutor-red text-cream-50 shadow-md hover:shadow-lg active:scale-98"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                    <span>Deliberating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Objection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
