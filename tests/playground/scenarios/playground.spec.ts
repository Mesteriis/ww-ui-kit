import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from '../../shared/a11y';
import { failOnConsoleErrors } from '../../shared/browser';

test.beforeEach(async ({ page }) => {
  await failOnConsoleErrors(page);
});

test('renders stable playground harness sections', async ({ page }) => {
  await page.goto('/playground/testing');

  for (const scenarioId of [
    'themes',
    'overlays',
    'charts',
    'signal-graph',
    'data-grid-basic',
    'data-grid-states',
    'data-grid-theming',
    'data-grid-selection',
    'data-grid-composition',
    'widgets',
    'widget-data-table-basic',
    'widget-data-table-states',
    'widget-data-table-theming',
    'widget-data-table-composition',
    'page-templates',
    'composition',
  ]) {
    await expect(page.locator(`[data-playground-scenario="${scenarioId}"]`).first()).toBeVisible();
  }
});

test('switches theme and exposes ThemeType', async ({ page }) => {
  await page.goto('/playground/testing');

  await page.locator('select').first().selectOption('dark');
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();

  await page.locator('select').first().selectOption('light');
  await page.locator('select').nth(1).selectOption('belovodye');
  await expect(page.getByText('ThemeName: belovodye', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ThemeType: light', { exact: true }).first()).toBeVisible();
});

test('opens dialog and restores focus to the opener', async ({ page }) => {
  await page.goto('/playground/testing');

  const openButton = page.getByRole('button', { name: 'Open dialog' });
  await openButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(openButton).toBeFocused();
});

test('renders charts and signal graph scenarios in the built consumer harness', async ({
  page,
}) => {
  await page.goto('/playground/testing');
  await expect(page.locator('#testing-charts .ui-apex-chart').first()).toBeVisible();
  await expect(page.locator('#testing-signal-graph .ui-signal-graph').first()).toBeVisible();
});

test('runs controlled data-grid flows in the built playground', async ({ page }) => {
  await page.goto('/playground/testing');

  const basicSection = page.locator('#testing-data-grid-basic');
  const basicGrid = basicSection.getByRole('figure', { name: 'Accounts grid' });
  await basicGrid.getByPlaceholder('Search accounts').fill('Northwind');
  await expect(basicSection.getByText('Rows: 1', { exact: true })).toBeVisible();
  await basicGrid.locator('tbody .ui-checkbox').first().click();
  await expect(basicSection.getByText('1 selected', { exact: false }).first()).toBeVisible();

  const selectionSection = page.locator('#testing-data-grid-selection');
  const selectionGrid = selectionSection.getByRole('figure', { name: 'Selection grid' });
  await selectionGrid.locator('tbody .ui-checkbox').first().click();
  await expect(selectionSection.getByText('Ids: row-001', { exact: false })).toBeVisible();

  const themingSection = page.locator('#testing-data-grid-theming');
  await expect(themingSection.getByText('ThemeName: belovodye', { exact: true })).toBeVisible();
  await expect(themingSection.getByText('ThemeType: light', { exact: true })).toBeVisible();

  const compositionSection = page.locator('#testing-data-grid-composition');
  await expect(
    compositionSection.getByText('Accounts table widget shell', { exact: true })
  ).toBeVisible();
});

test('runs data-table-widget flows in the built playground', async ({ page }) => {
  await page.goto('/playground/testing');

  const basicSection = page.locator('#testing-widgets-data-table-basic');
  const basicWidget = basicSection.getByRole('figure', { name: 'Accounts table widget' });
  await basicWidget.getByPlaceholder('Search accounts').fill('Northwind');
  await expect(basicSection.getByText('Rows: 1', { exact: true }).first()).toBeVisible();
  await basicWidget.locator('tbody .ui-checkbox').first().click();
  await expect(basicSection.getByRole('button', { name: /Clear 1/ })).toBeVisible();

  const themingSection = page.locator('#testing-widgets-data-table-theming');
  await expect(themingSection.getByText('ThemeName: belovodye', { exact: true })).toBeVisible();
  await expect(themingSection.getByText('ThemeType: light', { exact: true })).toBeVisible();

  const compositionSection = page.locator('#testing-widgets-data-table-composition');
  await expect(compositionSection.getByText('Operations workspace', { exact: true })).toBeVisible();
  await expect(compositionSection.getByText('Export later', { exact: true })).toBeVisible();
});

test('keeps key playground flows free of browser-level accessibility violations', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  await expectNoAxeViolations(page, { include: '#testing-data-grid-basic' });

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectNoAxeViolations(page, { include: '[role="dialog"]' });
});

test('loads the component lab, switches surfaces, and keeps usage metadata visible', async ({
  page,
}) => {
  await page.goto('/playground/lab/ui-button');

  await expect(page.locator('[data-playground-mode="lab"]')).toBeVisible();
  await expect(page.locator('[data-lab-nav-item="ui-button"]')).toHaveClass(/is-active/);
  await page.locator('[data-lab-control="label"] input').fill('Ship release');
  await expect(page.getByRole('button', { name: 'Ship release' })).toBeVisible();

  await page.getByRole('button', { name: 'Variant matrix' }).click();
  await expect(
    page.locator('[data-lab-preview-mode="matrix"] [data-lab-matrix-item]').first()
  ).toBeVisible();

  await page.getByRole('button', { name: 'Reset to defaults' }).click();
  await expect(page.getByRole('button', { name: 'Launch release' })).toBeVisible();
  await expect(page.getByText('Downstream usage', { exact: true })).toBeVisible();
  await expect(page.getByText('Storybook groups', { exact: true })).toBeVisible();

  await page.locator('[data-lab-nav-item="ui-input"]').click();
  await expect(page).toHaveURL(/\/playground\/lab\/ui-input$/);
  await expect(page.getByRole('heading', { name: 'UiInput' })).toBeVisible();
});

test('copies the current lab configuration and confirms clipboard feedback', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/playground/lab/ui-button');

  await page.locator('.lab-copy select').selectOption('vue');
  await page.locator('[data-lab-control="label"] input').fill('Deploy now');
  await page.locator('[data-lab-copy-button="true"]').click();

  await expect(page.locator('[data-lab-copy-feedback="true"]')).toContainText('Copied vue');

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('<UiButton');
  expect(clipboard).toContain('Deploy now');
});
