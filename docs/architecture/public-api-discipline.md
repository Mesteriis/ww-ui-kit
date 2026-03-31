# Public API Discipline

Public API is defined by three things together:

1. package export maps in each `package.json`
2. [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
3. required docs, stories, playground scenarios, and tests for each public surface

Visual maintainer workbench coverage is governed separately by [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs).

## Public API rules

- Additions to public exports must update the public surface manifest.
- Named runtime exports from a public package root entrypoint must be covered by a manifest entry, either directly in `exportName` or through `coveredExports`.
- Public visual surfaces must declare Storybook coverage in the manifest; implicit visual exports are not allowed.
- Public visual surfaces with Storybook coverage must also declare any extra required Storybook invariants in the manifest.
- Additions or changes to public visual surfaces must also record lab eligibility in the playground lab manifest.
- Public exports must use official package entrypoints only.
- Deep imports such as `@ww/package/src/**` are forbidden.
- Internal helpers must stay internal unless intentionally promoted and documented.
- Stability status must be declared for every public surface.

## Coverage contract

Public surfaces may require:

- Storybook variants
- README or architecture docs
- playground scenarios
- unit, e2e, and/or playground tests

These requirements are checked automatically by:

- [`check:catalog`](../../package.json)
- [`check:stories`](../../package.json)
- [`check:docs`](../../package.json)
- [`check:playground-coverage`](../../package.json)
- [`check:playground-lab`](../../package.json)
