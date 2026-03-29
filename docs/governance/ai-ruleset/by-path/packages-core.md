---
id: ai-path-packages-core
title: packages/core path rules
apply: by file patterns
patterns: packages/core/**/*
---
Use this rule when editing styled reusable components.

## Do

- Keep core as the reusable styled component layer above primitives and below systems.
- Update stories, docs, and manifest entries for public component contract changes.
- Use tokens, themes, and primitives for styling and runtime behavior.

## Do not

- Do not import systems, widgets, page templates, or apps into core.
- Do not leak vendor-backed APIs through core.
- Do not add route, backend, or domain orchestration here.

## Update together with

- `tools/governance/catalog/public-surface-manifest.mjs`
- `apps/docs/**/*`
