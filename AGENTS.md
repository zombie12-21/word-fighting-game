# word-fighting-game

This repository is a React + Vite game project built with TypeScript and styled using Tailwind CSS. The app is a small browser-based word-fighting game, with the UI and game logic centered around the React app in `src/`.

Language composition:
- TypeScript: 91.9%
- CSS: 5.1%
- HTML: 1.4%
- JavaScript: 1.3%
- Shell: 0.3%

## Development

A Vite dev server is already running on the app’s `$PORT` (default: 8443). Do not start a second dev server manually unless explicitly required.

- Preview: available through the app preview panel
- Hot reload: enabled for source edits
- Local dev workflow: use the running Vite environment and edit files directly

## Project structure

This is the canonical structure of the repository:

- `src/main.tsx` — React entry point; imports `src/index.css` and mounts the app to `#root`
- `src/App.tsx` — main application component and the usual starting point for feature work
- `src/index.css` — global styles entrypoint; includes Tailwind CSS v4
- `index.html` — HTML shell used by Vite
- `package.json` — project scripts, dependencies, and metadata
- `vite.config.ts` — Vite configuration, React integration, Tailwind setup, and path aliases
- `.mise.toml` — Node.js and pnpm toolchain pinning
- `public/` — static assets if present
- `src/components/` — reusable UI and gameplay pieces if added over time

## Tech stack

- React 19
- React DOM 19
- TypeScript 5.7
- Vite 8
- Tailwind CSS v4
- `@vitejs/plugin-react`
- `oxfmt` for formatting

## Styling rules

This project uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin configured in `vite.config.ts`.

When adding or editing styles:
- keep the Tailwind import in `src/index.css` at the top
- place global styles in `src/index.css`
- keep component-specific styling in the relevant component or local CSS file when appropriate
- prefer utility classes for layout and design consistency
- avoid introducing conflicting global CSS unless required

Recommended order in `src/index.css`:
1. `@import 'tailwindcss';`
2. any `@font-face` declarations
3. app-level root styles and default font definitions
4. custom layout/global rules

## Working conventions

- Start by inspecting the most relevant file in `src/` before exploring the rest of the project
- Prefer minimal, targeted changes over broad refactors
- Keep the app structure aligned with the existing Vite + React + Tailwind conventions
- If a bug or feature touches multiple UI pieces, trace the relevant component boundaries before editing
- When a change affects gameplay behavior, verify the interaction flow in the app rather than only editing the display layer
- Avoid unnecessary dependencies or architectural changes unless clearly required

## Typical workflow

- Read the relevant app component first
- Check imports and related state flow
- Make the smallest change needed
- Verify it works in the running preview
- Keep formatting consistent with the project setup

## Notes for AI agents

- The repository is small and frontend-focused; most work will happen in `src/App.tsx` and related component files
- Figma Make conventions may influence the structure, but the project still behaves like a standard Vite React app
- Treat `src/index.css` as the main styling entry and keep global CSS rules minimal
- Use existing patterns in the app before introducing new abstractions or frameworks
