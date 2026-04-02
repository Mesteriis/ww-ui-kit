import { expect, test } from '@playwright/test';

import {
  PERFORMANCE_ARTIFACTS,
  PERFORMANCE_REQUIREMENTS,
} from '../../../tools/governance/catalog/performance-requirements.mjs';
import {
  DEFAULT_FLOW_TIMEOUT_MS,
  createScenarioErrorResult,
  createScenarioResult,
  measureBudgetSamples,
  resetJsonArtifact,
  type RuntimeBudgetResult,
  writeJsonArtifact,
} from '../../shared/perf';

test.describe.configure({ mode: 'serial' });

test('measures governed playground runtime budgets', async ({ page }) => {
  const runtimeRequirements = PERFORMANCE_REQUIREMENTS.runtime;
  const measurementCount =
    runtimeRequirements.budgets.length *
    (runtimeRequirements.warmupRuns + runtimeRequirements.measuredRuns);
  test.setTimeout(measurementCount * DEFAULT_FLOW_TIMEOUT_MS + 60_000);
  const results: RuntimeBudgetResult[] = [];

  await resetJsonArtifact(PERFORMANCE_ARTIFACTS.runtimeSummaryFile);

  for (const budget of runtimeRequirements.budgets) {
    try {
      const samples = await measureBudgetSamples(page, budget, {
        warmupRuns: runtimeRequirements.warmupRuns,
        measuredRuns: runtimeRequirements.measuredRuns,
      });

      results.push(
        createScenarioResult(budget, {
          warmupRuns: runtimeRequirements.warmupRuns,
          measuredRuns: runtimeRequirements.measuredRuns,
          warmupSamples: samples.warmupSamples,
          measuredSamples: samples.measuredSamples,
          median: samples.median,
        })
      );
    } catch (error) {
      results.push(
        createScenarioErrorResult(budget, {
          warmupRuns: runtimeRequirements.warmupRuns,
          measuredRuns: runtimeRequirements.measuredRuns,
          error: error instanceof Error ? error : String(error),
        })
      );
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    browser: runtimeRequirements.browser,
    decisionStatistic: runtimeRequirements.decisionStatistic,
    warmupRuns: runtimeRequirements.warmupRuns,
    measuredRuns: runtimeRequirements.measuredRuns,
    allPassed: results.every((result) => result.pass),
    results,
  };

  await writeJsonArtifact(PERFORMANCE_ARTIFACTS.runtimeSummaryFile, summary);

  expect(
    results.filter((result) => !result.pass),
    JSON.stringify(results, null, 2)
  ).toEqual([]);
});
