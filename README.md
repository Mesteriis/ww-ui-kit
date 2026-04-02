# Belovodye UiKit Monorepo

[![CI](https://github.com/Mesteriis/ww-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Mesteriis/ww-ui-kit/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/Mesteriis/ww-ui-kit/actions/workflows/pages.yml/badge.svg)](https://github.com/Mesteriis/ww-ui-kit/actions/workflows/pages.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-0a7f3f)](https://github.com/Mesteriis/ww-ui-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-111827.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-Storybook-ff4785)](https://mesteriis.github.io/ww-ui-kit/docs/)
[![Playground](https://img.shields.io/badge/demo-Playground-2563eb)](https://mesteriis.github.io/ww-ui-kit/playground/)
[![Changelog](https://img.shields.io/badge/history-CHANGELOG-0f766e)](./CHANGELOG.md)

Production-grade Vue 3 + TypeScript UI platform monorepo for Belovodye UiKit.

This repository is not only a component library. It is a governed platform repo with:

- strict layer boundaries
- typed theme and motion systems
- overlay/layer runtime contracts
- optional systems packages
- widgets and page-template composition layers
- Storybook as public UI contract
- playground as stable harness plus maintainer workbench
- ADR, catalog, and AI-rule governance enforced by CI

## Links

- OSS site: `https://mesteriis.github.io/ww-ui-kit/`
- Storybook docs: `https://mesteriis.github.io/ww-ui-kit/docs/`
- Playground harness + lab: `https://mesteriis.github.io/ww-ui-kit/playground/`
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)
- ADRs: [`docs/decisions`](./docs/decisions)
- Architecture docs: [`docs/architecture`](./docs/architecture)
- Troubleshooting: [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
- AI rules pack: [`docs/governance/ai-ruleset/README.md`](./docs/governance/ai-ruleset/README.md)
- AI rules overview: [`docs/governance/ai-rules.md`](./docs/governance/ai-rules.md)

## Toolchain baseline

- Node.js `24.x`
- pnpm `10.32.1+`
- Vite `6`
- Vitest `3`
- Playwright for browser verification

CI validates Node `24.x` only. The repository does not claim support outside that tested baseline.
Root pnpm workflows fail fast when the active runtime does not match `.node-version`.

Root `build`, `typecheck`, `dev:docs`, and `dev:playground` commands are workspace-topology aware. Add dependencies to package manifests instead of extending hand-maintained root package chains.

## Architecture map

Canonical layer order:

`tokens -> themes -> primitives -> core -> systems -> widgets -> page-templates -> apps`

Package groups:

- `packages/*`
  foundation, feature-first systems, widgets, page templates, tooling
- `packages/third-party/*`
  vendor-backed adapters whose public API stays honest about the vendor
- `apps/*`
  docs and playground consumer apps

Current package topology:

- `@ww/tokens`
- `@ww/themes`
- `@ww/primitives`
- `@ww/core`
- `@ww/data-grid`
- `@ww/signal-graph`
- `@ww/widgets`
- `@ww/page-templates`
- `@ww/charts-apex` at [`packages/third-party/charts-apex`](./packages/third-party/charts-apex)
- `@ww/eslint-config`
- `@ww/tsconfig`
- `@ww/docs`
- `@ww/playground`

Canonical source of truth:

- package classification: [`tools/governance/catalog/package-classification.mjs`](./tools/governance/catalog/package-classification.mjs)
- layer rules: [`tools/governance/catalog/layer-rules.mjs`](./tools/governance/catalog/layer-rules.mjs)
- public surface manifest: [`tools/governance/catalog/public-surface-manifest.mjs`](./tools/governance/catalog/public-surface-manifest.mjs)
- playground lab manifest: [`tools/governance/catalog/playground-lab-manifest.mjs`](./tools/governance/catalog/playground-lab-manifest.mjs)
- performance budgets: [`tools/governance/catalog/performance-requirements.mjs`](./tools/governance/catalog/performance-requirements.mjs)

## Public vs internal

Public API is defined by:

1. package export maps
2. the public surface manifest
3. required docs, stories, playground coverage, and tests

Named runtime exports from each public package root entrypoint must be covered by the public surface manifest, either directly in `exportName` or through `coveredExports`.
Public visual surfaces must also declare Storybook coverage in that manifest.
Storybook-backed surfaces may also declare extra required invariants such as accessibility, keyboard flow, focus handling, overlay runtime, reduced motion, or theme-type proofs.
Performance-sensitive playground proofs are budgeted separately through the governed performance catalog and enforced by `pnpm check:perf`.

Public visual surfaces also carry lab eligibility in the adjacent playground lab manifest.

Internal-only surfaces are not part of the supported consumer contract even if they exist under `src/internal/*` or app code.

Deep imports such as `@ww/package/src/**` are forbidden.

## Stability model

Every public surface is classified as one of:

- `stable`
- `incubating`
- `experimental`
- `internal`

Current intent:

- `@ww/tokens`, `@ww/themes`, `@ww/primitives`, `@ww/core` -> `stable`
- `@ww/charts-apex`, `@ww/data-grid`, `@ww/widgets`, `@ww/page-templates` -> `incubating`
- `@ww/signal-graph` -> `experimental`
- docs, playground, and tooling packages -> `internal`

See [`docs/architecture/stability-model.md`](./docs/architecture/stability-model.md).

## Golden path for a new consumer app

Use one obvious bootstrapping path:

```ts
import '@ww/themes/theme-light.css';
import '@ww/core/styles.css';
import { patchThemeRuntime, setTheme } from '@ww/themes';

setTheme('light');
patchThemeRuntime({ density: 'default', motionProfile: 'balanced', personality: 'neutral' });
```

Then build up in this order:

1. `@ww/core` for baseline controls
2. optional systems only when needed
3. `@ww/widgets` for reusable black-box surfaces such as `DataTableWidget`
4. `@ww/page-templates` for reusable layout shells
5. product routing, backend orchestration, and domain state in apps

Scoped theming:

```html
<section data-ui-theme="belovodye" data-ui-theme-type="light">...</section>
```

Overlays inherit subtree themes through the existing theme-aware portal system. Do not manually invent overlay mounting rules in app code.

See [`docs/architecture/golden-path.md`](./docs/architecture/golden-path.md).

## Placement rules

Use this mental model:

- baseline reusable component -> `@ww/core`
- larger reusable subsystem -> systems package
- reusable black-box composition -> `@ww/widgets`
- reusable page or layout shell -> `@ww/page-templates`
- real route page or backend-aware flow -> `apps/*`

Examples:

- `LoginWindow` -> `@ww/widgets`
- `DataTableWidget` -> `@ww/widgets`
- `UiDataGrid` -> `@ww/data-grid`
- `AuthPageTemplate` -> `@ww/page-templates`
- `DashboardPageTemplate` -> `@ww/page-templates`
- actual admin route page -> `apps/*`

## Optional packages

### `@ww/charts-apex`

Vendor-backed chart adapter. Honest about ApexCharts and intentionally kept out of `@ww/core`.

```ts
import '@ww/charts-apex/styles.css';
import { UiApexChart } from '@ww/charts-apex';
```

### `@ww/signal-graph`

Feature-first interactive graph UI package. Vue Flow stays internal and does not leak into product code.

```ts
import '@ww/signal-graph/styles.css';
import { UiSignalGraph } from '@ww/signal-graph';
```

### `@ww/data-grid`

Controlled dense admin/business table system package. Query, rows, totals, and selection stay owned by the consumer.

```ts
import '@ww/data-grid/styles.css';
import { UiDataGrid } from '@ww/data-grid';
```

### `@ww/widgets`

Reusable black-box composition layer above core and systems. `DataTableWidget` is the canonical table widget above `@ww/data-grid`.

```ts
import '@ww/widgets/styles.css';
import { DataTableWidget } from '@ww/widgets';
```

## Themes

Available themes:

- `light` -> `ThemeType: light`
- `dark` -> `ThemeType: dark`
- `belovodye` -> `ThemeType: light`

Theme rules:

- `ThemeName` is the concrete theme
- `ThemeType` is derived metadata
- type is not a second free axis
- use `setTheme(themeName, target?)` instead of manually drifting attributes
- use `patchThemeRuntime({ themeName?, density?, motionProfile?, personality? }, target?)` for sanctioned runtime capability changes
- runtime attributes stay DOM-backed: `data-ui-theme`, `data-ui-density`, `data-ui-motion-profile`, `data-ui-personality`
- `color-scheme` is owned by the shared `data-ui-theme-type` CSS contract, not duplicated through inline runtime styles
- responsive theme overrides stay inside generated theme CSS, not a parallel runtime registry

## Testing architecture

There are exactly three primary test contours:

1. `pnpm test:unit`
2. `pnpm test:e2e`
3. `pnpm test:playground`

Root `pnpm test` runs all three.

Performance regression coverage is a separate governed gate:

- `pnpm test:perf` runs the Chromium-only runtime benchmark suite against built playground output and writes a machine-readable runtime summary.
- `pnpm check:perf` validates build chunk budgets, runs or reuses that runtime summary, and fails on actual budget breaches.
- Perf does not become a fourth primary contour; it remains a separate repo gate.

Playwright policy:

- local runs use `retries=0`
- CI uses retries and `trace: on-first-retry`
- browser-level axe checks run on curated Storybook and playground flows instead of every possible surface

Coverage and proof discipline is enforced by:

- `pnpm check:catalog`
- `pnpm check:stories`
- `pnpm check:docs`
- `pnpm check:playground-coverage`
- `pnpm check:playground-lab`
- `pnpm check:perf`
- `pnpm check:adr`
- `pnpm check:ai-rules`
- `pnpm check:architecture`

Storybook is the public UI contract.

Playground has two explicit roles:

- `/testing/*` is the real consumer-proof harness. It contains stable scenarios for real multi-package composition.
- `/lab/*` is the schema-driven maintainer workbench for lab-eligible visual surfaces.

Harness coverage stays focused on:

- themes
- overlays
- widgets
- page templates
- charts
- data-grid
- signal graph
- layered composition

Lab coverage stays focused on:

- one tab per lab-eligible visual surface
- sticky inspector controls
- single preview and curated matrix preview
- copyable config output
- downstream usage and dependency inspection

## Docs as contract

This repo treats docs as part of the engineering contract:

- package README files explain boundaries
- architecture docs explain placement and layer rules
- Storybook proves public UI states
- playground `/testing/*` proves real multi-package composition
- playground `/lab/*` gives maintainers a governed constructor for visual public surfaces
- ADRs capture architecture-sensitive decisions

See [`docs/architecture/docs-as-contract.md`](./docs/architecture/docs-as-contract.md).

## ADR process

ADRs live in [`docs/decisions`](./docs/decisions).

Use a new ADR or update an existing one when changing:

- layer rules
- public surface rules
- package topology
- testing architecture
- workflows or governance model
- AI rules model

`pnpm check:adr` validates:

- naming
- metadata
- required sections
- index consistency
- supersedes links
- architecture-sensitive change detection

## AI rules

Canonical machine-oriented AI rules live in [`docs/governance/ai-ruleset/README.md`](./docs/governance/ai-ruleset/README.md).

Human overview:

- [`docs/governance/ai-rules.md`](./docs/governance/ai-rules.md)

Thin mirrors:

- [`AGENTS.md`](./AGENTS.md)
- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)

Apply modes:

- `always`
- `by model decision`
- `by file patterns`
- `manually`

Path patterns may be a string or an array of strings. The matcher intentionally supports only `*`, `**`, and `?`; unsupported glob syntax such as `{}`, `[]`, and `!` fails `pnpm check:ai-rules`.

`pnpm build:ai-rules` refreshes the overview, mirrors, and generated rules index.
`pnpm check:ai-rules` fails if the rule pack, generated views, or mirrors drift.

## Changesets discipline

Add a changeset when:

- public exports change
- public behavior changes
- publishable package contracts change
- new public packages are introduced

Do not add a changeset for:

- docs-only changes
- internal-only tooling changes
- test-only changes without public impact

## Commands

```bash
pnpm install
pnpm dev:docs
pnpm dev:playground

pnpm format
pnpm format:check

pnpm check:catalog
pnpm check:stories
pnpm check:docs
pnpm check:playground-coverage
pnpm build:playground-lab
pnpm check:playground-lab
pnpm test:perf
pnpm check:perf
pnpm check:adr
pnpm build:ai-rules
pnpm check:ai-rules
pnpm check:architecture

pnpm test:unit
pnpm test:e2e
pnpm test:playground
pnpm test
pnpm test:coverage

pnpm lint
pnpm typecheck
pnpm build
pnpm build:pages
pnpm verify
```

## Release history

- repository-level milestones and toolchain shifts: [`CHANGELOG.md`](./CHANGELOG.md)
- package versioning and release PRs: Changesets
- GitHub release note grouping: [`.github/release.yml`](./.github/release.yml)

## OSS baseline

- [`LICENSE`](./LICENSE)
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- [`SECURITY.md`](./SECURITY.md)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
