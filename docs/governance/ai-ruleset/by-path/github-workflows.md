---
id: ai-path-github-workflows
title: .github/workflows path rules
apply: by file patterns
patterns: .github/workflows/**/*
---
Use this rule when editing CI, release, Pages, or security workflows.

## Do

- Keep workflow behavior aligned with documented commands and governance gates.
- Treat workflow changes as architecture-sensitive when they alter how the repository operates.
- Keep Actions versions, Node policy, and invoked scripts aligned with the repo toolchain.

## Do not

- Do not change CI gates without updating docs and ADR coverage when needed.
- Do not make workflow behavior diverge from package scripts.
- Do not add hidden repository behavior in workflow-only changes.

## Update together with

- `README.md`
- `CONTRIBUTING.md`
- `docs/decisions/**/*` when workflow behavior is architecture-sensitive
