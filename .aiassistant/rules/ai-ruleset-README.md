# AI Ruleset

This directory is the canonical machine-oriented source of truth for repository AI rules.

Use it together with:

- [`../ai-rules.md`](../ai-rules.md) for the human overview
- [`./index.md`](./index.md) for the generated index
- [`./_schema.md`](./_schema.md) for the frontmatter contract

## Apply modes

- `always`
  use for rules that apply on every task in this repository
- `by model decision`
  use for rules that apply when the task type matches the stated instructions
- `by file patterns`
  use for rules that apply when touched files match the declared glob patterns
- `manually`
  use for maintainership or audit workflows that should not trigger on normal edits

## Authoring rules

- Keep rules short, imperative, and repository-specific.
- Put each rule in exactly one apply-mode directory.
- Keep `id`, `title`, and `apply` aligned with [`tools/governance/ai-rules/rule-manifest.mjs`](../../../tools/governance/ai-rules/rule-manifest.mjs).
- Use `instructions` only for `by model decision`.
- Use `patterns` only for `by file patterns`.
- Keep `patterns` as a string or array of strings using only `*`, `**`, and `?`.
- Do not use unsupported glob syntax such as `{}`, `[]`, or `!`; `pnpm check:ai-rules` rejects it.
- Keep `AGENTS.md` and `.github/copilot-instructions.md` thin; they mirror the always baseline only.
- Run `pnpm build:ai-rules` after editing the rules pack.
- Run `pnpm check:ai-rules` before pushing.

## Choosing an apply mode

- `always`
  use for repository-wide guardrails that must stay in front of every agent and maintainer
- `by model decision`
  use when the task type, not the touched path alone, determines whether the rule matters
- `by file patterns`
  use when touching a governed path should reliably pull in the rule
- `manually`
  use for maintainership, audits, or migration workflows that should not auto-apply on ordinary edits

## Authoring workflow

1. Choose the apply mode before writing the rule.
2. Add the rule file under the matching apply-mode directory.
3. Add the matching manifest entry in [`tools/governance/ai-rules/rule-manifest.mjs`](../../../tools/governance/ai-rules/rule-manifest.mjs).
4. Keep manifest metadata honest:
   `layerTags`, `areaTags`, and `packageTags` are validated against declared allow-lists;
   `relatedDocs` must point at real repo paths;
   `mirroredInSummary` controls inclusion in the always baseline mirrors.
5. Run `pnpm build:ai-rules` to refresh the generated overview, index, and thin mirrors.
6. Run `pnpm check:ai-rules` before pushing.

## Generated views and sync

- [`../ai-rules.md`](../ai-rules.md) is the human-readable overview.
- [`./index.md`](./index.md) is the generated machine index.
- [`../../../AGENTS.md`](../../../AGENTS.md) and [`../../../.github/copilot-instructions.md`](../../../.github/copilot-instructions.md) are thin generated mirrors.
- Do not hand-edit generated mirrors or generated index files. Edit the canonical rule files and manifest, then rebuild.

## Repository alignment

This ruleset must stay aligned with:

- package classification
- public surface manifest
- Storybook/docs/playground contract checks
- ADR governance
- README and CONTRIBUTING guidance
