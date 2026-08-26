# Artisanal

Artisanal is a quiet, editorial Hugo theme for personal sites, portfolios, journals, and resumes.
It uses a narrow reading measure, serif display typography, sans-serif body text, and small motion details.

## Requirements

The theme requires Hugo 0.158.0 or newer.
The local test suite uses Hugo 0.165.0 as its current version.
The theme does not require Hugo Extended, Node, Sass, Tailwind, or a network connection during a site build.

## Local setup

Keep this directory beside the Hugo site that uses it, or place it in that site's `themes/artisanal` directory.
Set `theme = 'artisanal'` in the site configuration.
Copy the configuration and content from `exampleSite` as a starting point.

From this repository, run:

```sh
npm install
npx playwright install chromium webkit
make build
make serve
```

The example site is then available at <http://127.0.0.1:1313/>.

## Configuration

The theme reads the following optional values under `params.artisanal`:

- `accent` controls decorative green marks.
- `accentText` controls interactive text and must meet the WCAG contrast target when changed.
- `dateFormat` controls dates in journal and resume views.
- `social` is a list of objects with `name`, `url`, and an optional supported `icon` value of `github`, `linkedin`, `email`, or `rss`.

Use Hugo's `menus.main` for the primary navigation.
The theme renders nested entries and marks the current page with `aria-current`.

## Content shapes

The home page uses the root `_index.md` file.
Set `artisanal.subtitle` for the short line below the title.
Set `artisanal.portrait.resource` and `artisanal.portrait.alt` to show an optional page-bundle image.
The Markdown body becomes the short introduction.

Set `type: journal` on a section to use the journal archive layout.
Set `artisanal.view: list` or `artisanal.view: gallery` on child sections.
Gallery entries use `artisanal.image` and `artisanal.alt` to identify a page-bundle image.
Journal entries use normal Hugo `title`, `date`, `description`, `summary`, `tags`, and Markdown content.

Set `layout: resume` on a page to use the resume layout.
Add `artisanal.sections` with `title` and `entries` values.
Each entry supports `period`, `organization`, `role`, `summary`, and optional `projects` values.
Each project supports `title`, `summary`, and `url`.

## Customization

Override any theme template by placing a file at the same path in the site's `layouts` directory.
Override the stylesheet by copying the `assets/css` directory into the site and changing the asset pipeline entry.
Keep site content in page bundles when it has images or other local resources.
Use meaningful alternative text for content images and an empty alternative attribute for decorative images.
The `--artisanal-hover` custom property controls the neutral hover surface used by navigation and footer icon links.
Content links use a small horizontal lift with a soft shadow bloom instead of a hover surface.
The default display face is Fraunces, with Source Serif 4 and Georgia as fallbacks.
Override `--artisanal-display` in a site stylesheet if you prefer a quieter or more traditional serif.
Set `params.artisanal.headerMark` to the filename of a homepage page-bundle resource to change the header icon.
The default value is `mark.svg`, and animated formats such as GIF are supported by the image element.
Set `params.artisanal.titleSeparator` to the text symbol used between section titles and the site name.
The default separator is `·`; the home page title always stays as the site name alone.
Page navigation uses the CSS View Transition API for a slow opacity-only fade when the browser supports it.
Browsers without that API keep normal navigation with no layout movement.
Primary navigation pages are prefetched when a visitor points at or focuses a same-origin link, which reduces the wait before that transition starts.
Gallery cards load their lead image eagerly and defer later images until they approach the viewport.
The sticky header uses a lightly translucent white surface with a simple fade attached to its lower edge.

## Verification

Run `make strict` to build the example site with strict Hugo warnings and template metrics.
Set `HUGO_MIN_BIN` to a Hugo 0.158.0 binary to test the minimum supported version.
Run `npm run test:html` for generated HTML validation.
Run `npm run test:e2e` for desktop, mobile, keyboard, reduced-motion, no-JavaScript, accessibility, and network checks.
Run `npm test` to run the complete local gate.

For a strict maintainability review, run the thermo-nuclear code quality review skill after the local gate.
The no-mistakes pipeline requires a committed feature branch, a configured `origin`, and a completed `no-mistakes init` step.
When those prerequisites exist, validate without publishing by running `no-mistakes axi run --intent "Create and validate this Hugo theme and its example site." --skip=push,pr,ci`.

The repository does not configure a remote repository, pull request workflow, release automation, or GitHub Actions.
The repository does not include a generated changelog.

## License

The theme code is available under the MIT License.
The bundled fonts are available under the SIL Open Font License 1.1.
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for font attribution.
