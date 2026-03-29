# AI Agent Governance

AI agents and bots must follow one canonical ruleset:

- [`docs/governance/ai-rules.md`](../governance/ai-rules.md)

Mirrors:

- [`AGENTS.md`](../../AGENTS.md)
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)

## Ruleset design

- one canonical source of truth
- mirrored thin entrypoints for tool-specific readers
- CI sync check to prevent drift

## Operational scope

AI rules cover:

- layer placement
- public API discipline
- story/docs/playground coverage expectations
- ADR expectations
- changeset expectations
- forbidden patterns such as deep imports and raw layer hacks

