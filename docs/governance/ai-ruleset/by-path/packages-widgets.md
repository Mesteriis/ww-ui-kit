---
id: ai-path-packages-widgets
title: packages/widgets path rules
apply: by file patterns
patterns: packages/widgets/**/*
---

Use this rule when editing reusable black-box composition surfaces.

## Do

- Keep widgets above core and systems.
- Compose system packages instead of reimplementing their engines.
- Keep widget shells, state framing, and reusable business block composition here.

## Do not

- Do not add routing, backend orchestration, or app-only state here.
- Do not turn widgets into domain-specific route features.
- Do not duplicate system logic such as table engines or graph runtimes here.

## Update together with

- `packages/widgets/README.md`
- `tools/governance/catalog/public-surface-manifest.mjs`
