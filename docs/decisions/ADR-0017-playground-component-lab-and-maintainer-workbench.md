---
id: ADR-0017
title: Playground Component Lab And Maintainer Workbench
status: accepted
date: 2026-03-30
owners:
  - platform
tags:
  - playground
  - governance
  - testing
relatedPackages:
  - @ww/playground
supersedes: []
supersededBy: []
---

# ADR-0017 Playground Component Lab And Maintainer Workbench

## Context

Playground already served as the browser-tested consumer harness for real multi-package composition. Maintainers still needed a faster manual surface for styling review, prop tuning, subtree-theme checks, and downstream usage inspection. Ad hoc showcase pages would have duplicated Storybook states, drifted away from governance, and weakened the testing contract.

## Decision

Keep one playground app with two explicit roles:

1. `/testing/*` remains the stable integration harness for browser-tested composed scenarios.
2. `/lab/*` becomes a maintainer-facing component lab and styling workbench.

Supporting decisions:

- Storybook remains the canonical source of truth for public UI states and documented variants.
- Playground lab entries are governed by a canonical adjacent manifest at `tools/governance/catalog/playground-lab-manifest.mjs`.
- Lab entries use curated typed schemas, preview components, preview modes, copy serializers, and generated downstream usage data instead of unstable runtime prop introspection.
- Generated usage data comes from repository import scanning plus manifest-linked Storybook, docs, and harness references.
- CI enforces lab coverage through `check:playground-lab`.

## Consequences

- Maintainers get one workbench for prop/state tuning, variant matrix review, copyable config output, and dependency visibility.
- Stable `/testing/*` routes stay available for Playwright and consumer-proof browser verification.
- Public visual surface changes now require an explicit lab-eligibility decision instead of ad hoc playground pages.
- Governance becomes stricter because lab manifest coverage, runtime files, usage data, and serializers are checked automatically.
- New core waves extend the same governed split instead of introducing parallel showcase routes or second documentation runtimes.

## Alternatives

- Turning playground into a second Storybook would duplicate the public state contract and reduce composition value.
- Keeping only ad hoc showcase pages would hide drift and make coverage rules weaker.
- Trying to auto-generate every control from Vue runtime metadata would be unstable and too opaque for maintainers.

## Migration / Rollout

- Move playground runtime into explicit `lab/` and `testing/` areas.
- Add the lab manifest, schemas, preview runtime, and generated usage artifact builder.
- Preserve existing testing scenarios and selectors while routing them under the testing harness mode.
- Update docs, ADR index, AI rules, CI, and tests to treat the lab contract as governed repository behavior.

## Related artifacts

- [`apps/playground/src/lab`](../../apps/playground/src/lab)
- [`apps/playground/src/testing`](../../apps/playground/src/testing)
- [`tools/governance/catalog/playground-lab-manifest.mjs`](../../tools/governance/catalog/playground-lab-manifest.mjs)
- [`tools/governance/playground-lab/build-playground-lab-artifacts.mjs`](../../tools/governance/playground-lab/build-playground-lab-artifacts.mjs)
- [`tools/governance/checks/check-playground-lab.mjs`](../../tools/governance/checks/check-playground-lab.mjs)
- [`docs/architecture/testing-architecture.md`](../architecture/testing-architecture.md)
- [`docs/architecture/docs-as-contract.md`](../architecture/docs-as-contract.md)
