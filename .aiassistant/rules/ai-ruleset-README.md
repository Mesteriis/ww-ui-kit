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
- Keep `AGENTS.md` and `.github/copilot-instructions.md` thin; they mirror the always baseline only.
- Run `pnpm build:ai-rules` after editing the rules pack.
- Run `pnpm check:ai-rules` before pushing.

## Repository alignment

This ruleset must stay aligned with:

- package classification
- public surface manifest
- Storybook/docs/playground contract checks
- ADR governance
- README and CONTRIBUTING guidance
