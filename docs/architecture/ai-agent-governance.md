# AI Agent Governance

Canonical machine-oriented source:

- [`docs/governance/ai-ruleset/README.md`](../governance/ai-ruleset/README.md)

Human overview:

- [`docs/governance/ai-rules.md`](../governance/ai-rules.md)

Thin mirrors:

- [`AGENTS.md`](../../AGENTS.md)
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)

## Apply modes

- `always`
  baseline rules that apply on every repository task
- `by model decision`
  decision rules that apply when the task type demands them
- `by file patterns`
  path rules that apply when touched files match the declared patterns
- `manually`
  maintainer workflows for releases, migrations, and audits

## Operational model

- the canonical rule pack lives under `docs/governance/ai-ruleset/`
- `tools/governance/ai-rules/rule-manifest.mjs` is the machine-readable inventory
- `docs/governance/ai-rules.md`, `AGENTS.md`, and `.github/copilot-instructions.md` are synchronized thin views
- `pnpm build:ai-rules` refreshes generated views
- `pnpm check:ai-rules` validates frontmatter, manifest coverage, generated index, and mirror sync

## Repository-specific scope

AI rules cover:

- layer placement and package topology
- public API and export discipline
- Storybook, docs, playground, and test contour expectations
- ADR and architecture-sensitive change discipline
- release and changeset discipline
- forbidden patterns such as deep imports, raw visual hacks, and orchestration in the wrong layer
