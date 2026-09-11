# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install
pnpm dev        # dev server
pnpm build      # type-check (vue-tsc --noEmit) + production build to dist/
pnpm preview    # serve the production build
pnpm typecheck  # vue-tsc --noEmit only
```

No test suite or lint script exists. `dist/` is a plain static folder deployable anywhere; this repo specifically deploys to GitHub Pages via `.github/workflows/deploy.yml` (build → `actions/upload-pages-artifact` → `actions/deploy-pages`), so `vite.config.ts` sets `base: "/home/"` to match that path.

## Architecture

Minimal one-page portfolio: vanilla Vue 3 + TypeScript on Vite, no UI/CSS framework, no animation library. Single-page app (`src/App.vue`) composed of section components rendered in order: `IntroSection`, `AboutSection`, `SkillsSection`, `TimelineSection`, `ProjectsSection`. Nav highlighting for the current section is driven by `src/composables/useActiveSection.ts`.

**Content is separated from components** — all copy lives in `src/data/`, not inline in `.vue` files:

| File | Contains |
|---|---|
| `src/data/profile.ts` | name, role, pitch, about paragraphs, skills, contact links |
| `src/data/timeline.ts` | timeline entries (one line each) |
| `src/data/projects.ts` | project cards: collapsed summary + expanded details |

The Timeline section auto-hides (including its nav link) while `timeline` in `src/data/timeline.ts` is empty — this is intentional so the page stays shareable before entries are filled in. That file has the entry shape and commented-out examples ready to uncomment.

Styling: a single stylesheet with design tokens at `src/styles.css` (colors, radius, page width, fonts); component-specific styles live in each component's `<style scoped>` block. Colors/fonts intentionally match the main `portfolio` project (primary `#0a6b64`, accent `#c4443e`, Space Grotesk + Lato). A print stylesheet forces all project cards open and hides the nav so "Print → Save as PDF" produces a complete document for job applications — keep that behavior in mind when changing card expand/collapse logic.
