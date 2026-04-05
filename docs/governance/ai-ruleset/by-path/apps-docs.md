---
id: ai-path-apps-docs
title: apps/docs path rules
apply: by file patterns
patterns: apps/docs/**/*
---

Use this rule when editing the Storybook docs app.

## Do

- Keep Storybook as the source of truth for public UI states and variants.
- Resolve workspace `@ww/*` packages through the sanctioned source-first alias contract, not package `dist/`.
- Keep stories aligned with manifest-required coverage.
- Keep docs app content reusable and package-oriented rather than product-specific.
- Keep docs links and references aligned with the governed playground lab contract when maintainers need a workbench handoff.

## Do not

- Do not move public UI proof out of Storybook into prose-only docs.
- Do not make Storybook depend on workspace package `dist/` output for runtime proof.
- Do not use docs stories as a substitute for playground composition proof.
- Do not use docs pages as an ad hoc replacement for the component lab.
- Do not add product routing or backend logic here.

## Update together with

- `tools/governance/catalog/storybook-requirements.mjs`
- `tools/governance/catalog/public-surface-manifest.mjs`
- `vite.aliases.ts`
- `apps/docs/tsconfig.json`
- `tools/governance/checks/check-app-source-first-resolution.mjs`
