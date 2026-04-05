---
id: ADR-0038
title: Source First App Package Resolution
status: accepted
date: 2026-04-05
owners:
  - platform
tags:
  - governance
  - docs
  - playground
  - tooling
relatedPackages:
  - @ww/docs
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0038 Source First App Package Resolution

## Context

The repository uses `dist/` as a publish and build artifact, but the docs app, Storybook builder, and playground runtime must reflect workspace changes immediately during maintainer work. If those apps resolve `@ww/*` through package build output, local editing becomes stale, broken contracts can hide behind outdated artifacts, and browser proof stops matching the code that maintainers are changing.

The previous setup already had a shared `vite.aliases.ts` contract and source-oriented TypeScript paths in the apps, but Storybook did not consistently enforce those aliases and some app type paths still fell back to package resolution.

## Decision

Repository apps that exist to document, prove, or manually inspect workspace UI must resolve workspace packages from source, not from package `dist/` output.

This applies to:

1. `apps/docs` Storybook runtime and build.
2. `apps/playground` testing routes.
3. `apps/playground` lab runtime.

Supporting decisions:

- Vite-based app runtimes use the shared `workspaceAliases` contract from [`vite.aliases.ts`](../../vite.aliases.ts).
- App TypeScript configs map `@ww/*` package specifiers to package `src/index.ts` entrypoints for workspace authoring.
- Sanctioned package stylesheet entrypoints also resolve to source CSS through the shared alias contract.
- Root maintainer workflows for docs and playground no longer prebuild workspace package dependencies as a prerequisite for local app execution.
- Lint and governance checks reject workspace `dist/` imports inside app authoring paths and fail CI when docs/playground runtime configs drift away from the shared source-first alias contract.
- Publish-time library output, declaration generation, and package exports remain `dist/` based. This decision affects app/runtime authoring only, not release artifacts.
- CI enforces the source-first contract through governance checks.

## Consequences

- Storybook, playground testing routes, and lab surfaces reflect package edits immediately.
- Maintainers no longer need to wonder whether they are seeing live source or stale build output.
- App config drift becomes an architectural regression instead of a local convenience.
- Build output remains important for release and package validation, but it is no longer the source of truth for governed workspace apps.

## Alternatives

### Keep apps on package `dist/` output

Rejected because it hides live changes, makes browser proof stale, and turns generated artifacts into the wrong source of truth during maintainer work.

### Let each app define its own alias scheme

Rejected because it creates drift between docs, playground, tests, and future app runtimes.

### Resolve everything from source, including package publish output

Rejected because package exports, declaration generation, and release artifacts still need explicit build-time output contracts.

## Migration / Rollout

1. Make Storybook use the shared workspace alias contract.
2. Keep docs and playground TypeScript paths aligned with source entrypoints.
3. Remove local docs/playground workflow steps that prebuild dependency packages only to satisfy app resolution.
4. Add lint and governance checks that fail when app runtime configs or source imports regress toward `dist/`.

## Related artifacts

- [`apps/docs/.storybook/main.ts`](../../apps/docs/.storybook/main.ts)
- [`apps/docs/tsconfig.json`](../../apps/docs/tsconfig.json)
- [`apps/playground/vite.config.ts`](../../apps/playground/vite.config.ts)
- [`apps/playground/vitest.config.ts`](../../apps/playground/vitest.config.ts)
- [`apps/playground/tsconfig.json`](../../apps/playground/tsconfig.json)
- [`vite.aliases.ts`](../../vite.aliases.ts)
- [`package.json`](../../package.json)
- [`tools/governance/checks/check-app-source-first-resolution.mjs`](../../tools/governance/checks/check-app-source-first-resolution.mjs)
- [`docs/governance/ai-ruleset/by-path/apps-docs.md`](../governance/ai-ruleset/by-path/apps-docs.md)
- [`docs/governance/ai-ruleset/by-path/apps-playground.md`](../governance/ai-ruleset/by-path/apps-playground.md)
