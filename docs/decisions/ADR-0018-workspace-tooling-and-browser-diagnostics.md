---
id: ADR-0018
title: Workspace Tooling And Browser Diagnostics
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - governance
  - tooling
  - testing
relatedPackages:
  - @ww/primitives
  - @ww/docs
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0018 Workspace Tooling And Browser Diagnostics

## Context

The repository had several low-risk operational gaps:

- root `build`, `typecheck`, and `dev:docs` scripts were hand-maintained package chains
- browser tests always retained traces even though local retries were disabled
- there was no browser-level axe safety net in the Playwright contours
- formatting was enforced only indirectly through ESLint
- CI ran every gate in one long sequential job even though most steps were independent
- the Node `24.x` baseline existed in `.node-version` and `engines`, but contributor guidance did not explain that CI validates only that range
- local root workflows still started on unsupported Node versions and only surfaced the mismatch as noisy downstream warnings
- `@ww/primitives/useId()` used a mutable global counter even though Vue 3.5 provides SSR-safe ids

These issues were current, low-risk, and worth fixing immediately without changing the layer model or weakening governance.

## Decision

The repository now standardizes on the following operational model:

1. Root workspace orchestration uses pnpm recursive, topology-aware execution instead of hard-coded package chains where the workspace graph already captures order.
2. `@ww/primitives/useId()` delegates to Vue 3.5 `useId()` and preserves optional prefix support through the existing computed return shape.
3. Storybook and playground Playwright configs use `retries=0` locally, CI retries, and `trace: on-first-retry`.
4. Curated browser-level axe checks run against load-bearing Storybook and playground flows.
5. Prettier is the repository formatter, with explicit `format` and `format:check` commands.
6. CI is split into parallel jobs for governance, quality, unit, coverage, browser tests, and builds, with a final `verify` aggregate job keeping the required-check surface understandable.
7. Contributor docs and troubleshooting explicitly state that Node `24.x` is the only validated baseline.
8. Root pnpm workflows and `pnpm install` fail fast through a shared Node-version check instead of emitting only passive engine warnings.
9. Playground and Storybook builds split heavy vendor/runtime chunks and scope chunk-size warnings to known infra-heavy baselines so new app-level regressions remain visible.

## Consequences

- Adding new workspace packages no longer requires editing long root build or typecheck chains.
- Browser test diagnostics are more useful in CI and less noisy on passing runs.
- Accessibility regressions have an additional browser-level safety net without turning the repo into a blanket axe crawl.
- Formatting expectations are explicit and reproducible.
- CI is easier to reason about and faster in wall-clock time without dropping gates.
- Unsupported local Node runtimes stop immediately instead of wasting cycles on misleading follow-on failures.
- Playground and Storybook builds keep large, intentional vendor chunks isolated so warning noise is lower and real bundle regressions are easier to spot.
- Public `useId()` consumers get SSR-safe ids without changing import paths or prefix semantics.

## Alternatives

### Keep the manual root package chains

Rejected because the workspace already declares dependency order and recursive orchestration is simpler to maintain.

### Add a heavier task runner

Rejected because pnpm recursive execution is already sufficient for this repository size and topology.

### Keep always-on Playwright traces

Rejected because it creates larger artifacts without improving passing-run diagnostics.

### Keep the global `useId()` counter

Rejected because Vue 3.5 provides an instance-aware solution with a cleaner SSR and hydration story.

## Migration / Rollout

1. Replace root manual orchestration scripts with recursive pnpm commands.
2. Simplify per-package `typecheck` scripts so recursive typecheck stays fast and deterministic.
3. Introduce Prettier config, scripts, and CI checks.
4. Add curated axe checks to Storybook and playground Playwright suites.
5. Split CI into parallel jobs and keep a final aggregate `verify` job.
6. Update README, CONTRIBUTING, troubleshooting guidance, and AI rules.
7. Record the public `useId()` fix through a changeset for `@ww/primitives`.
8. Add a shared Node-version guard to root workflows and tune app build chunking where vendor-heavy bundles are intentional.

## Related artifacts

- `package.json`
- `.node-version`
- `scripts/check-node-version.mjs`
- `.github/workflows/ci.yml`
- `apps/docs/.storybook/main.ts`
- `apps/playground/vite.config.ts`
- `vite.chunking.ts`
- `packages/primitives/src/composables/useId.ts`
- `tests/e2e/playwright.storybook.config.ts`
- `tests/playground/playwright.playground.config.ts`
- `tests/shared/a11y.ts`
- `TROUBLESHOOTING.md`
