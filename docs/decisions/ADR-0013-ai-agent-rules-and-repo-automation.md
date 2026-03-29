---
id: ADR-0013
title: AI Agent Rules And Repo Automation
status: superseded
date: 2026-03-29
owners:
  - platform
tags:
  - ai
  - automation
relatedPackages:
  - @ww/docs
  - @ww/playground
supersedes: []
supersededBy:
  - ADR-0016
---

# ADR-0013 AI Agent Rules And Repo Automation

## Context

Multiple AI-capable tools can act on the repository. Without one canonical ruleset, layer discipline and coverage expectations drift across AGENTS files, Copilot instructions, and workflow assumptions.

## Decision

Use one canonical AI rules source:

- canonical file: `docs/governance/ai-rules.md`
- synchronized mirrors: `AGENTS.md` and `.github/copilot-instructions.md`
- CI check: `check:ai-rules`

The ruleset focuses on operational requirements such as placement, public API discipline, coverage expectations, ADR expectations, and forbidden patterns.

## Consequences

- Bots and coding agents read the same project-specific rules.
- Drift between entrypoint files becomes a CI failure instead of silent divergence.
- Governance is enforceable even when changes come from automation.

## Alternatives

- Maintaining multiple independent AI rules files would drift quickly.
- Keeping no project-specific agent rules would push all decisions back onto reviewers.
- Treating README as the only source would make automation harder to validate.

## Migration / Rollout

- Move project-specific rules into the canonical governance doc.
- Mirror the same rules into AGENTS and Copilot instructions.
- Keep mirrors thin and synchronized instead of allowing manual divergence.

## Related artifacts

- [`docs/governance/ai-rules.md`](../governance/ai-rules.md)
- [`AGENTS.md`](../../AGENTS.md)
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md)
