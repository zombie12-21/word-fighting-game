# word-fighting-game

A React + Vite game project built with TypeScript and styled with Tailwind CSS. It is primarily a TypeScript codebase, with supporting CSS and small amounts of HTML, JavaScript, and Shell.

Language composition:
- TypeScript: 91.9%
- CSS: 5.1%
- HTML: 1.4%
- JavaScript: 1.3%
- Shell: 0.3%

## Development

A Vite dev server is already running on the app’s `$PORT` (default: 8443). You do not need to start it manually.

- Preview: available through the app preview panel
- Live updates: changes are reflected immediately in the running app

## Project structure

This is the canonical structure for the project:

- `src/main.tsx` — application entry point; imports `src/index.css` and mounts the app into `#root`
- `src/App.tsx` — main UI component and the usual starting point for app-level changes
- `src/index.css` — global stylesheet entry; includes Tailwind CSS v4
- `index.html` — Vite shell that contains the root element and loads `src/main.tsx`
- `package.json` — scripts, dependencies, and project metadata
- `vite.config.ts` — Vite configuration, React setup, Tailwind v4 integration, and path aliases
- `.mise.toml` — Node.js and pnpm toolchain versions

## Stack

- React 19
- React DOM 19
- TypeScript 5.7
- Vite 8
- Tailwind CSS v4
- `@vitejs/plugin-react`
- `oxfmt` for formatting

## Styling

This project uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin configured in `vite.config.ts`. Global styles should be placed in `src/index.css`, and the Tailwind import should remain at the top of that file.

Recommended pattern:
1. Keep `@import 'tailwindcss';` first
2. Add any `@font-face` rules next
3. Then add app-level custom CSS and defaults

## Working conventions

- Prefer making the smallest relevant change to the feature or component being edited
- Start from `src/App.tsx` or the closest relevant component before exploring elsewhere
- Only inspect additional files when necessary to understand imports, styling, or data flow
- Keep the app consistent with the existing Vite + React + Tailwind structure
