---
id: ai-always-proof-sync
title: Synchronize stories, docs, playground proofs, tests, ADRs, and changesets with public changes
apply: always
summary: Update stories, docs, playground proofs, tests, ADRs, and changesets when public or architectural behavior changes.
---
Docs and verification are part of the repository contract.

## Do

- Add or update Storybook stories when touching any public UI surface listed in the manifest.
- Add or update docs when touching any public package or architecture rule covered by the manifest.
- Add or update playground scenarios when a public surface requires real composition proof.
- Add unit tests for helpers, adapters, runtime logic, and jsdom contracts.
- Add e2e tests for public docs or stories and playground tests for consumer-proof flows.
- Update or add an ADR when architecture-sensitive files or rules change.
- Add a changeset when public behavior, public exports, or publishable packages change.

## Do not

- Do not ship a public API change with stale stories, docs, or playground coverage.
- Do not skip the correct test contour because another contour happens to pass.
- Do not change architecture-sensitive areas without ADR coverage.
- Do not add publishable public behavior without honest release discipline.

## Related repo sources of truth

- `docs/architecture/docs-as-contract.md`
- `docs/architecture/testing-architecture.md`
- `tools/governance/catalog/public-surface-manifest.mjs`
