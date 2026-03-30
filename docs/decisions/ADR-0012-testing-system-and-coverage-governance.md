---
id: ADR-0012
title: Testing System And Coverage Governance
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - testing
  - coverage
relatedPackages:
  - @ww/docs
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0012 Testing System And Coverage Governance

## Context

The repository had strong unit testing, but operational proof still depended too heavily on local manual review. Storybook, docs, and playground also needed coverage discipline tied to the public API catalog.

## Decision

Use exactly three primary test contours:

1. unit tests via Vitest
2. e2e tests against built Storybook via Playwright
3. playground tests against built playground via Playwright

Root `pnpm test` runs all three. Coverage checks for stories, docs, and playground scenarios are enforced separately through governance scripts.

Later maintainer workbench additions to playground must preserve these contours and keep the testing harness routes stable instead of replacing them.

When the repository keeps a strict global statement/branch/function threshold, any coverage exclusions must stay explicit, file-scoped, and adjacent to the canonical root coverage command. Those exclusions are allowed only for browser-proven files whose interaction contract is already exercised through Storybook or playground/browser tests and where jsdom/istanbul instrumentation would otherwise produce noisy structural gaps.

## Consequences

- Fast logic tests remain separate from real browser proofs.
- Storybook becomes executable documentation, not just a visual reference.
- Playground becomes a consumer-proof harness instead of a loose sandbox.
- Coverage exclusions remain auditable because they are explicit and narrowly listed instead of being hidden behind broad globs or reduced thresholds.

## Alternatives

- Keeping only unit tests would not prove real browser behavior or multi-package composition.
- Using Storybook stories as the only proof harness would miss consumer-like composition.
- Mixing all browser flows into unit tests would slow feedback and weaken signal quality.

## Migration / Rollout

- Add Playwright configs and tests for Storybook and playground.
- Add scenario ids and stable selectors to playground.
- Keep unit tests focused on deterministic runtime logic and jsdom component contracts.

## Related artifacts

- [`docs/architecture/testing-architecture.md`](../architecture/testing-architecture.md)
- [`tests/e2e`](../../tests/e2e)
- [`tests/playground`](../../tests/playground)
