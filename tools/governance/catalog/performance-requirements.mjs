const PERF_ARTIFACT_DIRECTORY = 'artifacts/perf';
const PLAYGROUND_DIST_ASSETS_DIRECTORY = 'apps/playground/dist/assets';
const PLAYGROUND_TEST_ROUTE = '/playground/testing';

export const PERFORMANCE_ARTIFACTS = Object.freeze({
  directory: PERF_ARTIFACT_DIRECTORY,
  runtimeSummaryFile: `${PERF_ARTIFACT_DIRECTORY}/runtime-summary.json`,
  summaryFile: `${PERF_ARTIFACT_DIRECTORY}/summary.json`,
});

export const PERFORMANCE_REQUIREMENTS = Object.freeze({
  build: Object.freeze({
    sourceFile: 'vite.chunking.ts',
    outputDirectory: PLAYGROUND_DIST_ASSETS_DIRECTORY,
    target: '@ww/playground build output',
    // Budgets use current minified chunk bytes with roughly 10-15% headroom, rounded to
    // KiB boundaries. That is enough to catch dependency drift without tripping on hash churn.
    budgets: Object.freeze([
      Object.freeze({
        chunkName: 'playground-testing',
        maxBytes: 40 * 1024,
        rationale: 'Stable browser-tested harness code should stay within a small dedicated chunk.',
      }),
      Object.freeze({
        chunkName: 'playground-testing-core-wave',
        maxBytes: 6 * 1024,
        rationale:
          'Deferred core-wave proofs stay budgeted separately so governed utility coverage does not hide inside the main testing harness chunk.',
      }),
      Object.freeze({
        chunkName: 'playground-showcases',
        maxBytes: 36 * 1024,
        rationale:
          'Shared showcase composition stays intentionally smaller than the dedicated testing harness.',
      }),
      Object.freeze({
        chunkName: 'playground-lab',
        maxBytes: 840 * 1024,
        rationale:
          'The maintainer workbench is intentionally large, but its chunk should still surface real growth.',
      }),
      Object.freeze({
        chunkName: 'vendor-vue',
        maxBytes: 90 * 1024,
        rationale:
          'Vue runtime drift should stay visible because it affects every playground route.',
      }),
      Object.freeze({
        chunkName: 'vendor-apexcharts',
        maxBytes: 576 * 1024,
        rationale:
          'ApexCharts is the heaviest optional adapter dependency and must keep a governed ceiling.',
      }),
      Object.freeze({
        chunkName: 'vendor-vue3-apexcharts',
        maxBytes: 576 * 1024,
        rationale:
          'The Vue bridge for ApexCharts is budgeted separately so wrapper drift does not hide inside vendor noise.',
      }),
      Object.freeze({
        chunkName: 'vendor-vue-flow',
        maxBytes: 240 * 1024,
        rationale:
          'Vue Flow powers the experimental signal graph surface and must stay bounded as that package evolves.',
      }),
    ]),
  }),
  runtime: Object.freeze({
    browser: 'chromium',
    decisionStatistic: 'median',
    warmupRuns: 1,
    measuredRuns: 5,
    summaryFile: PERFORMANCE_ARTIFACTS.runtimeSummaryFile,
    // Runtime budgets use the current built-playground median baseline across local macOS and the
    // GitHub Actions Ubuntu runner. Cold route mounts keep modest headroom over the slower CI
    // medians so the gate catches real regressions instead of runner variance, while fast
    // interaction flows stay in the 80-150ms band.
    budgets: Object.freeze([
      Object.freeze({
        id: 'boot-playground-testing',
        playgroundScenarioId: 'overlays',
        maxMilliseconds: 1400,
        description:
          'Boot the built /playground/testing route until the harness root and first governed proof section are visible.',
        measurement: Object.freeze({
          kind: 'route-visible',
          route: PLAYGROUND_TEST_ROUTE,
          targetSelector: '[data-playground-mode="testing"]',
          readySelector: '#testing-overlays',
        }),
      }),
      Object.freeze({
        id: 'overlay-dialog-reduced-motion',
        playgroundScenarioId: 'overlays',
        maxMilliseconds: 150,
        description:
          'Open and close the dialog under reduced motion and wait for focus to return to the opener.',
        measurement: Object.freeze({
          kind: 'dialog-focus-flow',
          route: PLAYGROUND_TEST_ROUTE,
          readySelector: '#testing-overlays',
          reducedMotion: 'reduce',
          dialogSelector: '[role="dialog"]',
          triggerButtonText: 'Open dialog',
          closeButtonText: 'Cancel',
        }),
      }),
      Object.freeze({
        id: 'charts-mount-visible',
        playgroundScenarioId: 'charts',
        maxMilliseconds: 1050,
        description: 'Mount the charts proof section until an Apex chart surface is visible.',
        measurement: Object.freeze({
          kind: 'selector-visible',
          route: PLAYGROUND_TEST_ROUTE,
          targetSelector: '#testing-charts .ui-apex-chart',
        }),
      }),
      Object.freeze({
        id: 'signal-graph-mount-visible',
        playgroundScenarioId: 'signal-graph',
        maxMilliseconds: 1250,
        description:
          'Mount the signal graph proof section until the graph runtime is visible in the built harness.',
        measurement: Object.freeze({
          kind: 'selector-visible',
          route: PLAYGROUND_TEST_ROUTE,
          targetSelector: '#testing-signal-graph .ui-signal-graph',
        }),
      }),
      Object.freeze({
        id: 'data-grid-basic-search',
        playgroundScenarioId: 'data-grid-basic',
        maxMilliseconds: 80,
        description:
          'Run the governed data-grid search flow until the filtered row count settles on the expected result.',
        measurement: Object.freeze({
          kind: 'input-flow',
          route: PLAYGROUND_TEST_ROUTE,
          scopeSelector: '#testing-data-grid-basic',
          inputSelector: 'input[placeholder="Search accounts"]',
          inputValue: 'Northwind',
          successText: 'Rows: 1',
        }),
      }),
      Object.freeze({
        id: 'data-grid-selection-toggle',
        playgroundScenarioId: 'data-grid-selection',
        maxMilliseconds: 100,
        description:
          'Toggle the governed selection grid flow until the selected row id summary becomes visible.',
        measurement: Object.freeze({
          kind: 'checkbox-flow',
          route: PLAYGROUND_TEST_ROUTE,
          scopeSelector: '#testing-data-grid-selection',
          checkboxSelector: 'tbody .ui-checkbox__input',
          successText: 'Ids: row-001',
        }),
      }),
      Object.freeze({
        id: 'widget-data-table-basic-search',
        playgroundScenarioId: 'widget-data-table-basic',
        maxMilliseconds: 80,
        description:
          'Run the data-table widget search flow until the widget row summary reports the governed filtered result.',
        measurement: Object.freeze({
          kind: 'input-flow',
          route: PLAYGROUND_TEST_ROUTE,
          scopeSelector: '#testing-widgets-data-table-basic',
          inputSelector: 'input[placeholder="Search accounts"]',
          inputValue: 'Northwind',
          successText: 'Rows: 1',
        }),
      }),
      Object.freeze({
        id: 'widget-data-table-basic-selection',
        playgroundScenarioId: 'widget-data-table-basic',
        maxMilliseconds: 100,
        description:
          'Toggle the data-table widget selection flow until the bulk-action clear affordance reflects one selected row.',
        measurement: Object.freeze({
          kind: 'checkbox-flow',
          route: PLAYGROUND_TEST_ROUTE,
          scopeSelector: '#testing-widgets-data-table-basic',
          checkboxSelector: 'tbody .ui-checkbox__input',
          successText: 'Clear 1',
        }),
      }),
    ]),
  }),
});
