# Stability Model

Every public surface must declare one of these states:

- `stable`
- `incubating`
- `experimental`
- `internal`

Canonical source of truth:

- [`tools/governance/catalog/stability-rules.mjs`](../../tools/governance/catalog/stability-rules.mjs)
- [`tools/governance/catalog/public-surface-manifest.mjs`](../../tools/governance/catalog/public-surface-manifest.mjs)

## Meanings

### stable

Supported and intentionally reusable. Contract changes require docs, tests, and honest Changesets.

### incubating

Reusable and public, but still actively settling. Use with care and expect contract tightening.

### experimental

Real and tested, but primarily intended for evaluation and proof flows.

### internal

Not part of the supported consumer contract.

## Current intent

- foundation packages are `stable`
- `@ww/data-grid` and vendor-backed packages are `incubating`
- newer system layers are `incubating` or `experimental`
- widgets and page templates are `incubating`
- docs, playground, and tooling are `internal`
