# Agent Guidelines for Tribunal

This repository follows strict architectural rules and lean implementation practices for the Devpost "Build With AI: Basics" hackathon.

## Core Directives for AI Coding Agents
1. **Scope Integrity**: Do not invent features outside `scope.md` and `prd.md`. Adhere strictly to the milestone plan.
2. **Minimal Edits**: Make targeted, surgical edits. Do not rewrite whole files for small changes.
3. **No File Bloat**: Do not read `node_modules/`, lockfiles, images, or files > 20KB.
4. **Token & Call Discipline**:
   - Live trial analysis is capped at ONE single LLM call returning validated JSON.
   - Live objection is capped at ONE small LLM call.
   - Never implement multi-agent autonomous loops or infinite conversation chains.
5. **Offline Demo First**:
   - The app must remain 100% testable and runnable offline in Demo Mode without any API keys or network connection.
   - Never break or bypass the 3 offline demo cases in `/data/demo-cases/`.
6. **Security & Credentials**:
   - Gemini API keys may start with `AQ.` or `AIza`. Never validate key prefixes with regex.
   - All LLM calls must remain in server-side API routes.
   - Never request, print, or log API keys. Never commit `.env*` files to Git.
7. **Design Fidelity**:
   - Strictly adhere to `DESIGN.md` and custom Tailwind tokens.
   - Prohibited color: NO navy blue anywhere. Use page cream `#F6F3EE`, card `#FBFAF8`, hero charcoal `#151517`, wood `#2A1D19`/`#40312D`, gold `#B67F3D`, teal `#43877C`.
8. **Readable Code**: Keep comments concise, clear, and easy for a beginner-to-intermediate developer to explain in a demo video.
