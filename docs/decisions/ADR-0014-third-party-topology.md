---
id: ADR-0014
title: Third Party Topology
status: accepted
date: 2026-03-29
owners:
  - platform
tags:
  - topology
  - third-party
relatedPackages:
  - @ww/charts-apex
  - @ww/signal-graph
supersedes: []
supersededBy: []
---

# ADR-0014 Third Party Topology

## Context

The repository contains both feature-first systems packages and vendor-backed adapters. Without a physical topology policy, package placement could become arbitrary and hide where vendor-specific risk actually lives.

## Decision

Introduce `packages/third-party/*` for vendor-backed adapters whose public contract is intentionally honest about the vendor.

Current application:

- move `@ww/charts-apex` to `packages/third-party/charts-apex`
- keep `@ww/signal-graph` outside `third-party` because its public API is feature-first and Vue Flow remains internal

## Consequences

- Thin vendor adapters are grouped honestly.
- Feature-first systems keep their product-level semantics instead of being flattened into “just another wrapper”.
- Package topology communicates risk and intent without changing public npm names.

## Alternatives

- Keeping all packages under one flat `packages/*` tree would hide the difference between feature-first systems and vendor-backed adapters.
- Moving every package that uses a library into `third-party` would be misleading and too broad.
- Encoding topology only in docs without a CI check would drift over time.

## Migration / Rollout

- Move vendor-backed adapter packages when they fit the policy.
- Keep package names stable when physical paths move.
- Update aliases, workspace config, tests, and docs alongside any move.

## Related artifacts

- [`docs/architecture/package-topology.md`](../architecture/package-topology.md)
- [`tools/governance/checks/check-package-topology.mjs`](../../tools/governance/checks/check-package-topology.mjs)
- [`packages/third-party/charts-apex`](../../packages/third-party/charts-apex)

