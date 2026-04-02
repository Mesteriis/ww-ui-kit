# Testing Architecture

The repository has exactly three primary test contours:

1. `test:unit`
2. `test:e2e`
3. `test:playground`

`pnpm test` runs all three in that order.

Performance regression coverage is not a fourth contour. It is a separate governed gate:

- `pnpm test:perf` runs a Chromium-only runtime benchmark suite against built playground output.
- `pnpm check:perf` validates build chunk budgets, reads or launches the runtime suite, and writes a machine-readable perf summary artifact.
- perf budgets live only in `tools/governance/catalog/performance-requirements.mjs`.

## Unit tests

Unit tests cover:

- helpers, composables, adapters, merge logic
- component contracts in jsdom
- package smoke tests
- governance catalog meta tests
- component-lab session state, copy serializers, and schema-driven preview logic

Framework: Vitest.

## E2E tests

E2E tests run against built Storybook output.

They prove:

- public stories render
- theme switching works
- overlays work
- data-grid stories render and stay interactive
- charts and signal graph stories render
- widgets and page-template stories render
- browser console errors are treated as failures

Framework: Playwright.

Playwright policy:

- local runs use `retries=0`
- CI uses retries and `trace: on-first-retry`
- traces are captured for retry diagnostics instead of every passing run
- curated browser-level axe checks run on load-bearing flows

## Playground tests

Playground tests run against built playground output.

They prove real composition:

- `/testing/*` stays stable as the browser-tested harness
- `/lab/*` loads the maintainer workbench without replacing the harness
- component tab switching and inspector controls update preview state
- copy-config and downstream usage panels work in the built app
- theme switching
- ThemeType behavior
- subtree theming
- overlays and focus restore
- data-grid query and selection flows
- widgets and page-template composition
- charts and signal graph integration

Framework: Playwright.

Playground browser checks also include curated axe coverage for stable harness flows.

## Performance regression gate

The performance gate protects two signals:

- build chunk budgets from real `@ww/playground` production output
- runtime regression budgets from governed `/playground/testing` browser flows

The gate stays separate from `pnpm test` so the repo preserves its three primary contours while still enforcing performance regressions in CI and `pnpm verify`.
Runtime measurements use warm-up runs, measured runs, and median-based decisions to reduce noise.

## Coverage governance

Docs, stories, and playground scenarios are checked against the public surface manifest. `check:catalog` also verifies that named runtime exports from each public package root entrypoint are covered by that manifest. `check:stories` now fails when a public visual surface lacks an explicit Storybook contract or when declared Storybook invariants are not covered by the mapped stories. Visual maintainer workbench coverage is checked through the adjacent playground lab manifest.

Required governance checks:

- `check:stories`
- `check:docs`
- `check:playground-coverage`
- `check:playground-lab`
- `check:perf`

Formatting and operational checks remain part of the repository gate:

- `format:check`
- `lint`
- `typecheck`
