# Copilot / Agent Onboarding — civic-lens

## Summary
This repo implements "Civic Lens": a civic engagement web app with AR features, gamification, and AI agents for issue tracking and resolution. The front end is a TypeScript + React single-page app (Vite) that integrates mapping and AI SDKs.

## Tech stack
- Language: TypeScript (primary), HTML (static shell)
- Framework / Tooling: React (v19), Vite
- Key libs: @google/genai, leaflet, react-markdown
- Dev tools: TypeScript (tsc), Vite, pnpm (lockfile present)
- Config: tsconfig.json, vite.config.ts, pnpm-lock.yaml

## How to run (quick)
1. Install deps (preferred): `pnpm install`
   - pnpm-lock.yaml is present; using pnpm ensures reproducible installs.
2. Start dev server: `pnpm dev`
3. Build for production: `pnpm build`
4. Preview build: `pnpm preview`
5. Optional type check: `pnpm exec tsc --noEmit`

## Scripts (from package.json)
- `dev`: vite
- `build`: vite build
- `preview`: vite preview

## Coding guidelines (agent rules)
- Always produce TypeScript with explicit types where reasonable. Prefer existing shared types in `types.ts`.
- Keep changes small and focused; prefer adding a new module over modifying many files.
- Follow existing patterns (React functional components, hooks directory for shared hooks).
- Run a local type-check and build after changes: `pnpm exec tsc --noEmit && pnpm build`
- Do not add secrets or hard-coded API keys. If a feature needs credentials, add a README note referencing `SETUP_GEMINI_API.md`.
- Document behavior and add unit tests where business logic is introduced (this project currently emphasizes type safety and small UI units).
- When committing, use clear messages and disclose AI assistance in the PR description if code was generated.

## Project structure (top-level)
- `.gitignore`
- `AGENTS_EXPLAINED.md`, `AGENTS_VISUAL_GUIDE.md` — agent docs
- `ARCHITECTURE.md`, `QUERY_FLOWS.md`, `GETTING_STARTED.md`, `NEXT_STEPS.md`
- `SETUP_GEMINI_API.md` — API/credentials setup notes
- `App.tsx`, `index.tsx`, `index.html` — app entry and shell
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`
- `types.ts` — shared TypeScript types
- `prompts.txt` — helpful prompt templates
- Directories: `agents/`, `components/`, `services/`, `utils/`, `hooks/`, `data/`

## Important resources & caveats
- Use pnpm for installs (lockfile present). If pnpm is not available, fallback to npm/yarn is possible but may produce different dependency tree.
- @google/genai likely requires external credentials; consult `SETUP_GEMINI_API.md` before enabling agent calls.
- There are no explicit test or linter scripts in package.json. Run `tsc` and `vite build` to catch most integration/type issues.
- Prefer adding small PRs with explicit testable behavior. For UI, include visual/regression notes; for services include type-safe payloads and error handling.

## Agent prompting patterns (practical)
- Always include file path and expected types: e.g. "In `components/Header/SearchBar.tsx`, implement `SearchBar(props: {query: string, onSearch: (q:string)=>void})` using styles from `components/Header/styles.css` and types from `types.ts`."
- Ask for small, testable units and request types, edge cases, and error handling.
- If touching the AI integration, include `SETUP_GEMINI_API.md` and do not assume credentials.

## Safety & security
- Never commit keys or credentials. Use environment variables and reference docs.
- Flag any third‑party network calls for maintainer review.

## If something fails
- First confirm `pnpm install` completed successfully.
- Run `pnpm exec tsc --noEmit` to isolate type errors, then `pnpm build` to find bundling issues.
- Check `SETUP_GEMINI_API.md` before using @google/genai features.

**Last updated: 2025-11-05**
