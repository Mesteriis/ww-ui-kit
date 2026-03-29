# Public API Discipline

Public API is defined by three things together:

1. package export maps in each `package.json`
2. [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)
3. required docs, stories, playground scenarios, and tests for each public surface

## Public API rules

- Additions to public exports must update the public surface manifest.
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

