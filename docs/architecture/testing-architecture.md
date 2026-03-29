# Testing Architecture

The repository has exactly three primary test contours:

1. `test:unit`
2. `test:e2e`
3. `test:playground`

`pnpm test` runs all three in that order.

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

## Coverage governance

Docs, stories, and playground scenarios are checked against the public surface manifest. Visual maintainer workbench coverage is checked through the adjacent playground lab manifest.

Required governance checks:

- `check:stories`
- `check:docs`
- `check:playground-coverage`
- `check:playground-lab`

Formatting and operational checks remain part of the repository gate:

- `format:check`
- `lint`
- `typecheck`
