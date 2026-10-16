---
doc: spec
status: approved
---

# Tribunal — Technical Spec

## How This Works, In Plain Language
Tribunal is a client-first Next.js web application designed to run with zero operational cost and minimal LLM tokens. 
- The user provides code through a paste box or clicks one of three pre-built Demo Cases.
- For Demo Cases, the entire trial (charges, arguments, objection responses, verdict, and appeal data) is loaded instantly from local JSON files with zero API calls.
- For live code, a single server-side Next.js API route (`/api/trial`) sends the code to Google Gemini (or specified LLM) with a strict JSON schema. The model returns the entire trial—charges, Prosecutor/Defense dialogue, category scores, verdict, and sentence—in **one single request**.
- If the user clicks "OBJECTION!" during live mode, a tiny secondary API call (`/api/objection`) generates the Judge's response. In Demo Mode, pre-written responses are used offline.
- Case history is stored directly in the browser's `localStorage`. No database, no user accounts, and no background workers are required.

## Day 1 Scope Boundary
Day 1 is strictly restricted to setup, documentation, design tokens, and static UI scaffolding:
- **Files Created on Day 1**:
  - `README.md`
  - `LICENSE` (MIT)
  - `.gitignore` (ignoring `node_modules`, `.next`, `.env*`, `.DS_Store`, `/devpost/learner-profile.md`; allowing `.env.example`)
  - `.env.example` (template with empty/commented keys)
  - `AGENTS.md` (rules for AI coding assistants working in repo)
  - `DEMO_SCRIPT.md` (placeholder structure for 1–3 min demo video)
  - `DESIGN.md` (complete color palette, typography, layout tokens)
  - Tailwind configuration (`tailwind.config.ts`) with custom tokens
  - Static Dashboard App Shell (persistent sidebar, top bar, hero banner, demo cards) using placeholder assets
- **Strictly Deferred to Day 2+**:
  - No LLM integrations (`@google/genai` or Gemini API calls)
  - No API routes (`/api/trial`, `/api/objection`, `/api/github`)
  - No live code analysis, dynamic objection execution, or live appeal evaluation

## The Core Journey Through the System
1. **User opens Dashboard** (`/`): Browser loads static shell and reads any past cases from `localStorage`.
2. **User selects Demo Case or pastes code**:
   - *Demo path (Day 2)*: Client loads JSON from `/data/demo-cases/*.json` into React state.
   - *Live path (Day 2)*: Client POSTs code to `/api/trial`. Server calls LLM with Zod-structured prompt, validates returned JSON, and returns it to client.
3. **Courtroom debate runs (Day 3)**: React state controller steps through the turns on a timer, rendering typing animations. "Skip Animation" reveals the full text immediately.
4. **User clicks "OBJECTION!" (Day 5)**: Courtroom timer pauses; client triggers CSS shake animation and modal. Submitting a statement either fetches a canned reply (Demo) or calls `/api/objection` (Live), and resumes debate.
5. **Verdict is revealed (Day 3)**: Stamp overlay animates into view, SVG circular Code Health Score ring animates to final score, and categorized findings render.
6. **User appeals or exports (Day 6)**:
   - *Appeal*: Pre-written before/after diff renders in Demo mode; in live mode, updated code recalculates score.
   - *Export*: Client compiles case state into Markdown text and triggers a native browser file download.
   - *History*: Case is serialized into `localStorage.getItem("tribunal_history")`.

## Stack
- **Framework**: Next.js 14+ (App Router) — Server-side API routes protect API keys; React server & client components provide fast static loading.
- **Language**: TypeScript — Type safety across trial schema and component props.
- **Styling**: Tailwind CSS — Rapid utility styling matching reference palette tokens; custom CSS keyframes for screen shake and stamp animation.
- **Schema Validation**: Zod — Validates LLM JSON output to prevent malformed runtime crashes.
- **LLM SDK (Day 2)**: Official `@google/genai` (or standard REST fetch with `x-goog-api-key`) supporting modern Gemini API keys (including those starting with `AQ.`). Read exclusively from `process.env.LLM_API_KEY` on the server.
- **Icons**: Lucide React (`lucide-react`) — Clean, lightweight iconography.

## Where It Runs and How Someone Tries It
- **Local Development**:
  ```bash
  npm install
  npm run dev
  ```
  Open `http://localhost:3000`. Runs fully offline in Demo Mode without `.env.local`.
- **Live LLM Execution (Day 2+)**: Requires `.env.local` containing `LLM_API_KEY` (Gemini key starting with `AQ.` or `AIza`), `LLM_PROVIDER=gemini`, and `LLM_MODEL=gemini-2.5-flash`. Key is loaded server-side only; never exposed to browser or committed to Git.
- **Deployment**: Vercel (zero-config Next.js deployment).

## Look and Feel
- **Color Tokens**:
  - Background cream: `#F6F3EE` | Card surface: `#FBFAF8`
  - Hero charcoal: `#151517` | Hero stone: `#3C3538`
  - Courtroom wood: `#2A1D19` / `#40312D`
  - Gold accent: `#B67F3D` (light `#E5C994`) | Teal accent: `#43877C`
  - Prosecutor crimson: `#9B2C2C` | Defense blue: `#4A86C5` | Judge gold: `#E0A64A`
  - Strict rule: NO navy blue anywhere.
- **Typography**: Playfair Display for courtroom headers; Inter for body UI and code.

## Components
- **`AppShell`** (Day 1): Persistent sidebar (Dashboard, New Review, History, Settings) + TopBar with Tribunal logo. Implements `prd.md > Screens and Layout`.
- **`HeroBanner`** (Day 1): Dark courtroom banner with placeholder mascots, tagline, and call to action. Implements `prd.md > Dashboard`.
- **`DemoCaseCards`** (Day 1): Dashboard cards showcasing the 3 available trial scenarios. Implements `prd.md > Dashboard`.
- **`CodeEditorPanel`** (Day 2): Syntax-highlighted code paste input and preview file tree. Implements `prd.md > New Review`.
- **`CourtroomPanel`** (Day 3): Turn-based debate animator, avatar status pills, "Thinking..." badges, and skip button. Implements `prd.md > Deliberation Engine`.
- **`ObjectionModal`** (Day 5): Screen shake trigger, counter-statement input, and Judge ruling banner. Implements `prd.md > Interactive OBJECTION! Mechanic`.
- **`VerdictCard`** (Day 3): Stamp graphic ("Guilty", "Not Guilty", "Guilty with Community Service"), circular SVG score ring, category breakdown bars, and ranked Sentence. Implements `prd.md > Verdict & Health Score`.
- **`AppealTab`** (Day 6): Before/after score comparison and revised code view. Implements `prd.md > Appeal Tab`.
- **`HistoryTable`** (Day 4): Client-side trial records from `localStorage` with view and delete actions. Implements `prd.md > Client-Side History`.

## Data Model (Zod Schemas)
```typescript
export interface TrialCase {
  id: string;
  caseName: string;
  timestamp: number;
  codeSnippet: string;
  language: string;
  charges: {
    id: string;
    severity: "Minor" | "Serious" | "Critical";
    category: "Logic" | "Security" | "Maintainability";
    title: string;
    description: string;
    file?: string;
    line?: number;
  }[];
  debate: {
    speaker: "prosecutor" | "defense" | "judge";
    text: string;
    chargeId?: string;
  }[];
  scores: {
    overall: number; // 0-100
    logic: number;
    security: number;
    maintainability: number;
  };
  verdict: {
    ruling: "Guilty" | "Not Guilty" | "Guilty with Community Service";
    summary: string;
    sentence: string[]; // ranked actionable fixes
  };
  cannedObjections?: {
    trigger: string;
    ruling: "Sustained" | "Overruled";
    reply: string;
  }[];
  appealData?: {
    revisedCode: string;
    previousScore: number;
    newScore: number;
    improvements: string[];
  };
}
```

## File Structure
```
tribunal/
├── app/
│   ├── layout.tsx              # Root layout with fonts & theme (Day 1)
│   ├── page.tsx                # Dashboard page shell (Day 1)
│   ├── review/
│   │   └── page.tsx            # Review & Courtroom trial page (Day 2-3)
│   ├── history/
│   │   └── page.tsx            # History page (Day 4)
│   └── api/                    # DEFERRED TO DAY 2+
│       ├── trial/route.ts      # Single-call trial generator (Day 2)
│       ├── objection/route.ts  # Objection responder (Day 5)
│       └── github/route.ts     # GitHub file tree fetcher (Day 5)
├── components/
│   ├── AppShell.tsx            # Sidebar + Header (Day 1)
│   ├── HeroBanner.tsx          # Courtroom hero section (Day 1)
│   ├── DemoCaseCards.tsx       # Demo case cards on dashboard (Day 1)
│   ├── CodeReview.tsx          # Code input + file preview (Day 2)
│   ├── Courtroom.tsx           # Turn-by-turn debate animation (Day 3)
│   ├── ObjectionModal.tsx      # Objection modal + shake effect (Day 5)
│   ├── VerdictView.tsx         # Score ring + Stamp + Sentence (Day 3)
│   └── CaseReportModal.tsx     # Markdown report export (Day 6)
├── lib/
│   ├── schema.ts               # Zod schemas & TypeScript types (Day 2)
│   ├── llm.ts                  # Gemini/LLM caller (Day 2)
│   ├── prompts.ts              # Courtroom trial single-call prompt (Day 2)
│   ├── github.ts               # GitHub API helper (Day 5)
│   └── storage.ts              # localStorage history helper (Day 4)
├── data/
│   └── demo-cases/             # 3 offline JSON cases (Day 2)
│       ├── demo-auth.json      # Auth token leak case
│       ├── demo-async.json     # Unhandled promise & logic case
│       └── demo-sql.json       # Injection & validation case
├── public/
│   └── assets/                 # Mascots, banners, logos (Day 1 placeholders)
├── devpost/                    # Course artifacts
├── DESIGN.md                   # Visual tokens & color palette (Day 1)
├── README.md                   # Project overview & quickstart (Day 1)
├── LICENSE                     # MIT license (Day 1)
├── AGENTS.md                   # Agent guardrails & guidelines (Day 1)
├── DEMO_SCRIPT.md              # 1-3 min video script placeholder (Day 1)
├── scope.md / prd.md / spec.md # Canonical planning docs
├── tailwind.config.ts          # Tailwind theme tokens (Day 1)
└── package.json                # Project dependencies (Day 1)
```

## External Services and Dependencies
- **Google Gemini API** (Day 2+): Endpoint `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`. Header `x-goog-api-key: $LLM_API_KEY`. Free tier covers hackathon usage.
- **GitHub REST API** (Day 5, P2): Endpoint `https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`. Optional `GITHUB_TOKEN`.
- **Vercel**: Static + serverless hosting.

## Important Failure Modes
1. **Malformed LLM JSON**: Zod parse fails → `/api/trial` retries once with temperature 0; if still invalid, returns friendly courtroom error alert with "Retry Analysis" button.
2. **Missing or Invalid API Key**: Live analysis displays inline banner *"Court Adjourned: Invalid or Missing API Key. Try Demo Mode."*
3. **Rate Limits on GitHub API**: GitHub repo analysis exceeds limit → falls back to informing user to paste code directly.
4. **Corrupt LocalStorage**: History loading safely catches parse errors and resets to empty state without app crashing.

## What Was Simplified and Why
- **Single-Call JSON Trial instead of Multi-Agent Loop**: Generating charges, dialogue, scores, and verdict in one LLM call saves 80%+ tokens, avoids rate-limit timeouts, and completes in 4–6 seconds.
- **Client-Side History instead of Postgres/Supabase**: Uses `localStorage` to avoid database provisioning, migrations, and credentials.
- **Curated Demo Cases instead of Live Mock Server**: Hardcoded JSON cases allow 100% offline evaluation without mocks or backend overhead.

## Decisions and Open Issues
- **Day 1 Scope Enforcement**: Strictly limited to project scaffolding, folder structure, `README.md`, `LICENSE` (MIT), `.gitignore`, `.env.example`, `AGENTS.md`, `DEMO_SCRIPT.md` (placeholder), `DESIGN.md`, Tailwind design tokens, and the static dashboard app shell with placeholder images.
- **Security & Key Handling**: API key read exclusively from `process.env.LLM_API_KEY` on server routes. Never sent to browser, never logged, and `.env*` ignored by git.
