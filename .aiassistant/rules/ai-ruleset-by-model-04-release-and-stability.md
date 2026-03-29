---
id: ai-model-release-and-stability
title: Apply stability status and changeset discipline
apply: by model decision
instructions: use when changing public package maturity, adding new public packages, or making changes that should alter release notes or changeset behavior.
---

Use this rule when release discipline or maturity labeling matters.

## Do

- Classify public surfaces as `stable`, `incubating`, `experimental`, or `internal`.
- Keep stability aligned between package classification and the public surface manifest.
- Add a changeset for publishable public behavior or export changes.
- Keep release notes honest about maturity and public impact.

## Do not

- Do not mark new or lightly proven surfaces as `stable` for optics.
- Do not hide public contract changes as internal-only.
- Do not add changesets for docs-only or tooling-only edits without package impact.
- Do not let stability language drift between docs and catalog files.

## Related repo sources of truth

- `tools/governance/catalog/stability-rules.mjs`
- `docs/architecture/stability-model.md`
- `.changeset/`
