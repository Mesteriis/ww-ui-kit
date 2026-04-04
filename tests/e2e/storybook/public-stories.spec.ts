import { expect, test, type APIRequestContext, type Browser, type Page } from '@playwright/test';

import { expectNoAxeViolations } from '../../shared/a11y';
import { failOnConsoleErrors } from '../../shared/browser';

async function getStoryId(request: APIRequestContext, title: string, storyName?: string) {
  const response = await request.get('/index.json');
  const index = (await response.json()) as {
    entries: Record<string, { id: string; name?: string; title: string; type?: string }>;
  };

  const entry =
    Object.values(index.entries).find(
      (candidate) =>
        candidate.title === title &&
        candidate.type === 'story' &&
        (storyName === undefined || candidate.name === storyName)
    ) ??
    (storyName === undefined
      ? Object.values(index.entries).find((candidate) => candidate.title === title)
      : undefined);
  if (!entry) {
    throw new Error(
      `Storybook title "${title}"${storyName ? ` story "${storyName}"` : ''} was not found in index.json.`
    );
  }

  return entry.id;
}

async function openStory(page: Page, storyId: string, globals?: string) {
  const query = globals
    ? `?id=${storyId}&viewMode=story&globals=${globals}`
    : `?id=${storyId}&viewMode=story`;
  await page.goto(`/iframe.html${query}`);
}

test.beforeEach(async ({ page }) => {
  await failOnConsoleErrors(page);
});

test('renders canonical public story groups', async ({ page, request }) => {
  const storyTitles = [
    'Core/System Showcase',
    'Core/Fields',
    'Core/Display',
    'Core/Layout',
    'Core/Navigation',
    'Foundations/Theme System Overview',
    'Foundations/Charts/Apex Overview',
    'Foundations/Particles/Overview',
    'Foundations/Signal Graph/Overview',
    'Systems/Data Grid/Overview',
    'Widgets/Data Table Widget/Overview',
    'Widgets/Shell',
    'Page Templates/Shell',
    'Page Templates/Dashboard Layout',
  ];

  for (const title of storyTitles) {
    const storyId = await getStoryId(request, title);
    await openStory(page, storyId);
    await expect(page.locator('#storybook-root')).toBeVisible();
  }
});

test('applies theme switching through Storybook globals', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Foundations/Theme System Overview');
  await openStory(page, storyId, 'theme:dark');
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();

  await openStory(page, storyId, 'theme:belovodye');
  await expect(page.getByText('ThemeName: belovodye', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();
});

test('opens overlays inside Storybook stories', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Foundations/Overlay Layers');
  await openStory(page, storyId);
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Open nested dialog' }).click();
  await expect(page.getByRole('heading', { name: 'Nested dialog' })).toBeVisible();
});

test('runs floating overlay and toast interactions inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Overlay');
  await openStory(page, storyId);

  const popoverTrigger = page.getByRole('button', { name: 'Open popover' });
  await popoverTrigger.click();
  await expect(page.locator('.ui-popover')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.ui-popover')).toHaveCount(0);
  await expect(popoverTrigger).toBeFocused();

  const dropdownTrigger = page.getByRole('button', { name: 'Open action menu' });
  await dropdownTrigger.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('c');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last dropdown action: Charlie', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Delete release' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete release?' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(
    page.getByText('Last popconfirm outcome: Confirmed release deletion', { exact: true })
  ).toBeVisible();

  const contextTrigger = page.getByRole('button', { name: 'Right-click release tools' });
  await contextTrigger.click({ button: 'right' });
  await expect(page.locator('.ui-context-menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Archive release' }).click();
  await expect(page.locator('.ui-context-menu')).toHaveCount(0);
  await expect(
    page.getByText('Last context action: Archive release', { exact: true })
  ).toBeVisible();
  await expect(contextTrigger).toBeFocused();

  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.locator('.ui-toast')).toContainText('Saved to the overlay proof queue');
});

test('runs button group interactions inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Buttons', 'Groups');
  await openStory(page, storyId);

  await page.getByRole('button', { name: 'Ship' }).first().click();
  await expect(page.getByText('Active group action: ship', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Rollback' }).first().click();
  await expect(page.getByText('Active group action: rollback', { exact: true })).toBeVisible();
});

test('runs selection and navigation interactions inside Storybook', async ({ page, request }) => {
  const selectionStoryId = await getStoryId(request, 'Core/Selection');
  await openStory(page, selectionStoryId);

  const designRadio = page.getByRole('radio', { name: 'Design' });
  await designRadio.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('Selected stage: review', { exact: true })).toBeVisible();

  const navigationStoryId = await getStoryId(request, 'Core/Navigation');
  await openStory(page, navigationStoryId);

  const firstMenuItem = page.getByRole('menuitem', { name: 'Overview' }).first();
  await firstMenuItem.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last menu action: ship', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Ship Green CI before merge/ }).click();
  await expect(page.getByText('Current step: Ship', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Next page' }).first().click();
  await expect(page.locator('.ui-pagination__page[aria-current="page"]')).toContainText('4');
  await expect(page.getByText('Current page: 4', { exact: true })).toBeVisible();
  await expect(page.locator('.ui-breadcrumb [aria-current="page"]')).toContainText('Review');
});

test('tracks section anchors inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Navigation', 'Section Anchor');
  await openStory(page, storyId);

  const contractsLink = page.getByRole('link', { name: 'Contracts' });
  await contractsLink.click();
  await expect(contractsLink).toHaveAttribute('aria-current', 'location');

  const scrollArea = page.locator('#navigation-anchor-scroll');
  await expect
    .poll(async () => scrollArea.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(120);

  const shipLink = page.getByRole('link', { name: 'Ship' });
  await shipLink.click();
  await expect(shipLink).toHaveAttribute('aria-current', 'location');
});

test('runs rich field interactions inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Fields');
  await openStory(page, storyId);

  const budgetInput = page.getByRole('textbox', { name: 'Budget' });
  await budgetInput.focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByText('Budget value: 13', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.getByText('Password visible: yes', { exact: true })).toBeVisible();

  const tagInput = page.locator('.ui-input-tag__input').first();
  await tagInput.fill('ops');
  await tagInput.press('Enter');
  await expect(page.getByText('Tag input: tokens, themes, ops', { exact: true })).toBeVisible();

  await page.locator('.ui-input-otp__segment').first().fill('8');
  await expect(page.getByText('OTP value: 8314', { exact: true })).toBeVisible();

  await page.getByRole('radio', { name: '5 of 5', exact: true }).click();
  await expect(page.getByText('Rating value: 5', { exact: true })).toBeVisible();

  const rolloutTarget = page.getByRole('slider', { name: 'Rollout target' });
  await rolloutTarget.focus();
  await page.keyboard.press('End');
  await expect(page.getByText('Rollout target: 100', { exact: true })).toBeVisible();

  const deployWindowStart = page.getByRole('slider', { name: /Minimum value/ });
  await deployWindowStart.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('Deploy window: 30-75', { exact: true })).toBeVisible();

  const deployLane = page.getByRole('combobox', { name: 'Deploy lane' });
  await deployLane.click();
  await deployLane.fill('br');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Rich select: bravo', { exact: true })).toBeVisible();

  const commandSearch = page.getByRole('combobox', { name: 'Suggestion search' });
  await commandSearch.fill('bel');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Autocomplete value: Belovodye control room', { exact: true })
  ).toBeVisible();
});

test('renders display data surfaces inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Display');
  await openStory(page, storyId);

  await expect(page.getByText('Current rollout: 64%', { exact: true })).toBeVisible();
  await expect(page.getByText('Architecture snapshot', { exact: true })).toBeVisible();
  await expect(page.getByText('Fallback proof', { exact: true })).toBeVisible();
  await expect(page.getByText('Core second-wave coverage', { exact: true })).toBeVisible();
  await expect(page.getByText('Metadata surface', { exact: true })).toBeVisible();
  await expect(page.getByText('Surface contract fixed', { exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();

  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('List page: 2', { exact: true })).toBeVisible();
  await expect(page.getByText('UiStatistic', { exact: true })).toBeVisible();
});

test('renders feedback result surfaces inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Feedback');
  await openStory(page, storyId);

  await expect(page.getByText('Core verify passed', { exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Feedback states remain explicit');
});

test('renders layout utility stories inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Layout');
  await openStory(page, storyId);

  await expect(page.getByText('Release delivery band', { exact: true })).toBeVisible();
  await expect(page.locator('.ui-space__separator')).toHaveCount(2);

  const summary = page.locator('[data-ui-grid-item-key="summary"]').first();
  const actions = page.locator('[data-ui-grid-item-key="actions"]').first();
  const summaryBox = await summary.boundingBox();
  const actionsBox = await actions.boundingBox();

  expect(summaryBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();

  if (!summaryBox || !actionsBox) {
    throw new Error('Layout grid boxes were not available inside Storybook.');
  }

  expect(summaryBox.width).toBeGreaterThan(actionsBox.width);
});

test('runs scroll utility interactions inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Core/Layout', 'Scroll Utilities');
  await openStory(page, storyId);

  const scrollArea = page.locator('#layout-proof-scroll-area');
  await scrollArea.evaluate((element) => {
    element.scrollTo({ top: 180, behavior: 'auto' });
    element.dispatchEvent(new Event('scroll'));
  });
  await expect(page.getByText('Affix state: stuck', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Scroll layout proof to top' })).toBeVisible();

  const horizontalMetrics = await page
    .locator('#layout-proof-horizontal-scroll-area')
    .evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
  expect(horizontalMetrics.scrollWidth).toBeGreaterThan(horizontalMetrics.clientWidth);
});

test('renders generic layout stories inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Page Templates/Shell');
  await openStory(page, storyId);

  await expect(page.getByText('Operations workspace shell', { exact: true })).toBeVisible();
  await expect(page.getByText('Marketing launch shell', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Launch campaign' })).toBeVisible();
  await expect(page.getByText('UiVerticalLayout', { exact: true })).toBeVisible();
  await expect(page.getByText('UiHorizontalLayout', { exact: true })).toBeVisible();

  const verticalFrame = page.locator('[data-ui-proof="vertical-default-frame"]');
  const verticalLayout = verticalFrame.locator('.ui-vertical-layout');
  const horizontalFrame = page.locator('[data-ui-proof="horizontal-default-frame"]');
  const horizontalLayout = horizontalFrame.locator('.ui-horizontal-layout');

  const verticalFrameBox = await verticalFrame.boundingBox();
  const verticalLayoutBox = await verticalLayout.boundingBox();
  const horizontalFrameBox = await horizontalFrame.boundingBox();
  const horizontalLayoutBox = await horizontalLayout.boundingBox();
  expect(verticalFrameBox).not.toBeNull();
  expect(verticalLayoutBox).not.toBeNull();
  expect(horizontalFrameBox).not.toBeNull();
  expect(horizontalLayoutBox).not.toBeNull();

  if (!verticalFrameBox || !verticalLayoutBox || !horizontalFrameBox || !horizontalLayoutBox) {
    throw new Error('Flow layout boxes were not available inside Storybook.');
  }

  expect(verticalLayoutBox.width).toBeLessThan(verticalFrameBox.width);
  expect(horizontalLayoutBox.width).toBeLessThan(horizontalFrameBox.width);

  const verticalScrollMetrics = await page
    .locator('[data-ui-proof="vertical-scroll-frame"] .ui-vertical-layout')
    .evaluate((element) => ({
      ariaLabel: element.getAttribute('aria-label'),
      clientHeight: element.clientHeight,
      role: element.getAttribute('role'),
      scrollHeight: element.scrollHeight,
      tabIndex: element.getAttribute('tabindex'),
    }));
  expect(verticalScrollMetrics.role).toBe('region');
  expect(verticalScrollMetrics.tabIndex).toBe('0');
  expect(verticalScrollMetrics.ariaLabel).toBe('Scrollable vertical layout');
  expect(verticalScrollMetrics.scrollHeight).toBeGreaterThan(verticalScrollMetrics.clientHeight);

  const horizontalScrollMetrics = await page
    .locator('[data-ui-proof="horizontal-scroll-frame"] .ui-horizontal-layout')
    .evaluate((element) => ({
      ariaLabel: element.getAttribute('aria-label'),
      clientWidth: element.clientWidth,
      role: element.getAttribute('role'),
      scrollWidth: element.scrollWidth,
      tabIndex: element.getAttribute('tabindex'),
    }));
  expect(horizontalScrollMetrics.role).toBe('region');
  expect(horizontalScrollMetrics.tabIndex).toBe('0');
  expect(horizontalScrollMetrics.ariaLabel).toBe('Scrollable horizontal layout');
  expect(horizontalScrollMetrics.scrollWidth).toBeGreaterThan(horizontalScrollMetrics.clientWidth);
});

test('renders the named dashboard layout story inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Page Templates/Dashboard Layout');
  await openStory(page, storyId);

  await expect(page.getByText('Operations cockpit', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Dashboard workspace menu' }).click();
  await expect(page.getByText('GitHub repository', { exact: true })).toBeVisible();
  await expect(page.getByText('Willow Works Analytics', { exact: true })).toBeVisible();

  const dashboardScrollRegions = await page
    .locator('.ui-dashboard-layout')
    .first()
    .evaluate((layout) => {
      const asideContent = layout.querySelector('.ui-dashboard-layout__aside-content');
      const content = layout.querySelector('.ui-dashboard-layout__content');

      return {
        bodyOverflow: window.getComputedStyle(document.body).overflow,
        asideContent:
          asideContent instanceof HTMLElement
            ? {
                ariaLabel: asideContent.getAttribute('aria-label'),
                clientHeight: asideContent.clientHeight,
                overflowY: window.getComputedStyle(asideContent).overflowY,
                role: asideContent.getAttribute('role'),
                scrollHeight: asideContent.scrollHeight,
                tabIndex: asideContent.getAttribute('tabindex'),
              }
            : null,
        content:
          content instanceof HTMLElement
            ? {
                ariaLabel: content.getAttribute('aria-label'),
                clientHeight: content.clientHeight,
                overflowY: window.getComputedStyle(content).overflowY,
                role: content.getAttribute('role'),
                scrollHeight: content.scrollHeight,
                tabIndex: content.getAttribute('tabindex'),
              }
            : null,
      };
    });

  expect(dashboardScrollRegions.bodyOverflow).toBe('hidden');
  expect(dashboardScrollRegions.asideContent).not.toBeNull();
  expect(dashboardScrollRegions.content).not.toBeNull();

  if (!dashboardScrollRegions.asideContent || !dashboardScrollRegions.content) {
    throw new Error('Dashboard scroll regions were not available inside Storybook.');
  }

  expect(dashboardScrollRegions.asideContent.role).toBe('region');
  expect(dashboardScrollRegions.asideContent.tabIndex).toBe('0');
  expect(dashboardScrollRegions.asideContent.ariaLabel).toBe('Dashboard sidebar content');
  expect(dashboardScrollRegions.asideContent.overflowY).toBe('auto');
  expect(dashboardScrollRegions.asideContent.scrollHeight).toBeGreaterThan(
    dashboardScrollRegions.asideContent.clientHeight
  );

  expect(dashboardScrollRegions.content.role).toBe('region');
  expect(dashboardScrollRegions.content.tabIndex).toBe('0');
  expect(dashboardScrollRegions.content.ariaLabel).toBe('Dashboard main content');
  expect(dashboardScrollRegions.content.overflowY).toBe('auto');
  expect(dashboardScrollRegions.content.scrollHeight).toBeGreaterThan(
    dashboardScrollRegions.content.clientHeight
  );
});

test('keeps the dashboard theming story on the canonical Belovodye theme contract', async ({
  page,
  request,
}) => {
  const storyId = await getStoryId(request, 'Page Templates/Dashboard Layout', 'Theming');
  await openStory(page, storyId);

  const themedContainer = page.locator('[data-ui-theme="belovodye"]').first();
  await expect(themedContainer).toHaveAttribute('data-ui-theme-type', 'dark');
});

test('renders the tsParticles backdrop story group inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Foundations/Particles/Overview');
  await openStory(page, storyId);

  await expect(page.locator('.ui-tsparticles-backdrop').first()).toBeVisible();
  await expect(page.getByText('Decorative token-driven backdrop', { exact: true })).toBeVisible();
});

test('keeps curated Storybook surfaces free of browser-level accessibility violations', async ({
  browser,
  request,
}) => {
  const cases: Array<{
    title: string;
    globals?: string;
    setup?: (page: Page) => Promise<void>;
  }> = [
    { title: 'Core/Buttons' },
    { title: 'Core/Buttons', globals: 'theme:belovodye' },
    { title: 'Core/Fields' },
    { title: 'Core/Display' },
    { title: 'Core/Selection' },
    { title: 'Core/Feedback' },
    { title: 'Core/Navigation' },
    { title: 'Core/Tabs' },
    { title: 'Foundations/Particles/Overview' },
    {
      title: 'Core/Overlay',
      setup: async (activePage) => {
        await activePage.getByRole('button', { name: 'Open dialog' }).click();
        await expect(activePage.getByRole('dialog')).toBeVisible();
      },
    },
    { title: 'Systems/Data Grid/Overview' },
    { title: 'Page Templates/Shell' },
    { title: 'Page Templates/Dashboard Layout' },
  ];

  for (const story of cases) {
    const { context: storyContext, page: storyPage } = await openA11yStoryPage(browser);
    const storyId = await getStoryId(request, story.title);
    await openStory(storyPage, storyId, story.globals);
    if (story.setup) {
      await story.setup(storyPage);
    }
    await expectNoAxeViolations(storyPage, {
      include: '#storybook-root',
      disabledRules: ['landmark-one-main', 'page-has-heading-one', 'region'],
    });
    await storyContext.close();
  }
});

async function openA11yStoryPage(browser: Browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await failOnConsoleErrors(page);
  return { context, page };
}

test('runs canonical data-grid interactions inside Storybook', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Systems/Data Grid/Overview');
  await openStory(page, storyId);

  await expect(page.locator('.ui-data-grid-table')).toBeVisible();
  await page.getByRole('searchbox').fill('Northwind');
  await page.locator('.ui-data-grid-table__sort').first().click();
  await page.locator('.ui-data-grid-table tbody .ui-checkbox').first().click();
  await expect(page.getByText('1 selected', { exact: false }).first()).toBeVisible();
  await page.getByRole('button', { name: /Clear 1/ }).click();
  await page.locator('summary').click();
  await page.getByRole('button', { name: 'Reset columns' }).click();
});

test('runs canonical data-table-widget interactions inside Storybook', async ({
  page,
  request,
}) => {
  const storyId = await getStoryId(request, 'Widgets/Data Table Widget/Overview');
  await openStory(page, storyId);

  await expect(page.locator('.data-table-widget .ui-data-grid-table')).toBeVisible();
  await page.getByRole('searchbox').fill('Northwind');
  await expect(page.getByText('Rows: 1', { exact: true }).first()).toBeVisible();
  await page.locator('.data-table-widget tbody .ui-checkbox').first().click();
  await expect(page.getByRole('button', { name: /Clear 1/ })).toBeVisible();
  await expect(page.getByText('Refresh widget', { exact: true })).toBeVisible();
});
