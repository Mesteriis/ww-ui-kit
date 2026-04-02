---
id: ADR-0021
title: Governed Performance Regression Gate
status: accepted
date: 2026-04-02
owners:
  - platform
tags:
  - testing
  - performance
  - governance
relatedPackages:
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0021 Governed Performance Regression Gate

## Context

The repository already has three primary test contours with distinct roles. That model needs to stay stable, but the repo also needs a governed way to catch build bloat and browser runtime regressions before they land in main.

Ad hoc thresholds inside Playwright specs, workflow yaml, or separate dashboards would create parallel truth systems and make perf regressions harder to audit. The repo needs one machine-readable source of truth for budgets, one canonical gate entrypoint, and CI artifacts that show what failed.

## Decision

Add a governed performance regression gate without changing the primary testing model.

- `pnpm test` keeps exactly three contours: unit, e2e, and playground.
- Performance becomes a separate top-level gate exposed through `pnpm check:perf`.
- The only supported source of truth for build and runtime budgets is `tools/governance/catalog/performance-requirements.mjs`.
- Build budgets are validated from real `@ww/playground` production output and track named manual chunks that already exist in `vite.chunking.ts`.
- Runtime budgets run against built `/playground/testing` flows in Chromium through Playwright, use warm-up runs plus measured runs, and decide with the median instead of an average.
- Runtime mount budgets are calibrated against the slower of the current local and GitHub Actions baselines, then rounded with modest headroom so the gate fails on regressions instead of runner noise.
- The perf gate writes a machine-readable summary artifact and is enforced in CI and `pnpm verify`.

The runtime suite reuses the existing built playground harness and server logic. Storybook remains the public UI contract, `/playground/testing/*` remains the browser-tested proof harness, and `/playground/lab/*` remains the maintainer workbench.

## Consequences

- The repo gains explicit build and runtime regression visibility without inventing a fourth contour.
- Threshold drift becomes auditable because budgets live in one governed catalog instead of hiding in tests or workflows.
- CI can upload a stable summary artifact for perf decisions and optional debug traces on failure.
- Perf coverage stays intentionally narrow and stable because it rides on governed playground scenarios instead of a parallel benchmark app.

## Alternatives

- Adding perf as a fourth primary contour would blur the existing testing model and make `pnpm test` less intentional.
- Using Lighthouse or an external perf stack would introduce a second source of truth and a separate harness with different contracts.
- Keeping thresholds only inside Playwright specs or workflow yaml would make governance weaker and harder to review.

## Migration / Rollout

- Add the canonical perf catalog with build and runtime budgets.
- Add a Playwright runtime perf suite against built playground output and emit a machine-readable runtime summary.
- Add `check:perf` as the canonical gate entrypoint and wire it into CI and `pnpm verify`.
- Keep future perf scope additions tied to governed playground scenarios and manual chunk names instead of introducing a parallel perf system.

## Related artifacts

- [`tools/governance/catalog/performance-requirements.mjs`](../../tools/governance/catalog/performance-requirements.mjs)
- [`tools/governance/checks/check-perf.mjs`](../../tools/governance/checks/check-perf.mjs)
- [`tests/perf`](../../tests/perf)
- [`docs/architecture/testing-architecture.md`](../architecture/testing-architecture.md)
- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
