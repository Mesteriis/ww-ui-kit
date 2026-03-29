---
id: ai-path-docs-architecture
title: docs/architecture path rules
apply: by file patterns
patterns: docs/architecture/**/*
---
Use this rule when editing architecture and governance docs.

## Do

- Keep architecture docs aligned with actual scripts, checks, and package topology.
- Point to machine-checked source files when possible.
- Keep docs operational and repository-specific.

## Do not

- Do not overpromise behaviors the repository does not prove.
- Do not let architecture docs drift away from catalog, ADR, or CI behavior.
- Do not duplicate governed source files with conflicting prose.

## Update together with

- `README.md`
- `CONTRIBUTING.md`
- `tools/governance/catalog/**/*`
