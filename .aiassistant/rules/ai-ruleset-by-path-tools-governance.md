---
id: ai-path-tools-governance
title: tools/governance path rules
apply: by file patterns
patterns: tools/governance/**/*
---
Use this rule when editing governance automation.

## Do

- Keep one source of truth for each catalog or check.
- Reuse the existing governance stack instead of creating a parallel automation path.
- Keep checks deterministic and repository-specific.

## Do not

- Do not create duplicate manifests or duplicate validators for the same contract.
- Do not add governance scripts without wiring them into docs and package scripts when they are part of the operational path.
- Do not let tooling names drift away from the actual files they validate.

## Update together with

- `package.json`
- `README.md`
- `CONTRIBUTING.md`
