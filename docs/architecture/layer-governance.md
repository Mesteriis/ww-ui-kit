# Layer Governance

This repository uses one canonical layer model:

`tokens -> themes -> primitives -> core -> systems -> widgets -> page-templates -> apps`

Machine-checked source of truth:

- package classification: [`tools/governance/catalog/package-classification.mjs`](../../tools/governance/catalog/package-classification.mjs)
- layer rules: [`tools/governance/catalog/layer-rules.mjs`](../../tools/governance/catalog/layer-rules.mjs)
- public surface manifest: [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)

## Allowed dependency directions

- `@ww/tokens` imports nothing from higher layers.
- `@ww/themes` may import `@ww/tokens`.
- `@ww/primitives` may import `@ww/tokens` and `@ww/themes`.
- `@ww/core` may import `@ww/tokens`, `@ww/themes`, and `@ww/primitives`.
- systems packages such as `@ww/data-grid` and `@ww/signal-graph` may import lower foundation layers and `@ww/core`.
- widgets may import lower layers and systems packages.
- page templates may import lower layers, systems packages, and widgets.
- apps may import all public packages through official package exports.

## Forbidden dependency directions

- `@ww/core` importing systems, widgets, page templates, or apps.
- widgets importing apps.
- page templates importing apps.
- apps importing package internals through `src/**`.
- vendor libraries leaking into `@ww/core`.

## Public vs internal

- Public package boundaries are defined by package export maps and the public surface manifest.
- Internal folders such as `src/internal/*` and non-exported helper files are not part of the supported contract.
- Apps and tooling are not treated as stable consumer-facing packages.

## Enforcement

CI enforces the layer model through:

- ESLint restricted import rules
- [`check:architecture`](../../package.json)
- [`check:public-imports`](../../package.json)
- [`check:topology`](../../package.json)
