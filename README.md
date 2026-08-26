# home

A minimal one-page portfolio for job applications — dense, scannable, and quick to share.
Vanilla Vue 3 + TypeScript on Vite. No UI framework, no CSS framework, no animation
libraries: `vue`, `vite`, `@vitejs/plugin-vue`, `typescript`, `vue-tsc`.

## Commands

```bash
pnpm install
pnpm dev        # dev server
pnpm build      # type-check + production build to dist/
pnpm preview    # serve the production build
pnpm typecheck  # vue-tsc only
```

`dist/` is a plain static folder — host it anywhere (Vercel, Netlify, GitHub Pages, any
web server).

## Page structure

1. **Intro** — name, role, one-paragraph pitch, contact links, skill strip
2. **About** — three condensed paragraphs
3. **Timeline** — career, education and personal milestones (currently empty)
4. **Projects** — expandable cards, collapsed by default

## Editing content

All text lives in `src/data/`, separated from the components:

| File                   | Contains                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `src/data/profile.ts`  | name, role, pitch, about paragraphs, skills, contact links   |
| `src/data/timeline.ts` | timeline entries (one line each)                             |
| `src/data/projects.ts` | project cards: summary shown collapsed, details when expanded |

The timeline section is **hidden while `timeline` is empty**, so the page stays
shareable until the entries are filled in. `src/data/timeline.ts` contains the entry
shape plus commented-out examples (MSc, BSc, jobs, cycling trip, certificates) — fill in
the dates and the section appears, along with its nav link.

## Styling

One stylesheet with design tokens: `src/styles.css` (colors, radius, page width, fonts).
Component-specific styles live in the `<style scoped>` block of each component.
Colors and fonts match the main portfolio (primary `#0a6b64`, accent `#c4443e`,
Space Grotesk + Lato).

A print stylesheet forces all project cards open and hides the nav, so
"Print → Save as PDF" produces a complete one-page-style document for applications.
