---
id: ADR-0011
title: Platform Governance And Public API Discipline
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - governance
  - catalog
  - public-api
relatedPackages:
  - @ww/tokens
  - @ww/themes
  - @ww/primitives
  - @ww/core
  - @ww/widgets
  - @ww/page-templates
supersedes: []
supersededBy: []
---

# ADR-0011 Platform Governance And Public API Discipline

## Context

The repository already had rich architecture, but the rules lived mostly in prose and reviewer memory. That was not enough to keep layer placement, public exports, and coverage discipline executable.

## Decision

Introduce a machine-checked governance layer.

- package classification and layer rules live under `tools/governance/catalog/*`
- public surfaces are declared in `public-surface-manifest.mjs`
- `check:catalog` audits named runtime exports from public package root entrypoints against manifest coverage
- `check:stories` treats Storybook coverage as mandatory for public visual surfaces
- `check:stories` also audits manifest-declared Storybook invariants against the story artifacts attached to each public surface
- stability status is mandatory for every public surface
- docs, Storybook, and playground coverage are checked against the manifest
- layer boundaries, topology, and public import hygiene are checked in CI
- ADR enforcement still applies to architecture-sensitive manifest changes, but pure dependency-range bumps inside `package.json` dependency fields do not require a matching ADR edit

## Consequences

- Public API changes become explicit and reviewable.
- Public root entrypoints cannot grow named runtime exports without an explicit manifest decision.
- Public visual surfaces cannot drift outside Storybook without an explicit governance failure.
- Storybook proof becomes more precise because behavior-level invariants are declared and checked instead of inferred informally.
- Layer violations fail CI instead of relying on reviewer memory.
- New contributors and AI agents have one operational source of truth instead of scattered prose.

## Alternatives

- Keeping governance only in README would continue to allow drift.
- Ad hoc lint rules without a central catalog would duplicate knowledge across scripts and docs.
- Treating every exported symbol as implicitly stable would create dishonest public contracts.

## Migration / Rollout

- Existing public packages were classified and documented.
- Vendor-backed adapters were audited against topology rules.
- CI now runs governance checks alongside lint, typecheck, tests, and builds.

## Related artifacts

- [`tools/governance/catalog`](../../tools/governance/catalog)
- [`tools/governance/checks`](../../tools/governance/checks)
- [`docs/architecture/public-api-discipline.md`](../architecture/public-api-discipline.md)
