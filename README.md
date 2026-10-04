# Korrakot's portfolio

React function components, TypeScript and Vite. The original portfolio content and purple visual identity, with responsive layouts and accessible interactions.

## Getting started

Use the Node version in `.nvmrc` and npm 12.2.0. The older Node 22.17 runtime does not meet the latest dependencies' requirements.

```sh
nvm install
nvm use
npm install -g npm@12.2.0
npm ci
npm start
```

Open the `/resume/` URL printed by Vite. npm is the supported package manager; use `package-lock.json` rather than generating a second lockfile.

## Commands

| Command                     | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `npm start` / `npm run dev` | Start the development server                   |
| `npm run build`             | Type-check and create `build/`                 |
| `npm run preview`           | Preview the production build                   |
| `npm test`                  | Run interaction and utility tests              |
| `npm run test:watch`        | Watch tests while developing                   |
| `npm run lint`              | Lint React, TypeScript and accessibility rules |
| `npm run check`             | Run lint, tests and a production build         |
| `npm run deploy`            | Build and publish `build/` to GitHub Pages     |

## Structure

```text
src/
  components/     Shared layout, links, search, dialogs and cards
  pages/          Home, education, experience, projects, contact and open source
  data/           Profile, skills, experience, certificates and project data
  lib/            Typed helpers and explicit asset imports
  assets/         Original artwork/fonts and optimized image derivatives
  test/           Test setup and interaction coverage
  App.tsx         Route definitions with lazy-loaded pages
  main.tsx        React entry point and HashRouter
  styles.css      Design tokens, components, themes and breakpoints
```

Edit personal content in `src/data/content.json`; edit projects in `src/data/opensource/projects.json`. `src/data/portfolio.ts` exposes the typed content consumed by pages. Contact details and enabled social links live there as well. Image imports are explicit in `src/lib/images.ts` so unused original artwork stays out of the build.

## Interaction and QA

- Existing hash URLs work under the GitHub Pages `/resume/` base.
- Theme selection follows the device initially, then remembers the user's selection.
- `⌘K` or `Ctrl+K` opens quick search. Use Tab/Enter to choose and Escape to close.
- Project search can be shared using `#/projects?q=React`.
- Resume and video dialogs use native modal behavior; Escape closes them and focus returns to the trigger.
- Validate at 320, 390, 768, 1024 and desktop widths: no horizontal overflow, readable cards, working menu, and dialogs that stay within the viewport.
- The saved GitHub activity is historical. Employment dates, biography and outbound URLs remain the original content; this refactor does not certify that they are current.

See [CHANGELOG.md](./CHANGELOG.md) for the migration, package versions and feature list.
