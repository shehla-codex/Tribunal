---
doc: prd
status: approved
---

# Tribunal — Product Requirements

Tribunal is an adversarial, owl-themed AI courtroom web app where developers submit their code or GitHub repositories to be scrutinized by three AI characters (Prosecutor, Defense Attorney, Judge) that debate findings in real time, respond to user objections, and hand down an actionable verdict.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
1. **Arrival**: The developer lands on the Dashboard featuring a courtroom hero banner, tagline, 3 instant offline Demo Cases, and a clear disclaimer.
2. **Submission**: Developer clicks "Start a Trial" (or selects a Demo Case) on the New Review screen. They enter a case name and paste code into the editor (or provide a public GitHub URL).
3. **The Courtroom**: The trial begins with 3–5 charges (Minor/Serious/Critical). The Prosecutor (crimson owl) and Defense (blue owl) debate each finding turn-by-turn with typing animations.
4. **Objection (P1)**: At any point during deliberation, the developer can hit "OBJECTION!", entering a counter-argument that pauses deliberation, triggers an overlay and screen shake, and elicits an in-character ruling (using canned replies in Demo Mode).
5. **The Verdict (P0)**: The Judge (gold owl) delivers the verdict stamp ("Guilty", "Not Guilty", "Guilty with Community Service"), a circular Code Health Score ring (0–100) with Logic/Security/Maintainability bars, and a ranked "Sentence" fix list.
6. **Inspection & Appeal (P1)**: Developer explores tabs for Detailed Findings and Code Suggestions, or uses the Appeal tab to compare before/after scores using revised code (pre-written in Demo Mode).
7. **Export (P0) & History (P1)**: Developer downloads a clean Markdown case report and can revisit past cases saved client-side in History.

## Screens and Layout
- **App Shell**: Persistent left sidebar (Dashboard, New Review, History, Settings toggle) and top navigation bar with the Tribunal logo and quick links.
- **Dashboard**: Courtroom hero banner (charcoal/wood/stone), call to action, 3 clickable Demo Case cards, how-it-works overview, and disclaimer footer.
- **New Review**: Two input tabs: "Code Review" (paste code with syntax/file tree preview) and "GitHub Repository" (public repo URL input and file picker, P2).
- **Courtroom & Deliberation**: Split layout—left panel displays evidence code, right panel displays "The 3 AI Judges" debate stream with avatar status badges, typing indicators, playback skip button, and the "OBJECTION!" button.
- **Verdict & Findings**: Code Health Score ring (0–100) with category progress bars, verdict stamp banner, ranked Sentence list, and bottom tabbed interface: Detailed Findings, Code Suggestions, and Appeal.
- **History View**: Table/card view of previous trials loaded from `localStorage` with timestamps, verdict badges, and case management controls.

## Look and Feel
- **Palette**: Page background cream (`#F6F3EE`), card surface (`#FBFAF8`), hero base charcoal (`#151517`), hero stone (`#3C3538`), courtroom wood (`#2A1D19` / `#40312D`), gold accents (`#B67F3D` / light `#E5C994`), teal (`#43877C`).
- **Character Accents**: Prosecutor crimson, Defense blue, Judge gold/amber. Strict rule: NO navy blue anywhere.
- **Typography**: Playfair Display for authoritative legal headings; Inter for crisp, clean UI text and monospace for code.
- **Mascots**: Friendly cartoon owls in legal courtroom attire (Prosecutor, Defense Attorney, Judge).

## Feature Priorities

### P0 (Must-Have Core)
- **Paste Code Review**: Code input area with syntax and line preview.
- **Offline Demo Mode**: 3 pre-generated cases in `/data/demo-cases/` with pre-written debate scripts, 2–3 pre-written objection replies per case, and pre-written fixed code appeal comparisons. 100% functional with zero API calls and zero API keys.
- **Deliberation Engine**: Auto-play turn-by-turn debate between Prosecutor and Defense with avatar status states and a "Skip Animation" button.
- **Verdict & Health Score**: Stamp overlay ("Guilty", "Not Guilty", "Guilty with Community Service"), circular Code Health Score (0–100), Logic/Security/Maintainability breakdown bars, and ranked "Sentence" fix list.
- **Markdown Case Report**: Export case summary, charges, debate, and verdict as a downloadable Markdown document.

### P1 (Interactive Polish & Continuity)
- **OBJECTION! Button**: Deliberation pause, screen shake, visual banner overlay, and in-character ruling (basic interactive mechanics prioritized before optional audio polish).
- **Appeal Tab**: Code re-evaluation showing side-by-side before/after scores (uses pre-written diff in Demo Mode; no API key needed).
- **Client-Side History**: Save trials to `localStorage`, view past cases, delete single cases, and "Clear All History" with a confirmation modal.

### P2 (Extended Features)
- **Public GitHub URL Analysis**: Fetch file tree via GitHub REST API, select max 8 relevant files, cap at 20KB per file.
- **Sound Design Polish**: Gavel strike audio, courtroom chime, and objection sound effect.

## States and Boundaries
- **First Use**: Clean dashboard highlighting demo cases and a clear prompt to start a first trial.
- **Empty State (Input)**: Submitting empty code displays inline courtroom alert: *"Case Dismissed: No Evidence Submitted."*
- **Validation State**: Invalid GitHub URLs display an inline validation warning before initiating analysis.
- **API Failure State**: Network or token errors in live mode display a friendly courtroom error banner with a "Retry Analysis" button.
- **Offline / Zero-Key State**: Demo Mode operates completely offline without network or API dependencies.
- **Persistence Boundary**: Saved purely in `localStorage`; no server database or external session storage.

## Product Decisions
- **No Project Idea Tab**: Scope strictly focused on concrete Code Review and GitHub Repository modes.
- **Single-Call JSON Architecture**: Trial generated in one structured call rather than costly multi-agent loops to respect token limits.
- **Offline-First Resilience**: All interactive features (objections, appeal, verdict) have pre-baked data in Demo Mode for risk-free evaluation.
- **Client-Side Storage**: Replaced server databases with browser `localStorage` to fit the 7-day timeline and zero-cost hosting.

## What We're Building
- Dashboard, New Review (Code Review & GitHub Repo), Courtroom Deliberation, Verdict/Score card, Findings tabs, Appeal mode, History view, and Markdown report download.
- 3 offline demo cases with pre-populated objections and appeal diffs.
- Interactive OBJECTION! visual mechanic.

## Deferred From the POC
- Multi-repo comparison and Git diff history.
- Live LLM streaming token-by-token (single validated JSON with frontend animation delivers identical user experience with higher reliability).
- Custom user-created courtroom owl characters.

## Non-Goals
- Project Idea tab (explicitly removed).
- User authentication, cloud database, or team workspaces.
- Continuous multi-round autonomous agent debates.
- Crawling private repositories or large codebases exceeding 8 files / 20KB.
- PDF generation (Markdown export is the approved format).
