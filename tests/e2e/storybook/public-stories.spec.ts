import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

import { expectNoAxeViolations } from '../../shared/a11y';
import { failOnConsoleErrors } from '../../shared/browser';

async function getStoryId(request: APIRequestContext, title: string) {
  const response = await request.get('/index.json');
  const index = (await response.json()) as {
    entries: Record<string, { id: string; title: string; type?: string }>;
  };

  const entry =
    Object.values(index.entries).find(
      (candidate) => candidate.title === title && candidate.type === 'story'
    ) ?? Object.values(index.entries).find((candidate) => candidate.title === title);
  if (!entry) {
    throw new Error(`Storybook title "${title}" was not found in index.json.`);
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
    'Foundations/Theme System Overview',
    'Foundations/Charts/Apex Overview',
    'Foundations/Signal Graph/Overview',
    'Systems/Data Grid/Overview',
    'Widgets/Data Table Widget/Overview',
    'Widgets/Shell',
    'Page Templates/Shell',
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
  await expect(page.getByText('ThemeType: light', { exact: true }).first()).toBeVisible();
});

test('opens overlays inside Storybook stories', async ({ page, request }) => {
  const storyId = await getStoryId(request, 'Foundations/Overlay Layers');
  await openStory(page, storyId);
  await page.getByRole('button', { name: 'Open drawer' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Open nested dialog' }).click();
  await expect(page.getByRole('heading', { name: 'Nested dialog' })).toBeVisible();
});

test('keeps curated Storybook surfaces free of browser-level accessibility violations', async ({
  page,
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
    { title: 'Core/Tabs' },
    {
      title: 'Core/Overlay',
      setup: async (activePage) => {
        await activePage.getByRole('button', { name: 'Open dialog' }).click();
        await expect(activePage.getByRole('dialog')).toBeVisible();
      },
    },
    { title: 'Systems/Data Grid/Overview' },
  ];

  for (const story of cases) {
    const storyId = await getStoryId(request, story.title);
    await openStory(page, storyId, story.globals);
    if (story.setup) {
      await story.setup(page);
    }
    await expectNoAxeViolations(page, {
      include: '#storybook-root',
      disabledRules: ['landmark-one-main', 'page-has-heading-one', 'region'],
    });
  }
});

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
