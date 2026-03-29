---
id: ai-manual-package-topology-audit
title: Package topology audit and reshuffle
apply: manually
---

Use this rule only for deliberate repository topology audits.

## Do

- Audit physical paths, logical layer placement, export maps, and docs together.
- Move packages only when the boundary becomes clearer or more honest.
- Update workspace, imports, tests, docs, and ADRs in the same pass.

## Do not

- Do not reshuffle directories for cosmetic reasons only.
- Do not move feature-first systems into `packages/third-party` unless the public boundary is truly vendor-backed.
- Do not leave stale imports or topology docs after a move.

## Related repo sources of truth

- `tools/governance/catalog/package-classification.mjs`
- `docs/architecture/package-topology.md`
