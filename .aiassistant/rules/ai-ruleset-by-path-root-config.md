---
id: ai-path-root-config
title: root config path rules
apply: by file patterns
patterns:
  - package.json
  - pnpm-workspace.yaml
  - .changeset/config.json
  - .node-version
  - .npmrc
  - *.config.*
  - tsconfig*.json
  - vite.aliases.ts
  - vitest.config.ts
---

Use this rule when editing repository-wide toolchain and configuration files.

## Do

- Treat root config changes as architecture-sensitive when they alter build, test, release, formatting, or workspace behavior.
- Keep root config aligned with package scripts, CI workflows, and the documented toolchain baseline.
- Update README, CONTRIBUTING, governance checks, and ADRs when a config change alters contributor or automation behavior.
- Prefer one governed root contract over package-local drift for shared tooling.

## Do not

- Do not introduce ad hoc tooling behavior that bypasses the documented root scripts and checks.
- Do not widen support claims, release behavior, or workspace topology through config-only drift.
- Do not change root config semantics without updating the checks and docs that rely on them.

## Update together with

- `README.md`
- `CONTRIBUTING.md`
- `.github/workflows/**/*`
- `docs/decisions/**/*` when repository behavior changes
