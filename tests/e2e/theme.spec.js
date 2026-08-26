import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['./', 'works/', 'works/writeups/attention/', 'resume/', 'tea/', 'tags/', 'missing/'];

test.describe('theme pages', () => {
  for (const route of routes) {
    test(`${route} renders a usable document`, async ({ page }, testInfo) => {
      const response = await page.goto(route);
      expect(response).not.toBeNull();
      await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      const headingPosition = await page.locator('main h1').evaluate((element) => {
        const heading = element.getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return { headingTop: heading.top, headerBottom: header.bottom };
      });
      expect(headingPosition.headingTop).toBeGreaterThanOrEqual(headingPosition.headerBottom - 0.5);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
      const screenshotPath = testInfo.outputPath(`${route.replaceAll('/', '_') || 'home'}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
    });
  }
});

test('keyboard focus reaches the skip link and primary navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Mobile emulation does not expose desktop keyboard traversal consistently.');
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('nav[aria-label="Primary navigation"]')).toBeVisible();
  await expect(page.locator('a:focus-visible')).toHaveCount(1);
});

test('resume section labels align with their first dates', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The resume intentionally stacks into one column on mobile.');
  await page.goto('resume/');
  const offsets = await page.locator('.resume__section').evaluateAll((sections) => sections.map((section) => {
    const label = section.querySelector('.resume__section-title');
    const period = section.querySelector('.resume__entry-period');
    if (!label || !period) return null;
    return Math.abs(label.getBoundingClientRect().top - period.getBoundingClientRect().top);
  }).filter((offset) => offset !== null));
  expect(offsets.length).toBeGreaterThan(0);
  expect(offsets.every((offset) => offset < 0.5)).toBe(true);
});

test('resume introduction follows the shared content spacing rhythm', async ({ page }, testInfo) => {
  await page.goto('resume/');
  const gaps = await page.evaluate(() => {
    const title = document.querySelector('.resume__title').getBoundingClientRect();
    const intro = document.querySelector('.resume__content').getBoundingClientRect();
    const sections = document.querySelector('.resume__sections').getBoundingClientRect();
    return {
      titleToIntro: intro.top - title.bottom,
      introToSections: sections.top - intro.bottom,
    };
  });
  expect(gaps.titleToIntro).toBeGreaterThan(20);
  expect(gaps.titleToIntro).toBeLessThan(25);
  expect(gaps.introToSections).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile' ? 31 : 63);
});

test('homepage hero uses one deliberate top inset', async ({ page }) => {
  await page.goto('./');
  const spacing = await page.locator('.home').evaluate((element) => {
    const outerStyle = getComputedStyle(element);
    const heroStyle = getComputedStyle(element.querySelector('.home-hero'));
    return {
      outerTop: outerStyle.paddingTop,
      heroTop: heroStyle.paddingTop,
    };
  });
  expect(spacing.outerTop).toBe('0px');
  expect(Number.parseFloat(spacing.heroTop)).toBeGreaterThan(0);
});

test('font preload matches the compiled stylesheet asset', async ({ page }) => {
  await page.goto('./');
  const fontURLs = await page.evaluate(async () => {
    const preload = document.querySelector('link[rel="preload"][as="font"]');
    const stylesheet = document.querySelector('link[rel="stylesheet"]');
    if (!preload || !stylesheet) return null;
    const css = await fetch(stylesheet.href).then((response) => response.text());
    const match = css.match(/url\(([^)]*fraunces-600[^)]*\.woff2)\)/);
    if (!match) return null;
    return {
      preload: new URL(preload.href).pathname,
      stylesheet: new URL(match[1], stylesheet.href).pathname,
    };
  });
  expect(fontURLs).not.toBeNull();
  expect(fontURLs.preload).toBe(fontURLs.stylesheet);
});

test('gallery defers non-leading images', async ({ page }) => {
  await page.goto('works/visual/');
  const loadingModes = await page.locator('.gallery-card img').evaluateAll((images) => images.map((image) => image.loading));
  expect(loadingModes.length).toBeGreaterThan(1);
  expect(loadingModes[0]).toBe('eager');
  expect(loadingModes.slice(1).every((mode) => mode === 'lazy')).toBe(true);
});

test('navigation prefetch waits for link intent', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('link[rel="prefetch"]')).toHaveCount(0);
  await page.locator('.site-nav__link[href="/works/"]').focus();
  await expect(page.locator('link[rel="prefetch"][href$="/works/"]')).toHaveCount(1);
});

test('article back links preserve the entry section', async ({ page }) => {
  await page.goto('works/');
  await page.locator('a[href="/works/writeups/attention/"]').click();
  await expect(page).toHaveURL(/works\/writeups\/attention\/$/);
  await expect(page.locator('[data-back-link]')).toHaveAttribute('href', /\/works\/$/);
  await expect(page.locator('[data-back-label]')).toHaveText('Back to works');

  await page.goto('works/writeups/');
  await page.locator('a[href="/works/writeups/attention/"]').click();
  await expect(page).toHaveURL(/works\/writeups\/attention\/$/);
  await expect(page.locator('[data-back-link]')).toHaveAttribute('href', /\/works\/writeups\/$/);
  await expect(page.locator('[data-back-label]')).toHaveText('Back to writeups');
});

test('journal subsections link back to works', async ({ page }) => {
  for (const route of ['works/writeups/', 'works/thoughts/', 'works/visual/']) {
    await page.goto(route);
    await expect(page.locator('[data-section-back-link]')).toHaveAttribute('href', /\/works\/$/);
    await expect(page.locator('[data-section-back-link]')).toHaveText('← Back to works');
  }
});

test('primary page types share one content start position', async ({ page }) => {
  const routes = [
    ['works/', '.section-header'],
    ['works/visual/', '.section-header'],
    ['tags/', '.section-header'],
    ['resume/', '.resume__header'],
    ['tea/', '.page-header'],
  ];
  const positions = [];
  for (const [route, selector] of routes) {
    await page.goto(route);
    positions.push(await page.locator(selector).evaluate((element) => element.getBoundingClientRect().top));
  }
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(0.5);
});

test('the 404 page uses the shared page treatment', async ({ page }) => {
  await page.goto('missing/');
  const styles = await page.locator('.error-page').evaluate((element) => {
    const pageStyle = getComputedStyle(element);
    const linkStyle = getComputedStyle(element.querySelector('.error-page__link'));
    return {
      paddingTop: pageStyle.paddingTop,
      textAlign: pageStyle.textAlign,
      linkBorder: linkStyle.borderTopWidth,
    };
  });
  expect(styles.paddingTop).toBe('0px');
  expect(styles.textAlign).toBe('left');
  expect(styles.linkBorder).toBe('0px');
  await expect(page.locator('.error-page__link')).toHaveText(/Return home/);
});

test('page headers do not render automatic mini labels', async ({ page }) => {
  for (const route of ['works/', 'works/visual/', 'works/writeups/attention/', 'tags/', 'resume/', 'tea/', 'missing/']) {
    await page.goto(route);
    await expect(page.locator('.section-header__eyebrow, .article__eyebrow, .resume__eyebrow, .page-kicker')).toHaveCount(0);
  }
});

test('standard page headings use the shared heading scale', async ({ page }) => {
  const routes = [
    ['works/', '.section-header__title'],
    ['works/visual/', '.section-header__title'],
    ['tags/', '.section-header__title'],
    ['resume/', '.resume__title'],
    ['tea/', '.page-title'],
    ['works/writeups/attention/', '.article__title'],
    ['missing/', '.page-title'],
  ];
  const styles = [];
  for (const [route, selector] of routes) {
    await page.goto(route);
    styles.push(await page.locator(selector).evaluate((element) => {
      const style = getComputedStyle(element);
      return { fontSize: style.fontSize, lineHeight: style.lineHeight };
    }));
  }
  expect(new Set(styles.map(({ fontSize }) => fontSize)).size).toBe(1);
  expect(new Set(styles.map(({ lineHeight }) => lineHeight)).size).toBe(1);
});

test('tea heading and subtitle use the standard spacing', async ({ page }) => {
  await page.goto('tea/');
  const gap = await page.evaluate(() => {
    const title = document.querySelector('.page-title').getBoundingClientRect();
    const subtitle = document.querySelector('.page-subtitle').getBoundingClientRect();
    return subtitle.top - title.bottom;
  });
  expect(gap).toBeGreaterThan(20);
  expect(gap).toBeLessThan(25);
});

test('reduced motion disables animated transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('works/');
  const values = await page.locator('body').evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationDuration: style.animationDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
  });
  expect(['0s', '0.01ms', '1e-05s', '0.00001s']).toContain(values.animationDuration);
  expect(values.scrollBehavior).toBe('auto');
  const stylesheet = await page.locator('link[rel="stylesheet"]').evaluate(async (link) => fetch(link.href).then((response) => response.text()));
  expect(stylesheet.replace(/\s+/g, '')).toContain('::view-transition-old(page),::view-transition-new(page){animation:none!important}');
});

test('page navigation uses opacity-only view transitions', async ({ page }) => {
  await page.goto('./');
  const stylesheet = await page.locator('link[rel="stylesheet"]').evaluate(async (link) => fetch(link.href).then((response) => response.text()));
  expect(stylesheet).toContain('@view-transition');
  expect(stylesheet).toContain('artisanal-page-fade-in');
  expect(stylesheet).toContain('artisanal-page-fade-out');
  expect(stylesheet).not.toContain('translateY(0.35rem)');
  expect(stylesheet).not.toContain('.site-nav a::after');
});

test('the header uses the homepage mark as its visual brand', async ({ page }) => {
  await page.goto('works/');
  const brand = page.locator('.site-brand');
  await expect(brand).toHaveAttribute('aria-label', /.+/);
  const mark = brand.locator('.site-brand__mark');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveAttribute('alt', '');
});

test('document titles use the configured separator and keep home concise', async ({ page }) => {
  await page.goto('works/');
  await expect(page).toHaveTitle('works · field notes');
  await page.goto('./');
  await expect(page).toHaveTitle('field notes');
});

test('tea page provides a coffee chat mail link', async ({ page }) => {
  await page.goto('tea/');
  await expect(page.locator('h1')).toHaveText('tea');
  await expect(page.locator('.page-content a[href="mailto:hello@example.org"]')).toHaveText('set up a coffee chat');
});

test('content cards lift with a shadow bloom and the header uses a simple fade', async ({ page }) => {
  await page.goto('works/visual/');
  const card = page.locator('.gallery-card a').first();
  await expect(card).toBeVisible();
  await card.hover();
  await page.waitForTimeout(400);
  const cardStyle = await card.evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, boxShadow: style.boxShadow };
  });
  expect(cardStyle.transform).not.toBe('none');
  expect(cardStyle.boxShadow).not.toBe('none');

  const headerStyle = await page.locator('.site-header').evaluate((element) => {
    const style = getComputedStyle(element);
    const fadeStyle = getComputedStyle(element, '::after');
    return {
      backdropFilter: style.backdropFilter,
      headerHeight: style.height,
      fadeHeight: fadeStyle.height,
      fadeBackground: fadeStyle.backgroundImage,
      fadeBackdropFilter: fadeStyle.backdropFilter,
    };
  });
  expect(headerStyle.backdropFilter).toBe('none');
  expect(Number.parseFloat(headerStyle.headerHeight)).toBeGreaterThan(0);
  expect(Number.parseFloat(headerStyle.fadeHeight)).toBeGreaterThan(0);
  expect(headerStyle.fadeBackground).toContain('gradient');
  expect(headerStyle.fadeBackdropFilter).toBe('none');
});

test('essay rows stay flat and shift subtly on hover', async ({ page }) => {
  await page.goto('works/');
  const row = page.locator('.journal-item__link').first();
  await expect(row).toBeVisible();
  const resting = await row.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(resting).toBe('none');
  await row.hover();
  await page.waitForTimeout(400);
  const hovered = await row.evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, boxShadow: style.boxShadow };
  });
  expect(hovered.transform).not.toBe('none');
  expect(hovered.boxShadow).toBe('none');
});

test('footer uses accessible icon-only links', async ({ page }) => {
  await page.goto('./');
  const links = page.locator('.social-links__link');
  expect(await links.count()).toBeGreaterThan(0);
  expect(await links.locator('span').count()).toBe(0);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('aria-label', /.+/);
  }
});

test('the page remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('works/');
  await expect(page.locator('h1')).toHaveText('works');
  await context.close();
});

test('the rendered pages have no serious accessibility findings', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact))).toEqual([]);
  }
});

test('the build does not request remote styles or fonts', async ({ page }) => {
  await page.goto('./');
  const remoteResources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => name.startsWith('http') && !name.startsWith(location.origin)));
  expect(remoteResources).toEqual([]);
});
