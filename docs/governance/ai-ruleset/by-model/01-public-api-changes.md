---
id: ai-model-public-api-changes
title: Apply public API and export-map change discipline
apply: by model decision
instructions: use when adding, removing, renaming, or changing public exports, style entrypoints, or package-level public behavior.
---
Use this rule when consumers would feel the change.

## Do

- Update package export maps and the public surface manifest together.
- Update package README examples, Storybook, docs, and tests for the affected surface.
- Add a changeset when the change affects a publishable package.
- Re-check stability classification when the public contract expands materially.

## Do not

- Do not add public exports as convenience leaks from internal files.
- Do not change public names or entrypoints without updating consumer-facing docs.
- Do not skip playground proof when the surface requires composition behavior.
- Do not leave manifest, stories, or docs stale.

## Related repo sources of truth

- `tools/governance/catalog/public-surface-manifest.mjs`
- `docs/architecture/public-api-discipline.md`
- package `README.md`
