import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from '../../shared/a11y';
import { failOnConsoleErrors } from '../../shared/browser';

test.beforeEach(async ({ page }) => {
  await failOnConsoleErrors(page);
});

test('renders the playground root as the dashboard overview', async ({ page }) => {
  await page.goto('/playground/');

  const home = page.locator('[data-playground-mode="home"]');
  await expect(home).toBeVisible();
  await expect(home.locator('.ui-dashboard-layout')).toBeVisible();
  await expect(home.getByRole('heading', { level: 2, name: '/playground/' })).toBeVisible();
  await home.getByRole('button', { name: 'Open workspace menu' }).click();
  await expect(page.getByText('GitHub repository', { exact: true })).toBeVisible();
  await expect(home.getByRole('link', { name: 'Open testing harness' })).toBeVisible();
});

test('renders stable playground harness sections', async ({ page }) => {
  await page.goto('/playground/testing');

  await expect(page.locator('.ui-dashboard-layout').first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '/playground/testing' })).toBeVisible();

  for (const scenarioId of [
    'themes',
    'overlays',
    'core-wave',
    'core-advanced',
    'interaction-systems',
    'charts',
    'particles',
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

  await page.getByLabel('Playground theme', { exact: true }).selectOption('dark');
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();

  await page.getByLabel('Playground theme', { exact: true }).selectOption('light');
  await page.getByLabel('Playground theme', { exact: true }).selectOption('belovodye');
  await expect(page.getByText('ThemeName: belovodye', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('ThemeType: dark', { exact: true }).first()).toBeVisible();

  await page.getByLabel('Playground density').selectOption('comfortable');
  await page.getByLabel('Playground motion profile').selectOption('calm');
  await page.getByLabel('Playground personality').selectOption('accented');
  await expect(page.getByText('Density: comfortable', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Motion: calm', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Personality: accented', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Component styles', { exact: true }).first()).toBeVisible();
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

test('exercises floating overlays, dropdown keyboard flows, and toast stacking in the playground', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  const popoverTrigger = page.getByRole('button', { name: 'Open popover' });
  await popoverTrigger.click();
  await expect(page.locator('.ui-popover')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.ui-popover')).toHaveCount(0);
  await expect(popoverTrigger).toBeFocused();

  const dropdownTrigger = page.getByRole('button', { name: 'Open action menu' }).first();
  await dropdownTrigger.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('c');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Last menu action: Charlie', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Delete release' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete release?' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('Popconfirm outcome: confirmed', { exact: true })).toBeVisible();

  const contextTrigger = page.getByRole('button', { name: 'Right-click release tools' }).first();
  await contextTrigger.click({ button: 'right' });
  const contextMenu = page.locator('.ui-context-menu');
  const inspectItem = contextMenu.getByRole('menuitem', { name: 'Inspect release' });
  await expect(contextMenu).toBeVisible();
  await expect(inspectItem).toBeVisible();
  await inspectItem.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(contextMenu).toHaveCount(0);
  await expect(
    page.getByText('Context menu action: Archive release', { exact: true })
  ).toBeVisible();
  await expect(contextTrigger).toBeFocused();

  await page.getByRole('button', { name: 'Show toast stack' }).click();
  await expect(page.locator('.ui-toast')).toHaveCount(2);
  await page.getByRole('button', { name: 'Dismiss toast' }).first().click();
  await expect(page.locator('.ui-toast')).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss toast' }).first().click();
  await expect(page.locator('.ui-toast')).toHaveCount(0);
});

test('keeps the first core wave flow interactive in the playground harness', async ({ page }) => {
  await page.goto('/playground/testing');

  const coreWave = page.locator('#testing-core-wave');
  const designRadio = coreWave.getByRole('radio', { name: 'Design' });
  await designRadio.focus();
  await page.keyboard.press('ArrowRight');
  await expect(coreWave.getByText('Selected stage: review', { exact: true })).toBeVisible();

  const auditHeader = coreWave.getByRole('button', { name: 'Audit trail' });
  await auditHeader.focus();
  await page.keyboard.press('Enter');
  await expect(
    coreWave.getByText(
      'Checks, sign-offs, and rollback notes stay discoverable through region semantics.',
      { exact: true }
    )
  ).toBeVisible();

  await coreWave.getByRole('button', { name: 'Critical' }).click();
  await expect(coreWave.getByText('Active filter: Critical', { exact: true })).toBeVisible();

  await coreWave.getByRole('button', { name: 'Rollback' }).first().click();
  await expect(coreWave.getByText('Active action group: rollback', { exact: true })).toBeVisible();

  const budgetInput = coreWave.getByRole('textbox', { name: 'Budget' });
  await budgetInput.focus();
  await page.keyboard.press('ArrowUp');
  await expect(coreWave.getByText('Budget value: 13', { exact: true })).toBeVisible();

  await coreWave.getByRole('button', { name: 'Show password' }).click();
  await expect(coreWave.getByText('Password visible: yes', { exact: true })).toBeVisible();

  const tagInput = coreWave.locator('.ui-input-tag__input');
  await tagInput.fill('docs');
  await tagInput.press('Enter');
  await expect(
    coreWave.getByText('Tag input: tokens, themes, docs', { exact: true })
  ).toBeVisible();

  await coreWave.locator('.ui-input-otp__segment').first().fill('8');
  await expect(coreWave.getByText('OTP value: 8314', { exact: true })).toBeVisible();

  await coreWave.getByRole('radio', { name: '5 of 5', exact: true }).click();
  await expect(coreWave.getByText('Confidence rating: 5', { exact: true })).toBeVisible();

  const deployLane = coreWave.getByRole('combobox', { name: 'Deploy lane' });
  await deployLane.click();
  await deployLane.fill('br');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(coreWave.getByText('Selected lane: bravo', { exact: true })).toBeVisible();

  const commandSearch = coreWave.getByRole('combobox', { name: 'Command search' });
  await commandSearch.fill('bel');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(
    coreWave.getByText('Autocomplete selection: Belovodye control room', { exact: true })
  ).toBeVisible();

  const rolloutTarget = coreWave.getByRole('slider', { name: 'Rollout target' });
  await rolloutTarget.focus();
  await page.keyboard.press('End');
  await expect(coreWave.getByText('Rollout target: 100', { exact: true })).toBeVisible();

  const deployWindowStart = coreWave.getByRole('slider', { name: /Minimum value/ });
  await deployWindowStart.focus();
  await page.keyboard.press('ArrowRight');
  await expect(coreWave.getByText('Deploy window: 30-75', { exact: true })).toBeVisible();

  const firstMenuItem = coreWave.getByRole('menuitem', { name: 'Overview' }).first();
  await firstMenuItem.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(coreWave.getByText('Menu selection: ship', { exact: true })).toBeVisible();

  await coreWave.getByRole('button', { name: /Ship Green verify before merge/ }).click();
  await expect(coreWave.getByText('Current step: Ship', { exact: true })).toBeVisible();

  const releaseFlowPagination = coreWave.getByRole('navigation', {
    name: 'Release flow pages',
    exact: true,
  });
  await releaseFlowPagination.getByRole('button', { name: 'Next page' }).click();
  await expect(
    releaseFlowPagination.locator('.ui-pagination__page[aria-current="page"]')
  ).toContainText('3');
  await expect(coreWave.getByText('Current page: 3', { exact: true })).toBeVisible();
  await expect(coreWave.locator('[aria-current="page"]').first()).toContainText('Approve');

  await coreWave.getByRole('link', { name: 'Contracts' }).click();
  await expect(coreWave.getByText('Active anchor: contracts', { exact: true })).toBeVisible();

  const anchorScrollArea = coreWave.locator('#core-wave-anchor-scroll');
  await expect
    .poll(async () => anchorScrollArea.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(120);

  await expect(coreWave.getByText('Core wave contract proof', { exact: true })).toBeVisible();
  await expect(coreWave.getByText('Architecture snapshot', { exact: true })).toBeVisible();
  await expect(coreWave.getByText('Fallback proof', { exact: true })).toBeVisible();
  await expect(coreWave.getByText('Core wave metadata', { exact: true })).toBeVisible();
  await expect(coreWave.getByText('Core wave verify passed', { exact: true })).toBeVisible();
  await expect(coreWave.getByRole('table')).toBeVisible();
  await expect(coreWave.getByText('Layout utility coverage', { exact: true })).toBeVisible();
  await expect(coreWave.locator('.ui-space__separator')).toHaveCount(2);

  const surfaceList = coreWave.locator('.ui-list').last();
  await surfaceList.getByRole('button', { name: 'Next page' }).click();
  await expect(coreWave.getByText('List page: 2', { exact: true })).toBeVisible();

  const summary = coreWave.locator('[data-ui-grid-item-key="summary"]').first();
  const actions = coreWave.locator('[data-ui-grid-item-key="actions"]').first();
  const summaryBox = await summary.boundingBox();
  const actionsBox = await actions.boundingBox();

  expect(summaryBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();

  if (!summaryBox || !actionsBox) {
    throw new Error('Core wave layout grid boxes were not available in the playground.');
  }

  expect(summaryBox.width).toBeGreaterThan(actionsBox.width);

  const scrollArea = coreWave.locator('#core-wave-scroll-area');
  await scrollArea.evaluate((element) => {
    element.scrollTo({ top: 180, behavior: 'auto' });
    element.dispatchEvent(new Event('scroll'));
  });
  await expect(coreWave.getByText('Affix state: stuck', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Scroll core wave utility area to top' })
  ).toBeVisible();
});

test('keeps overlay close and focus restoration stable under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/playground/testing');

  const openButton = page.getByRole('button', { name: 'Open dialog' });
  await openButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(openButton).toBeFocused();
});

test('runs advanced core family flows in the playground harness', async ({ page }) => {
  await page.goto('/playground/testing');

  const advancedSection = page.locator('#testing-core-advanced');
  await expect(advancedSection.getByText('One governed watermark surface.', { exact: true })).toBeVisible();

  await advancedSection.getByRole('button', { name: 'Preview Preview proof' }).click();
  await expect(page.getByRole('dialog', { name: 'Image preview' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Image preview' })).toHaveCount(0);

  await advancedSection.getByRole('button', { name: 'Open alert dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Advanced core surfaces' })).toBeVisible();
  await page.getByRole('button', { name: 'Acknowledge' }).click();
  await expect(advancedSection.getByText('Core advanced state: acknowledged', { exact: true })).toBeVisible();

  await advancedSection.getByRole('button', { name: 'Imperative confirm' }).click();
  await expect(page.getByRole('dialog', { name: 'Ship advanced core surfaces?' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(advancedSection.getByText('Core advanced state: confirmed', { exact: true })).toBeVisible();
});

test('runs interaction system flows in the playground harness', async ({ page }) => {
  await page.goto('/playground/testing');

  const interactionSection = page.locator('#testing-interaction-systems');
  await expect(interactionSection.getByText('1. Virtual 1', { exact: true })).toBeVisible();

  await interactionSection.getByRole('textbox', { name: 'Title' }).fill('Interaction proof');
  await interactionSection.getByRole('textbox', { name: 'Owner' }).fill('Platform');
  await interactionSection.getByRole('button', { name: 'Submit form' }).click();
  await expect(interactionSection.getByText('Form state: submitted', { exact: true })).toBeVisible();

  await interactionSection.getByRole('button', { name: 'Start tour' }).click();
  await expect(page.getByRole('dialog', { name: 'Tour target A' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('dialog', { name: 'Tour target B' })).toBeVisible();
});

test('renders charts, particles, and signal graph scenarios in the built consumer harness', async ({
  page,
}) => {
  await page.goto('/playground/testing');
  await expect(page.locator('#testing-charts .ui-apex-chart').first()).toBeVisible();
  await expect(page.locator('#testing-particles .ui-tsparticles-backdrop').first()).toBeVisible();
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
  await expect(themingSection.getByText('ThemeType: dark', { exact: true })).toBeVisible();

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
  await expect(themingSection.getByText('ThemeType: dark', { exact: true })).toBeVisible();

  const compositionSection = page.locator('#testing-widgets-data-table-composition');
  await expect(compositionSection.getByText('Operations workspace', { exact: true })).toBeVisible();
  await expect(compositionSection.getByText('Export later', { exact: true })).toBeVisible();
});

test('renders the named dashboard layout and generic shell compositions in the built playground', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  const templatesSection = page.locator('#testing-page-templates');
  await expect(templatesSection.getByText('Operations cockpit', { exact: true })).toBeVisible();
  await expect(
    templatesSection.getByText('Marketing campaign shell', { exact: true })
  ).toBeVisible();
  await templatesSection.getByRole('button', { name: 'Dashboard workspace menu' }).click();
  await expect(page.getByText('GitHub repository', { exact: true })).toBeVisible();
  await expect(templatesSection.getByRole('button', { name: 'Launch campaign' })).toBeVisible();
  await expect(templatesSection.getByText('UiVerticalLayout', { exact: true })).toBeVisible();
  await expect(templatesSection.getByText('UiHorizontalLayout', { exact: true })).toBeVisible();

  const compositionSection = page.locator('#testing-composition');
  await expect(
    compositionSection.getByText('Widget shell showcase', { exact: true })
  ).toBeVisible();
});

test('keeps directional flow layouts shrink-wrapped by default and scrollable on demand in the built playground', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  const templatesSection = page.locator('#testing-page-templates');
  const verticalFrame = templatesSection.locator('[data-ui-proof="vertical-default-frame"]');
  const verticalLayout = verticalFrame.locator('.ui-vertical-layout');
  const horizontalFrame = templatesSection.locator('[data-ui-proof="horizontal-default-frame"]');
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
    throw new Error('Flow layout boxes were not available.');
  }

  expect(verticalLayoutBox.width).toBeLessThan(verticalFrameBox.width);
  expect(horizontalLayoutBox.width).toBeLessThan(horizontalFrameBox.width);

  const verticalScrollMetrics = await templatesSection
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

  const horizontalScrollMetrics = await templatesSection
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

test('keeps the dashboard layout at a 1:3 desktop split, preserves body scroll lock, and exposes internal scroll regions', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  const dashboardLayout = page.locator('#testing-page-templates .ui-dashboard-layout').first();
  const aside = dashboardLayout.locator('.ui-dashboard-layout__aside');
  const main = dashboardLayout.locator('.ui-dashboard-layout__main');

  const asideBox = await aside.boundingBox();
  const mainBox = await main.boundingBox();
  expect(asideBox).not.toBeNull();
  expect(mainBox).not.toBeNull();

  if (!asideBox || !mainBox) {
    throw new Error('Dashboard layout boxes were not available.');
  }

  const widthRatio = mainBox.width / asideBox.width;
  expect(widthRatio).toBeGreaterThan(2.7);
  expect(widthRatio).toBeLessThan(3.3);

  const dashboardScrollRegions = await dashboardLayout.evaluate((layout) => {
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
    throw new Error('Dashboard scroll regions were not available in the playground harness.');
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

  await page.setViewportSize({ width: 720, height: 1400 });
  await page.goto('/playground/testing');

  const stackedLayout = page.locator('#testing-page-templates .ui-dashboard-layout').first();
  const stackedAsideBox = await stackedLayout.locator('.ui-dashboard-layout__aside').boundingBox();
  const stackedMainBox = await stackedLayout.locator('.ui-dashboard-layout__main').boundingBox();
  expect(stackedAsideBox).not.toBeNull();
  expect(stackedMainBox).not.toBeNull();

  if (!stackedAsideBox || !stackedMainBox) {
    throw new Error('Dashboard layout boxes were not available after resize.');
  }

  expect(Math.abs(stackedAsideBox.x - stackedMainBox.x)).toBeLessThan(2);
  expect(stackedMainBox.y).toBeGreaterThan(stackedAsideBox.y + stackedAsideBox.height - 2);
});

test('keeps key playground flows free of browser-level accessibility violations', async ({
  page,
}) => {
  await page.goto('/playground/testing');

  await expectNoAxeViolations(page, { include: '#testing-core-wave' });
  await expectNoAxeViolations(page, { include: '#testing-data-grid-basic' });

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectNoAxeViolations(page, { include: '[role="dialog"]' });
});

test('loads the component lab, switches surfaces, and keeps usage metadata visible', async ({
  page,
}) => {
  await page.goto('/playground/lab/ui-button');

  await expect(page.locator('.ui-dashboard-layout').first()).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: '/playground/lab/ui-button' })
  ).toBeVisible();
  await expect(page.locator('section[data-playground-mode="lab"]')).toBeVisible();
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

  await page.locator('[data-lab-nav-item="ui-number-input"]').click();
  await expect(page).toHaveURL(/\/playground\/lab\/ui-number-input$/);
  await expect(page.getByRole('heading', { name: 'UiNumberInput' })).toBeVisible();

  await page.locator('[data-lab-nav-item="ui-slider"]').click();
  await expect(page).toHaveURL(/\/playground\/lab\/ui-slider$/);
  await expect(page.getByRole('heading', { name: 'UiSlider' })).toBeVisible();

  await page.locator('[data-lab-nav-item="ui-scroll-area"]').click();
  await expect(page).toHaveURL(/\/playground\/lab\/ui-scroll-area$/);
  await expect(page.getByRole('heading', { name: 'UiScrollArea' })).toBeVisible();
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
