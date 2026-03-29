---
id: ai-path-docs-decisions
title: docs/decisions path rules
apply: by file patterns
patterns: docs/decisions/**/*
---
Use this rule when editing ADRs or ADR metadata.

## Do

- Keep ADR frontmatter, status, and required sections aligned with the ADR schema.
- Keep `docs/decisions/index.md` synchronized.
- Use ADRs for architecture-sensitive changes and update supersedes links honestly.

## Do not

- Do not rewrite history to make the repository look cleaner than it was.
- Do not add architecture-sensitive changes without ADR coverage.
- Do not leave superseded ADRs marked as accepted.

## Update together with

- `docs/decisions/adr.schema.md`
- `tools/governance/checks/check-adr.mjs`
