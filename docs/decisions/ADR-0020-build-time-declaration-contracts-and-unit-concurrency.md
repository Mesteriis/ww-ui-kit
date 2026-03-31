---
id: ADR-0020
title: Build Time Declaration Contracts And Unit Concurrency
status: accepted
date: 2026-03-31
owners:
  - platform
tags:
  - governance
  - tooling
  - testing
relatedPackages:
  - @ww/themes
  - @ww/core
  - @ww/data-grid
  - @ww/page-templates
  - @ww/signal-graph
  - @ww/charts-apex
  - @ww/widgets
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0020 Build Time Declaration Contracts And Unit Concurrency

## Context

Two operational weaknesses were discovered in the repository quality gates:

- library declaration generation was allowed to resolve sibling workspace packages through `src` paths during build, which leaked internal source-relative imports such as `../../../../primitives/src/index.ts` into published `dist/*.d.ts`
- `vite-plugin-dts` surfaced those diagnostics but did not make the recursive root build fail, so the build contour could report success while package declaration contracts were already broken
- the default multi-project Vitest run was occasionally unstable under aggressive worker concurrency even though the same suite passed consistently with a lower worker count

These were not cosmetic issues. They directly affected the supported public package surface and the determinism of the default quality gate.

## Decision

The repository now standardizes on the following rules:

1. Packages that depend on other workspace libraries must keep a dedicated `tsconfig.build.json` for declaration generation and build-time typechecking.
2. Build-only tsconfigs must resolve workspace dependencies through built declaration outputs in `dist`, not sibling `src` entrypoints.
3. Build-only tsconfigs must not inherit project references that pull external package source trees into the current package declaration program.
4. Package `build` scripts for governed libraries must run an explicit `typecheck:build` step before `vite build` so declaration-contract failures stop the build immediately.
5. `vite-plugin-dts` must use the build-only tsconfig rather than the development tsconfig.
6. Root `test:unit` and coverage runs cap Vitest worker concurrency at `4` to keep the default multi-project suite deterministic.

Development typecheck remains source-oriented and package-local. Build typecheck is a separate contract whose job is to prove that emitted declarations stay inside sanctioned public package boundaries.

## Consequences

- Published declaration output now tracks package export contracts instead of bleeding internal workspace source paths.
- Recursive root builds fail early when declaration generation is inconsistent with the supported package surface.
- Development ergonomics stay intact because the normal package tsconfigs still point at sibling source during authoring.
- Unit test wall-clock time stays reasonable, but the default root run gives up some peak parallelism in exchange for repeatability.

## Alternatives

### Keep one tsconfig per package for both authoring and declaration generation

Rejected because source-oriented path aliases are convenient in development but unsafe for emitted library declarations.

### Trust `vite-plugin-dts` diagnostics without an explicit build typecheck

Rejected because the previous behavior allowed broken declaration output to coexist with a successful root build.

### Force fully serial unit tests

Rejected because it fixes flakiness but throws away more throughput than necessary. A capped worker model preserved deterministic behavior in local verification.

## Migration / Rollout

1. Add `tsconfig.build.json` to every governed package that imports other workspace libraries.
2. Move declaration generation for those packages onto build-only dist-based path resolution.
3. Add `typecheck:build` scripts and make package `build` depend on them.
4. Cap root Vitest worker concurrency for unit and coverage runs.
5. Keep monitoring declaration output so new packages follow the same split-contract pattern.

## Related artifacts

- `package.json`
- `packages/themes/tsconfig.build.json`
- `packages/core/tsconfig.build.json`
- `packages/data-grid/tsconfig.build.json`
- `packages/page-templates/tsconfig.build.json`
- `packages/signal-graph/tsconfig.build.json`
- `packages/third-party/charts-apex/tsconfig.build.json`
- `packages/widgets/tsconfig.build.json`
- `packages/*/vite.config.ts`
- `packages/*/package.json`
- `packages/third-party/charts-apex/package.json`
