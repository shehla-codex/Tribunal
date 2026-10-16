---
doc: scope
status: approved
---

# Tribunal

Your code. Put on trial.

## The Unique Kernel
A theatrical, adversarial AI courtroom where three owl characters—a strict Prosecutor, a pragmatic Defense Attorney, and a wise Judge—debate the flaws in your code in real time, respond to user objections, and hand down a verdict stamp with a ranked "Sentence" of fixes.

## Who It's For
Solo developers, hackathon hackers, and learners submitting code snippets or repositories who are bored of sterile linters and generic chat responses, and want an entertaining, visually memorable critique that highlights genuine flaws without feeling discouraging.

## The Core Loop
1. **Submit or Select**: The developer pastes code (or chooses one of three zero-token demo cases).
2. **The Trial**: The Prosecutor and Defense debate charges turn-by-turn with typing animations across Logic, Security, and Maintainability.
3. **Interject**: The developer hits the "OBJECTION!" button at any time, submitting a counter-statement that triggers screen shake, sound effects, and an in-character AI response (or canned in-character reply in Demo Mode).
4. **The Verdict**: The Judge delivers a verdict stamp ("Guilty", "Not Guilty", "Guilty with Community Service"), a circular Code Health Score (0–100), and a prioritized fix list.
5. **Review & Iterate**: The developer inspects categorized findings, appeals with updated code (comparing before/after scores), or downloads a Markdown case report.

## Inspiration & Identity
- **Visual Aesthetic**: Dark courtroom mahogany and stone hero banner set against a warm page cream (`#F6F3EE`) with card backgrounds (`#FBFAF8`). Accent tones of rich gold (`#B67F3D`), teal (`#43877C`), and judge-specific accents (Prosecutor crimson, Defense blue, Judge gold).
- **Typography**: Playfair Display for authoritative headings; Inter for crisp, readable UI text.
- **Tone**: Playful, dramatic, yet technically rigorous. Mascots are friendly cartoon owls. "Fun code-review tool. Not legal advice."

## Why This Matters to the Learner
Building a polished, complete hackathon entry for Devpost "Build With AI: Basics" with a hard 7-day timeline. Must excel in Design, Innovation, and Presentation through a tight 1–3 minute demo video, while demonstrating strict token efficiency (single-call LLM architecture).

## What "Working" Looks Like
A reviewer opens Tribunal, selects a demo case (or pastes code), watches the owl prosecutor and defense debate the code's flaws with typing animations, clicks "OBJECTION!" to interject and hear the judge rule on the objection, and receives an animated verdict stamp, Code Health Score ring, and downloadable Markdown report—all working 100% offline in Demo Mode on Vercel without requiring an API key.

## Priorities
- **P0 (Must-Have Core)**: Paste code, Demo Mode (3 cases with canned data), 3 owl characters, charges, auto-play debate with skip option, verdict stamp + circular Code Health Score (0–100), Markdown case report.
- **P1 (Interactive Polish)**: OBJECTION! button (sound + screen shake + character replies; pre-written canned replies in Demo Mode), client-side history (localStorage), Appeal mode (pre-written fixed code + score comparison in Demo Mode).
- **P2 (Extended Reach)**: GitHub URL analyzer (max 8 files / 20KB limit), sound design polish.

## The POC Boundary
- **Included in Scope**:
  - Full offline Demo Mode: 3 pre-generated case JSON files in `/data/demo-cases/` with pre-written objection replies and pre-written appeal before/after comparisons so the entire app is testable with zero API keys.
  - Dashboard with hero banner, tagline, 3 instant Demo Mode cases, and disclaimer.
  - "Paste Code" review mode with syntax/file preview.
  - Turn-based Courtroom deliberation between Prosecutor and Defense with auto-playback and skip button.
  - Interactive "OBJECTION!" button triggering sound, screen shake, and AI objection rebuttal.
  - Verdict view with stamp overlay, circular Code Health Score (0–100), Logic/Security/Maintainability breakdowns, and ranked Sentence fixes.
  - Case Report with Markdown download.
  - Appeal tab allowing code resubmission and score comparison.
  - Client-side history storage (localStorage).
  - Single-call LLM architecture with Zod schema validation and 1-retry fallback.
  - Public GitHub URL analyzer (top 8 files, max 20KB per file, filtered for relevant logic).

## Later
- Multi-repo diff comparisons.
- Custom user-defined prosecutor/judge personas and rule sets.
- Multi-user courtroom spectator mode.

## Cut Order If Behind
1. PDF export (cut first in favor of Markdown export).
2. Appeal (live LLM mode; keep Demo Mode appeal).
3. Sound design polish.
4. GitHub mode polish.
*Never cut Demo Mode or the core verdict flow.*

## Explicitly Cut
- **Server Database / User Auth**: Unnecessary complexity and cost for a 7-day PoC; client-side storage handles history cleanly.
- **Multi-Agent Agent Loops**: Capped strictly at 1 LLM call per case (+ 1 small call per objection) to preserve token budget.
- **Full Repository Crawling**: Large repos are capped at 8 key files / 20KB to avoid prompt exhaustion and rate limits.
