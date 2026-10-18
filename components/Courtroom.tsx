"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Gavel, 
  ShieldAlert, 
  FastForward, 
  RotateCcw, 
  FileCode2, 
  Scale, 
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TrialCase, DebateTurn, Charge } from "@/lib/schema";
import { isSoundMuted, setSoundMuted, playObjectionSound } from "@/lib/audio";
import ObjectionModal from "@/components/ObjectionModal";

interface CourtroomProps {
  trial: TrialCase;
  onDeliberationComplete: () => void;
  isDeliberationComplete: boolean;
  initialSkipAnimation?: boolean;
  onTrialUpdate?: (updatedTrial: TrialCase) => void;
}

interface SpeakerMeta {
  name: string;
  role: string;
  tag: string;
  avatar: string;
  ringColor: string;
  glowColor: string;
  badgeBg: string;
  textColor: string;
}

const SPEAKERS: Record<string, SpeakerMeta> = {
  prosecutor: {
    name: "Prosecutor Owl",
    role: "The Prosecution",
    tag: "Strict & Unyielding",
    avatar: "/assets/prosecutor.png",
    ringColor: "#D64545",
    glowColor: "rgba(214, 69, 69, 0.45)",
    badgeBg: "bg-red-50 text-[#D64545] border-red-200",
    textColor: "text-[#D64545]",
  },
  judge: {
    name: "Chief Justice Owl",
    role: "Presiding Judge",
    tag: "Impartial Authority",
    avatar: "/assets/judge.jpg", // NOTE: jpg format as requested
    ringColor: "#B67F3D",
    glowColor: "rgba(182, 127, 61, 0.45)",
    badgeBg: "bg-amber-50 text-[#B67F3D] border-amber-200",
    textColor: "text-gold-primary",
  },
  defense: {
    name: "Defense Owl",
    role: "Defense Attorney",
    tag: "Pragmatic Mitigation",
    avatar: "/assets/defense.png",
    ringColor: "#4A86C5",
    glowColor: "rgba(74, 134, 197, 0.45)",
    badgeBg: "bg-blue-50 text-[#4A86C5] border-blue-200",
    textColor: "text-defense-blue",
  },
};

export default function Courtroom({
  trial,
  onDeliberationComplete,
  isDeliberationComplete,
  initialSkipAnimation = false,
  onTrialUpdate,
}: CourtroomProps) {
  const [debateTurns, setDebateTurns] = useState<DebateTurn[]>(trial.debate);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [displayedTurns, setDisplayedTurns] = useState<DebateTurn[]>([]);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string>("");
  const [isThinking, setIsThinking] = useState<boolean>(true);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState<boolean>(false);
  const [isSubmittingObjection, setIsSubmittingObjection] = useState<boolean>(false);
  const [cannedObjectionIndex, setCannedObjectionIndex] = useState<number>(0);

  const debateBottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const turnPauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTurn = debateTurns[currentTurnIndex];
  const activeSpeakerKey = activeTurn ? activeTurn.speaker : "judge";

  // Initialize sound mute preference from localStorage
  useEffect(() => {
    setIsMuted(isSoundMuted());
  }, []);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  // Clear all running timers helper
  const clearTimers = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    if (turnPauseTimerRef.current) clearTimeout(turnPauseTimerRef.current);
  };

  // Reset or initialize state when trial changes
  useEffect(() => {
    clearTimers();
    setDebateTurns(trial.debate);
    setCannedObjectionIndex(0);

    if (initialSkipAnimation) {
      setIsSkipped(true);
      setIsThinking(false);
      setCurrentSpeakingText("");
      setCurrentTurnIndex(Math.max(trial.debate.length - 1, 0));
      setDisplayedTurns(trial.debate);
      onDeliberationComplete();
      return;
    }

    setIsSkipped(false);
    setDisplayedTurns([]);
    setCurrentSpeakingText("");
    setCurrentTurnIndex(0);
    setIsThinking(true);

    if (trial.debate && trial.debate.length > 0) {
      startTurnAnimation(0, trial.debate);
    } else {
      onDeliberationComplete();
    }

    return () => clearTimers();
  }, [trial.id, initialSkipAnimation]);

  // Start turn animation with a short "Thinking..." pause followed by typing
  const startTurnAnimation = (index: number, debate: DebateTurn[]) => {
    clearTimers();
    if (index >= debate.length) {
      setIsThinking(false);
      setCurrentSpeakingText("");
      onDeliberationComplete();
      return;
    }

    const turn = debate[index];
    setCurrentTurnIndex(index);
    setIsThinking(true);
    setCurrentSpeakingText("");

    // Thinking phase: 650ms before typing begins
    thinkingTimerRef.current = setTimeout(() => {
      setIsThinking(false);
      let charIndex = 0;
      const fullText = turn.text;
      const stepSize = fullText.length > 120 ? 3 : 2;

      typingTimerRef.current = setInterval(() => {
        charIndex += stepSize;
        if (charIndex >= fullText.length) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setCurrentSpeakingText(fullText);

          // Turn finished typing: short pause before advancing
          turnPauseTimerRef.current = setTimeout(() => {
            setDisplayedTurns((prev) => [...prev, turn]);
            setCurrentSpeakingText("");

            if (index + 1 < debate.length) {
              startTurnAnimation(index + 1, debate);
            } else {
              onDeliberationComplete();
            }
          }, 850);
        } else {
          setCurrentSpeakingText(fullText.slice(0, charIndex));
        }
      }, 25);
    }, 650);
  };

  // Scroll debate into view as text appears
  useEffect(() => {
    if (!isSkipped && debateBottomRef.current) {
      debateBottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentSpeakingText, isThinking, displayedTurns.length]);

  // Handle clicking the prominent OBJECTION! button
  const triggerObjection = () => {
    clearTimers();
    playObjectionSound();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReduced) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
    }

    setIsObjectionModalOpen(true);
  };

  const handleCloseObjection = () => {
    setIsObjectionModalOpen(false);
    if (!isDeliberationComplete && !isSkipped) {
      if (currentTurnIndex < debateTurns.length) {
        startTurnAnimation(currentTurnIndex, debateTurns);
      }
    }
  };

  // Submit objection (Demo: cycle canned replies offline; Live: /api/objection)
  const handleSubmitObjection = async (objectionText: string) => {
    setIsSubmittingObjection(true);
    let ruling: "Sustained" | "Overruled" = "Overruled";
    let reply = "The court is in recess, please try again.";

    const isDemo =
      trial.id.startsWith("demo-") ||
      (trial.cannedObjections && trial.cannedObjections.length > 0);

    if (isDemo && trial.cannedObjections && trial.cannedObjections.length > 0) {
      const canned =
        trial.cannedObjections[cannedObjectionIndex % trial.cannedObjections.length];
      setCannedObjectionIndex((prev) => prev + 1);
      ruling = canned.ruling;
      reply = canned.reply;
    } else {
      try {
        const res = await fetch("/api/objection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseSummary: trial.verdict?.summary || trial.caseName,
            charges: trial.charges.map((c) => ({
              title: c.title,
              description: c.description,
              severity: c.severity,
            })),
            objectionText,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ruling && data.reply) {
            ruling = data.ruling;
            reply = data.reply;
          }
        }
      } catch {
        ruling = "Overruled";
        reply = "The court is in recess, please try again.";
      }
    }

    setIsSubmittingObjection(false);
    setIsObjectionModalOpen(false);

    const judgeRulingTurn: DebateTurn = {
      speaker: "judge",
      text: reply,
      ruling: ruling,
      objectionText: objectionText,
    };

    if (isDeliberationComplete || isSkipped) {
      const updatedDebate = [...debateTurns, judgeRulingTurn];
      const newIdx = debateTurns.length;
      setDebateTurns(updatedDebate);
      onTrialUpdate?.({ ...trial, debate: updatedDebate });
      startTurnAnimation(newIdx, updatedDebate);
    } else {
      const before = debateTurns.slice(0, currentTurnIndex);
      const after = debateTurns.slice(currentTurnIndex);
      const updatedDebate = [...before, judgeRulingTurn, ...after];
      setDebateTurns(updatedDebate);
      onTrialUpdate?.({ ...trial, debate: updatedDebate });
      startTurnAnimation(currentTurnIndex, updatedDebate);
    }
  };

  // Skip animation to display full debate immediately
  const handleSkipAnimation = () => {
    clearTimers();
    setIsSkipped(true);
    setIsThinking(false);
    setCurrentSpeakingText("");
    setCurrentTurnIndex(debateTurns.length - 1);
    setDisplayedTurns(debateTurns);
    onDeliberationComplete();
  };

  // Replay animation from beginning
  const handleReplayAnimation = () => {
    clearTimers();
    setIsSkipped(false);
    setDisplayedTurns([]);
    setCurrentSpeakingText("");
    setCurrentTurnIndex(0);
    setIsThinking(true);
    startTurnAnimation(0, debateTurns);
  };

  return (
    <div className={`space-y-8 ${isShaking ? "animate-shake" : ""}`}>
      {/* 1. Courtroom Bench / Judges Panel */}
      <div className="bg-hero-charcoal rounded-2xl p-6 border border-hero-stone/40 shadow-lg text-cream-50 relative overflow-hidden">
        {/* Subtle background gavel glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-gold-primary" />
            <h3 className="font-serif font-bold text-xl sm:text-2xl tracking-wide">
              The Courtroom Bench
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isDeliberationComplete ? (
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-teal-accent/20 text-teal-accent border border-teal-accent/30">
                Verdict Reached
              </span>
            ) : (
              <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/10 text-cream-200">
                Deliberating
              </span>
            )}
          </div>
        </div>

        {/* The 3 AI Mascots in Round Frames with Colored Rings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {(["prosecutor", "judge", "defense"] as const).map((roleKey) => {
            const meta = SPEAKERS[roleKey];
            const isSpeakingNow = !isDeliberationComplete && activeSpeakerKey === roleKey;
            const isThinkingNow = isSpeakingNow && isThinking;

            return (
              <div
                key={roleKey}
                className={`flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 ${
                  isSpeakingNow
                    ? "bg-white/10 shadow-md scale-102"
                    : "bg-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Round frame with exact colored ring and soft active glow */}
                <div className="relative mb-3">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 transition-all duration-300 bg-hero-charcoal"
                    style={{
                      borderColor: meta.ringColor,
                      boxShadow: isSpeakingNow ? meta.glowColor : "none",
                    }}
                  >
                    <img
                      src={meta.avatar}
                      alt={meta.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Active status bubble */}
                  {isSpeakingNow && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      {isThinkingNow ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-primary text-hero-charcoal shadow-xs animate-pulse">
                          <span>Thinking</span>
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-hero-charcoal animate-bounce" />
                            <span className="w-1 h-1 rounded-full bg-hero-charcoal animate-bounce [animation-delay:0.15s]" />
                            <span className="w-1 h-1 rounded-full bg-hero-charcoal animate-bounce [animation-delay:0.3s]" />
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cream-50 text-hero-charcoal shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-ping" />
                          <span>Speaking</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Character identity */}
                <h4 className="font-serif font-bold text-base text-cream-50">
                  {meta.name}
                </h4>
                <p className="text-xs text-gold-light/90 font-medium mt-0.5">
                  {meta.role}
                </p>
                <span className="text-[10px] text-cream-300/70 italic mt-1">
                  "{meta.tag}"
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Formal Charges List First */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif font-bold text-xl text-charcoal flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#D64545]" />
              <span>Formal Charges Filed ({trial.charges.length})</span>
            </h4>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Accusations entered into evidence before deliberation begins
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trial.charges.map((charge) => {
            const isCritical = charge.severity === "Critical";
            const isSerious = charge.severity === "Serious";

            return (
              <div
                key={charge.id}
                className="p-4 rounded-xl bg-card-surface border border-card-border shadow-xs hover:border-gold-primary/40 transition-all flex flex-col justify-between"
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

                  <h5 className="font-serif font-bold text-sm text-charcoal mb-1">
                    {charge.title}
                  </h5>

                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {charge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Turn-by-Turn Auto-play Debate */}
      <div className="p-6 rounded-2xl bg-card-surface border border-card-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-card-border">
          <div>
            <h4 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-defense-blue" />
              <span>Courtroom Debate & Deliberation</span>
            </h4>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Turn-by-turn cross-examination between the Prosecution and Defense
            </p>
          </div>

          {/* Animation & Objection Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Prominent OBJECTION! button */}
            <button
              type="button"
              onClick={triggerObjection}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-prosecutor-crimson hover:bg-prosecutor-red text-cream-50 shadow-xs transition-all hover:scale-102 active:scale-98"
            >
              <Gavel className="w-3.5 h-3.5 text-gold-light" />
              <span>OBJECTION!</span>
            </button>

            {/* Mute/Unmute audio toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? "Unmute courtroom sound effects" : "Mute courtroom sound effects"}
              className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal bg-cream-200/70 hover:bg-cream-300 border border-card-border transition-colors shadow-2xs"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-charcoal-muted" />
              ) : (
                <Volume2 className="w-4 h-4 text-gold-primary" />
              )}
            </button>

            {!isDeliberationComplete && (
              <button
                type="button"
                onClick={handleSkipAnimation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cream-200 hover:bg-cream-300 text-charcoal border border-card-border transition-colors shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5 text-gold-primary" />
                <span>Skip Animation</span>
              </button>
            )}

            {isDeliberationComplete && (
              <button
                type="button"
                onClick={handleReplayAnimation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cream-200 hover:bg-cream-300 text-charcoal border border-card-border transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold-primary" />
                <span>Replay Debate</span>
              </button>
            )}
          </div>
        </div>

        {/* Deliberation turns stream */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {/* Completed Turns */}
          {displayedTurns.map((turn, idx) => {
            const meta = SPEAKERS[turn.speaker] || SPEAKERS.judge;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl border bg-cream-50/70 border-card-border transition-all"
              >
                {/* Round speaker avatar with colored ring */}
                <div
                  className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 bg-hero-charcoal"
                  style={{ borderColor: meta.ringColor }}
                >
                  <img
                    src={meta.avatar}
                    alt={meta.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold tracking-wide text-xs ${meta.textColor}`}>
                        {meta.name}
                      </span>
                      {turn.ruling && (
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                            turn.ruling === "Sustained"
                              ? "bg-teal-50 text-teal-accent border-teal-200"
                              : "bg-red-50 text-prosecutor-crimson border-red-200"
                          }`}
                        >
                          {turn.ruling}
                        </span>
                      )}
                    </div>
                    {turn.chargeId && (
                      <span className="font-mono text-[10px] text-charcoal-muted px-2 py-0.5 rounded-md bg-cream-200/60 border border-card-border">
                        Ref: {turn.chargeId}
                      </span>
                    )}
                  </div>

                  {turn.objectionText && (
                    <div className="bg-cream-200/60 border border-card-border rounded-lg p-2 text-xs text-charcoal font-sans italic">
                      <span className="font-semibold not-italic text-gold-primary mr-1">Counsel&apos;s Objection:</span>
                      &ldquo;{turn.objectionText}&rdquo;
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans">
                    {turn.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Active Speaking Turn with Typing Animation */}
          {!isDeliberationComplete && activeTurn && (
            <div className="flex items-start gap-3.5 p-4 rounded-xl border bg-cream-100/90 border-gold-primary/30 shadow-xs">
              <div
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 bg-hero-charcoal transition-all"
                style={{
                  borderColor: SPEAKERS[activeSpeakerKey].ringColor,
                  boxShadow: SPEAKERS[activeSpeakerKey].glowColor,
                }}
              >
                <img
                  src={SPEAKERS[activeSpeakerKey].avatar}
                  alt={SPEAKERS[activeSpeakerKey].name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold tracking-wide text-xs ${SPEAKERS[activeSpeakerKey].textColor}`}
                    >
                      {SPEAKERS[activeSpeakerKey].name}
                    </span>
                    {activeTurn.ruling && (
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          activeTurn.ruling === "Sustained"
                            ? "bg-teal-50 text-teal-accent border-teal-200"
                            : "bg-red-50 text-prosecutor-crimson border-red-200"
                        }`}
                      >
                        {activeTurn.ruling}
                      </span>
                    )}
                  </div>
                  {activeTurn.chargeId && (
                    <span className="font-mono text-[10px] text-charcoal-muted px-2 py-0.5 rounded-md bg-cream-200/60 border border-card-border">
                      Ref: {activeTurn.chargeId}
                    </span>
                  )}
                </div>

                {activeTurn.objectionText && (
                  <div className="bg-cream-200/60 border border-card-border rounded-lg p-2 text-xs text-charcoal font-sans italic">
                    <span className="font-semibold not-italic text-gold-primary mr-1">Counsel&apos;s Objection:</span>
                    &ldquo;{activeTurn.objectionText}&rdquo;
                  </div>
                )}

                {isThinking ? (
                  <div className="flex items-center gap-2 text-xs text-charcoal-muted py-1 italic">
                    <span>Formulating argument</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-bounce [animation-delay:0.3s]" />
                    </span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans">
                    {currentSpeakingText}
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-gold-primary animate-pulse align-middle" />
                  </p>
                )}
              </div>
            </div>
          )}

          <div ref={debateBottomRef} />
        </div>
      </div>

      {/* Objection Modal */}
      <ObjectionModal
        isOpen={isObjectionModalOpen}
        onClose={handleCloseObjection}
        onSubmit={handleSubmitObjection}
        isSubmitting={isSubmittingObjection}
      />
    </div>
  );
}
