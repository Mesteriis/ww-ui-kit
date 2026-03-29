---
id: ai-model-architecture-sensitive-changes
title: Apply architecture-sensitive change discipline
apply: by model decision
instructions: use when changing layer rules, topology, governance tooling, workflows, testing architecture, docs-as-contract rules, or AI-rule behavior.
---

Use this rule when the task changes how the repository operates.

## Do

- Check `docs/architecture/*`, `docs/decisions/*`, and governance scripts before editing architecture-sensitive areas.
- Update an existing ADR or add a new one when the change alters operating rules.
- Keep README, CONTRIBUTING, and governance docs aligned with the actual scripts and CI gates.
- Prefer workspace-aware recursive orchestration over hand-maintained package chains when root build, typecheck, or dev workflows need dependency order.
- Keep playground lab manifests, usage-map generation, and maintainer workflow docs aligned when playground behavior becomes a governed contract.
- Keep the Node baseline explicit in `.node-version`, package metadata, CI, and contributor docs instead of widening support without validation.
- Update `TROUBLESHOOTING.md` when operational failures or debug workflow expectations materially change.
- Run the full governance check set after changing architecture-sensitive files.

## Do not

- Do not hide operational changes in incidental refactors.
- Do not leave docs describing commands or checks that no longer exist.
- Do not create a second source of truth beside the governed files.
- Do not change repository behavior without ADR coverage.
- Do not introduce new maintainer workflows without deciding how CI and docs enforce them.

## Related repo sources of truth

- `docs/architecture/`
- `docs/decisions/`
- `tools/governance/`
