---
id: ai-model-new-package-or-topology
title: Apply package creation and topology change discipline
apply: by model decision
instructions: use when adding, removing, moving, or reclassifying workspace packages or changing package folder topology.
---
Use this rule when the physical or logical package map changes.

## Do

- Classify the package in `tools/governance/catalog/package-classification.mjs`.
- Explain the boundary in package README, architecture docs, and ADR coverage.
- Update workspace scripts, aliases, typecheck, tests, and docs imports when paths change.
- Use `packages/third-party/*` only for honest vendor-backed adapters.

## Do not

- Do not move packages purely for aesthetics.
- Do not hide vendor-backed adapters inside `core`.
- Do not add a package without deciding its layer and stability.
- Do not leave old topology docs or imports behind.

## Related repo sources of truth

- `tools/governance/catalog/package-classification.mjs`
- `docs/architecture/package-topology.md`
- `docs/architecture/layer-governance.md`
