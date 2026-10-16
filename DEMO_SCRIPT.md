# Tribunal — Demo Video Script (1–3 Minutes)

*Target Duration: 2 minutes (Max 3 minutes)*
*Audience: Devpost Hackathon Judges ("Build With AI: Basics")*

---

### 0:00 – 0:25 | The Hook & The Problem
- **Visual**: Show the Tribunal Dashboard at `http://localhost:3000`. Point out the courtroom hero banner, owl mascots, and tagline *"Your code. Put on trial."*
- **Script**:
  > "Static code analysis is boring, and generic chat LLM feedback is a wall of sterile text that doesn't push you. Welcome to **Tribunal**, where your code is put on trial before three AI owl characters: a strict Prosecutor who uncovers real flaws, a pragmatic Defense Attorney who defends your choices and proposes fixes, and a wise Judge who delivers a binding verdict and Sentence."

---

### 0:25 – 1:00 | The Trial in Action (Demo Mode)
- **Visual**: Click one of the 3 instant Demo Cases (e.g., *API Token Leak & Validation*). Show the turn-by-turn debate animation in "The 3 AI Judges" panel.
- **Script**:
  > "To respect API limits and allow anyone to test this with zero setup, Tribunal features a 100% offline Demo Mode. Here, the Prosecutor charges our code with a critical security flaw. The Defense argues the context, and they debate turn-by-turn in real time."

---

### 1:00 – 1:30 | The Interactive Twist: OBJECTION!
- **Visual**: Hit the **OBJECTION!** button mid-trial. The screen shakes, a dramatic courtroom banner appears, and the user enters a counter-statement. The Judge rules on the objection.
- **Script**:
  > "As the developer, you aren't just a spectator—you can interject at any time with the OBJECTION button! I'll state that this token was actually meant for a local mock. The gavel strikes, the Judge evaluates my statement, and adapts the deliberation."

---

### 1:30 – 2:05 | Verdict & The Sentence
- **Visual**: Show the animated Verdict Stamp ("Guilty with Community Service"), the circular Code Health Score ring (e.g., 78/100) with Logic, Security, and Maintainability bars, and the ranked "Sentence" fix list.
- **Script**:
  > "The deliberation concludes, and the Judge renders the verdict with an animated stamp, a circular Code Health Score ring, and a ranked 'Sentence' of actionable fixes with exact line numbers. We can inspect detailed findings across Logic, Security, and Maintainability."

---

### 2:05 – 2:40 | Appeal, History & Markdown Export
- **Visual**: Switch to the **Appeal** tab showing before/after score improvement; show the **History** tab with past trials stored in `localStorage`; click **Export** to show the downloadable Markdown report.
- **Script**:
  > "Once you patch your code, the Appeal tab lets you resubmit and see your score jump from 78 to 92. Past cases are saved right in your browser's local storage, and you can export a complete case report in Markdown for your records or PR review."

---

### 2:40 – 3:00 | Technical Wrap-Up & Closing
- **Visual**: Show GitHub repo / architecture diagram.
- **Script**:
  > "Under the hood, Tribunal is built with Next.js App Router, TypeScript, and Tailwind CSS. Live trials are powered by a single-call Google Gemini JSON schema validated by Zod, delivering comprehensive critique in seconds without burning tokens. Tribunal turns code review from a chore into court drama. Thanks for watching!"
