import { expect, test } from '@playwright/test';

import { failOnConsoleErrors } from '../../shared/browser';

test.beforeEach(async ({ page }) => {
  await failOnConsoleErrors(page);
});

test('renders stable playground harness sections', async ({ page }) => {
  await page.goto('/');

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
    'page-templates',
    'composition'
  ]) {
    await expect(page.locator(`[data-playground-scenario="${scenarioId}"]`).first()).toBeVisible();
  }
});

test('switches theme and exposes ThemeType', async ({ page }) => {
  await page.goto('/');

  await page.locator('select').first().selectOption('dark');
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();

  await page.locator('select').first().selectOption('light');
  await page.locator('select').nth(1).selectOption('belovodye');
  await expect(page.getByText('ThemeName: belovodye', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ThemeType: light', { exact: true }).first()).toBeVisible();
});

test('opens dialog and restores focus to the opener', async ({ page }) => {
  await page.goto('/');

  const openButton = page.getByRole('button', { name: 'Open dialog' });
  await openButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(openButton).toBeFocused();
});

test('renders charts and signal graph scenarios in the built consumer harness', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#testing-charts .ui-apex-chart').first()).toBeVisible();
  await expect(page.locator('#testing-signal-graph .ui-signal-graph').first()).toBeVisible();
});

test('runs controlled data-grid flows in the built playground', async ({ page }) => {
  await page.goto('/');

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
  await expect(compositionSection.getByText('Accounts table widget shell', { exact: true })).toBeVisible();
});
