# Changelog

## [Unreleased] — 2026-10-05

### Added

- Entry screen now offers an illustrated intro, Life cycle films, or direct portfolio access.
- Added the supplied 10-second film to a data-driven Life cycle collection; new films automatically appear in the intro chooser.
- Portrait mobile playback gate, rotate-back pause, explicit play/resume, native video controls, and portfolio link after playback. Video loading is deferred until Play.

- Responsive canvas composition now extends campus, skyline, character scale, and scene overlays to tall mobile screens without stretching the artwork.
- Added chapter navigation and desktop editorial notes/postcards for the four career stages.

- Replaced the intro with the supplied canvas career-story engine and six original transparent sprites: terminal boot, campus, coding, graduation, and developer scenes.
- Full-viewport intro with scene-colored backgrounds, 15 seconds of active playback, immediate skip, pause/resume, visibility pausing, and asset-failure fallback. The reusable CareerStory defaults to the original 19-second loop.
- Lossless WebP sprites preserve transparency and the original character artwork; no animation dependency added.

- Light and dark themes, initialized from the device preference and remembered locally.
- Quick navigation and project search with `⌘K` / `Ctrl+K`.
- Searchable projects with technology filters and shareable search URLs.
- Searchable certifications by course title or issuer.
- Resume preview with a PDF download, keyboard dismissal and native dialog focus management.
- Copy-email action with success and failure feedback.
- Home highlights and selected projects linked to the full portfolio.
- A prominent Contact showcase for the original hand-drawn employee badge, with a decorative lanyard, artwork caption and full-size preview.
- A pastel scrapbook treatment for the original artwork throughout the site: a graduation Polaroid, a mint experience board, a project browser frame, a community illustration and a personal postcard. Home has a greeting doodle and illustrated skill tiles; institutional logos have subtle stamp and pin frames.
- Responsive layouts for small phones, tablets and desktop screens.
- Automated interaction tests, strict TypeScript checks and React/accessibility linting.

### Changed

- Replaced Create React App / Webpack with Vite.
- Rebuilt all application components as typed React function components and hooks.
- Split page components, shared UI, content data and utility functions into separate folders.
- Renamed `assests` to `assets`; preserved the original artwork, signature, purple identity and fonts.
- Preserved the six projects, 22 certificates, original experience entries, resume files and social links used by the old site.
- Retained `/home`, `/education`, `/experience`, `/projects`, `/contact`, `/opensource` and `/splash` hash routes and the `/resume/` deployment base.
- Restored the original animated intro at `/` and `/splash`. Converted its 14.9 MB embedded-image Lottie JSON into an optimized animated WebP without a Lottie runtime. It displays for 15 seconds with the original frame timing, preloads the Home portrait at low priority, supports immediate skipping, and enters Home even if the image never loads. Mobile uses a full-screen cream and lilac composition, an uncropped animated portrait, a compact top-right skip control, and a 15-second progress line with safe-area-aware spacing. Reduced-motion users go straight to Home; direct page links still bypass the intro.
- Open Source clearly labels its existing data as an archived snapshot, rather than live activity.
- Converted large illustrations and the animated portrait to optimized WebP derivatives. Original assets remain in the repository. Reduced-motion users receive a still portrait.
- Standardized on npm and one lockfile. The former Yarn lock is no longer used.
- Replaced the old tooltip, modal, animation and UI libraries with native HTML, CSS and shared React components.

### Dependencies

Direct dependencies were checked against npm's `latest` tag on 2026-10-05 and pinned in the lockfile:

| Package                    | Version |
| -------------------------- | ------- |
| React / React DOM          | 19.3.0  |
| React Router               | 8.4.0   |
| Lucide React               | 1.52.0  |
| Vite                       | 8.3.2   |
| Vite React plugin          | 6.1.1   |
| TypeScript                 | 7.0.2   |
| Vitest                     | 5.0.3   |
| jsdom                      | 30.1.2  |
| Testing Library React      | 16.3.3  |
| Testing Library jest-dom   | 7.0.1   |
| Testing Library user-event | 14.6.7  |
| Oxlint                     | 1.86.0  |
| gh-pages                   | 6.3.0   |

Node is pinned to **22.23.3** in `.nvmrc`; npm is **12.2.0**. TypeScript ESLint's current peer range does not support TypeScript 7, so linting uses Oxlint instead of forcing an incompatible dependency tree.

### Fixed

- React peer dependency conflicts that prevented a normal npm install.
- Legacy unpadded project dates failing in stricter date parsers.
- Empty destination buttons in Contact; only configured destinations are actionable.
- Missing React list keys, legacy render APIs, incorrect JSX attributes and nested popup component definitions.
- Modal keyboard access, scroll locking, mobile navigation and route scroll restoration.

### Removed

- Unused template sections, duplicate components, bundled Font Awesome, and legacy CRA service-worker scaffolding.
- Unused global Iconify, Anime.js, CanvasJS and legacy analytics scripts from the document shell. No new tracking was added.

### Migration notes

- Run `nvm install && nvm use`, then `npm install -g npm@12.2.0` if needed.
- Use `npm ci`, `npm start` and `npm run check`.
- Build output remains `build/`; `npm run deploy` still targets GitHub Pages through `gh-pages`.
- No deployment has been performed as part of this refactor.
- Existing resume content, employment dates and external project links have not been independently refreshed; edit them in `src/data/` when ready.

### Career story intro

- Adapted the supplied career-story concept into four synchronized chapters: campus, Computer Science, graduation, and software engineering. Reuses frames from the original illustration with chapter-specific accents, captions, and graduation confetti.
- Preserves the 15-second deadline, immediate skip, reduced-motion bypass, and image-error fallback. Uses React/CSS without additional runtime dependencies or external fonts.
- Added a two-second terminal opening that types `npm run my-journey` before the four chapters; total intro duration remains 15 seconds.
- Added chapter-specific scenery: campus architecture and drifting petals, a code window with a reveal animation and bug-fix badge, graduation caps and achievement toast, and a developer workspace with a skyline. Added staggered entrances while preserving skip and the 15-second clock.
- Added explicit 32px PNG and ICO favicons plus an Apple touch icon from the existing artwork. The header wordmark now replays the main intro.
- Added short, replayable illustration stories on Home, Education, Experience, Projects, Open Source, and Contact without blocking page interaction; disabled for reduced motion.
- Enlarged certification logo containers, constrained both dimensions with contain sizing, and retained a white logo backing in dark mode so dark marks stay readable.

- Corrected low-contrast certification artwork: dark backing for Thai MOOC, Mahidol, and Kasetsart white wordmarks, green for Android Enterprise. Wider logo panels preserve horizontal artwork at readable sizes.

- Restored each certification’s original `color_code` backing instead of guessing logo contrast; fixed intrinsic grid image overflow with a bounded flex container and explicit image height.
- Replaced caption-only Little Story controls with an on-demand three-act illustration player. Each page uses its own artwork and narrative; employee badge swings in, artwork gains color, and the final act celebrates. Includes pause, next, replay, close/Escape, and manual progression for reduced-motion visitors.
