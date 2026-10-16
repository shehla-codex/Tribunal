# Tribunal — "Your code. Put on trial."

> An adversarial, owl-themed AI courtroom where your code is judged by three AI characters: a strict Prosecutor, a pragmatic Defense Attorney, and a wise Judge.

Built for the **Devpost Learn Hackathon: "Build With AI: Basics"**.

---

## ⚖️ Features
- **Theatrical Deliberation**: Watch three cartoon owl characters debate your code turn-by-turn with animated typing indicators and avatar states.
- **Interactive OBJECTION!**: Hit the objection button mid-trial to interject your own counter-argument, triggering dramatic screen shake, overlay effects, and in-character rulings.
- **Fair & Actionable Verdict**: Receive a binding verdict stamp (*Guilty*, *Not Guilty*, or *Guilty with Community Service*), a circular Code Health Score ring (0–100), and a prioritized "Sentence" list of fixes with exact file and line references.
- **Offline Demo Mode**: Includes 3 pre-built trial cases that run 100% offline with zero API keys or external network dependencies.
- **Appeal & Comparison**: Re-evaluate improved code and see before/after score deltas.
- **Client-Side History**: All completed trials persist locally in browser `localStorage`.
- **Markdown Export**: Download clean case reports for team review or GitHub PR documentation.

---

## 🛠️ Stack & Architecture
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom courtroom palette tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **AI Integration**: [Google GenAI SDK](https://github.com/google-gemini/generative-ai-js) (single-call structured JSON prompt)

### Token-Saving Architecture
Instead of multi-agent loops that burn thousands of tokens, Tribunal generates the complete trial (charges, debate dialogue, category scores, verdict, and sentence) in **one single structured LLM call**.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: Demo Mode works out of the box with **no API keys required**. To enable live analysis with your own code, create a `.env.local` file with:
> ```env
> LLM_PROVIDER=gemini
> LLM_MODEL=gemini-2.5-flash
> LLM_API_KEY=your_gemini_api_key_here
> ```

---

## 📁 Repository Structure
```
tribunal/
├── app/               # Next.js App Router (pages & layouts)
├── components/        # UI components (AppShell, HeroBanner, Courtroom, Verdict)
├── lib/               # Schemas, LLM caller, and localStorage helpers
├── data/demo-cases/   # Pre-generated offline demo cases
├── public/assets/     # Mascots, banners, and logos
├── devpost/           # Devpost Learn hackathon course artifacts
├── DESIGN.md          # Visual specification and palette tokens
├── DEMO_SCRIPT.md     # 1-3 minute video demonstration script
├── AGENTS.md          # Directives for AI coding agents
└── LICENSE            # MIT License
```

---

## 📜 License
Distributed under the [MIT License](file:///c:/dev/tribunal/LICENSE).
