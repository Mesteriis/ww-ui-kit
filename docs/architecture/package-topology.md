# Package Topology

The repository has three physical package groups:

- `packages/*` for foundation, feature-first systems, widgets, page templates, and tooling
- `packages/third-party/*` for vendor-backed adapters whose public contract intentionally hides the vendor
- `apps/*` for docs and playground consumers

## Current topology

- `packages/tokens`
- `packages/themes`
- `packages/primitives`
- `packages/core`
- `packages/signal-graph`
- `packages/data-grid`
- `packages/widgets`
- `packages/page-templates`
- `packages/third-party/charts-apex`
- `packages/eslint-config`
- `packages/tsconfig`
- `apps/docs`
- `apps/playground`

## Third-party policy

Use `packages/third-party/*` only when the package is primarily a vendor-backed adapter.

Current decision:

- `@ww/charts-apex` lives in `packages/third-party/charts-apex`
  - public API is honest about ApexCharts
  - vendor dependency is real and adapter-shaped
- `@ww/signal-graph` stays outside `third-party`
  - public API is feature-first
  - Vue Flow is an internal engine, not the product-level contract

## Source of truth

- physical topology classification: [`tools/governance/catalog/package-classification.mjs`](../../tools/governance/catalog/package-classification.mjs)
- topology check: [`tools/governance/checks/check-package-topology.mjs`](../../tools/governance/checks/check-package-topology.mjs)
