---
id: ai-manual-playground-lab-maintenance
title: Playground lab taxonomy and schema maintenance
apply: manually
---

Use this rule only for deliberate component-lab audits, taxonomy reshuffles, or bulk migrations.

## Do

- Audit lab eligibility, family grouping, schema coverage, copy serializers, and usage data together.
- Reshuffle lab taxonomy only when it clarifies maintainer workflow and the governed manifest changes with it.
- Regenerate usage artifacts and rerun `check:playground-lab` after mass edits.

## Do not

- Do not migrate surfaces into or out of the lab without updating governance docs and ADR coverage when the workflow changes.
- Do not leave orphan schemas, stale preview files, or stale usage artifacts after a lab audit.
- Do not treat temporary experiments as permanent lab taxonomy.

## Related repo sources of truth

- `tools/governance/catalog/playground-lab-manifest.mjs`
- `tools/governance/playground-lab/**/*`
- `apps/playground/src/lab/**/*`
