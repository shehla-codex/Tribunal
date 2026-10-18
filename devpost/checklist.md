---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Day 1: Project Scaffold, Design System & Static App Shell**
  Becomes usable: A running Next.js application showing the persistent sidebar, top bar with Tribunal logo, courtroom hero banner, 3 demo case preview cards, how-it-works cards, and legal disclaimer footer—styled with the custom cream/wood/stone/gold palette and Playfair Display/Inter typography.
  Why now: Establishes the solid visual foundation and component shell without any complex backend or API code, proving the UI structure matches the design mockup immediately.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`, `prd.md > The Core Journey` (Step 1)
  Spec ref: `spec.md > Day 1 Scope Boundary`, `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components` (`AppShell`, `HeroBanner`, `DemoCaseCards`)
  Build: Initialize Next.js with TypeScript and Tailwind CSS; configure design tokens in `tailwind.config.ts` and `app/globals.css`; write `DESIGN.md`, `README.md`, `LICENSE`, `.gitignore`, `.env.example`, `AGENTS.md`, and `DEMO_SCRIPT.md`; create placeholder SVG assets in `public/assets/`; implement `AppShell`, `HeroBanner`, and `DemoCaseCards` on `app/page.tsx`.
  Verify (mechanical): Run `npm run build` to confirm zero TypeScript and linting errors; start dev server and confirm static dashboard renders cleanly at `http://localhost:3000`.
  Learner check: Run `npm install` and `npm run dev`, open `http://localhost:3000`, and confirm the courtroom hero banner, navigation sidebar, demo case cards, and styling match the design vision.
  Commit: `Day 1: Scaffold Next.js app, configure design tokens, and build static dashboard shell`

- [x] **2. Day 2: Offline Demo Cases & Paste-Code Input Pipeline**
  Becomes usable: 3 complete offline demo cases loaded from JSON in `/data/demo-cases/`, plus the Code Review editor tab where a user can paste code and see line numbers and syntax preview.
  Why now: Provides the core data contract and input surface before animation, ensuring zero-API-key testing is locked in early.
  PRD ref: `prd.md > Feature Priorities > P0 (Must-Have Core)` (Offline Demo Mode, Paste Code Review)
  Spec ref: `spec.md > Data Model (Zod Schemas)`, `spec.md > Components` (`CodeEditorPanel`), `spec.md > File Structure` (`/data/demo-cases/`)
  Build: Define Zod schemas and TypeScript interfaces in `lib/schema.ts`; create `demo-auth.json`, `demo-async.json`, and `demo-sql.json` in `data/demo-cases/`; create `CodeReview.tsx` component with syntax preview.
  Verify (mechanical): Execute node script validating that all 3 demo JSON files strictly satisfy the `TrialCase` Zod schema; confirm demo selection populates case state.
  Learner check: Click a demo case on the dashboard and verify the case details and evidence code load into the review editor.
  Commit: `Day 2: Add offline demo case data, Zod schemas, and code review input component`

- [x] **3. Day 3: Animated Courtroom Deliberation & Verdict Card**
  Becomes usable: Turn-by-turn debate animation between Prosecutor and Defense owls with avatar status badges, typing indicator, skip button, animated verdict stamp, circular SVG Code Health Score ring (0-100), category breakdown bars, and ranked Sentence.
  Why now: Implements the core unique kernel and the primary visual attraction for the 1–3 min hackathon demo video.
  PRD ref: `prd.md > Feature Priorities > P0 (Must-Have Core)` (Deliberation Engine, Verdict & Health Score)
  Spec ref: `spec.md > Components` (`CourtroomPanel`, `VerdictCard`), `spec.md > Look and Feel`
  Build: Build `Courtroom.tsx` with interval-based turn stepper, typing animation, and skip button; build `VerdictView.tsx` with CSS stamp drop keyframes, SVG animated score ring, and ranked sentence list.
  Verify (mechanical): Load trial playback, verify turn transition intervals, test skip button reveals all turns, and verify score ring animates to exact score value.
  Learner check: Watch a demo trial run through the courtroom debate, click skip, and check the verdict stamp and score breakdown.
  Commit: `Day 3: Implement animated courtroom deliberation and verdict scoring view`

- [x] **4. Day 4: Client-Side History Storage & UI Refinement**
  Becomes usable: Completed cases automatically persist to browser `localStorage`; dedicated `/history` page displays past trials, allows reopening verdicts, deleting individual cases, and clearing history with confirmation.
  Why now: Delivers state persistence without requiring any backend database, making the app feel complete and stateful.
  PRD ref: `prd.md > Feature Priorities > P1 (Interactive Polish & Continuity)` (Client-Side History)
  Spec ref: `spec.md > Components` (`HistoryTable`), `spec.md > File Structure` (`app/history/page.tsx`, `lib/storage.ts`)
  Build: Implement `lib/storage.ts` with save, list, delete, and clear methods; build `app/history/page.tsx` with case cards and modal confirmation; polish dashboard cards and sidebar active states.
  Verify (mechanical): Simulate saving a case to `localStorage`, verify retrieval on `/history`, delete a case, and verify persistence across reload.
  Learner check: Complete a trial, navigate to History, reopen the case, and delete a test record.
  Commit: `Day 4: Add client-side localStorage history and UI refinements`

- [ ] **5. Day 5: Interactive OBJECTION! Mechanic & GitHub Codebase Mode**
  Becomes usable: Clicking "OBJECTION!" pauses courtroom debate, shakes the screen, displays an overlay, and renders an in-character AI response (or canned reply in Demo Mode); GitHub URL tab fetches repository file tree (max 8 files, 20KB limit).
  Why now: Adds the peak interactive moment for the demo video and extends review capability to public GitHub repositories.
  PRD ref: `prd.md > Feature Priorities > P1` (OBJECTION! Button), `prd.md > Feature Priorities > P2` (Public GitHub URL Analysis)
  Spec ref: `spec.md > Components` (`ObjectionModal`), `spec.md > File Structure` (`lib/github.ts`)
  Build: Create `ObjectionModal.tsx` with CSS screen shake keyframes and statement input; wire pre-written replies in Demo Mode and `/api/objection` in Live Mode; implement `lib/github.ts` repository tree fetcher with 8-file/20KB filtering.
  Verify (mechanical): Trigger objection during playback, verify animation and state pause, confirm counter-statement ruling resumes trial; test GitHub file tree fetch against a public repo.
  Learner check: Hit "OBJECTION!" during a trial, submit a counter-argument, and see the judge rule on your objection.
  Commit: `Day 5: Add interactive OBJECTION mechanic and GitHub codebase analyzer`

- [ ] **6. Day 6: Appeal Mode, Markdown Report Export & Vercel Readiness**
  Becomes usable: Appeal tab allows submitting revised code and shows side-by-side before/after scores; Case Report modal allows one-click download of a Markdown report; build verified for production deployment on Vercel.
  Why now: Completes the full feedback loop, provides a tangible takeaway (Markdown report), and verifies production deploy.
  PRD ref: `prd.md > Feature Priorities > P1` (Appeal Tab), `prd.md > Feature Priorities > P0` (Markdown Case Report)
  Spec ref: `spec.md > Components` (`AppealTab`, `CaseReportModal`)
  Build: Build `AppealTab.tsx` with diff comparison and score delta; build `CaseReportModal.tsx` compiling case state to `.md` blob and triggering browser download; run full production build and test.
  Verify (mechanical): Run `npm run build` to verify clean production bundle; test Markdown export generates valid downloadable `.md` text.
  Learner check: Switch to Appeal tab to compare improved scores, click "Download Report", and verify the downloaded markdown file.
  Commit: `Day 6: Add Appeal mode, Markdown case report download, and production build verification`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Day 1 Dashboard and UI shell rendering properly
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions

- Day 5: OBJECTION! mechanic complete — button, shake, Web Audio gavel, mute toggle, ObjectionModal with chips/200-char input, judge Sustained/Overruled badge, Demo Mode canned cycling, `/api/objection` with Zod + retry, history persistence; fixed TS2304 missing `saveTrialToHistory` import in `history/page.tsx`.
