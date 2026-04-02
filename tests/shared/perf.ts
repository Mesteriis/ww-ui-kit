import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Page } from '@playwright/test';

type ReducedMotionMode = 'no-preference' | 'reduce';

interface RouteVisibleMeasurement {
  kind: 'route-visible';
  route: string;
  targetSelector: string;
  readySelector: string;
}

interface SelectorVisibleMeasurement {
  kind: 'selector-visible';
  route: string;
  targetSelector: string;
}

interface DialogFocusFlowMeasurement {
  kind: 'dialog-focus-flow';
  route: string;
  readySelector: string;
  reducedMotion?: ReducedMotionMode;
  dialogSelector: string;
  triggerButtonText: string;
  closeButtonText: string;
}

interface InputFlowMeasurement {
  kind: 'input-flow';
  route: string;
  scopeSelector: string;
  inputSelector: string;
  inputValue: string;
  successText: string;
}

interface CheckboxFlowMeasurement {
  kind: 'checkbox-flow';
  route: string;
  scopeSelector: string;
  checkboxSelector: string;
  successText: string;
}

type RuntimeMeasurement =
  | RouteVisibleMeasurement
  | SelectorVisibleMeasurement
  | DialogFocusFlowMeasurement
  | InputFlowMeasurement
  | CheckboxFlowMeasurement;

export interface RuntimeBudget {
  id: string;
  playgroundScenarioId: string;
  maxMilliseconds: number;
  description: string;
  measurement: RuntimeMeasurement;
}

export interface RuntimeBudgetResult {
  scenarioId: string;
  playgroundScenarioId: string;
  description: string;
  thresholdMilliseconds: number;
  warmupRuns: number;
  measuredRuns: number;
  warmupSamplesMilliseconds: number[];
  measuredSamplesMilliseconds: number[];
  measuredMedianMilliseconds: number | null;
  deltaMilliseconds: number | null;
  pass: boolean;
  error?: string;
}

const ROOT_DIR = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));
export const DEFAULT_FLOW_TIMEOUT_MS = 5_000;

function roundMetric(value: number) {
  return Number(value.toFixed(2));
}

function resolveFromRoot(relativePath: string) {
  return path.join(ROOT_DIR, relativePath);
}

async function prepareRoute(
  page: Page,
  route: string,
  options: { readySelector?: string; reducedMotion?: ReducedMotionMode } = {}
) {
  await page.emulateMedia({ reducedMotion: options.reducedMotion ?? 'no-preference' });
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  if (options.readySelector) {
    await page.locator(options.readySelector).waitFor({
      state: 'visible',
      timeout: DEFAULT_FLOW_TIMEOUT_MS,
    });
  }
}

async function readElapsedMilliseconds(page: Page) {
  return roundMetric(await page.evaluate(() => performance.now()));
}

async function measureRouteVisible(page: Page, measurement: RouteVisibleMeasurement) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(measurement.route, { waitUntil: 'domcontentloaded' });
  await page.locator(measurement.targetSelector).first().waitFor({
    state: 'visible',
    timeout: DEFAULT_FLOW_TIMEOUT_MS,
  });
  await page.locator(measurement.readySelector).first().waitFor({
    state: 'visible',
    timeout: DEFAULT_FLOW_TIMEOUT_MS,
  });
  return readElapsedMilliseconds(page);
}

async function measureSelectorVisible(page: Page, measurement: SelectorVisibleMeasurement) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(measurement.route, { waitUntil: 'domcontentloaded' });
  await page.locator(measurement.targetSelector).first().waitFor({
    state: 'visible',
    timeout: DEFAULT_FLOW_TIMEOUT_MS,
  });
  return readElapsedMilliseconds(page);
}

async function measureDialogFocusFlow(page: Page, measurement: DialogFocusFlowMeasurement) {
  await prepareRoute(page, measurement.route, {
    readySelector: measurement.readySelector,
    reducedMotion: measurement.reducedMotion ?? 'no-preference',
  });

  return page.evaluate(
    async ({ closeButtonText, dialogSelector, triggerButtonText, timeoutMilliseconds }) => {
      const normalizeText = (value: string | null | undefined) =>
        value?.replace(/\s+/g, ' ').trim().toLowerCase() ?? '';

      const findButtonByText = (scope: ParentNode, text: string) => {
        const expectedText = normalizeText(text);
        return [...scope.querySelectorAll('button')].find((candidate) => {
          return normalizeText(candidate.textContent) === expectedText;
        });
      };

      const waitForCondition = (predicate: () => boolean) =>
        new Promise<void>((resolve, reject) => {
          const deadline = performance.now() + timeoutMilliseconds;

          const tick = () => {
            if (predicate()) {
              resolve();
              return;
            }

            if (performance.now() > deadline) {
              reject(
                new Error(`Timed out waiting for dialog flow after ${timeoutMilliseconds}ms.`)
              );
              return;
            }

            requestAnimationFrame(tick);
          };

          tick();
        });

      const openButton = findButtonByText(document, triggerButtonText);
      if (!(openButton instanceof HTMLButtonElement)) {
        throw new Error(`Missing trigger button "${triggerButtonText}".`);
      }

      openButton.focus();
      const start = performance.now();
      openButton.click();
      await waitForCondition(() => Boolean(document.querySelector(dialogSelector)));

      const dialog = document.querySelector(dialogSelector);
      if (!dialog) {
        throw new Error(`Dialog "${dialogSelector}" did not open.`);
      }

      const closeButton = findButtonByText(dialog, closeButtonText);
      if (!(closeButton instanceof HTMLButtonElement)) {
        throw new Error(`Missing dialog close button "${closeButtonText}".`);
      }

      closeButton.click();
      await waitForCondition(
        () => !document.querySelector(dialogSelector) && document.activeElement === openButton
      );

      return Number((performance.now() - start).toFixed(2));
    },
    {
      closeButtonText: measurement.closeButtonText,
      dialogSelector: measurement.dialogSelector,
      timeoutMilliseconds: DEFAULT_FLOW_TIMEOUT_MS,
      triggerButtonText: measurement.triggerButtonText,
    }
  );
}

async function measureInputFlow(page: Page, measurement: InputFlowMeasurement) {
  await prepareRoute(page, measurement.route, {
    readySelector: measurement.scopeSelector,
    reducedMotion: 'no-preference',
  });

  return page.evaluate(
    async ({ inputSelector, inputValue, scopeSelector, successText, timeoutMilliseconds }) => {
      const scope = document.querySelector(scopeSelector);
      if (!(scope instanceof HTMLElement)) {
        throw new Error(`Missing scope "${scopeSelector}".`);
      }

      const input = scope.querySelector(inputSelector);
      if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Missing input "${inputSelector}" in "${scopeSelector}".`);
      }

      const waitForCondition = (predicate: () => boolean) =>
        new Promise<void>((resolve, reject) => {
          const deadline = performance.now() + timeoutMilliseconds;

          const tick = () => {
            if (predicate()) {
              resolve();
              return;
            }

            if (performance.now() > deadline) {
              reject(new Error(`Timed out waiting for input flow success text "${successText}".`));
              return;
            }

            requestAnimationFrame(tick);
          };

          tick();
        });

      const start = performance.now();
      input.focus();
      input.value = inputValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await waitForCondition(() => (scope.textContent ?? '').includes(successText));
      return Number((performance.now() - start).toFixed(2));
    },
    {
      inputSelector: measurement.inputSelector,
      inputValue: measurement.inputValue,
      scopeSelector: measurement.scopeSelector,
      successText: measurement.successText,
      timeoutMilliseconds: DEFAULT_FLOW_TIMEOUT_MS,
    }
  );
}

async function measureCheckboxFlow(page: Page, measurement: CheckboxFlowMeasurement) {
  await prepareRoute(page, measurement.route, {
    readySelector: measurement.scopeSelector,
    reducedMotion: 'no-preference',
  });

  return page.evaluate(
    async ({ checkboxSelector, scopeSelector, successText, timeoutMilliseconds }) => {
      const scope = document.querySelector(scopeSelector);
      if (!(scope instanceof HTMLElement)) {
        throw new Error(`Missing scope "${scopeSelector}".`);
      }

      const checkbox = scope.querySelector(checkboxSelector);
      if (!(checkbox instanceof HTMLInputElement)) {
        throw new Error(`Missing checkbox "${checkboxSelector}" in "${scopeSelector}".`);
      }

      const waitForCondition = (predicate: () => boolean) =>
        new Promise<void>((resolve, reject) => {
          const deadline = performance.now() + timeoutMilliseconds;

          const tick = () => {
            if (predicate()) {
              resolve();
              return;
            }

            if (performance.now() > deadline) {
              reject(
                new Error(`Timed out waiting for checkbox flow success text "${successText}".`)
              );
              return;
            }

            requestAnimationFrame(tick);
          };

          tick();
        });

      const start = performance.now();
      checkbox.click();
      await waitForCondition(() => (scope.textContent ?? '').includes(successText));
      return Number((performance.now() - start).toFixed(2));
    },
    {
      checkboxSelector: measurement.checkboxSelector,
      scopeSelector: measurement.scopeSelector,
      successText: measurement.successText,
      timeoutMilliseconds: DEFAULT_FLOW_TIMEOUT_MS,
    }
  );
}

export async function measureRuntimeBudget(page: Page, budget: RuntimeBudget) {
  switch (budget.measurement.kind) {
    case 'route-visible':
      return measureRouteVisible(page, budget.measurement);
    case 'selector-visible':
      return measureSelectorVisible(page, budget.measurement);
    case 'dialog-focus-flow':
      return measureDialogFocusFlow(page, budget.measurement);
    case 'input-flow':
      return measureInputFlow(page, budget.measurement);
    case 'checkbox-flow':
      return measureCheckboxFlow(page, budget.measurement);
    default:
      throw new Error(`Unsupported performance measurement kind: ${String(budget.measurement)}`);
  }
}

export function calculateMedian(values: readonly number[]) {
  if (values.length === 0) {
    throw new Error('Median requires at least one measured value.');
  }

  const sortedValues = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sortedValues.length / 2);
  if (sortedValues.length % 2 === 1) {
    return roundMetric(sortedValues[middleIndex] ?? 0);
  }

  return roundMetric(((sortedValues[middleIndex - 1] ?? 0) + (sortedValues[middleIndex] ?? 0)) / 2);
}

export async function measureBudgetSamples(
  page: Page,
  budget: RuntimeBudget,
  options: { warmupRuns: number; measuredRuns: number }
) {
  const warmupSamples: number[] = [];
  const measuredSamples: number[] = [];

  for (let index = 0; index < options.warmupRuns; index += 1) {
    warmupSamples.push(await measureRuntimeBudget(page, budget));
  }

  for (let index = 0; index < options.measuredRuns; index += 1) {
    measuredSamples.push(await measureRuntimeBudget(page, budget));
  }

  return {
    warmupSamples: warmupSamples.map(roundMetric),
    measuredSamples: measuredSamples.map(roundMetric),
    median: calculateMedian(measuredSamples),
  };
}

export async function resetJsonArtifact(relativePath: string) {
  await rm(resolveFromRoot(relativePath), { force: true });
}

export async function writeJsonArtifact(relativePath: string, value: unknown) {
  const outputPath = resolveFromRoot(relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function createScenarioErrorResult(
  budget: RuntimeBudget,
  options: { warmupRuns: number; measuredRuns: number; error: Error | string }
): RuntimeBudgetResult {
  return {
    scenarioId: budget.id,
    playgroundScenarioId: budget.playgroundScenarioId,
    description: budget.description,
    thresholdMilliseconds: budget.maxMilliseconds,
    warmupRuns: options.warmupRuns,
    measuredRuns: options.measuredRuns,
    warmupSamplesMilliseconds: [],
    measuredSamplesMilliseconds: [],
    measuredMedianMilliseconds: null,
    deltaMilliseconds: null,
    pass: false,
    error: options.error instanceof Error ? options.error.message : options.error,
  };
}

export function createScenarioResult(
  budget: RuntimeBudget,
  options: {
    warmupRuns: number;
    measuredRuns: number;
    warmupSamples: number[];
    measuredSamples: number[];
    median: number;
  }
): RuntimeBudgetResult {
  const deltaMilliseconds = roundMetric(options.median - budget.maxMilliseconds);

  return {
    scenarioId: budget.id,
    playgroundScenarioId: budget.playgroundScenarioId,
    description: budget.description,
    thresholdMilliseconds: budget.maxMilliseconds,
    warmupRuns: options.warmupRuns,
    measuredRuns: options.measuredRuns,
    warmupSamplesMilliseconds: options.warmupSamples,
    measuredSamplesMilliseconds: options.measuredSamples,
    measuredMedianMilliseconds: options.median,
    deltaMilliseconds,
    pass: options.median <= budget.maxMilliseconds,
  };
}
