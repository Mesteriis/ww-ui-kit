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
- Run the full governance check set after changing architecture-sensitive files.

## Do not

- Do not hide operational changes in incidental refactors.
- Do not leave docs describing commands or checks that no longer exist.
- Do not create a second source of truth beside the governed files.
- Do not change repository behavior without ADR coverage.

## Related repo sources of truth

- `docs/architecture/`
- `docs/decisions/`
- `tools/governance/`
