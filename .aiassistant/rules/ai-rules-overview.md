# AI Rules

Canonical human-readable overview for the repository AI rules pack.

Canonical source of truth: [`docs/governance/ai-ruleset/`](./ai-ruleset/README.md)

## Apply modes

- `always`  
  apply on every task in this repository
- `by model decision`  
  apply when the task type matches the rule instructions
- `by file patterns`  
  apply when touched files match the declared patterns
- `manually`  
  apply only when a maintainer or an explicit task calls for it

## Always baseline

<!-- AI_RULES_SYNC:START -->

- Preserve the canonical layer order and choose placement from governance sources before adding code.
- Treat export maps and the public surface manifest as the only supported public API.
- Keep palette, easing, z-index, ThemeName, ThemeType, motion, overlays, and subtree theming inside sanctioned contracts.
- Update stories, docs, playground proofs, tests, ADRs, and changesets when public or architectural behavior changes.
- Keep reusable packages free of route, backend, and product orchestration; keep vendor-backed adapters out of core.
- Treat ARIA, keyboard flow, focus handling, overlays, and reduced-motion behavior as structural contracts.
<!-- AI_RULES_SYNC:END -->

## Mirrors

- [`AGENTS.md`](../../AGENTS.md)
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)

Those files stay thin on purpose. They mirror the always baseline and point back to the canonical rules pack.

## Rule pack entrypoints

- [README](./ai-ruleset/README.md)
- [Index](./ai-ruleset/index.md)
- [Schema](./ai-ruleset/_schema.md)

## Pattern syntax

- `patterns` may be a single string or an array of strings.
- Supported glob tokens are `*`, `**`, and `?`.
- Unsupported syntax such as `{}`, `[]`, and `!` fails `pnpm check:ai-rules`.

## Commands

- `pnpm build:ai-rules` refreshes the overview, mirrors, and generated index
- `pnpm check:ai-rules` validates frontmatter, manifest coverage, generated files, and mirror sync
