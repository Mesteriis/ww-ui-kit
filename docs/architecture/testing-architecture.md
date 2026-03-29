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

## Playground tests

Playground tests run against built playground output.

They prove real composition:

- theme switching
- ThemeType behavior
- subtree theming
- overlays and focus restore
- data-grid query and selection flows
- widgets and page-template composition
- charts and signal graph integration

Framework: Playwright.

## Coverage governance

Docs, stories, and playground scenarios are checked against the public surface manifest. Coverage is not based on prose promises.
