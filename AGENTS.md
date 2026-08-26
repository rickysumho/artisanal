# Repository Guidelines

## Project Structure & Module Organization

- `assets/` contains the theme source: layered CSS, local fonts, and JavaScript.
- `layouts/` contains Hugo templates and reusable partials.
- `archetypes/` contains starter front matter for new content.
- `i18n/` contains translated interface strings.
- `exampleSite/` is the reference Hugo site used for development and validation.
- `tests/e2e/` contains Playwright browser tests, including Axe accessibility checks.
- `public/`, `exampleSite/public/`, and `resources/_gen/` are generated outputs and must not be edited or committed.

## Build, Test, and Development Commands

- `npm test` runs the strict Hugo build, HTML validation, and the full Playwright suite.
- `npm run build` builds the example site into `public/` with minification and warning checks.
- `npm run test:e2e` runs the browser tests only.
- `npm run test:html` validates generated HTML with `html-validate`.
- `make serve` starts a local Hugo server for visual review.
- `make strict` runs the strict Hugo build directly.

Use Hugo Extended and Node.js with the versions supported by the project lockfile.

## Coding Style & Naming Conventions

Use two-space indentation in HTML, Hugo templates, CSS, JavaScript, TOML, and Markdown front matter.

Use semantic BEM-style class names such as `.journal-item__link` and keep reusable rules in the appropriate CSS layer.

Keep `assets/css/main.css` as the import entry point.

Prefer small Hugo partials over duplicated markup.

Keep content paths lowercase and use kebab-case for multiword slugs.

## Testing Guidelines

Name tests for observable behavior, for example `article back links preserve the entry section`.

Add Playwright coverage for navigation, responsive behavior, accessibility, and visual interaction changes.

Run `npm test` before submitting changes.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so use concise imperative subjects such as `Add section backlink partial`.

Pull requests should explain the user-visible change, list validation commands, and include screenshots for visual changes.

Do not include generated output, dependency caches, or unrelated formatting changes.
