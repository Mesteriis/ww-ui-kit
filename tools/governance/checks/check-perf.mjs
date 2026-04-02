import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import {
  PERFORMANCE_ARTIFACTS,
  PERFORMANCE_REQUIREMENTS,
} from '../catalog/performance-requirements.mjs';
import { PLAYGROUND_SCENARIO_IDS } from '../catalog/playground-requirements.mjs';
import { ROOT_DIR, readText, resolveFromRoot } from '../shared/workspace.mjs';

const SUMMARY_VERSION = 1;
const PNPM_BIN = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const RUNTIME_SUMMARY_PATH = resolveFromRoot(PERFORMANCE_ARTIFACTS.runtimeSummaryFile);
const COMBINED_SUMMARY_PATH = resolveFromRoot(PERFORMANCE_ARTIFACTS.summaryFile);
const PLAYGROUND_CHUNK_NAMES = extractChunkNamesFromViteChunking();
const VALID_MEASUREMENT_KINDS = new Set([
  'route-visible',
  'selector-visible',
  'dialog-focus-flow',
  'input-flow',
  'checkbox-flow',
]);

function roundMetric(value) {
  return Number(value.toFixed(2));
}

function formatBytes(bytes) {
  return `${roundMetric(bytes / 1024)} KiB`;
}

function formatMilliseconds(milliseconds) {
  return `${roundMetric(milliseconds)} ms`;
}

function ensureDirectoryForFile(absolutePath) {
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
}

function writeJsonArtifact(absolutePath, value) {
  ensureDirectoryForFile(absolutePath);
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function extractChunkNamesFromViteChunking() {
  const chunkingSource = readText('vite.chunking.ts');
  return new Set(
    [...chunkingSource.matchAll(/return '([^']+)'/g)].map((match) => match[1]).filter(Boolean)
  );
}

function validateCatalog() {
  const buildBudgetNames = new Set();
  const runtimeScenarioIds = new Set();
  const governedScenarioIds = new Set(PLAYGROUND_SCENARIO_IDS);

  for (const budget of PERFORMANCE_REQUIREMENTS.build.budgets) {
    if (!PLAYGROUND_CHUNK_NAMES.has(budget.chunkName)) {
      throw new Error(
        `Build budget "${budget.chunkName}" is not declared by vite.chunking.ts manual chunk policy.`
      );
    }

    if (buildBudgetNames.has(budget.chunkName)) {
      throw new Error(`Build budget "${budget.chunkName}" is declared more than once.`);
    }

    if (!Number.isFinite(budget.maxBytes) || budget.maxBytes <= 0) {
      throw new Error(`Build budget "${budget.chunkName}" must declare a positive maxBytes.`);
    }

    if (typeof budget.rationale !== 'string' || budget.rationale.trim().length === 0) {
      throw new Error(`Build budget "${budget.chunkName}" must declare a rationale.`);
    }

    buildBudgetNames.add(budget.chunkName);
  }

  if (
    !Number.isInteger(PERFORMANCE_REQUIREMENTS.runtime.warmupRuns) ||
    PERFORMANCE_REQUIREMENTS.runtime.warmupRuns < 0
  ) {
    throw new Error('Runtime perf warmupRuns must be a non-negative integer.');
  }

  if (
    !Number.isInteger(PERFORMANCE_REQUIREMENTS.runtime.measuredRuns) ||
    PERFORMANCE_REQUIREMENTS.runtime.measuredRuns <= 0
  ) {
    throw new Error('Runtime perf measuredRuns must be a positive integer.');
  }

  if (PERFORMANCE_REQUIREMENTS.runtime.decisionStatistic !== 'median') {
    throw new Error('Runtime perf decisionStatistic must stay pinned to "median".');
  }

  for (const budget of PERFORMANCE_REQUIREMENTS.runtime.budgets) {
    if (runtimeScenarioIds.has(budget.id)) {
      throw new Error(`Runtime perf budget "${budget.id}" is declared more than once.`);
    }

    if (!governedScenarioIds.has(budget.playgroundScenarioId)) {
      throw new Error(
        `Runtime perf budget "${budget.id}" references unknown playground scenario "${budget.playgroundScenarioId}".`
      );
    }

    if (!Number.isFinite(budget.maxMilliseconds) || budget.maxMilliseconds <= 0) {
      throw new Error(
        `Runtime perf budget "${budget.id}" must declare a positive maxMilliseconds.`
      );
    }

    if (!VALID_MEASUREMENT_KINDS.has(budget.measurement.kind)) {
      throw new Error(
        `Runtime perf budget "${budget.id}" declares unsupported measurement kind "${budget.measurement.kind}".`
      );
    }

    runtimeScenarioIds.add(budget.id);
  }
}

function runRuntimeSuite() {
  if (fs.existsSync(RUNTIME_SUMMARY_PATH)) {
    fs.rmSync(RUNTIME_SUMMARY_PATH, { force: true });
  }

  const result = spawnSync(PNPM_BIN, ['test:perf'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  if (result.error) {
    return {
      exitCode: 1,
      error: result.error.message,
    };
  }

  return {
    exitCode: result.status ?? 1,
  };
}

function collectBuildBudgetSummary() {
  const outputDirectory = resolveFromRoot(PERFORMANCE_REQUIREMENTS.build.outputDirectory);
  const result = {
    outputDirectory: PERFORMANCE_REQUIREMENTS.build.outputDirectory,
    target: PERFORMANCE_REQUIREMENTS.build.target,
    allPassed: true,
    entries: [],
  };

  if (!fs.existsSync(outputDirectory)) {
    return {
      ...result,
      allPassed: false,
      error: `Build output directory "${PERFORMANCE_REQUIREMENTS.build.outputDirectory}" does not exist.`,
    };
  }

  const assetFiles = fs.readdirSync(outputDirectory).filter((fileName) => fileName.endsWith('.js'));
  const chunkNames = PERFORMANCE_REQUIREMENTS.build.budgets
    .map((budget) => budget.chunkName)
    .sort((left, right) => right.length - left.length);
  const chunkFilesByName = new Map(chunkNames.map((chunkName) => [chunkName, []]));

  for (const fileName of assetFiles) {
    const matchedChunkName = chunkNames.find((chunkName) => fileName.startsWith(`${chunkName}-`));
    if (!matchedChunkName) {
      continue;
    }

    chunkFilesByName.get(matchedChunkName).push(fileName);
  }

  for (const budget of PERFORMANCE_REQUIREMENTS.build.budgets) {
    const matchingFiles = chunkFilesByName.get(budget.chunkName) ?? [];
    if (matchingFiles.length !== 1) {
      result.allPassed = false;
      result.entries.push({
        chunkName: budget.chunkName,
        thresholdBytes: budget.maxBytes,
        thresholdKiB: roundMetric(budget.maxBytes / 1024),
        measuredBytes: null,
        deltaBytes: null,
        pass: false,
        error:
          matchingFiles.length === 0
            ? `Missing built chunk "${budget.chunkName}".`
            : `Expected one built chunk for "${budget.chunkName}" but found ${matchingFiles.length}.`,
      });
      continue;
    }

    const fileName = matchingFiles[0];
    const measuredBytes = fs.statSync(path.join(outputDirectory, fileName)).size;
    const deltaBytes = measuredBytes - budget.maxBytes;
    const pass = deltaBytes <= 0;
    if (!pass) {
      result.allPassed = false;
    }

    result.entries.push({
      chunkName: budget.chunkName,
      fileName,
      thresholdBytes: budget.maxBytes,
      thresholdKiB: roundMetric(budget.maxBytes / 1024),
      measuredBytes,
      measuredKiB: roundMetric(measuredBytes / 1024),
      deltaBytes,
      deltaKiB: roundMetric(deltaBytes / 1024),
      pass,
    });
  }

  return result;
}

function readRuntimeSummary() {
  if (!fs.existsSync(RUNTIME_SUMMARY_PATH)) {
    return {
      allPassed: false,
      error: `Runtime perf summary "${PERFORMANCE_ARTIFACTS.runtimeSummaryFile}" is missing.`,
      results: [],
    };
  }

  const runtimeSummary = JSON.parse(fs.readFileSync(RUNTIME_SUMMARY_PATH, 'utf8'));
  const expectedBudgets = new Map(
    PERFORMANCE_REQUIREMENTS.runtime.budgets.map((budget) => [budget.id, budget])
  );

  if (!Array.isArray(runtimeSummary.results)) {
    throw new Error(
      `Runtime perf summary "${PERFORMANCE_ARTIFACTS.runtimeSummaryFile}" does not contain a results array.`
    );
  }

  if (runtimeSummary.warmupRuns !== PERFORMANCE_REQUIREMENTS.runtime.warmupRuns) {
    throw new Error(
      `Runtime perf summary warmupRuns drift: expected ${PERFORMANCE_REQUIREMENTS.runtime.warmupRuns}, got ${runtimeSummary.warmupRuns}.`
    );
  }

  if (runtimeSummary.measuredRuns !== PERFORMANCE_REQUIREMENTS.runtime.measuredRuns) {
    throw new Error(
      `Runtime perf summary measuredRuns drift: expected ${PERFORMANCE_REQUIREMENTS.runtime.measuredRuns}, got ${runtimeSummary.measuredRuns}.`
    );
  }

  for (const budget of PERFORMANCE_REQUIREMENTS.runtime.budgets) {
    const entry = runtimeSummary.results.find((candidate) => candidate.scenarioId === budget.id);
    if (!entry) {
      throw new Error(`Runtime perf summary is missing scenario "${budget.id}".`);
    }

    if (entry.thresholdMilliseconds !== budget.maxMilliseconds) {
      throw new Error(
        `Runtime perf summary threshold drift for "${budget.id}": expected ${budget.maxMilliseconds}, got ${entry.thresholdMilliseconds}.`
      );
    }
  }

  for (const entry of runtimeSummary.results) {
    const budget = expectedBudgets.get(entry.scenarioId);
    if (!budget) {
      throw new Error(`Runtime perf summary contains unknown scenario "${entry.scenarioId}".`);
    }
  }

  return {
    ...runtimeSummary,
    allPassed:
      runtimeSummary.allPassed === true &&
      runtimeSummary.results.every((entry) => entry.pass === true),
  };
}

function printBuildReport(summary) {
  console.log('Performance build budgets:');

  if (summary.error) {
    console.log(`  FAIL ${summary.error}`);
    return;
  }

  for (const entry of summary.entries) {
    if (entry.pass) {
      console.log(
        `  PASS ${entry.chunkName} ${formatBytes(entry.measuredBytes)} / ${formatBytes(entry.thresholdBytes)}`
      );
      continue;
    }

    const suffix = entry.error
      ? entry.error
      : `${formatBytes(entry.measuredBytes)} / ${formatBytes(entry.thresholdBytes)}`;
    console.log(`  FAIL ${entry.chunkName} ${suffix}`);
  }
}

function printRuntimeReport(summary) {
  console.log('Performance runtime budgets:');

  if (summary.error) {
    console.log(`  FAIL ${summary.error}`);
    return;
  }

  for (const entry of summary.results) {
    if (entry.pass) {
      console.log(
        `  PASS ${entry.scenarioId} ${formatMilliseconds(entry.measuredMedianMilliseconds)} / ${formatMilliseconds(entry.thresholdMilliseconds)}`
      );
      continue;
    }

    const suffix = entry.error
      ? entry.error
      : `${formatMilliseconds(entry.measuredMedianMilliseconds)} / ${formatMilliseconds(entry.thresholdMilliseconds)}`;
    console.log(`  FAIL ${entry.scenarioId} ${suffix}`);
  }
}

function runPerfCheck({ reuseRuntimeSummary = false } = {}) {
  let runtimeSuite = { exitCode: 0, reused: Boolean(reuseRuntimeSummary) };
  let buildSummary = {
    outputDirectory: PERFORMANCE_REQUIREMENTS.build.outputDirectory,
    target: PERFORMANCE_REQUIREMENTS.build.target,
    allPassed: false,
    entries: [],
  };
  let runtimeSummary = {
    allPassed: false,
    results: [],
  };
  let catalogError;
  let failureReason = null;

  if (fs.existsSync(COMBINED_SUMMARY_PATH)) {
    fs.rmSync(COMBINED_SUMMARY_PATH, { force: true });
  }

  try {
    validateCatalog();
  } catch (error) {
    catalogError = error instanceof Error ? error.message : String(error);
    failureReason = failureReason ?? 'catalog';
  }

  if (!catalogError) {
    runtimeSuite = reuseRuntimeSummary ? runtimeSuite : runRuntimeSuite();
    if (runtimeSuite.exitCode !== 0) {
      failureReason = failureReason ?? 'runtime-suite';
    }

    try {
      buildSummary = collectBuildBudgetSummary();
      if (!buildSummary.allPassed) {
        failureReason = failureReason ?? 'build';
      }
    } catch (error) {
      buildSummary = {
        ...buildSummary,
        error: error instanceof Error ? error.message : String(error),
      };
      failureReason = failureReason ?? 'build';
    }

    try {
      runtimeSummary = readRuntimeSummary();
      if (runtimeSummary.allPassed !== true) {
        failureReason = failureReason ?? 'runtime';
      }
    } catch (error) {
      runtimeSummary = {
        ...runtimeSummary,
        error: error instanceof Error ? error.message : String(error),
      };
      failureReason = failureReason ?? 'runtime';
    }
  }

  const overallPassed =
    !catalogError &&
    runtimeSuite.exitCode === 0 &&
    buildSummary.allPassed &&
    runtimeSummary.allPassed === true &&
    !buildSummary.error &&
    !runtimeSummary.error;

  const combinedSummary = {
    generatedAt: new Date().toISOString(),
    version: SUMMARY_VERSION,
    status: overallPassed ? 'pass' : 'fail',
    catalogError,
    failureReason,
    runtimeSuite,
    build: buildSummary,
    runtime: runtimeSummary,
  };

  writeJsonArtifact(COMBINED_SUMMARY_PATH, combinedSummary);

  if (catalogError) {
    console.log(`Performance catalog validation failed: ${catalogError}`);
  } else {
    printBuildReport(buildSummary);
    printRuntimeReport(runtimeSummary);
  }

  console.log(`Performance summary written to ${PERFORMANCE_ARTIFACTS.summaryFile}`);

  if (!overallPassed) {
    throw new Error('Performance regression gate failed.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const reuseRuntimeSummary = process.argv.includes('--reuse-runtime-summary');
  runPerfCheck({ reuseRuntimeSummary });
}

export { runPerfCheck };
