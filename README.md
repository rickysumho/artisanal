# Artisanal

Artisanal is a Hugo theme for personal sites, portfolios, journals, and resumes.
It uses local fonts, simple layouts, accessible controls, and small motion details.
The default display face is Source Serif 4.
The default body face is DM Sans.

## Preview

### Homepage

![Artisanal homepage](docs/screenshots/homepage.jpg)

### Works archive

![Works archive with writeups, thoughts, and visuals sections](docs/screenshots/works.jpg)

### Tea page

![Tea page with a tea chat call to action](docs/screenshots/tea.jpg)

## Requirements

- Hugo 0.158.0 or newer.
- Node.js is needed only for the local test commands.
- Use Hugo Extended if your site adds Sass assets.

## Install

Create a Hugo site.

```sh
hugo new site my-site
mkdir -p my-site/themes
cp -R /path/to/artisanal my-site/themes/artisanal
cd my-site
```

Set the theme in `hugo.toml`.

```toml
theme = "artisanal"
```

Copy the content and settings from `exampleSite` when you want a complete starter site.
Replace the example text, links, images, and email address before you deploy.

Run the local server.

```sh
hugo server
```

## Features

- Homepage with a title, subtitle, portrait, and configurable header mark.
- Nested journal sections with list and gallery views.
- Back links that preserve the section where a visitor entered an article.
- Tea page with a short personal note and a direct email CTA for tea chats.
- Resume, taxonomy, RSS, 404, and standard page layouts.
- Local Source Serif 4 and DM Sans font files.
- Responsive images with eager loading for lead images and lazy loading for later images.
- Same-origin navigation prefetching on pointer and keyboard intent.
- Opacity-only page transitions when the browser supports View Transitions.
- Reduced-motion support, skip navigation, visible focus styles, and accessibility tests.

## Configure

Set theme options under `params.artisanal`.

```toml
[params.artisanal]
accent = "#5c9574"
accentText = "#245c40"
dateFormat = "Jan 2, 2006"
favicon = "favicon.ico"
headerMark = "mark.svg"
titleSeparator = "·"
```

`headerMark` points to a resource in the homepage page bundle.
Use an SVG, PNG, or animated GIF.
`favicon` points to a static file in your site's `static/` directory.
Use `menus.main` for the primary navigation.
Use `params.artisanal.social` for the icon links.
Interior pages render these links in the footer.
The homepage renders them below the main text.

## Content model

Use `type: journal` for an archive section.
Set `artisanal.view` to `list` or `gallery` on that section.
Create child sections for groups such as `writeups`, `thoughts`, and `visuals`.
Use `layout: resume` for structured resume content.
Add an optional `team` field to an entry when you want to show the team below its role.
Keep images in page bundles and provide useful alternative text.

Example journal section front matter:

```yaml
---
title: writeups
type: journal
artisanal:
  view: list
---
```

Example resume front matter:

```yaml
---
title: resume
layout: resume
artisanal:
  sections: []
---
```

## Project layout

- `assets/` contains CSS, local fonts, and navigation JavaScript.
- `layouts/` contains page templates and reusable partials.
- `archetypes/` contains starter front matter for pages and journal entries.
- `exampleSite/` contains a complete site that demonstrates the theme.
- `tests/` contains browser, HTML, and accessibility checks.
- `docs/screenshots/` contains the README preview images.

## Develop and validate

Install the development dependencies.

```sh
npm install
npx playwright install chromium webkit
```

Build the example site.

```sh
npm run build
```

Run the full validation suite.

```sh
npm test
```

`npm test` runs the strict Hugo build, HTML validation, Playwright tests, and Axe checks.
Run `make serve` to start the example site with Hugo's development server.
Override a theme template by placing a file at the same path in your site's `layouts` directory.

## License

Theme code is available under the MIT License.
Bundled fonts use the SIL Open Font License 1.1.
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for font attribution.
