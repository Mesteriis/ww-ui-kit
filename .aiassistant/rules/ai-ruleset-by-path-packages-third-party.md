---
id: ai-path-packages-third-party
title: packages/third-party path rules
apply: by file patterns
patterns: packages/third-party/**/*
---
Use this rule when editing vendor-backed adapters.

## Do

- Keep packages here honest about their vendor-backed boundary.
- Keep adapters out of `@ww/core`.
- Keep README, docs, and manifest entries explicit about the vendor relationship.

## Do not

- Do not move feature-first systems here just because they use a library internally.
- Do not hide a vendor-backed package inside a generic-sounding layer.
- Do not let adapter-specific APIs leak through unrelated packages.

## Update together with

- `docs/architecture/package-topology.md`
- `docs/decisions/ADR-0014-third-party-topology.md`
